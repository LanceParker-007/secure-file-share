import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  downloadFile,
  fetchUserFiles,
  generateShareLink,
  deleteFile,
} from "../redux/actions/fileActions";
import { setGeneratedLinkData } from "../redux/slices/fileSlice";
import {
  FiClipboard,
  FiShare2,
  FiDownload,
  FiTrash2,
  FiX,
  FiLink,
} from "react-icons/fi";
import { MdSend } from "react-icons/md";

const Profile = () => {
  const dispatch = useDispatch();

  const { userDetails } = useSelector((state) => state.userSliceReducer);
  const { userFiles, generatedLinkData } = useSelector(
    (state) => state.fileSliceReducer
  );
  const [isSharing, setIsSharing] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [expiryTime, setExpiryTime] = useState("10mins");
  const [errorMessage, setErrorMessage] = useState(null);
  const [copied, setCopied] = useState(false);
  const [sharedEmails, setSharedEmails] = useState("");
  const [isGeneratingLink, setIsGeneratingLink] = useState(false);

  const handleCopyToClipboard = () => {
    if (generatedLinkData) {
      navigator.clipboard
        .writeText(generatedLinkData)
        .then(() => {
          setCopied(true);
          setTimeout(() => setCopied(false), 2000);
        })
        .catch((error) => {
          console.error("Failed to copy the link:", error);
        });
    }
  };

  useEffect(() => {
    dispatch(fetchUserFiles());
  }, [dispatch]);

  const handleShare = (file) => {
    setSelectedFile(file);
    setIsSharing(true);
  };

  const handleGenerateLink = (file) => {
    setIsGeneratingLink(true);
    dispatch(
      generateShareLink({
        fileId: file._id,
        sharedWith: sharedEmails.split(",").map((email) => email.trim()),
        expiryTime,
      })
    )
      .then(() => {
        setIsGeneratingLink(false);
      })
      .catch((error) => {
        setErrorMessage(error.message);
        setIsGeneratingLink(false);
      });
  };

  const handleDownload = (file) => {
    console.log(file);
    
    dispatch(
      downloadFile({
        linkId: null,
        fileId: file._id,
        fileName: file.fileName || "DummyFilename",
        user: userDetails,
      })
    );
    // inkId, fileName, user
  };

  const handleDelete = (fileId) => {
    if (window.confirm("Are you sure you want to delete this file?")) {
      dispatch(deleteFile({ fileId }));
    }
  };

  const handleReset = () => {
    setIsSharing(false);
    setSelectedFile(null);
    dispatch(setGeneratedLinkData(null));
    setErrorMessage(null);
    setExpiryTime("10mins");
    setSharedEmails("");
  };

  return (
    <div className="flex-1 flex flex-col overflow-hidden bg-gray-50">
      <header className="bg-white shadow-md p-6">
        <h1 className="text-2xl font-bold text-gray-800">Profile</h1>
      </header>

      <main className="flex-1 overflow-auto p-6">
        <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-6 space-y-6">
          {/* User Email Section */}
          <div className="border-b border-gray-300 pb-4">
            <h2 className="text-xl font-semibold text-gray-700">Your Email</h2>
            <p className="text-lg text-gray-500 mt-2">{userDetails.email}</p>
          </div>

          {/* Uploaded Files Section */}
          <div>
            <h3 className="text-xl font-semibold text-gray-700 mb-4">
              Uploaded Files
            </h3>
            <ul className="space-y-4">
              {userFiles.length === 0 ? (
                <li className="text-gray-500">No files uploaded yet.</li>
              ) : (
                userFiles.map((file) => (
                  <li
                    key={file._id}
                    className="bg-gray-100 p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300"
                  >
                    <div className="flex flex-col sm:flex-row justify-between items-center space-y-2 sm:space-y-0">
                      <h4 className="text-lg font-semibold text-gray-700 w-full">
                        {file.fileName}
                      </h4>
                      <div className="flex space-x-2 w-full sm:w-auto justify-center sm:justify-end">
                        <button
                          className="text-indigo-500 hover:bg-indigo-100 p-2 rounded-full"
                          onClick={() => handleShare(file)}
                          title="Share"
                        >
                          <FiShare2 size={20} />
                        </button>
                        <button
                          className="text-green-500 hover:bg-green-100 p-2 rounded-full"
                          onClick={() => handleDownload(file)}
                          title="Download"
                        >
                          <FiDownload size={20} />
                        </button>
                        <button
                          className="text-red-500 hover:bg-red-100 p-2 rounded-full"
                          onClick={() => handleDelete(file._id)}
                          title="Delete"
                        >
                          <FiTrash2 size={20} />
                        </button>
                      </div>
                    </div>
                    {/* Rest of the existing code remains the same */}
                    {isSharing && selectedFile._id === file._id && (
                      <div className="mt-4 bg-white border border-gray-300 p-4 rounded-lg shadow-inner space-y-4">
                        {/* Email Sharing Input */}
                        <div>
                          <label
                            htmlFor="shared-emails"
                            className="block text-gray-700 font-medium"
                          >
                            Share with Emails (comma-separated)
                          </label>
                          <input
                            id="shared-emails"
                            type="text"
                            placeholder="If empty anyone with the link can download the file"
                            className="mt-2 w-full p-2 border rounded-md"
                            value={sharedEmails}
                            onChange={(e) => setSharedEmails(e.target.value)}
                          />
                        </div>

                        {/* Expiry Time Dropdown */}
                        <div>
                          <label
                            htmlFor="expiry-time"
                            className="block text-gray-700 font-medium"
                          >
                            Expiry Time
                          </label>
                          <select
                            id="expiry-time"
                            className="mt-2 w-full p-2 border rounded-md"
                            value={expiryTime}
                            onChange={(e) => setExpiryTime(e.target.value)}
                          >
                            <option value="600">10 Minutes</option>
                            <option value="1hr">1 Hour</option>
                            <option value="1day">1 Day</option>
                          </select>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex justify-between items-center">
                          <button
                            className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 flex items-center"
                            onClick={() => handleGenerateLink(file)}
                            disabled={isGeneratingLink}
                          >
                            {isGeneratingLink ? (
                              <>Generating...</>
                            ) : (
                              <>
                                <FiLink className="mr-2" /> Generate Link
                              </>
                            )}
                          </button>
                          <button
                            className="text-red-500 hover:bg-red-100 p-2 rounded-full"
                            onClick={handleReset}
                            title="Reset"
                          >
                            <FiX size={20} />
                          </button>
                        </div>

                        {/* Link or Error Message */}
                        {generatedLinkData && (
                          <p className="mt-4 text-green-600 font-medium">
                            <span className="flex items-center justify-between">
                              <span className="text-indigo-600">Link:</span>
                              <button
                                onClick={handleCopyToClipboard}
                                className="ml-2 text-indigo-600 hover:text-indigo-800 flex items-center"
                              >
                                <FiClipboard className="mr-1" />
                                {copied ? "Copied!" : "Copy"}
                              </button>
                            </span>

                            <a
                              href={generatedLinkData}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="block mt-2 text-indigo-600 flex items-center justify-between max-w-4xl overflow-x-auto whitespace-nowrap bg-indigo-100 p-2 rounded-md"
                            >
                              {generatedLinkData}
                            </a>
                          </p>
                        )}
                        {errorMessage && (
                          <p className="mt-4 text-red-600 font-medium">
                            {errorMessage}
                          </p>
                        )}
                      </div>
                    )}
                  </li>
                ))
              )}
            </ul>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Profile;
