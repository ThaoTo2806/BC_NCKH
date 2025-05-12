const degreeService = require("../services/degreeService");
const multer = require("multer");
const DegreeService = require("../services/degreeService");
const db = require("../config/connectToDB");
const crypto = require("crypto");
const Degree = require("../models/degree");
const pool = require("../config/database_pool");
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });
const QRCode = require("qrcode");
const jwt = require("jsonwebtoken");
// async function loadIPFS() {
//     const { uploadToIPFS } = await import("../config/ipfs");
//     return uploadToIPFS;
// }

// let uploadToIPFS;
// loadIPFS().then((module) => (uploadToIPFS = module));
const { uploadToIPFS } = require("../config/ipfs");

exports.upload = upload.fields([
    { name: "frontImage", maxCount: 1 },
    { name: "backImage", maxCount: 1 },
]);

function generateHash(data) {
    return crypto.createHash("sha256").update(data).digest("hex");
}

exports.getDegrees = async (req, res) => {
    try {
        const { status, start_date, end_date, date } = req.query;
        const data = await degreeService.getDegrees({
            status,
            start_date,
            end_date,
            date,
        });
        console.log(data);
        return res.status(200).json(data);
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};

exports.getDegreeDetail = async (req, res) => {
    try {
        const { id } = req.params;
        const result = await degreeService.getDegreeDetail(id);

        if (!result.success) {
            return res.status(404).json(result);
        }

        return res.status(200).json(result);
    } catch (error) {
        console.error("Lỗi tại getDegreeDetail:", error);
        return res.status(500).json({ success: false, message: "Lỗi server" });
    }
};

exports.createDegree = async (req, res) => {
    console.log("Request files:", req.files);
    console.log("Request body:", req.body);
    const connection = await pool.getConnection();

    try {
        await connection.beginTransaction();

        const {
            user_id,
            major_id,
            degree_name,
            degree_type,
            graduation_year,
            hash_qrcode,
            gpa,
            verification_code,
            batch_approval,
        } = req.body;
        const frontImage = req.files?.frontImage?.[0]?.buffer;
        const backImage = req.files?.backImage?.[0]?.buffer;

        if (!user_id || !degree_name) {
            return res.status(400).json({
                success: false,
                message: "Thiếu thông tin người dùng hoặc tên bằng cấp",
            });
        }

        if (!frontImage || !backImage) {
            return res.status(400).json({
                success: false,
                message: "Thiếu ảnh mặt trước hoặc mặt sau của bằng",
            });
        }

        const result = await simpleSaveWithImages(
            user_id,
            major_id || 1,
            degree_name,
            degree_type || 1,
            graduation_year || new Date().getFullYear().toString(),
            gpa || "0.0",
            hash_qrcode,
            frontImage,
            backImage,
            verification_code,
            batch_approval === "true" || batch_approval === true,
            connection
        );
        const degreeId = result.insertId; // Lưu ID của bằng cấp

        await connection.commit();

        if (!(batch_approval === "true" || batch_approval === true)) {
            try {
                const approver = req.user;
                const response = await DegreeService.approveDegreeLevel1(
                    degreeId,
                    approver,
                    connection
                );

                res.status(201).json({
                    success: true,
                    message: "Tạo bằng cấp thành công",
                    degreeId: degreeId,
                    verificationCode: result.verificationCode,
                    response: response,
                });
            } catch (blockchainError) {
                console.error(
                    "Lỗi khi lưu vào blockchain, xóa bằng cấp:",
                    blockchainError
                );

                await connection.beginTransaction();
                await connection.query("DELETE FROM degrees WHERE id = ?", [
                    degreeId,
                ]);
                await connection.commit();

                res.status(500).json({
                    success: false,
                    message:
                        "Lưu blockchain thất bại, bằng cấp đã bị xóa khỏi hệ thống",
                });
            }
        } else {
            res.status(201).json({
                success: true,
                message:
                    "Tạo bằng cấp thành công và đã thêm vào danh sách chờ duyệt",
                degreeId: degreeId,
                verificationCode: result.verificationCode,
                batchApproval: true,
            });
        }
    } catch (error) {
        await connection.rollback();
        console.error("Lỗi khi tạo bằng cấp:", error);
        res.status(500).json({
            success: false,
            message: error.message || "Lỗi server",
        });
    } finally {
        connection.release();
    }
};

async function simpleSaveWithImages(
    user_id,
    major_id,
    degree_name,
    degree_type,
    graduation_year,
    gpa,
    hash_qrcode,
    frontImage,
    backImage,
    verification_code = null,
    batch_approval = false,
    connection
) {
    console.log("<<< check image buffer >>>", frontImage, backImage);

    const finalVerificationCode =
        verification_code ||
        crypto.randomBytes(3).toString("hex").toUpperCase();

    let frontCID, backCID;

    try {
        if (frontImage) frontCID = await uploadToIPFS(frontImage);
        if (backImage) backCID = await uploadToIPFS(backImage);

        console.log("Front Image CID:", frontCID);
        console.log("Back Image CID:", backCID);
    } catch (error) {
        throw new Error("Lỗi khi tải ảnh lên IPFS: " + error.message);
    }

    const hash = generateHash(hash_qrcode);

    try {
        const sql = `
            INSERT INTO degrees 
            (user_id, major_id, degree_name, degree_type, graduation_year, gpa, hash_qrcode,
             degree_image_front, degree_image_back, blockchain_hash, verification_code, status, batch_approval) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'pending', ?)
        `;

        const batchApprovalValue = batch_approval ? 1 : 0;

        const [results] = await connection.query(sql, [
            user_id,
            major_id,
            degree_name,
            degree_type,
            graduation_year,
            gpa,
            hash,
            frontCID.cid,
            backCID.cid,
            hash_qrcode,
            finalVerificationCode,
            batchApprovalValue,
        ]);

        return {
            insertId: results.insertId,
            frontCID,
            backCID,
            hash_qrcode: hash,
            verificationCode: finalVerificationCode,
        };
    } catch (error) {
        console.error("Lỗi khi lưu dữ liệu:", error);
        throw new Error(`Lỗi khi lưu dữ liệu: ${error.message}`);
    }
}

exports.UpdateDegree = async (req, res) => {
    try {
        const { status } = req.query;
        const { id } = req.params;

        if (!status) {
            return res.status.json({
                success: false,
                message: "Trạng thái không được để trống",
            });
        }

        const result = await DegreeService.UpdateDegree(status, id);

        if (!result.success) {
            return res.status(404).json(result);
        }

        return res.status(200).json(result);
    } catch (error) {
        console.error("Lỗi khi cập nhật bằng cấp:", error);
        return res.status(500).json({ success: false, message: "Lỗi server" });
    }
};

exports.UpdateDegreeQueryTime = async (req, res) => {
    try {
        const { timeQuery } = req.query;
        const { id } = req.params;

        const now = new Date();
        now.setHours(now.getHours() + 7); // Add 7 hours for Vietnam timezone
        const vietnamDateTime = now
            .toISOString()
            .slice(0, 19)
            .replace("T", " ");

        const result = await DegreeService.UpdateDegreeQueryTime(
            vietnamDateTime,
            id
        );

        if (!result.success) {
            return res.status(404).json(result);
        }

        return res.status(200).json(result);
    } catch (error) {
        console.error(
            "Lỗi khi cập nhật bằng cấp thời gian không hợp lẹ:",
            error
        );
        return res.status(500).json({ success: false, message: "Lỗi server" });
    }
};

// Duyệt bằng cấp
exports.approveDegreeLevel2 = async (req, res) => {
    try {
        const { degreeId } = req.params;

        // Cập nhật trạng thái trong cơ sở dữ liệu
        const approver = req.user;

        const response = await DegreeService.approveDegreeLevel2(
            degreeId,
            approver
        );

        // Lấy thông tin bằng cấp
        const degree = await Degree.getDegreeById(degreeId);
        if (!degree) {
            return res
                .status(404)
                .json({ success: false, message: "Không tìm thấy bằng cấp" });
        }

        res.status(200).json({
            success: true,
            message: "Bằng cấp đã được duyệt và ghi nhận trên blockchain",
            blockchainData: response,
        });
    } catch (error) {
        console.error("Lỗi khi duyệt bằng cấp:", error);
        res.status(500).json({
            success: false,
            message: "Lỗi server",
            error: error.message,
        });
    }
};

// Lấy danh sách bằng cấp đang chờ duyệt
exports.getPendingDegrees = async (req, res) => {
    try {
        const degrees = await DegreeService.getPendingDegrees();
        res.status(200).json({ success: true, degrees });
    } catch (error) {
        console.error("Lỗi khi lấy danh sách bằng cấp đang chờ duyệt:", error);
        res.status(500).json({ success: false, message: "Lỗi server" });
    }
};

const SECRET_KEY = process.env.JWT_SECRET;
exports.generateDegreeQRCode = async (req, res) => {
    try {
        const { id } = req.params;
        const expiresAt = new Date(Date.now() + 30 * 60 * 1000); // 30 phút

        // Tạo JWT chứa dữ liệu
        const token = jwt.sign({ id, expiresAt }, SECRET_KEY, { algorithm: "HS256" });

        // Lưu vào MySQL
        const connection = await pool.getConnection();
        await connection.execute(
            "INSERT INTO qr_codes (degree_id, token, expires_at, used) VALUES (?, ?, ?, ?)",
            [id, token, expiresAt, false]
        );
        connection.release();

        // Tạo URL chứa JWT
        const degreeUrl = `http://localhost:3001/degrees/${id}?token=${token}`;

        // Tạo mã QR từ URL
        const qrCode = await QRCode.toDataURL(degreeUrl);

        return res.status(200).json({ success: true, qrCode });
    } catch (error) {
        console.error("Lỗi tại generateDegreeQRCode:", error);
        return res.status(500).json({ success: false, message: "Lỗi server" });
    }
};

//kèm hình ảnh vào mã QR
exports.generateDegreeQRCode1 = async (req, res) => {
    try {
        const { id } = req.params;
        const result = await degreeService.getDegreeDetail(id);

        if (!result.success) {
            return res
                .status(404)
                .json({ success: false, message: "Không tìm thấy bằng cấp" });
        }

        const degreeData = JSON.stringify(result.data); // Chuyển thông tin bằng cấp thành JSON

        // Tạo mã QR dưới dạng base64
        QRCode.toDataURL(degreeData, (err, qrCode) => {
            if (err) {
                console.error("Lỗi tạo mã QR:", err);
                return res
                    .status(500)
                    .json({ success: false, message: "Lỗi tạo mã QR" });
            }
            return res.status(200).json({ success: true, qrCode });
        });
    } catch (error) {
        console.error("Lỗi tại generateDegreeQRCode:", error);
        return res.status(500).json({ success: false, message: "Lỗi server" });
    }
};

// New endpoint to get pending batch approvals
exports.getPendingBatchApprovals = async (req, res) => {
    try {
        const degrees = await DegreeService.getPendingBatchApprovals();
        res.status(200).json({ success: true, degrees });
    } catch (error) {
        console.error(
            "Lỗi khi lấy danh sách bằng cấp chờ duyệt hàng loạt:",
            error
        );
        res.status(500).json({ success: false, message: "Lỗi server" });
    }
};

// Đảm bảo bảng logs tồn tại khi khởi động server
(async function initTables() {
    try {
        await DegreeService.ensureBatchLogsTableExists();
        console.log("Batch processing tables initialized successfully");
    } catch (error) {
        console.error("Failed to initialize batch processing tables:", error);
    }
})();

// New endpoint to approve batch of degrees
exports.approveBatchDegrees = async (req, res) => {
    try {
        const { degreeIds } = req.body;

        if (!degreeIds || !Array.isArray(degreeIds) || degreeIds.length === 0) {
            return res.status(400).json({
                success: false,
                message: "Cần cung cấp danh sách ID bằng cấp cần duyệt",
            });
        }

        const approver = req.user;

        // Tạo bản ghi summary mới
        const summaryResult = await db.query(
            "INSERT INTO batch_process_summary (total, approver_id) VALUES (?, ?)",
            [degreeIds.length, approver.id]
        );

        const batchId = summaryResult.insertId;

        // Tạo các bản ghi pending cho từng bằng cấp
        for (const degreeId of degreeIds) {
            await db.query(
                "INSERT INTO batch_process_logs (degree_id, status, message) VALUES (?, 'pending', ?)",
                [
                    degreeId,
                    JSON.stringify({
                        batchId,
                        timestamp: new Date(),
                        message: "Đang chờ xử lý",
                    }),
                ]
            );
        }

        // Bắt đầu quá trình xử lý bất đồng bộ
        DegreeService.approveBatchDegrees(degreeIds, approver);

        res.status(202).json({
            success: true,
            message:
                "Quá trình phê duyệt đã được bắt đầu. Vui lòng kiểm tra trạng thái sau.",
            batchId: batchId,
        });
    } catch (error) {
        console.error("Lỗi khi duyệt hàng loạt bằng cấp:", error);
        res.status(500).json({
            success: false,
            message: "Lỗi server",
            error: error.message,
        });
    }
};

// New endpoint to check batch processing status
exports.getBatchStatus = async (req, res) => {
    try {
        const { batchId } = req.params;

        // Lấy thông tin tổng quan về lô
        const [summaries] = await db.query(
            `SELECT * FROM batch_process_summary WHERE id = ?`,
            [batchId]
        );

        if (!summaries || summaries.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Không tìm thấy thông tin về lô xử lý",
            });
        }

        const summary = summaries[0];

        // Lấy thông tin chi tiết về từng bằng cấp
        const [logs] = await db.query(
            `SELECT b.id, b.degree_id, b.status, b.message, b.created_at, 
                    d.degree_name, u.common_name AS owner_name
             FROM batch_process_logs b
             JOIN degrees d ON b.degree_id = d.id
             JOIN users u ON d.user_id = u.id
             WHERE b.message LIKE CONCAT('%"batchId":', ?, '%')
             ORDER BY b.created_at DESC`,
            [batchId]
        );

        // Tính toán số lượng thành công và thất bại hiện tại
        const currentSuccess = logs.filter(
            (log) => log.status === "success"
        ).length;
        const currentFailed = logs.filter(
            (log) => log.status === "failed"
        ).length;
        const currentPending = logs.filter(
            (log) => log.status === "pending"
        ).length;

        // Xác định trạng thái hiện tại
        const isCompleted = summary.completed_at !== null;
        const progress =
            ((currentSuccess + currentFailed) / summary.total) * 100;

        res.status(200).json({
            success: true,
            batchId: parseInt(batchId),
            summary: {
                total: summary.total,
                successCount: currentSuccess,
                failedCount: currentFailed,
                pendingCount: currentPending,
                progress: Math.round(progress * 100) / 100, // Round to 2 decimal places
                isCompleted: isCompleted,
                startedAt: summary.started_at,
                completedAt: summary.completed_at,
            },
            details: logs,
        });
    } catch (error) {
        console.error("Lỗi khi lấy trạng thái xử lý lô:", error);
        res.status(500).json({
            success: false,
            message: "Lỗi server",
            error: error.message,
        });
    }
};
