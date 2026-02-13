import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import BottomNav from "../../components/BottomNav";
import { FiArrowLeft, FiCheck, FiX, FiSearch, FiInbox } from "react-icons/fi";
import { acceptRequest, rejectRequest, getNotifications } from "../../services/match.service";

const Notifications = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("all"); 
  const [searchQuery, setSearchQuery] = useState("");
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const searchTimer = useRef(null);

   const fetchNotifications = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const res = await getNotifications(token);
      
      const dataArray = Array.isArray(res.response) ? res.response : [];
      setNotifications(dataArray);
    } catch (err) {
      console.error("Fetch error:", err);
      setError("Failed to load notifications");
      setNotifications([]); 
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchNotifications();
  }, []);

  const filteredNotifications = Array.isArray(notifications) 
    ? notifications.filter(n => {
        const matchesTab = activeTab === "requests" ? n.notification_type === "match_request" : true;
        const name = n.sender_name || "";
        const msg = n.message || "";
        const matchesSearch = name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                              msg.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesTab && matchesSearch;
      })
    : [];

  const unreadRequestsCount = Array.isArray(notifications)
    ? notifications.filter(n => n.notification_type === "match_request" && !n.is_read).length
    : 0;

  return (
    <div className="min-h-screen bg-white pb-20">
      <div className="max-w-md mx-auto min-h-screen bg-white pb-20">
        <div className="bg-white shadow-sm pb-2">
          <div className="px-4 pt-3">
            <h1 className="text-lg font-semibold text-navy">Notifications</h1>
            <p className="text-[11px] text-gray-500">All your updates in one place</p>
          </div>

          <div className="px-4 mt-3 mb-1">
            <div className="flex bg-[#F7F7F7] rounded-full p-1 gap-1">
              {[
                { id: "all", label: "All", count: notifications.length },
                { id: "requests", label: "Requests", count: unreadRequestsCount },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex-1 inline-flex items-center justify-center gap-1 px-3 py-1.5 rounded-full text-[11px] font-semibold transition ${
                    activeTab === tab.id ? "bg-primary text-white shadow-sm" : "bg-white text-gray-600 border border-gray-200"
                  }`}
                >
                  <span>{tab.label}</span>
                  {tab.count > 0 && (
                    <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${
                      activeTab === tab.id ? "bg-white/15 text-white" : "bg-red-50 text-red-500"
                    }`}>
                      {tab.count}
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>

          <div className="px-4 mt-3 mb-2">
            <div className="flex items-center bg-white border border-gray-300 rounded-full px-3 py-2.5 shadow-sm">
              <FiSearch className="w-4 h-4 text-gray-400 mr-2" />
              <input
                type="text"
                placeholder="Search notifications"
                className="flex-1 outline-none text-[12px] bg-transparent"
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
        </div>

        <main className="px-3 pt-3">
          {loading && <p className="text-center text-xs text-gray-400 py-10">Updating notifications...</p>}
          
          {!loading && filteredNotifications.length === 0 && (
            <div className="flex flex-col items-center justify-center mt-20 text-center text-gray-500">
              <FiInbox className="w-8 h-8 text-[#B36A1E] mb-3" />
              <p className="text-sm font-semibold text-navy">No notifications yet</p>
            </div>
          )}

          <div className="space-y-3">
            {filteredNotifications.map((n) => (
              <NotificationCard 
                key={n.id} 
                item={n} 
                refresh={fetchNotifications} 
              />
            ))}
          </div>
        </main>
        <BottomNav />
      </div>
    </div>
  );
};

const NotificationCard = ({ item, refresh }) => {
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);
  const token = localStorage.getItem("token");

  const handleAction = async (e, type) => {
    e.stopPropagation();
    try {
      setSubmitting(true);
      if (type === 'accept') await acceptRequest(item.match_request, token);
      else await rejectRequest(item.match_request, token);
      refresh();
    } catch (err) {
      alert("Action failed. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div
      onClick={() => {
        if (item.notification_type === "match_request") navigate(`/matches/${item.sender_id}`);
      }}
      className={`cursor-pointer rounded-2xl shadow-sm px-3 py-3 flex gap-3 items-start transition border ${
        !item.is_read ? "bg-[#FFF7E9] border-orange-100" : "bg-white border-gray-50"
      }`}
    >
      {/* Sender Avatar Placeholder */}
      <div className="w-12 h-12 rounded-full overflow-hidden flex-shrink-0 bg-primary/10 flex items-center justify-center text-primary font-bold">
        {item.sender_name?.[0] || "U"}
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex justify-between items-start">
          <p className="text-sm font-semibold text-navy truncate">{item.title}</p>
          <span className="text-[9px] text-gray-400 whitespace-nowrap ml-2">{item.created_at}</span>
        </div>
        
        <p className="text-[11px] text-gray-600 mt-0.5 leading-snug">{item.message}</p>

        {item.notification_type === "match_request" && !item.is_read && (
          <div className="mt-3 flex gap-2" onClick={e => e.stopPropagation()}>
            <button
              onClick={(e) => handleAction(e, 'reject')}
              disabled={submitting}
              className="flex-1 py-1.5 rounded-lg border border-gray-200 text-[10px] font-bold text-gray-600 hover:bg-gray-50"
            >
              Decline
            </button>
            <button
              onClick={(e) => handleAction(e, 'accept')}
              disabled={submitting}
              className="flex-1 py-1.5 rounded-lg bg-primary text-white text-[10px] font-bold shadow-sm"
            >
              Accept
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Notifications;