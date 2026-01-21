// import { useState } from "react";
// import logo from "../../../../assets/logo.png";

// const PROFILE_FOR = [
//   "Myself",
//   "Son",
//   "Daughter",
//   "Brother",
//   "Sister",
//   "Friend",
//   "Relative",
// ];

// const LANGUAGES = [
//   "Bengali",
//   "Gujarati",
//   "Hindi",
//   "Kannada",
//   "Malayalam",
//   "Marwari",
//   "Oriya",
//   "Punjabi",
//   "Sindhi",
//   "Tamil",
//   "Telugu",
//   "Urdu",
// ];

// const ProfileForStep = ({ data, setData, onNext, onBack }) => {
//   const [search, setSearch] = useState("");
//   const [openDrawer, setOpenDrawer] = useState(false);

//   const filteredLanguages = LANGUAGES.filter((lang) =>
//     lang.toLowerCase().includes(search.toLowerCase())
//   );

//   return (
//     <div className="min-h-screen bg-white flex flex-col relative">

//       {/* Header */}
//       <div className="flex items-center gap-3 px-4 py-4 border-b">
//         <button onClick={onBack}>←</button>
//         <h1 className="text-base font-semibold text-navy">
//           Create Profile
//         </h1>
//       </div>

//       {/* Content */}
//       <div className="flex-1 overflow-y-auto px-4 py-6">

//         {/* Logo */}
//         <div className="flex justify-center mb-4">
//           <img src={logo} alt="Sindhuura" className="h-14 w-14" />
//         </div>

//         {/* Title */}
//         <h2 className="text-lg font-semibold text-center text-navy mb-4">
//           I am creating this profile for
//         </h2>

//         {/* Profile For */}
//         <div className="flex flex-wrap justify-center gap-3 mb-6">
//           {PROFILE_FOR.map((item) => (
//             <button
//               key={item}
//               onClick={() => setData({ ...data, profileFor: item })}
//               className={`px-5 py-2.5 rounded-full border text-sm font-medium
//                 ${
//                   data.profileFor === item
//                     ? "bg-primary text-white border-primary"
//                     : "border-gray-300 text-gray-700"
//                 }`}
//             >
//               {item}
//             </button>
//           ))}
//         </div>

//         {/* Mother Tongue */}
//         <div className="mb-6">
//           <label className="block text-sm font-medium text-gray-600 mb-2">
//             Mother tongue
//           </label>

//           <button
//             onClick={() => setOpenDrawer(true)}
//             className="w-full flex justify-between items-center
//                        border border-gray-300 rounded-xl px-4 py-4"
//           >
//             <span>{data.motherTongue || "Select mother tongue"}</span>
//             <span className="text-gray-400">›</span>
//           </button>
//         </div>
//       </div>

//       {/* CTA */}
//       <div className="px-4 py-4 border-t">
//         <button
//           disabled={!data.profileFor || !data.motherTongue}
//           onClick={onNext}
//           className={`w-full py-4 rounded-xl font-semibold
//             ${
//               data.profileFor && data.motherTongue
//                 ? "bg-primary text-white"
//                 : "bg-gray-200 text-gray-400 cursor-not-allowed"
//             }`}
//         >
//           Start Registration
//         </button>
//       </div>

//       {/* Drawer */}
//       {openDrawer && (
//         <div className="fixed inset-0 z-50 bg-black/40">
//           <div className="absolute right-0 top-0 h-full w-[90%] bg-white flex flex-col">
//             <div className="px-4 py-4 border-b flex justify-between">
//               <h3 className="font-semibold">Select mother tongue</h3>
//               <button onClick={() => setOpenDrawer(false)}>✕</button>
//             </div>

//             <div className="p-4">
//               <input
//                 value={search}
//                 onChange={(e) => setSearch(e.target.value)}
//                 placeholder="Search mother tongue"
//                 className="w-full px-4 py-3 border rounded-xl"
//               />
//             </div>

//             <div className="flex-1 overflow-y-auto">
//               {filteredLanguages.map((lang) => (
//                 <button
//                   key={lang}
//                   onClick={() => {
//                     setData({ ...data, motherTongue: lang });
//                     setOpenDrawer(false);
//                     setSearch("");
//                   }}
//                   className="w-full text-left px-5 py-4 border-b"
//                 >
//                   {lang}
//                 </button>
//               ))}
//             </div>
//           </div>
//         </div>
//       )}

//     </div>
//   );
// };

// export default ProfileForStep;

// steps/ProfileForStep.jsx

import { useState } from "react";
import logo from "../../../../assets/logo.png";

const PROFILE_FOR = [
  "Myself",
  "Son",
  "Daughter",
  "Brother",
  "Sister",
  "Friend",
  "Relative",
];

const LANGUAGES = [
  "Bengali",
  "Gujarati",
  "Hindi",
  "Kannada",
  "Malayalam",
  "Marwari",
  "Oriya",
  "Punjabi",
  "Sindhi",
  "Tamil",
  "Telugu",
  "Urdu",
];

const ProfileForStep = ({ data, setData, onNext, onBack }) => {
  const [search, setSearch] = useState("");
  const [openDrawer, setOpenDrawer] = useState(false);

  const filteredLanguages = LANGUAGES.filter((lang) =>
    lang.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-white flex flex-col relative">
      {/* Header */}
      <div className="flex items-center gap-3 px-4 py-4 border-b">
        <button onClick={onBack}>←</button>
        <h1 className="text-base font-semibold text-navy">Create Profile</h1>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-4 py-6">
        {/* Logo */}
        <div className="flex justify-center mb-4">
          <img src={logo} alt="Sindhuura" className="h-14 w-14" />
        </div>

        {/* Title */}
        <h2 className="text-lg font-semibold text-center text-navy mb-4">
          I am creating this profile for
        </h2>

        {/* Profile For */}
        <div className="flex flex-wrap justify-center gap-3 mb-6">
          {PROFILE_FOR.map((item) => (
            <button
              key={item}
              onClick={() => setData({ ...data, profileFor: item })}
              className={`px-5 py-2.5 rounded-full border text-sm font-medium
                ${
                  data.profileFor === item
                    ? "bg-primary text-white border-primary"
                    : "border-gray-300 text-gray-700"
                }`}
            >
              {item}
            </button>
          ))}
        </div>

        {/* Mother Tongue */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-600 mb-2">
            Mother tongue
          </label>

          <button
            onClick={() => setOpenDrawer(true)}
            className="w-full flex justify-between items-center
                       border border-gray-300 rounded-xl px-4 py-4"
          >
            <span>{data.motherTongue || "Select mother tongue"}</span>
            <span className="text-gray-400">›</span>
          </button>
        </div>
      </div>

      {/* CTA */}
      <div className="px-4 py-4 border-t">
        <button
          disabled={!data.profileFor || !data.motherTongue}
          onClick={onNext}
          className={`w-full py-4 rounded-xl font-semibold
            ${
              data.profileFor && data.motherTongue
                ? "bg-primary text-white"
                : "bg-gray-200 text-gray-400 cursor-not-allowed"
            }`}
        >
          Start Registration
        </button>
      </div>

      {/* Drawer */}
      {openDrawer && (
        <div className="fixed inset-0 z-50 bg-black/40">
          <div className="absolute right-0 top-0 h-full w-[90%] bg-white flex flex-col">
            <div className="px-4 py-4 border-b flex justify-between">
              <h3 className="font-semibold">Select mother tongue</h3>
              <button onClick={() => setOpenDrawer(false)}>✕</button>
            </div>

            <div className="p-4">
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search mother tongue"
                className="w-full px-4 py-3 border rounded-xl"
              />
            </div>

            <div className="flex-1 overflow-y-auto">
              {filteredLanguages.map((lang) => (
                <button
                  key={lang}
                  onClick={() => {
                    setData({ ...data, motherTongue: lang });
                    setOpenDrawer(false);
                    setSearch("");
                  }}
                  className="w-full text-left px-5 py-4 border-b"
                >
                  {lang}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfileForStep;

// import { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import logo from "../../../assets/logo.png";

// const PROFILE_FOR = [
//   "Myself",
//   "Son",
//   "Daughter",
//   "Brother",
//   "Sister",
//   "Friend",
//   "Relative",
// ];

// const LANGUAGES = [
//   "Bengali",
//   "Gujarati",
//   "Hindi",
//   "Kannada",
//   "Malayalam",
//   "Marwari",
//   "Oriya",
//   "Punjabi",
//   "Sindhi",
//   "Tamil",
//   "Telugu",
//   "Urdu",
// ];

// const CreateProfile = () => {
//   const navigate = useNavigate();

//   const [profileFor, setProfileFor] = useState("");
//   const [motherTongue, setMotherTongue] = useState("");
//   const [search, setSearch] = useState("");
//   const [openDrawer, setOpenDrawer] = useState(false);

//   const filteredLanguages = LANGUAGES.filter((lang) =>
//     lang.toLowerCase().includes(search.toLowerCase())
//   );

//   return (
//     <div className="min-h-screen bg-white flex flex-col relative">

//       {/* Header */}
//       <div className="flex items-center gap-3 px-4 py-4 border-b">
//         <button onClick={() => navigate(-1)}>←</button>
//         <h1 className="text-base font-semibold text-navy">
//           Create Profile
//         </h1>
//       </div>

//       {/* Scrollable Content */}
//       <div className="flex-1 overflow-y-auto px-4 py-6">

//         {/* Logo */}
//         <div className="flex justify-center mb-4">
//           <img src={logo} alt="Sindhuura" className="h-14 w-14" />
//         </div>

//         {/* Profile For */}
//         <h2 className="text-lg font-semibold text-center text-navy mb-4">
//           I am creating this profile for
//         </h2>

//         {/* ✅ Mobile-friendly chips (no grid) */}
//         <div className="flex flex-wrap justify-center gap-3 mb-6">
//           {PROFILE_FOR.map((item) => (
//             <button
//               key={item}
//               onClick={() => setProfileFor(item)}
//               className={`px-5 py-2.5 rounded-full border text-sm font-medium transition
//                 ${
//                   profileFor === item
//                     ? "bg-primary text-white border-primary"
//                     : "border-gray-300 text-gray-700"
//                 }`}
//             >
//               {item}
//             </button>
//           ))}
//         </div>

//         {/* Mother Tongue Field */}
//         <div className="mb-6">
//           <label className="block text-sm font-medium text-gray-600 mb-2">
//             Mother tongue
//           </label>

//           <button
//             onClick={() => setOpenDrawer(true)}
//             className="w-full flex justify-between items-center
//                        border border-gray-300 rounded-xl px-4 py-4
//                        text-left text-base text-gray-800"
//           >
//             <span>
//               {motherTongue || "Select mother tongue"}
//             </span>
//             <span className="text-gray-400">›</span>
//           </button>
//         </div>
//       </div>

//       {/* ✅ Mobile-first sticky CTA */}
//       <div className="px-4 py-4 border-t">
//         <button
//           disabled={!profileFor || !motherTongue}
//           className={`w-full py-4 rounded-xl font-semibold text-base transition
//             ${
//               profileFor && motherTongue
//                 ? "bg-primary text-white"
//                 : "bg-gray-200 text-gray-400 cursor-not-allowed"
//             }`}
//         >
//           Start Registration
//         </button>
//       </div>

//       {/* 🔽 Side Drawer (UNCHANGED behaviour) */}
//       {openDrawer && (
//         <div className="fixed inset-0 z-50 bg-black/40">
//           <div className="absolute right-0 top-0 h-full w-[90%] bg-white shadow-lg flex flex-col">

//             {/* Drawer Header */}
//             <div className="px-4 py-4 border-b flex items-center justify-between">
//               <h3 className="text-base font-semibold text-navy">
//                 Select mother tongue
//               </h3>
//               <button onClick={() => setOpenDrawer(false)}>✕</button>
//             </div>

//             {/* Search */}
//             <div className="p-4">
//               <input
//                 type="text"
//                 placeholder="Search mother tongue"
//                 value={search}
//                 onChange={(e) => setSearch(e.target.value)}
//                 className="w-full px-4 py-3 border rounded-xl
//                            focus:outline-none focus:ring-2 focus:ring-primary"
//               />
//             </div>

//             {/* List */}
//             <div className="flex-1 overflow-y-auto">
//               {filteredLanguages.map((lang) => (
//                 <button
//                   key={lang}
//                   onClick={() => {
//                     setMotherTongue(lang);
//                     setOpenDrawer(false);
//                     setSearch("");
//                   }}
//                   className={`w-full text-left px-5 py-4 border-b text-base
//                     ${
//                       motherTongue === lang
//                         ? "bg-green-100 text-green-800"
//                         : "text-gray-700"
//                     }`}
//                 >
//                   {lang}
//                 </button>
//               ))}
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default CreateProfile;
