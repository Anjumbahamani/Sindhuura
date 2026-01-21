// import { useNavigate } from "react-router-dom";
// import logo from "../../../../assets/logo.png";
// import React, { useState, useRef, useEffect } from "react";

// const OtpScreen = ({ phone, onVerify,data, setData, onNext, onBack }) => {
//   const navigate = useNavigate();
//   const otpLength = 6; 
//   const [otp, setOtp] = useState(Array(otpLength).fill(""));
//   const inputsRef = useRef([]);

//   useEffect(() => {
//     inputsRef.current[0]?.focus();
//   }, []);

//   const handleChange = (e, idx) => {
//     const val = e.target.value;
//     if (/^[0-9]$/.test(val) || val === "") {
//       const newOtp = [...otp];
//       newOtp[idx] = val;
//       setOtp(newOtp);

//       if (val && idx < otpLength - 1) {
//         inputsRef.current[idx + 1].focus();
//       }
//     }
//   };

//   const handleKeyDown = (e, idx) => {
//     if (e.key === "Backspace" && !otp[idx] && idx > 0) {
//       inputsRef.current[idx - 1].focus();
//     }
//   };

//   const handleSubmit = () => {
//     const otpValue = otp.join("");
//     if (otpValue.length === otpLength) {
//       onVerify(otpValue);
//     }
//   };

//   return (
//     <div className="min-h-screen bg-soft flex items-center justify-center px-4">
//       <div className="w-full max-w-md bg-white rounded-2xl shadow-lg px-8 py-12 text-center">
//         {/* Logo */}
//         <div className="flex justify-center mb-6">
//           <img src={logo} alt="Sindhuura" className="h-20 w-20 object-contain" />
//         </div>

//         {/* Title */}
//         <h1 className="text-2xl font-semibold text-navy mb-2">Enter OTP</h1>
//         <p className="text-sm text-gray-500 mb-8">
//           Enter the OTP sent to <strong>+91 {phone}</strong>
//         </p>

//         {/* OTP Inputs */}
//         <div className="flex justify-center gap-3 mb-8">
//           {otp.map((digit, idx) => (
//             <input
//               key={idx}
//               type="text"
//               maxLength={1}
//               value={digit}
//               onChange={(e) => handleChange(e, idx)}
//               onKeyDown={(e) => handleKeyDown(e, idx)}
//               ref={(el) => (inputsRef.current[idx] = el)}
//               className="w-12 h-12 text-center text-xl border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
//             />
//           ))}
//         </div>

//         {/* Verify Button */}
//         <button
//         //   onClick={handleSubmit}
//               onClick={onNext}
//           disabled={otp.some((d) => !d)}
//           className={`w-full bg-primary text-white py-3 rounded-xl font-semibold text-base transition duration-200 shadow-md mb-4 ${
//             otp.some((d) => !d) ? "bg-gray-200 text-gray-400 cursor-not-allowed" : ""
//           }`}
//         >
//           Verify OTP
//         </button>

//         {/* Resend */}
//         <p className="text-xs text-gray-400">
//           Didn't receive OTP?{" "}
//           <span
//             className="underline cursor-pointer"
//             onClick={() => alert("Resend OTP")}
//           >
//             Resend
//           </span>
//         </p>

//         {/* Back to phone entry */}
//         <p className="text-xs text-gray-400 mt-6">
//           Wrong number?{" "}
//           <span
//             className="underline cursor-pointer"
//             onClick={() => navigate("/register")}
//           >
//             Go back
//           </span>
//         </p>
//       </div>
//     </div>
//   );
// };

// export default OtpScreen;
// steps/Otp.jsx

import React, { useState, useRef, useEffect } from "react";
import logo from "../../../../assets/logo.png";

const OtpScreen = ({ data, setData, phone, onNext, onBack }) => {
  const otpLength = 6;
  const [otp, setOtp] = useState(Array(otpLength).fill(""));
  const inputsRef = useRef([]);

  useEffect(() => {
    inputsRef.current[0]?.focus();
  }, []);

  const handleChange = (e, idx) => {
    const val = e.target.value;
    if (/^[0-9]$/.test(val) || val === "") {
      const newOtp = [...otp];
      newOtp[idx] = val;
      setOtp(newOtp);

      if (val && idx < otpLength - 1) {
        inputsRef.current[idx + 1].focus();
      }
    }
  };

  const handleKeyDown = (e, idx) => {
    if (e.key === "Backspace" && !otp[idx] && idx > 0) {
      inputsRef.current[idx - 1].focus();
    }
  };

  const handleSubmit = () => {
    const otpValue = otp.join("");
    if (otpValue.length === otpLength) {
      // store OTP into main form data (if backend needs it)
      setData((prev) => ({
        ...prev,
        otp: otpValue,
      }));
      onNext();
    }
  };

  return (
    <div className="min-h-screen bg-soft flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg px-8 py-12 text-center">
        {/* Logo */}
        <div className="flex justify-center mb-6">
          <img src={logo} alt="Sindhuura" className="h-20 w-20 object-contain" />
        </div>

        {/* Title */}
        <h1 className="text-2xl font-semibold text-navy mb-2">Enter OTP</h1>
        <p className="text-sm text-gray-500 mb-8">
          Enter the OTP sent to <strong>+91 {phone}</strong>
        </p>

        {/* OTP Inputs */}
        <div className="flex justify-center gap-3 mb-8">
          {otp.map((digit, idx) => (
            <input
              key={idx}
              type="text"
              maxLength={1}
              value={digit}
              onChange={(e) => handleChange(e, idx)}
              onKeyDown={(e) => handleKeyDown(e, idx)}
              ref={(el) => (inputsRef.current[idx] = el)}
              className="w-12 h-12 text-center text-xl border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            />
          ))}
        </div>

        {/* Verify Button */}
        <button
          onClick={handleSubmit}
          disabled={otp.some((d) => !d)}
          className={`w-full bg-primary text-white py-3 rounded-xl font-semibold text-base transition duration-200 shadow-md mb-4 ${
            otp.some((d) => !d)
              ? "bg-gray-200 text-gray-400 cursor-not-allowed"
              : ""
          }`}
        >
          Verify OTP
        </button>

        {/* Resend */}
        <p className="text-xs text-gray-400">
          Didn't receive OTP?{" "}
          <span
            className="underline cursor-pointer"
            onClick={() => alert("Resend OTP")}
          >
            Resend
          </span>
        </p>

        {/* Back to phone entry */}
        <p className="text-xs text-gray-400 mt-6">
          Wrong number?{" "}
          <span
            className="underline cursor-pointer"
            onClick={onBack}
          >
            Go back
          </span>
        </p>
      </div>
    </div>
  );
};

export default OtpScreen;