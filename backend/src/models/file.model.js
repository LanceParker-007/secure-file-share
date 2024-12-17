import mongoose from "mongoose";

const fileSchema = new mongoose.Schema(
  {
    ownerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // Reference to the User who owns the file
      required: true,
    },
    fileName: {
      type: String,
      required: true,
    },
    filePath: {
      type: String,
      required: true,
    },
    encryptionKey: {
      type: String, // Encrypted key used for AES encryption
      required: true,
    },
  },
  { timestamps: true } // Adds createdAt and updatedAt
);

const File = mongoose.model("File", fileSchema);
export default File;
