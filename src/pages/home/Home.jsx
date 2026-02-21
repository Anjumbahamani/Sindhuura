import React, { useState, useEffect, useRef } from "react";
import BottomNav from "../../components/BottomNav";
import { useNavigate } from "react-router-dom";
import {
  FiBell,
  FiMenu,
  FiCamera,
  FiChevronRight,
  FiClock,
  FiSearch,
  FiCheck,
  FiHeart,
  FiEye,
  FiMessageCircle,
  FiStar,
  FiUsers,
  FiCalendar,
  FiSliders,
  FiX,
} from "react-icons/fi";
import { LuCrown } from "react-icons/lu";
import {
  getSubscriptionPlans,
  uploadImages,
  getUserProfile,
  saveSubscriptionDetails,
  createSubscriptionOrder,
  verifySubscriptionPayment,
  addSuccessStory,
} from "../../services/auth.service";
import {
  getMatchingProfiles,
  getAllSuccessStories,
  getBanners,
  getEvents,
  searchMatches,
} from "../../services/match.service";
import { FiLogOut } from "react-icons/fi";
import { getMembershipFromProfile } from "../../utils/membership";
import { useFcmToken } from "../../hooks/useFcmToken";
import { FaFacebookF, FaYoutube, FaInstagram, FaTwitter } from "react-icons/fa";
import { FaThreads } from "react-icons/fa6";

const matches = [
  { id: 1, name: "Rahul, 28", city: "Bengaluru" },
  { id: 2, name: "Arjun, 29", city: "Hyderabad" },
  { id: 3, name: "Kiran, 27", city: "Pune" },
];

const RAZORPAY_SDK_URL = "https://checkout.razorpay.com/v1/checkout.js";

function loadRazorpay() {
  return new Promise((resolve) => {
    if (window.Razorpay) return resolve(true);

    const existing = document.querySelector(
      `script[src="${RAZORPAY_SDK_URL}"]`,
    );
    if (existing) {
      existing.addEventListener("load", () => resolve(true));
      existing.addEventListener("error", () => resolve(false));
      return;
    }

    const script = document.createElement("script");
    script.src = RAZORPAY_SDK_URL;
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}


function rupeesToPaise(amountStr) {
  const [r, p = "00"] = String(amountStr).split(".");
  const rupees = r.replace(/[^\d]/g, "") || "0";
  const paise = (p + "00").slice(0, 2).replace(/[^\d]/g, "0");
  return Number(`${rupees}${paise}`);
}

const RAZORPAY_KEY_ID = import.meta.env.VITE_RAZORPAY_KEY_ID;

const Home = () => {
  const navigate = useNavigate();
  const [membershipTab, setMembershipTab] = useState("regular");
  const [plans, setPlans] = useState([]);
  const [plansLoading, setPlansLoading] = useState(false);
  const [plansError, setPlansError] = useState("");
  const [showMenu, setShowMenu] = useState(false);
  const [recommendations, setRecommendations] = useState([]);
  const [showUploadSheet, setShowUploadSheet] = useState(false);
  const [userProfile, setUserProfile] = useState(null);
  const [membership, setMembership] = useState({
    type: "free_trial",
    isPremium: false,
    planName: null,
    planLimit: 0,
    contactViewed: 0,
    contactRemaining: 0,
    expiryDate: null,
  });
  const [stories, setStories] = useState([]);
  const [storiesLoading, setStoriesLoading] = useState(false);
  const [storiesError, setStoriesError] = useState("");
  const [banners, setBanners] = useState([]);
  const [bannerIndex, setBannerIndex] = useState(0);
  const [events, setEvents] = useState([]);
  const [eventIndex, setEventIndex] = useState(0);
  const [eventsLoading, setEventsLoading] = useState(false);
  const [eventsError, setEventsError] = useState("");
  const [showLogoutChip, setShowLogoutChip] = useState(false);

  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [searching, setSearching] = useState(false);
  const [searchError, setSearchError] = useState("");
  const searchTimer = useRef(null);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [showEventModal, setShowEventModal] = useState(false);
  const [selectedStory, setSelectedStory] = useState(null);
  const [showStoryModal, setShowStoryModal] = useState(false);
  const [files, setFiles] = useState([]);
  const [selfie, setSelfie] = useState(null);
  const { fcmToken, fcmError } = useFcmToken();
  const [showAddStorySheet, setShowAddStorySheet] = useState(false);

  if (fcmError) {
    console.warn("FCM error:", fcmError);
  }

  const fallbackMatches = matches;

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        setPlansLoading(true);
        setPlansError("");

        const token = localStorage.getItem("token");
        if (!token) {
          // You can choose to still show plans for guests; for now show a message
          setPlansError("Please login to view premium plans.");
          return;
        }

        const res = await getSubscriptionPlans(token);
        setPlans(res.response || []);
      } catch (err) {
        console.error("Failed to load subscription plans:", err);
        setPlansError("Unable to load plans at the moment.");
      } finally {
        setPlansLoading(false);
      }
    };

    fetchPlans();
  }, []);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;

        const res = await getUserProfile(token);
        const profile = res.response || null;
        setUserProfile(profile);

        if (profile) {
          const m = getMembershipFromProfile(profile);
          setMembership(m);
        }
      } catch (err) {
        console.error("Failed to load user profile:", err);
      }
    };

    fetchUserProfile();
  }, []);

  useEffect(() => {
    const fetchRecommendations = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          // no token → we can show fallback
          setRecommendations(fallbackMatches);
          return;
        }

        const res = await getMatchingProfiles(token);
        const list = res.response || [];

        const top = list.slice(0, 4).map((p) => {
          console.log("🔵 Raw profile from backend:", p);
          const name =
            p.name && p.age ? `${p.name}, ${p.age}` : p.name || "Member";
          const city = p.city || p.state || "Unknown";
          const image = p.profile_image || null;
          const actualUserId = p.user_id ?? p.id ?? p.user;
          console.log(`✅ Assigned to card: \){name} = id \({actualUserId}`);
          return { id: p.id, name, city, image, user_id: actualUserId };
        });

        setRecommendations(top.length ? top : fallbackMatches);
      } catch (err) {
        console.error("Failed to load daily recommendations:", err);
        setRecommendations(fallbackMatches);
      }
    };

    fetchRecommendations();
  }, []);

  useEffect(() => {
    const loadStories = async () => {
      try {
        setStoriesLoading(true);
        const token = localStorage.getItem("token");
        const res = await getAllSuccessStories(token);
        setStories(res?.response || []);
      } catch (err) {
        console.error("Error loading success stories:", err);
        setStoriesError("Unable to load success stories.");
      } finally {
        setStoriesLoading(false);
      }
    };
    loadStories();
  }, []);
  useEffect(() => {
    const loadBanners = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await getBanners(token);
        setBanners(res?.response || []);
      } catch (err) {
        console.error("Failed to load banners:", err);
        setBanners([]);
      }
    };
    loadBanners();
  }, []);

  // smooth auto scroll every 4s
  useEffect(() => {
    if (!banners.length) return;
    const timer = setInterval(
      () => setBannerIndex((prev) => (prev + 1) % banners.length),
      4000,
    );
    return () => clearInterval(timer);
  }, [banners]);

  useEffect(() => {
    const loadEvents = async () => {
      try {
        const token = localStorage.getItem("token");

        // Only premium users (and logged-in) can load events
        if (!token || !membership.isPremium) {
          setEvents([]);
          return;
        }

        setEventsLoading(true);
        setEventsError("");

        const res = await getEvents(token);
        setEvents(res?.response || []);
      } catch (err) {
        console.error("Failed to fetch events:", err);
        setEventsError("Unable to load events right now.");
        setEvents([]);
      } finally {
        setEventsLoading(false);
      }
    };

    loadEvents();
  }, [membership.isPremium]);

  // auto scroll
  useEffect(() => {
    if (!events.length) return;
    const t = setInterval(
      () => setEventIndex((prev) => (prev + 1) % events.length),
      5000, // 5 sec per slide
    );
    return () => clearInterval(t);
  }, [events]);

  const handleLogout = () => {
    // Clear auth data
    localStorage.removeItem("token");
    localStorage.removeItem("user"); // if you store user info
    localStorage.removeItem("refreshToken"); // if any

    // Optional: clear session storage
    sessionStorage.clear();

    // Redirect to login
    navigate("/login", { replace: true });
  };

  const payForPlan = async (plan) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("Please login to continue.");
        return;
      }

      if (!RAZORPAY_KEY_ID) {
        alert("Missing Razorpay Key ID (VITE_RAZORPAY_KEY_ID).");
        return;
      }

      const sdkOk = await loadRazorpay();
      if (!sdkOk) {
        alert(
          "Failed to load Razorpay Checkout. Disable adblock and try again.",
        );
        return;
      }

      // 1) Create order on backend
      const orderRes = await createSubscriptionOrder(
        { subscription_id: plan.id },
        token,
      );

      const orderData = orderRes?.response ?? orderRes;

      // IMPORTANT: backend should return order_id
      const orderId = orderData?.razorpay_order_id;
      const keyFromBackend = orderData?.razorpay_key;
      // const amount = orderData?.amount;       // (recommended) amount in paise
      const currency = orderData?.currency || "INR";

      if (!orderId) {
        console.error("create-order response:", orderRes);
        alert("Could not create order. Please try again.");
        return;
      }

      // If backend doesn't send amount, fallback to computing from raw_price
      const amountPaise =
        typeof amount === "number"
          ? amount
          : rupeesToPaise(plan?.raw_price || "0.00");

      // 2) Open Razorpay using order_id
      const options = {
        key: keyFromBackend || RAZORPAY_KEY_ID,
        order_id: orderId,
        // amount: amountPaise,
        currency,
        name: "Sindhuurra",
        description: `${plan?.name || "Subscription"} plan`,
        prefill: {
          name: userProfile?.user?.name || "",
          email: userProfile?.user?.email || "",
          contact: userProfile?.user?.phone || userProfile?.user?.mobile || "",
        },

        // 3) Verify after success
        handler: async (response) => {
          try {
            const verifyRes = await verifySubscriptionPayment(
              {
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
              },
              token,
            );

            const verifyData = verifyRes?.response ?? verifyRes;

            // If backend returns {success:true}
            if (
              verifyData?.success === false ||
              !verifyData?.success === false
            ) {
              console.error("verify failed:", verifyRes);
              alert("Payment verification failed.");
              return;
            }

            // alert("Payment successful! Subscription activated.");

            // Optional: refresh profile
            // const prof = await getUserProfile(token);
            // setUserProfile(prof.response || null);
          } catch (e) {
            console.error("verify-payment error:", e);
            alert(
              "Payment completed but verification failed. Contact support.",
            );
          }
        },
      };

      const rzp = new window.Razorpay(options);

      rzp.on("payment.failed", (resp) => {
        console.error("Payment failed:", resp?.error);
        alert(resp?.error?.description || "Payment failed.");
      });

      rzp.open();
    } catch (err) {
      console.error("payForPlan error:", err);
      alert("Something went wrong while starting payment.");
    }
  };
 
  const SocialMediaLinks = () => {
    const socials = [
      {
        name: "Instagram",
        url: "https://www.instagram.com/sindhuura_com_official?utm_source=qr&igsh=eGZseHlyYnZhZHMy",
        icon: FaInstagram,
      },
      {
        name: "YouTube",
        url: "https://youtube.com/@sindhuuracom?si=bcdZ6rpMLLUl5gNw",
        icon: FaYoutube,
      },
      {
        name: "Facebook",
        url: "https://www.facebook.com/share/1BBQykHVkB/",
        icon: FaFacebookF,
      },
      {
        name: "Threads",
        url: "https://www.threads.com/@sindhuura_com_official",
        icon: FaThreads,
      },
    ];

    return (
      <div className="px-4 py-4 text-center mt-4">
        <p className="text-xs text-gray-500 mb-2 font-medium">
          Follow us on Social Media
        </p>
        <div className="flex justify-center gap-4">
          {socials.map((s) => (
            <a
              key={s.name}
              href={s.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:text-red-500 text-lg"
            >
              <s.icon />
            </a>
          ))}
        </div>
      </div>
    );
  };
  return (
    <div className="min-h-screen bg-white pb-5 overflow-hidden">
      <div className="max-w-md mx-auto min-h-screen bg-white pb-10">
        {/* TOP GRADIENT SECTION (common for both tabs) */}
        <div className="bg-gradient-to-b from-[#FFF7E9] via-[#FFF9F1] to-[#FFFFFF] pb-4 shadow-sm">
          {/* Status bar spacer */}
          <div className="h-3" />
          {/* Top right icons row */}
          <div className="relative flex items-center w-full h-8 rounded-full bg-white shadow-sm p-4 m-2">
            {/* Search icon */}
            <FiSearch className="w-4 h-4 mr-2 text-navy" />

            {/* Search input */}
            <input
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => {
                const value = e.target.value;
                setSearchQuery(value);

                clearTimeout(searchTimer.current);

                if (!value.trim()) {
                  setSearchResults([]);
                  setSearchError("");
                  return;
                }

                searchTimer.current = setTimeout(async () => {
                  try {
                    setSearching(true);
                    setSearchError("");

                    const token = localStorage.getItem("token");
                    const res = await searchMatches(value, token);

                    setSearchResults(res?.response || []);
                  } catch (err) {
                    setSearchError("Search failed. Try again.");
                  } finally {
                    setSearching(false);
                  }
                }, 400);
              }}
              className="flex-1 border-none outline-none text-[13px] bg-transparent"
            />

            {/* Logout icon */}
            <button
              type="button"
              onClick={() => setShowLogoutChip((s) => !s)}
              className="ml-2 w-6 h-6 rounded-full flex items-center justify-center hover:bg-gray-100"
            >
              <FiLogOut className="w-4 h-4 text-gray-600" />
            </button>

            {/* Logout chip */}
            {showLogoutChip && (
              <div className="absolute top-9 right-0 z-50">
                <button
                  onClick={handleLogout}
                  className="px-4 py-2 rounded-xl bg-white shadow-lg border text-[12px]
                   text-red-600 font-semibold hover:bg-red-50 transition"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
          {/* Membership toggle */}
          <div className="px-4 mb-3 mt-3">
            <div className="inline-flex items-center justify-between rounded-full bg-white shadow-sm px-1 py-1">
              <button
                onClick={() => setMembershipTab("regular")}
                className={`px-4 py-1 text-xs font-semibold rounded-full transition
                  ${
                    membershipTab === "regular"
                      ? "bg-[#FFE7C2] text-[#B36A1E]"
                      : "text-navy"
                  }`}
              >
                Regular
              </button>
              <button
                onClick={() => setMembershipTab("prime")}
                className={`px-4 py-1 text-xs font-semibold rounded-full flex items-center gap-1 transition
                  ${
                    membershipTab === "prime"
                      ? "bg-primary text-white"
                      : "text-navy"
                  }`}
              >
                PRIME
                <span
                  className={`ml-0.5 text-[9px] ${
                    membershipTab === "prime" ? "text-white" : "text-red-500"
                  }`}
                >
                  •
                </span>
              </button>
            </div>
          </div>
          {/* Pofile row */}
          <div className="flex items-center justify-between px-4">
            <div
              role="button"
              tabIndex={0}
              onClick={() => navigate("/profile")}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") navigate("/profile");
              }}
              className="flex items-center gap-3 text-left cursor-pointer"
            >
              {/* Avatar with camera */}
              <div className="relative">
                <div className="w-12 h-12 rounded-full bg-[#FFE5EC] flex items-center justify-center text-navy text-lg font-semibold overflow-hidden">
                  {userProfile?.user?.profile_image ? (
                    <img
                      src={userProfile.user.profile_image}
                      alt={userProfile.user.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span>
                      {userProfile?.user?.name
                        ? userProfile.user.name[0].toUpperCase()
                        : "User"}
                    </span>
                  )}
                </div>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowUploadSheet(true);
                  }}
                  className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-primary text-white flex items-center justify-center text-[10px] border border-white shadow-sm"
                >
                  <FiCamera />
                </button>
              </div>

              {/* Name + meta */}
              <div>
                <p className="text-sm font-semibold text-navy truncate max-w-[150px]">
                  {userProfile?.user?.name || "Your Profile"}
                </p>
                <p className="text-[11px] text-gray-500">
                  {userProfile?.mother_tongue || "Mother tongue not set"}
                </p>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-[11px] text-gray-500 flex items-center gap-1">
                    {userProfile ? (
                      membership.isPremium ? (
                        <>
                          <LuCrown className="w-3.5 h-3.5 text-rose-600" />
                          <span className="text-rose-600">
                            {(membership.planName || "Premium") + " Member"}
                          </span>
                        </>
                      ) : (
                        "Free Trial Member"
                      )
                    ) : (
                      "Guest"
                    )}
                  </span>

                  {!membership.isPremium && userProfile && (
                    <button
                      type="button"
                      onClick={() => setMembershipTab("prime")}
                      className="text-[10px] px-2 py-0.5 rounded-full border border-[#F5C58B] bg-[#FFF2DD] text-[#B36A1E] font-semibold"
                    >
                      Upgrade
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Bell + menu */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => {
                  // Standard industry UX: if already on notifications, scroll to top
                  if (location.pathname === "/notifications") {
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  } else {
                    navigate("/notifications");
                  }
                }}
                className="relative flex items-center justify-center w-9 h-9 rounded-full bg-white shadow-sm hover:bg-gray-50 transition-colors"
              >
                <FiBell className="w-4 h-4 text-navy" />

                {/* {unreadCount > 0 && (
      <span className="absolute -top-1 -right-1 bg-primary text-white text-[9px] px-1.5 py-0.5 rounded-full border border-white">
        {unreadCount}
      </span>
    )} */}
              </button>
              <button
                onClick={() => setShowMenu((s) => !s)}
                className="relative flex items-center justify-center w-9 h-9 rounded-full bg-white shadow-sm"
              >
                <FiMenu className="w-4 h-4 text-navy" />
              </button>
              {showMenu && (
                <div className="absolute top-12 right-0 z-50 bg-white rounded-xl shadow-lg border border-gray-100 w-44 animate-fadeIn">
                  <ul className="text-sm text-navy font-medium py-2">
                    <li
                      onClick={() => {
                        setShowMenu(false);
                        navigate("/terms-and-conditions"); // ➡️ route path
                      }}
                      className="px-4 py-2 hover:bg-[#FFF5EB] cursor-pointer"
                    >
                      Terms & Conditions
                    </li>
                    {/* <li
                      onClick={() => {
                        setShowMenu(false);
                        navigate("/about-team"); 
                      }}
                      className="px-4 py-2 hover:bg-[#FFF5EB] cursor-pointer"
                    >
                      About Our Team
                    </li> */}
                  </ul>
                </div>
              )}
            </div>
          </div>
          {/* Celebration banner (only for regular) */}
          {membershipTab === "regular" && (
            <div className="mt-4 px-4">
              {banners.length > 0 ? (
                <div className="relative w-full h-40 rounded-2xl overflow-hidden shadow-sm">
                  {banners.map((b, i) => (
                    <img
                      key={b.id}
                      src={b.image_url}
                      alt={`banner-${i}`}
                      className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ${
                        i === bannerIndex ? "opacity-100" : "opacity-0"
                      }`}
                    />
                  ))}
                  <div className="absolute bottom-2 left-0 right-0 flex justify-center gap-1">
                    {banners.map((_, i) => (
                      <span
                        key={i}
                        className={`w-2 h-2 rounded-full transition-all ${
                          i === bannerIndex ? "bg-primary" : "bg-white/70"
                        }`}
                      />
                    ))}
                  </div>
                </div>
              ) : (
                <div className="h-40 rounded-2xl bg-gradient-to-r from-[#FFF0D9] to-[#FFE6F4] flex flex-col items-center justify-center shadow-sm">
                  <p className="text-xs text-[#6B4B90] tracking-wide mb-1">
                    Celebrating
                  </p>
                  <p className="text-3xl font-extrabold text-center text-[#4B2C7A] leading-tight mb-1">
                    25
                  </p>
                  <p className="text-xs text-center text-[#6B4B90] font-semibold mb-3">
                    Years of Matchmaking
                  </p>
                  <button className="bg-[#3C1F6E] text-white rounded-full px-6 py-2 text-[11px] font-semibold shadow-md">
                    Get upto 63% OFF <FiChevronRight className="inline ml-1" />
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
        {/* 🔍 SEARCH RESULTS */}
        {searchQuery && (
          <div className="px-4 mt-2">
            {searching && (
              <p className="text-[12px] text-gray-500">Searching...</p>
            )}

            {searchError && (
              <p className="text-[12px] text-red-500">{searchError}</p>
            )}

            {!searching && searchResults.length === 0 && !searchError && (
              <p className="text-[12px] text-gray-500">No profiles found</p>
            )}

            <div className="space-y-3">
              {searchResults.map((p) => (
                <div
                  key={p.id}
                  onClick={() => navigate(`/matches/${p.user_id || p.id}`)}
                  className="bg-white rounded-2xl shadow-sm border p-3 flex gap-3 cursor-pointer"
                >
                  <div className="w-12 h-12 rounded-full bg-gray-200 overflow-hidden">
                    {p.profile_image ? (
                      <img
                        src={p.profile_image}
                        alt={p.name}
                        className="w-full h-full object-cover"
                      />
                    ) : null}
                  </div>

                  <div className="flex-1">
                    <p className="text-sm font-semibold text-navy">
                      {p.name || "Member"}
                    </p>
                    <p className="text-[11px] text-gray-500">
                      {p.age && `${p.age} yrs`} • {p.city || p.state}
                    </p>
                    <p className="text-[11px] text-gray-500">{p.occupation}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* MAIN CONTENT: depends on Regular / PRIME tab */}
        {!searchQuery &&
          (membershipTab === "regular" ? (
            <RegularHomeSections
              recommendations={
                recommendations.length ? recommendations : fallbackMatches
              }
              onAddPhotosClick={() => setShowUploadSheet(true)}
              stories={stories}
              storiesLoading={storiesLoading}
              storiesError={storiesError}
              eventsError={eventsError}
              eventsLoading={eventsLoading}
              events={events}
              membership={membership}
              onEventClick={(event) => {
                setSelectedEvent(event);
                setShowEventModal(true);
              }}
              onStoryClick={(story) => {
                setSelectedStory(story);
                setShowStoryModal(true);
              }}
              onAddStoryClick={() => setShowAddStorySheet(true)}
            />
          ) : (
            <PremiumPlansSection
              plans={plans}
              loading={plansLoading}
              error={plansError}
              onChoosePlan={payForPlan}
            />
          ))}

        <UploadImagesSheet
          open={showUploadSheet}
          onClose={() => setShowUploadSheet(false)}
        />
        <EventDetailsModal
          open={showEventModal}
          event={selectedEvent}
          onClose={() => {
            setShowEventModal(false);
            setSelectedEvent(null);
          }}
        />
        <SuccessStoryModal
          open={showStoryModal}
          story={selectedStory}
          onClose={() => {
            setShowStoryModal(false);
            setSelectedStory(null);
          }}
        />
        <AddSuccessStorySheet
          open={showAddStorySheet}
          onClose={() => setShowAddStorySheet(false)}
          onSuccess={() => {
            // ✅ Auto refresh the stories feed instantly after submit
            const token = localStorage.getItem("token");
            getAllSuccessStories(token).then((res) =>
              setStories(res?.response || []),
            );
          }}
        />
        <SocialMediaLinks />

        <BottomNav />
      </div>
    </div>
  );
};

// Convert API description string into an array of bullet points
const parseDescription = (desc) =>
  desc
    ? desc
        .split(/\r?\n/)
        .map((line) => line.replace(/^▪\s*/, "").trim())
        .filter(Boolean)
    : [];

const RegularHomeSections = ({
  recommendations = [],
  onAddPhotosClick,
  stories = [],
  storiesLoading = false,
  storiesError = "",
  eventsError = "",
  eventsLoading = false,
  eventIndex = 0,
  events = [],
  onEventClick,
  onStoryClick,
  onAddStoryClick,
  membership,
}) => {
  const navigate = useNavigate();

  return (
    <>
      {/* COMPLETE YOUR PROFILE SECTION */}
      <section className="mt-4 bg-[#F6FAFF] px-4 py-4">
        <h2 className="text-sm font-semibold text-navy">
          Complete Your Profile
        </h2>
        <div className="flex items-center gap-2 mt-1 mb-4">
          <p className="text-[11px] text-gray-500">
            Profile completeness score 25%
          </p>
          <div className="flex-1 h-1 rounded-full bg-gray-200 overflow-hidden">
            <div className="h-full w-1/4 bg-primary rounded-full" />
          </div>
        </div>

        <div className="flex justify-between gap-3">
          <ProfileActionCard
            title="Add photo(s)"
            iconBg="bg-[#E6F4FF]"
            Icon={FiCamera}
            onClick={onAddPhotosClick}
          />
          <ProfileActionCard
            title=" Add Success Story"
            iconBg="bg-[#faf9cf]"
            Icon={FiStar}
            onClick={onAddStoryClick}
          />
          <ProfileActionCard
            title="Good luck on your journey"
            iconBg="bg-[#FFF0F5]"
            Icon={FiHeart}
          />
        </div>
      </section>

      {/* DAILY RECOMMENDATIONS */}
      <section className="bg-white px-4 py-4 mt-2">
        <div className="flex items-start justify-between mb-2">
          <div>
            <h2 className="text-sm font-semibold text-navy">
              Daily Recommendations
            </h2>
            <p className="text-[11px] mt-1 text-gray-500">
              Recommended matches for today
            </p>
          </div>
        </div>

        {/* Horizontal matches list */}
        <div className="mt-3 flex gap-3 overflow-x-auto pb-2">
          {recommendations.map((m) => (
            <div
              key={m.id}
              onClick={() => {
  console.log("🟢 Card clicked, navigating to user:", m.user_id);
  navigate(`/matches/${m.user_id}`);
}}
              className="w-28 flex-shrink-0 rounded-2xl bg-gray-100 overflow-hidden shadow-sm cursor-pointer hover:shadow-md active:scale-[0.98] transition-all"
            >
              <div className="h-28 bg-gray-200">
                {m.image ? (
                  <img
                    src={m.image}
                    alt={m.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-gray-300 to-gray-200" />
                )}
              </div>
              <div className="px-2 py-1.5">
                <p className="text-[11px] font-semibold text-navy truncate">
                  {m.name}
                </p>
                <p className="text-[10px] text-gray-500 truncate">{m.city}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
      {/* EVENTS SECTION */}
      <section className="bg-white px-4 py-2 mt-3">
        <div className="flex items-start justify-between mb-2">
          <div>
            <h2 className="text-sm font-semibold text-navy">Upcoming Events</h2>
            <p className="text-[11px] mt-1 text-gray-500">
              Discover exclusive Sindhuurra meet‑ups & experiences
            </p>
          </div>
        </div>

        {/* Free-trial / non-premium: show upgrade text only */}
        {!membership?.isPremium && (
          <div className="mt-5 rounded-2xl bg-[#f8efe3] border border-[#FFD9A5] px-4 py-4 text-center">
            {/* Icon */}
            <div className="flex justify-center mb-2">
              <div className="w-10 h-10 rounded-full bg-white shadow-sm flex items-center justify-center">
                <FiCalendar className="w-5 h-5 text-[#B36A1E]" />
              </div>
            </div>

            {/* Title */}
            <p className="text-sm font-semibold text-navy mb-1">
              Events are a Premium feature
            </p>

            {/* Description */}
            <p className="text-[11px] text-gray-700 leading-relaxed">
              Upgrade to a Premium plan to view and register for upcoming
              Sindhuura community events, meet-ups and experiences.
            </p>
          </div>
        )}
        {/* Premium: show real events list */}
        {membership?.isPremium && (
          <>
            {eventsLoading && (
              <p className="text-center text-[12px] text-gray-500">
                Loading events…
              </p>
            )}
            {eventsError && (
              <p className="text-center text-[12px] text-red-500">
                {eventsError}
              </p>
            )}
            {!eventsLoading && events.length === 0 && !eventsError && (
              <div className="flex flex-col items-center justify-center text-center py-6">
                <FiCalendar className="w-6 h-6 text-[#B36A1E] mb-2" />
                <p className="text-[12px] text-gray-500">
                  No upcoming events listed right now.
                </p>
              </div>
            )}

            {/* EVENTS CAROUSEL SECTION */}
            {events.length > 0 && (
              <section className="px-0 mt-3">
                <div className="relative w-full h-48 rounded-2xl overflow-hidden shadow-sm">
                  {events.map((ev, i) => (
                    <div
                      key={ev.id || i}
                      onClick={() => onEventClick?.(ev)}
                      className={`absolute inset-0 cursor-pointer transition-opacity duration-700 \){
                        i === eventIndex ? "opacity-100" : "opacity-0"
                      }`}
                    >
                      {/* Image */}
                      <img
                        src={ev.image}
                        alt={ev.event_name}
                        className="w-full h-full object-cover"
                      />

                      {/* Overlay */}
                      <div className="absolute inset-0 bg-black/40 flex flex-col justify-end p-3 text-white">
                        <p className="text-sm font-semibold">{ev.event_name}</p>
                        <p className="text-[11px] text-gray-200">
                          {ev.event_datetime_display}
                        </p>
                        <p className="text-[11px] text-gray-200">
                          {ev.venue} • {ev.city}
                        </p>
                        <p className="text-[10px] line-clamp-1 opacity-90">
                          {ev.description}
                        </p>
                      </div>
                    </div>
                  ))}

                  {/* dots */}
                  <div className="absolute bottom-2 left-0 right-0 flex justify-center gap-1">
                    {events.map((_, i) => (
                      <span
                        key={i}
                        className={`w-2 h-2 rounded-full ${
                          i === eventIndex ? "bg-primary" : "bg-white/70"
                        }`}
                      />
                    ))}
                  </div>
                </div>
              </section>
            )}
          </>
        )}
      </section>
      {/* SUCCESS STORIES */}
      <section className="bg-white px-4 py-4 mt-3">
        <div className="flex items-start justify-between mb-2">
          <div>
            <h2 className="text-sm font-semibold text-navy">
              Happy Success Stories
            </h2>
            <p className="text-[11px] mt-1 text-gray-500">
              Couples who found love through Sindhuurra
            </p>
          </div>
        </div>

        {storiesLoading && (
          <p className="text-center text-[12px] text-gray-500">
            Loading stories…
          </p>
        )}

        {storiesError && (
          <p className="text-center text-[12px] text-red-500">{storiesError}</p>
        )}

        {!storiesLoading && stories.length === 0 && !storiesError && (
          <p className="text-center text-[12px] text-gray-500">
            No success stories yet — yours could be next!
          </p>
        )}

        {/* Horizontal scroll of stories */}
        {stories.length > 0 && (
          <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide mt-2 scroll-smooth">
            {stories.map((s) => (
              <div
                key={s.id}
                onClick={() => onStoryClick?.(s)}
                className="w-[220px] flex-shrink-0 rounded-2xl bg-gradient-to-b
                 from-[#FFF7E9] to-[#FFFFFF]
                 border border-gray-100 shadow-sm overflow-hidden
                 hover:shadow-md transition cursor-pointer"
              >
                {/* first image */}
                {s.images && s.images.length > 0 ? (
                  <img
                    src={s.images[0].image}
                    alt={s.couple_name}
                    className="h-32 w-full object-cover"
                  />
                ) : (
                  <div className="h-32 w-full bg-gray-200 flex items-center justify-center text-gray-400 text-[11px]">
                    No Image
                  </div>
                )}

                {/* text */}
                <div className="px-3 py-2">
                  <p className="text-[12px] font-semibold text-navy truncate">
                    {s.couple_name}
                  </p>
                  <p className="text-[10px] text-gray-500 mb-1">{s.venue}</p>
                  <p className="text-[10px] text-gray-700 line-clamp-2">
                    {s.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </>
  );
};

// Static free plan; paid plans come from API
const FREE_PLAN = {
  id: "free",
  name: "Free",
  duration: "Forever",
  price: "₹0",
  periodLabel: "Forever",
  color: "#F9E4A7",
  tag: null,
  features: [
    "Create profile",
    "Send 2 interests per day",
    "Basic search filters",
  ],
  limitations: [
    "Cannot view contact details",
    "Limited profile views",
    "No profile boost",
  ],
};

const PremiumPlansSection = ({ plans, loading, error, onChoosePlan }) => {
  // Map API response to internal shape
  const apiPlans = (plans || []).map((p, index) => ({
    id: p.id,
    name: p.plan_name,
    plan_name: p.plan_name,
    raw_price: String(p.price),
    duration: `${p.validity} days`,
    price: `₹${Number(p.price).toLocaleString("en-IN")}`,
    periodLabel: `${p.validity} days`,
    color: index === 0 ? "#E3ECFF" : index === 1 ? "#F3E5FF" : "#EAF3FF",
    tag: index === 1 ? "Most Popular" : null,
    features: parseDescription(p.description),
    limitations: [],
  }));

  // Combine static free plan + API plans
  const combinedPlans = [FREE_PLAN, ...apiPlans];

  // Only paid plans for the chips
  const paidPlans = combinedPlans.filter((p) => p.id !== "free");

  const [activePlanId, setActivePlanId] = useState(
    paidPlans[0]?.id || combinedPlans[0]?.id,
  );

  const scrollContainerRef = useRef(null);

  const handleSelectPlan = (id) => {
    setActivePlanId(id);

    // smooth scroll the matching card into view
    if (!scrollContainerRef.current) return;
    const children = scrollContainerRef.current.children;
    const index = combinedPlans.findIndex((p) => p.id === id);
    if (index >= 0 && children[index]) {
      children[index].scrollIntoView({
        behavior: "smooth",
        inline: "center",
        block: "nearest",
      });
    }
  };

  return (
    <div className="mt-4 px-0 pb-4">
      {/* Gradient header */}
      <div className="mx-4 rounded-2xl bg-gradient-to-r from-[#FF4F5A] via-[#FB466E] to-[#F95B9B] px-4 py-5 text-white shadow-md">
        <button className="inline-flex items-center justify-center px-3 py-1 rounded-full bg-white/15 text-[11px] mb-3 border border-white/20">
          Boost Your Profile
        </button>
        <h2 className="text-lg font-semibold mb-1">Choose the perfect plan</h2>
        <p className="text-[11px] text-white/80">
          All plans include our trust and safety features
        </p>
      </div>

      {/* Plans tabs */}
      {paidPlans.length > 0 && (
        <div className="mt-4 px-4">
          <div className="inline-flex gap-2 rounded-full px-1 py-1 items-center">
            {paidPlans.map((p) => {
              const isActive = p.id === activePlanId;
              return (
                <button
                  key={p.id}
                  onClick={() => handleSelectPlan(p.id)}
                  className={`px-3 py-2 rounded-full text-[11px] shadow-md font-semibold border transition
                    ${
                      isActive
                        ? "bg-primary text-white border-primary shadow"
                        : "bg-white text-navy border-transparent"
                    }`}
                >
                  <span>{p.name}</span>
                  <span className="ml-1 text-[10px]">
                    {/* {p.periodLabel} */}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Plans list: horizontal scroll, hidden scrollbar */}
      <div className="-mx-0 mt-4">
        <div
          ref={scrollContainerRef}
          className="flex gap-3 overflow-x-auto pb-3 px-4 scrollbar-hide"
        >
          {combinedPlans.map((plan) => (
            <PlanCard
              key={plan.id}
              plan={plan}
              isActive={plan.id === activePlanId}
              onChoosePlan={onChoosePlan}
            />
          ))}
        </div>
      </div>

      {/* Why Choose Premium */}
      <PremiumBenefits />

      {/* FAQ */}
      <PremiumFAQ />
    </div>
  );
};

const PlanCard = ({ plan, isActive, onChoosePlan }) => {
  const isFree = plan.id === "free";

  return (
    <div
      className={`
        relative flex-shrink-0 w-[260px] rounded-3xl overflow-hidden
        bg-white border shadow-md transform transition
        ${
          isActive ? "border-primary shadow-lg scale-[1.02]" : "border-gray-200"
        }
      `}
    >
      {/* Top colored area */}
      <div className="px-4 pt-4 pb-3" style={{ backgroundColor: plan.color }}>
        {plan.tag && (
          <div className="flex justify-end mb-1">
            <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-primary text-white text-[10px] font-semibold shadow">
              {plan.tag}
            </span>
          </div>
        )}

        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-sm">
            <LuCrown className="w-5 h-5 text-primary" />
          </div>
          <div>
            <p className="text-sm font-semibold text-navy leading-tight">
              {plan.name}
            </p>
            <p className="text-[11px] text-gray-600">{plan.duration}</p>
          </div>
        </div>

        <div className="mt-3">
          <p className="text-[18px] font-bold text-navy">{plan.price}</p>
          <p className="text-[11px] text-gray-700">{plan.periodLabel}</p>
        </div>
      </div>

      {/* Features & limitations */}
      <div className="px-4 py-3 text-[11px] space-y-2">
        {plan.features.length > 0 && (
          <div className="space-y-1 max-h-24 overflow-y-auto pr-1">
            {plan.features.map((f) => (
              <div key={f} className="flex items-start gap-1.5">
                <FiCheck className="w-3 h-3 text-[#26C281] mt-[2px]" />
                <span className="text-gray-700 leading-snug">{f}</span>
              </div>
            ))}
          </div>
        )}

        {plan.limitations.length > 0 && (
          <div className="pt-1 border-t border-gray-100">
            <p className="font-semibold text-gray-700 mb-0.5">Limitations:</p>
            <div className="space-y-0.5 max-h-16 overflow-y-auto pr-1">
              {plan.limitations.map((l) => (
                <p key={l} className="text-gray-500 leading-snug">
                  • {l}
                </p>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* CTA button */}
      <div className="px-4 pb-3 pt-1">
        <button
          disabled={isFree}
          onClick={() => {
            onChoosePlan?.(plan);
          }}
          className={`
            w-full py-2.5 rounded-full text-[12px] font-semibold
            transition
            ${
              isFree
                ? "bg-gray-100 text-gray-400"
                : "bg-primary text-white shadow hover:bg-primary/90"
            }
          `}
        >
          {isFree ? "Free" : "Choose This Plan"}
        </button>
      </div>
    </div>
  );
};

const BENEFITS = [
  {
    id: "matches",
    title: "3x",
    subtitle: "More Matches",
    icon: FiHeart,
    bg: "bg-[#FFEFF2]",
    iconColor: "text-[#FF4F5A]",
  },
  {
    id: "views",
    title: "10x",
    subtitle: "Profile Views",
    icon: FiEye,
    bg: "bg-[#E9F4FF]",
    iconColor: "text-[#1D7DEA]",
  },
  {
    id: "response",
    title: "5x",
    subtitle: "Faster Response",
    icon: FiMessageCircle,
    bg: "bg-[#EAFBF1]",
    iconColor: "text-[#26C281]",
  },
  {
    id: "support",
    title: "",
    subtitle: "Premium Support",
    icon: FiStar,
    bg: "bg-[#F5E9FF]",
    iconColor: "text-[#A14DDE]",
  },
];

const PremiumBenefits = () => (
  <div className="mt-6 px-4">
    <h3 className="text-sm font-semibold text-navy mb-3">
      Why Choose Premium?
    </h3>

    <div className="grid grid-cols-2 gap-3">
      {BENEFITS.map(({ id, title, subtitle, icon: Icon, bg, iconColor }) => (
        <div
          key={id}
          className={`rounded-2xl ${bg} px-3 py-3 flex flex-col items-center shadow-md`}
        >
          <div
            className={`w-8 h-8 rounded-full bg-white flex items-center justify-center mb-2 ${iconColor}`}
          >
            <Icon className="w-4 h-4" />
          </div>
          {title && (
            <p className="text-base font-bold text-navy leading-none mb-1">
              {title}
            </p>
          )}
          <p className="text-[11px] text-gray-700 font-medium">{subtitle}</p>
        </div>
      ))}
    </div>
  </div>
);
const FAQS = [
  {
    q: "How secure are the payments?",
    a: "We use industry-standard SSL encryption and work with trusted payment gateways to ensure your financial information is completely secure.",
  },
  {
    q: "Can I upgrade or downgrade my plan?",
    a: "Yes, you can upgrade your plan at any time. For downgrades, the changes will take effect at the end of your current billing cycle.",
  },
  {
    q: "What happens after my membership expires?",
    a: "Your account will revert to the free plan. Your profile remains active, but premium features will be disabled until renewal.",
  },
  {
    q: "Is there a refund policy?",
    a: "We offer a 30-day money-back guarantee for premium plans if you're not satisfied with our service.",
  },
];

const PremiumFAQ = () => (
  <div className="mt-6 px-4 pb-4">
    <h3 className="text-sm font-semibold text-navy mb-3">
      Frequently Asked Questions
    </h3>

    <div className="space-y-3">
      {FAQS.map((item) => (
        <div
          key={item.q}
          className="rounded-2xl bg-white shadow-sm px-4 py-5 border border-gray-100"
        >
          <p className="text-[12px] font-semibold text-black mb-1">{item.q}</p>
          <p className="text-[11px] text-gray-600 leading-snug">{item.a}</p>
        </div>
      ))}
    </div>
  </div>
);
/* ---------- REUSABLE CARD ---------- */

const ProfileActionCard = ({ title, iconBg, Icon, onClick }) => (
  <button
    type="button"
    onClick={onClick}
    className="flex-1 bg-white rounded-2xl shadow-sm px-3 py-4 flex flex-col items-center"
  >
    <div
      className={`w-10 h-10 rounded-2xl ${iconBg} flex items-center justify-center mb-2`}
    >
      {Icon ? (
        <Icon className="w-5 h-5 text-primary" />
      ) : (
        <span className="text-primary text-lg">+</span>
      )}
    </div>
    <p className="text-[11px] text-navy font-medium text-center leading-snug">
      {title}
    </p>
  </button>
);

const UploadImagesSheet = ({ open, onClose }) => {
  const [files, setFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [selfie, setSelfie] = useState(null); // ✅ ADD THIS

  if (!open) return null;

  const handleFileChange = (e) => {
    setError("");
    setSuccess("");
    const selected = Array.from(e.target.files || []);
    setFiles(selected);
  };

  // const handleUpload = async () => {
  //   try {
  //     setError("");
  //     setSuccess("");

  //     if (!files.length) {
  //       setError("Please select at least one image.");
  //       return;
  //     }

  //     const token = localStorage.getItem("token");
  //     if (!token) {
  //       setError("Please login to upload images.");
  //       return;
  //     }

  //     const formData = new FormData();
  //     // 🔧 adjust field name if backend expects something else
  //     files.forEach((file) => formData.append("images", file));

  //     setUploading(true);
  //     const res = await uploadImages(formData, token);
  //     console.log("✅ Images uploaded:", res);
  //     setSuccess("Images uploaded successfully.");
  //     setFiles([]);
  //   } catch (err) {
  //     console.error("❌ Upload failed:", err);
  //     setError("Upload failed. Please try again.");
  //   } finally {
  //     setUploading(false);
  //   }
  // };
  const handleUpload = async () => {
    try {
      setError("");
      setSuccess("");

      if (!selfie && files.length === 0) {
        setError("Please take a selfie or select images.");
        return;
      }

      const token = localStorage.getItem("token");
      if (!token) {
        setError("Please login to upload images.");
        return;
      }

      const formData = new FormData();

      if (selfie) {
        formData.append("images", selfie);
      }

      files.forEach((file) => {
        formData.append("images", file);
      });

      setUploading(true);
      await uploadImages(formData, token);

      setSuccess("Images uploaded successfully.");
      setFiles([]);
      setSelfie(null);
    } catch (err) {
      setError("Upload failed. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex items-end justify-center">
      <div className="w-full max-w-md bg-white rounded-t-2xl p-4 shadow-lg">
        {/* Handle bar */}
        <div className="w-10 h-1 rounded-full bg-gray-300 mx-auto mb-3" />

        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-semibold text-navy">Upload Photos</h2>
          <button
            type="button"
            onClick={onClose}
            className="text-xs text-gray-500"
          >
            Close
          </button>
        </div>

        <p className="text-[11px] text-gray-600 mb-3">
          Add multiple photos to make your profile more attractive.
        </p>

        <div className="mb-3">
          <label className="block text-[11px] font-medium text-gray-700 mb-1">
            Select images
          </label>
          {/* <input
            type="file"
            accept="image/*"
            multiple
            onChange={handleFileChange}
            className="w-full text-[11px]"
          /> */}
          <div className="flex flex-col gap-2 mb-3">
            <button
              type="button"
              onClick={() => document.getElementById("selfieInput").click()}
              className="w-full bg-[#FFF2DD] text-[#B36A1E] py-2 rounded-full
               text-[12px] font-semibold flex items-center justify-center gap-2"
            >
              📸 Take Selfie
            </button>

            <button
              type="button"
              onClick={() => document.getElementById("galleryInput").click()}
              className="w-full bg-white border border-gray-300 py-2 rounded-full
               text-[12px] font-semibold"
            >
              Choose from Gallery
            </button>
          </div>
          <input
            id="selfieInput"
            type="file"
            accept="image/*"
            capture="user"
            hidden
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) setSelfie(file);
            }}
          />

          <input
            id="galleryInput"
            type="file"
            accept="image/*"
            multiple
            hidden
            onChange={(e) => {
              const selected = Array.from(e.target.files || []);
              setFiles(selected);
            }}
          />

          {(selfie || files.length > 0) && (
            <div className="grid grid-cols-3 gap-2 mb-3">
              {selfie && (
                <img
                  src={URL.createObjectURL(selfie)}
                  alt="Selfie"
                  className="w-full h-20 object-cover rounded-xl border"
                />
              )}

              {files.map((file, idx) => (
                <img
                  key={idx}
                  src={URL.createObjectURL(file)}
                  alt={`upload-${idx}`}
                  className="w-full h-20 object-cover rounded-xl border"
                />
              ))}
            </div>
          )}

          {files.length > 0 && (
            <p className="text-[11px] text-gray-500 mt-1">
              {files.length} file(s) selected
            </p>
          )}
        </div>

        {error && <p className="text-[11px] text-red-500 mb-1">{error}</p>}
        {success && (
          <p className="text-[11px] text-green-600 mb-1">{success}</p>
        )}

        <button
          type="button"
          onClick={handleUpload}
          disabled={uploading}
          className="w-full mt-2 bg-primary text-white py-2.5 rounded-full text-[12px] font-semibold shadow disabled:opacity-60"
        >
          {uploading ? "Uploading..." : "Upload Images"}
        </button>
      </div>
    </div>
  );
};

const EventDetailsModal = ({ open, event, onClose }) => {
  if (!open || !event) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-end justify-center">
      <div className="w-full max-w-md bg-white rounded-t-3xl overflow-hidden shadow-xl animate-slideUp">
        {/* Header image */}
        <div className="relative h-56">
          <img
            src={event.image}
            alt={event.event_name}
            className="w-full h-full object-cover"
          />
          <button
            onClick={onClose}
            className="absolute top-3 right-3 bg-black/50 text-white rounded-full px-3 py-1 text-[12px]"
          >
            Close
          </button>
        </div>

        {/* Content */}
        <div className="p-4 space-y-2 max-h-[60vh] overflow-y-auto">
          <h2 className="text-lg font-semibold text-navy">
            {event.event_name}
          </h2>

          <p className="text-[12px] text-gray-600">
            <FiClock className="inline mr-1" />
            {event.event_datetime_display}
          </p>

          <p className="text-[12px] text-gray-600">
            📍 {event.venue}, {event.city}
          </p>

          <div className="pt-2">
            <p className="text-[13px] text-gray-700 leading-relaxed">
              {event.description}
            </p>
          </div>

          {/* CTA (optional future use) */}
          {event.registration_url && (
            <a
              href={event.registration_url}
              target="_blank"
              rel="noreferrer"
              className="block mt-3 text-center bg-primary text-white py-2 rounded-full text-[13px] font-semibold"
            >
              Register Now
            </a>
          )}
        </div>
      </div>
    </div>
  );
};

const SuccessStoryModal = ({ open, story, onClose }) => {
  if (!open || !story) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center px-4">
      <div className="relative w-full max-w-md bg-white rounded-3xl shadow-xl overflow-hidden animate-fadeIn">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 w-8 h-8 rounded-full
                     bg-black/40 text-white flex items-center justify-center
                     text-sm hover:bg-black/60"
        >
          ✕
        </button>

        {/* Image */}
        {story.images?.length > 0 && (
          <img
            src={story.images[0].image}
            alt={story.couple_name}
            className="w-full h-56 object-cover"
          />
        )}

        {/* Content */}
        <div className="p-4">
          <h2 className="text-lg font-semibold text-navy mb-1">
            {story.couple_name}
          </h2>

          <p className="text-[12px] text-gray-500 mb-2">{story.venue}</p>

          <p className="text-[13px] text-gray-700 leading-relaxed whitespace-pre-line">
            {story.description}
          </p>
        </div>
      </div>
    </div>
  );
};

const AddSuccessStorySheet = ({ open, onClose, onSuccess }) => {
  const [form, setForm] = useState({
    groom_name: "",
    bride_name: "",
    wedding_date: "",
    venue: "",
    description: "",
  });
  const [images, setImages] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [previewImages, setPreviewImages] = useState([]);

  // Reset form when sheet closes
  useEffect(() => {
    if (!open) {
      setForm({
        groom_name: "",
        bride_name: "",
        wedding_date: "",
        venue: "",
        description: "",
      });
      setImages([]);
      setPreviewImages([]);
      setError("");
    }
  }, [open]);

  const handleInputChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 3) {
      setError("You can upload a maximum of 3 images");
      return;
    }

    setImages(files);
    setPreviewImages(files.map((file) => URL.createObjectURL(file)));
    setError("");
  };

  const removeImage = (index) => {
    const newImages = [...images];
    const newPreviews = [...previewImages];
    newImages.splice(index, 1);
    newPreviews.splice(index, 1);
    setImages(newImages);
    setPreviewImages(newPreviews);
  };

  const handleSubmit = async () => {
    try {
      setUploading(true);
      setError("");

      const token = localStorage.getItem("token");
      if (!token) {
        setError("Please login first");
        return;
      }

      // Validation
      if (!form.groom_name || !form.bride_name || !form.wedding_date) {
        setError("Please fill all required fields");
        return;
      }

      const formData = new FormData();
      formData.append("groom_name", form.groom_name);
      formData.append("bride_name", form.bride_name);
      formData.append("wedding_date", form.wedding_date);
      formData.append("venue", form.venue);
      formData.append("description", form.description);
      images.forEach((file) => formData.append("images", file));

      await addSuccessStory(formData, token);

      // Success flow
      if (onSuccess) {
        onSuccess();
      }
      onClose();
    } catch (err) {
      console.error("Add story failed:", err);
      setError("Failed to submit story. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex items-end justify-center">
      <div className="w-full max-w-md bg-white rounded-t-2xl p-4 shadow-lg max-h-[90vh] overflow-y-auto">
        {/* Handle bar */}
        <div className="w-10 h-1 rounded-full bg-gray-300 mx-auto mb-4" />

        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-semibold text-navy">
            Share Your Success Story
          </h2>
          <button onClick={onClose} className="text-xs text-gray-500">
            Close
          </button>
        </div>

        {error && (
          <p className="text-[11px] text-red-500 mb-3 text-center">{error}</p>
        )}

        <div className="space-y-3">
          <div>
            <label className="block text-[11px] font-medium text-gray-700 mb-1">
              Groom's Name *
            </label>
            <input
              type="text"
              value={form.groom_name}
              onChange={(e) => handleInputChange("groom_name", e.target.value)}
              className="w-full border rounded-lg px-3 py-2 text-xs"
              required
            />
          </div>

          <div>
            <label className="block text-[11px] font-medium text-gray-700 mb-1">
              Bride's Name *
            </label>
            <input
              type="text"
              value={form.bride_name}
              onChange={(e) => handleInputChange("bride_name", e.target.value)}
              className="w-full border rounded-lg px-3 py-2 text-xs"
              required
            />
          </div>

          <div>
            <label className="block text-[11px] font-medium text-gray-700 mb-1">
              Wedding Date *
            </label>
            <input
              type="date"
              value={form.wedding_date}
              onChange={(e) =>
                handleInputChange("wedding_date", e.target.value)
              }
              className="w-full border rounded-lg px-3 py-2 text-xs"
              required
            />
          </div>

          <div>
            <label className="block text-[11px] font-medium text-gray-700 mb-1">
              Venue
            </label>
            <input
              type="text"
              value={form.venue}
              onChange={(e) => handleInputChange("venue", e.target.value)}
              className="w-full border rounded-lg px-3 py-2 text-xs"
            />
          </div>

          <div>
            <label className="block text-[11px] font-medium text-gray-700 mb-1">
              Your Story
            </label>
            <textarea
              value={form.description}
              onChange={(e) => handleInputChange("description", e.target.value)}
              className="w-full border rounded-lg px-3 py-2 text-xs min-h-[80px]"
              placeholder="Tell us how you both met on Sindhuuraa..."
            />
          </div>

          <div>
            <label className="block text-[11px] font-medium text-gray-700 mb-1">
              Upload Photos (max 3)
            </label>
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={handleFileChange}
              className="text-xs"
            />
            {images.length > 0 && (
              <p className="text-xs text-gray-500 mt-1">
                {images.length} file(s) selected
              </p>
            )}

            {previewImages.length > 0 && (
              <div className="grid grid-cols-3 gap-2 mt-2">
                {previewImages.map((preview, index) => (
                  <div key={index} className="relative">
                    <img
                      src={preview}
                      alt={`preview-${index}`}
                      className="w-full h-20 object-cover rounded-lg"
                    />
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="absolute -top-2 -right-2 w-5 h-5 rounded-full bg-red-500 text-white flex items-center justify-center text-xs"
                    >
                      <FiX className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <button
            type="button"
            onClick={handleSubmit}
            disabled={uploading}
            className="w-full bg-primary text-white py-2.5 rounded-full text-xs font-semibold shadow disabled:opacity-60 mt-2"
          >
            {uploading ? "Submitting..." : "Share My Story"}
          </button>
        </div>
      </div>
    </div>
  );
};
export default Home;
