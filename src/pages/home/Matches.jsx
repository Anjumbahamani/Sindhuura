import React, { useEffect, useState } from "react";
import BottomNav from "../../components/BottomNav";
import { useNavigate } from "react-router-dom";

import {
  FiHeart,
  FiMapPin,
  FiCheckCircle,
  FiMoreVertical,
  FiFilter,
  FiChevronDown,
  FiX,
} from "react-icons/fi";
import {
  getMatchingProfiles,
  sendInterestRequest,
} from "../../services/match.service";

const Matches = () => {
  const navigate = useNavigate();
  const [profiles, setProfiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [sendingId, setSendingId] = useState(null);
  const [interestedMap, setInterestedMap] = useState({}); // { [profileId]: status }
  const [showFilters, setShowFilters] = useState(false);

  const [filters, setFilters] = useState({
    education: "",
    city: "",
    state: "",
    caste: "",
    annual_income: "",
    family_status: "",
    marital_status: "",

    // 👇 lifestyle
    smoking: "",
    drinking: "",
    eating_habits: "",
  });

  useEffect(() => {
    const fetchProfiles = async () => {
      try {
        setLoading(true);
        setError("");

        const token = localStorage.getItem("token");
        if (!token) {
          setError("Please login to view matches.");
          return;
        }

        const res = await getMatchingProfiles(token, filters);

        setProfiles(res.response || []);
      } catch (err) {
        console.error("Failed to load matching profiles:", err);
        setError("Could not load matches. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchProfiles();
  }, [filters]);

  const handleSendInterest = async (profile) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("Please login again to send interest.");
        return;
      }

      setSendingId(profile.id);

      const res = await sendInterestRequest(profile.id, token);
      console.log("✅ Interest sent:", res);

      const status = res?.response?.status || "pending";
      setInterestedMap((prev) => ({
        ...prev,
        [profile.id]: status,
      }));

      alert("Interest sent successfully!");
    } catch (err) {
      console.error("❌ Failed to send interest:", err);
      alert("Could not send interest. Please try again.");
    } finally {
      setSendingId(null);
    }
  };

  return (
    <div className="min-h-screen bg-white pb-20">
      <div className="max-w-md mx-auto min-h-screen bg-white pb-20">
        {/* HEADER */}
        <div className="bg-white shadow-lg pb-2">
          <div className="px-4 pt-3">
            <h1 className="text-lg font-semibold text-navy">All Matches</h1>
            <p className="text-[11px] text-gray-500">
              Recommended profiles based on your preferences
            </p>
          </div>

          {/* Filter / sort row */}
          <div className="px-4 mt-2 mb-2">
            <p className="text-[11px] text-gray-500 mb-2">
              {profiles.length} matches based on your{" "}
              <span className="text-primary font-semibold cursor-pointer">
                criteria
              </span>
            </p>
            <div className="flex items-center  text-[11px]">
              <button
                onClick={() => setShowFilters(true)}
                className="flex-1 inline-flex items-center justify-center gap-1 px-2 py-1.5 rounded-full border  border-primary bg-primary/5 text-primary"
              >
                <FiFilter className="w-3 h-3" />
                <span>Filter</span>
               
                {Object.values(filters).some(Boolean) && (
                  <span className="ml-1 inline-flex items-center justify-center w-4 h-4 rounded-full bg-primary text-white text-[9px]">
                    {Object.values(filters).filter(Boolean).length}
                  </span>
                )}
                 <FiChevronDown className="w-3 h-3" />
              </button>

              {/* <button className="flex-1 inline-flex items-center justify-center gap-1 px-2 py-1.5 rounded-full border border-primary bg-primary/5 text-primary">
                Sort by <FiChevronDown className="w-3 h-3" />
              </button> */}
              {/* <button className="flex-1 inline-flex items-center justify-center gap-1 px-2 py-1.5 rounded-full border border-primary bg-primary/5 text-primary">
                Newly joined
              </button> */}
            </div>
          </div>
        </div>

        {/* MAIN CONTENT */}
        <main className="px-3 pt-3">
          {loading && (
            <p className="text-sm text-gray-500 mb-3 px-1">Loading matches…</p>
          )}

          {error && <p className="text-sm text-red-500 mb-3 px-1">{error}</p>}

          <div className="space-y-3">
            {!loading &&
              profiles.map((p) => (
                <ProfileCard
                  key={p.id}
                  profile={p}
                  onSendInterest={handleSendInterest}
                  sending={sendingId === p.id}
                  interestStatus={interestedMap[p.id]}
                  onOpenDetails={() =>
                    navigate(`/matches/${p.user_id || p.user || p.id}`)
                  }
                />
              ))}
            {!loading && profiles.length === 0 && !error && (
              <div className="flex flex-col items-center justify-center mt-20 text-center text-gray-500">
                <div className="w-16 h-16 rounded-full bg-[#FFF7E9] flex items-center justify-center mb-3 shadow-sm">
                  <FiHeart className="w-8 h-8 text-[#B36A1E]" />
                </div>
                <p className="text-sm font-semibold text-navy">
                  No matches found
                </p>
                <p className="text-[12px] text-gray-500 mt-1 max-w-[220px]">
                  We couldn't find any new matches right now. Keep your profile
                  updated and check back soon ♥
                </p>
              </div>
            )}
          </div>
        </main>
        {showFilters && (
          <div className="fixed inset-0 bg-black/30 z-50">
            <div className="absolute bottom-0 w-full bg-white rounded-t-3xl p-4">
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-base font-semibold text-navy">Filters</h2>
                <button onClick={() => setShowFilters(false)}>
                  <FiX />
                </button>
              </div>

              {/* Education */}
              <select
                value={filters.education}
                onChange={(e) =>
                  setFilters((f) => ({ ...f, education: e.target.value }))
                }
                className="w-full mb-2 border rounded-xl px-3 py-2 text-sm"
              >
                <option value="">Education</option>
                <option value="bachelors">Bachelors</option>
                <option value="masters">Masters</option>
              </select>

              {/* City */}
              <input
                placeholder="City"
                value={filters.city}
                onChange={(e) =>
                  setFilters((f) => ({ ...f, city: e.target.value }))
                }
                className="w-full mb-2 border rounded-xl px-3 py-2 text-sm"
              />

              {/* Lifestyle */}
              <select
                value={filters.smoking}
                onChange={(e) =>
                  setFilters((f) => ({ ...f, smoking: e.target.value }))
                }
                className="w-full mb-2 border rounded-xl px-3 py-2 text-sm"
              >
                <option value="">Smoking</option>
                <option value="never">Never</option>
                <option value="occasionally">Occasionally</option>
                <option value="quit">Quit</option>
              </select>

              <select
                value={filters.drinking}
                onChange={(e) =>
                  setFilters((f) => ({ ...f, drinking: e.target.value }))
                }
                className="w-full mb-3 border rounded-xl px-3 py-2 text-sm"
              >
                <option value="">Drinking</option>
                <option value="never">Never</option>
                <option value="occasionally">Occasionally</option>
                <option value="quit">Quit</option>
              </select>

              {/* Actions */}
              <div className="flex gap-2">
                <button
                  onClick={() =>
                    setFilters({
                      education: "",
                      city: "",
                      state: "",
                      caste: "",
                      annual_income: "",
                      family_status: "",
                      marital_status: "",
                      smoking: "",
                      drinking: "",
                      eating_habits: "",
                    })
                  }
                  className="flex-1 border rounded-full py-5 text-sm"
                >
                  Clear
                </button>

                <button
                  onClick={() => setShowFilters(false)}
                  className="flex-1 bg-primary text-white rounded-full py-2 text-sm font-semibold"
                >
                  Apply
                </button>
              </div>
            </div>
          </div>
        )}

        <BottomNav />
      </div>
    </div>
  );
};

const formatHeight = (h) => {
  if (!h) return "";
  const [feetStr, inchStr] = String(h).split(".");
  const feet = feetStr;
  const inches = inchStr || "0";
  return `${feet}' ${inches}"`;
};

const ProfileCard = ({
  profile,
  onSendInterest,
  sending,
  interestStatus,
  onOpenDetails,
}) => {
  const {
    profile_image,
    name,
    age,
    height,
    occupation,
    city,
    state,
    religion,
    caste,
  } = profile;
  const isVerified =
    profile.is_verified ??
    profile?.profile?.is_verified ??
    profile.is_active ??
    false;

  const heightText = height ? formatHeight(height) : "";
  const location = [city, state].filter(Boolean).join(", ");
  const community = [religion?.name || "", caste?.name || ""]
    .filter(Boolean)
    .join(" • ");

  return (
    <div className="bg-white rounded-3xl shadow-md overflow-hidden">
      {/* ✅ IMAGE AREA (clickable only here) */}
      <div
        className="relative cursor-pointer"
        onClick={() => onOpenDetails && onOpenDetails(profile)}
      >
        <div className="h-64 bg-gray-200">
          {profile_image ? (
            <img
              src={profile_image}
              alt={name}
              className="w-full h-full object-cover transition-transform duration-200 hover:scale-[1.02]"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-navy text-lg font-semibold bg-gradient-to-br from-gray-300 to-gray-200">
              {name ? name[0].toUpperCase() : "M"}
            </div>
          )}
        </div>

        {/* top‑left options icon */}
        <button
          type="button"
          className="absolute top-3 left-3 w-7 h-7 rounded-full bg-black/50 flex items-center justify-center text-white"
        >
          <FiMoreVertical className="w-4 h-4" />
        </button>
      </div>

      {/* DETAILS */}
      <div className="px-4 pt-3 pb-1">
        <div className="flex items-center gap-1 text-[11px] mb-1">
          {isVerified ? (
            <>
              <FiCheckCircle className="w-3 h-3 text-[#1D7DEA]" />
              <span className="text-[#1D7DEA]">Verified</span>
            </>
          ) : (
            <>
              <FiCheckCircle className="w-3 h-3 text-gray-400" />
              <span className="text-gray-400">Not verified yet</span>
            </>
          )}
        </div>

        <p className="text-base font-semibold text-navy">{name || "Member"}</p>

        <p className="text-[11px] text-gray-700 leading-snug">
          {age && `${age} yrs`} {heightText && ` • ${heightText}`}{" "}
          {community && ` • ${community}`}
          {occupation && ` • ${mapOccupationLabel(occupation)}`}
          {location && ` • ${location}`}
        </p>
      </div>

      {/* ACTIONS */}
      <div className="mt-3 border-t border-gray-100 px-4 py-3 flex gap-2">
        <button
          type="button"
          className="flex-1 inline-flex items-center justify-center gap-1 px-3 py-2 rounded-full border border-gray-300 text-[12px] text-gray-600"
        >
          <FiX className="w-3 h-3" />
          <span>Don&apos;t Show</span>
        </button>

        <button
          type="button"
          onClick={() => onSendInterest(profile)}
          disabled={sending || !!interestStatus}
          className="flex-1 inline-flex items-center justify-center gap-1 px-3 py-2 rounded-full bg-primary text-white text-[12px] font-semibold shadow disabled:opacity-60"
        >
          <FiHeart className="w-3 h-3" />
          <span>
            {interestStatus
              ? "Interest Sent"
              : sending
                ? "Sending…"
                : "Send Interest"}
          </span>
        </button>
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

export default Matches;
