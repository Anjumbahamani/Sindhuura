import { useNavigate } from "react-router-dom";
import logo from "../../assets/logo.png";
import React from "react";
const Welcome = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-soft flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg px-8 py-12 text-center">
        {/* Logo */}
        <div className="flex justify-center mb-6">
          <img
            src={logo}
            alt="Sindhuura"
            className="h-20 w-20 object-contain"
          />
        </div>

        {/* Title */}
        <h1 className="text-2xl font-semibold text-navy mb-2">
          Welcome to Sindhuura
        </h1>

        <p className="text-sm text-gray-500 mb-10">
          Begin your journey towards a meaningful match
        </p>

        <h6 className="text-lg font-normal text-navy mb-4">
          New to Sindhuura?
        </h6>

        <button
          onClick={() => navigate("/register")}
          className="w-full bg-primary hover:bg-red-600
                     text-white py-3 rounded-xl
                     font-semibold text-base
                     transition duration-200 shadow-md mb-4"
        >
          Create New Profile
        </button>
        {/* Divider */}
        <div className="flex items-center gap-3 my-6">
          <div className="flex-1 h-px bg-gray-200" />
          <span className="text-xs text-gray-400">OR</span>
          <div className="flex-1 h-px bg-gray-200" />
        </div>
        {/* Existing User Button */}
        <div className="flex items-center justify-center gap-3">
          <span className="text-lg text-gray-700">Already registered?</span>

          <button
            onClick={() => navigate("/login")}
            className="px-5 py-2 rounded-lg
               border border-primary
               text-primary font-semibold text-sm
               hover:bg-soft transition"
          >
            Login
          </button>
        </div>

        {/* Footer text */}
        <p className="text-xs text-gray-400 mt-10 leading-relaxed">
          By continuing, you agree to our{" "}
          <span className="underline cursor-pointer">Terms</span> &{" "}
          <span className="underline cursor-pointer">Privacy Policy</span>
        </p>
      </div>
    </div>
  );
};

export default Welcome;
