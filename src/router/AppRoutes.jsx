import { Routes, Route } from "react-router-dom";
import Login from "../pages/auth/Login";
import React from "react";
import Welcome from "../pages/auth/WelcomeScreen";
import RegisterFlow from "../pages/auth/Register/RegisterFlow";
import Home from "../pages/home/Home";
import Matches from "../pages/home/Matches";
import Interests from "../pages/home/Interests";
import Messages from "../pages/home/Messages";
import Upgrade from "../pages/home/Upgrade";
import Blogs from "../pages/home/Blogs";
import MatchDetails from "../pages/home/Matches/MatchDetails";
import UserProfile from "../pages/home/Userprofile/UserProfile";
import BlogDetail from "../pages/home/Blogs/BlogDetail";
import WelcomeScr from "../pages/auth/Register/steps/WelcomScr";
import TermsAndConditions from "../pages/home/Term&AbtTeam/TermAndConditions";
import AboutTeam from "../pages/home/Term&AbtTeam/AboutTeam";
import InterestDetails from "../pages/home/Interests/InterestDetails";
import ChatRoom from "../pages/home/Messages/ChatRoom";

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Welcome />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<RegisterFlow />} />
      <Route path="/home" element={<Home />} />
      <Route path="/matches" element={<Matches />} />
      <Route path="/interests" element={<Interests />} />
      <Route path="/messages" element={<Messages />} />
      <Route path="/upgrade" element={<Upgrade />} />
      <Route path="/blogs" element={<Blogs />} />
      <Route path="/matches/:userId" element={<MatchDetails />} />
      <Route path="/profile" element={<UserProfile />} />
      {/* <Route path="/blogs" element={<Blogs />} /> */}
      <Route path="/blogs/:blogId" element={<BlogDetail />} />
      <Route path="/welcome" element={<WelcomeScr />} />

      <Route path="/terms-and-conditions" element={<TermsAndConditions />} />
      <Route path="/about-team" element={<AboutTeam />} />
      <Route path="/interests/:id" element={<InterestDetails />} />
      <Route path="/messages/:roomId" element={<ChatRoom />} />
    </Routes>
  );
};

export default AppRoutes;
