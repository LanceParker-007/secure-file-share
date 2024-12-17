import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { FiUpload, FiLoader } from "react-icons/fi";
import { uploadFile } from "../redux/actions/fileActions";

const PublishFile = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [selectedFile, setSelectedFile] = useState(null);
  const [fileName, setFileName] = useState("");
  const [uploadStatus, setUploadStatus] = useState("");
  const [isUploading, setIsUploading] = useState(false);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setSelectedFile(file);
    setFileName(file.name); // Autofill with the uploaded file name
    setUploadStatus(""); // Clear any previous status messages
  };

  const handleUpload = () => {
    if (!selectedFile) {
      setUploadStatus("Please select a file to upload.");
      return;
    }

    // Set uploading state
    setIsUploading(true);
    setUploadStatus("");

    // Dispatch the upload action
    dispatch(uploadFile({ file: selectedFile, fileName }))
      .unwrap()
      .then(() => {
        setUploadStatus("File uploaded successfully!");
        setIsUploading(false);
        navigate("/profile");
      })
      .catch((error) => {
        setUploadStatus(`Upload failed: ${error}`);
        setIsUploading(false);
      });
  };

  return (
    <div className="h-screen w-screen flex items-center justify-center bg-gradient-to-br from-indigo-100 to-white">
      <div className="bg-white rounded-lg shadow-md p-6 w-full max-w-md">
        <h1 className="text-2xl font-bold text-indigo-600 text-center mb-4">
          Upload Your File
        </h1>
        <p className="text-sm text-gray-500 text-center mb-6">
          Select a file and give it a name if you'd like.
        </p>
        <div className="space-y-4">
          {/* File Input */}
          <label className="block">
            <span className="text-gray-700 font-medium">Choose a file:</span>
            <input
              type="file"
              onChange={handleFileChange}
              disabled={isUploading}
              className="block w-full text-sm text-gray-500 
                file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 
                file:text-sm file:font-semibold file:bg-indigo-50 
                file:text-indigo-600 hover:file:bg-indigo-100 
                mt-2 disabled:opacity-50 disabled:cursor-not-allowed"
            />
          </label>

          {/* File Name Input */}
          {selectedFile && (
            <label className="block">
              <span className="text-gray-700 font-medium">File Name:</span>
              <input
                type="text"
                value={fileName}
                onChange={(e) => setFileName(e.target.value)}
                disabled={isUploading}
                className="block w-full mt-2 rounded-lg border border-gray-300 p-2 text-sm 
                  focus:ring focus:ring-indigo-200 focus:border-indigo-500
                  disabled:opacity-50 disabled:cursor-not-allowed"
              />
            </label>
          )}

          {/* Upload Button with Loading State */}
          <motion.button
            onClick={handleUpload}
            disabled={!selectedFile || isUploading}
            whileTap={{ scale: 0.95 }}
            className={`
              w-full px-4 py-2 rounded-lg shadow-md transition 
              flex items-center justify-center
              ${
                isUploading
                  ? "bg-indigo-400 cursor-not-allowed"
                  : "bg-indigo-600 hover:bg-indigo-500 text-white"
              }
              ${!selectedFile ? "opacity-50 cursor-not-allowed" : ""}
            `}
          >
            {isUploading ? (
              <>
                <svg className="animate-spin h-5 w-5 mr-3" viewBox="0 0 24 24">
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Uploading...
              </>
            ) : (
              <>
                <FiUpload className="mr-2" />
                Upload File
              </>
            )}
          </motion.button>

          {/* Status Message */}
          {uploadStatus && (
            <p
              className={`
                text-sm text-center mt-2 
                ${
                  uploadStatus.includes("failed")
                    ? "text-red-500"
                    : "text-green-500"
                }
              `}
            >
              {uploadStatus}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default PublishFile;
