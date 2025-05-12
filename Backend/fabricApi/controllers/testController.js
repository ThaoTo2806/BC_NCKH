const testService = require('../services/testService');
const  getDegreeInfo  = require('../services/testService');
const fs = require('fs');

exports.getHealth = async (req, res) => {
    try {
        const result = await testService.checkHealth();
        res.status(200).json(result);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.postProcessId = async (req, res) => {
    try {
        const imagePath = req.file.path; // lấy file từ multer
        const result = await testService.processCCCD(imagePath);

        // Optional: xoá file sau khi xử lý xong
        fs.unlinkSync(imagePath);

        res.status(200).json(result);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
// controllers/degreeController.js



exports.getDegree = (req, res) => {
    try {
        const data = testService.getDegreeInfo();
        return res.status(200).json({ data });
    } catch (error) {
        console.error("Error:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

