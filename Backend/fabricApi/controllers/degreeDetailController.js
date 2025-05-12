const degreeService = require("../services/degreeService");
const degreeDetailService = require("../services/degreeDetailService");
const getDegreeDetail = async (req, res) => {
    try {
        const { id } = req.params;
        const { token } = req.query;

        if (!token) {
            return res.status(404).render("degree", { success: false, message: "Không tìm thấy trang này" });
        }

        // Kiểm tra mã QR hợp lệ
        const qrCode = await degreeDetailService.validateQRCode(token);
        if (!qrCode) {
            return res.status(404).render("degree", { success: false, message: "Mã QR không hợp lệ hoặc đã hết hạn" });
        }

        // Lấy thông tin bằng cấp
        const result = await degreeService.getDegreeDetail(id);
        if (!result.success) {
            return res.status(404).render("degree", { success: false, message: "Không tìm thấy bằng cấp" });
        }

        // Đánh dấu mã QR là đã sử dụng
        await degreeDetailService.markQRCodeAsUsed(token);

        res.render("degree", { success: true, data: result });
    } catch (error) {
        console.error("Lỗi khi lấy thông tin bằng cấp:", error);
        res.status(500).render("degree", { success: false, message: "Lỗi server" });
    }
};

module.exports = {
    getDegreeDetail,
};
