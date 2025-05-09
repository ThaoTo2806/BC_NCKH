const timeService = require("../services/timeService");

// Controller xử lý yêu cầu lấy thời gian
const getTime = (req, res) => {
    const time = timeService.getCurrentTime();
    res.json({ time });
};

module.exports = { getTime };
