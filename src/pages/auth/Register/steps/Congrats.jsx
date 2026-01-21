import React from "react";
import { useNavigate } from "react-router-dom";
import logo from "../../../../assets/logo-1.png";

const RegistrationCongrats = ({ data, setData, onBack, onNext }) => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-soft flex flex-col items-center justify-center px-6 text-center">
      {/* Logo */}
      <div className="mb-6">
        <img
          src={logo}
          alt="Sindhuura"
          className="h-20 w-20 object-contain mx-auto"
        />
      </div>

      {/* Celebration Emoji */}
      <div className="mb-6">
        <span className="text-7xl">🎉</span>
      </div>

      {/* Title */}
      <h1 className="text-2xl font-semibold text-navy mb-3">
        Congratulations!
      </h1>

      {/* Message */}
      <p className="text-sm text-gray-600 mb-10 leading-relaxed max-w-sm">
        You are eligible for{" "}
        <span className="font-semibold text-primary">FREE Registration</span>.
        <br />
        Let’s start creating your profile.
      </p>

      {/* Continue Button */}
      <button
        onClick={onNext}
        className="w-full max-w-sm bg-primary hover:bg-red-600
                   text-white py-3 rounded-xl
                   font-semibold text-base
                   transition duration-200 shadow-md"
      >
        Continue
      </button>

      {/* Footer Note */}
      <p className="text-xs text-gray-400 mt-8">
        Takes only a few minutes to complete
      </p>
    </div>
  );
};

export default RegistrationCongrats;
