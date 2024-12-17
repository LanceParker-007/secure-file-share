import mongoose from "mongoose";

const linkPermissionSchema = new mongoose.Schema(
  {
    fileId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "File", // Reference to the File
      required: true,
    },
    fileName: {
      type: "String",
      required: true,
    },
    ownerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // Reference to the User who owns the file
      required: true,
    },
    uniqueLink: {
      type: [String], // The email or user ID of the person the file is shared with
      required: true,
    },
    encryptionKey: {
      type: String, // Encrypted key used for AES encryption
      required: true,
    },
    sharedWith: {
      type: [String], // The email or user ID of the person the file is shared with
      required: true,
    },
    expiresAt: {
      type: Date, // Expiry date for the sharing link
      required: true,
    },
  },
  { timestamps: true } // Adds createdAt and updatedAt
);

const LinkPermission = mongoose.model("LinkPermission", linkPermissionSchema);
export default LinkPermission;
