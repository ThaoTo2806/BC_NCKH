    const db = require("../config/connectToDB");
    const { sendEmail } = require("../utils/mailSender");
const Degree = require("../models/degree");
// const fabricNetwork = require("../blockchain/fabricNetwork");
const crypto = require("crypto");
// const { connectToNetwork } = require("../blockchain/fabricConfig");

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
        return { success: true, data : {degrees} };
    } catch (error) {
        console.error("Lỗi khi lấy danh sách bằng cấp:", error);
        throw new Error("Lỗi server");
    }
};

    // Lấy chi tiết một bằng cấp theo ID
    exports.getDegreeDetail = async (id) => {
        try {
            const [degree] = await db.query(
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

            if (degree.length === 0) {
                return { success: false, message: "Không tìm thấy bằng cấp" };
            }

            return { success: true, degree: degree };
        } catch (error) {
            console.error("Lỗi khi lấy thông tin bằng cấp:", error);
            throw new Error("Lỗi server");
        }
    };

    exports.UpdateDegree = async( status ,id ) =>  {
        try {
            
    
            const result = await db.query(
                `UPDATE degrees
                 SET status = ?
                 WHERE id = ?`,
                [status, id]
            );
    
            if (result.affectedRows === 0) {
                return { success: false, message: "Không tìm thấy bằng cấp để cập nhật" };
            }
    
            return { success: true, message: "Cập nhật trạng thái thành công" };
        } catch (error) {
            console.error("Lỗi khi cập nhật bằng cấp:", error);
            return { success: false, message: "Lỗi server" };
        }
    }
