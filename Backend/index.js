const axios = require('axios');
const fs = require('fs');
const FormData = require('form-data');

// API base URL
const BASE_URL = "http://192.168.1.10:5000";

// Test health endpoint
async function testHealth() {
  try {
    const response = await axios.get(`${BASE_URL}/api/health`);
    console.log(`Health check status: ${response.status}`);
    if (response.status === 200) {
      console.log("Response:", response.data);
    } else {
      console.log("Error:", response.statusText);
    }
  } catch (error) {
    console.error("Error in health check:", error.message);
  }
}

// Test process-id endpoint
async function testProcessId(imagePath) {
  if (!fs.existsSync(imagePath)) {
    console.error(`Error: Image file not found at ${imagePath}`);
    return;
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
    console.log(`Process ID status: ${response.status}`);
    if (response.status === 200) {
      console.log("Response:", response.data);
    } else {
      console.log("Error:", response.statusText);
    }
  } catch (error) {
    console.error("Error in process-id:", error.message);
  }
}

async function main() {
  console.log("Testing CCCD API...");
  await testHealth();

  // Thay đổi đường dẫn file ảnh phù hợp với hệ thống của bạn
  await testProcessId("cccd_cropped_enhanced.jpg");
}

main();
