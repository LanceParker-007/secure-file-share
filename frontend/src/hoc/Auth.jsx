import React from "react";
import { useEffect } from "react";
import Cookies from "js-cookie";
import { useDispatch } from "react-redux";
import { setAppAccessToken, setUserDetails } from "../redux/slices/userSlice";
import { useNavigate } from "react-router-dom";

const Auth = ({ children, navigateTo }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    const app_access_token = Cookies.get("app_access_token");

    if (app_access_token) {
      dispatch(setAppAccessToken(app_access_token));

      if (localStorage.getItem("userDetails")) {
        dispatch(
          setUserDetails(JSON.parse(localStorage.getItem("userDetails")))
        );
      }

      navigate(navigateTo);
    } else {
      navigate("/");
    }
  }, []);

  return <>{children}</>;
};

export default Auth;
