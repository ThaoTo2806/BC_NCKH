const degreeService = require("../services/qrService");
exports.qrGenerate =  async(req, res) =>{
    try {
        const data = await degreeService.Generate_Qr();
        
        return res.status(200).json(data);
    } catch (error) {
        return res.status(500).json({message : error})
    }
}

exports.verifyQR = async(req, res) =>{
    try {
        const {token} = req.body;
        
        const result = await degreeService.verify_qr(token);
        return res.status(200).json(result);
    } catch (error) {
        return res.status(500).json({message : error})
    }
}