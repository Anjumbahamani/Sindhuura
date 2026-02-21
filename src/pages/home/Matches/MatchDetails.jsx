// import React, { useEffect, useState } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import {
//   FiArrowLeft,
//   FiMapPin,
//   FiCheckCircle,
//   FiPhone,
//   FiMail,
//   FiFlag,
//   FiX,
// } from "react-icons/fi";
// import BottomNav from "../../../components/BottomNav";
// import { getMatchDetails } from "../../../services/match.service";
// import { getUserProfile } from "../../../services/auth.service";
// import { getMembershipFromProfile } from "../../../utils/membership";

// const formatHeight = (h) => {
//   if (!h) return "";
//   const [feetStr, inchStr] = String(h).split(".");
//   const feet = feetStr;
//   const inches = inchStr || "0";
//   return `${feet}' ${inches}"`;
// };

// // Free-trial users get 5 lifetime reveals (frontend rule)
// const FREE_CONTACT_LIMIT = 5;

// const MatchDetails = () => {
//   const { userId } = useParams();
//   const navigate = useNavigate();

//   const [data, setData] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState("");

//   // membership of the *current logged-in user*
//   const [membership, setMembership] = useState({
//     type: "free_trial",
//     isPremium: false,
//     planName: null,
//     planLimit: 0,
//     current_count: 0,
//     limit: 0,
//     expiryDate: null,
//   });

//   // Contact reveal state
//   const [contactInfo, setContactInfo] = useState(null);
//   const [revealLoading, setRevealLoading] = useState(false);
//   const [revealError, setRevealError] = useState("");

//   // Report modal state
//   const [showReportModal, setShowReportModal] = useState(false);
//   const [reportReasons, setReportReasons] = useState([]);
//   const [reportReasonsLoading, setReportReasonsLoading] = useState(false);
//   const [selectedReasonId, setSelectedReasonId] = useState("");
//   const [reportDescription, setReportDescription] = useState("");
//   const [reportSubmitLoading, setReportSubmitLoading] = useState(false);
//   const [reportError, setReportError] = useState("");
//   const [reportSuccess, setReportSuccess] = useState("");

//   useEffect(() => {
//     const fetchDetails = async () => {
//       try {
//         setLoading(true);
//         setError("");

//         const token = localStorage.getItem("token");
//         if (!token) {
//           setError("Please login to view details.");
//           return;
//         }

//         // 1) Match details
//         const res = await getMatchDetails(userId, token);
//         setData(res.response || null);

//         // 2) Logged-in user profile -> membership
//         const profileRes = await getUserProfile(token);
//         const profile = profileRes.response;
//         const m = getMembershipFromProfile(profile);
//         setMembership(m);
//       } catch (err) {
//         console.error("Failed to load match details:", err);
//         setError("Could not load details. Please try again.");
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchDetails();
//   }, [userId]);

//   const user = data || {};
//   const profile = user.profile || {};
//   const lifestyle = profile.lifestyle || {};

//   // If profile_image is a relative path, prepend your API base URL
//   const imageUrl =
//     user.profile_image && user.profile_image.startsWith("http")
//       ? user.profile_image
//       : user.profile_image
//         ? `${import.meta.env.VITE_API_BASE_URL || ""}${user.profile_image}`
//         : null;

//   // ----- Computed stats for attempts display -----
//   const isPremium = membership.isPremium;
//   const used = membership.current_count || 0;
//   const remaining = membership.limit || 0;
//   const total = membership.planLimit || used + remaining;

//   // For free users, calculate based on FREE_CONTACT_LIMIT
//   const freeUsed = isPremium ? 0 : membership.current_count || 0;
//   const freeRemaining = isPremium
//     ? 0
//     : Math.max(0, FREE_CONTACT_LIMIT - freeUsed);
//   const freeTotal = FREE_CONTACT_LIMIT;

//   const handleRevealContact = async () => {
//     try {
//       setRevealError("");

//       const token = localStorage.getItem("token");
//       if (!token) {
//         setRevealError("Please login to reveal contact details.");
//         return;
//       }

//       setRevealLoading(true);

//       const rawBase = import.meta.env.VITE_API_BASE_URL || "";
//       const baseUrl = rawBase.replace(/\/+$/, ""); // remove trailing slashes
//       const res = await fetch(
//         `${baseUrl}/api/match/reveal-contact/${userId}/`,
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         },
//       );

//       if (!res.ok) {
//         throw new Error(`HTTP ${res.status}`);
//       }

//       const json = await res.json();

//       // If status is false, show error
//       if (!json.status) {
//         throw new Error(json.message || "Failed to reveal contact details.");
//       }

//       const resp = json.response || {};

//       // Case 1: Contact details returned successfully
//       setContactInfo({
//         phone_number: resp.phone_number || null,
//         email: resp.email || null,
//         user_images: resp.user_images || [],
//         horoscope: resp.horoscope || null,
//       });

//       // Update membership counters using API response
//       // The API returns current_count and limit
//       setMembership((prev) => ({
//         ...prev,
//         type: "premium", // If this API works, user must be premium
//         isPremium: true,
//         current_count: resp.current_count || prev.current_count,
//         limit: resp.limit || prev.limit,
//         // Calculate planLimit as current_count + limit (total available)
//         planLimit: (resp.current_count || 0) + (resp.limit || 0),
//       }));

//       // Check if limit reached
//       if (resp.limit <= 0) {
//         setRevealError(
//           "You have reached your contact reveal limit for this plan.",
//         );
//       }
//     } catch (err) {
//       console.error("Reveal contact failed:", err);
//       setRevealError(
//         err.message || "Could not reveal contact. Please try again.",
//       );
//     } finally {
//       setRevealLoading(false);
//     }
//   };
//   useEffect(() => {
//     if (!showReportModal) return;

//     const fetchReasons = async () => {
//       try {
//         setReportReasonsLoading(true);
//         const token = localStorage.getItem("token");

//         const res = await fetch(
//           `${import.meta.env.VITE_API_BASE_URL}/api/match/report-reasons/`,
//           {
//             headers: {
//               "Content-Type": "application/json",
//               Authorization: `Bearer ${token}`,
//             },
//           },
//         );

//         const json = await res.json();
//         if (!json.status) throw new Error(json.message);

//         setReportReasons(json.response || []);
//       } catch (err) {
//         setReportError("Failed to load report reasons");
//       } finally {
//         setReportReasonsLoading(false);
//       }
//     };

//     fetchReasons();
//   }, [showReportModal]);
//   const handleSubmitReport = async (e) => {
//     e.preventDefault();
//     setReportError("");
//     setReportSuccess("");

//     const token = localStorage.getItem("token");
//     if (!token) {
//       setReportError("Please login to report this profile.");
//       return;
//     }

//     if (!selectedReasonId) {
//       setReportError("Please select a reason.");
//       return;
//     }

//     try {
//       setReportSubmitLoading(true);

//       const res = await fetch(
//         `${import.meta.env.VITE_API_BASE_URL}/api/match/report-user/`,
//         {
//           method: "POST",
//           headers: {
//             "Content-Type": "application/json",
//             Authorization: `Bearer ${token}`,
//           },
//           body: JSON.stringify({
//             reported_user_id: user?.id || Number(userId),
//             reason_id: Number(selectedReasonId),
//             description: reportDescription,
//           }),
//         },
//       );

//       const json = await res.json();

//       if (!json.status) throw new Error(json.message);

//       setReportSuccess("User reported successfully!");
//       alert("Report submitted ✔️");

//       // reset state
//       setShowReportModal(false);
//       setSelectedReasonId("");
//       setReportDescription("");
//     } catch (err) {
//       setReportError(err.message || "Something went wrong.");
//     } finally {
//       setReportSubmitLoading(false);
//     }
//   };
//   return (
//     <div className="min-h-screen bg-white pb-20">
//       <div className="max-w-md mx-auto min-h-screen bg-white pb-20">
//         {/* HEADER */}
//         <header className="flex items-center justify-between px-4 py-3 shadow-sm bg-white">
//           <div className="flex items-center gap-3">
//             <button
//               type="button"
//               onClick={() => navigate(-1)}
//               className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center"
//             >
//               <FiArrowLeft className="w-4 h-4 text-navy" />
//             </button>
//             <h1 className="text-base font-semibold text-navy">
//               Profile Details
//             </h1>
//           </div>

//           {/* REPORT ICON BUTTON */}
//           <button
//             type="button"
//             onClick={() => setShowReportModal(true)}
//             className="flex items-center gap-1 text-xs text-red-500 hover:text-red-600"
//           >
//             <FiFlag className="w-4 h-4" />
//             <span>Report</span>
//           </button>
//         </header>

//         {/* CONTENT */}
//         <main className="px-4 py-4">
//           {loading && <p className="text-sm text-gray-500">Loading details…</p>}

//           {error && !loading && <p className="text-sm text-red-500">{error}</p>}

//           {!loading && !error && data && (
//             <>
//               <div className="rounded-3xl overflow-hidden shadow-md bg-gradient-to-b from-[#FFF7E9] via-white to-white">
//                 {/* IMAGE */}
//                 <div className="bg-gray-200">
//                   {imageUrl ? (
//                     <img
//                       src={imageUrl}
//                       alt={user.name}
//                       className="w-full h-56 object-cover"
//                     />
//                   ) : (
//                     <div className="w-full h-56 flex items-center justify-center text-navy text-lg font-semibold bg-gradient-to-br from-gray-300 to-gray-200">
//                       {user.name ? user.name[0].toUpperCase() : "M"}
//                     </div>
//                   )}
//                 </div>

//                 {/* BASIC INFO */}
//                 <section className="px-4 pt-3 pb-3 space-y-2 bg-white/70">
//                   {(() => {
//                     const isVerified = data?.is_active === true;

//                     return (
//                       <div className="flex items-center gap-1 text-[11px] mb-1">
//                         {isVerified ? (
//                           <>
//                             <FiCheckCircle className="w-3 h-3 text-[#1D7DEA]" />
//                             <span className="text-[#1D7DEA]">Verified</span>
//                           </>
//                         ) : (
//                           <>
//                             <FiCheckCircle className="w-3 h-3 text-gray-400" />
//                             <span className="text-gray-400">
//                               Not verified yet
//                             </span>
//                           </>
//                         )}
//                       </div>
//                     );
//                   })()}

//                   <h2 className="text-lg font-semibold text-navy">
//                     {user.name || "Member"}
//                   </h2>

//                   {/* Chips row: age/height + location */}
//                   <div className="flex flex-wrap gap-1 mt-1 text-[10px]">
//                     {profile.gender && profile.date_of_birth && (
//                       <span className="px-2 py-0.5 rounded-full bg-[#FFF4E6] text-[#B36A1E]">
//                         {profile.gender}, DOB {profile.date_of_birth}
//                       </span>
//                     )}
//                     {profile.height && (
//                       <span className="px-2 py-0.5 rounded-full bg-[#E6F4FF] text-[#1D7DEA]">
//                         Height {formatHeight(profile.height)}
//                       </span>
//                     )}
//                     {profile.marital_status && (
//                       <span className="px-2 py-0.5 rounded-full bg-[#FDEBF3] text-[#B14F7E]">
//                         {profile.marital_status}
//                       </span>
//                     )}
//                   </div>

//                   {/* Religion & Caste */}
//                   <p className="text-[11px] text-gray-600 mt-1">
//                     {profile.religion} {profile.caste && `• ${profile.caste}`}
//                   </p>

//                   {/* Location */}
//                   <p className="text-[11px] text-gray-600 mt-1 flex items-center gap-1">
//                     <FiMapPin className="w-3 h-3 text-gray-400" />
//                     <span>
//                       {[profile.city, profile.state, profile.country]
//                         .filter(Boolean)
//                         .join(", ")}
//                     </span>
//                   </p>

//                   {/* About */}
//                   {profile.description && (
//                     <div className="mt-2">
//                       <p className="text-[11px] font-semibold text-navy mb-0.5">
//                         About
//                       </p>
//                       <p className="text-[11px] text-gray-700 leading-snug">
//                         {profile.description}
//                       </p>
//                     </div>
//                   )}
//                 </section>

//                 {/* EDUCATION & WORK */}
//                 <section className="px-4 pt-3 pb-3 grid grid-cols-2 gap-3 text-[11px] bg-white">
//                   <div className="bg-[#F6FAFF] rounded-2xl p-3">
//                     <p className="font-semibold text-navy mb-0.5">Education</p>
//                     <p className="text-gray-700">{profile.education || "-"}</p>
//                     {profile.field_of_study && (
//                       <p className="text-gray-500 mt-0.5">
//                         {profile.field_of_study}
//                       </p>
//                     )}
//                   </div>
//                   <div className="bg-[#FFF9F1] rounded-2xl p-3">
//                     <p className="font-semibold text-navy mb-0.5">Occupation</p>
//                     <p className="text-gray-700">
//                       {mapOccupationLabel(profile.occupation)}
//                     </p>
//                     {profile.annual_income && (
//                       <p className="text-gray-500 mt-0.5">
//                         ₹ {profile.annual_income} LPA
//                       </p>
//                     )}
//                   </div>
//                 </section>

//                 {/* LIFESTYLE */}
//                 {lifestyle && (
//                   <section className="px-4 pt-2 pb-3 bg-white text-[11px]">
//                     <div className="bg-[#F7F7F7] rounded-2xl p-3 space-y-1">
//                       <p className="text-sm font-semibold text-navy mb-1">
//                         Lifestyle
//                       </p>

//                       {lifestyle.music_genres?.length > 0 && (
//                         <p>
//                           <span className="font-semibold">Music: </span>
//                           {lifestyle.music_genres.join(", ")}
//                         </p>
//                       )}
//                       {lifestyle.movie_tv_genres?.length > 0 && (
//                         <p>
//                           <span className="font-semibold">Movies/TV: </span>
//                           {lifestyle.movie_tv_genres.join(", ")}
//                         </p>
//                       )}
//                       {lifestyle.favorite_sports && (
//                         <p>
//                           <span className="font-semibold">Sports: </span>
//                           {lifestyle.favorite_sports}
//                         </p>
//                       )}
//                       {lifestyle.fitness_activity && (
//                         <p>
//                           <span className="font-semibold">Fitness: </span>
//                           {lifestyle.fitness_activity}
//                         </p>
//                       )}
//                       {lifestyle.spoken_languages && (
//                         <p>
//                           <span className="font-semibold">
//                             Spoken languages:{" "}
//                           </span>
//                           {lifestyle.spoken_languages}
//                         </p>
//                       )}
//                       {lifestyle.eating_habits && (
//                         <p>
//                           <span className="font-semibold">Eating habits: </span>
//                           {lifestyle.eating_habits}
//                         </p>
//                       )}
//                       {lifestyle.smoking && (
//                         <p>
//                           <span className="font-semibold">Smoking: </span>
//                           {lifestyle.smoking}
//                         </p>
//                       )}
//                       {lifestyle.drinking && (
//                         <p>
//                           <span className="font-semibold">Drinking: </span>
//                           {lifestyle.drinking}
//                         </p>
//                       )}
//                     </div>
//                   </section>
//                 )}

//                 {/* CONTACT REVEAL SECTION */}
//                 {/* <section className="px-4 pt-1 pb-4 bg-white text-[11px]">
//                   <div className="mt-2 bg-[#F6FAFF] rounded-2xl border border-gray-100 p-3">
//                     <div className="flex items-center justify-between mb-1.5">
//                       <p className="text-sm font-semibold text-navy">
//                         Contact Details
//                       </p>
//                       <span className="text-[10px] text-gray-600">
//                         {isPremium ? "Premium Plan" : "Free Trial"}
//                       </span>
//                     </div>

//                     {isPremium && total > 0 && (
//                       <p className="text-[10px] text-gray-700 mb-1">
//                         Contacts used:{" "}
//                         <span className="font-semibold">
//                           {used}/{total}
//                         </span>
//                       </p>
//                     )}

//                     {!contactInfo && (
//                       <>
//                         {revealError && (
//                           <p className="text-[10px] text-red-500 mb-1">
//                             {revealError}
//                           </p>
//                         )}

//                         <button
//                           type="button"
//                           onClick={handleRevealContact}
//                           disabled={revealLoading}
//                           className="mt-1 w-full bg-primary text-white py-2 rounded-full text-[12px] font-semibold shadow disabled:opacity-60"
//                         >
//                           {revealLoading
//                             ? "Revealing contact…"
//                             : "Reveal contact details"}
//                         </button>

//                         {!isPremium && !revealError && (
//                           <p className="text-[10px] text-gray-500 mt-1">
//                             Contact details are a{" "}
//                             <span className="font-semibold">
//                               Premium feature
//                             </span>
//                             . Tap reveal to see upgrade options.
//                           </p>
//                         )}
//                       </>
//                     )}

//                     {contactInfo && (
//                       <div className="mt-2 space-y-1.5">
//                         {revealError && (
//                           <p className="text-[10px] text-red-800 mb-1">
//                             {revealError}
//                           </p>
//                         )}

//                         {contactInfo.phone_number && (
//                           <div className="flex items-center gap-2 text-[11px] text-gray-800">
//                             <div className="w-6 h-6 rounded-full bg-white flex items-center justify-center shadow-sm">
//                               <FiPhone className="w-3.5 h-3.5 text-primary" />
//                             </div>
//                             <span>{contactInfo.phone_number}</span>
//                           </div>
//                         )}

//                         {contactInfo.email && (
//                           <div className="flex items-center gap-2 text-[11px] text-gray-800">
//                             <div className="w-6 h-6 rounded-full bg-white flex items-center justify-center shadow-sm">
//                               <FiMail className="w-3.5 h-3.5 text-primary" />
//                             </div>
//                             <span>{contactInfo.email}</span>
//                           </div>
//                         )}

//                         {!contactInfo.phone_number && !contactInfo.email && (
//                           <p className="text-[10px] text-gray-600">
//                             Contact details revealed, but no phone/email were
//                             provided for this profile.
//                           </p>
//                         )}
//                       </div>
//                     )}
//                   </div>
//                 </section>
//                 {isPremium ? (
//                   contactInfo?.user_images?.length > 0 ? (
//                     <section className="px-4 pb-4 pt-2 bg-white">
//                       <p className="text-sm font-semibold text-navy mb-2">
//                         Additional Profile Photos
//                       </p>
//                       <div className="grid grid-cols-3 gap-2">
//                         {contactInfo.user_images.map((img, idx) => (
//                           <img
//                             key={idx}
//                             src={img.image}
//                             alt={`profile-${idx}`}
//                             className="w-full h-28 object-cover rounded-lg shadow-sm"
//                           />
//                         ))}
//                       </div>
//                     </section>
//                   ) : (
//                     <section className="px-4 pb-4 bg-white text-[11px] text-gray-500">
//                       No additional images available.
//                     </section>
//                   )
//                 ) : (
//                   <section className="px-4 pt-0 pb-4 bg-white text-[12px] text-center">
//                     <div className="bg-[#FFF7E0] text-[#B36A1E] text-sm font-medium rounded-xl px-4 py-4 shadow border border-[#FFE5C0]">
//                       🔐 Additional images are a{" "}
//                       <strong>Premium feature</strong>. <br />
//                       <button
//                         onClick={() => alert("Redirect to upgrade")}
//                         className="mt-2 inline-block bg-primary text-white px-5 py-2 rounded-full text-sm font-semibold"
//                       >
//                         Upgrade to View Photos
//                       </button>
//                     </div>
//                   </section>
//                 )}
//               </div>
//             </>
//           )} */}
//                 <section className="px-4 pt-1 pb-4 bg-white text-[11px]">
//                   <div className="mt-2 bg-[#F6FAFF] rounded-2xl border border-gray-100 p-3">
//                     <div className="flex items-center justify-between mb-1.5">
//                       <p className="text-sm font-semibold text-navy">
//                         Contact Details
//                       </p>
//                       <span className="text-[10px] text-gray-600">
//                         {isPremium ? "Premium Plan" : "Premium Feature"}
//                       </span>
//                     </div>

//                     {/* Show count for premium users */}
//                     {/* Show count for premium users */}
//                     {isPremium && total > 0 && (
//                       <p className="text-[10px] text-gray-700 mb-1">
//                         Contacts revealed:{" "}
//                         <span className="font-semibold">
//                           {used}/{total} (Remaining: {remaining})
//                         </span>
//                       </p>
//                     )}
//                     {/* Button or details */}
//                     {!contactInfo && (
//                       <>
//                         {revealError && (
//                           <p className="text-[10px] text-red-500 mb-1">
//                             {revealError}
//                           </p>
//                         )}

//                         <button
//                           type="button"
//                           onClick={handleRevealContact}
//                           disabled={revealLoading || !isPremium} // Disable for non-premium
//                           className={`mt-1 w-full py-2 rounded-full text-[12px] font-semibold shadow disabled:opacity-60 ${
//                             isPremium
//                               ? "bg-primary text-white"
//                               : "bg-gray-300 text-gray-500 cursor-not-allowed"
//                           }`}
//                         >
//                           {revealLoading
//                             ? "Revealing contact…"
//                             : isPremium
//                               ? "Reveal contact details"
//                               : "Upgrade to reveal contacts"}
//                         </button>

//                         {!isPremium && !revealError && (
//                           <p className="text-[10px] text-gray-500 mt-1 text-center">
//                             Contact details are a
//                             <span className="font-semibold p-1">
//                               Premium feature.
//                             </span>
//                             Upgrade to see contact details.
//                           </p>
//                         )}
//                       </>
//                     )}

//                     {contactInfo && (
//                       <div className="mt-2 space-y-1.5">
//                         {revealError && (
//                           <p className="text-[10px] text-red-800 mb-1">
//                             {revealError}
//                           </p>
//                         )}

//                         {contactInfo.phone_number && (
//                           <div className="flex items-center gap-2 text-[11px] text-gray-800">
//                             <div className="w-6 h-6 rounded-full bg-white flex items-center justify-center shadow-sm">
//                               <FiPhone className="w-3.5 h-3.5 text-primary" />
//                             </div>
//                             <span>{contactInfo.phone_number}</span>
//                           </div>
//                         )}

//                         {contactInfo.email && (
//                           <div className="flex items-center gap-2 text-[11px] text-gray-800">
//                             <div className="w-6 h-6 rounded-full bg-white flex items-center justify-center shadow-sm">
//                               <FiMail className="w-3.5 h-3.5 text-primary" />
//                             </div>
//                             <span>{contactInfo.email}</span>
//                           </div>
//                         )}

//                         {!contactInfo.phone_number && !contactInfo.email && (
//                           <p className="text-[10px] text-gray-600">
//                             Contact details revealed, but no phone/email were
//                             provided for this profile.
//                           </p>
//                         )}
//                       </div>
//                     )}
//                   </div>
//                 </section>

//                 {/* ADDITIONAL IMAGES SECTION */}
//                 {contactInfo && contactInfo.user_images?.length > 0 ? (
//                   <section className="px-4 pb-4 pt-2 bg-white">
//                     <p className="text-sm font-semibold text-navy mb-2">
//                       Additional Profile Photos (
//                       {contactInfo.user_images.length})
//                     </p>
//                     <div className="grid grid-cols-3 gap-2">
//                       {contactInfo.user_images.map((img, idx) => {
//                         // Handle relative image paths
//                         const imageUrl = img.image.startsWith("http")
//                           ? img.image
//                           : `${import.meta.env.VITE_API_BASE_URL}${img.image}`;

//                         return (
//                           <img
//                             key={idx}
//                             src={imageUrl}
//                             alt={`profile-${idx}`}
//                             className="w-full h-28 object-cover rounded-lg shadow-sm"
//                             onError={(e) => {
//                               e.target.onerror = null;
//                               e.target.src = "/fallback-image.jpg";
//                             }}
//                           />
//                         );
//                       })}
//                     </div>
//                   </section>
//                 ) : (
//                   contactInfo && (
//                     // Show this only if contactInfo exists but no images
//                     <section className="px-4 pb-4 bg-white text-[11px] text-gray-500 text-center py-2">
//                       No additional photos available for this profile.
//                     </section>
//                   )
//                 )}

//                 {/* Show upgrade prompt for free users when no contact revealed */}
//                 {!contactInfo && !isPremium && (
//                   <section className="px-4 pt-0 pb-4 bg-white text-[12px] text-center">
//                     <div className="bg-[#FFF7E0] text-[#B36A1E] text-sm font-medium rounded-xl px-4 py-4 shadow border border-[#FFE5C0]">
//                       🔐 Additional images are a{" "}
//                       <strong>Premium feature</strong>. <br />
//                       <button
//                         onClick={() => navigate("/home")}
//                         className="mt-2 inline-block bg-primary text-white px-5 py-2 rounded-full text-sm font-semibold"
//                       >
//                         Upgrade to View Photos
//                       </button>
//                     </div>
//                   </section>
//                 )}
//               </div>
//             </>
//           )}
//         </main>
//         {showReportModal && (
//           <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
//             <div className="bg-white rounded-2xl w-full max-w-sm mx-4 p-4">
//               <div className="flex items-center justify-between mb-3">
//                 <h2 className="text-sm font-semibold text-navy">Report user</h2>
//                 <button
//                   type="button"
//                   onClick={() => setShowReportModal(false)}
//                   className="p-1 rounded-full hover:bg-gray-100"
//                 >
//                   <FiX className="w-4 h-4 text-gray-500" />
//                 </button>
//               </div>

//               <form onSubmit={handleSubmitReport} className="space-y-3 text-xs">
//                 <div>
//                   <label className="block mb-1 font-medium text-gray-700">
//                     Reason
//                   </label>
//                   <select
//                     value={selectedReasonId}
//                     onChange={(e) => setSelectedReasonId(e.target.value)}
//                     className="w-full border border-gray-300 rounded-lg px-2 py-1.5 text-xs"
//                     disabled={reportReasonsLoading}
//                   >
//                     <option value="">Select a reason</option>
//                     {reportReasons.map((r) => (
//                       <option key={r.id} value={r.id}>
//                         {r.title}
//                       </option>
//                     ))}
//                   </select>
//                 </div>

//                 <div>
//                   <label className="block mb-1 font-medium text-gray-700">
//                     Description (optional)
//                   </label>
//                   <textarea
//                     className="w-full border border-gray-300 rounded-lg px-2 py-1.5 text-xs resize-none"
//                     rows="3"
//                     value={reportDescription}
//                     onChange={(e) => setReportDescription(e.target.value)}
//                     placeholder="Describe what happened..."
//                   />
//                 </div>

//                 {reportError && (
//                   <p className="text-[11px] text-red-500">{reportError}</p>
//                 )}
//                 {reportSuccess && (
//                   <p className="text-[11px] text-green-600">{reportSuccess}</p>
//                 )}

//                 <div className="flex justify-end gap-2 pt-1">
//                   <button
//                     type="button"
//                     onClick={() => setShowReportModal(false)}
//                     className="px-3 py-1.5 rounded-full border border-gray-300 text-xs text-gray-700"
//                   >
//                     Cancel
//                   </button>
//                   <button
//                     type="submit"
//                     disabled={reportSubmitLoading}
//                     className="px-3 py-1.5 rounded-full bg-red-500 text-white text-xs disabled:opacity-60"
//                   >
//                     {reportSubmitLoading ? "Reporting…" : "Submit Report"}
//                   </button>
//                 </div>
//               </form>
//             </div>
//           </div>
//         )}
//         <BottomNav />
//       </div>
//     </div>
//   );
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

// export default MatchDetails;

import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  FiArrowLeft,
  FiMapPin,
  FiCheckCircle,
  FiPhone,
  FiMail,
  FiFlag,
  FiX,
    FiMaximize2, 
} from "react-icons/fi";
import BottomNav from "../../../components/BottomNav";
import { getMatchDetails } from "../../../services/match.service";
import { getUserProfile } from "../../../services/auth.service";
import { getMembershipFromProfile } from "../../../utils/membership";

const formatHeight = (h) => {
  if (!h) return "";
  const [feetStr, inchStr] = String(h).split(".");
  const feet = feetStr;
  const inches = inchStr || "0";
  return `${feet}' ${inches}"`;
};

// Free-trial users get 5 lifetime reveals (frontend rule)
const FREE_CONTACT_LIMIT = 5;

const MatchDetails = () => {
  const { userId } = useParams();
  const navigate = useNavigate();

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // membership of the *current logged-in user*
  const [membership, setMembership] = useState({
    type: "free_trial",
    isPremium: false,
    planName: null,
    planLimit: 0,
    current_count: 0,
    limit: 0,
    expiryDate: null,
  });

  // Contact reveal state
  const [contactInfo, setContactInfo] = useState(null);
  const [revealLoading, setRevealLoading] = useState(false);
  const [revealError, setRevealError] = useState("");
  const [selectedImage, setSelectedImage] = useState(null);
  // Report modal state
  const [showReportModal, setShowReportModal] = useState(false);
  const [reportReasons, setReportReasons] = useState([]);
  const [reportReasonsLoading, setReportReasonsLoading] = useState(false);
  const [selectedReasonId, setSelectedReasonId] = useState("");
  const [reportDescription, setReportDescription] = useState("");
  const [reportSubmitLoading, setReportSubmitLoading] = useState(false);
  const [reportError, setReportError] = useState("");
  const [reportSuccess, setReportSuccess] = useState("");

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

        // 1) Match details (this is the main data we need)
        const res = await getMatchDetails(userId, token);
        setData(res.response || null);

        // 2) Logged-in user profile -> membership (handle errors gracefully)
        try {
          const profileRes = await getUserProfile(token);
          if (profileRes && profileRes.response) {
            const profile = profileRes.response;
            const m = getMembershipFromProfile(profile);
            setMembership(m);
          } else {
            // If no profile data, use default
            console.warn("No profile data received");
            setMembership({
              type: "free_trial",
              isPremium: false,
              planName: null,
              planLimit: 0,
              current_count: 0,
              limit: 0,
              expiryDate: null,
            });
          }
        } catch (profileErr) {
          console.warn(
            "Could not load user profile for membership:",
            profileErr,
          );
          // Use default membership but don't fail the whole page
          setMembership({
            type: "free_trial",
            isPremium: false,
            planName: null,
            planLimit: 0,
            current_count: 0,
            limit: 0,
            expiryDate: null,
          });
        }
      } catch (err) {
        console.error("Failed to load match details:", err);

        // More specific error messages
        if (err.message.includes("Failed to fetch")) {
          setError("Network error. Please check your internet connection.");
        } else if (
          err.message.includes("401") ||
          err.message.includes("Unauthorized")
        ) {
          setError("Your session has expired. Please login again.");
        } else if (err.message.includes("404")) {
          setError("Profile not found.");
        } else {
          setError("Could not load details. Please try again.");
        }
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

  // ----- Computed stats for attempts display -----
  const isPremium = membership.isPremium;
  const used = membership.current_count || 0;
  const remaining = membership.limit || 0;
  const total = membership.planLimit || used + remaining;

  // For free users, calculate based on FREE_CONTACT_LIMIT
  const freeUsed = isPremium ? 0 : membership.current_count || 0;
  const freeRemaining = isPremium
    ? 0
    : Math.max(0, FREE_CONTACT_LIMIT - freeUsed);
  const freeTotal = FREE_CONTACT_LIMIT;

  const handleRevealContact = async () => {
    try {
      setRevealError("");
      setRevealLoading(true);

      const token = localStorage.getItem("token");
      if (!token) {
        setRevealError("Please login to reveal contact details.");
        return;
      }

      const rawBase = import.meta.env.VITE_API_BASE_URL || "";
      const baseUrl = rawBase.replace(/\/+$/, "");
      const url = `${baseUrl}/api/match/reveal-contact/${userId}/`;

      console.log("Reveal contact URL:", url);
      console.log("User ID:", userId);
      console.log("Is premium user?", isPremium);

      const res = await fetch(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      console.log("Response status:", res.status);
      console.log("Response ok?", res.ok);

      if (!res.ok) {
        const errorText = await res.text();
        console.error("API Error response:", errorText);
        throw new Error(`HTTP ${res.status}: ${errorText}`);
      }

      const json = await res.json();
      console.log("Full API response:", json);

      // If status is false, show error
      if (!json.status) {
        console.error("API returned false status:", json.message);
        throw new Error(json.message || "Failed to reveal contact details.");
      }

      const resp = json.response || {};
      console.log("Contact reveal response data:", resp);

      // Case 1: Contact details returned successfully
      setContactInfo({
        phone_number: resp.phone_number || null,
        email: resp.email || null,
        user_images: resp.user_images || [],
        horoscope: resp.horoscope || null,
      });

      // Update membership counters using API response
      // The API returns current_count and limit
      setMembership((prev) => ({
        ...prev,
        type: "premium", // If this API works, user must be premium
        isPremium: true,
        current_count: resp.current_count || prev.current_count,
        limit: resp.limit || prev.limit,
        // Calculate planLimit as current_count + limit (total available)
        planLimit: (resp.current_count || 0) + (resp.limit || 0),
      }));

      // Check if limit reached
      if (resp.limit <= 0) {
        setRevealError(
          "You have reached your contact reveal limit for this plan.",
        );
      }

      // Show success message
      if (resp.phone_number || resp.email) {
        console.log("Contact revealed successfully!");
      }
    } catch (err) {
      console.error("Reveal contact failed:", err);
      console.error("Error details:", {
        message: err.message,
        stack: err.stack,
        name: err.name,
      });

      // More specific error messages
      if (err.message.includes("Failed to fetch")) {
        setRevealError("Network error. Please check your internet connection.");
      } else if (
        err.message.includes("401") ||
        err.message.includes("Unauthorized")
      ) {
        setRevealError("Your session has expired. Please login again.");
      } else if (
        err.message.includes("403") ||
        err.message.includes("Forbidden")
      ) {
        setRevealError(
          "You don't have permission to reveal contacts. Please upgrade your plan.",
        );
      } else if (err.message.includes("404")) {
        setRevealError("Profile not found.");
      } else {
        setRevealError(
          err.message || "Could not reveal contact. Please try again.",
        );
      }
    } finally {
      setRevealLoading(false);
    }
  };
  useEffect(() => {
    if (!showReportModal) return;

    const fetchReasons = async () => {
      try {
        setReportReasonsLoading(true);
        const token = localStorage.getItem("token");

        const res = await fetch(
          `${import.meta.env.VITE_API_BASE_URL}/api/match/report-reasons/`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          },
        );

        const json = await res.json();
        if (!json.status) throw new Error(json.message);

        setReportReasons(json.response || []);
      } catch (err) {
        setReportError("Failed to load report reasons");
      } finally {
        setReportReasonsLoading(false);
      }
    };

    fetchReasons();
  }, [showReportModal]);
  const handleSubmitReport = async (e) => {
    e.preventDefault();
    setReportError("");
    setReportSuccess("");

    const token = localStorage.getItem("token");
    if (!token) {
      setReportError("Please login to report this profile.");
      return;
    }

    if (!selectedReasonId) {
      setReportError("Please select a reason.");
      return;
    }

    try {
      setReportSubmitLoading(true);

      const res = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/api/match/report-user/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            reported_user_id: user?.id || Number(userId),
            reason_id: Number(selectedReasonId),
            description: reportDescription,
          }),
        },
      );

      const json = await res.json();

      if (!json.status) throw new Error(json.message);

      setReportSuccess("User reported successfully!");
      alert("Report submitted ✔️");

      // reset state
      setShowReportModal(false);
      setSelectedReasonId("");
      setReportDescription("");
    } catch (err) {
      setReportError(err.message || "Something went wrong.");
    } finally {
      setReportSubmitLoading(false);
    }
  };
    useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape") setSelectedImage(null);
    };
    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, []);
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
          {loading && <p className="text-sm text-gray-500">Loading details…</p>}

          {error && !loading && <p className="text-sm text-red-500">{error}</p>}

          {!loading && !error && data && (
            <>
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
                  {(() => {
                    const isVerified = data?.is_active === true;

                    return (
                      <div className="flex items-center gap-1 text-[11px] mb-1">
                        {isVerified ? (
                          <>
                            <FiCheckCircle className="w-3 h-3 text-[#1D7DEA]" />
                            <span className="text-[#1D7DEA]">Verified</span>
                          </>
                        ) : (
                          <>
                            <FiCheckCircle className="w-3 h-3 text-gray-400" />
                            <span className="text-gray-400">
                              Not verified yet
                            </span>
                          </>
                        )}
                      </div>
                    );
                  })()}

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
                    {profile.religion} {profile.caste && `• ${profile.caste}`}
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
                  <section className="px-4 pt-2 pb-3 bg-white text-[11px]">
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
                          <span className="font-semibold">Movies/TV: </span>
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

                <section className="px-4 pt-1 pb-4 bg-white text-[11px]">
                  <div className="mt-2 bg-[#F6FAFF] rounded-2xl border border-gray-100 p-3">
                    <div className="flex items-center justify-between mb-1.5">
                      <p className="text-sm font-semibold text-navy">
                        Contact Details
                      </p>
                      <span className="text-[10px] text-gray-600">
                        {isPremium ? "Premium Plan" : "Premium Feature"}
                      </span>
                    </div>

                    {/* Show count for premium users */}
                    {/* Show count for premium users */}
                    {isPremium && total > 0 && (
                      <p className="text-[10px] text-gray-700 mb-1">
                        Contacts revealed:{" "}
                        <span className="font-semibold">
                          {used}/{remaining}
                        </span>
                      </p>
                    )}
                    {/* Button or details */}
                    {!contactInfo && (
                      <>
                        {revealError && (
                          <p className="text-[10px] text-red-500 mb-1">
                            {revealError}
                          </p>
                        )}

                        <button
                          type="button"
                          onClick={handleRevealContact}
                          disabled={revealLoading || !isPremium} // Disable for non-premium
                          className={`mt-1 w-full py-2 rounded-full text-[12px] font-semibold shadow disabled:opacity-60 ${
                            isPremium
                              ? "bg-primary text-white"
                              : "bg-gray-300 text-gray-500 cursor-not-allowed"
                          }`}
                        >
                          {revealLoading
                            ? "Revealing contact…"
                            : isPremium
                              ? "Reveal contact details"
                              : "Upgrade to reveal contacts"}
                        </button>

                        {!isPremium && !revealError && (
                          <p className="text-[10px] text-gray-500 mt-1 text-center">
                            Contact details are a
                            <span className="font-semibold p-1">
                              Premium feature.
                            </span>
                            Upgrade to see contact details.
                          </p>
                        )}
                      </>
                    )}

                    {contactInfo && (
                      <div className="mt-2 space-y-1.5">
                        {revealError && (
                          <p className="text-[10px] text-red-800 mb-1">
                            {revealError}
                          </p>
                        )}

                        {contactInfo.phone_number && (
                          <div className="flex items-center gap-2 text-[11px] text-gray-800">
                            <div className="w-6 h-6 rounded-full bg-white flex items-center justify-center shadow-sm">
                              <FiPhone className="w-3.5 h-3.5 text-primary" />
                            </div>
                            <span>{contactInfo.phone_number}</span>
                          </div>
                        )}

                        {contactInfo.email && (
                          <div className="flex items-center gap-2 text-[11px] text-gray-800">
                            <div className="w-6 h-6 rounded-full bg-white flex items-center justify-center shadow-sm">
                              <FiMail className="w-3.5 h-3.5 text-primary" />
                            </div>
                            <span>{contactInfo.email}</span>
                          </div>
                        )}

                        {!contactInfo.phone_number && !contactInfo.email && (
                          <p className="text-[10px] text-gray-600">
                            Contact details revealed, but no phone/email were
                            provided for this profile.
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                </section>

                {/* ADDITIONAL IMAGES SECTION */}
                {contactInfo && contactInfo.user_images?.length > 0 ? (
                  <section className="px-4 pb-4 pt-2 bg-white">
                    <p className="text-sm font-semibold text-navy mb-2">
                      Additional Profile Photos (
                      {contactInfo.user_images.length})
                    </p>
                    <div className="grid grid-cols-3 gap-2">
                      {contactInfo.user_images.map((img, idx) => {
                        // Handle relative image paths
                        const imageUrl = img.image.startsWith("http")
                          ? img.image
                          : `${import.meta.env.VITE_API_BASE_URL}${img.image}`;

                        return (
                          <img
                            key={idx}
                            src={imageUrl}
                            alt={`profile-${idx}`}
                            className="w-full h-28 object-cover rounded-lg shadow-sm"
                            onError={(e) => {
                              e.target.onerror = null;
                              e.target.src = "/fallback-image.jpg";
                            }}
                          />
                        );
                      })}
                    </div>
                  </section>
                ) : (
                  contactInfo && (
                    // Show this only if contactInfo exists but no images
                    <section className="px-4 pb-4 bg-white text-[11px] text-gray-500 text-center py-2">
                      No additional photos available for this profile.
                    </section>
                  )
                )}

                {/* Show upgrade prompt for free users when no contact revealed */}
                {!contactInfo && !isPremium && (
                  <section className="px-4 pt-0 pb-4 bg-white text-[12px] text-center">
                    <div className="bg-[#FFF7E0] text-[#B36A1E] text-sm font-medium rounded-xl px-4 py-4 shadow border border-[#FFE5C0]">
                      🔐 Additional images are a{" "}
                      <strong>Premium feature</strong>. <br />
                      <button
                        onClick={() => navigate("/home")}
                        className="mt-2 inline-block bg-primary text-white px-5 py-2 rounded-full text-sm font-semibold"
                      >
                        Upgrade to View Photos
                      </button>
                    </div>
                  </section>
                )}
              </div>
            </>
          )}
        </main>
         {selectedImage && (
          <div 
            className="fixed inset-0 z-[60] bg-black/95 flex items-center justify-center p-4"
            onClick={() => setSelectedImage(null)}
          >
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setSelectedImage(null);
              }}
              className="absolute top-4 right-4 w-10 h-10 rounded-full bg-black/50 text-white flex items-center justify-center hover:bg-black/70 transition-colors z-[61]"
            >
              <FiX className="w-6 h-6" />
            </button>
            
            <img
              src={selectedImage}
              alt="Fullscreen view"
              className="max-w-full max-h-full object-contain rounded-lg"
              onClick={(e) => e.stopPropagation()}
            />
            
            <p className="absolute bottom-6 left-0 right-0 text-center text-white/60 text-sm">
              Tap anywhere or press Escape to close
            </p>
          </div>
        )}
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
                  <label className="block mb-1 font-medium text-gray-700">
                    Reason
                  </label>
                  <select
                    value={selectedReasonId}
                    onChange={(e) => setSelectedReasonId(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-2 py-1.5 text-xs"
                    disabled={reportReasonsLoading}
                  >
                    <option value="">Select a reason</option>
                    {reportReasons.map((r) => (
                      <option key={r.id} value={r.id}>
                        {r.title}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block mb-1 font-medium text-gray-700">
                    Description (optional)
                  </label>
                  <textarea
                    className="w-full border border-gray-300 rounded-lg px-2 py-1.5 text-xs resize-none"
                    rows="3"
                    value={reportDescription}
                    onChange={(e) => setReportDescription(e.target.value)}
                    placeholder="Describe what happened..."
                  />
                </div>

                {reportError && (
                  <p className="text-[11px] text-red-500">{reportError}</p>
                )}
                {reportSuccess && (
                  <p className="text-[11px] text-green-600">{reportSuccess}</p>
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
                    disabled={reportSubmitLoading}
                    className="px-3 py-1.5 rounded-full bg-red-500 text-white text-xs disabled:opacity-60"
                  >
                    {reportSubmitLoading ? "Reporting…" : "Submit Report"}
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
