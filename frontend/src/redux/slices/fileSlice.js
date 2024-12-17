import { createSlice } from "@reduxjs/toolkit";
import {
  fetchUserFiles,
  generateShareLink,
  uploadFile,
} from "../actions/fileActions";

const initialState = {
  filename: "",
  userFiles: [],
  generatedLinkData: "",
  isLoading: false,
  successMessage: "",
  errorMessage: "",
};

const fileSlice = createSlice({
  name: "fileSlice",
  initialState,
  reducers: {
    setFilename(state, action) {
      state.filename = action.payload;
    },
    setUserFiles(state, action) {
      state.userFiles = action.payload;
    },
    setGeneratedLinkData(state, action) {
      state.generatedLinkData = action.payload;
    },
    setIsLoading(state, action) {
      state.isLoading = action.payload;
    },
    setSuccessMessage(state, action) {
      state.successMessage = action.payload;
    },
    setErrorMessage(state, action) {
      state.errorMessage = action.payload;
    },
    setMessagesEmpty(state, action) {
      state.successMessage = "";
      state.errorMessage = "";
    },
  },
  extraReducers: (builder) => {
    builder
      // handling upload file action
      .addCase(uploadFile.pending, (state, action) => {
        state.isLoading = true;
      })
      .addCase(uploadFile.fulfilled, (state, action) => {
        state.isLoading = false;
        state.successMessage = action.payload.message;
        state.filename = action.payload.filename;
      })
      .addCase(uploadFile.rejected, (state, action) => {
        state.isLoading = false;
        state.errorMessage = action.payload.message;
      })

      // handling fetching user files action
      .addCase(fetchUserFiles.pending, (state, action) => {
        state.isLoading = true;
      })
      .addCase(fetchUserFiles.fulfilled, (state, action) => {
        state.isLoading = false;
        state.successMessage = action.payload.message;
        state.userFiles = action.payload.files;
      })
      .addCase(fetchUserFiles.rejected, (state, action) => {
        state.isLoading = false;
        state.errorMessage = action.payload.message;
      })

      // handling generate sharable Link action
      .addCase(generateShareLink.pending, (state, action) => {
        state.isLoading = true;
      })
      .addCase(generateShareLink.fulfilled, (state, action) => {
        state.isLoading = false;
        state.successMessage = action.payload.message;
        state.generatedLinkData = action.payload.receivedData;
      })
      .addCase(generateShareLink.rejected, (state, action) => {
        state.isLoading = false;
        state.errorMessage = action.payload.message;
      });
  },
});

export const {
  setFilename,
  setUserFiles,
  setGeneratedLinkData,
  setIsLoading,
  setSuccessMessage,
  setErrorMessage,
  setMessagesEmpty,
} = fileSlice.actions;
const fileSliceReducer = fileSlice.reducer;
export default fileSliceReducer;
