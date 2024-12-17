import { createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../utils/axiosInstance";

export const getUserDetails = createAsyncThunk(
  "getUserDetails",
  async (rejectWithValue) => {
    try {
      const { data } = await axiosInstance.post(
        `${import.meta.env.VITE_BACKEND_SERVER}/api/v1/user/profile`,
        {}
      );

      if (data.success) {
        return data.data;
      } else {
        rejectWithValue(data);
      }
    } catch (error) {
      rejectWithValue(error.message);
    }
  }
);
