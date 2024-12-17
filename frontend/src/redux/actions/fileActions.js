import { createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../utils/axiosInstance";
import axios from "axios";

// Upoad file action
export const uploadFile = createAsyncThunk(
  "uploadFile",
  async ({ file, fileName }, { rejectWithValue }) => {
    try {
      // Prepare the form data
      const formData = new FormData();
      formData.append("file", file);
      formData.append("fileName", fileName);

      // Make the API request
      const { data } = await axiosInstance.post(
        `${import.meta.env.VITE_BACKEND_SERVER}/file/upload`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      // Handle response
      if (data.success) {
        return data.receivedData;
      } else {
        return rejectWithValue(data);
      }
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Fetch user files action
export const fetchUserFiles = createAsyncThunk(
  "fetchUserFiles",
  async (_, { rejectWithValue }) => {
    try {
      // Make the API request to fetch user files
      const { data } = await axiosInstance.post(
        `${import.meta.env.VITE_BACKEND_SERVER}/file/user-files`,
        {}
      );

      // Handle response
      if (data.success) {
        return data.receivedData; // Assuming 'files' is the response containing user files
      } else {
        return rejectWithValue(data);
      }
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Generate link action
export const generateShareLink = createAsyncThunk(
  "generateShareLink",
  async ({ fileId, sharedWith, expiryTime }, { rejectWithValue }) => {
    try {
      // Make the API request to fetch user files
      const { data } = await axiosInstance.post(
        `${import.meta.env.VITE_BACKEND_SERVER}/file/generate-link`,
        { fileId, sharedWith, expiryTime }
      );

      // Handle response
      if (data.success) {
        return data; // Assuming 'files' is the response containing user files
      } else {
        return rejectWithValue(data);
      }
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Download file action
export const downloadFile = createAsyncThunk(
  "downloadFile",
  async ({ linkId, fileId, fileName, user }, { rejectWithValue }) => {
    console.log(fileId);
    
    try {
      // Make the API request to fetch user files
      const { data } = await axios.post(
        `${import.meta.env.VITE_BACKEND_SERVER}/file/download`,
        { linkPermissionId: linkId, fileId, user },
        {
          responseType: "arraybuffer", // We need binary data for file download
        }
      );

      // Create a Blob from the data returned
      const blob = new Blob([data], { type: "application/octet-stream" }); // Adjust MIME type if necessary

      // Create a link element to trigger the download
      const downloadUrl = URL.createObjectURL(blob);
      const link = document.createElement("a");

      link.href = downloadUrl;
      link.download = fileName; // Use the file name from the backend response
      link.click(); // Trigger the download
      URL.revokeObjectURL(downloadUrl); // Clean up the object URL
    } catch (error) {
      console.log(error);
    }
  }
);

// Delete file action
export const deleteFile = createAsyncThunk(
  "downloadFile",
  async ({ fileId }, { rejectWithValue }) => {
    try {
      // Make the API request to fetch user files
      const { data } = await axiosInstance.post(
        `${import.meta.env.VITE_BACKEND_SERVER}/file/delete-file`,
        { fileId }
      );

      if (data.success) {
        return data;
      } else {
        rejectWithValue(data.message);
      }
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);
