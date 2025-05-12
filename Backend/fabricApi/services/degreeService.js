const db = require("../config/connectToDB");
const { sendEmail } = require("../utils/mailSender");
const Degree = require("../models/degree");
const crypto = require("crypto");
const { connectToNetwork } = require("../blockchain/fabricConfig");
const { getFileFromIPFS, hashImage } = require("../config/ipfs");

// Lấy danh sách bằng cấp với các bộ lọc
exports.getDegrees = async ({ status, start_date, end_date, date }) => {
    try {
        let sql = `
            SELECT 
                degrees.id,
                degrees.degree_name,
                degrees.graduation_year,
                degrees.gpa,
                degrees.degree_type,
                degrees.status,
                degrees.batch_approval,
                users.common_name AS owner_name,
                majors.name AS major_name,
                degrees.issued_at
            FROM degrees
            JOIN users ON degrees.user_id = users.id
            JOIN majors ON degrees.major_id = majors.id
            WHERE 1=1 AND batch_approval = 0
        `;

        let params = [];

        if (status) {
            sql += ` AND degrees.status = ?`;
            params.push(status);
        }

        if (date) {
            sql += ` AND degrees.issued_at >= ?`;
            params.push(date);
        }

        if (start_date) {
            sql += ` AND degrees.issued_at >= ?`;
            params.push(start_date);
        }

        if (end_date) {
            sql += ` AND degrees.issued_at <= ?`;
            params.push(end_date);
        }

        sql += ` ORDER BY degrees.issued_at DESC`;

        console.log(sql);

        const degrees = await db.query(sql, params);
        console.log(degrees);
        return { success: true, data: { degrees } };
    } catch (error) {
        console.error("Lỗi khi lấy danh sách bằng cấp:", error);
        throw new Error("Lỗi server");
    }
};
exports.getDegreeDetail = async (id) => {
    try {
        const rows = await db.query(
            `SELECT 
                degrees.id,
                degrees.degree_name,
                degrees.graduation_year,
                degrees.gpa,
                degree_type,
                degrees.status,
                degrees.degree_image_front,
                degrees.degree_image_back,
                users.common_name AS owner_name,
                majors.name AS major_name,
                degrees.issued_at
            FROM degrees
            JOIN users ON degrees.user_id = users.id
            JOIN majors ON degrees.major_id = majors.id
            WHERE degrees.id = ?`,
            [id]
        );

        if (!rows || rows.length === 0) {
            return { success: false, message: "Không tìm thấy bằng cấp" };
        }

        const degree = rows[0];

        let blockchainDegree = null;
        let frontImageMatch = false;
        let backImageMatch = false;

        try {
            const { contract } = await connectToNetwork();
            const blockchainData = await contract.evaluateTransaction(
                "ReadDegree",
                id
            );
            blockchainDegree = JSON.parse(blockchainData.toString());

            // Tải ảnh từ IPFS
            const frontImageIPFS = await getFileFromIPFS(
                blockchainDegree.FrontImageCID
            );
            const backImageIPFS = await getFileFromIPFS(
                blockchainDegree.BackImageCID
            );

            // So sánh hash ảnh từ database và IPFS
            if (frontImageIPFS && degree.degree_image_front) {
                const frontHashDB = hashImage(
                    Buffer.from(degree.degree_image_front, "base64")
                );
                const frontHashIPFS = hashImage(blockchainDegree.FrontImageCID);
                frontImageMatch = frontHashDB === frontHashIPFS;
            }

            if (backImageIPFS && degree.degree_image_back) {
                const backHashDB = hashImage(
                    Buffer.from(degree.degree_image_back, "base64")
                );
                const backHashIPFS = hashImage(blockchainDegree.BackImageCID);
                backImageMatch = backHashDB === backHashIPFS;
            }

            return {
                success: true,
                degree: {
                    ...blockchainDegree,
                    frontImageMatch,
                    backImageMatch,
                    frontImage: frontImageIPFS
                        ? frontImageIPFS.toString("base64")
                        : null,
                    backImage: backImageIPFS
                        ? backImageIPFS.toString("base64")
                        : null,
                         owner_name: degree.owner_name,      // Thêm thông tin chủ sở hữu
                        major_name: degree.major_name,      // Thêm thông tin chuyên ngành
                        graduation_year: degree.graduation_year, // Thêm thông tin năm tốt nghiệp
                        gpa: degree.gpa,                    // Thêm thông tin GPA
                        status: degree.status,              // Thêm thông tin trạng thái
                        degree_type : degree.degree_type
                },
            };
        } catch (blockchainError) {
            console.error(
                "Không thể lấy dữ liệu từ Blockchain:",
                blockchainError
            );
            return {
                success: false,
                message: "Lỗi khi lấy dữ liệu từ Blockchain",
            };
        }
    } catch (error) {
        console.error("Lỗi khi lấy thông tin bằng cấp:", error);
        throw new Error("Lỗi server");
    }
};
exports.UpdateDegree = async (status, id) => {
    try {
        const result = await db.query(
            `UPDATE degrees
                 SET status = ?
                 WHERE id = ?`,
            [status, id]
        );

        if (result.affectedRows === 0) {
            return {
                success: false,
                message: "Không tìm thấy bằng cấp để cập nhật",
            };
        }

        return { success: true, message: "Cập nhật trạng thái thành công" };
    } catch (error) {
        console.error("Lỗi khi cập nhật bằng cấp:", error);
        return { success: false, message: "Lỗi server" };
    }
};

exports.UpdateDegreeQueryTime = async (timeQuery, id) => {
    try {
        const result = await db.query(
            `UPDATE degrees
                 SET query_time = ?
                 WHERE id = ?`,
            [timeQuery, id]
        );

        if (result.affectedRows === 0) {
            return {
                success: false,
                message: "Không tìm thấy bằng cấp để cập nhật",
            };
        }

        return { success: true, message: "Cập nhật trạng thái thành công" };
    } catch (error) {
        console.error("Lỗi khi cập nhật bằng cấp:", error);
        return { success: false, message: "Lỗi server" };
    }
};

exports.issueDegreeOnBlockchain = async (
    degreeId,
    user_id,
    major_id,
    degree_name,
    degree_type,
    graduation_year,
    gpa,
    blockchainHash,
    verification_code
) => {
    return await submitTransaction(
        "IssueDegree",
        degreeId,
        user_id,
        major_id,
        degree_name,
        degree_type,
        graduation_year,
        gpa,
        blockchainHash,
        verification_code
    );
};

exports.createDegree = async (degreeData) => {
    const degreeId = await Degree.createDegree(degreeData);
    return degreeId;
};

exports.approveDegreeLevel1 = async (degreeId, approver) => {
    const degree = await Degree.getDegreeById(degreeId);
    console.log("Degree trong approveDegreeLevel1:", degree);

    if (!degree) {
        throw new Error("Không thể lấy thông tin bằng cấp.");
    }

    return await recordDegreeOnBlockchain(degree, approver, 1);
};

exports.approveDegreeLevel2 = async (degreeId, approver) => {
    await Degree.updateDegreeStatus(degreeId, "valid");

    // Lấy thông tin và ghi lên blockchain
    const degree = await Degree.getDegreeById(degreeId);
    return await recordDegreeOnBlockchain(degree, approver, 2);
};

exports.rejectDegree = async (degreeId) => {
    await Degree.updateDegreeStatus(degreeId, "revoked");
};

exports.getPendingDegrees = async () => {
    return await Degree.getAllPendingDegrees();
};

// New function to get pending batch approvals
exports.getPendingBatchApprovals = async () => {
    try {
        return await Degree.getAllPendingBatchApprovals();
    } catch (error) {
        console.error(
            "Lỗi khi lấy danh sách bằng cấp chờ duyệt hàng loạt:",
            error
        );
        throw new Error("Lỗi server");
    }
};

// New function to approve a batch of degrees
exports.approveBatchDegrees = async (degreeIds, approver) => {
    const results = {
        successCount: 0,
        failedCount: 0,
        successful: [],
        failed: [],
        message: "Quá trình phê duyệt đã được bắt đầu và sẽ diễn ra trong nền",
        inProgress: true,
    };

    // Bắt đầu quá trình xử lý bất đồng bộ
    processBatchInBackground(degreeIds, approver);

    // Trả về ngay lập tức để không chặn người dùng
    return results;
};

// Hàm xử lý hàng loạt trong nền
async function processBatchInBackground(degreeIds, approver) {
    // Số lượng xử lý đồng thời tối đa
    const BATCH_SIZE = 3;
    let successCount = 0;
    let failedCount = 0;

    try {
        // Trước tiên, thử sử dụng phương pháp batch nếu có thể
        const allDegrees = [];
        for (const degreeId of degreeIds) {
            try {
                // Lấy thông tin bằng cấp từ cơ sở dữ liệu
                const degrees = await Degree.getDegreeById(degreeId);
                if (degrees && degrees.length > 0) {
                    const degree = degrees[0];

                    // Cập nhật batch_approval thành false
                    await db.query(
                        "UPDATE degrees SET batch_approval = 0 WHERE id = ?",
                        [degreeId]
                    );

                    allDegrees.push({
                        id: degree.id.toString(),
                        userId: degree.user_id.toString(),
                        major: degree.major_id.toString(),
                        degreeName: degree.degree_name,
                        degreeType: degree.degree_type.toString(),
                        graduationYear: degree.graduation_year.toString(),
                        gpa: degree.gpa.toString(),
                        approver: approver.id.toString(),
                        approverRole: "manager",
                        frontImageCID: degree.degree_image_front,
                        backImageCID: degree.degree_image_back,
                        issuedAt: new Date().toISOString(),
                    });
                }
            } catch (error) {
                console.error(`Error getting degree ${degreeId}:`, error);
                // Ghi log lỗi
                await db.query(
                    "INSERT INTO batch_process_logs (degree_id, status, message) VALUES (?, 'failed', ?)",
                    [
                        degreeId,
                        JSON.stringify({
                            timestamp: new Date(),
                            error:
                                "Không thể lấy thông tin bằng cấp: " +
                                error.message,
                        }),
                    ]
                );
                failedCount++;
            }
        }

        if (allDegrees.length > 0) {
            try {
                // Kết nối đến mạng blockchain
                const network = await connectToNetwork();
                if (!network || !network.gateway || !network.contract) {
                    throw new Error("Không thể kết nối đến blockchain.");
                }

                const { gateway, contract } = network;

                // Gọi hàm batch của chaincode
                const response = await contract.submitTransaction(
                    "CreateDegreesBatch",
                    JSON.stringify(allDegrees)
                );

                const result = JSON.parse(response.toString());
                console.log("Batch processing result:", result);

                // Cập nhật kết quả cho từng bằng cấp
                for (const item of result.results) {
                    await db.query(
                        "INSERT INTO batch_process_logs (degree_id, status, message) VALUES (?, ?, ?)",
                        [
                            item.id,
                            item.success ? "success" : "failed",
                            JSON.stringify({
                                timestamp: new Date(),
                                message: item.success
                                    ? "Phê duyệt thành công"
                                    : "Lỗi: " + item.error,
                            }),
                        ]
                    );
                }

                successCount = result.successful;
                failedCount = result.failed;

                // Đóng kết nối
                gateway.disconnect();

                // Cập nhật summary
                await db.query(
                    "UPDATE batch_process_summary SET success_count = ?, failed_count = ?, completed_at = NOW() WHERE id = (SELECT id FROM batch_process_summary ORDER BY id DESC LIMIT 1)",
                    [successCount, failedCount]
                );

                return;
            } catch (batchError) {
                console.error(
                    "Error using batch processing, falling back to individual processing:",
                    batchError
                );
                // Tiếp tục với phương pháp xử lý từng cái
            }
        }
    } catch (error) {
        console.error("Error in batch preparation:", error);
    }

    // Nếu không thể sử dụng phương pháp batch, sử dụng phương pháp cũ
    // Xử lý từng nhóm nhỏ để không tải quá mức blockchain network
    for (let i = 0; i < degreeIds.length; i += BATCH_SIZE) {
        const currentBatch = degreeIds.slice(i, i + BATCH_SIZE);

        // Promise.all để xử lý song song một nhóm nhỏ các bằng cấp
        const batchPromises = currentBatch.map(async (degreeId) => {
            try {
                // Cập nhật trạng thái batch_approval thành false
                await db.query(
                    "UPDATE degrees SET batch_approval = 0 WHERE id = ?",
                    [degreeId]
                );

                // Gọi hàm phê duyệt cấp 1
                const response = await exports.approveDegreeLevel1(
                    degreeId,
                    approver
                );

                // Cập nhật trạng thái thành công
                await db.query(
                    "INSERT INTO batch_process_logs (degree_id, status, message) VALUES (?, 'success', ?)",
                    [
                        degreeId,
                        JSON.stringify({
                            timestamp: new Date(),
                            message: "Phê duyệt thành công",
                        }),
                    ]
                );

                successCount++;
                return { degreeId, success: true, response };
            } catch (error) {
                console.error(`Error approving degree ${degreeId}:`, error);

                // Ghi log lỗi
                await db.query(
                    "INSERT INTO batch_process_logs (degree_id, status, message) VALUES (?, 'failed', ?)",
                    [
                        degreeId,
                        JSON.stringify({
                            timestamp: new Date(),
                            error: error.message,
                        }),
                    ]
                );

                failedCount++;
                return { degreeId, success: false, error: error.message };
            }
        });

        // Đợi nhóm hiện tại hoàn thành trước khi bắt đầu nhóm tiếp theo
        await Promise.all(batchPromises);

        // Có thể thêm delay nhỏ giữa các nhóm nếu cần
        await new Promise((resolve) => setTimeout(resolve, 500));
    }

    // Cập nhật kết quả cuối cùng vào cơ sở dữ liệu
    try {
        await db.query(
            "UPDATE batch_process_summary SET success_count = ?, failed_count = ?, completed_at = NOW() WHERE id = (SELECT id FROM batch_process_summary ORDER BY id DESC LIMIT 1)",
            [successCount, failedCount]
        );
    } catch (error) {
        console.error("Error saving batch process summary:", error);
    }
}

// Helper function to create the logs table if needed
exports.ensureBatchLogsTableExists = async () => {
    try {
        // Kiểm tra và tạo bảng batch_process_logs nếu chưa tồn tại
        await db.query(`
            CREATE TABLE IF NOT EXISTS batch_process_logs (
                id INT AUTO_INCREMENT PRIMARY KEY,
                degree_id INT NOT NULL,
                status ENUM('success', 'failed', 'pending') NOT NULL,
                message TEXT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (degree_id) REFERENCES degrees(id)
            )
        `);

        // Kiểm tra và tạo bảng batch_process_summary nếu chưa tồn tại
        await db.query(`
            CREATE TABLE IF NOT EXISTS batch_process_summary (
                id INT AUTO_INCREMENT PRIMARY KEY,
                total INT NOT NULL,
                success_count INT NOT NULL DEFAULT 0,
                failed_count INT NOT NULL DEFAULT 0,
                approver_id INT NOT NULL,
                started_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                completed_at TIMESTAMP NULL,
                FOREIGN KEY (approver_id) REFERENCES users(id)
            )
        `);

        return true;
    } catch (error) {
        console.error("Error ensuring batch logs tables exist:", error);
        return false;
    }
};

exports.getDegreeById = async (id) => {
    try {
        const degrees = await db.query(
            "SELECT degrees.id, degrees.degree_name, degrees.degree_type, majors.name AS major_name, degrees.issued_at, degrees.graduation_year, degrees.gpa, users.common_name FROM degrees JOIN users ON degrees.user_id = users.id JOIN majors ON degrees.major_id = majors.id WHERE degrees.id = ?;",
            [id]
        );

        if (degrees.length === 0) {
            return { success: false, message: "Không tìm thấy bằng cấp" };
        }

        return { success: true, degree: degrees[0] };
    } catch (error) {
        console.error("Lỗi khi lấy bằng cấp:", error);
        throw new Error("Lỗi server");
    }
};

const recordDegreeOnBlockchain = async (degree, approver, level) => {
    console.log("Đang ghi bằng cấp lên blockchain:");
    console.log("Degree object:", degree);

    if (!degree || !degree.id) {
        console.error("Thiếu hoặc sai định dạng dữ liệu bằng cấp:", degree);
        throw new Error("Thiếu hoặc sai định dạng dữ liệu bằng cấp (degree.id).");
    }

    const method = level === 1 ? "CreateDegree" : "ApproveLevel2";
    let gateway, contract;
    try {
        // Lấy thông tin role của approver
        const userResult = await db.query(
            "SELECT role FROM users WHERE id = ?",
            [approver.id]
        );

        const userRole = userResult[0]?.role;
        if (!userRole) {
            throw new Error("Không tìm thấy role cho approver.");
        }

        const network = await connectToNetwork();
        if (!network || !network.gateway || !network.contract) {
            console.error("Không thể kết nối đến blockchain.");
            throw new Error("Không thể kết nối đến blockchain.");
        }

        gateway = network.gateway;
        contract = network.contract;
        const now = new Date().toISOString();

        let response;
        if (method === "CreateDegree") {
            console.log("Ghi bằng cấp lên blockchain:");
            const args = [
                degree.id.toString(),
                degree.user_id.toString(),
                degree.major_id.toString(),
                degree.degree_name,
                degree.degree_type.toString(),
                degree.graduation_year.toString(),
                degree.gpa.toString(),
                approver.id.toString(),
                userRole,
                degree.degree_image_front,
                degree.degree_image_back,
                now,
            ];
            console.log("Arguments being sent to blockchain:", args);

            response = await contract.submitTransaction(method, ...args);
        } else {
            response = await contract.submitTransaction(
                method,
                degree.id.toString(),
                approver.id.toString(),
                userRole,
                now
            );
        }

        console.log(`Phản hồi từ blockchain: ${response.toString()}`);
        console.log(`Bằng cấp ${degree.id} đã được ghi lên blockchain.`);

        const result = await contract.evaluateTransaction(
            "ReadDegree",
            degree.id.toString()
        );
        console.log("Dữ liệu từ blockchain:", result.toString());

        return JSON.parse(result.toString());
    } catch (error) {
        console.error(
            `Lỗi khi ghi bằng cấp ${degree?.id || "(không rõ ID)"} lên blockchain:`,
            error
        );
        throw new Error(`Blockchain error: ${error.message}`);
    } finally {
        if (gateway) gateway.disconnect();
    }
};

