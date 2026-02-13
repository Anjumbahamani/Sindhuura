import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiArrowLeft, FiAlertTriangle } from "react-icons/fi";

const DeleteAccount = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleRequestOtp = async () => {
    if (phone.length < 10) return alert("Enter a valid 10-digit phone number");
    
    setLoading(true);
    setError("");
    
    try {
      // 1. You must actually trigger the OTP sending API first
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/auth/send-otp/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          // Use +91 only if your send-otp API specifically requires it
          phone_number: `+91${phone}` 
        }),
      });
      
      const data = await response.json();
      if (data.status) {
        setStep(2);
      } else {
        setError(data.message || "Failed to send OTP");
      }
    } catch (err) {
      setError("Failed to connect to server");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    setLoading(true);
    setError("");
    
    const token = localStorage.getItem("token"); // Get token for auth

    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/auth/delete-account/`, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}` // Add Authorization header
        },
        body: JSON.stringify({
          // Try sending WITHOUT +91 if your Login API showed numbers are stored as 10 digits
          phone_number: phone, 
          otp: otp,
        }),
      });

      const data = await response.json();
      
      if (data.status) {
        alert("Your account has been permanently deleted.");
        localStorage.clear();
        sessionStorage.clear();
        navigate("/login", { replace: true });
      } else {
        setError(data.message || "Invalid OTP or request failed.");
      }
    } catch (err) {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white max-w-md mx-auto flex flex-col">
      <header className="flex items-center gap-3 px-4 py-4 border-b">
        <button onClick={() => navigate(-1)} className="p-2"><FiArrowLeft /></button>
        <h1 className="font-semibold text-navy">Delete Account</h1>
      </header>
      
      <div className="p-6 text-center flex-1">
        <div className="bg-red-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
            <FiAlertTriangle className="w-10 h-10 text-red-500" />
        </div>
        
        <h2 className="text-xl font-bold text-navy mb-2">
            {step === 1 ? "Wait! Are you sure?" : "Verify Deletion"}
        </h2>
        <p className="text-sm text-gray-500 mb-8">
            {step === 1 
              ? "Deleting your account is permanent. You will lose all your matches, messages, and profile data forever." 
              : `Enter the 6-digit code sent to ${phone}`}
        </p>
        
        {step === 1 ? (
          <div className="space-y-4">
            <div className="flex gap-2">
                <div className="w-16 border rounded-2xl flex items-center justify-center bg-gray-50 text-sm text-gray-400">+91</div>
                <input 
                type="tel" placeholder="Mobile Number" 
                maxLength={10}
                className="flex-1 border p-4 rounded-2xl outline-none focus:border-red-500 transition"
                value={phone} onChange={(e) => setPhone(e.target.value.replace(/\D/g, ""))}
                />
            </div>
            <button 
                onClick={handleRequestOtp} 
                disabled={loading || phone.length < 10}
                className="w-full bg-red-500 text-white py-4 rounded-2xl font-bold disabled:bg-gray-200"
            >
                {loading ? "Sending..." : "Request Delete OTP"}
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            <input 
              type="text" placeholder="Enter OTP" 
              maxLength={6}
              className="w-full border p-4 rounded-2xl text-center tracking-[10px] text-xl font-bold outline-none focus:border-red-500"
              value={otp} onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
            />
            {error && <p className="text-red-500 text-xs font-semibold">{error}</p>}
            <button 
                onClick={handleDelete} 
                disabled={loading || otp.length < 6} 
                className="w-full bg-black text-white py-4 rounded-2xl font-bold disabled:bg-gray-400"
            >
              {loading ? "Deleting..." : "Permanently Delete"}
            </button>
            <button onClick={() => setStep(1)} className="text-xs text-gray-400 underline">Change phone number</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default DeleteAccount;