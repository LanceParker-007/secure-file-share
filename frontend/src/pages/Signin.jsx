import React, { useEffect, useState } from "react";
import { FiArrowLeft, FiLoader } from "react-icons/fi";
import { motion } from "framer-motion";
import { twMerge } from "tailwind-merge";
import { Link, useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import axios from "axios";
import { setAppAccessToken, setUserDetails } from "../redux/slices/userSlice";
import { useDispatch } from "react-redux";
import Logo from "../assets/logo.svg";

const NavLogo = () => {
  return (
    <div href="#">
      <img src={Logo} alt="Logo" />
      ABSharing
    </div>
  );
};

const Heading = () => (
  <div>
    <NavLogo />
    <div className="mb-9 mt-6 space-y-1.5">
      <h1 className="text-2xl font-semibold">Sign in to your account</h1>
      <p className="text-zinc-400">
        Share your files
        <span href="#" className="text-blue-400">
          {" "}
          SECURELY <span className="text-green-300">!</span>.
        </span>
      </p>
    </div>
  </div>
);

const BubbleButton = ({ children, className, ...rest }) => {
  return (
    <button
      className={twMerge(
        `
        relative z-0 flex items-center gap-2 overflow-hidden whitespace-nowrap rounded-md 
        border border-zinc-700 bg-gradient-to-br from-zinc-800 to-zinc-950
        px-3 py-1.5
        text-zinc-50 transition-all duration-300
        
        before:absolute before:inset-0
        before:-z-10 before:translate-y-[200%]
        before:scale-[2.5]
        before:rounded-[100%] before:bg-zinc-100
        before:transition-transform before:duration-500
        before:content-[""]

        hover:scale-105 hover:text-zinc-900
        hover:before:translate-y-[0%]
        active:scale-100`,
        className
      )}
      {...rest}
    >
      {children}
    </button>
  );
};

const SplashButton = ({ children, className, isLoading, ...rest }) => {
  return (
    <button
      disabled={isLoading}
      className={twMerge(
        "rounded-md bg-gradient-to-br from-blue-400 to-blue-700 px-4 py-2 text-lg text-zinc-50 ring-2 ring-blue-500/50 ring-offset-2 ring-offset-zinc-950 transition-all hover:scale-[1.02] hover:ring-transparent active:scale-[0.98] active:ring-blue-500/70",
        isLoading && "cursor-not-allowed opacity-50",
        className
      )}
      {...rest}
    >
      {isLoading ? (
        <div className="flex items-center justify-center">
          <FiLoader className="mr-2 animate-spin" />
          {children}
        </div>
      ) : (
        children
      )}
    </button>
  );
};

const UserForm = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [formState, setFormState] = useState("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [stage, setStage] = useState("signup"); // "signup" | "verify"
  const [serverEmail, setServerEmail] = useState("");
  const [otpSentSuccessMsg, setOtpSentSuccessMsg] = useState("");
  const [error, setError] = useState("");

  const [isSignupLoading, setIsSignupLoading] = useState(false);
  const [isSigninLoading, setIsSigninLoading] = useState(false);
  const [isOtpVerifyLoading, setIsOtpVerifyLoading] = useState(false);

  // HAndle Sign up
  const handleSignup = async (e) => {
    e.preventDefault();
    setError("");
    setIsSignupLoading(true);

    if (!email || !password) {
      setError("Enter email and password please!");
      setIsSignupLoading(false);
      return;
    }

    try {
      const { data } = await axios.post(
        `${import.meta.env.VITE_BACKEND_SERVER}/user/signup`,
        {
          email,
          password,
        }
      );

      // Move to OTP verification stage
      setStage("verify");
      setServerEmail(data.email);
      setOtpSentSuccessMsg(data.message);
    } catch (error) {
      setError(error?.response?.data.message);
    } finally {
      setIsSignupLoading(false);
    }
  };

  // Handle OTP verfication
  const handleOTPVerification = async (e) => {
    e.preventDefault();
    setError("");
    setIsOtpVerifyLoading(true);

    try {
      const { data } = await axios.post(
        `${import.meta.env.VITE_BACKEND_SERVER}/user/verify-otp`,
        {
          email: serverEmail,
          otp,
        }
      );

      if (data.success) {
        dispatch(
          setUserDetails({
            id: data.receivedData.id,
            email: data.receivedData.email,
            role: data.receivedData.role,
          })
        );
        dispatch(setAppAccessToken(data.receivedData.token));

        Cookies.set("app_access_token", data.receivedData.token);
        localStorage.setItem(
          "userDetails",
          JSON.stringify({
            id: data.receivedData.id,
            email: data.receivedData.email,
            role: data.receivedData.role,
          })
        );
        navigate("/profile");
      } else {
        throw Error(data.message);
      }
    } catch (error) {
      setError(error?.response?.data.message || "OTP Verification Failed");
    } finally {
      setIsOtpVerifyLoading(false);
    }
  };

  // Handle Sign in
  const handleSignin = async (e) => {
    e.preventDefault();
    setError("");
    setIsSigninLoading(true);

    if (!email || !password) {
      setError("Enter email and password please!");
      setIsSigninLoading(false);
      return;
    }

    try {
      const { data } = await axios.post(
        `${import.meta.env.VITE_BACKEND_SERVER}/user/signin`,
        {
          email,
          password,
        }
      );

      if (data.success) {
        if (data.receivedData.token) {
          dispatch(
            setUserDetails({
              id: data.receivedData.id,
              email: data.receivedData.email,
              role: data.receivedData.role,
            })
          );
          dispatch(setAppAccessToken(data.receivedData.token));

          Cookies.set("app_access_token", data.receivedData.token);
          localStorage.setItem(
            "userDetails",
            JSON.stringify({
              id: data.receivedData.id,
              email: data.receivedData.email,
              role: data.receivedData.role,
            })
          );
          navigate("/profile");
        } else if (data.receivedData.otpSent === true) {
          // Move to OTP verification stage
          setStage("verify");
          setServerEmail(data.email);
          setOtpSentSuccessMsg(data.message);
        }
      } else {
        throw Error(data.message);
      }
    } catch (error) {
      setError(error?.response?.data.message || "Sign In Failed");
    } finally {
      setIsSigninLoading(false);
    }
  };

  useEffect(() => {
    const app_access_token = Cookies.get("app_access_token");
    if (app_access_token) {
      navigate("/publish-file");
    }
  }, []);

  // Conditional rendering based on signup stage
  if (stage === "verify") {
    return (
      <form onSubmit={handleOTPVerification}>
        <div className="mb-3">
          <label htmlFor="email-input" className="mb-1.5 block text-zinc-400">
            {otpSentSuccessMsg}
          </label>
          <input
            id="otp-input"
            type="text"
            placeholder="Enter OTP"
            className="w-full rounded-md border border-zinc-700 bg-zinc-900 px-3 py-2 placeholder-zinc-500 ring-1 ring-transparent transition-shadow focus:outline-0 focus:ring-blue-700"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
          />
        </div>
        {error && <p className="text-red-500 mb-3">{error}</p>}
        <SplashButton
          type="submit"
          className="w-full"
          isLoading={isOtpVerifyLoading}
        >
          Verify OTP
        </SplashButton>
      </form>
    );
  }

  return (
    <>
      {error && <p className="text-red-500 mb-3">{error}</p>}
      {formState === "signup" && (
        <>
          <form onSubmit={handleSignup}>
            <div className="mb-3">
              <label
                htmlFor="email-input"
                className="mb-1.5 block text-zinc-400"
              >
                Email
              </label>
              <input
                id="email-input"
                type="email"
                placeholder="your.email@abnormalsecurity.com"
                className="w-full rounded-md border border-zinc-700 bg-zinc-900 px-3 py-2 placeholder-zinc-500 ring-1 ring-transparent transition-shadow focus:outline-0 focus:ring-blue-700"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="mb-6">
              <div className="mb-1.5 flex items-end justify-between">
                <label htmlFor="password-input" className="block text-zinc-400">
                  Password
                </label>
              </div>
              <input
                id="password-input"
                type="password"
                placeholder="••••••••••••"
                className="w-full rounded-md border border-zinc-700 bg-zinc-900 px-3 py-2 placeholder-zinc-500 ring-1 ring-transparent transition-shadow focus:outline-0 focus:ring-blue-700"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <SplashButton
              type="submit"
              className="w-1/2"
              isLoading={isSignupLoading}
            >
              Sign up
            </SplashButton>
          </form>
          <BubbleButton
            className="w-1/2"
            onClick={() => setFormState("signin")}
          >
            Already have an account? Sign In!
          </BubbleButton>
        </>
      )}
      {formState === "signin" && (
        <>
          <form onSubmit={handleSignin}>
            <div className="mb-3">
              <label
                htmlFor="email-input"
                className="mb-1.5 block text-zinc-400"
              >
                Email
              </label>
              <input
                id="email-input"
                type="email"
                placeholder="your.email@abnormalsecurity.com"
                className="w-full rounded-md border border-zinc-700 bg-zinc-900 px-3 py-2 placeholder-zinc-500 ring-1 ring-transparent transition-shadow focus:outline-0 focus:ring-blue-700"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="mb-6">
              <div className="mb-1.5 flex items-end justify-between">
                <label htmlFor="password-input" className="block text-zinc-400">
                  Password
                </label>
              </div>
              <input
                id="password-input"
                type="password"
                placeholder="••••••••••••"
                className="w-full rounded-md border border-zinc-700 bg-zinc-900 px-3 py-2 placeholder-zinc-500 ring-1 ring-transparent transition-shadow focus:outline-0 focus:ring-blue-700"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <SplashButton
              type="submit"
              className="w-1/2"
              isLoading={isSigninLoading}
            >
              Sign in
            </SplashButton>
          </form>
          <BubbleButton
            className="w-1/2"
            onClick={() => setFormState("signup")}
          >
            Don't have an account? Sign Up!
          </BubbleButton>
        </>
      )}
    </>
  );
};

const Terms = () => (
  <p className="mt-9 text-xs text-zinc-400">
    By signing in, you agree to our{" "}
    <Link to="/terms-and-conditions" className="text-blue-400">
      Terms & Conditions{" "}
    </Link>
    and{" "}
    <Link to="/privacy-policy" className="text-blue-400">
      Privacy Policy.
    </Link>{" "}
  </p>
);

const Signin = () => {
  return (
    <div className="h-screen bg-zinc-950 py-20 text-zinc-200 selection:bg-zinc-600">
      <Link to={"/"}>
        <BubbleButton className="absolute left-4 top-6 text-sm">
          <FiArrowLeft />
          Go back
        </BubbleButton>
      </Link>

      <motion.div
        initial={{
          opacity: 0,
          y: 25,
        }}
        animate={{
          opacity: 1,
          y: 0,
        }}
        transition={{
          duration: 1.25,
          ease: "easeInOut",
        }}
        className="relative z-10 mx-auto w-full max-w-xl p-4"
      >
        <Heading />

        <UserForm />

        <Terms />
      </motion.div>
    </div>
  );
};

export default Signin;
