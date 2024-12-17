import { createSlice } from "@reduxjs/toolkit";
import { getUserDetails } from "../actions/userActions";

const initialState = {
  userDetails: {
    id: null,
    email: null,
    role: null,
  },
  appAccessToken: null,
};

const userSlice = createSlice({
  name: "userSlice",
  initialState,
  reducers: {
    setAppAccessToken(state, action) {
      state.appAccessToken = action.payload;
    },
    setUserDetails(state, action) {
      state.userDetails = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(getUserDetails.pending, (state, action) => {});
  },
});

export const { setUserDetails, setAppAccessToken } = userSlice.actions;
const userSliceReducer = userSlice.reducer;
export default userSliceReducer;
