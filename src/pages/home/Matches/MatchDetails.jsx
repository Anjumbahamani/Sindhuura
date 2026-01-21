import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FiArrowLeft, FiMapPin, FiCheckCircle } from "react-icons/fi";
import BottomNav from "../../../components/BottomNav";
import { getMatchDetails } from "../../../services/match.service";

const formatHeight = (h) => {
  if (!h) return "";
  const [feetStr, inchStr] = String(h).split(".");
  const feet = feetStr;
  const inches = inchStr || "0";
  return `${feet}' ${inches}"`;
};

const MatchDetails = () => {
  const { userId } = useParams();
  const navigate = useNavigate();

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        setLoading(true);
        setError("");

        const token = localStorage.getItem("token");
        if (!token) {
          setError("Please login to view details.");
          return;
        }

        const res = await getMatchDetails(userId, token);
        setData(res.response || null);
      } catch (err) {
        console.error("Failed to load match details:", err);
        setError("Could not load details. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchDetails();
  }, [userId]);

  const user = data || {};
  const profile = user.profile || {};
  const lifestyle = profile.lifestyle || {};

  // If profile_image is a relative path, prepend your API base URL
  const imageUrl =
    user.profile_image && user.profile_image.startsWith("http")
      ? user.profile_image
      : user.profile_image
      ? `${import.meta.env.VITE_API_BASE_URL || ""}${user.profile_image}`
      : null;

  return (
    <div className="min-h-screen bg-white pb-20">
      <div className="max-w-md mx-auto min-h-screen bg-white pb-20">
        {/* HEADER */}
        <header className="flex items-center gap-3 px-4 py-3 shadow-sm bg-white">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center"
          >
            <FiArrowLeft className="w-4 h-4 text-navy" />
          </button>
          <h1 className="text-base font-semibold text-navy">
            Profile Details
          </h1>
        </header>

        {/* CONTENT */}
        <main className="px-4 py-4">
          {loading && (
            <p className="text-sm text-gray-500">Loading details…</p>
          )}

          {error && !loading && (
            <p className="text-sm text-red-500">{error}</p>
          )}

          {!loading && !error && data && (
            <div className="rounded-3xl overflow-hidden shadow-md bg-gradient-to-b from-[#FFF7E9] via-white to-white">
              {/* IMAGE */}
              <div className="bg-gray-200">
                {imageUrl ? (
                  <img
                    src={imageUrl}
                    alt={user.name}
                    className="w-full h-56 object-cover"
                  />
                ) : (
                  <div className="w-full h-56 flex items-center justify-center text-navy text-lg font-semibold bg-gradient-to-br from-gray-300 to-gray-200">
                    {user.name ? user.name[0].toUpperCase() : "M"}
                  </div>
                )}
              </div>

              {/* BASIC INFO */}
              <section className="px-4 pt-3 pb-3 space-y-2 bg-white/70">
                <div className="flex items-center gap-1 text-[11px] text-[#1D7DEA]">
                  <FiCheckCircle className="w-3 h-3" />
                  <span>Verified</span>
                </div>

                <h2 className="text-lg font-semibold text-navy">
                  {user.name || "Member"}
                </h2>

                {/* Chips row: age/height + location */}
                <div className="flex flex-wrap gap-1 mt-1 text-[10px]">
                  {profile.gender && profile.date_of_birth && (
                    <span className="px-2 py-0.5 rounded-full bg-[#FFF4E6] text-[#B36A1E]">
                      {profile.gender}, DOB {profile.date_of_birth}
                    </span>
                  )}
                  {profile.height && (
                    <span className="px-2 py-0.5 rounded-full bg-[#E6F4FF] text-[#1D7DEA]">
                      Height {formatHeight(profile.height)}
                    </span>
                  )}
                  {profile.marital_status && (
                    <span className="px-2 py-0.5 rounded-full bg-[#FDEBF3] text-[#B14F7E]">
                      {profile.marital_status}
                    </span>
                  )}
                </div>

                {/* Religion & Caste */}
                <p className="text-[11px] text-gray-600 mt-1">
                  {profile.religion}{" "}
                  {profile.caste && `• ${profile.caste}`}
                </p>

                {/* Location */}
                <p className="text-[11px] text-gray-600 mt-1 flex items-center gap-1">
                  <FiMapPin className="w-3 h-3 text-gray-400" />
                  <span>
                    {[profile.city, profile.state, profile.country]
                      .filter(Boolean)
                      .join(", ")}
                  </span>
                </p>

                {/* About */}
                {profile.description && (
                  <div className="mt-2">
                    <p className="text-[11px] font-semibold text-navy mb-0.5">
                      About
                    </p>
                    <p className="text-[11px] text-gray-700 leading-snug">
                      {profile.description}
                    </p>
                  </div>
                )}
              </section>

              {/* EDUCATION & WORK */}
              <section className="px-4 pt-3 pb-3 grid grid-cols-2 gap-3 text-[11px] bg-white">
                <div className="bg-[#F6FAFF] rounded-2xl p-3">
                  <p className="font-semibold text-navy mb-0.5">
                    Education
                  </p>
                  <p className="text-gray-700">
                    {profile.education || "-"}
                  </p>
                  {profile.field_of_study && (
                    <p className="text-gray-500 mt-0.5">
                      {profile.field_of_study}
                    </p>
                  )}
                </div>
                <div className="bg-[#FFF9F1] rounded-2xl p-3">
                  <p className="font-semibold text-navy mb-0.5">
                    Occupation
                  </p>
                  <p className="text-gray-700">
                    {mapOccupationLabel(profile.occupation)}
                  </p>
                  {profile.annual_income && (
                    <p className="text-gray-500 mt-0.5">
                      ₹ {profile.annual_income} LPA
                    </p>
                  )}
                </div>
              </section>

              {/* LIFESTYLE */}
              {lifestyle && (
                <section className="px-4 pt-2 pb-4 bg-white text-[11px]">
                  <div className="bg-[#F7F7F7] rounded-2xl p-3 space-y-1">
                    <p className="text-sm font-semibold text-navy mb-1">
                      Lifestyle
                    </p>

                    {lifestyle.music_genres?.length > 0 && (
                      <p>
                        <span className="font-semibold">Music: </span>
                        {lifestyle.music_genres.join(", ")}
                      </p>
                    )}
                    {lifestyle.movie_tv_genres?.length > 0 && (
                      <p>
                        <span className="font-semibold">
                          Movies/TV:{" "}
                        </span>
                        {lifestyle.movie_tv_genres.join(", ")}
                      </p>
                    )}
                    {lifestyle.favorite_sports && (
                      <p>
                        <span className="font-semibold">Sports: </span>
                        {lifestyle.favorite_sports}
                      </p>
                    )}
                    {lifestyle.fitness_activity && (
                      <p>
                        <span className="font-semibold">Fitness: </span>
                        {lifestyle.fitness_activity}
                      </p>
                    )}
                    {lifestyle.spoken_languages && (
                      <p>
                        <span className="font-semibold">
                          Spoken languages:{" "}
                        </span>
                        {lifestyle.spoken_languages}
                      </p>
                    )}
                    {lifestyle.eating_habits && (
                      <p>
                        <span className="font-semibold">
                          Eating habits:{" "}
                        </span>
                        {lifestyle.eating_habits}
                      </p>
                    )}
                    {lifestyle.smoking && (
                      <p>
                        <span className="font-semibold">Smoking: </span>
                        {lifestyle.smoking}
                      </p>
                    )}
                    {lifestyle.drinking && (
                      <p>
                        <span className="font-semibold">Drinking: </span>
                        {lifestyle.drinking}
                      </p>
                    )}
                  </div>
                </section>
              )}
            </div>
          )}
        </main>

        <BottomNav />
      </div>
    </div>
  );
};

const mapOccupationLabel = (code) => {
  if (!code) return "";
  const map = {
    software: "Software Professional",
    business: "Business",
    doctor: "Doctor",
    teacher: "Teacher",
  };
  return map[code] || code;
};

export default MatchDetails;