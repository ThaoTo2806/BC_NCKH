const jwt = require("jsonwebtoken");
const secret_key = "4f3d2a8f9e8b3c1d5e6f7a9b0c2d4e8f3a6b9c0d1e2f4a5b7c8d9e0f1a2b3c4";
const qrCode = require('qrcode');
const fs = require('fs');
const path = require('path');

// Hàm tạo QR code
exports.Generate_Qr = async () => {
    try {
        const username = "Manager";
        const password = "kaCjqKmvkfar";
        
        const qrData = `${username}|${password}`;
        
        const qrFilePath = path.join(__dirname, 'services', 'qrData.png');
        
        const dirPath = path.dirname(qrFilePath);
        if (!fs.existsSync(dirPath)) {
            fs.mkdirSync(dirPath, { recursive: true });
        }
        
        await qrCode.toFile(qrFilePath, qrData);
        
        const qrImageUrl = `http://192.168.1.18/khobenthanh/server/qrcode/images/${encodeURIComponent(qrData)}.png`;
        
        console.log('QR Code generated and saved to: ', qrImageUrl);
        
        return { success: true, data: { qrImageUrl } };
    } catch (error) {
        console.log(error);
        return { message: error.message };
    }
};

// Hàm xác thực QR code (verify token)
exports.verify_qr = async({ data }) => {
    try {
        const decoded = jwt.verify(data.token, secret_key);

        return { success: true, message: "Verification Successful", data: { user: { id: decoded.user_id } } };
    } catch (error) {
        return { message: error.message || "Token verification failed" };
    }
}
