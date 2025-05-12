const axios = require('axios');
const fs = require('fs');
const FormData = require('form-data');

const BASE_URL = "http://192.168.1.10:5000";

exports.checkHealth = async function () {
    try {
        const response = await axios.get(`${BASE_URL}/api/health`);
        return response.data;
    } catch (error) {
        throw new Error(`Health check failed: ${error.message}`);
    }
};

exports.processCCCD = async function (imagePath) {
    if (!fs.existsSync(imagePath)) {
        throw new Error(`Image file not found at ${imagePath}`);
    }

    const form = new FormData();
    form.append('file', fs.createReadStream(imagePath), {
        filename: imagePath,
        contentType: 'image/jpeg'
    });

    try {
        const response = await axios.post(`${BASE_URL}/api/process-id`, form, {
            headers: {
                ...form.getHeaders()
            }
        });
        return response.data;
    } catch (error) {
        throw new Error(`Process CCCD failed: ${error.message}`);
    }
};
// services/degreeService.js

exports.getDegreeInfo = () => {
    return {
        degree_type: '1',
        major_id: '1',
        common_name: 'Lâm Hào',
        dob: '26/08/2004',
        graduation_year: '2022',
        degree_name: 'Cử nhân ngân hàng',
        xeploai: 'GIỎI',
        created_at: '28/04/2021',
        hash_qrcode: '0000000000',
        sovaobangcap: '0000000000'
    };
};


