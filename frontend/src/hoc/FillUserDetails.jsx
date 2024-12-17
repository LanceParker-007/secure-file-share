import { useState, useEffect } from "react";
import Cookies from "js-cookie";
import { setAppAccessToken, setUserDetails } from "../redux/slices/userSlice";
import { useDispatch } from "react-redux";

const FillUserDetails = ({ children }) => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    try {
      setLoading(true);
      const app_access_token = Cookies.get("app_access_token");

      if (app_access_token) {
        dispatch(setAppAccessToken(app_access_token));

        if (localStorage.getItem("userDetails")) {
          dispatch(
            setUserDetails(JSON.parse(localStorage.getItem("userDetails")))
          );
        }
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  });

  return loading ? <>Loading...</> : <>{children}</>;
};

export default FillUserDetails;
