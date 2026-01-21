import React from "react";
import { useNavigate } from "react-router-dom";
import { FiArrowLeft } from "react-icons/fi";

const AboutTeam = () => {
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
        <h1 className="text-lg font-semibold text-navy">About Our Team</h1>
      </div>

      <p className="text-[13px] text-gray-600 leading-relaxed mb-3">
        Sindhuurra is built by a passionate team committed to helping people
        find meaningful matches.  
      </p>

      <div className="grid grid-cols-2 gap-4 mt-4">
        {[
          { name: "Karthik Reddy", role: "Founder & CEO" },
          { name: "Divya Patil", role: "CTO" },
          { name: "Ravi Menon", role: "Product Designer" },
          { name: "Sneha Iyer", role: "Community Manager" },
        ].map((m) => (
          <div
            key={m.name}
            className="rounded-2xl bg-[#F9FAFB] border border-gray-100 p-3 text-center shadow-sm"
          >
            <div className="w-12 h-12 bg-[#FFF0D9] rounded-full mx-auto mb-2 flex items-center justify-center text-primary font-semibold">
              {m.name[0]}
            </div>
            <p className="text-[13px] font-medium text-navy">{m.name}</p>
            <p className="text-[11px] text-gray-500">{m.role}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AboutTeam;