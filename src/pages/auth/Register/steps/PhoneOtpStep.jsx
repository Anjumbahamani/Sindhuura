
// // steps/PhoneOtpStep.jsx

// const PhoneOtpStep = ({ data, setData, onNext, onBack }) => {
//   const isFriendFlow =
//     data.profileFor === "Friend" ||
//     data.profileFor === "Relative" ||
//     data.profileFor === "Sister" ||
//     data.profileFor === "Brother" ||
//     data.profileFor === "Son" ||
//     data.profileFor === "Daughter" ||
//     data.profileFor === "Myself";

//   return (
//     <div className="min-h-screen bg-white flex flex-col">
//       {/* Header */}
//       <div className="flex items-center gap-3 px-4 py-4 border-b">
//         <button onClick={onBack}>←</button>
//         <h1 className="text-base font-semibold text-navy">Basic Details</h1>
//       </div>

//       {/* Content */}
//       <div className="flex-1 px-4 py-6">
//         {/* Dynamic name field */}
//         {isFriendFlow && (
//           <div className="mb-5">
//             <input
//               type="text"
//               placeholder={`Enter your ${data.profileFor.toLowerCase()}'s name`}
//               value={data.name || ""}
//               onChange={(e) => setData({ ...data, name: e.target.value })}
//               className="w-full px-4 py-3 rounded-xl border border-gray-300
//                          focus:outline-none focus:ring-2 focus:ring-primary"
//             />
//           </div>
//         )}

//         {/* Phone */}
//         <div className="mb-3 flex gap-3">
//           <div className="w-[90px] flex items-center justify-center
//                           border border-gray-300 rounded-xl">
//             🇮🇳 +91
//           </div>

//           <input
//             type="tel"
//             placeholder="Enter mobile number"
//             value={data.phone}
//             onChange={(e) => setData({ ...data, phone: e.target.value })}
//             className="flex-1 px-4 py-3 rounded-xl border border-gray-300
//                        focus:outline-none focus:ring-2 focus:ring-primary"
//           />
//         </div>

//         <p className="text-sm text-gray-500">
//           OTP will be sent to this number
//         </p>
//       </div>

//       {/* CTA */}
//       <div className="px-4 py-4 border-t">
//         <button
//           onClick={onNext}
//           disabled={!data.phone || data.phone.length < 10}
//           className={`w-full py-4 rounded-xl font-semibold text-base
//             ${
//               data.phone?.length === 10
//                 ? "bg-primary text-white"
//                 : "bg-gray-200 text-gray-400 cursor-not-allowed"
//             }`}
//         >
//           Get OTP
//         </button>

//         <p className="text-xs text-center text-gray-400 mt-3">
//           By registering, I agree to the{" "}
//           <span className="underline">T&amp;C</span> and{" "}
//           <span className="underline">Privacy Policy</span>
//         </p>
//       </div>
//     </div>
//   );
// };

// export default PhoneOtpStep;
import { useState } from "react";

const PhoneOtpStep = ({ data, setData, onNext, onBack }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleGetOtp = async () => {
  setError("");
  setLoading(true);
  const fullPhone = `+91${data.phone}`;

  try {
    // 1. Check if Email/Phone already exists
    const checkRes = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/auth/check-email/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: data.email, phone_number: data.phone }),
    });
    
    const checkJson = await checkRes.json();

    // 🔍 NEW LOGIC HERE:
    // Even if status is true, check if the email or phone actually exists
    if (checkJson.status && checkJson.response) {
      const { email_exists, phone_exists } = checkJson.response;

      if (email_exists && phone_exists) {
        setError("Both Email and Phone Number are already registered.");
        setLoading(false);
        return;
      }
      if (email_exists) {
        setError("This Email is already registered. Please use another.");
        setLoading(false);
        return;
      }
      if (phone_exists) {
        setError("This Phone Number is already registered. Please use another.");
        setLoading(false);
        return;
      }
    }

    // 2. If NO error was found above, Trigger Send OTP
    const otpRes = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/auth/send-otp/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ phone_number: fullPhone }),
    });
    const otpJson = await otpRes.json();

    if (otpJson.status) {
      onNext(); 
    } else {
      setError(otpJson.message || "Failed to send OTP.");
    }
  } catch (err) {
    setError("Connection error. Please try again.");
  } finally {
    setLoading(false);
  }
};

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <div className="flex items-center gap-3 px-4 py-4 border-b">
        <button onClick={onBack}>←</button>
        <h1 className="text-base font-semibold text-navy">Registration</h1>
      </div>

      <div className="flex-1 px-4 py-6">
        <div className="mb-5">
            <input
              type="text"
              placeholder="Enter name"
              value={data.name || ""}
              onChange={(e) => setData({ ...data, name: e.target.value })}
              className="w-full px-4 py-3 rounded-xl border border-gray-300 outline-none focus:ring-1 focus:ring-primary"
            />
        </div>

        <div className="mb-5">
          <input
            type="email"
            placeholder="Enter email address"
            value={data.email || ""}
            onChange={(e) => setData({ ...data, email: e.target.value })}
            className="w-full px-4 py-3 rounded-xl border border-gray-300 outline-none focus:ring-1 focus:ring-primary"
          />
        </div>

        <div className="mb-3 flex gap-3">
          <div className="w-[80px] flex items-center justify-center border border-gray-300 rounded-xl bg-gray-50 text-sm">
            🇮🇳 +91
          </div>
          <input
            type="tel"
            maxLength={10}
            placeholder="Mobile number"
            value={data.phone || ""}
            onChange={(e) => setData({ ...data, phone: e.target.value })}
            className="flex-1 px-4 py-3 rounded-xl border border-gray-300 outline-none focus:ring-1 focus:ring-primary"
          />
        </div>

        {/* Display the specific error message here */}
        {error && (
          <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-4 text-xs font-medium border border-red-100">
            {error}
          </div>
        )}
        
        <p className="text-xs text-gray-500">OTP will be sent to this number for verification.</p>
      </div>

      <div className="px-4 py-4 border-t">
        <button
          onClick={handleGetOtp}
          disabled={loading || !data.phone || data.phone.length < 10 || !data.email}
          className={`w-full py-4 rounded-xl font-semibold transition ${
            data.phone?.length === 10 && data.email && !loading
              ? "bg-primary text-white"
              : "bg-gray-200 text-gray-400"
          }`}
        >
          {loading ? "Checking..." : "Get OTP"}
        </button>
      </div>
    </div>
  );
};

export default PhoneOtpStep;