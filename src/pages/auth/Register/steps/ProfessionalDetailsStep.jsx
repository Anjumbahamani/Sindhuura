// import React, { useState } from "react";

// /* ---- STATIC DATA (label + value) ---- */
// const EDUCATION = [
//   { label: "Diploma", value: "diploma" },
//   { label: "Bachelor's degree", value: "bachelors" },
//   { label: "Master's degree", value: "masters" },
//   { label: "Doctorate", value: "phd" },
//   { label: "Other", value: "other" },
// ];

// const OCCUPATIONS = [
//   { label: "Software Engineer", value: "software" },
//   { label: "Doctor", value: "doctor" },
//   { label: "Teacher", value: "teacher" },
//   { label: "Business Owner", value: "business" },
//   { label: "Other", value: "other" },
// ];

// const INCOME = [
//   { label: "2–5 Lakhs", value: "2-5" },
//   { label: "5–10 Lakhs", value: "5-10" },
//   { label: "10–15 Lakhs", value: "10-15" },
//   { label: "15–25 Lakhs", value: "15-25" },
//   { label: "25–50 Lakhs", value: "25-50" },
//   { label: "50+ Lakhs", value: "50+" },
// ];

// const ProfessionalDetailsStep = ({ data, setData, onNext, onBack }) => {
//   const [education, setEducation] = useState(null);
//   const [occupation, setOccupation] = useState(null);
//   const [income, setIncome] = useState(null);
//   const [drawer, setDrawer] = useState(null);

//   const handleNext = () => {
//     setData((prev) => ({
//       ...prev,
//       professionalDetails: {
//         education: education?.value,
//         fieldOfStudy: education?.label,
//         occupation: occupation?.value,
//         income: income?.value,
//       },
//     }));
//     onNext();
//   };

//   const getList = () => {
//     if (drawer === "education") return EDUCATION;
//     if (drawer === "occupation") return OCCUPATIONS;
//     if (drawer === "income") return INCOME;
//     return [];
//   };

//   return (
//     <div className="min-h-screen bg-white flex flex-col">

//       {/* HEADER */}
//       <div className="flex items-center gap-3 px-4 py-4 border-b">
//         <button onClick={onBack}>←</button>
//         <h1 className="text-base font-semibold text-navy">
//           Professional Details (4/5)
//         </h1>
//       </div>

//       {/* CONTENT */}
//       <div className="flex-1 px-4 py-6 space-y-5">

//         <SelectField
//           label="Education details"
//           value={education?.label}
//           placeholder="Select education"
//           onClick={() => setDrawer("education")}
//         />

//         <SelectField
//           label="Occupation"
//           value={occupation?.label}
//           placeholder="Select occupation"
//           onClick={() => setDrawer("occupation")}
//         />

//         <SelectField
//           label="Annual income"
//           value={income?.label}
//           placeholder="Select income"
//           onClick={() => setDrawer("income")}
//         />
//       </div>

//       {/* FOOTER */}
//       <div className="px-4 py-4 border-t">
//         <button
//           onClick={handleNext}
//           disabled={!education || !occupation || !income}
//           className={`w-full py-4 rounded-xl font-semibold text-base
//             ${
//               education && occupation && income
//                 ? "bg-primary text-white"
//                 : "bg-gray-200 text-gray-400"
//             }`}
//         >
//           Next
//         </button>
//       </div>

//       {/* SIDE DRAWER */}
//       {drawer && (
//         <div className="fixed inset-0 z-50 bg-black/40">
//           <div className="absolute right-0 top-0 h-full w-[90%] bg-white">

//             <div className="px-4 py-4 border-b flex justify-between">
//               <h3>Select {drawer}</h3>
//               <button onClick={() => setDrawer(null)}>✕</button>
//             </div>

//             <div>
//               {getList().map((item) => (
//                 <button
//                   key={item.value}   // ✅ UNIQUE KEY
//                   onClick={() => {
//                     if (drawer === "education") setEducation(item);
//                     if (drawer === "occupation") setOccupation(item);
//                     if (drawer === "income") setIncome(item);
//                     setDrawer(null);
//                   }}
//                   className="w-full text-left px-5 py-4 border-b"
//                 >
//                   {item.label}       {/* ✅ NO OBJECT RENDER */}
//                 </button>
//               ))}
//             </div>

//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// const SelectField = ({ label, value, placeholder, onClick }) => (
//   <div>
//     <label className="block text-sm font-medium mb-2">{label}</label>
//     <button
//       onClick={onClick}
//       className="w-full border rounded-xl px-4 py-3 flex justify-between"
//     >
//       <span className={value ? "text-gray-800" : "text-gray-400"}>
//         {value || placeholder}
//       </span>
//       <span>⌄</span>
//     </button>
//   </div>
// );

// export default ProfessionalDetailsStep;

// steps/ProfessionalDetailsStep.jsx

import React, { useState } from "react";

const EDUCATION = [
  { label: "Diploma", value: "diploma" },
  { label: "Bachelor's degree", value: "bachelors" },
  { label: "Master's degree", value: "masters" },
  { label: "Doctorate", value: "phd" },
  { label: "Other", value: "other" },
];

const OCCUPATIONS = [
  { label: "Software Engineer", value: "software" },
  { label: "Doctor", value: "doctor" },
  { label: "Teacher", value: "teacher" },
  { label: "Business Owner", value: "business" },
  { label: "Other", value: "other" },
];

const INCOME = [
  { label: "2–5 Lakhs", value: "2-5" },
  { label: "5–10 Lakhs", value: "5-10" },
  { label: "10–15 Lakhs", value: "10-15" },
  { label: "15–25 Lakhs", value: "15-25" },
  { label: "25–50 Lakhs", value: "25-50" },
  { label: "50+ Lakhs", value: "50+" },
];

const ProfessionalDetailsStep = ({ data, setData, onNext, onBack }) => {
  const initial = data.professionalDetails || {};

  const [education, setEducation] = useState(initial.education || "");
  const [occupation, setOccupation] = useState(initial.occupation || "");
  const [income, setIncome] = useState(initial.income || "");
  const [drawer, setDrawer] = useState(null);

  const getList = () => {
    if (drawer === "education") return EDUCATION;
    if (drawer === "occupation") return OCCUPATIONS;
    if (drawer === "income") return INCOME;
    return [];
  };

  const handleSelect = (item) => {
    if (drawer === "education") setEducation(item.value);
    if (drawer === "occupation") setOccupation(item.value);
    if (drawer === "income") setIncome(item.value);
    setDrawer(null);
  };

  const handleNext = () => {
    setData((prev) => ({
      ...prev,
      professionalDetails: {
        education,
        occupation,
        income,
      },
    }));
    onNext();
  };

  const getLabel = (list, value) =>
    list.find((i) => i.value === value)?.label || "";

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <div className="flex items-center gap-3 px-4 py-4 border-b">
        <button onClick={onBack}>←</button>
        <h1 className="text-base font-semibold">
          Professional Details (4/5)
        </h1>
      </div>

      <div className="flex-1 px-4 py-6 space-y-5">
        <SelectField
          label="Education details"
          value={getLabel(EDUCATION, education)}
          placeholder="Select education"
          onClick={() => setDrawer("education")}
        />

        <SelectField
          label="Occupation"
          value={getLabel(OCCUPATIONS, occupation)}
          placeholder="Select occupation"
          onClick={() => setDrawer("occupation")}
        />

        <SelectField
          label="Annual income"
          value={getLabel(INCOME, income)}
          placeholder="Select income"
          onClick={() => setDrawer("income")}
        />
      </div>

      <div className="px-4 py-4 border-t">
        <button
          onClick={handleNext}
          disabled={!education || !occupation || !income}
          className="w-full py-4 rounded-xl bg-primary text-white"
        >
          Next
        </button>
      </div>

      {drawer && (
        <div className="fixed inset-0 bg-black/40 z-50">
          <div className="absolute right-0 top-0 h-full w-[90%] bg-white">
            <div className="px-4 py-4 border-b flex justify-between">
              <h3>Select {drawer}</h3>
              <button onClick={() => setDrawer(null)}>✕</button>
            </div>

            {getList().map((item) => (
              <button
                key={item.value}
                onClick={() => handleSelect(item)}
                className="w-full px-5 py-4 border-b text-left"
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

const SelectField = ({ label, value, placeholder, onClick }) => (
  <div>
    <label className="block text-sm mb-2">{label}</label>
    <button
      onClick={onClick}
      className="w-full border rounded-xl px-4 py-3 flex justify-between"
    >
      <span className={value ? "text-gray-800" : "text-gray-400"}>
        {value || placeholder}
      </span>
      <span>⌄</span>
    </button>
  </div>
);

export default ProfessionalDetailsStep;


// import React, { useState } from "react";

// /* ---- STATIC DATA ---- */
// const EDUCATION = [
//   { label: "Diploma", value: "diploma" },
//   { label: "Bachelor's degree", value: "bachelors" },
//   { label: "Master's degree", value: "masters" },
//   { label: "Doctorate", value: "phd" },
//   { label: "Other", value: "other" },
// ];

// const OCCUPATIONS = [
//   { label: "Software Engineer", value: "software" },
//   { label: "Doctor", value: "doctor" },
//   { label: "Teacher", value: "teacher" },
//   { label: "Business Owner", value: "business" },
//   { label: "Other", value: "other" },
// ];

// const INCOME = [
//   { label: "2–5 Lakhs", value: "2-5" },
//   { label: "5–10 Lakhs", value: "5-10" },
//   { label: "10–15 Lakhs", value: "10-15" },
//   { label: "15–25 Lakhs", value: "15-25" },
//   { label: "25–50 Lakhs", value: "25-50" },
//   { label: "50+ Lakhs", value: "50+" },
// ];

// const ProfessionalDetailsStep = ({ data, setData, onNext, onBack }) => {
//   const [education, setEducation] = useState("");
//   const [occupation, setOccupation] = useState("");
//   const [income, setIncome] = useState("");
//   const [drawer, setDrawer] = useState(null);

//   const getList = () => {
//     if (drawer === "education") return EDUCATION;
//     if (drawer === "occupation") return OCCUPATIONS;
//     if (drawer === "income") return INCOME;
//     return [];
//   };

//   const handleSelect = (item) => {
//     if (drawer === "education") setEducation(item.value);
//     if (drawer === "occupation") setOccupation(item.value);
//     if (drawer === "income") setIncome(item.value);
//     setDrawer(null);
//   };

//   const handleNext = () => {
//     setData((prev) => ({
//       ...prev,
//       professionalDetails: {
//         education,
//         occupation,
//         income,
//       },
//     }));
//     onNext();
//   };

//   const getLabel = (list, value) =>
//     list.find((i) => i.value === value)?.label || "";

//   return (
//     <div className="min-h-screen bg-white flex flex-col">

//       <div className="flex items-center gap-3 px-4 py-4 border-b">
//         <button onClick={onBack}>←</button>
//         <h1 className="text-base font-semibold">Professional Details (4/5)</h1>
//       </div>

//       <div className="flex-1 px-4 py-6 space-y-5">
//         <SelectField
//           label="Education details"
//           value={getLabel(EDUCATION, education)}
//           placeholder="Select education"
//           onClick={() => setDrawer("education")}
//         />

//         <SelectField
//           label="Occupation"
//           value={getLabel(OCCUPATIONS, occupation)}
//           placeholder="Select occupation"
//           onClick={() => setDrawer("occupation")}
//         />

//         <SelectField
//           label="Annual income"
//           value={getLabel(INCOME, income)}
//           placeholder="Select income"
//           onClick={() => setDrawer("income")}
//         />
//       </div>

//       <div className="px-4 py-4 border-t">
//         <button
//           onClick={handleNext}
//           disabled={!education || !occupation || !income}
//           className="w-full py-4 rounded-xl bg-primary text-white"
//         >
//           Next
//         </button>
//       </div>

//       {drawer && (
//         <div className="fixed inset-0 bg-black/40 z-50">
//           <div className="absolute right-0 top-0 h-full w-[90%] bg-white">
//             <div className="px-4 py-4 border-b flex justify-between">
//               <h3>Select {drawer}</h3>
//               <button onClick={() => setDrawer(null)}>✕</button>
//             </div>

//             {getList().map((item) => (
//               <button
//                 key={item.value}           // ✅ SAFE KEY
//                 onClick={() => handleSelect(item)}
//                 className="w-full px-5 py-4 border-b text-left"
//               >
//                 {item.label}               
//               </button>
//             ))}
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// const SelectField = ({ label, value, placeholder, onClick }) => (
//   <div>
//     <label className="block text-sm mb-2">{label}</label>
//     <button
//       onClick={onClick}
//       className="w-full border rounded-xl px-4 py-3 flex justify-between"
//     >
//       <span className={value ? "text-gray-800" : "text-gray-400"}>
//         {value || placeholder}
//       </span>
//       <span>⌄</span>
//     </button>
//   </div>
// );

// export default ProfessionalDetailsStep;
