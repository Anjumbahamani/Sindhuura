
import React from "react";
import { useNavigate } from "react-router-dom";
import { FiArrowLeft } from "react-icons/fi";
import founderImg from "../../../assets/team/founder.jpg"
import m1 from "../../../assets/team/m1.jpg"
import m2 from "../../../assets/team/m2.jpg"
import m3 from "../../../assets/team/m3.jpg"
import m4 from "../../../assets/team/m4.jpg"

const founder = {
  name: "Nethraa Soranagi",
  role: "Chairman & CEO",
    photo: founderImg, 
  bio: [
    "Founder – Public Dream Group of Companies",
    "Managing Director – Public Matrimony",
    "Founder & CEO – Sindhuura.com and Sindhuura Foundation",
  ],
}

const teamMembers = [
  {
    name: "Gangadhar KV",
    role: "Vice President",
    photo:m2,
  },

  {
    name: "Veeresh K B",
    role: "Managing Director",
    photo:m3,
  },


  {
    name: "Kiran Kumar KM",
    role: "Chief Operating Director",
    photo: m1,
  },
  {
    name: "Ashwini Chandra",
    role: "Chief Media Cordinator",
    photo: m4,
  },
];

const AboutTeam = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white px-5 py-6">
      {/* Header */}
      <div className="flex items-center mb-4">
        <button
          onClick={() => navigate(-1)}
          className="w-9 h-9 rounded-full flex items-center justify-center bg-[#FFF7E9] mr-3"
        >
          <FiArrowLeft className="text-navy w-4 h-4" />
        </button>
        <h1 className="text-lg font-semibold text-navy">About Our Team</h1>
      </div>

      <p className="text-[13px] text-gray-600 leading-relaxed mb-2">
        Sindhuura is built by a passionate team committed to helping people
        find meaningful matches with trust, transparency and care.
      </p>

      {/* Founder section */}
      <section className="mt-4">
        <h2 className="text-sm font-semibold text-navy mb-2">
          Founder & Leadership
        </h2>

        <div className="rounded-3xl bg-[#F9FAFB] border border-gray-100 p-4 flex gap-3 shadow-sm">
          <div className="w-20 h-20 rounded-2xl overflow-hidden bg-[#FFF0D9] flex-shrink-0">
            {founder.photo ? (
              <img
                src={founder.photo}
                alt={founder.name}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.currentTarget.style.display = "none";
                }}
              />
            ) : null}
          </div>

          <div className="flex-1">
            <p className="text-[14px] font-semibold text-navy">
              {founder.name}
            </p>
            <p className="text-[12px] text-primary font-medium mb-1">
              {founder.role}
            </p>

            <ul className="text-[11px] text-gray-700 space-y-0.5">
              {founder.bio.map((line) => (
                <li key={line}>• {line}</li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Team members */}
      <section className="mt-6">
        <h2 className="text-sm font-semibold text-navy mb-2">Core Team</h2>

        {teamMembers.length === 0 && (
          <p className="text-[12px] text-gray-500">
            Team details will be updated soon.
          </p>
        )}

        <div className="grid grid-cols-2 gap-4 mt-2">
          {teamMembers.map((m) => (
            <div
              key={m.name}
              className="rounded-2xl bg-[#F9FAFB] border border-gray-100 p-3 text-center shadow-sm"
            >
              <div className="w-16 h-18 bg-[#FFF0D9] rounded-2xl mx-auto mb-2 overflow-hidden flex items-center justify-center">
                {m.photo ? (
                  <img
                    src={m.photo}
                    alt={m.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.currentTarget.style.display = "none";
                    }}
                  />
                ) : (
                  <span className="text-primary font-semibold text-lg">
                    {m.name[0]}
                  </span>
                )}
              </div>
              <p className="text-[13px] font-medium text-navy truncate">
                {m.name}
              </p>
              <p className="text-[11px] text-gray-500">{m.role}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default AboutTeam;