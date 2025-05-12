/**
 * JavaScript code to test processing a single image using the Certificate Recognition API.
 * Ensure that the API is running at http://192.168.1.10:6000 before running this script.
 * 
 * Dependencies:
 *   npm install axios form-data
 */

const axios = require('axios');
const fs = require('fs');
const FormData = require('form-data');

const API_URL = "http://blockchain.onlineai.vn:6000";

/**
 * Test processing one image by sending it to the /process endpoint.
 * @param {string} imagePath - The path to the image file.
 */
async function testProcessImage(imagePath) {
  try {
    // Check if the file exists
    if (!fs.existsSync(imagePath)) {
      console.error(`Error: File "${imagePath}" does not exist.`);
      return;
    }
    
    // Create a FormData object and append the image file.
    const form = new FormData();
    form.append('file', fs.createReadStream(imagePath));

    console.log(`Sending "${imagePath}" to ${API_URL}/process...`);
    
    // Send POST request to the /process endpoint.
    const response = await axios.post(`${API_URL}/process`, form, {
      headers: form.getHeaders()
    });

    console.log("Response Status:", response.status);
    console.log("Response Data:", JSON.stringify(response.data, null, 2));
  } catch (error) {
    console.error("Error during process image request:", error.message);
    if (error.response) {
      console.error("Response Data:", error.response.data);
    }
  }
}

// Replace 'test.jpg' with the actual path to your image file.
const IMAGE_PATH = "t1.png";

// Execute the test
testProcessImage(IMAGE_PATH);