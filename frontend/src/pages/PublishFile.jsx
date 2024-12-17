import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { uploadFile } from "../redux/actions/fileActions"; // Adjust the import based on your file structure

const PublishFile = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [selectedFile, setSelectedFile] = useState(null);
  const [fileName, setFileName] = useState("");
  const [uploadStatus, setUploadStatus] = useState("");

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setSelectedFile(file);
    setFileName(file.name); // Autofill with the uploaded file name
  };

  const handleUpload = () => {
    if (!selectedFile) {
      setUploadStatus("Please select a file to upload.");
      return;
    }

    // Dispatch the upload action
    dispatch(uploadFile({ file: selectedFile, fileName }))
      .unwrap()
      .then(() => {
        setUploadStatus("File uploaded successfully! ");
        navigate("/profile");
      })
      .catch((error) => {
        setUploadStatus(`Upload failed: ${error}`);
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
              className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-600 hover:file:bg-indigo-100 mt-2"
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
                className="block w-full mt-2 rounded-lg border border-gray-300 p-2 text-sm focus:ring focus:ring-indigo-200 focus:border-indigo-500"
              />
            </label>
          )}
          {/* Upload Button */}
          <button
            onClick={handleUpload}
            className="w-full px-4 py-2 bg-indigo-600 text-white font-semibold rounded-lg shadow-md hover:bg-indigo-500 transition"
          >
            Upload File
          </button>
          {/* Status Message */}
          {uploadStatus && (
            <p className="text-sm text-center text-gray-500 mt-2">
              {uploadStatus}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default PublishFile;
