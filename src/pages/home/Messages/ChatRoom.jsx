import React, { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { FiArrowLeft, FiSend } from "react-icons/fi";
import { getUserProfile } from "../../../services/auth.service";
import { getMembershipFromProfile } from "../../../utils/membership";

const ChatRoom = () => {
  const { roomId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const wsRef = useRef(null);

  const initialMode = location.state?.mode || "predefined_only"; // "full" | "predefined_only" | "none"
  const otherUser = location.state?.otherUser || null;

  const [mode, setMode] = useState(initialMode);
  const [messages, setMessages] = useState([]);
  const [suggestedAnswers, setSuggestedAnswers] = useState(null);
  const [input, setInput] = useState("");
  const [loadingHistory, setLoadingHistory] = useState(false);
  const [error, setError] = useState("");

  const [membership, setMembership] = useState({
    type: "free_trial",
    isPremium: false,
    planName: null,
    planLimit: 0,
    contactViewed: 0,
    contactRemaining: 0,
    expiryDate: null,
  });

  // 1) Load membership + chat history
  useEffect(() => {
    const loadInitial = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setError("Please login to access chats.");
          return;
        }

        // membership
        const profRes = await getUserProfile(token);
        const m = getMembershipFromProfile(profRes.response);
        setMembership(m);

        // history
        setLoadingHistory(true);
        const res = await fetch(
          `https://admin.sindhuura.com/api/chat/chat-history/${roomId}/`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const json = await res.json();
        if (!json.status)
          throw new Error(json.message || "Failed to load chat history");

        const list = json.data || json.response || [];
        setMessages(list);
      } catch (e) {
        console.error(e);
        setError(e.message || "Could not load this chat.");
      } finally {
        setLoadingHistory(false);
      }
    };

    loadInitial();
  }, [roomId]);

  // 2) WebSocket connection
 useEffect(() => {
  const token = localStorage.getItem("token");
  if (!token) {
    console.warn("No token, skipping WebSocket connection");
    return;
  }

  const WS_BASE =
    import.meta.env.VITE_WS_BASE_URL || "wss://admin.sindhuura.com";
  const wsUrl = `${WS_BASE.replace(/\/+$/, "")}/ws/chat/${roomId}/?token=${token}`;
  console.log("Connecting WS to:", wsUrl);

  const ws = new WebSocket(wsUrl);
  wsRef.current = ws;

  ws.onopen = () => {
    console.log("WS connected");
  };

  ws.onmessage = (event) => {
    try {
      const data = JSON.parse(event.data);
      switch (data.type) {
        case "chat_message":
          setMessages((prev) => [...prev, data]);
          break;
        case "suggested_answers":
          setSuggestedAnswers({
            question_id: data.question_id,
            answers: data.answers || [],
          });
          break;
        case "error":
          alert(data.detail || "Chat error");
          break;
        default:
          if (data.message_text) {
            setMessages((prev) => [...prev, data]);
          }
      }
    } catch (e) {
      console.error("WS message parse error:", e);
    }
  };

  ws.onerror = (e) => {
    console.error("WS error:", e);
  };

  ws.onclose = (e) => {
    console.log("WS closed:", e.code, e.reason);
  };

  return () => {
    // Only close if it actually connected
    if (ws.readyState === WebSocket.OPEN) {
      ws.close();
    }
  };
}, [roomId]);

  const sendPayload = (payload) => {
    if (!wsRef.current || wsRef.current.readyState !== WebSocket.OPEN) {
      alert("Chat connection not ready. Please try again.");
      return;
    }
    wsRef.current.send(JSON.stringify(payload));
  };

  // Send custom message (Premium↔Premium only)
  const handleSendCustom = () => {
    if (mode !== "full") {
      alert("Custom messages are only available for Premium–Premium chats.");
      return;
    }
    if (!input.trim()) return;

    sendPayload({
      message_type: "custom",
      message_text: input.trim(),
    });
    setInput("");
  };

  // Send predefined question
  const handleSendPredefinedQuestion = (questionId) => {
    if (mode === "none") {
      alert("You cannot chat in this conversation.");
      return;
    }
    sendPayload({
      message_type: "predefined",
      question_id: questionId,
    });
  };

  // Reply to suggested answer
  const handleSendSuggestedAnswer = (answerIndex) => {
    if (!suggestedAnswers) return;
    sendPayload({
      message_type: "predefined",
      question_id: suggestedAnswers.question_id,
      answer_index: answerIndex,
    });
    setSuggestedAnswers(null);
  };

  const renderMessage = (msg, idx) => {
    const isMe = msg.is_me; // adjust if backend sends different flag
    const text =
      msg.message_text ||
      msg.text ||
      (msg.message_type === "predefined" && msg.display_text) ||
      "…";

    return (
      <div
        key={msg.id || idx}
        className={`mb-1 flex ${isMe ? "justify-end" : "justify-start"}`}
      >
        <div
          className={`max-w-[75%] rounded-2xl px-3 py-2 text-[12px] ${
            isMe
              ? "bg-primary text-white rounded-br-sm"
              : "bg-gray-100 text-gray-800 rounded-bl-sm"
          }`}
        >
          <div>{text}</div>
          {msg.created_at && (
            <div className="mt-0.5 text-[9px] opacity-70 text-right">
              {msg.created_at}
            </div>
          )}
        </div>
      </div>
    );
  };

  const blocked = mode === "none";

  return (
    <div className="min-h-screen bg-white pb-20">
      <div className="max-w-md mx-auto min-h-screen bg-white pb-20 flex flex-col">
        {/* HEADER */}
        <header className="flex items-center gap-3 px-4 py-3 shadow-sm bg-white">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center"
          >
            <FiArrowLeft className="w-4 h-4 text-navy" />
          </button>
          <div className="flex flex-col">
            <h1 className="text-base font-semibold text-navy">
              {otherUser?.name || "Chat"}
            </h1>
            <span className="text-[10px] text-gray-500">
              {mode === "full"
                ? "Premium–Premium chat"
                : mode === "predefined_only"
                ? "Predefined messages only"
                : "Chat not allowed"}
            </span>
          </div>
        </header>

        {/* CONTENT */}
        <main className="flex-1 flex flex-col px-4 py-2 overflow-hidden">
          {loadingHistory && (
            <p className="text-[12px] text-gray-500">Loading chat…</p>
          )}
          {error && !loadingHistory && (
            <p className="text-[12px] text-red-500">{error}</p>
          )}

          {/* Messages */}
          <div className="flex-1 overflow-y-auto pb-2">
            {messages.map((m, idx) => renderMessage(m, idx))}
          </div>

          {/* Suggested answers from backend */}
          {suggestedAnswers && (
            <div className="mb-2 rounded-2xl bg-[#FFF4E5] border border-[#FFD9A5] px-2 py-2 text-[11px]">
              <p className="text-[11px] font-semibold text-navy mb-1">
                Quick Replies
              </p>
              <div className="flex flex-wrap gap-1">
                {suggestedAnswers.answers.map((a) => (
                  <button
                    key={a.index}
                    type="button"
                    onClick={() => handleSendSuggestedAnswer(a.index)}
                    className="px-2 py-1 rounded-full bg-white text-gray-800 border border-[#F5C58B] text-[11px]"
                  >
                    {a.text}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Blocked info */}
          {blocked && (
            <div className="mb-2 rounded-2xl bg-[#FFF2F0] border border-[#FFB8B0] px-3 py-2 text-[11px] text-gray-700">
              {membership.isPremium ? (
                <p>
                  This member is on a free plan. Chat is not allowed between
                  Premium and Free users.
                </p>
              ) : (
                <p>
                  This member is Premium. Upgrade your plan to start chatting
                  with Premium members.
                </p>
              )}
            </div>
          )}

          {/* Input area */}
          {!blocked && (
            <div className="mt-1">
              {/* Predefined question buttons (example: 3 static IDs) */}
              <div className="flex gap-2 mb-1 overflow-x-auto">
                {[1, 2, 3].map((qid) => (
                  <button
                    key={qid}
                    type="button"
                    onClick={() => handleSendPredefinedQuestion(qid)}
                    className="px-2 py-1 rounded-full bg-[#F6FAFF] border border-[#D0E4FF] text-[11px] text-[#1D7DEA]"
                  >
                    Q{qid}
                  </button>
                ))}
              </div>

              {/* Custom input only for Premium↔Premium */}
              {mode === "full" && (
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Type a message"
                    className="flex-1 border rounded-full px-3 py-2 text-[12px] bg-white text-gray-800 focus:ring-1 focus:ring-primary focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={handleSendCustom}
                    className="w-9 h-9 rounded-full bg-primary text-white flex items-center justify-center"
                  >
                    <FiSend className="w-4 h-4" />
                  </button>
                </div>
              )}

              {mode === "predefined_only" && (
                <p className="mt-1 text-[10px] text-gray-500">
                  On your current plan, you can use only predefined questions
                  and quick replies in this chat.
                </p>
              )}
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default ChatRoom;