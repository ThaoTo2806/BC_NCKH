const db = require("../config/connectToDB");
const { sendEmail } = require("../utils/mailSender");
const Degree = require("../models/degree");
const crypto = require("crypto");
const { connectToNetwork } = require("../blockchain/fabricConfig");

// Lấy danh sách bằng cấp với các bộ lọc
exports.getDegrees = async ({ status, start_date, end_date }) => {
    try {
        let sql = `
            SELECT 
                degrees.id,
                degrees.degree_name,
                degrees.graduation_year,
                degrees.gpa,
                degrees.degree_type,
                degrees.status,
                users.common_name AS owner_name,
                majors.name AS major_name,
                degrees.issued_at
            FROM degrees
            JOIN users ON degrees.user_id = users.id
            JOIN majors ON degrees.major_id = majors.id
            WHERE 1=1
        `;

        let params = [];

        if (status) {
            sql += ` AND degrees.status = ?`;
            params.push(status);
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
        // Lấy dữ liệu từ database
        const [rows] = await db.query(
            `SELECT 
                degrees.id,
                degrees.degree_name,
                degrees.graduation_year,
                degrees.gpa,
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
        try {
            const { contract } = await connectToNetwork();
            const blockchainData = await contract.evaluateTransaction(
                "ReadDegree",
                id
            );
            blockchainDegree = JSON.parse(blockchainData.toString());

            // Nếu dữ liệu trên blockchain khác database, báo lỗi hoặc cập nhật database
            if (
                (blockchainDegree.Status == "pending_level_2" &&
                    degree.status == "valid") ||
                (blockchainDegree.Status == "valid" &&
                    degree.status == "pending")
            ) {
                console.warn(
                    `Dữ liệu bằng cấp ${id} trên blockchain khác với database!`
                );
            }
        } catch (blockchainError) {
            console.error(
                "Không thể lấy dữ liệu từ Blockchain:",
                blockchainError
            );
        }

        if (blockchainDegree) {
            return {
                success: true,
                degree: {
                    ...blockchainDegree,
                    degree_image_front: degree.degree_image_front,
                    degree_image_back: degree.degree_image_back,
                },
            };
        }
        return { success: true, degree };
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
    // Lấy thông tin và ghi lên blockchain
    const degree = await Degree.getDegreeById(degreeId);
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
const recordDegreeOnBlockchain = async (degree, approver, level) => {
    console.log("Đang ghi bằng cấp lên blockchain:", degree);

    const method = level === 1 ? "CreateDegree" : "ApproveLevel2";

    let gateway, contract;
    try {
        const network = await connectToNetwork();
        if (!network || !network.gateway || !network.contract) {
            throw new Error("Không thể kết nối đến blockchain.");
        }

        gateway = network.gateway;
        contract = network.contract;

        let response;
        if (method === "CreateDegree") {
            const args = [
                degree.id.toString(),
                degree.user_id.toString(),
                degree.major_id.toString(),
                degree.degree_name,
                degree.degree_type.toString(),
                degree.graduation_year.toString(),
                degree.gpa.toString(),
                approver.id.toString(),
            ];
            response = await contract.submitTransaction(method, ...args);
        } else {
            response = await contract.submitTransaction(
                method,
                degree.id.toString(),
                approver.id.toString()
            );
        }

        console.log(`Phản hồi từ blockchain: ${response.toString()}`);
        console.log(`Bằng cấp ${degree.id} đã được ghi lên blockchain.`);

        // Đọc lại dữ liệu từ blockchain để xác nhận
        const result = await contract.evaluateTransaction(
            "ReadDegree",
            degree.id.toString()
        );
        console.log("Dữ liệu từ blockchain:", result.toString());

        return JSON.parse(result.toString());
    } catch (error) {
        console.error(
            `Lỗi khi ghi bằng cấp ${degree.id} lên blockchain:`,
            error
        );
        throw new Error(`Blockchain error: ${error.message}`);
    } finally {
        if (gateway) await gateway.disconnect();
    }
};
