import { convertFile } from "./conversionEngine";
import fs from "fs";
import path from "path";

async function runTests() {
  console.log("=== SHIFTER BACKEND INTEGRITY TEST ===");
  
  // 1. Text to PDF Conversion Test
  try {
    console.log("\nTesting TXT to PDF conversion...");
    const textBuffer = Buffer.from("Hello world, this is a test text file from Shifter conversion engine test suite.");
    const res = await convertFile(textBuffer, "test.txt", "txt", "pdf");
    console.log("✅ Success! Output file name:", res.fileName);
    console.log("Mime-Type:", res.mimeType);
    console.log("Output buffer size:", res.buffer.length, "bytes");
  } catch (err) {
    console.error("❌ Failed TXT to PDF:", err);
  }

  // 2. Photo Size Compression Test
  try {
    console.log("\nTesting Image Compression (Photo Size Compressor)...");
    // 1x1 pixel PNG transparent image buffer
    const pngBuffer = Buffer.from([
      137, 80, 78, 71, 13, 10, 26, 10, 0, 0, 0, 13, 73, 72, 68, 82, 0, 0, 0, 1,
      0, 0, 0, 1, 8, 6, 0, 0, 0, 31, 21, 196, 137, 0, 0, 0, 10, 73, 68, 65, 84,
      120, 156, 99, 0, 1, 0, 0, 5, 0, 1, 13, 10, 45, 180, 0, 0, 0, 0, 73, 69,
      78, 68, 174, 66, 96, 130
    ]);
    const res = await convertFile(pngBuffer, "test.png", "png", "webp", { tool: "photocompress", quality: 50 });
    console.log("✅ Success! Output file name:", res.fileName);
    console.log("Mime-Type:", res.mimeType);
    console.log("Output buffer size:", res.buffer.length, "bytes");
  } catch (err) {
    console.error("❌ Failed Image compression:", err);
  }

  // 3. QR Generator Test
  try {
    console.log("\nTesting QR Generator...");
    const textBuffer = Buffer.from("https://shifter.app");
    const res = await convertFile(textBuffer, "test.txt", "txt", "qr");
    console.log("✅ Success! Output file name:", res.fileName);
    console.log("Mime-Type:", res.mimeType);
    console.log("Output buffer size:", res.buffer.length, "bytes");
  } catch (err) {
    console.error("❌ Failed QR Generator:", err);
  }

  // 4. PDF Compressor Test
  try {
    console.log("\nTesting PDF Compressor...");
    // Let's create a minimal PDF buffer using the TXT to PDF converter first
    const textBuffer = Buffer.from("Simple text inside a PDF.");
    const pdfOutput = await convertFile(textBuffer, "test.txt", "txt", "pdf");
    
    // Now compress it
    const res = await convertFile(pdfOutput.buffer, "test.pdf", "pdf", "pdf", { tool: "pdfcompress" });
    console.log("✅ Success! Output file name:", res.fileName);
    console.log("Mime-Type:", res.mimeType);
    console.log("Output buffer size:", res.buffer.length, "bytes");

    // PDF to DOCX test
    console.log("\nTesting PDF to DOCX...");
    const docxRes = await convertFile(pdfOutput.buffer, "test.pdf", "pdf", "docx");
    console.log("✅ Success! Output file name:", docxRes.fileName);
    console.log("Mime-Type:", docxRes.mimeType);
    console.log("Output buffer size:", docxRes.buffer.length, "bytes");
    
    // PDF to TXT test
    console.log("\nTesting PDF to TXT...");
    const txtRes = await convertFile(pdfOutput.buffer, "test.pdf", "pdf", "txt");
    console.log("✅ Success! Output file name:", txtRes.fileName);
    console.log("Mime-Type:", txtRes.mimeType);
    console.log("Output buffer size:", txtRes.buffer.length, "bytes");
    console.log("Extracted text:", JSON.stringify(txtRes.buffer.toString()));
  } catch (err) {
    console.error("❌ Failed PDF Converter tests:", err);
  }

  console.log("\n=== ALL TESTS FINISHED ===");
}

runTests();
