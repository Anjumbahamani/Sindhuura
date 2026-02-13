import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { FiLock, FiShield, FiArrowLeft } from "react-icons/fi";

const ResetPassword = () => {
  const navigate = useNavigate();
  const { state } = useLocation();
  const phone = state?.phone || "";

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({ otp: "", newPassword: "", confirmPassword: "" });

  const handleReset = async (e) => {
    e.preventDefault();
    if (form.newPassword !== form.confirmPassword) {
      return setError("Passwords do not match.");
    }

    setLoading(true);
    setError("");

    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/auth/reset-password/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          phone_number: phone,
          otp: form.otp,
          new_password: form.newPassword,
          confirm_password: form.confirmPassword,
        }),
      });

      const data = await response.json();

      if (data.status) {
        alert("Password reset successful! Please login.");
        navigate("/login");
      } else {
        setError(data.message || "Invalid OTP or request.");
      }
    } catch (err) {
      setError("Failed to reset password. Please try again.");
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
        <h1 className="text-lg font-bold text-navy">Reset Password</h1>
      </div>

      <div className="flex-1 px-6 py-10">
        <p className="text-sm text-gray-500 mb-8">
          Verify your phone number <span className="text-navy font-bold">{phone}</span> by entering the OTP and your new password.
        </p>

        <form onSubmit={handleReset} className="space-y-5">
          <div className="relative">
            <FiShield className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              required
              maxLength={6}
              type="text"
              placeholder="6-Digit OTP"
              className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:border-primary text-center font-bold tracking-[10px] text-lg"
              value={form.otp}
              onChange={(e) => setForm({ ...form, otp: e.target.value.replace(/\D/g, "") })}
            />
          </div>

          <div className="relative">
            <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              required
              type="password"
              placeholder="New Password"
              className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:border-primary text-sm"
              value={form.newPassword}
              onChange={(e) => setForm({ ...form, newPassword: e.target.value })}
            />
          </div>

          <div className="relative">
            <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              required
              type="password"
              placeholder="Confirm New Password"
              className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:border-primary text-sm"
              value={form.confirmPassword}
              onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
            />
          </div>

          {error && <p className="text-xs text-red-500 text-center font-medium">{error}</p>}

          <button
            disabled={loading}
            className="w-full bg-primary text-white py-4 rounded-2xl font-bold shadow-lg shadow-primary/20 transition active:scale-95 disabled:bg-gray-300"
          >
            {loading ? "Updating Password..." : "Update Password"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;