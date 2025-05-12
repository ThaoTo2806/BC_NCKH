USE degree_verification;

-- Thêm cột batch_approval vào bảng degrees nếu chưa tồn tại
ALTER TABLE degrees ADD COLUMN IF NOT EXISTS batch_approval TINYINT(1) DEFAULT 0;

-- Tạo bảng theo dõi chi tiết tiến trình xử lý từng bằng trong lô
CREATE TABLE IF NOT EXISTS batch_process_logs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    degree_id INT NOT NULL,
    status ENUM('success', 'failed', 'pending') NOT NULL,
    message TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (degree_id) REFERENCES degrees(id) ON DELETE CASCADE
);

-- Tạo bảng tổng kết kết quả xử lý lô
CREATE TABLE IF NOT EXISTS batch_process_summary (
    id INT AUTO_INCREMENT PRIMARY KEY,
    total INT NOT NULL,
    success_count INT NOT NULL DEFAULT 0,
    failed_count INT NOT NULL DEFAULT 0,
    approver_id INT NOT NULL,
    started_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    completed_at TIMESTAMP NULL,
    
    FOREIGN KEY (approver_id) REFERENCES users(id) ON DELETE CASCADE
); 