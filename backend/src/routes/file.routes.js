import express from "express";
import {
  deleteFile,
  downloadFile,
  generateSharableLink,
  getLinkDetails,
  getUserFiles,
  uploadFile,
} from "../controllers/file.controller.js";
import {
  processFileEncryption,
  uploadFileMiddleware,
} from "../middlewares/uploadfile.js";
import protect from "../middlewares/authmiddleware.js";

const fileRouter = express.Router();

// upload encrypted file
fileRouter.post(
  "/upload",
  protect,
  uploadFileMiddleware,
  processFileEncryption,
  uploadFile
);

// get all files of a user
fileRouter.post("/user-files", protect, getUserFiles);

// generate sharable link
fileRouter.post("/generate-link", protect, generateSharableLink);

// get link details
fileRouter.post("/details", getLinkDetails);

// download file
fileRouter.post("/download", downloadFile);

// delete file
fileRouter.post("/delete-file", protect, deleteFile);
export default fileRouter;
