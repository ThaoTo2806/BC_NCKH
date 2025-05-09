const db = require("../config/connectToDB");

class Degree {
    static async createDegree(degreeData) {
        const [result] = await db.execute(
            "INSERT INTO degrees (user_id, major_id, degree_name, degree_type, graduation_year, gpa, degree_image_front, degree_image_back, blockchain_hash, verification_code, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
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
                // 🛠 Dùng `query()`
                "SELECT * FROM degrees WHERE id = ?",
                [degreeId]
            );

            console.log("Query result:", rows); // 🛠 Debug dữ liệu thực tế

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
}

module.exports = Degree;
