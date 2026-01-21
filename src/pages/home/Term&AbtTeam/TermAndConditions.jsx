import React from "react";
import { useNavigate } from "react-router-dom";
import { FiArrowLeft } from "react-icons/fi";

const TermsAndConditions = () => {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-white px-5 py-6">
      <div className="flex items-center mb-4">
        <button
          onClick={() => navigate(-1)}
          className="w-9 h-9 rounded-full flex items-center justify-center bg-[#FFF7E9] mr-3"
        >
          <FiArrowLeft className="text-navy w-4 h-4" />
        </button>
        <h1 className="text-lg font-semibold text-navy">
          Terms & Conditions
        </h1>
      </div>
      <p className="text-[13px] text-gray-600 leading-relaxed">
        {/* Add your T&C content here */}
        Welcome to Sindhuurra! These terms explain your rights and obligations
        when using our platform...
      </p>
    </div>
  );
};

export default TermsAndConditions;