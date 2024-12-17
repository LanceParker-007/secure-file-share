import express from "express";
import { signin, signup, verifyOTP } from "../controllers/user.controller.js";

const userRouter = express.Router();

// signup
userRouter.post("/signup", signup);

// verify otp
userRouter.post("/verify-otp", verifyOTP);

// signin
userRouter.post("/signin", signin);

export default userRouter;
