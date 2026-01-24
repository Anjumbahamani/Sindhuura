// src/pages/Messages/Messages.jsx
import React, { useEffect, useState } from "react";
import BottomNav from "../../components/BottomNav";
import { useNavigate } from "react-router-dom";
import { getUserProfile } from "../../services/auth.service";
import { getMembershipFromProfile } from "../../utils/membership";
import { getChatMode } from "../../utils/chatPermissions";

const Messages = () => {
  const navigate = useNavigate();

  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");

  const [membership, setMembership] = useState({
    type: "free_trial",
    isPremium: false,
    planName: null,
    planLimit: 0,
    contactViewed: 0,
    contactRemaining: 0,
    expiryDate: null,
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError("");

        const token = localStorage.getItem("token");
        if (!token) {
          throw new Error("Please log in to view messages.");
        }

        // 1) Current user profile → membership
        const profileRes = await getUserProfile(token);
        const profile = profileRes.response;
        const m = getMembershipFromProfile(profile);
        console.log("DEBUG membership:", m);
        setMembership(m);

        // 2) Chat rooms
        const res = await fetch(
          "https://admin.sindhuura.com/api/chat/chat-rooms/",
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        console.log("DEBUG chat-rooms status:", res.status);

        if (res.status === 401) {
          throw new Error("Session expired. Please log in again.");
        }

        if (!res.ok) {
          throw new Error(`HTTP ${res.status}`);
        }

        const json = await res.json();
        console.log("DEBUG chat-rooms json:", json);

        if (!json.status) {
          throw new Error(json.message || "Failed to fetch chat rooms");
        }

        // API returns `response: [...]` not `data`
        const rawList = Array.isArray(json.response) ? json.response : [];
        console.log("DEBUG rawList:", rawList);

        // Map API shape -> internal room shape
        const base = "https://admin.sindhuura.com";
        const origin = base.replace(/\/+$/, "");

        const mappedRooms = rawList.map((item) => {
          const profile =
            item.profile_image && item.profile_image.startsWith("http")
              ? item.profile_image
              : item.profile_image
              ? `${origin}${item.profile_image}`
              : null;

          return {
            id: item.chat_room_id, // room id
            other_user_id: item.user_id, // other user's id
            other_user_name: item.name, // display name
            other_user_profile: profile, // avatar URL
            last_message: item.last_message,
            last_message_time: item.last_message_time,
            // derive membership: true => "premium", false => "free_trial"
            other_user_membership: item.is_subscribed
              ? "premium"
              : "free_trial",
          };
        });

        console.log("DEBUG mappedRooms:", mappedRooms);
        setRooms(mappedRooms);
      } catch (err) {
        console.error("fetchData error:", err);
        setError(err.message || "Something went wrong");
        setRooms([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const filteredRooms = Array.isArray(rooms)
    ? rooms.filter((room) => {
        if (!search.trim()) return true;
        const q = search.toLowerCase();
        const name = room.other_user_name?.toLowerCase() || "";
        const last = room.last_message?.toLowerCase() || "";
        return name.includes(q) || last.includes(q);
      })
    : [];

  const handleOpenRoom = (room) => {
    // backend should send: other_user_membership = "premium" | "free_trial" | "none"
    const otherType = room.other_user_membership || "free_trial";

    const mode = getChatMode(membership.type, otherType);

    if (mode === "none") {
      if (membership.type === "premium") {
        alert(
          `${room.other_user_name} is on a free plan. Chat is not allowed between Premium and Free users.`
        );
      } else {
        alert(
          `This member is Premium. Upgrade your plan to start chatting with Premium members.`
        );
      }
      return;
    }

    // navigate to ChatRoom with mode + other user info
    navigate(`/messages/${room.id}`, {
      state: {
        mode,
        otherUser: {
          id: room.other_user_id,
          name: room.other_user_name,
          profile: room.other_user_profile,
          membership: otherType,
        },
      },
    });
  };

  return (
    <>
      <div className="messages-page">
        <header className="messages-header">
          <h1 className="messages-title">Messages</h1>
        </header>

        <div className="messages-search">
          <input
            type="text"
            placeholder="Search by name or message"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <main className="messages-content">
          {loading && !error && (
            <div className="chat-list">
              {[1, 2, 3, 4].map((i) => (
                <div className="chat-skeleton" key={i}>
                  <div className="skeleton-avatar" />
                  <div className="skeleton-text">
                    <div className="skeleton-line short" />
                    <div className="skeleton-line long" />
                  </div>
                </div>
              ))}
            </div>
          )}

          {error && (
            <div className="messages-state messages-error">
              <p>{error}</p>
            </div>
          )}

          {!loading && !error && filteredRooms.length === 0 && (
            <div className="messages-state">
              <div className="state-icon">💬</div>
              <h2>No conversations yet</h2>
              <p>
                Once you start interacting with members, your conversations will
                appear here.
              </p>
            </div>
          )}

          {!loading && !error && filteredRooms.length > 0 && (
            <div className="chat-list">
              {filteredRooms.map((room) => (
                <button
                  key={room.id}
                  className="chat-item"
                  type="button"
                  onClick={() => handleOpenRoom(room)}
                >
                  <div className="chat-avatar-wrapper">
                    <img
                      src={room.other_user_profile}
                      alt={room.other_user_name}
                      className="chat-avatar"
                      onError={(e) => {
                        e.target.src = "/default-avatar.png";
                      }}
                    />
                  </div>

                  <div className="chat-info">
                    <div className="chat-top-row">
                      <div className="chat-name">{room.other_user_name}</div>
                      {room.last_message_time && (
                        <div className="chat-time">
                          {room.last_message_time}
                        </div>
                      )}
                    </div>

                    <div className="chat-bottom-row">
                      <div className="chat-last-message">
                        {room.last_message || "No messages yet"}
                      </div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </main>
      </div>

      <BottomNav />
    </>
  );
};

export default Messages;
