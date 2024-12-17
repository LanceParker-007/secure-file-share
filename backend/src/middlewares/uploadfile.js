import multer from "multer";
import crypto from "crypto";
import path from "path";
import fs from "fs/promises";

// Ensure uploads directory exists
const uploadsDir = path.join(process.cwd(), "uploads");
fs.mkdir(uploadsDir, { recursive: true }).catch(console.error);

// Generate AES encryption key
const generateEncryptionKey = () => crypto.randomBytes(32).toString("hex");

// Encrypt the file
const encryptFileBuffer = (buffer, encryptionKey) => {
  const cipher = crypto.createCipheriv(
    "aes-256-cbc",
    Buffer.from(encryptionKey, "hex"),
    Buffer.alloc(16, 0) // Initialization vector (all zeroes for simplicity)
  );
  const encrypted = Buffer.concat([cipher.update(buffer), cipher.final()]);
  return encrypted;
};

// Multer storage configuration to save files to memory
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Middleware for handling file upload
export const uploadFileMiddleware = upload.single("file");

// Middleware for file encryption
export const processFileEncryption = async (req, res, next) => {
  try {
    if (!req.file) {
      throw new Error("No file uploaded");
    }

    // Generate encryption key and encrypt the file
    const encryptionKey = generateEncryptionKey();
    const encryptedFileBuffer = encryptFileBuffer(
      req.file.buffer,
      encryptionKey
    );

    // Generate a unique filename for the encrypted file
    const encryptedFileName = `encrypted-${Date.now()}-${
      req.file.originalname
    }`;
    const encryptedFilePath = path.join(uploadsDir, encryptedFileName);

    // Save encrypted file
    await fs.writeFile(encryptedFilePath, encryptedFileBuffer);

    // Remove the original file from memory storage
    req.file.buffer = null;

    // Attach encryption details to the request object
    req.encryptionKey = encryptionKey;
    req.encryptedFilePath = encryptedFilePath;

    next();
  } catch (error) {
    next(error);
  }
};
