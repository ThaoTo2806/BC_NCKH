const degreeService = require("../services/degreeService");
const multer = require("multer");
const DegreeService = require("../services/degreeService");
const db = require("../config/connectToDB");
const crypto = require("crypto");
const Degree = require("../models/degree");
const pool = require("../config/database_pool");
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });
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
        const { status, start_date, end_date ,date } = req.query;
        const data = await degreeService.getDegrees({
            status,
            start_date,
            end_date,
            date
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
            connection
        );
        const degreeId = result.insertId; // Lưu ID của bằng cấp

        await connection.commit();

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
             degree_image_front, degree_image_back, blockchain_hash, verification_code, status) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'pending')
        `;

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
        const vietnamDateTime = now.toISOString().slice(0, 19).replace('T', ' ');
        
        const result = await DegreeService.UpdateDegreeQueryTime(vietnamDateTime, id);

        if (!result.success) {
            return res.status(404).json(result);
        }

        return res.status(200).json(result);
    } catch (error) {
        console.error("Lỗi khi cập nhật bằng cấp thời gian không hợp lẹ:", error);
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
