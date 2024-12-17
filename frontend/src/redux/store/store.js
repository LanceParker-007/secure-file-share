import { configureStore } from "@reduxjs/toolkit";
import userSliceReducer from "../slices/userSlice";
import fileSliceReducer from "../slices/fileSlice";

const store = configureStore({
  reducer: {
    userSliceReducer,
    fileSliceReducer,
  },
});

export default store;
