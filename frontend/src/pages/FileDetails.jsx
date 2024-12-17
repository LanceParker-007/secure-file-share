import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { FiShare2 } from "react-icons/fi";
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
        setError("Failed to fetch file details.");
      } finally {
        setLoading(false);
      }
    };

    fetchFileDetails();
  }, [linkId]);

  const handleDownload = async () => {
    setLoading(true);
    if (fileDetails.fileName === "link expired") {
      alert("Link expired!");
      return;
    }

    dispatch(downloadFile({ linkId, fileName: fileDetails.fileName, user }));
    setLoading(false);
  };

  if (error) return <div>{error}</div>;

  return user ? (
    <main className="flex-1 overflow-auto p-3 mt-16">
      <div className="max-w-xl mx-auto bg-white rounded-lg shadow-md overflow-hidden">
        {/* File Details */}
        <div className="p-6">
          <h2 className="text-3xl font-bold text-slate-800">
            Dwondload: {fileDetails.fileName}
          </h2>

          {/* Share Button*/}
          <div className="mt-6 flex flex-col gap-4 md:flex-row md:items-center">
            <ShareButton repoDetails={fileDetails} />

            <motion.button
              whileTap={{ scale: 0.95 }}
              className="bg-indigo-600 text-white px-6 py-2 rounded-md hover:bg-indigo-700"
              onClick={handleDownload}
            >
              Download File
            </motion.button>
          </div>

          {/* Download Button */}
          <div className="mt-6"></div>
        </div>
      </div>
    </main>
  ) : (
    <main className="flex-1 overflow-auto p-3 mt-16">Loading...</main>
  );
};

export default FileDetails;
