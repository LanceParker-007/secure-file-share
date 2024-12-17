import OtpVerification from "../models/otpVerification.model.js";
import User from "../models/user.model.js";
import EmailService from "../utils/emailService.js";
import { generateOTP } from "../utils/otpUtils.js";
import { ResponseHandler } from "../utils/responseHandler.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

// Signup Controller
export const signup = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res
        .status(400)
        .json({ message: "User already exists. Please sign in." });
    }

    // Hash the password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Create a new user
    const newUser = new User({
      email,
      password: hashedPassword, // Store hashed password
      role: "user",
      isVerified: false,
    });

    await newUser.save();

    // Generate OTP
    const otp = generateOTP();

    // Save OTP to verification collection
    const otpVerification = new OtpVerification({
      email,
      otp,
    });

    await otpVerification.save();

    // Send OTP via email
    console.log(
      `Commenting the email sending service as because as soon as 
      I push my compose file to github my sendgrid apikey gets exposed and the service starts failing. 
      So please take the code from here: ${otp}`
    );
    // await EmailService.sendOTPEmail(email, otp);

    res.status(200).json({
      success: true,
      message: "Signup successful. OTP sent to your email for verification.",
      email: newUser.email,
    });
  } catch (error) {
    res.status(500).json({
      message: "Signup failed. Please try again later.",
      error: error.message,
    });
  }
};

// OTP Verification Controller (unchanged)
export const verifyOTP = async (req, res) => {
  try {
    const { email, otp } = req.body;

    // Find OTP verification record
    const otpRecord = await OtpVerification.findOne({ email, otp });

    if (!otpRecord) {
      await User.deleteOne({ email });
      return res.status(400).json({ message: "Invalid OTP." });
    }

    // Check if OTP is older than 10 minutes
    const currentTime = new Date();
    const otpCreatedTime = otpRecord.createdAt;
    const timeDifferenceInMinutes =
      (currentTime - otpCreatedTime) / (1000 * 60);

    if (timeDifferenceInMinutes > 10) {
      // Delete the expired OTP record
      await OtpVerification.deleteOne({ email, otp });
      return ResponseHandler.error(res, "OTP has expired", 400);
    }

    // Update user as verified
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    user.isVerified = true;
    await user.save();

    // Delete OTP record
    await OtpVerification.deleteOne({ email, otp });

    // Generate JWT
    const jwtPayload = {
      id: user._id,
      role: user.role,
    };

    const token = jwt.sign(jwtPayload, process.env.JWT_SECRET, {
      expiresIn: "6h",
    });

    return ResponseHandler.success(res, "Verification Successful", {
      id: user._id,
      email: user.email,
      role: user.role,
      token: token,
    });
  } catch (error) {
    res.status(500).json({
      message: "OTP verification failed. Please try again later.",
      error: error.message,
    });
  }
};

// Signin Controller
export const signin = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if user exists
    const user = await User.findOne({ email });

    if (!user) {
      return res
        .status(404)
        .json({ message: "User not found. Please sign up." });
    }

    // Compare passwords using bcrypt
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return ResponseHandler.error(res, "Invalid credentials.", 401);
    }

    // Generate JWT
    const jwtPayload = {
      id: user._id,
      role: user.role,
    };

    const token = jwt.sign(jwtPayload, process.env.JWT_SECRET, {
      expiresIn: "6h",
    });

    return ResponseHandler.success(res, "Signin successful", {
      id: user._id,
      email: user.email,
      role: user.role,
      token: token,
    });
  } catch (error) {
    return ResponseHandler.error(
      res,
      "Signin failed. Please try again later.",
      error
    );
  }
};
