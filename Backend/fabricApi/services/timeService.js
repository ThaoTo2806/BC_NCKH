// Hàm lấy thời gian hiện tại theo định dạng dd/MM/yyyy HH:mm:ss
const getCurrentTime = () => {
    const now = new Date();

    // Định dạng ngày
    const date = new Intl.DateTimeFormat("vi-VN", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
    }).format(now);

    const hours = now.getHours().toString().padStart(2, "0");
    const minutes = now.getMinutes().toString().padStart(2, "0");
    const seconds = now.getSeconds().toString().padStart(2, "0");

    return `${date} ${hours}:${minutes}:${seconds}`;
};

module.exports = { getCurrentTime };
