import OtpVerification from "../models/otpVerification.model.js";
import User from "../models/user.model.js";
import EmailService from "../utils/emailService.js";
import { generateOTP } from "../utils/otpUtils.js";
import { ResponseHandler } from "../utils/responseHandler.js";
import jwt from "jsonwebtoken";

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

    // Create a new user
    const newUser = new User({
      email,
      password, // Note: Hash the password later for security
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
    await EmailService.sendOTPEmail(email, otp);

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

// OTP Verification Controller
export const verifyOTP = async (req, res) => {
  try {
    const { email, otp } = req.body;

    // Find OTP verification record
    const otpRecord = await OtpVerification.findOne({ email, otp });

    if (!otpRecord) {
      await User.deleteOne({ email });
      return res.status(400).json({ message: "Invalid OTP." });
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

    // TODO: Verify password (hash comparison can be added later)
    if (user.password !== password) {
      return ResponseHandler.error(res, "Invalid credentials.", 401);
    }

    // Check if user is verified
    // if (!user.isVerified) {
    //   // Generate OTP
    //   const otp = generateOTP();

    //   // Save OTP to verification collection
    //   const otpVerification = new OtpVerification({
    //     email,
    //     otp,
    //   });

    //   await otpVerification.save();

    //   // Send OTP via email
    //   await EmailService.sendOTPEmail(email, otp);

    //   ResponseHandler.success(
    //     res,
    //     "Your email was not verified! OTP sent to your email for verification!",
    //     {
    //       otpSent: true,
    //       email,
    //     }
    //   );

    //   return;
    // } else {
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
    // }
  } catch (error) {
    return ResponseHandler.error(
      res,
      "Signin failed. Please try again later.",
      error
    );
  }
};

export const fetchUserData = async (req, res) => {
  try {
    // Get the authenticated user ID from the request (from JWT middleware)
    const userId = req.user.id; // Assuming you have `req.user` available via middleware

    // Fetch user data from the database by ID
    const user = await User.findById(userId)
      .select("githubId username name avatar publishedRepos purchasedRepos") // Select only the required fields
      .populate("publishedRepos") // Populate published repos
      .populate("purchasedRepos"); // Populate purchased repos

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Respond with the filtered user data
    ResponseHandler.success(res, "User data fetched successfully", {
      githubId: user.githubId,
      username: user.username,
      name: user.name,
      avatar: user.avatar,
      publishedRepos: user.publishedRepos, // Populated published repos data
      purchasedRepos: user.purchasedRepos, // Populated purchased repos data
    });
  } catch (error) {
    console.error("Error fetching user data:", error.message);
    ResponseHandler.error(res, "Error fetching user data!");
  }
};
