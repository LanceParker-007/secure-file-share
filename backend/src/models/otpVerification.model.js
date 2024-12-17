import mongoose from "mongoose";

const otpVerificationSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      trim: true,
    },
    otp: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const OtpVerification = mongoose.model(
  "OtpVerification",
  otpVerificationSchema
);
export default OtpVerification;
