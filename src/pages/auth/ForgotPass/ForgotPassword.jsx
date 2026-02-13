import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiArrowLeft, FiMail, FiPhone } from "react-icons/fi";
import logo from "../../../assets/logo.png"

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({ email: "", phone: "" });

   const handleRequestOtp = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    // 1. Clean data: Remove all spaces and non-digits from phone
    const cleanEmail = form.email.trim().toLowerCase();
    const cleanPhone = form.phone.replace(/\D/g, "").trim(); 

    // Log this to confirm it matches exactly '9686054945'
    console.log("Requesting with:", { phone_number: cleanPhone, email: cleanEmail });

    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/auth/forgot-password/`, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
        body: JSON.stringify({
          phone_number: cleanPhone, // No +91 here based on your Login API response
          email: cleanEmail,
        }),
      });

      const data = await response.json();
      console.log("Server response:", data);

      if (response.ok && data.status) {
        // IMPORTANT: Pass the phone number to Reset screen
        navigate("/resetpass", { state: { phone: cleanPhone } });
      } else {
        // The server returned 400 - "Phone number not found"
        // This means the email + phone combination doesn't exist in DB
        const errorMsg = data.message || "No user found with this email and phone combination.";
        setError(errorMsg.replace("non_field_errors: ", ""));
      }
    } catch (err) {
      console.error("Fetch Error:", err);
      setError("Network error. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <div className="px-4 py-4 flex items-center gap-4">
        <button onClick={() => navigate(-1)} className="p-2 rounded-full bg-gray-50">
          <FiArrowLeft className="w-5 h-5 text-navy" />
        </button>
        <h1 className="text-lg font-bold text-navy">Forgot Password</h1>
      </div>

      <div className="flex-1 px-6 py-10">
        <div className="text-center mb-10">
          <img src={logo} alt="Sindhuura" className="h-20 w-20 mx-auto mb-4" />
          <p className="text-gray-500 text-sm">
            Enter your registered email and phone number to reset your password.
          </p>
        </div>

        <form onSubmit={handleRequestOtp} className="space-y-5">
          <div className="relative">
            <FiMail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              required
              type="email"
              placeholder="Email Address"
              className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:border-primary text-sm"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />
          </div>

          <div className="flex gap-2">
            <div className="w-20 bg-gray-50 border border-gray-100 rounded-2xl flex items-center justify-center text-sm text-gray-500">
              +91
            </div>
            <div className="flex-1 relative">
              <FiPhone className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                required
                maxLength={10}
                type="tel"
                placeholder="Phone Number"
                className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:border-primary text-sm"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value.replace(/\D/g, "") })}
              />
            </div>
          </div>

          {error && <p className="text-xs text-red-500 text-center">{error}</p>}

          <button
            disabled={loading}
            className="w-full bg-primary text-white py-4 rounded-2xl font-bold shadow-lg shadow-primary/20 transition active:scale-95 disabled:bg-gray-300"
          >
            {loading ? "Sending OTP..." : "Get Verification Code"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ForgotPassword;