// import React, { useState } from "react";

// /* ---------- DOB OPTIONS ---------- */
// const DAYS = Array.from({ length: 31 }, (_, i) => i + 1);

// const MONTHS = [
//   "Jan",
//   "Feb",
//   "Mar",
//   "Apr",
//   "May",
//   "Jun",
//   "Jul",
//   "Aug",
//   "Sep",
//   "Oct",
//   "Nov",
//   "Dec",
// ];

// const YEARS = Array.from({ length: 2007 - 1954 + 1 }, (_, i) => 2007 - i);

// /* ---------- HEIGHT OPTIONS ---------- */
// const generateHeights = () => {
//   const heights = [];

//   // from 4 ft 6 in to 7 ft 0 in
//   for (let totalInches = 54; totalInches <= 84; totalInches++) {
//     const feet = Math.floor(totalInches / 12);
//     const inches = totalInches % 12;
//     const cm = Math.round(totalInches * 2.54);

//     heights.push(`${feet} ft ${inches} in (${cm} cm)`);
//   }

//   return heights;
// };

// const HEIGHTS = generateHeights();

// const SHOW_CHILD_FIELDS = ["Divorced", "Awaiting divorce", "Widow"];

// const PersonalDetailsStep = ({ data, setData, onNext, onBack }) => {
//   const [local, setLocal] = useState({
//     gender: "Female",
//     dobDay: "19",
//     dobMonth: "Jan",
//     dobYear: "",
//     height: "5 ft 2 in (157 cm)",
//     physicalStatus: "Normal",
//     maritalStatus: "Never married",

//     childrenCount: "",
//     childrenLivingTogether: "",
//   });
// const [email, setEmail] = useState(data.email || "");
//   const [password, setPassword] = useState("");
//   const [confirmPassword, setConfirmPassword] = useState("");
//   const [heightDrawer, setHeightDrawer] = useState(false);

// const isPasswordValid =
//   password.length >= 8 && password === confirmPassword;

// const handleNext = () => {
//   if (!isPasswordValid) return;

//   setData(prev => ({
//     ...prev,
//     email,
//     password,
//     confirm_password: confirmPassword,
//     personalDetails: local,
//   }));

//   onNext();
// };


//   const hasChildrenSection = SHOW_CHILD_FIELDS.includes(local.maritalStatus);
//   const hasChildren = local.childrenCount && local.childrenCount !== "None";

//   return (
//     <div className="min-h-screen bg-white flex flex-col">
//       {/* ---------- HEADER ---------- */}
//       <div className="flex items-center gap-3 px-4 py-4 border-b">
//         <button onClick={onBack}>←</button>
//         <h1 className="text-base font-semibold text-navy">
//           Personal Details (1/5)
//         </h1>
//       </div>

//       {/* ---------- CONTENT ---------- */}
//       <div className="flex-1 overflow-y-auto px-4 py-6 space-y-6">


//         {/* Email */}
//         <div>
//           <p className="text-sm font-medium mb-2">Email address</p>
//           <input
//             type="email"
//             value={email}
//             onChange={(e) => setEmail(e.target.value)}
//             placeholder="Enter email"
//             className="w-full px-4 py-3 border rounded-xl
//                        focus:ring-2 focus:ring-primary outline-none"
//           />
//         </div>

//         {/* Password */}
//         <div>
//           <p className="text-sm font-medium mb-2">Password</p>
//           <input
//             type="password"
//             value={password}
//             onChange={(e) => setPassword(e.target.value)}
//             placeholder="Minimum 6 characters"
//             className="w-full px-4 py-3 border rounded-xl
//                        focus:ring-2 focus:ring-primary outline-none"
//           />
//         </div>

//         {/* Confirm Password */}
//         <div>
//           <p className="text-sm font-medium mb-2">Confirm password</p>
//           <input
//             type="password"
//             value={confirmPassword}
//             onChange={(e) => setConfirmPassword(e.target.value)}
//             placeholder="Re-enter password"
//             className="w-full px-4 py-3 border rounded-xl
//                        focus:ring-2 focus:ring-primary outline-none"
//           />
//           {confirmPassword && !isPasswordValid && (
//             <p className="text-xs text-red-500 mt-1">
//               Passwords do not match
//             </p>
//           )}
//         </div>

//         {/* Gender */}
//         <div>
//           <p className="text-sm font-medium mb-2">Select gender</p>
//           <div className="flex gap-3">
//             {["Male", "Female"].map((g) => (
//               <button
//                 key={g}
//                 onClick={() => setLocal({ ...local, gender: g })}
//                 className={`flex-1 py-3 rounded-full border text-sm font-medium
//                   ${
//                     local.gender === g
//                       ? "bg-primary text-white border-red-600"
//                       : "border-gray-300 text-gray-700"
//                   }`}
//               >
//                 {g}
//               </button>
//             ))}
//           </div>
//         </div>

//         {/* Date of Birth */}
//         <div>
//           <p className="text-sm font-medium mb-2">Date of birth</p>
//           <div className="flex gap-3">
//             <select
//               value={local.dobDay}
//               onChange={(e) => setLocal({ ...local, dobDay: e.target.value })}
//               className="flex-1 border rounded-xl px-3 py-3"
//             >
//               {DAYS.map((d) => (
//                 <option key={d} value={d}>
//                   {d}
//                 </option>
//               ))}
//             </select>

//             <select
//               value={local.dobMonth}
//               onChange={(e) => setLocal({ ...local, dobMonth: e.target.value })}
//               className="flex-1 border rounded-xl px-3 py-3"
//             >
//               {MONTHS.map((m) => (
//                 <option key={m} value={m}>
//                   {m}
//                 </option>
//               ))}
//             </select>

//             <select
//               value={local.dobYear}
//               onChange={(e) => setLocal({ ...local, dobYear: e.target.value })}
//               className="flex-1 border rounded-xl px-3 py-3"
//             >
//               {YEARS.map((y) => (
//                 <option key={y} value={y}>
//                   {y}
//                 </option>
//               ))}
//             </select>
//           </div>
//         </div>

//         {/* Height */}
//         <div>
//           <p className="text-sm font-medium mb-2">Height</p>
//           <button
//             onClick={() => setHeightDrawer(true)}
//             className="w-full flex justify-between items-center
//                        px-4 py-4 border rounded-xl text-base"
//           >
//             <span>{local.height}</span>
//             <span className="text-gray-400">›</span>
//           </button>
//         </div>

//         {/* Physical Status */}
//         <div>
//           <p className="text-sm font-medium mb-2">Physical status</p>
//           <div className="flex gap-3">
//             {["Normal", "Physically challenged"].map((s) => (
//               <button
//                 key={s}
//                 onClick={() => setLocal({ ...local, physicalStatus: s })}
//                 className={`flex-1 py-3 rounded-full border text-sm font-medium
//                   ${
//                     local.physicalStatus === s
//                       ? "bg-primary text-white border-red-600"
//                       : "border-gray-300 text-gray-700"
//                   }`}
//               >
//                 {s}
//               </button>
//             ))}
//           </div>
//         </div>

//         {/* Marital Status */}
//         <div>
//           <p className="text-sm font-medium mb-2">Marital status</p>
//           <div className="flex flex-wrap gap-3">
//             {["Never married", "Awaiting divorce", "Divorced", "Widow"].map(
//               (s) => (
//                 <button
//                   key={s}
//                   onClick={() =>
//                     setLocal({
//                       ...local,
//                       maritalStatus: s,
//                       childrenCount: "",
//                       childrenLivingTogether: "",
//                     })
//                   }
//                   className={`px-5 py-2.5 rounded-full border text-sm font-medium
//                     ${
//                       local.maritalStatus === s
//                         ? "bg-primary text-white border-red-600"
//                         : "border-gray-300 text-gray-700"
//                     }`}
//                 >
//                   {s}
//                 </button>
//               )
//             )}
//           </div>
//         </div>

//         {/* ✅ Number of Children */}
//         {hasChildrenSection && (
//           <div>
//             <p className="text-sm font-medium mb-2">Number of children</p>
//             <div className="flex flex-wrap gap-3">
//               {["None", "1", "2", "3", "4+"].map((c) => (
//                 <button
//                   key={c}
//                   onClick={() =>
//                     setLocal({
//                       ...local,
//                       childrenCount: c,
//                       childrenLivingTogether: "",
//                     })
//                   }
//                   className={`px-5 py-2.5 rounded-full border text-sm font-medium
//                     ${
//                       local.childrenCount === c
//                         ? "bg-primary text-white border-red-600"
//                         : "border-gray-300 text-gray-700"
//                     }`}
//                 >
//                   {c}
//                 </button>
//               ))}
//             </div>
//           </div>
//         )}

//         {/* ✅ Children living together */}
//         {hasChildren && (
//           <div>
//             <p className="text-sm font-medium mb-2">
//               Children living together?
//             </p>
//             <div className="flex gap-3">
//               {["Yes", "No"].map((v) => (
//                 <button
//                   key={v}
//                   onClick={() =>
//                     setLocal({ ...local, childrenLivingTogether: v })
//                   }
//                   className={`flex-1 py-3 rounded-full border text-sm font-medium
//                     ${
//                       local.childrenLivingTogether === v
//                         ? "bg-primary text-white border-red-600"
//                         : "border-gray-300 text-gray-700"
//                     }`}
//                 >
//                   {v}
//                 </button>
//               ))}
//             </div>
//           </div>
//         )}
//       </div>

//       {/* ---------- FOOTER CTA ---------- */}
//       <div className="px-4 py-4 border-t">
//         <button
//           onClick={handleNext}
//           className="w-full bg-primary text-white py-4 rounded-xl
//                      font-semibold text-base"
//         >
//           Next
//         </button>

//         <p className="text-xs text-center text-gray-400 mt-3">
//           Need help? Call <span className="font-medium">8144-99-88-77</span>
//         </p>
//       </div>

//       {/* ---------- HEIGHT DRAWER ---------- */}
//       {heightDrawer && (
//         <div className="fixed inset-0 z-50 bg-black/40">
//           <div
//             className="absolute right-0 top-0 h-full w-[90%]
//                           bg-white shadow-lg flex flex-col"
//           >
//             <div className="px-4 py-4 border-b flex justify-between items-center">
//               <h3 className="text-base font-semibold">Select height</h3>
//               <button onClick={() => setHeightDrawer(false)}>✕</button>
//             </div>

//             <div className="flex-1 overflow-y-auto">
//               {HEIGHTS.map((h) => (
//                 <button
//                   key={h}
//                   onClick={() => {
//                     setLocal({ ...local, height: h });
//                     setHeightDrawer(false);
//                   }}
//                   className={`w-full text-left px-5 py-4 border-b
//                     ${
//                       local.height === h
//                         ? "bg-green-100 text-green-800"
//                         : "text-gray-700"
//                     }`}
//                 >
//                   {h}
//                 </button>
//               ))}
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default PersonalDetailsStep;
// steps/PersonalDetail.jsx

import React, { useState } from "react";

/* ---------- DOB OPTIONS ---------- */
const DAYS = Array.from({ length: 31 }, (_, i) => i + 1);

const MONTHS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

const YEARS = Array.from({ length: 2007 - 1954 + 1 }, (_, i) => 2007 - i);

/* ---------- HEIGHT OPTIONS ---------- */
const generateHeights = () => {
  const heights = [];

  for (let totalInches = 54; totalInches <= 84; totalInches++) {
    const feet = Math.floor(totalInches / 12);
    const inches = totalInches % 12;
    const cm = Math.round(totalInches * 2.54);

    heights.push(`${feet} ft ${inches} in (${cm} cm)`);
  }

  return heights;
};

const HEIGHTS = generateHeights();

const SHOW_CHILD_FIELDS = ["Divorced", "Awaiting divorce", "Widow"];

const PersonalDetailsStep = ({ data, setData, onNext, onBack }) => {
  const initialPersonal = data.personalDetails || {
    gender: "Female",
    dobDay: "19",
    dobMonth: "Jan",
    dobYear: "",
    height: "5 ft 2 in (157 cm)",
    physicalStatus: "Normal",
    maritalStatus: "Never married",
    childrenCount: "",
    childrenLivingTogether: "",
  };

  const [local, setLocal] = useState(initialPersonal);

  const [email, setEmail] = useState(data.email || "");
  const [password, setPassword] = useState(data.password || "");
  const [confirmPassword, setConfirmPassword] = useState(
    data.confirm_password || ""
  );
  const [heightDrawer, setHeightDrawer] = useState(false);

  const isPasswordValid =
    password.length >= 8 && password === confirmPassword;

  const handleNext = () => {
    if (!isPasswordValid) return;

    setData((prev) => ({
      ...prev,
      email,
      password,
      confirm_password: confirmPassword,
      personalDetails: local,
    }));

    onNext();
  };

  const hasChildrenSection = SHOW_CHILD_FIELDS.includes(local.maritalStatus);
  const hasChildren =
    local.childrenCount && local.childrenCount !== "None";

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* ---------- HEADER ---------- */}
      <div className="flex items-center gap-3 px-4 py-4 border-b">
        <button onClick={onBack}>←</button>
        <h1 className="text-base font-semibold text-navy">
          Personal Details (1/5)
        </h1>
      </div>

      {/* ---------- CONTENT ---------- */}
      <div className="flex-1 overflow-y-auto px-4 py-6 space-y-6">
        {/* Email */}
        <div>
          <p className="text-sm font-medium mb-2">Email address</p>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter email"
            className="w-full px-4 py-3 border rounded-xl
                       focus:ring-2 focus:ring-primary outline-none"
          />
        </div>

        {/* Password */}
        <div>
          <p className="text-sm font-medium mb-2">Password</p>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Minimum 8 characters"
            className="w-full px-4 py-3 border rounded-xl
                       focus:ring-2 focus:ring-primary outline-none"
          />
        </div>

        {/* Confirm Password */}
        <div>
          <p className="text-sm font-medium mb-2">Confirm password</p>
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Re-enter password"
            className="w-full px-4 py-3 border rounded-xl
                       focus:ring-2 focus:ring-primary outline-none"
          />
          {confirmPassword && !isPasswordValid && (
            <p className="text-xs text-red-500 mt-1">
              Passwords do not match
            </p>
          )}
        </div>

        {/* Gender */}
        <div>
          <p className="text-sm font-medium mb-2">Select gender</p>
          <div className="flex gap-3">
            {["Male", "Female"].map((g) => (
              <button
                key={g}
                onClick={() => setLocal({ ...local, gender: g })}
                className={`flex-1 py-3 rounded-full border text-sm font-medium
                  ${
                    local.gender === g
                      ? "bg-primary text-white border-red-600"
                      : "border-gray-300 text-gray-700"
                  }`}
              >
                {g}
              </button>
            ))}
          </div>
        </div>

        {/* Date of Birth */}
        <div>
          <p className="text-sm font-medium mb-2">Date of birth</p>
          <div className="flex gap-3">
            <select
              value={local.dobDay}
              onChange={(e) =>
                setLocal({ ...local, dobDay: e.target.value })
              }
              className="flex-1 border rounded-xl px-3 py-3"
            >
              {DAYS.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>

            <select
              value={local.dobMonth}
              onChange={(e) =>
                setLocal({ ...local, dobMonth: e.target.value })
              }
              className="flex-1 border rounded-xl px-3 py-3"
            >
              {MONTHS.map((m) => (
                <option key={m} value={m}>
                  {m}
                </option>
              ))}
            </select>

            <select
              value={local.dobYear}
              onChange={(e) =>
                setLocal({ ...local, dobYear: e.target.value })
              }
              className="flex-1 border rounded-xl px-3 py-3"
            >
              {YEARS.map((y) => (
                <option key={y} value={y}>
                  {y}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Height */}
        <div>
          <p className="text-sm font-medium mb-2">Height</p>
          <button
            onClick={() => setHeightDrawer(true)}
            className="w-full flex justify-between items-center
                       px-4 py-4 border rounded-xl text-base"
          >
            <span>{local.height}</span>
            <span className="text-gray-400">›</span>
          </button>
        </div>

        {/* Physical Status */}
        <div>
          <p className="text-sm font-medium mb-2">Physical status</p>
          <div className="flex gap-3">
            {["Normal", "Physically challenged"].map((s) => (
              <button
                key={s}
                onClick={() =>
                  setLocal({ ...local, physicalStatus: s })
                }
                className={`flex-1 py-3 rounded-full border text-sm font-medium
                  ${
                    local.physicalStatus === s
                      ? "bg-primary text-white border-red-600"
                      : "border-gray-300 text-gray-700"
                  }`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        {/* Marital Status */}
        <div>
          <p className="text-sm font-medium mb-2">Marital status</p>
          <div className="flex flex-wrap gap-3">
            {["Never married", "Awaiting divorce", "Divorced", "Widow"].map(
              (s) => (
                <button
                  key={s}
                  onClick={() =>
                    setLocal({
                      ...local,
                      maritalStatus: s,
                      childrenCount: "",
                      childrenLivingTogether: "",
                    })
                  }
                  className={`px-5 py-2.5 rounded-full border text-sm font-medium
                    ${
                      local.maritalStatus === s
                        ? "bg-primary text-white border-red-600"
                        : "border-gray-300 text-gray-700"
                    }`}
                >
                  {s}
                </button>
              )
            )}
          </div>
        </div>

        {/* Number of Children */}
        {hasChildrenSection && (
          <div>
            <p className="text-sm font-medium mb-2">
              Number of children
            </p>
            <div className="flex flex-wrap gap-3">
              {["None", "1", "2", "3", "4+"].map((c) => (
                <button
                  key={c}
                  onClick={() =>
                    setLocal({
                      ...local,
                      childrenCount: c,
                      childrenLivingTogether: "",
                    })
                  }
                  className={`px-5 py-2.5 rounded-full border text-sm font-medium
                    ${
                      local.childrenCount === c
                        ? "bg-primary text-white border-red-600"
                        : "border-gray-300 text-gray-700"
                    }`}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Children living together */}
        {hasChildren && (
          <div>
            <p className="text-sm font-medium mb-2">
              Children living together?
            </p>
            <div className="flex gap-3">
              {["Yes", "No"].map((v) => (
                <button
                  key={v}
                  onClick={() =>
                    setLocal({ ...local, childrenLivingTogether: v })
                  }
                  className={`flex-1 py-3 rounded-full border text-sm font-medium
                    ${
                      local.childrenLivingTogether === v
                        ? "bg-primary text-white border-red-600"
                        : "border-gray-300 text-gray-700"
                    }`}
                >
                  {v}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* ---------- FOOTER CTA ---------- */}
      <div className="px-4 py-4 border-t">
        <button
          onClick={handleNext}
          className="w-full bg-primary text-white py-4 rounded-xl
                     font-semibold text-base"
        >
          Next
        </button>

        <p className="text-xs text-center text-gray-400 mt-3">
          Need help? Call <span className="font-medium">8144-99-88-77</span>
        </p>
      </div>

      {/* ---------- HEIGHT DRAWER ---------- */}
      {heightDrawer && (
        <div className="fixed inset-0 z-50 bg-black/40">
          <div
            className="absolute right-0 top-0 h-full w-[90%]
                          bg-white shadow-lg flex flex-col"
          >
            <div className="px-4 py-4 border-b flex justify-between items-center">
              <h3 className="text-base font-semibold">Select height</h3>
              <button onClick={() => setHeightDrawer(false)}>✕</button>
            </div>

            <div className="flex-1 overflow-y-auto">
              {HEIGHTS.map((h) => (
                <button
                  key={h}
                  onClick={() => {
                    setLocal({ ...local, height: h });
                    setHeightDrawer(false);
                  }}
                  className={`w-full text-left px-5 py-4 border-b
                    ${
                      local.height === h
                        ? "bg-green-100 text-green-800"
                        : "text-gray-700"
                    }`}
                >
                  {h}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PersonalDetailsStep;