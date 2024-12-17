import express from "express";
import protect from "../middlewares/authmiddleware.js";
import {
  fetchUserData,
  signin,
  signup,
  verifyOTP,
} from "../controllers/user.controller.js";

const userRouter = express.Router();

// signup
userRouter.post("/signup", signup);

// verify otp
userRouter.post("/verify-otp", verifyOTP);

// signin
userRouter.post("/signin", signin);

// Fetch user profile
userRouter.post("/profile", protect, fetchUserData);

export default userRouter;
