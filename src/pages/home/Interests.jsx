import React, { useEffect, useState } from "react";
import BottomNav from "../../components/BottomNav";
import {
  FiMapPin,
  FiCheckCircle,
  FiFilter,
  FiChevronDown,
  FiHeart,
  FiX,
  FiInbox,
  FiSearch,
} from "react-icons/fi";
import { FaHeart } from "react-icons/fa";
import {
  getSentRequests,
  getReceivedRequests,
  acceptRequest,
  rejectRequest,
  searchSentRequests,
  searchReceivedRequests,
} from "../../services/match.service";
import { useNavigate } from "react-router-dom";


const Interests = () => {
  const [activeTab, setActiveTab] = useState("sent"); // "sent" | "received"
  const [sentRequests, setSentRequests] = useState([]);
  const [receivedRequests, setReceivedRequests] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [searching, setSearching] = useState(false);
  const searchTimer = React.useRef(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError("");

        const token = localStorage.getItem("token");
        if (!token) {
          setError("Please login to view interests.");
          return;
        }

        if (searchQuery.trim()) {
          setSearching(true);

          const res =
            activeTab === "sent"
              ? await searchSentRequests(searchQuery, token)
              : await searchReceivedRequests(searchQuery, token);

          if (activeTab === "sent") {
            setSentRequests(res.response || []);
          } else {
            setReceivedRequests(res.response || []);
          }

          return;
        }

  //       if (activeTab === "sent") {
  //         const res = await getSentRequests(token);
  //         setSentRequests(res.response || []);
  //       } else {
  //         const res = await getReceivedRequests(token);
  //         setReceivedRequests(res.response || []);
  //       }
  //     } catch (err) {
  //       console.error("Failed to load interests:", err);
  //       setError("Could not load interests. Please try again.");
  //     } finally {
  //       setLoading(false);
  //       setSearching(false);
  //     }
  //   };

  //   fetchData();
  // }, [activeTab, searchQuery]);
   const [sentRes, receivedRes] = await Promise.all([
        getSentRequests(token),
        getReceivedRequests(token),
      ]);

      setSentRequests(sentRes.response || []);
      setReceivedRequests(receivedRes.response || []);
    } catch (err) {
      console.error("Failed to load interests:", err);
      setError("Could not load interests. Please try again.");
    } finally {
      setLoading(false);
      setSearching(false);
    }
  };

  fetchData();
}, [searchQuery]); 
useEffect(() => {
  const token = localStorage.getItem("token");

  if (activeTab === "sent") {
    getSentRequests(token).then((res) =>
      setSentRequests(res.response || [])
    );
  } else {
    getReceivedRequests(token).then((res) =>
      setReceivedRequests(res.response || [])
    );
  }
}, [activeTab]);

  const currentList = activeTab === "sent" ? sentRequests : receivedRequests;
  const currentCount = currentList.length;

  const headerText =
    activeTab === "sent"
      ? "Profiles you have shown interest in"
      : "Profiles who have shown interest in you";

  return (
    <div className="min-h-screen bg-white pb-20">
      <div className="max-w-md mx-auto min-h-screen bg-white pb-20">
        {/* HEADER */}
        <div className="bg-white shadow-sm pb-2">
          <div className="px-4 pt-3">
            <h1 className="text-lg font-semibold text-navy">Interests</h1>
            <p className="text-[11px] text-gray-500">
              Manage your sent and received interests
            </p>
          </div>

          {/* Tabs as chips */}
          <div className="px-4 mt-3 mb-1">
            <div className="flex bg-[#F7F7F7] rounded-full p-1 gap-1">
              {[
                { id: "sent", label: "Sent" },
                { id: "received", label: "Received" },
              ].map((tab) => {
                const isActive = activeTab === tab.id;
                const count =
                  tab.id === "sent"
                    ? sentRequests.length
                    : receivedRequests.length;

                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`
                      flex-1 inline-flex items-center justify-center gap-1 px-3 py-1.5
                      rounded-full text-[11px] font-semibold transition
                      ${
                        isActive
                          ? "bg-primary text-white shadow-sm"
                          : "bg-white text-gray-600 border border-gray-200"
                      }
                    `}
                  >
                    <span>{tab.label}</span>
                    <span
                      className={`
                        text-[10px] px-1.5 py-0.5 rounded-full
                        ${
                          isActive
                            ? "bg-white/15 text-white"
                            : "bg-gray-100 text-gray-500"
                        }
                      `}
                    >
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Filter row */}
          <div className="px-4 mt-2 mb-2">
            <p className="text-[11px] text-gray-500 mb-2">
              {currentCount}{" "}
              {activeTab === "sent" ? "sent interests" : "received interests"}{" "}
              based on your{" "}
              <span className="text-primary font-semibold cursor-pointer">
                criteria
              </span>
            </p>
            <div className="px-1 mt-2 mb-2">
              <div className="flex items-center bg-white border border-gray-300 rounded-full px-2 py-2 shadow-sm">
                <FiSearch className="w-4 h-4 text-gray-400 mr-2" />
                <input
                  type="text"
                  placeholder={`Search ${
                    activeTab === "sent" ? "sent" : "received"
                  } interests`}
                  value={searchQuery}
                  onChange={(e) => {
                    const value = e.target.value;
                    setSearchQuery(value);

                    clearTimeout(searchTimer.current);
                    searchTimer.current = setTimeout(() => {
                      setSearchQuery(value.trim());
                    }, 400);
                  }}
                  className="flex-1 outline-none text-[12px] bg-transparent"
                />
              </div>

              {searching && (
                <p className="text-[11px] text-gray-500 mt-1 px-1">
                  Searching…
                </p>
              )}
            </div>
          </div>
        </div>

        {/* MAIN CONTENT */}
        <main className="px-3 pt-3">
          {loading && (
            <p className="text-sm text-gray-500 mb-3 px-1">
              Loading {activeTab} interests…
            </p>
          )}

          {error && <p className="text-sm text-red-500 mb-3 px-1">{error}</p>}

          <p className="text-[11px] text-gray-500 mb-2 px-1">{headerText}</p>

          <div className="space-y-3">
            {!loading &&
              currentList.map((req) =>
                activeTab === "sent" ? (
                  <SentInterestCard key={req.id} request={req} />
                ) : (
                  <ReceivedInterestCard key={req.id} request={req} />
                )
              )}

            {!loading && currentList.length === 0 && !error && (
              <div className="flex flex-col items-center justify-center mt-20 text-center text-gray-500">
                <div className="w-16 h-16 rounded-full bg-[#FFF7E9] flex items-center justify-center mb-3 shadow-sm">
                  <FiInbox className="w-8 h-8 text-[#B36A1E]" />
                </div>
                <p className="text-sm font-semibold text-navy">
                  No {activeTab === "sent" ? "sent" : "received"} interests yet
                </p>
                <p className="text-[12px] text-gray-500 mt-1 max-w-[220px]">
                  {activeTab === "sent"
                    ? "Start exploring matches and send interests to connect."
                    : "You haven't received any interests yet. Check back later!"}
                </p>
              </div>
            )}
          </div>
        </main>

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

const SentInterestCard = ({ request }) => {
  const navigate = useNavigate();

  const { profile, status, created_at } = request;
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
    id: profileId,
    user: profileUser,
    user_id: profileUserId,
  } = profile || {};

  // 🔍 Log all possible IDs so we can see what's what
  console.log("SentInterestCard ids:", {
    requestId: request.id,
    profileId,
    profileUser,
    profileUserId,
  });

  const heightText = height ? formatHeight(height) : "";
  const location = [city, state].filter(Boolean).join(", ");
  const community = [religion?.name || "", caste?.name || ""]
    .filter(Boolean)
    .join(" • ");

  const statusLabel =
    status === "pending"
      ? "Pending"
      : status === "accepted"
      ? "Accepted"
      : status === "rejected"
      ? "Declined"
      : status;

  const handleCardClick = () => {
    // for now, still using profile?.user as you wrote:
    const userId = profileUser || profileUserId || profileId || request.id;
    console.log("➡️ Navigating to /interests/", userId);
    if (!userId) {
      console.warn("No usable id on request:", request);
      return;
    }
    navigate(`/interests/${userId}`);
  };

  return (
    <div
      onClick={handleCardClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === "Enter" && handleCardClick()}
      className="cursor-pointer bg-white rounded-2xl shadow-sm border-l-4 border-red-500 px-3 py-3 flex gap-3 items-center hover:shadow-md transition"
    >
      {/* AVATAR */}
      <div className="w-14 h-14 rounded-2xl overflow-hidden flex-shrink-0 bg-[#FFF4EC] flex items-center justify-center">
        {profile_image ? (
          <img
            src={profile_image}
            alt={name}
            className="w-full h-full object-cover"
          />
        ) : (
          <span className="text-navy text-lg font-semibold">
            {name ? name[0].toUpperCase() : "M"}
          </span>
        )}
      </div>

      {/* MIDDLE INFO */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1 mb-0.5">
          <p className="text-sm font-semibold text-navy truncate">
            {name || "Member"}
          </p>
          <FiCheckCircle className="w-3 h-3 text-[#1D7DEA]" />
        </div>

        <p className="text-[10px] text-gray-500 mb-0.5 truncate">
          {age && `${age} yrs`} {heightText && ` • ${heightText}`}{" "}
          {community && ` • ${community}`}
        </p>

        <p className="text-[10px] text-gray-500 flex items-center gap-1 truncate">
          <FiMapPin className="w-3 h-3 text-gray-400" />
          <span>{location}</span>
        </p>

        <p className="text-[10px] text-gray-500 mt-0.5 truncate">
          <span className="font-semibold text-gray-600">Sent on:</span>{" "}
          {created_at}
        </p>
      </div>

      {/* RIGHT: status + icon */}
      <div className="flex flex-col items-end gap-1 text-right">
        <span
          className={`px-2 py-0.5 rounded-full text-[10px] font-semibold
    ${
      status === "accepted"
        ? "bg-[#E6F8EF] text-[#1BA34A]"
        : status === "rejected"
        ? "bg-[#FDECEC] text-[#E04B4B]"
        : "bg-[#FFF5E5] text-[#B36A1E]"
    }`}
        >
          {statusLabel}
        </span>

        {/* HEART ICON changes with status */}
        <div className="w-6 h-6 mt-4 rounded-full bg-gray-100 flex items-center justify-center">
          {status === "accepted" ? (
            <FaHeart className="w-3.5 h-3.5 text-red-500" />
          ) : (
            <FiHeart className="w-3.5 h-3.5 text-[#FF9B57]" />
          )}
        </div>
      </div>
    </div>
  );
};

// const ReceivedInterestCard = ({ request }) => {
//   const { profile, status, created_at } = request;
//   const {
//     profile_image,
//     name,
//     age,
//     height,
//     occupation,
//     city,
//     state,
//     religion,
//     caste,
//   } = profile || {};

//   const heightText = height ? formatHeight(height) : "";
//   const location = [city, state].filter(Boolean).join(", ");
//   const community = [religion?.name || "", caste?.name || ""]
//     .filter(Boolean)
//     .join(" • ");

//   const statusLabel =
//     status === "pending"
//       ? "Pending"
//       : status === "accepted"
//       ? "Accepted"
//       : status === "rejected"
//       ? "Declined"
//       : status;

//   return (
//     <div className="bg-white rounded-3xl shadow-md overflow-hidden">
//       {/* IMAGE */}
//       <div className="relative">
//         <div className="h-64 bg-gray-200">
//           {profile_image ? (
//             <img
//               src={profile_image}
//               alt={name}
//               className="w-full h-full object-cover"
//             />
//           ) : (
//             <div className="w-full h-full flex items-center justify-center text-navy text-lg font-semibold bg-gradient-to-br from-gray-300 to-gray-200">
//               {name ? name[0].toUpperCase() : "M"}
//             </div>
//           )}
//         </div>
//       </div>

//       {/* DETAILS */}
//       <div className="px-4 pt-3 pb-3">
//         <div className="flex items-center justify-between mb-1">
//           <p className="text-base font-semibold text-navy">
//             {name || "Member"}
//           </p>
//           <span
//             className={`px-2 py-0.5 rounded-full text-[10px] font-semibold
//               ${
//                 status === "accepted"
//                   ? "bg-[#E6F8EF] text-[#1BA34A]"
//                   : status === "rejected"
//                   ? "bg-[#FDECEC] text-[#E04B4B]"
//                   : "bg-[#FFF5E5] text-[#B36A1E]"
//               }`}
//           >
//             {statusLabel}
//           </span>
//         </div>

//         <p className="text-[10px] text-gray-500 mb-1">
//           Received on: {created_at}
//         </p>

//         <p className="text-[11px] text-gray-700 leading-snug mb-1">
//           {age && `${age} yrs`} {heightText && ` • ${heightText}`}{" "}
//           {community && ` • ${community}`}
//           {occupation && ` • ${mapOccupationLabel(occupation)}`}
//           {location && ` • ${location}`}
//         </p>

//         {/* Future: Accept / Decline buttons (UI only for now) */}
//         <div className="mt-2 flex gap-2">
//           <button
//             disabled
//             className="flex-1 inline-flex items-center justify-center gap-1 px-3 py-2 rounded-full border border-gray-300 text-[12px] text-gray-500 bg-gray-100 cursor-not-allowed"
//           >
//             <FiX className="w-3 h-3" />
//             <span>Decline</span>
//           </button>
//           <button
//             disabled
//             className="flex-1 inline-flex items-center justify-center gap-1 px-3 py-2 rounded-full bg-primary text-white text-[12px] font-semibold shadow cursor-not-allowed"
//           >
//             <FiHeart className="w-3 h-3" />
//             <span>Accept</span>
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

const ReceivedInterestCard = ({ request, onActionComplete }) => {
  const navigate = useNavigate();
  const { id, profile, status, created_at } = request;
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
    user : profileUser,
    user_id:profileUserId,
  } = profile || {};

  const [submitting, setSubmitting] = useState(false);
  const [actionDone, setActionDone] = useState(null);

  const heightText = height ? formatHeight(height) : "";
  const location = [city, state].filter(Boolean).join(", ");
  const community = [religion?.name || "", caste?.name || ""]
    .filter(Boolean)
    .join(" • ");

  const token = localStorage.getItem("token");

  const handleCardClick =()=>{
    const userId = profileUser || profileUserId;
    if (!userId){
      console.warn("No user id on received interest :",request);
      return;
    }
    navigate(`/interests/${userId}`);
  }
  const handleAccept = async () => {
    // e.stopPropagation();
    try {
      setSubmitting(true);
      await acceptRequest(id, token);

      setActionDone("accepted");
      onActionComplete?.();
    } catch (err) {
      console.error("Accept failed", err);
      alert("Failed to accept request");
    } finally {
      setSubmitting(false);
    }
  };

  const handleReject = async () => {
    e.stopPropagation();
    try {
      setSubmitting(true);
      await rejectRequest(id, token);
      setActionDone("rejected");
      onActionComplete?.();
    } catch (err) {
      console.error("Reject failed", err);
      alert("Failed to reject request");
    } finally {
      setSubmitting(false);
    }
  };

  const statusLabel =
    status === "pending"
      ? "Pending"
      : status === "accepted"
      ? "Accepted"
      : "Declined";

  return (
    <div className="bg-white rounded-3xl shadow-md overflow-hidden"
    onClick={handleCardClick}
    role="button"
    tabIndex={0}
    onKeyDown={(e)=>e.key==="Enter"&& handleCardClick()}
    >
      {/* IMAGE */}
      <div className="h-64 bg-gray-200">
        {profile_image ? (
          <img
            src={profile_image}
            alt={name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-navy text-lg font-semibold">
            {name ? name[0].toUpperCase() : "M"}
          </div>
        )}
      </div>

      {/* DETAILS */}
      <div className="px-4 pt-3 pb-3">
        <div className="flex items-center justify-between mb-1">
          <p className="text-base font-semibold text-navy">
            {name || "Member"}
          </p>
          <span
            className={`px-2 py-0.5 rounded-full text-[10px] font-semibold
              ${
                status === "accepted"
                  ? "bg-[#E6F8EF] text-[#1BA34A]"
                  : status === "rejected"
                  ? "bg-[#FDECEC] text-[#E04B4B]"
                  : "bg-[#FFF5E5] text-[#B36A1E]"
              }`}
          >
            {statusLabel}
          </span>
        </div>

        <p className="text-[10px] text-gray-500 mb-1">
          Received on: {created_at}
        </p>

        <p className="text-[11px] text-gray-700 mb-2">
          {age && `${age} yrs`} {heightText && ` • ${heightText}`}{" "}
          {community && ` • ${community}`}
          {occupation && ` • ${mapOccupationLabel(occupation)}`}
          {location && ` • ${location}`}
        </p>

        {/* ACTION BUTTONS */}
        {status === "pending" && !actionDone && (
          <div className="mt-2 flex gap-2">
            <button
              onClick={handleReject}
              disabled={submitting}
              className="flex-1 inline-flex items-center justify-center gap-1 px-3 py-2 rounded-full border border-gray-300 text-[12px]
        text-gray-700 hover:bg-gray-100 disabled:opacity-60"
            >
              <FiX className="w-3 h-3" />
              Decline
            </button>

            <button
              onClick={handleAccept}
              disabled={submitting}
              className="flex-1 inline-flex items-center justify-center gap-1 px-3 py-2 rounded-full bg-primary
        text-white text-[12px] font-semibold shadow disabled:opacity-60"
            >
              <FiHeart className="w-3 h-3" />
              Accept
            </button>
          </div>
        )}
        {actionDone === "accepted" && (
          <div className="mt-3 text-center text-[12px] font-semibold text-green-600 bg-green-50 py-2 rounded-full">
            ✓ You accepted this interest
          </div>
        )}

        {actionDone === "rejected" && (
          <div className="mt-3 text-center text-[12px] font-semibold text-red-600 bg-red-50 py-2 rounded-full">
            ✕ You declined this interest
          </div>
        )}
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

export default Interests;
