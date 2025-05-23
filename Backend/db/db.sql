CREATE DATABASE degree_verification;
USE degree_verification;

-- Bảng người dùng
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(255) NOT NULL UNIQUE,
    email VARCHAR(255) NOT NULL UNIQUE, 
    citizen_id CHAR(12) NOT NULL UNIQUE,  
    role ENUM('student', 'admin', 'verifier', 'manager') NOT NULL DEFAULT 'student',
    common_name VARCHAR(255),
    organization VARCHAR(255),
    organizational_unit VARCHAR(255),
    country VARCHAR(255),
    state VARCHAR(255),
    locality VARCHAR(255),
    certificate TEXT,
    public_key LONGBLOB, 
    private_key LONGBLOB, 
    enrollment_secret VARCHAR(255),
    pin_code CHAR(6) DEFAULT NULL,  
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Bảng ngành học
CREATE TABLE majors (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL UNIQUE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Bảng bằng cấp (Gộp loại bằng vào ENUM)
CREATE TABLE degrees (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    major_id INT NOT NULL,
    degree_name VARCHAR(255) NOT NULL,
    degree_type TINYINT NOT NULL CHECK (degree_type IN (0, 1, 2, 3)), 
    graduation_year INT(4) NOT NULL,
    hash_qrcode VARCHAR(255) NOT NULL UNIQUE,
    gpa DECIMAL(3,2),
    degree_image_front LONGBLOB,
    degree_image_back LONGBLOB,
    blockchain_hash BINARY(32) UNIQUE,
    verification_code VARCHAR(20) UNIQUE,
    status ENUM('valid', 'revoked', 'pending') NOT NULL DEFAULT 'pending',
    batch_approval BOOLEAN DEFAULT FALSE,
    issued_at DATETIME DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (major_id) REFERENCES majors(id) ON DELETE CASCADE
);

-- Bảng xác thực bằng cấp
CREATE TABLE verifications (
    id INT AUTO_INCREMENT PRIMARY KEY,
    degree_id INT NULL,
    verified_by INT NULL,
    reason_for_access VARCHAR(255) NOT NULL,
    verification_method ENUM('code', 'qrcode', 'image') NOT NULL DEFAULT 'image',
    verification_status ENUM('success', 'failed') NOT NULL,
    verification_date DATETIME DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (degree_id) REFERENCES degrees(id) ON DELETE SET NULL,
    FOREIGN KEY (verified_by) REFERENCES users(id) ON DELETE SET NULL
);


CREATE TABLE tokens (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    token TEXT NOT NULL,
    refresh_token TEXT NOT NULL,
    expires_at DATETIME NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE qr_codes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    degree_id VARCHAR(255) NOT NULL,
    token VARCHAR(512) NOT NULL,
    expires_at DATETIME NOT NULL,
    used BOOLEAN DEFAULT FALSE
);


-- Bảng theo dõi chi tiết tiến trình xử lý từng bằng trong lô
CREATE TABLE batch_process_logs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    degree_id INT NOT NULL,
    status ENUM('success', 'failed', 'pending') NOT NULL,
    message TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (degree_id) REFERENCES degrees(id) ON DELETE CASCADE
);

-- Bảng tổng kết kết quả xử lý lô
CREATE TABLE batch_process_summary (
    id INT AUTO_INCREMENT PRIMARY KEY,
    total INT NOT NULL,
    success_count INT NOT NULL DEFAULT 0,
    failed_count INT NOT NULL DEFAULT 0,
    approver_id INT NOT NULL,
    started_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    completed_at TIMESTAMP NULL,
    
    FOREIGN KEY (approver_id) REFERENCES users(id) ON DELETE CASCADE
);
