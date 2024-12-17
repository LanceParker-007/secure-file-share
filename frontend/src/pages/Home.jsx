import React from "react";
import RetractingSidebar from "../components/retracting-sidebar/RetractingSidebar";
import { Route, Routes } from "react-router-dom";
import Profile from "./Profile";
import PublishFile from "./PublishFile";
import Auth from "../hoc/Auth";
import FileDetails from "./FileDetails";
import FillUserDetails from "../hoc/FillUserDetails";
import PageDoesNotExist from "./PageDoesNotExist";

const Home = () => {
  return (
    <div className="flex bg-indigo-50">
      <RetractingSidebar />
      <Routes>
        <Route
          path="/profile"
          element={
            <Auth navigateTo={"/profile"}>
              <Profile />
            </Auth>
          }
        />
        <Route
          path="/publish-file"
          element={
            <Auth navigateTo={"/publish-file"}>
              <PublishFile />
            </Auth>
          }
        />
        <Route
          path="/file/:linkId"
          element={
            <FillUserDetails>
              <FileDetails />
            </FillUserDetails>
          }
        />
        <Route path="/*" element={<PageDoesNotExist />} />
      </Routes>
    </div>
  );
};

export default Home;
