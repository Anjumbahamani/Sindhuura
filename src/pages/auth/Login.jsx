// import { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import logo from "../../assets/logo.png";

// const Login = () => {
//   const [showPassword, setShowPassword] = useState(false);
//   const navigate = useNavigate();

//   return (
//     <div className="min-h-screen bg-soft flex items-center justify-center px-4">
//       <div className="w-full max-w-md bg-white rounded-2xl shadow-lg px-8 py-10">

//         {/* Logo */}
//         <div className="flex justify-center mb-6">
//           <img
//             src={logo}
//             alt="Sindhuura"
//             className="h-20 w-20 object-contain"
//           />
//         </div>

//         {/* Title */}
//         <h1 className="text-2xl font-semibold text-center text-navy">
//           Welcome Back
//         </h1>
//         <p className="text-sm text-center text-gray-500 mt-1 mb-8">
//           Sign in to continue your journey
//         </p>

//         {/* Email */}
//         <div className="mb-5">
//           <label className="block text-sm font-medium text-navy mb-1">
//             Email address
//           </label>
//           <input
//             type="email"
//             placeholder="you@example.com"
//             className="w-full px-4 py-3 rounded-xl border border-gray-200
//                        focus:outline-none focus:ring-2 focus:ring-primary transition"
//           />
//         </div>

//         {/* Password */}
//         <div className="mb-3">
//           <label className="block text-sm font-medium text-navy mb-1">
//             Password
//           </label>
//           <div className="relative">
//             <input
//               type={showPassword ? "text" : "password"}
//               placeholder="Enter your password"
//               className="w-full px-4 py-3 rounded-xl border border-gray-200
//                          focus:outline-none focus:ring-2 focus:ring-primary transition"
//             />
//             <button
//               type="button"
//               onClick={() => setShowPassword(!showPassword)}
//               className="absolute right-4 top-1/2 -translate-y-1/2
//                          text-sm text-gray-400 hover:text-primary"
//             >
//               {showPassword ? "Hide" : "Show"}
//             </button>
//           </div>
//         </div>

//         {/* Forgot password */}
//         <div className="text-right mb-6">
//           <button
//             className="text-sm text-primary hover:underline font-semibold"
//             onClick={() => navigate("/forgot-password")}
//           >
//             Forgot password?
//           </button>
//         </div>

//         {/* Sign In */}
//         <button
//           onClick={() => navigate("/home")}
//           className="w-full bg-primary hover:bg-red-600
//                      text-white py-3 rounded-xl
//                      font-semibold transition shadow-md"
//         >
//           Sign In
//         </button>

//         {/* Divider */}
//         <div className="flex items-center gap-3 my-6">
//           <div className="flex-1 h-px bg-gray-200" />
//           <span className="text-xs text-gray-400">OR</span>
//           <div className="flex-1 h-px bg-gray-200" />
//         </div>

//         {/* Create Profile */}
//         <p className="text-center text-sm text-gray-600">
//           Don&apos;t have an account?{" "}
//           <span
//             onClick={() => navigate("/register")}
//             className="text-primary font-semibold cursor-pointer hover:underline"
//           >
//             Create profile
//           </span>
//         </p>

//       </div>
//     </div>
//   );
// };

// export default Login;
// src/pages/Login.jsx (adjust path as needed)

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import logo from "../../assets/logo.png";
import { loginUser } from "../../services/auth.service";  // adjust path if needed
import { useAuth } from "../../context/AuthProvider";     // adjust path if needed

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();
  const { login } = useAuth(); // from AuthProvider

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await loginUser({ email, password });
      console.log("✅ Login success:", res);

      const data = res?.response || {};
      const token = data.access_token || null;
      const user = data.user || null;

      if (!token) {
        setError("Login succeeded but no token returned.");
        return;
      }
    // 1) Save to localStorage so other screens can use it
    localStorage.setItem("token", token);


    

      // Save into context + localStorage
      login(user, token);
      console.log("🔐 Token stored after login:", token);

      // Navigate to your home/dashboard route
      navigate("/home");
    } catch (err) {
      console.error("❌ Login failed:", err);
      const msg =
        typeof err === "string"
          ? err
          : err?.detail ||
            err?.message ||
            "Invalid email or password.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-soft flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg px-8 py-10">
        {/* Logo */}
        <div className="flex justify-center mb-6">
          <img
            src={logo}
            alt="Sindhuura"
            className="h-20 w-20 object-contain"
          />
        </div>

        {/* Title */}
        <h1 className="text-2xl font-semibold text-center text-navy">
          Welcome Back
        </h1>
        <p className="text-sm text-center text-gray-500 mt-1 mb-8">
          Sign in to continue your journey
        </p>

        {/* Form */}
        <form onSubmit={handleSubmit}>
          {/* Email */}
          <div className="mb-5">
            <label className="block text-sm font-medium text-navy mb-1">
              Email address
            </label>
            <input
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-gray-200
                         focus:outline-none focus:ring-2 focus:ring-primary transition"
              required
            />
          </div>

          {/* Password */}
          <div className="mb-3">
            <label className="block text-sm font-medium text-navy mb-1">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-gray-200
                           focus:outline-none focus:ring-2 focus:ring-primary transition"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2
                           text-sm text-gray-400 hover:text-primary"
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>
          </div>

          {/* Forgot password */}
          <div className="text-right mb-4">
            <button
              type="button"
              className="text-sm text-primary hover:underline font-semibold"
              onClick={() => navigate("/forgot-password")}
            >
              Forgot password?
            </button>
          </div>

          {/* Error */}
          {error && (
            <p className="text-sm text-red-500 mb-3 text-center">{error}</p>
          )}

          {/* Sign In */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary hover:bg-red-600
                       text-white py-3 rounded-xl
                       font-semibold transition shadow-md disabled:opacity-60"
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>

        {/* Divider */}
        <div className="flex items-center gap-3 my-6">
          <div className="flex-1 h-px bg-gray-200" />
          <span className="text-xs text-gray-400">OR</span>
          <div className="flex-1 h-px bg-gray-200" />
        </div>

        {/* Create Profile */}
        <p className="text-center text-sm text-gray-600">
          Don&apos;t have an account?{" "}
          <span
            onClick={() => navigate("/register")}
            className="text-primary font-semibold cursor-pointer hover:underline"
          >
            Create profile
          </span>
        </p>
      </div>
    </div>
  );
};

export default Login;