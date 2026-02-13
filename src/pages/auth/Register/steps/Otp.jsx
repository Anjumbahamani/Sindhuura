
import React, { useState, useRef, useEffect } from "react";
import logo from "../../../../assets/logo.png";

const OtpScreen = ({ data, setData, onNext, onBack }) => {
  const otpLength = 6;
  const [otp, setOtp] = useState(Array(otpLength).fill(""));
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [timer, setTimer] = useState(30);
  const inputsRef = useRef([]);

  useEffect(() => {
    inputsRef.current[0]?.focus();
    // Countdown timer for Resend
    const interval = setInterval(() => {
      setTimer((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
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

  const handleVerify = async () => {
    const otpValue = otp.join("");
    if (otpValue.length !== otpLength) return;

    setLoading(true);
    setError("");
    const fullPhone = `+91${data.phone}`;

    try {
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/auth/verify-otp/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone_number: fullPhone, otp: otpValue }),
      });
      const json = await res.json();

      if (json.status) {
        setData((prev) => ({ ...prev, otp: otpValue }));
        onNext(); // Proceed to next registration step
      } else {
        setError(json.message || "Invalid OTP. Please try again.");
      }
    } catch (err) {
      setError("Verification failed. Check your connection.");
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (timer > 0) return;
    setError("");
    setTimer(30);
    const fullPhone = `+91${data.phone}`;

    try {
      await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/auth/resend-otp/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone_number: fullPhone }),
      });
    } catch (err) {
      setError("Failed to resend OTP.");
    }
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-4">
      <div className="w-full max-w-md text-center">
        <div className="flex justify-center mb-6">
          <img src={logo} alt="Sindhuura" className="h-16 w-16 object-contain" />
        </div>

        <h1 className="text-2xl font-semibold text-navy mb-2">Verify Phone</h1>
        <p className="text-sm text-gray-500 mb-8">
          Enter the code sent to <strong>+91 {data.phone}</strong>
        </p>

        <div className="flex justify-center gap-2 mb-6">
          {otp.map((digit, idx) => (
            <input
              key={idx}
              type="text"
              maxLength={1}
              value={digit}
              onChange={(e) => handleChange(e, idx)}
              onKeyDown={(e) => handleKeyDown(e, idx)}
              ref={(el) => (inputsRef.current[idx] = el)}
              className="w-11 h-12 text-center text-xl font-bold border border-gray-300 rounded-xl focus:border-primary focus:ring-1 focus:ring-primary outline-none"
            />
          ))}
        </div>

        {error && <p className="text-xs text-red-500 mb-4 font-medium">{error}</p>}

        <button
          onClick={handleVerify}
          disabled={loading || otp.some((d) => !d)}
          className={`w-full py-3.5 rounded-xl font-semibold text-base transition shadow-md mb-6 ${
            otp.some((d) => !d) || loading
              ? "bg-gray-200 text-gray-400 cursor-not-allowed"
              : "bg-primary text-white"
          }`}
        >
          {loading ? "Verifying..." : "Verify & Continue"}
        </button>

        <p className="text-xs text-gray-400">
          Didn't receive OTP?{" "}
          <button 
            disabled={timer > 0}
            onClick={handleResend}
            className={`font-bold underline ${timer > 0 ? 'text-gray-300' : 'text-primary'}`}
          >
            {timer > 0 ? `Resend in ${timer}s` : "Resend Now"}
          </button>
        </p>

        <button onClick={onBack} className="text-xs text-primary font-bold mt-8 underline">
           Change phone number
        </button>
      </div>
    </div>
  );
};

export default OtpScreen;