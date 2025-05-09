const fs = require("fs");
const https = require("https");
const app = require("./app");

// Lấy cổng từ biến môi trường hoặc mặc định là 3000 (hoặc cổng khác bạn muốn)
const PORT = process.env.PORT || 3001;  // Cập nhật cổng nếu muốn
const DOMAIN = process.env.fabric_url || `https://localhost:${PORT}`;  // Sử dụng https

// Đọc chứng chỉ SSL từ các file
const options = {
  key: fs.readFileSync("./ssl/server.key"),  // Đường dẫn tới private key
  cert: fs.readFileSync("./ssl/server.crt")  // Đường dẫn tới certificate
};

require("dotenv").config();

// Hàm enrollAdmin vẫn giữ nguyên
const { enrollAdmin } = require("./services/adminService");
enrollAdmin();

// Khởi tạo server HTTPS với cổng mới
https.createServer(options, app).listen(PORT, () => {
  console.log(`API đang chạy trên ${DOMAIN}; 🚀`);
});
