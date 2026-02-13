import React from "react";
import { useNavigate } from "react-router-dom";
import { FiHeart, FiUser, FiShield } from "react-icons/fi";
import { motion } from "framer-motion";

const Onboarding = () => {
  const navigate = useNavigate();

  const cards = [
    {
      icon: <FiHeart className="w-7 h-7 text-primary" />,
      title: "Find Your Match",
      description:
        "Discover compatible profiles tailored just for you.",
      details:
        "We use smart recommendations based on your preferences to help you connect with the right partner.",
      bg: "bg-[#FFF7E5]",
    },
    {
      icon: <FiUser className="w-7 h-7 text-blue-500" />,
      title: "Verified Profiles",
      description:
        "Only quality profiles get through our strict verification.",
      details:
        "Our moderation team ensures each profile is authentic and safe. No bots, no scams — just real people.",
      bg: "bg-[#E6F4FF]",
    },
    {
      icon: <FiShield className="w-7 h-7 text-green-500" />,
      title: "Secure & Private",
      description:
        "You control what you share and who can see it.",
      details:
        "Your personal data is protected. We never share it without your consent and ensure you're always in control.",
      bg: "bg-[#F3F1FF]",
    },
  ];

  const handleGetStarted = () => {
    localStorage.setItem("hasSeenOnboarding", "true");
    navigate("/welcome");
  };

  return (
    <div className="min-h-screen bg-white flex flex-col justify-between px-4 py-6">
      {/* Skip Button top-right */}
      {/* <div className="flex justify-end mb-4">
        <button
          onClick={handleGetStarted}
          className="text-[13px] border border-primary bg-primary/10 text-primary px-4 py-1.5 rounded-full font-semibold"
        >
          Skip
        </button>
      </div> */}

      {/* Cards */}
      <div className="flex-1 flex flex-col justify-center gap-6 overflow-y-auto">
        {cards.map((card, index) => (
          <motion.div
            key={index}
            className={`rounded-3xl p-6 flex items-start gap-4 shadow-md ${card.bg} min-h-[160px]`}
            initial={{ opacity: 0, translateY: 30 }}
            animate={{ opacity: 1, translateY: 0 }}
            transition={{ duration: 0.5 + index * 0.2, ease: "easeOut" }}
          >
            <div className="flex items-center justify-center w-12 h-12 rounded-full bg-white shadow-md">
              {card.icon}
            </div>
            <div className="flex-1">
              <h2 className="text-[17px] font-semibold text-navy mb-1">
                {card.title}
              </h2>
              <p className="text-sm text-gray-700">
                {card.description}
              </p>
              <p className="text-xs text-gray-600 mt-2 leading-snug">
                {card.details}
              </p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Bottom CTA Button */}
      <div className="mt-6">
        <button
          onClick={handleGetStarted}
          className="w-full bg-primary text-white font-semibold py-4 rounded-xl text-sm shadow-md"
        >
          Get Started
        </button>
      </div>
    </div>
  );
};

export default Onboarding;