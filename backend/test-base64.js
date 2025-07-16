// Test script to verify base64 image handling
const fs = require('fs');
const path = require('path');

// Test image conversion
const testImagePath = path.join(__dirname, 'uploads', '1752689270721-732276768.jpg');

if (fs.existsSync(testImagePath)) {
    const imageBuffer = fs.readFileSync(testImagePath);
    const base64String = imageBuffer.toString('base64');
    const imageType = 'image/jpeg';

    console.log('Base64 string length:', base64String.length);
    console.log('Image type:', imageType);
    console.log('First 100 characters:', base64String.substring(0, 100));

    // Test if it can be converted back
    const recreatedBuffer = Buffer.from(base64String, 'base64');
    console.log('Original buffer length:', imageBuffer.length);
    console.log('Recreated buffer length:', recreatedBuffer.length);
    console.log('Buffers match:', imageBuffer.equals(recreatedBuffer));
} else {
    console.log('Test image not found at:', testImagePath);
}
