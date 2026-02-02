

// import React, { useEffect, useRef, useState } from "react";
// import { useLocation, useNavigate, useParams } from "react-router-dom";
// import { FiArrowLeft, FiSend } from "react-icons/fi";
// import { getUserProfile } from "../../../services/auth.service";
// import { getMembershipFromProfile } from "../../../utils/membership";

// // Predefined questions – adjust IDs/texts to match backend
// const PREDEFINED_QUESTIONS = [
//   { id: 1, text: "I liked your profile" },
//   { id: 2, text: "How are you?" },
//   { id: 3, text: "I would like to continue and move further" },
// ];

// const getQuestionTextById = (id) => {
//   const q = PREDEFINED_QUESTIONS.find((item) => item.id === id);
//   return q ? q.text : "Predefined message";
// };

// const ChatRoom = () => {
//   const { roomId } = useParams();
//   const location = useLocation();
//   const navigate = useNavigate();
//   const wsRef = useRef(null);
//   const messagesEndRef = useRef(null);

//   const initialMode = location.state?.mode || "predefined_only"; // "full" | "predefined_only" | "none"
//   // const otherUser = location.state?.otherUser || null;

//   const [mode] = useState(initialMode);
//   const [messages, setMessages] = useState([]);
//   const [suggestedAnswers, setSuggestedAnswers] = useState(null);
//   const [input, setInput] = useState("");
//   const [loadingHistory, setLoadingHistory] = useState(false);
//   const [error, setError] = useState("");
//   const [wsError, setWsError] = useState("");
//   const [membership, setMembership] = useState({
//     type: "free_trial",
//     isPremium: false,
//     planName: null,
//     planLimit: 0,
//     contactViewed: 0,
//     contactRemaining: 0,
//     expiryDate: null,
//   });

//   const blocked = mode === "none";

//   // Helper: my message?
//   const isMessageMine = (msg) => msg.sender === "you";

//   // Scroll to bottom whenever messages change
//   useEffect(() => {
//     if (messagesEndRef.current) {
//       messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
//     }
//   }, [messages.length]);

//   // 1) Load membership + chat history
//   useEffect(() => {
//     const loadInitial = async () => {
//       try {
//         const token = localStorage.getItem("token");
//         if (!token) {
//           setError("Please login to access chats.");
//           return;
//         }

//         // membership
//         const profRes = await getUserProfile(token);
//         const m = getMembershipFromProfile(profRes.response);
//         setMembership(m);

//         // history
//         setLoadingHistory(true);
//         const res = await fetch(
//           // `https://admin.sindhuura.com/api/chat/chat-history/${roomId}/`,
//           `http://192.168.1.10:8000/api/chat/chat-history/${roomId}/`,

//           {
//             headers: { Authorization: `Bearer ${token}` },
//           },
//         );
//         if (!res.ok) throw new Error(`HTTP ${res.status}`);
//         const json = await res.json();
//         if (!json.status)
//           throw new Error(json.message || "Failed to load chat history");

//         const list = json.data || json.response || [];
//         // list items already have shape you showed in the response
//         setMessages(list);
//       } catch (e) {
//         console.error(e);
//         setError(e.message || "Could not load this chat.");
//       } finally {
//         setLoadingHistory(false);
//       }
//     };

//     loadInitial();
//   }, [roomId]);

//   // 2) WebSocket connection
//   useEffect(() => {
//     const token = localStorage.getItem("token");
//     if (!token) {
//       console.warn("No token, skipping WebSocket connection");
//       return;
//     }

//     const WS_BASE =
//       import.meta.env.VITE_WS_BASE_URL || "wss://192.168.1.10:8001";
//     const wsUrl = `${WS_BASE.replace(/\/+$/, "")}/ws/chat/${roomId}/?token=${token}`;
//     console.log("Connecting WS to:", wsUrl);

//     const ws = new WebSocket(wsUrl);
//     wsRef.current = ws;

//     ws.onopen = () => {
//       console.log("WS connected");
//     };

//     // ws.onmessage = (event) => {
//     //   try {
//     //     const data = JSON.parse(event.data);
//     //     console.log("WS PARSED DATA:", data);

//     //     // If backend uses type, handle it; otherwise just append
//     //     if (data.type === "suggested_answers") {
//     //       setSuggestedAnswers({
//     //         question_id: data.question_id,
//     //         answers: data.answers || [],
//     //       });
//     //     } else if (data.type === "error") {
//     //       alert(data.detail || "Chat error");
//     //     } else {
//     //       // Treat anything with message_text as a chat message
//     //       if (data.message_text) {
//     //         setMessages((prev) => [...prev, data]);
//     //       }
//     //     }
//     //   } catch (e) {
//     //     console.error("WS message parse error:", e);
//     //   }
//     // };

//     ws.onmessage = (event) => {
//       try {
//         const data = JSON.parse(event.data);
//         console.log("WS PARSED DATA:", data);

//         // clear previous WS error on any normal message
//         if (data.type !== "error") {
//           setWsError("");
//         }

//         if (data.type === "suggested_answers") {
//           setSuggestedAnswers({
//             question_id: data.question_id,
//             answers: data.answers || [],
//           });
//         } else if (data.type === "error") {
//           // backend: { type: "error", message: "Upgrade your plan..." }
//           const msg = data.message || data.detail || data.error || "Chat error";
//           setWsError(msg);
//           // (Optional) If errors should block chat, you could set mode to "none" here
//         } else {
//           // Treat anything with message_text as chat message
//           if (data.message_text) {
//             setMessages((prev) => [...prev, data]);
//           }
//         }
//       } catch (e) {
//         console.error("WS message parse error:", e);
//       }
//     };

//     ws.onerror = (e) => {
//       console.error("WS error:", e);
//     };

//     ws.onclose = (e) => {
//       console.log("WS closed:", e.code, e.reason);
//     };

//     return () => {
//       if (ws.readyState === WebSocket.OPEN) {
//         ws.close();
//       }
//     };
//   }, [roomId]);

//   const sendPayload = (payload) => {
//     if (!wsRef.current || wsRef.current.readyState !== WebSocket.OPEN) {
//       console.warn(
//         "Chat connection not ready, attempting to send anyway:",
//         payload,
//       );
//       // Optionally: queue for retry
//       return;
//     }
//     wsRef.current.send(JSON.stringify(payload));
//   };
//   // 3) Sending messages

//   const handleSendCustom = () => {
//     if (mode !== "full") {
//       alert("Custom messages are only available for Premium–Premium chats.");
//       return;
//     }
//     if (!input.trim()) return;

//     const text = input.trim();
//     sendPayload({ message_type: "custom", message_text: text });

//     const now = new Date();
//     const localMsg = {
//       id: `local-${now.getTime()}`,
//       sender: "you",
//       message_type: "custom",
//       message_text: text,
//       is_read: false,
//       created_at: now.toISOString(),
//     };

//     setMessages((prev) => [...prev, localMsg]);
//     setInput("");
//   };

//   const handleSendPredefinedQuestion = (questionId) => {
//     if (mode === "none") {
//       alert("You cannot chat in this conversation.");
//       return;
//     }

//     sendPayload({
//       message_type: "predefined",
//       question_id: questionId,
//     });

//     const now = new Date();
//     const localMsg = {
//       id: `local-q-${now.getTime()}`,
//       sender: "you",
//       message_type: "predefined",
//       message_text: getQuestionTextById(questionId),
//       predefined_question_id: questionId,
//       predefined_answer_index: null,
//       is_read: false,
//       created_at: now.toISOString(),
//     };

//     setMessages((prev) => [...prev, localMsg]);
//   };

//   const handleSendSuggestedAnswer = (answerIndex) => {
//     if (!suggestedAnswers) return;

//     const answerObj = suggestedAnswers.answers.find(
//       (a) => a.index === answerIndex,
//     );

//     sendPayload({
//       message_type: "predefined",
//       question_id: suggestedAnswers.question_id,
//       answer_index: answerIndex,
//     });

//     const now = new Date();
//     const localMsg = {
//       id: `local-a-${now.getTime()}`,
//       sender: "you",
//       message_type: "predefined",
//       message_text: answerObj ? answerObj.text : "Answer",
//       predefined_question_id: suggestedAnswers.question_id,
//       predefined_answer_index: answerIndex,
//       is_read: false,
//       created_at: now.toISOString(),
//     };

//     setMessages((prev) => [...prev, localMsg]);
//     setSuggestedAnswers(null);
//   };

//   // 4) Render messages (WhatsApp-like)

//   const renderMessage = (msg, idx) => {
//     const isMe = isMessageMine(msg);

//     let text;
//     if (msg.message_type === "predefined") {
//       if (msg.message_text) text = msg.message_text;
//       else if (msg.predefined_question_id)
//         text = getQuestionTextById(msg.predefined_question_id);
//       else text = "Predefined message";
//     } else {
//       text = msg.message_text || msg.text || "…";
//     }

//     return (
//       <div
//         key={msg.id || idx}
//         className={`mb-1 flex ${isMe ? "justify-end" : "justify-start"}`}
//       >
//         <div
//           className={`max-w-[75%] rounded-2xl px-3 py-2 text-[12px] ${
//             isMe
//               ? "bg-primary text-white rounded-br-sm"
//               : "bg-gray-100 text-gray-800 rounded-bl-sm"
//           }`}
//         >
//           <div>{text}</div>
//           {msg.created_at && (
//             <div className="mt-0.5 text-[9px] opacity-70 text-right">
//               {msg.created_at}
//             </div>
//           )}
//         </div>
//       </div>
//     );
//   };
//   const isMePremium = membership.isPremium;
//   const isOtherPremium = otherUser?.membership === "premium";

//   return (
//     <div className="min-h-screen bg-white">
//       <div className="max-w-md mx-auto min-h-screen bg-white flex flex-col">
//         {/* HEADER (sticky) */}
//         <header className="sticky top-0 z-10 flex items-center gap-3 px-4 py-3 shadow-sm bg-white">
//           <button
//             type="button"
//             onClick={() => navigate(-1)}
//             className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center"
//           >
//             <FiArrowLeft className="w-4 h-4 text-navy" />
//           </button>
//           <div className="flex flex-col">
//             <h1 className="text-base font-semibold text-navy">
//               {otherUser?.name || "Chat"}
//             </h1>
//             <span className="text-[10px] text-gray-500">
//               {mode === "full"
//                 ? "Premium–Premium chat"
//                 : mode === "predefined_only"
//                   ? "Predefined messages only"
//                   : "Chat not allowed"}
//             </span>
//           </div>
//         </header>

//         {/* CONTENT */}
//         <main className="flex-1 flex flex-col px-4 py-2 overflow-hidden">
//           {loadingHistory && (
//             <p className="text-[12px] text-gray-500">Loading chat…</p>
//           )}
//           {error && !loadingHistory && (
//             <p className="text-[12px] text-red-500">{error}</p>
//           )}

//           {/* Messages */}
//           <div className="flex-1 overflow-y-auto pb-2">
//             {messages.map((m, idx) => renderMessage(m, idx))}
//             <div ref={messagesEndRef} />
//           </div>

//           {/* Suggested answers from backend */}
//           {suggestedAnswers && (
//             <div className="mb-2 rounded-2xl bg-[#FFF4E5] border border-[#FFD9A5] px-2 py-2 text-[11px]">
//               <p className="text-[11px] font-semibold text-navy mb-1">
//                 Quick Replies
//               </p>
//               <div className="flex flex-wrap gap-1">
//                 {suggestedAnswers.answers.map((a) => (
//                   <button
//                     key={a.index}
//                     type="button"
//                     onClick={() => handleSendSuggestedAnswer(a.index)}
//                     className="px-2 py-1 rounded-full bg-white text-gray-800 border border-[#F5C58B] text-[11px]"
//                   >
//                     {a.text}
//                   </button>
//                 ))}
//               </div>
//             </div>
//           )}

//           {/* Suggested answers from backend */}
//           {suggestedAnswers && (
//             <div className="mb-2 rounded-2xl bg-[#FFF4E5] border border-[#FFD9A5] px-2 py-2 text-[11px]">
//               <p className="text-[11px] font-semibold text-navy mb-1">
//                 Quick Replies
//               </p>
//               <div className="flex flex-wrap gap-1">
//                 {suggestedAnswers.answers.map((a) => (
//                   <button
//                     key={a.index}
//                     type="button"
//                     onClick={() => handleSendSuggestedAnswer(a.index)}
//                     className="px-2 py-1 rounded-full bg-white text-gray-800 border border-[#F5C58B] text-[11px]"
//                   >
//                     {a.text}
//                   </button>
//                 ))}
//               </div>
//             </div>
//           )}

//           {/* WebSocket error message (e.g. upgrade prompt) */}
//           {wsError && (
//             <div className="mb-2 rounded-2xl bg-[#FFF2F0] border border-[#FFB8B0] px-3 py-2 text-[11px] text-red-700">
//               {wsError}
//             </div>
//           )}

//           {/* Blocked info */}

//           {blocked && (
//             <div className="mb-2 rounded-2xl bg-[#FFF2F0] border border-[#FFB8B0] px-3 py-2 text-[11px] text-gray-700">
//               {isMePremium && !isOtherPremium && (
//                 <p>
//                   {otherUser?.name || "This member"} is on a free plan. Chat is
//                   not allowed between Premium and Free users.
//                 </p>
//               )}

//               {!isMePremium && isOtherPremium && (
//                 <p>
//                   This member is Premium. Upgrade your plan to start chatting
//                   with Premium members.
//                 </p>
//               )}

//               {!isMePremium && !isOtherPremium && (
//                 <p>
//                   Chat is restricted between your current plans. Upgrade to
//                   Premium to start a conversation.
//                 </p>
//               )}

//               {isMePremium && isOtherPremium && (
//                 <p>
//                   Chat is blocked due to server rules. Please contact support if
//                   this seems incorrect.
//                 </p>
//               )}
//             </div>
//           )}

//           {/* Input area */}
//           {/* Input area */}
//           {!blocked && (
//             <div className="mt-1 pb-2">
//               {/* FREE ↔ FREE: predefined only */}
//               {mode === "predefined_only" && (
//                 <>
//                   <div className="flex gap-2 mb-1 overflow-x-auto pb-1">
//                     {PREDEFINED_QUESTIONS.map((q) => (
//                       <button
//                         key={q.id}
//                         type="button"
//                         onClick={() => handleSendPredefinedQuestion(q.id)}
//                         className="px-3 py-1.5 rounded-full bg-[#F6FAFF] border border-[#D0E4FF] text-[11px] text-[#1D7DEA] text-left whitespace-nowrap"
//                       >
//                         {q.text}
//                       </button>
//                     ))}
//                   </div>
//                   <p className="mt-1 text-[10px] text-gray-500">
//                     On your current plan, you can use only predefined questions
//                     and quick replies in this chat.
//                   </p>
//                 </>
//               )}

//               {/* PREMIUM ↔ PREMIUM: WhatsApp-like text input */}
//               {mode === "full" && (
//                 <div className="flex items-center gap-2">
//                   <input
//                     type="text"
//                     value={input}
//                     onChange={(e) => setInput(e.target.value)}
//                     placeholder="Type a message"
//                     className="flex-1 border rounded-full px-3 py-2 text-[12px] bg-white text-gray-800 focus:ring-1 focus:ring-primary focus:outline-none"
//                   />
//                   <button
//                     type="button"
//                     onClick={handleSendCustom}
//                     className="w-9 h-9 rounded-full bg-primary text-white flex items-center justify-center"
//                   >
//                     <FiSend className="w-4 h-4" />
//                   </button>
//                 </div>
//               )}
//             </div>
//           )}
//         </main>
//       </div>
//     </div>
//   );
// };

// export default ChatRoom;


import React, { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { FiArrowLeft, FiSend ,FiTrash2} from "react-icons/fi";
import { getUserProfile } from "../../../services/auth.service";
import { getMembershipFromProfile } from "../../../utils/membership";

// Predefined questions – adjust IDs/texts to match backend
const PREDEFINED_QUESTIONS = [
  { id: 1, text: "I liked your profile" },
  { id: 2, text: "How are you?" },
  { id: 3, text: "I would like to continue and move further" },
];

const getQuestionTextById = (id) => {
  const q = PREDEFINED_QUESTIONS.find((item) => item.id === id);
  return q ? q.text : "Predefined message";
};

const ChatRoom = () => {
  const { roomId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const wsRef = useRef(null);
  const messagesEndRef = useRef(null);

  const initialMode = location.state?.mode || "predefined_only"; // "full" | "predefined_only" | "none"
  const otherUser = location.state?.otherUser || null;           // <-- RESTORED

  const [mode] = useState(initialMode);
  const [messages, setMessages] = useState([]);
  const [suggestedAnswers, setSuggestedAnswers] = useState(null);
  const [input, setInput] = useState("");
  const [loadingHistory, setLoadingHistory] = useState(false);
  const [error, setError] = useState("");
  const [wsError, setWsError] = useState("");
  const [membership, setMembership] = useState({
    type: "free_trial",
    isPremium: false,
    planName: null,
    planLimit: 0,
    contactViewed: 0,
    contactRemaining: 0,
    expiryDate: null,
  });

  const blocked = mode === "none";

  // Helper: my message?
  const isMessageMine = (msg) => msg.sender === "you";

  // Scroll to bottom whenever messages change
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages.length]);

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
          // prod
          `https://admin.sindhuura.com/api/chat/chat-history/${roomId}/`,
          // local
          // `http://192.168.1.10:8000/api/chat/chat-history/${roomId}/`,
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
      import.meta.env.VITE_WS_BASE_URL || "wss://192.168.1.10:8001";
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
        console.log("WS PARSED DATA:", data);

        // clear previous WS error on any normal message
        if (data.type !== "error") {
          setWsError("");
        }

        if (data.type === "suggested_answers") {
          setSuggestedAnswers({
            question_id: data.question_id,
            answers: data.answers || [],
          });
        } else if (data.type === "error") {
          const msg = data.message || data.detail || data.error || "Chat error";
          setWsError(msg);
        } else {
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
      if (ws.readyState === WebSocket.OPEN) {
        ws.close();
      }
    };
  }, [roomId]);

  const sendPayload = (payload) => {
    if (!wsRef.current || wsRef.current.readyState !== WebSocket.OPEN) {
      console.warn(
        "Chat connection not ready, attempting to send anyway:",
        payload
      );
      return;
    }
    wsRef.current.send(JSON.stringify(payload));
  };

  // 3) Sending messages

  const handleSendCustom = () => {
    if (mode !== "full") {
      alert("Custom messages are only available for Premium–Premium chats.");
      return;
    }
    if (!input.trim()) return;

    const text = input.trim();
    sendPayload({ message_type: "custom", message_text: text });

    const now = new Date();
    const localMsg = {
      id: `local-${now.getTime()}`,
      sender: "you",
      message_type: "custom",
      message_text: text,
      is_read: false,
      created_at: now.toISOString(),
    };

    setMessages((prev) => [...prev, localMsg]);
    setInput("");
  };

  const handleSendPredefinedQuestion = (questionId) => {
    if (mode === "none") {
      alert("You cannot chat in this conversation.");
      return;
    }

    sendPayload({
      message_type: "predefined",
      question_id: questionId,
    });

    const now = new Date();
    const localMsg = {
      id: `local-q-${now.getTime()}`,
      sender: "you",
      message_type: "predefined",
      message_text: getQuestionTextById(questionId),
      predefined_question_id: questionId,
      predefined_answer_index: null,
      is_read: false,
      created_at: now.toISOString(),
    };

    setMessages((prev) => [...prev, localMsg]);
  };

  const handleSendSuggestedAnswer = (answerIndex) => {
    if (!suggestedAnswers) return;

    const answerObj = suggestedAnswers.answers.find(
      (a) => a.index === answerIndex
    );

    sendPayload({
      message_type: "predefined",
      question_id: suggestedAnswers.question_id,
      answer_index: answerIndex,
    });

    const now = new Date();
    const localMsg = {
      id: `local-a-${now.getTime()}`,
      sender: "you",
      message_type: "predefined",
      message_text: answerObj ? answerObj.text : "Answer",
      predefined_question_id: suggestedAnswers.question_id,
      predefined_answer_index: answerIndex,
      is_read: false,
      created_at: now.toISOString(),
    };

    setMessages((prev) => [...prev, localMsg]);
    setSuggestedAnswers(null);
  };


// Delete message (premium users, own messages only)
const handleDeleteMessage = (messageId) => {
  if (!membership.isPremium) return;          // only premium users
  if (!messageId || typeof messageId !== "number") return;

  const confirmDel = window.confirm("Delete this message?");
  if (!confirmDel) return;

  // Send delete action via WebSocket
  sendPayload({
    action: "delete_message",
    message_id: messageId,
  });

  // Optimistically remove from UI
  setMessages((prev) => prev.filter((m) => m.id !== messageId));
};

  // 4) Render messages (WhatsApp-like)

  const renderMessage = (msg, idx) => {
    const isMe = isMessageMine(msg);

    let text;
    if (msg.message_type === "predefined") {
      if (msg.message_text) text = msg.message_text;
      else if (msg.predefined_question_id)
        text = getQuestionTextById(msg.predefined_question_id);
      else text = "Predefined message";
    } else {
      text = msg.message_text || msg.text || "…";
    }
 const canDelete =
    membership.isPremium &&           // you are premium
    isMe &&                           // your own message
    typeof msg.id === "number";       // has real backend id

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
          {canDelete && (
          <button
            type="button"
            onClick={() => handleDeleteMessage(msg.id)}
            className="ml-1 w-5 h-5 flex items-center justify-center rounded-full bg-white shadow border border-gray-200 text-gray-500 hover:text-red-600 hover:border-red-400"
            title="Delete message"
          >
            <FiTrash2 className="w-3 h-3" />
          </button>
        )}
      
      </div>
    );
  };

  const isMePremium = membership.isPremium;
  const isOtherPremium = otherUser?.membership === "premium";

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-md mx-auto min-h-screen bg-white flex flex-col">
        {/* HEADER (sticky) */}
        <header className="sticky top-0 z-10 flex items-center gap-3 px-4 py-3 shadow-sm bg-white">
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
            <div ref={messagesEndRef} />
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

          {/* WebSocket error message (e.g. upgrade prompt) */}
          {wsError && (
            <div className="mb-2 rounded-2xl bg-[#FFF2F0] border border-[#FFB8B0] px-3 py-2 text-[11px] text-red-700">
              {wsError}
            </div>
          )}

          {/* Blocked info */}
          {blocked && (
            <div className="mb-2 rounded-2xl bg-[#FFF2F0] border border-[#FFB8B0] px-3 py-2 text-[11px] text-gray-700">
              {isMePremium && !isOtherPremium && (
                <p>
                  {otherUser?.name || "This member"} is on a free plan. Chat is
                  not allowed between Premium and Free users.
                </p>
              )}

              {!isMePremium && isOtherPremium && (
                <p>
                  This member is Premium. Upgrade your plan to start chatting
                  with Premium members.
                </p>
              )}

              {!isMePremium && !isOtherPremium && (
                <p>
                  Chat is restricted between your current plans. Upgrade to
                  Premium to start a conversation.
                </p>
              )}

              {isMePremium && isOtherPremium && (
                <p>
                  Chat is blocked due to server rules. Please contact support if
                  this seems incorrect.
                </p>
              )}
            </div>
          )}

          {/* Input area */}
          {!blocked && (
            <div className="mt-1 pb-2">
              {/* FREE ↔ FREE: predefined only */}
              {mode === "predefined_only" && (
                <>
                  <div className="flex gap-2 mb-1 overflow-x-auto pb-1">
                    {PREDEFINED_QUESTIONS.map((q) => (
                      <button
                        key={q.id}
                        type="button"
                        onClick={() => handleSendPredefinedQuestion(q.id)}
                        className="px-3 py-1.5 rounded-full bg-[#F6FAFF] border border-[#D0E4FF] text-[11px] text-[#1D7DEA] text-left whitespace-nowrap"
                      >
                        {q.text}
                      </button>
                    ))}
                  </div>
                  <p className="mt-1 text-[10px] text-gray-500">
                    On your current plan, you can use only predefined questions
                    and quick replies in this chat.
                  </p>
                </>
              )}

              {/* PREMIUM ↔ PREMIUM: WhatsApp-like text input */}
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
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default ChatRoom;