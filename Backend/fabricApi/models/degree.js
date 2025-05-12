const db = require("../config/connectToDB");

class Degree {
    static async createDegree(degreeData) {
        const [result] = await db.execute(
            "INSERT INTO degrees (user_id, major_id, degree_name, degree_type, graduation_year, gpa, degree_image_front, degree_image_back, blockchain_hash, verification_code, status,hash_qrcode,batch_approval) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?,?)",
            [
                degreeData.user_id,
                degreeData.major_id,
                degreeData.degree_name,
                degreeData.degree_type,
                degreeData.graduation_year,
                degreeData.gpa,
                degreeData.degree_image_front,
                degreeData.degree_image_back,
                degreeData.blockchain_hash,
                degreeData.verification_code,
                degreeData.status,
                degreeData.hash_qrcode,
                degreeData.batch_approval || false,
            ]
        );
        return result;
    }

    static async updateDegreeStatus(degreeId, newStatus) {
        try {
            const result = await db.query(
                "UPDATE degrees SET status = ? WHERE id = ?",
                [newStatus, degreeId]
            );

            console.log("Update result:", result);

            if (!result || result.affectedRows === 0) {
                throw new Error("Không tìm thấy bằng cấp với ID đã cho.");
            }

            return {
                success: true,
                message: "Cập nhật trạng thái thành công!",
            };
        } catch (error) {
            console.error("Error in updateDegreeStatus:", error);
            return { success: false, message: error.message };
        }
    }

    static async getDegreeById(degreeId) {
        try {
            const [rows] = await db.query(
                "SELECT * FROM degrees WHERE id = ?",
                [degreeId]
            );

            console.log("Query result in getDegreeById:", rows);

            if (!rows || rows.length === 0) {
                throw new Error("Không tìm thấy bằng cấp với ID đã cho.");
            }

            return rows; // ✅ Trả về object đầu tiên
        } catch (error) {
            console.error("Error in getDegreeById:", error);
            return null; // ❌ Trả về null nếu có lỗi
        }
    }

    static async getAllPendingDegrees() {
        try {
            const [rows] = await db.query(
                "SELECT * FROM degrees WHERE status = 'pending'"
            );

            console.log("Fetched Pending Degrees:", rows); // Debug

            return rows;
        } catch (error) {
            console.error("Error in getAllPendingDegrees:", error);
            return [];
        }
    }

    static async getAllPendingBatchApprovals() {
        try {
            const rows = await db.query(
                `SELECT DISTINCT
                    d.id,
                    d.degree_name,
                    d.degree_type,
                    d.graduation_year,
                    d.gpa,
                    d.status,
                    d.issued_at,
                    u.common_name as owner_name,
                    m.name as major_name
                FROM degrees d
                JOIN users u ON d.user_id = u.id
                JOIN majors m ON d.major_id = m.id
                WHERE d.batch_approval = 1 AND d.status = 'pending'
                ORDER BY d.issued_at DESC`
            );

            console.log("Fetched Pending Batch Approvals:", rows);

            return rows;
        } catch (error) {
            console.error("Error in getAllPendingBatchApprovals:", error);
            return [];
        }
    }
}

module.exports = Degree;
