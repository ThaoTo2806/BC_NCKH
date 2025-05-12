// services/degreeService.js
const pool = require("../config/database_pool");

const getDegreeDetail = async (id) => {
    try {
        const connection = await pool.getConnection();
        const [rows] = await connection.execute("SELECT * FROM degrees WHERE id = ?", [id]);
        connection.release();

        if (rows.length === 0) {
            return { success: false, message: "Không tìm thấy bằng cấp" };
        }

        return { success: true, degree: rows[0] };
    } catch (error) {
        console.error("Lỗi khi truy vấn bằng cấp:", error);
        return { success: false, message: "Lỗi server" };
    }
};

const validateQRCode = async (token) => {
    try {
        const connection = await pool.getConnection();
        const [rows] = await connection.execute("SELECT * FROM qr_codes WHERE token = ?", [token]);
        connection.release();

        if (rows.length === 0) {
            return null;
        }

        const qrCode = rows[0];
        const expiresAt = new Date(qrCode.expires_at);

        if (qrCode.used || Date.now() > expiresAt.getTime()) {
            return null;
        }

        return qrCode;
    } catch (error) {
        console.error("Lỗi khi kiểm tra mã QR:", error);
        return null;
    }
};

const markQRCodeAsUsed = async (token) => {
    try {
        const connection = await pool.getConnection();
        await connection.execute("UPDATE qr_codes SET used = ? WHERE token = ?", [true, token]);
        connection.release();
    } catch (error) {
        console.error("Lỗi khi đánh dấu mã QR là đã sử dụng:", error);
    }
};

module.exports = {
    getDegreeDetail,
    validateQRCode,
    markQRCodeAsUsed,
};
