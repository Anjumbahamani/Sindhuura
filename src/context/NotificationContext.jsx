// src/context/NotificationContext.jsx
import React, {
  createContext,
  useContext,
  useState,
  useCallback,
} from "react";
import { useNavigate } from "react-router-dom";

const NotificationContext = createContext(null);

export const useNotification = () => useContext(NotificationContext);

// src/context/NotificationContext.jsx
const NotificationBanner = ({ notification, onClose }) => {
  const navigate = useNavigate();

  if (!notification) return null;

  const { title, body, data } = notification;

  const handleClick = () => {
  if (data?.type === "chat" && data.room_id) {
    navigate(`/messages/${data.room_id}`);
  } else if (data?.type === "match_request") {
    // If backend provides a deep link, we can use that later.
    // For now, go to received requests.
    navigate("/requests/received"); // adjust route to your real page
  } else if (title === "New Match Request") {
    // Fallback if backend doesn't send data.type
    navigate("/requests/received");
  }
  onClose();
};

  return (
    <div className="fixed bottom-4 left-0 right-0 z-[9999] flex justify-center">
      <div
        role="button"
        tabIndex={0}
        onClick={handleClick}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") handleClick();
        }}
        className="max-w-md w-[90%] bg-white shadow-lg border border-gray-200 rounded-2xl p-3 flex items-start gap-3 text-left cursor-pointer"
      >
        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary text-sm">
          🔔
        </div>
        <div className="flex-1">
          <p className="text-[13px] font-semibold text-navy truncate">
            {title || "Notification"}
          </p>
          <p className="text-[11px] text-gray-700 line-clamp-2">
            {body || ""}
          </p>
        </div>

        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation(); // don’t trigger handleClick
            onClose();
          }}
          className="ml-1 text-[12px] text-gray-400 hover:text-gray-600"
          aria-label="Close notification"
        >
          ✕
        </button>
      </div>
    </div>
  );
};

export const NotificationProvider = ({ children }) => {
  const [notification, setNotification] = useState(null);

  const showNotification = useCallback((notif) => {
    console.log("SHOW NOTIFICATION:", notif);   // <--- debug
    setNotification(notif);
  }, []);

  const clearNotification = useCallback(() => {
    console.log("CLEAR NOTIFICATION");
    setNotification(null);
  }, []);

  return (
    <NotificationContext.Provider
      value={{ notification, showNotification, clearNotification }}
    >
      {children}
      <NotificationBanner
        notification={notification}
        onClose={clearNotification}
      />
    </NotificationContext.Provider>
  );
};