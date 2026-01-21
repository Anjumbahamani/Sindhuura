import React from "react";
import { FiUserPlus, FiMessageCircle, FiCamera } from "react-icons/fi";
import img from "../../../../assets/family-law.png";
const WelcomeScr = ({ userCode = "SN2026W01", onContinue }) => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-between bg-gradient-to-b from-[#FFF7E9] via-[#FFF9F1] to-[#FFFFFF] text-center px-6 py-8">
      {/* Top section */}
      <div className="w-full max-w-sm text-center mt-10">
        <h1 className="text-xl font-medium text-gray-700 mb-1">
          Welcome <span className="font-semibold text-primary">{userCode}</span> 🎉
        </h1>
        <h2 className="text-base font-semibold text-navy mb-4 mt-4">
          Here’s the Sindhuurra Circle that helps people find their perfect match
        </h2>

        {/* Mantra points */}
        <div className="space-y-4 text-left mt-28">
          <MantraStep
            icon={FiUserPlus}
            color="bg-[#26C281]/10"
            iconColor="text-[#26C281]"
            title="Connect Regularly"
            desc="Send at least 2 interests every day to boost visibility and responses."
          />
          <MantraStep
            icon={FiMessageCircle}
            color="bg-[#1D7DEA]/10"
            iconColor="text-[#1D7DEA]"
            title="Respond Promptly"
            desc="Reply quickly to messages and interest requests to keep the connection alive."
          />
          <MantraStep
            icon={FiCamera}
            color="bg-[#FF4F5A]/10"
            iconColor="text-[#FF4F5A]"
            title="Keep Your Profile Fresh"
            desc="Update your profile and pictures often to attract more responses."
          />
        </div>
      </div>

      {/* Footer */}
      <div className="w-full max-w-sm text-center space-y-6">
        <div>
          <p className="text-[12px] text-gray-500">Best wishes,</p>
          <div className="flex items-center justify-center mt-1">
            <div className="w-14 h-14 rounded-full overflow-hidden border border-gray-200">
              <img
                src={img}
                alt="Founder"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="ml-2 text-left">
              <p className="text-[12px] font-medium text-navy">
                Mr. Karthik Reddy
              </p>
              <p className="text-[10px] text-gray-500">Founder, Sindhuurra</p>
            </div>
          </div>
        </div>

        <button
          onClick={onContinue || (() => window.history.back())}
          className="w-full bg-primary text-white font-semibold py-3 rounded-full shadow hover:bg-primary/90 transition"
        >
          Get Started
        </button>

        <button
          onClick={() => alert('Open privacy settings (coming soon)')}
          className="text-[11px] text-gray-500 underline"
        >
          Check or Update Your Privacy Settings
        </button>
      </div>
    </div>
  );
};

const MantraStep = ({ icon: Icon, color, iconColor, title, desc }) => (
  <div className="flex gap-3 items-start">
    <div
      className={`mt-0.5 w-10 h-10 flex-shrink-0 rounded-full ${color} flex items-center justify-center ${iconColor}`}
    >
      <Icon className="w-4 h-4" />
    </div>
    <div>
      <p className="text-xl font-semibold text-navy">{title}</p>
      <p className="text-[18px] text-gray-500 leading-snug">{desc}</p>
    </div>
  </div>
);

export default WelcomeScr;