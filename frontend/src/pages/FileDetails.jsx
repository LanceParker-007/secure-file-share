import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { FiShare2, FiDownload } from "react-icons/fi";
import { motion } from "framer-motion";
import axios from "axios";

import { useDispatch, useSelector } from "react-redux";
import { downloadFile } from "../redux/actions/fileActions";

const handleShare = (repo) => {
  if (navigator.share) {
    navigator
      .share({
        title: repo.title,
        text: repo?.description?.substring(0, 60),
        url: window.location.href,
      })
      .then(() => console.log("Shared successfully!"))
      .catch((error) => console.log("Error sharing:", error));
  } else {
    console.log("Share API not supported");
  }
};

const ShareButton = ({ repoDetails }) => {
  return (
    <motion.button
      whileTap={{ scale: 0.95 }}
      className="bg-gray-200 text-indigo-600 px-4 py-2 rounded-md hover:bg-gray-300 flex items-center"
      onClick={() => handleShare(repoDetails)}
    >
      <FiShare2 className="mr-2" />
      Share
    </motion.button>
  );
};

const FileDetails = () => {
  const dispatch = useDispatch();
  const { linkId } = useParams();
  const [fileDetails, setFileDetails] = useState({
    fileName: "",
  });
  const [loading, setLoading] = useState(true);
  const [downloadLoading, setDownloadLoading] = useState(false);
  const [error, setError] = useState(null);

  // Get current user from the Redux store
  const { userDetails: user } = useSelector((state) => state.userSliceReducer);

  useEffect(() => {
    const fetchFileDetails = async () => {
      try {
        let { data } = await axios.post(
          `${import.meta.env.VITE_BACKEND_SERVER}/file/details`,
          {
            linkPermissionId: linkId,
          }
        );

        if (data.success) {
          setFileDetails(data.receivedData);
        }
      } catch (error) {
        console.error("Error fetching file details:", error);
        setError("Failed to fetch file details. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchFileDetails();
  }, [linkId]);

  const handleDownload = async () => {
    // Reset previous errors
    setError(null);

    // Check if file name is valid
    if (fileDetails.fileName === "link expired") {
      setError("Download link has expired.");
      return;
    }

    // Start download loading
    setDownloadLoading(true);

    try {
      // Dispatch download action
      await dispatch(
        downloadFile({
          linkId,
          fileName: fileDetails.fileName,
          user,
        })
      );
    } catch (downloadError) {
      // Handle specific download errors
      console.error("Download error:", downloadError);

      // Check if error response exists
      if (downloadError.response) {
        // Server responded with an error
        setError(
          downloadError.response.data.message ||
            "Failed to download file. Please try again."
        );
      } else if (downloadError.request) {
        // Request made but no response received
        setError(
          "No response from server. Please check your internet connection."
        );
      } else {
        // Something happened in setting up the request
        setError("An unexpected error occurred during download.");
      }
    } finally {
      // Stop download loading
      setDownloadLoading(false);
    }
  };

  // Error display component
  const ErrorDisplay = () => {
    if (!error) return null;

    return (
      <div
        className="mt-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded"
        role="alert"
      >
        {error}
      </div>
    );
  };

  if (loading) {
    return (
      <main className="flex-1 overflow-auto p-3 mt-16 text-center">
        Loading file details...
      </main>
    );
  }

  return user ? (
    <main className="flex-1 overflow-auto p-3 mt-16">
      <div className="max-w-xl mx-auto bg-white rounded-lg shadow-md overflow-hidden">
        {/* File Details */}
        <div className="p-6">
          <h2 className="text-3xl font-bold text-slate-800">
            Download: {fileDetails.fileName}
          </h2>

          {/* Error Display */}
          <ErrorDisplay />

          {/* Share and Download Buttons */}
          <div className="mt-6 flex flex-col gap-4 md:flex-row md:items-center">
            <ShareButton repoDetails={fileDetails} />

            <motion.button
              whileTap={{ scale: 0.95 }}
              className={`
                flex items-center justify-center
                ${
                  downloadLoading
                    ? "bg-indigo-400 cursor-not-allowed"
                    : "bg-indigo-600 hover:bg-indigo-700"
                } 
                text-white px-6 py-2 rounded-md 
                transition-colors duration-300
              `}
              onClick={handleDownload}
              disabled={downloadLoading}
            >
              {downloadLoading ? (
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
              ) : (
                <>
                  <FiDownload className="mr-2" />
                  Download File
                </>
              )}
            </motion.button>
          </div>
        </div>
      </div>
    </main>
  ) : (
    <main className="flex-1 overflow-auto p-3 mt-16">
      Please log in to access file details.
    </main>
  );
};

export default FileDetails;
