const degreeService = require("../services/degreeService");
const multer = require("multer");
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });
exports.upload = upload.fields([
    { name: "frontImage", maxCount: 1 },
    { name: "backImage", maxCount: 1 },
]);


exports.getDegrees = async (req, res) => {
     try {
            const { status, start_date, end_date } = req.query;
            const data = await degreeService.getDegrees({
                status,
                start_date,
                end_date,
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
    // console.log("Request files:", req.files);
    // console.log("Request body:", req.body);
    
    try {
        const {
            user_id,
            major_id,
            degree_name,
            degree_type,
            graduation_year,
            gpa,
            verification_code,
        } = req.body;
        
        // Lấy buffer của ảnh
        const frontImage = req.files?.frontImage?.[0]?.buffer;
        const backImage = req.files?.backImage?.[0]?.buffer;

        console.log("Front image:", frontImage);
        console.log("Back image:", backImage);

        // Kiểm tra dữ liệu cơ bản
        if (!user_id || !degree_name) {
            return res.status(400).json({ 
                success: false, 
                message: "Thiếu thông tin người dùng hoặc tên bằng cấp" 
            });
        }

        // Kiểm tra ảnh
        if (!frontImage || !backImage) {
            return res.status(400).json({ 
                success: false, 
                message: "Thiếu ảnh mặt trước hoặc mặt sau của bằng" 
            });
        }

        // Gọi hàm lưu vào database
        const result = await simpleSaveWithImages(
            user_id,
            major_id || 1,
            degree_name,
            degree_type || 1,
            graduation_year || new Date().getFullYear().toString(),
            gpa || "0.0",
            frontImage,
            backImage,
            verification_code
        );

        // Trả kết quả thành công
        res.status(201).json({ 
            success: true, 
            message: "Tạo bằng cấp thành công",
            degreeId: result.insertId,
            verificationCode: result.verificationCode
        });
    } catch (error) {
        console.error("Lỗi khi tạo bằng cấp:", error);
        res.status(500).json({ 
            success: false, 
            message: error.message || "Lỗi server" 
        });
    }
};

// Hàm lưu thông tin cơ bản và ảnh
async function simpleSaveWithImages(
    user_id,
    major_id,
    degree_name,
    degree_type,
    graduation_year,
    gpa,
    frontImage,
    backImage,
    verification_code = null
) {
    const crypto = require('crypto');
    const mysql = require('mysql2');

    console.log("<<< check image buffer >>>", frontImage, backImage);
    
    // Tạo mã xác thực ngẫu nhiên nếu không có
    const finalVerificationCode = verification_code || 
        crypto.randomBytes(3).toString('hex').toUpperCase();
    
    // Tạo hash đơn giản từ ảnh (nếu cần)
    let imageHash = null;
    if (frontImage && backImage) {
        imageHash = crypto
            .createHash('md5')
            .update(Buffer.concat([frontImage, backImage]))
            .digest('hex');
    }
    
    return new Promise((resolve, reject) => {
        // Tạo kết nối MySQL
        const connection = mysql.createConnection({
            host: process.env.DB_HOST || 'localhost',
            user: process.env.DB_USER || 'root',
            password: process.env.DB_PASSWORD || '123456',
            database: process.env.DB_NAME || 'degree_verification'
        });
        
        // Kết nối
        connection.connect(err => {
            if (err) {
                console.error("Lỗi kết nối database:", err);
                return reject(new Error(`Không thể kết nối đến cơ sở dữ liệu: ${err.message}`));
            }
            
            // Query SQL
            const sql = `
                INSERT INTO degrees 
                (user_id, major_id, degree_name, degree_type, graduation_year, gpa,
                 degree_image_front, degree_image_back, blockchain_hash, verification_code, status) 
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'pending')
            `;
            
            // Thực hiện query
            connection.query(
                sql,
                [
                    user_id,
                    major_id,
                    degree_name,
                    degree_type,
                    graduation_year,
                    gpa,
                    frontImage,
                    backImage,
                    imageHash,
                    finalVerificationCode
                ],
                (error, results) => {
                    // Luôn đóng kết nối
                    connection.end();
                    
                    if (error) {
                        console.error("Lỗi khi lưu dữ liệu:", error);
                        return reject(new Error(`Lỗi khi lưu dữ liệu: ${error.message}`));
                    }
                    
                    // Trả về kết quả
                    resolve({
                        insertId: results.insertId,
                        frontImageHash: frontImage,
                        backImageHash: backImage,
                        verificationCode: finalVerificationCode
                    });
                }
            );
        });
    });
}

exports.UpdateDegree = async(req, res ) =>  {

    try {
        const { status } = req.query;
        const { id } = req.params; 

        if (!status) {
            return res.status.json({ success: false, message: "Trạng thái không được để trống" });
        }

       const result = await degreeService.UpdateDegree(status , id);

       if (!result.success) {
        return res.status(404).json(result);
            }


            return res.status(200).json(result);
    } catch (error) {
        console.error("Lỗi khi cập nhật bằng cấp:", error);
        return res.status(500).json({ success: false, message: "Lỗi server" });
    }
}