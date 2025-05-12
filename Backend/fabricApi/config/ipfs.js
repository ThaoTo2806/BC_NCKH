const { create } = require("ipfs-http-client");
const crypto = require("crypto");
require("dotenv").config();

// const ipfs = create({
//     host: '127.0.0.1',
//     port: '7054',
//     protocol: "http",
// });

const ipfs = create({
    host: 'blockchain.onlineai.vn',
    port: '5001',
    protocol: 'http',
  });
  

const AES_KEY = Buffer.from(process.env.AES_KEY, "hex");
const AES_IV = Buffer.from(process.env.AES_IV, "hex");

// Hàm mã hóa dữ liệu
function encryptData(data) {
    const cipher = crypto.createCipheriv("aes-256-cbc", AES_KEY, AES_IV);
    let encrypted = cipher.update(data);
    encrypted = Buffer.concat([encrypted, cipher.final()]);
    return { encryptedData: encrypted, iv: AES_IV };
}

// Hàm giải mã dữ liệu
function decryptData(encryptedData, iv) {
    const decipher = crypto.createDecipheriv("aes-256-cbc", AES_KEY, iv);
    let decrypted = decipher.update(encryptedData);
    decrypted = Buffer.concat([decrypted, decipher.final()]);
    return decrypted;
}

// Hàm hash dữ liệu
function hashImage(imageBuffer) {
    return crypto.createHash("sha256").update(imageBuffer).digest("hex");
}

// Upload file lên IPFS (dữ liệu đã được mã hóa)
async function uploadToIPFS(fileBuffer) {
    try {
        const { encryptedData, iv } = encryptData(fileBuffer);
        const { cid } = await ipfs.add(encryptedData);
        return { cid: cid.toString(), iv: iv.toString("hex") };
    } catch (error) {
        console.error("Lỗi khi upload IPFS:", error);
        throw new Error("Không thể upload lên IPFS");
    }
}

// Tải file từ IPFS và giải mã
async function getFileFromIPFS(cid) {
    try {
        const stream = ipfs.cat(cid);
        let data = [];
        for await (const chunk of stream) {
            data.push(chunk);
        }
        const encryptedData = Buffer.concat(data);
        const iv = Buffer.from(AES_IV, "hex");
        return decryptData(encryptedData, iv);
    } catch (error) {
        console.error("Lỗi khi lấy file từ IPFS:", error);
        return null;
    }
}

module.exports = { uploadToIPFS, getFileFromIPFS, hashImage };
