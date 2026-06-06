import fs from "fs";
import path from "path";

async function testApi() {
  const PORT = 3000;
  const baseUrl = `http://localhost:${PORT}`;
  console.log(`=== SHIFTER API INTEGRITY TEST ===`);
  console.log(`Target: ${baseUrl}/api/convert`);

  try {
    // 1. Create a dummy text file to convert to PDF
    const dummyText = "This is some dummy text to test the Shifter API file upload and conversion pipeline.";
    const tempFile = path.join(process.cwd(), "uploads", "temp_test_file.txt");
    
    // Ensure uploads directory exists
    if (!fs.existsSync(path.dirname(tempFile))) {
      fs.mkdirSync(path.dirname(tempFile), { recursive: true });
    }
    fs.writeFileSync(tempFile, dummyText);
    
    // Read file as blob or construct form data
    const fileBuffer = fs.readFileSync(tempFile);
    const blob = new Blob([fileBuffer], { type: "text/plain" });
    
    const formData = new FormData();
    formData.append("file", blob, "temp_test_file.txt");
    formData.append("toFormat", "pdf");
    formData.append("userId", "mock-user-123");
    
    console.log("Sending POST request to /api/convert (TXT to PDF)...");
    const response = await fetch(`${baseUrl}/api/convert`, {
      method: "POST",
      body: formData,
    });
    
    const json = await response.json();
    console.log("Status Code:", response.status);
    console.log("Response JSON:", json);
    
    if (json.success && json.downloadUrl) {
      console.log("✅ API Conversion works successfully!");
      
      // Try downloading the converted file
      console.log(`Downloading converted file from ${baseUrl}${json.downloadUrl}...`);
      const downloadResponse = await fetch(`${baseUrl}${json.downloadUrl}`);
      console.log("Download Status:", downloadResponse.status);
      
      if (downloadResponse.status === 200) {
        console.log("✅ API Download works successfully!");
      } else {
        console.error("❌ Failed to download converted file.");
      }
    } else {
      console.error("❌ API Conversion failed:", json.error || "Unknown error");
    }
    
    // Clean up local temp file
    if (fs.existsSync(tempFile)) {
      fs.unlinkSync(tempFile);
    }
  } catch (err: any) {
    console.error("❌ API Test encountered an error:", err.message);
  }
}

// Delay test by 2 seconds to allow server boot
setTimeout(testApi, 2000);
