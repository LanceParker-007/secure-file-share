import File from "../models/file.model.js";
import { ResponseHandler } from "../utils/responseHandler.js";
import LinkPermission from "../models/linkPermission.model.js";
import crypto from "crypto";
import fs from "fs/promises";
import path from "path";

// upload file controller
export const uploadFile = async (req, res) => {
  try {
    const { id: userId } = req.user;
    const { fileName } = req.body;

    // Validate file upload
    if (!req.file) {
      return ResponseHandler.error(res, "No file uploaded");
    }

    // Validate encrypted file path
    if (!req.encryptedFilePath) {
      return ResponseHandler.error(res, "Encrypted file path is missing");
    }

    // Save file metadata to DB
    const newFile = await File.create({
      ownerId: userId,
      fileName,
      originalFileName: req.file.originalname,
      filePath: req.encryptedFilePath, // Store full path to encrypted file
      encryptionKey: req.encryptionKey,
    });

    return ResponseHandler.success(res, "File uploaded successfully!", newFile);
  } catch (error) {
    console.error("File Upload Error:", error);
    return ResponseHandler.error(res, "File upload failed! " + error.message);
  }
};

// Controller for fetching user's uploaded files
export const getUserFiles = async (req, res) => {
  try {
    const { id: userId } = req.user;

    const files = await File.find({ ownerId: userId }).select(
      "fileName originalFileName"
    );

    if (!files || files.length === 0) {
      return ResponseHandler.success(res, "User has not uploaded any files!", {
        files: [],
      });
    }

    return ResponseHandler.success(res, "Files fetched successfully", {
      files,
    });
  } catch (error) {
    return ResponseHandler.error(
      res,
      "Failed to fetch files! " + error.message
    );
  }
};

// Generate sharable link
export const generateSharableLink = async (req, res) => {
  try {
    let { fileId, sharedWith = [], expiryTime } = req.body;

    sharedWith = sharedWith.filter((item) => item !== "");

    const expiryTimes = {
      "10mins": 600,
      "1hr": 3600,
      "1day": 86400,
    };
    const expiryInSeconds = expiryTimes[expiryTime];
    if (!expiryInSeconds) {
      return ResponseHandler.error(res, "Invalid expiry time provided!");
    }

    const file = await File.findById(fileId);
    if (!file) {
      return ResponseHandler.error(res, "File not found!");
    }

    if (file.ownerId.toString() !== req.user.id) {
      return ResponseHandler.error(
        res,
        "You do not have permission to share this file!"
      );
    }

    const expiresAt = new Date(Date.now() + expiryInSeconds * 1000);

    // Generate a unique link token instead of signed URL
    const linkToken = crypto.randomBytes(32).toString("hex");

    // Create LinkPermission record
    const LinkDetails = await LinkPermission.create({
      fileId,
      fileName: file.fileName,
      ownerId: req.user.id,
      uniqueLink: linkToken,
      encryptionKey: file.encryptionKey,
      sharedWith: sharedWith?.length > 0 ? sharedWith : [],
      expiresAt,
    });

    // Respond with the shareable link
    return ResponseHandler.success(
      res,
      "Sharable link generated successfully!",
      `${process.env.FRONTEND_URI}/file/${LinkDetails._id}`
    );
  } catch (error) {
    console.error("Sharable Link Generation Error:", error);
    return ResponseHandler.error(
      res,
      "Failed to generate sharable link.",
      error
    );
  }
};

// Get Link Details
export const getLinkDetails = async (req, res) => {
  try {
    const { linkPermissionId } = req.body;

    const linkDetails = await LinkPermission.findById(
      linkPermissionId
    ).populate({
      path: "fileId",
      populate: { path: "ownerId", select: "email" },
    });

    if (!linkDetails) {
      return ResponseHandler.error(res, "Invalid or expired link.");
    }

    const currentTime = new Date();

    if (linkDetails.expiresAt < currentTime) {
      return ResponseHandler.success(
        res,
        "Link has expired. Please ask to share the link again!",
        {
          fileId: "link expired",
          fileName: "link expired",
          ownerId: "link expired",
        }
      );
    }

    // Prepare response with file details
    const responseData = {
      fileId: linkDetails.fileId._id,
      fileName: linkDetails.fileName,
      ownerId: linkDetails.ownerId,
      originalFileName: linkDetails.fileName,
      expiresAt: linkDetails.expiresAt,
    };

    return ResponseHandler.success(
      res,
      "File details fetched successfully.",
      responseData
    );
  } catch (error) {
    console.error("Error fetching link details:", error);
    return ResponseHandler.error(
      res,
      "Failed to fetch link details. " + error.message
    );
  }
};

// Decrypt file function
const decryptFile = (encryptedData, encryptionKey) => {
  try {
    const iv = Buffer.alloc(16, 0);
    const decipher = crypto.createDecipheriv(
      "aes-256-cbc",
      Buffer.from(encryptionKey, "hex"),
      iv
    );

    const decrypted = Buffer.concat([
      decipher.update(encryptedData),
      decipher.final(),
    ]);

    return decrypted;
  } catch (error) {
    throw new Error("Error decrypting file: " + error.message);
  }
};

// Download the file
export const downloadFile = async (req, res) => {
  try {
    const { linkPermissionId, fileId, user } = req.body;

    let linkPermission = null;

    if (!fileId) {
      linkPermission = await LinkPermission.findOne({ _id: linkPermissionId });

      if (!user || !user.id) {
        if (!linkPermission || linkPermission.expiresAt < new Date()) {
          return res.status(400).json({ error: "Invalid or expired link." });
        }
      }
    }

    const file = await File.findById(fileId || linkPermission.fileId);

    if (!file) {
      return ResponseHandler.error(res, "File not found.", 404);
    }

    // Check download permissions
    const isOwner =
      (user && user.id === linkPermission?.ownerId.toString()) ||
      (user && user.id === file?.ownerId.toString()) ||
      (user && user.role === "admin");

    const isSharedWithUser =
      !fileId &&
      (linkPermission.sharedWith.length === 0 ||
        (user && linkPermission.sharedWith.includes(user.email)) ||
        linkPermission.sharedWith.includes(user.email));

    if (!isOwner && !isSharedWithUser) {
      return ResponseHandler.error(
        res,
        "You do not have permission to download this file.",
        403
      );
    }

    // Additional validation for file path
    if (!file.filePath) {
      return res.status(400).json({
        error:
          "File path is missing. File may not have been uploaded correctly.",
        fileDetails: file,
      });
    }

    // Verify file exists before reading
    try {
      await fs.access(file.filePath);
    } catch (accessError) {
      console.error("File Access Error:", accessError);
      return res.status(404).json({
        error: "File not found on server",
        path: file.filePath,
      });
    }

    // Read encrypted file directly from local storage
    const encryptedFileData = await fs.readFile(file.filePath);

    // Decrypt the file
    const decryptedFileData = decryptFile(
      encryptedFileData,
      file.encryptionKey
    );

    // Set headers for downloading the file
    res.setHeader("Content-Type", "application/octet-stream");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="${file.originalFileName}"`
    );

    // Send the decrypted file data as a response
    res.send(decryptedFileData);
  } catch (error) {
    console.error("Error during file download:", error);
    res.status(500).json({
      error: "Failed to download the file.",
      details: error.message,
      stack: error.stack,
    });
  }
};

// Delete file
export const deleteFile = async (req, res) => {
  try {
    const { id: userId } = req.user;
    const { fileId } = req.body;

    // Fetch the file metadata
    const file = await File.findOne({ _id: fileId, ownerId: userId });

    // console.log("User ID:", userId);
    // console.log("File ID:", fileId);
    // console.log("File Details:", file);

    if (!file) {
      return ResponseHandler.error(
        res,
        "File not found or unauthorized access"
      );
    }

    // Path to the stored file
    const filePath = file?.filePath;

    // console.log("File Path:", filePath);

    // Check if file exists and delete
    try {
      // Use access to check file existence
      await fs.access(filePath);

      // If access succeeds, delete the file
      await fs.unlink(filePath);
      // console.log("File deleted successfully");
    } catch (fileError) {
      // If access fails, it means file doesn't exist
      if (fileError.code === "ENOENT") {
        console.log("File does not exist, skipping file system deletion");
      } else {
        console.error("File access/delete error:", fileError);
        // Throw the error if it's not a "file not found" error
        throw fileError;
      }
    }

    // Remove the file metadata from the database
    await File.deleteOne({ _id: fileId });

    // Return success response
    return ResponseHandler.success(res, "File deleted successfully");
  } catch (error) {
    console.error("Full Error:", error);
    return ResponseHandler.error(
      res,
      "Failed to delete file! " + error.message
    );
  }
};
