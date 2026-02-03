// import React, { useEffect, useState } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import { FiArrowLeft, FiMapPin } from "react-icons/fi";
// import BottomNav from "../../../components/BottomNav";
// import { getInterestDetails,getMatchDetails } from "../../../services/match.service";

// const InterestDetails = () => {
//   const { userId } = useParams();
//   const navigate = useNavigate();

//   const [user, setUser] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");

//   useEffect(() => {
//     if (!userId) {
//       setError("Invalid profile");
//       setLoading(false);
//       return;
//     }

//     const fetchDetails = async () => {
//       try {
//        const token = localStorage.getItem("token");
//         if (!token) {
//           setError("Please login to view details.");
//           return;
//         }

//         const res = await getMatchDetails(userId, token); // ✅ FIX
//         setUser(res.response);
//       } catch (err) {
//         console.error(err);
//         setError("Failed to load profile details");
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchDetails();
//   }, [userId]); // ✅ FIX

//   if (loading) {
//     return <p className="p-4 text-sm text-gray-500">Loading details…</p>;
//   }

//   if (error) {
//     return <p className="p-4 text-sm text-red-500">{error}</p>;
//   }

//   const profile = user.profile || {};

//   return (
//     <div className="min-h-screen bg-white pb-20">
//       <div className="max-w-md mx-auto">

//         {/* HEADER */}
//         <div className="flex items-center gap-2 px-4 pt-4 pb-2">
//           <button onClick={() => navigate(-1)}>
//             <FiArrowLeft className="w-5 h-5" />
//           </button>
//           <h1 className="text-lg font-semibold text-navy">
//             Profile Details
//           </h1>
//         </div>

//         {/* IMAGE */}
//         <div className="h-72 bg-gray-200">
//           {user.profile_image && (
//             <img
//               src={user.profile_image}
//               alt={user.name}
//               className="w-full h-full object-cover"
//             />
//           )}
//         </div>

//         {/* INFO */}
//         <div className="px-4 py-3">
//           <h2 className="text-lg font-semibold text-navy">
//             {user.name}
//           </h2>

//           <p className="text-[12px] text-gray-500 mt-1 flex items-center gap-1">
//             <FiMapPin />
//             {profile.city}, {profile.state}
//           </p>

//           <p className="text-[12px] text-gray-600 mt-2">
//             Joined on: {new Date(user.date_joined).toLocaleDateString()}
//           </p>

//           {profile.description && (
//             <div className="mt-4">
//               <p className="text-[12px] font-semibold text-gray-600 mb-1">
//                 About
//               </p>
//               <p className="text-[13px] text-gray-700">
//                 {profile.description}
//               </p>
//             </div>
//           )}
//         </div>
//       </div>

//       <BottomNav />
//     </div>
//   );
// };

// export default InterestDetails;

import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  FiArrowLeft,
  FiMapPin,
  FiCheckCircle,
  FiFlag,
  FiX,
} from "react-icons/fi";
import BottomNav from "../../../components/BottomNav";
import { getInterestDetails } from "../../../services/match.service";

const formatHeight = (h) => {
  if (!h) return "";
  const [feetStr, inchStr] = String(h).split(".");
  const feet = feetStr;
  const inches = inchStr || "0";
  return `${feet}' ${inches}"`;
};

const listToText = (arr) => {
  if (!Array.isArray(arr) || !arr.length) return "";
  return arr.map((item) => item?.name ?? item).join(", ");
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

const InterestDetails = () => {
  const params = useParams();
  console.log("InterestDetails useParams:", params);

  // Works with either /interests/:userId or /interests/:id
  const interestId = params.userId || params.id;

  const navigate = useNavigate();

  const [data, setData] = useState(null); // full user object
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // ====== REPORT MODAL STATE ======
  const [showReportModal, setShowReportModal] = useState(false);
  const [reportReasons, setReportReasons] = useState([]);
  const [reportReasonsLoading, setReportReasonsLoading] = useState(false);
  const [selectedReasonId, setSelectedReasonId] = useState("");
  const [reportDescription, setReportDescription] = useState("");
  const [reportSubmitLoading, setReportSubmitLoading] = useState(false);
  const [reportError, setReportError] = useState("");
  const [reportSuccess, setReportSuccess] = useState("");

  useEffect(() => {
    if (!interestId) {
      setError("Invalid profile");
      setLoading(false);
      return;
    }

    const fetchDetails = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setError("Please login to view profile.");
          setLoading(false);
          return;
        }

        const res = await getInterestDetails(interestId, token);
        console.log("getInterestDetails response:", res);

        if (!res || !res.response) {
          setError("Profile not found.");
          return;
        }

        setData(res.response);
      } catch (err) {
        console.error("getInterestDetails error:", err);
        setError("Failed to load profile details");
      } finally {
        setLoading(false);
      }
    };

    fetchDetails();
  }, [interestId]);

  // ====== FETCH REPORT REASONS WHEN MODAL OPENS ======
  useEffect(() => {
    if (!showReportModal) return;

    const fetchReasons = async () => {
      try {
        setReportReasonsLoading(true);
        setReportError("");
        const token = localStorage.getItem("token");

        const res = await fetch(
          "https://admin.sindhuura.com/api/match/report-reasons/",
          {
            headers: {
              "Content-Type": "application/json",
              ...(token ? { Authorization: `Bearer ${token}` } : {}),
            },
          }
        );

        if (!res.ok) {
          throw new Error("Failed to load report reasons");
        }

        const result = await res.json();
        if (!result.status) {
          throw new Error(result.message || "Failed to load report reasons");
        }

        setReportReasons(result.response || []);
      } catch (err) {
        console.error("Error fetching report reasons:", err);
        setReportError(
          err.message || "Could not load reasons. Please try again."
        );
      } finally {
        setReportReasonsLoading(false);
      }
    };

    fetchReasons();
  }, [showReportModal]);

  if (loading) {
    return <p className="p-4 text-sm text-gray-500">Loading details…</p>;
  }

  if (error) {
    return <p className="p-4 text-sm text-red-500">{error}</p>;
  }

  const user = data || {};
  const profile = user.profile || {};
  const lifestyle = profile.lifestyle || {};

  const imageUrl = user.profile_image || profile.profile_image || null;
  const heightText = profile.height ? formatHeight(profile.height) : "";

  // ====== SUBMIT REPORT HANDLER ======
  const handleSubmitReport = async (e) => {
    e.preventDefault();
    setReportError("");
    setReportSuccess("");

    if (!selectedReasonId) {
      setReportError("Please select a reason.");
      return;
    }

    const reportedUserId = user.id || Number(interestId);
    if (!reportedUserId) {
      setReportError("Unable to identify user to report.");
      return;
    }

    try {
      setReportSubmitLoading(true);
      const token = localStorage.getItem("token");

      if (!token) {
        setReportError("Please login to report users.");
        return;
      }

      const res = await fetch(
        "https://admin.sindhuura.com/api/match/report-user/",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
          body: JSON.stringify({
            reported_user_id: reportedUserId,
            reason_id: Number(selectedReasonId),
            description: reportDescription || undefined,
          }),
        }
      );

      const result = await res.json();

      if (!res.ok || result.status === false) {
        throw new Error(result.message || "Failed to submit report");
      }

      setReportSuccess("User reported successfully.");
      // Reset & close modal
      setSelectedReasonId("");
      setReportDescription("");
      setShowReportModal(false);
      alert("User reported successfully.");
    } catch (err) {
      console.error("Error submitting report:", err);
      setReportError(
        err.message || "Something went wrong while reporting this user."
      );
    } finally {
      setReportSubmitLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white pb-20">
      <div className="max-w-md mx-auto min-h-screen bg-white pb-20">
        {/* HEADER */}
        <header className="flex items-center justify-between px-4 py-3 shadow-sm bg-white">
          <div className="flex items-center gap-3">
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
          </div>

          {/* REPORT ICON BUTTON */}
          <button
            type="button"
            onClick={() => setShowReportModal(true)}
            className="flex items-center gap-1 text-xs text-red-500 hover:text-red-600"
          >
            <FiFlag className="w-4 h-4" />
            <span>Report</span>
          </button>
        </header>

        {/* CONTENT */}
        <main className="px-4 py-4">
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
              {/* Verified */}
              <div className="flex items-center gap-1 text-[11px] mb-1">
                {user.is_active ? (
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

              {/* Name */}
              <h2 className="text-lg font-semibold text-navy">
                {user.name || "Member"}
              </h2>

              {/* Chips: gender+DOB, height, marital status */}
              <div className="flex flex-wrap gap-1 mt-1 text-[10px]">
                {profile.gender && profile.date_of_birth && (
                  <span className="px-2 py-0.5 rounded-full bg-[#FFF4E6] text-[#B36A1E]">
                    {profile.gender}, DOB {profile.date_of_birth}
                  </span>
                )}
                {profile.height && (
                  <span className="px-2 py-0.5 rounded-full bg-[#E6F4FF] text-[#1D7DEA]">
                    Height {heightText}
                  </span>
                )}
                {profile.marital_status && (
                  <span className="px-2 py-0.5 rounded-full bg-[#FDEBF3] text-[#B14F7E]">
                    {profile.marital_status}
                  </span>
                )}
              </div>

              {/* Religion & caste */}
              {(profile.religion || profile.caste) && (
                <p className="text-[11px] text-gray-600 mt-1">
                  {profile.religion}
                  {profile.caste && ` • ${profile.caste}`}
                </p>
              )}

              {/* Location */}
              {(profile.city || profile.state || profile.country) && (
                <p className="text-[11px] text-gray-600 mt-1 flex items-center gap-1">
                  <FiMapPin className="w-3 h-3 text-gray-400" />
                  <span>
                    {[profile.city, profile.state, profile.country]
                      .filter(Boolean)
                      .join(", ")}
                  </span>
                </p>
              )}

              {/* Joined on */}
              {user.date_joined && (
                <p className="text-[11px] text-gray-500 mt-1">
                  Joined on:{" "}
                  {new Date(user.date_joined).toLocaleDateString()}
                </p>
              )}

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
                <p className="font-semibold text-navy mb-0.5">Education</p>
                <p className="text-gray-700">{profile.education || "-"}</p>
                {profile.field_of_study && (
                  <p className="text-gray-500 mt-0.5">
                    {profile.field_of_study}
                  </p>
                )}
              </div>
              <div className="bg-[#FFF9F1] rounded-2xl p-3">
                <p className="font-semibold text-navy mb-0.5">Occupation</p>
                <p className="text-gray-700">
                  {mapOccupationLabel(profile.occupation) || "-"}
                </p>
                {profile.annual_income && (
                  <p className="text-gray-500 mt-0.5">
                    ₹ {profile.annual_income}
                  </p>
                )}
              </div>
            </section>

            {/* FAMILY & BACKGROUND */}
            <section className="px-4 pt-2 pb-3 bg-white text-[11px]">
              <div className="bg-[#F7F7F7] rounded-2xl p-3 space-y-1">
                <p className="text-sm font-semibold text-navy mb-1">
                  Family & Background
                </p>

                {profile.family_status && (
                  <p>
                    <span className="font-semibold">Family status: </span>
                    {profile.family_status}
                  </p>
                )}
                {profile.family_worth && (
                  <p>
                    <span className="font-semibold">Family worth: </span>₹{" "}
                    {profile.family_worth}
                  </p>
                )}
                {profile.mother_tongue && (
                  <p>
                    <span className="font-semibold">Mother tongue: </span>
                    {profile.mother_tongue}
                  </p>
                )}
                {profile.physical_status && (
                  <p>
                    <span className="font-semibold">Physical status: </span>
                    {profile.physical_status}
                  </p>
                )}
                {profile.children_count !== null &&
                  profile.children_count !== undefined && (
                    <p>
                      <span className="font-semibold">Children: </span>
                      {profile.children_count}
                    </p>
                  )}
                {profile.willing_inter_caste !== null &&
                  profile.willing_inter_caste !== undefined && (
                    <p>
                      <span className="font-semibold">Inter-caste: </span>
                      {profile.willing_inter_caste ? "Willing" : "Not willing"}
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
                      {listToText(lifestyle.music_genres)}
                    </p>
                  )}

                  {lifestyle.music_activities?.length > 0 && (
                    <p>
                      <span className="font-semibold">Music activities: </span>
                      {listToText(lifestyle.music_activities)}
                    </p>
                  )}

                  {lifestyle.movie_tv_genres?.length > 0 && (
                    <p>
                      <span className="font-semibold">Movies/TV: </span>
                      {listToText(lifestyle.movie_tv_genres)}
                    </p>
                  )}

                  {lifestyle.reading_preferences?.length > 0 && (
                    <p>
                      <span className="font-semibold">Reading: </span>
                      {listToText(lifestyle.reading_preferences)}
                    </p>
                  )}

                  {lifestyle.spoken_languages && (
                    <p>
                      <span className="font-semibold">Spoken languages: </span>
                      {lifestyle.spoken_languages}
                    </p>
                  )}

                  {lifestyle.fitness_activity && (
                    <p>
                      <span className="font-semibold">Fitness: </span>
                      {lifestyle.fitness_activity}
                    </p>
                  )}

                  {lifestyle.eating_habits && (
                    <p>
                      <span className="font-semibold">Eating habits: </span>
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
        </main>

        {/* REPORT MODAL */}
        {showReportModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
            <div className="bg-white rounded-2xl w-full max-w-sm mx-4 p-4">
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-sm font-semibold text-navy">Report user</h2>
                <button
                  type="button"
                  onClick={() => setShowReportModal(false)}
                  className="p-1 rounded-full hover:bg-gray-100"
                >
                  <FiX className="w-4 h-4 text-gray-500" />
                </button>
              </div>

              <form onSubmit={handleSubmitReport} className="space-y-3 text-xs">
                <div>
                  <label
                    htmlFor="report-reason"
                    className="block mb-1 font-medium text-gray-700"
                  >
                    Reason
                  </label>
                  <select
                    id="report-reason"
                    value={selectedReasonId}
                    onChange={(e) => setSelectedReasonId(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-2 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-red-400"
                    disabled={reportReasonsLoading}
                  >
                    <option value="">Select a reason</option>
                    {reportReasons.map((reason) => (
                      <option key={reason.id} value={reason.id}>
                        {reason.title}
                      </option>
                    ))}
                  </select>
                  {reportReasonsLoading && (
                    <p className="text-[11px] text-gray-400 mt-1">
                      Loading reasons…
                    </p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="report-description"
                    className="block mb-1 font-medium text-gray-700"
                  >
                    Additional details (optional)
                  </label>
                  <textarea
                    id="report-description"
                    rows={3}
                    value={reportDescription}
                    onChange={(e) => setReportDescription(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-2 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-red-400 resize-none"
                    placeholder="Describe what happened..."
                  />
                </div>

                {reportError && (
                  <p className="text-[11px] text-red-500">{reportError}</p>
                )}
                {reportSuccess && (
                  <p className="text-[11px] text-green-600">
                    {reportSuccess}
                  </p>
                )}

                <div className="flex justify-end gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => setShowReportModal(false)}
                    className="px-3 py-1.5 rounded-full border border-gray-300 text-xs text-gray-700"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={reportSubmitLoading || !selectedReasonId}
                    className="px-3 py-1.5 rounded-full bg-red-500 text-white text-xs disabled:opacity-60"
                  >
                    {reportSubmitLoading ? "Reporting..." : "Submit report"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        <BottomNav />
      </div>
    </div>
  );
};

export default InterestDetails;

// import React, { useEffect, useState } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import { FiArrowLeft, FiMapPin, FiCheckCircle } from "react-icons/fi";
// import BottomNav from "../../../components/BottomNav";
// import { getInterestDetails } from "../../../services/match.service";

// const formatHeight = (h) => {
//   if (!h) return "";
//   const [feetStr, inchStr] = String(h).split(".");
//   const feet = feetStr;
//   const inches = inchStr || "0";
//   return `${feet}' ${inches}"`;
// };

// const listToText = (arr) => {
//   if (!Array.isArray(arr) || !arr.length) return "";
//   return arr.map((item) => item?.name ?? item).join(", ");
// };

// const mapOccupationLabel = (code) => {
//   if (!code) return "";
//   const map = {
//     software: "Software Professional",
//     business: "Business",
//     doctor: "Doctor",
//     teacher: "Teacher",
//   };
//   return map[code] || code;
// };

// const InterestDetails = () => {
//   const params = useParams();
//   console.log("InterestDetails useParams:", params);

//   // Works with either /interests/:userId or /interests/:id
//   const interestId = params.userId || params.id;

//   const navigate = useNavigate();

//   const [data, setData] = useState(null); // full user object
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");

//   useEffect(() => {
//     if (!interestId) {
//       setError("Invalid profile");
//       setLoading(false);
//       return;
//     }

//     const fetchDetails = async () => {
//       try {
//         const token = localStorage.getItem("token");
//         if (!token) {
//           setError("Please login to view profile.");
//           setLoading(false);
//           return;
//         }

//         const res = await getInterestDetails(interestId, token);
//         console.log("getInterestDetails response:", res);

//         if (!res || !res.response) {
//           setError("Profile not found.");
//           return;
//         }

//         setData(res.response);
//       } catch (err) {
//         console.error("getInterestDetails error:", err);
//         setError("Failed to load profile details");
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchDetails();
//   }, [interestId]);

//   if (loading) {
//     return <p className="p-4 text-sm text-gray-500">Loading details…</p>;
//   }

//   if (error) {
//     return <p className="p-4 text-sm text-red-500">{error}</p>;
//   }

//   const user = data || {};
//   const profile = user.profile || {};
//   const lifestyle = profile.lifestyle || {};

//   const imageUrl =
//     user.profile_image ||
//     profile.profile_image ||
//     null;

//   const heightText = profile.height ? formatHeight(profile.height) : "";

//   return (
//     <div className="min-h-screen bg-white pb-20">
//       <div className="max-w-md mx-auto min-h-screen bg-white pb-20">
//         {/* HEADER */}
//         <header className="flex items-center gap-3 px-4 py-3 shadow-sm bg-white">
//           <button
//             type="button"
//             onClick={() => navigate(-1)}
//             className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center"
//           >
//             <FiArrowLeft className="w-4 h-4 text-navy" />
//           </button>
//           <h1 className="text-base font-semibold text-navy">Profile Details</h1>
//         </header>

//         {/* CONTENT */}
//         <main className="px-4 py-4">
//           <div className="rounded-3xl overflow-hidden shadow-md bg-gradient-to-b from-[#FFF7E9] via-white to-white">
//             {/* IMAGE */}
//             <div className="bg-gray-200">
//               {imageUrl ? (
//                 <img
//                   src={imageUrl}
//                   alt={user.name}
//                   className="w-full h-56 object-cover"
//                 />
//               ) : (
//                 <div className="w-full h-56 flex items-center justify-center text-navy text-lg font-semibold bg-gradient-to-br from-gray-300 to-gray-200">
//                   {user.name ? user.name[0].toUpperCase() : "M"}
//                 </div>
//               )}
//             </div>

//             {/* BASIC INFO */}
//             <section className="px-4 pt-3 pb-3 space-y-2 bg-white/70">
//               {/* Verified */}
//               <div className="flex items-center gap-1 text-[11px] mb-1">
//                 {user.is_active ? (
//                   <>
//                     <FiCheckCircle className="w-3 h-3 text-[#1D7DEA]" />
//                     <span className="text-[#1D7DEA]">Verified</span>
//                   </>
//                 ) : (
//                   <>
//                     <FiCheckCircle className="w-3 h-3 text-gray-400" />
//                     <span className="text-gray-400">Not verified yet</span>
//                   </>
//                 )}
//               </div>

//               {/* Name */}
//               <h2 className="text-lg font-semibold text-navy">
//                 {user.name || "Member"}
//               </h2>

//               {/* Chips: gender+DOB, height, marital status */}
//               <div className="flex flex-wrap gap-1 mt-1 text-[10px]">
//                 {profile.gender && profile.date_of_birth && (
//                   <span className="px-2 py-0.5 rounded-full bg-[#FFF4E6] text-[#B36A1E]">
//                     {profile.gender}, DOB {profile.date_of_birth}
//                   </span>
//                 )}
//                 {profile.height && (
//                   <span className="px-2 py-0.5 rounded-full bg-[#E6F4FF] text-[#1D7DEA]">
//                     Height {heightText}
//                   </span>
//                 )}
//                 {profile.marital_status && (
//                   <span className="px-2 py-0.5 rounded-full bg-[#FDEBF3] text-[#B14F7E]">
//                     {profile.marital_status}
//                   </span>
//                 )}
//               </div>

//               {/* Religion & caste */}
//               {(profile.religion || profile.caste) && (
//                 <p className="text-[11px] text-gray-600 mt-1">
//                   {profile.religion}
//                   {profile.caste && ` • ${profile.caste}`}
//                 </p>
//               )}

//               {/* Location */}
//               {(profile.city || profile.state || profile.country) && (
//                 <p className="text-[11px] text-gray-600 mt-1 flex items-center gap-1">
//                   <FiMapPin className="w-3 h-3 text-gray-400" />
//                   <span>
//                     {[profile.city, profile.state, profile.country]
//                       .filter(Boolean)
//                       .join(", ")}
//                   </span>
//                 </p>
//               )}

//               {/* Joined on */}
//               {user.date_joined && (
//                 <p className="text-[11px] text-gray-500 mt-1">
//                   Joined on:{" "}
//                   {new Date(user.date_joined).toLocaleDateString()}
//                 </p>
//               )}

//               {/* About */}
//               {profile.description && (
//                 <div className="mt-2">
//                   <p className="text-[11px] font-semibold text-navy mb-0.5">
//                     About
//                   </p>
//                   <p className="text-[11px] text-gray-700 leading-snug">
//                     {profile.description}
//                   </p>
//                 </div>
//               )}
//             </section>

//             {/* EDUCATION & WORK */}
//             <section className="px-4 pt-3 pb-3 grid grid-cols-2 gap-3 text-[11px] bg-white">
//               <div className="bg-[#F6FAFF] rounded-2xl p-3">
//                 <p className="font-semibold text-navy mb-0.5">Education</p>
//                 <p className="text-gray-700">{profile.education || "-"}</p>
//                 {profile.field_of_study && (
//                   <p className="text-gray-500 mt-0.5">
//                     {profile.field_of_study}
//                   </p>
//                 )}
//               </div>
//               <div className="bg-[#FFF9F1] rounded-2xl p-3">
//                 <p className="font-semibold text-navy mb-0.5">Occupation</p>
//                 <p className="text-gray-700">
//                   {mapOccupationLabel(profile.occupation) || "-"}
//                 </p>
//                 {profile.annual_income && (
//                   <p className="text-gray-500 mt-0.5">
//                     ₹ {profile.annual_income}
//                   </p>
//                 )}
//               </div>
//             </section>

//             {/* FAMILY & BACKGROUND (optional extra details) */}
//             <section className="px-4 pt-2 pb-3 bg-white text-[11px]">
//               <div className="bg-[#F7F7F7] rounded-2xl p-3 space-y-1">
//                 <p className="text-sm font-semibold text-navy mb-1">
//                   Family & Background
//                 </p>

//                 {profile.family_status && (
//                   <p>
//                     <span className="font-semibold">Family status: </span>
//                     {profile.family_status}
//                   </p>
//                 )}
//                 {profile.family_worth && (
//                   <p>
//                     <span className="font-semibold">Family worth: </span>₹{" "}
//                     {profile.family_worth}
//                   </p>
//                 )}
//                 {profile.mother_tongue && (
//                   <p>
//                     <span className="font-semibold">Mother tongue: </span>
//                     {profile.mother_tongue}
//                   </p>
//                 )}
//                 {profile.physical_status && (
//                   <p>
//                     <span className="font-semibold">Physical status: </span>
//                     {profile.physical_status}
//                   </p>
//                 )}
//                 {profile.children_count !== null &&
//                   profile.children_count !== undefined && (
//                     <p>
//                       <span className="font-semibold">Children: </span>
//                       {profile.children_count}
//                     </p>
//                   )}
//                 {profile.willing_inter_caste !== null &&
//                   profile.willing_inter_caste !== undefined && (
//                     <p>
//                       <span className="font-semibold">Inter-caste: </span>
//                       {profile.willing_inter_caste ? "Willing" : "Not willing"}
//                     </p>
//                   )}
//               </div>
//             </section>

//             {/* LIFESTYLE */}
//             {lifestyle && (
//               <section className="px-4 pt-2 pb-4 bg-white text-[11px]">
//                 <div className="bg-[#F7F7F7] rounded-2xl p-3 space-y-1">
//                   <p className="text-sm font-semibold text-navy mb-1">
//                     Lifestyle
//                   </p>

//                   {lifestyle.music_genres?.length > 0 && (
//                     <p>
//                       <span className="font-semibold">Music: </span>
//                       {listToText(lifestyle.music_genres)}
//                     </p>
//                   )}

//                   {lifestyle.music_activities?.length > 0 && (
//                     <p>
//                       <span className="font-semibold">Music activities: </span>
//                       {listToText(lifestyle.music_activities)}
//                     </p>
//                   )}

//                   {lifestyle.movie_tv_genres?.length > 0 && (
//                     <p>
//                       <span className="font-semibold">Movies/TV: </span>
//                       {listToText(lifestyle.movie_tv_genres)}
//                     </p>
//                   )}

//                   {lifestyle.reading_preferences?.length > 0 && (
//                     <p>
//                       <span className="font-semibold">Reading: </span>
//                       {listToText(lifestyle.reading_preferences)}
//                     </p>
//                   )}

//                   {lifestyle.spoken_languages && (
//                     <p>
//                       <span className="font-semibold">Spoken languages: </span>
//                       {lifestyle.spoken_languages}
//                     </p>
//                   )}

//                   {lifestyle.fitness_activity && (
//                     <p>
//                       <span className="font-semibold">Fitness: </span>
//                       {lifestyle.fitness_activity}
//                     </p>
//                   )}

//                   {lifestyle.eating_habits && (
//                     <p>
//                       <span className="font-semibold">Eating habits: </span>
//                       {lifestyle.eating_habits}
//                     </p>
//                   )}

//                   {lifestyle.smoking && (
//                     <p>
//                       <span className="font-semibold">Smoking: </span>
//                       {lifestyle.smoking}
//                     </p>
//                   )}

//                   {lifestyle.drinking && (
//                     <p>
//                       <span className="font-semibold">Drinking: </span>
//                       {lifestyle.drinking}
//                     </p>
//                   )}
//                 </div>
//               </section>
//             )}
//           </div>
//         </main>

//         <BottomNav />
//       </div>
//     </div>
//   );
// };

// export default InterestDetails;