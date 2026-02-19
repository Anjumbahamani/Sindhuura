import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthProvider";
import Onboarding from "../pages/auth/Onboarding";

const RootRedirect = () => {
  const { isAuthenticated } = useAuth();

  // If logged in, go home. Else show onboarding.
  return isAuthenticated ? <Navigate to="/home" replace /> : <Onboarding />;
};

export default RootRedirect;
