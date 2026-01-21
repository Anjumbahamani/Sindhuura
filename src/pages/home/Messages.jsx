import React, { useEffect, useState } from "react";
import BottomNav from "../../components/BottomNav";

const Messages = () => {
  // IMPORTANT: initial value must be []
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");

  useEffect(() => {
    const fetchChatRooms = async () => {
      try {
        setLoading(true);
        setError("");

        const token = localStorage.getItem("token");
        if (!token) {
          throw new Error("Please log in to view messages.");
        }

        const res = await fetch("http://192.168.1.16:8000/api/chat/chat-rooms/", {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`, // adjust if needed
          },
        });

        if (res.status === 401) {
          throw new Error("Session expired. Please log in again.");
        }

        if (!res.ok) {
          throw new Error(`HTTP ${res.status}`);
        }

        const json = await res.json();

        if (!json.status) {
          throw new Error(json.message || "Failed to fetch chat rooms");
        }

        // IMPORTANT: always store an array
        const data = Array.isArray(json.data) ? json.data : [];
        setRooms(data);
      } catch (err) {
        setError(err.message || "Something went wrong");
        // In case of error, ensure rooms is an array
        setRooms([]);
      } finally {
        setLoading(false);
      }
    };

    fetchChatRooms();
  }, []);

  // Safe filtered list
  const filteredRooms = Array.isArray(rooms)
    ? rooms.filter((room) => {
        if (!search.trim()) return true;
        const q = search.toLowerCase();
        const name = room.other_user_name?.toLowerCase() || "";
        const last = room.last_message?.toLowerCase() || "";
        return name.includes(q) || last.includes(q);
      })
    : [];

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
                  onClick={() => console.log("Open room", room.id)}
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