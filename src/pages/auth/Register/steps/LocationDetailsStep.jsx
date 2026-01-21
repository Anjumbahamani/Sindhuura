// import React, { useState } from "react";

// /* ---- STATIC DATA (API LATER) ---- */
// const COUNTRIES = [
//   "India",
//   "United States of America",
//   "United Arab Emirates",
//   "United Kingdom",
//   "Saudi Arabia",
//   "Canada",
//   "Australia",
// ];

// const STATES = {
//   India: ["Karnataka", "Maharashtra", "Tamil Nadu", "Bihar", "Telangana"],
//   "United States of America": ["California", "Texas", "New York"],
//   "United Arab Emirates": ["Dubai", "Abu Dhabi"],
// };

// const CITIES = {
//   Karnataka: ["Bengaluru", "Mysuru", "Hubli"],
//   Maharashtra: ["Mumbai", "Pune", "Nagpur"],
//   Bihar: ["Patna", "Gaya", "Bhagalpur"],
//   California: ["Los Angeles", "San Francisco"],
//   Dubai: ["Dubai"],
// };

// /* -------------------------------- */

// const LocationDetailsStep = ({ data, setData, onNext, onBack }) => {
//   const [country, setCountry] = useState("India");
//   const [state, setState] = useState("");
//   const [city, setCity] = useState("");

//   const [drawer, setDrawer] = useState(null); // country | state | city

//   const handleNext = () => {
//     setData((prev) => ({
//       ...prev,
//       locationDetails: {
//         country,
//         state,
//         city,
//       },
//     }));
//     onNext();
//   };

//   const getList = () => {
//     if (drawer === "country") return COUNTRIES;
//     if (drawer === "state") return STATES[country] || [];
//     if (drawer === "city") return CITIES[state] || [];
//     return [];
//   };

//   return (
//     <div className="min-h-screen bg-white flex flex-col">

//       {/* HEADER */}
//       <div className="flex items-center gap-3 px-4 py-4 border-b">
//         <button onClick={onBack}>←</button>
//         <h1 className="text-base font-semibold text-navy">
//           Location Details (3/5)
//         </h1>
//       </div>

//       {/* CONTENT */}
//       <div className="flex-1 px-4 py-6 space-y-6">

//         {/* Country */}
//         <SelectField
//           label="Friend's residing country"
//           value={country}
//           onClick={() => setDrawer("country")}
//         />

//         {/* State */}
//         {country && (
//           <SelectField
//             label="Friend's residing state"
//             value={state}
//             placeholder="Select friend's resident state"
//             onClick={() => setDrawer("state")}
//           />
//         )}

//         {/* City */}
//         {state && (
//           <SelectField
//             label="Friend's residing city"
//             value={city}
//             placeholder="Select friend's resident city"
//             onClick={() => setDrawer("city")}
//           />
//         )}
//       </div>

//       {/* FOOTER */}
//       <div className="px-4 py-4 border-t">
//         <button
//           onClick={handleNext}
//           disabled={!country || !state || !city}
//           className={`w-full py-4 rounded-xl font-semibold text-base
//             ${
//               country && state && city
//                 ? "bg-primary text-white"
//                 : "bg-gray-200 text-gray-400"
//             }`}
//         >
//           Next
//         </button>

//         <p className="text-xs text-center text-gray-400 mt-3">
//           Need help? Call <span className="font-medium">8144-99-88-77</span>
//         </p>
//       </div>

//       {/* SIDE DRAWER */}
//       {drawer && (
//         <div className="fixed inset-0 z-50 bg-black/40">
//           <div className="absolute right-0 top-0 h-full w-[90%] bg-white shadow-lg flex flex-col">

//             <div className="px-4 py-4 border-b flex justify-between items-center">
//               <h3 className="text-base font-semibold capitalize">
//                 Select {drawer}
//               </h3>
//               <button onClick={() => setDrawer(null)}>✕</button>
//             </div>

//             <div className="flex-1 overflow-y-auto">
//               {getList().map((item) => (
//                 <button
//                   key={item}
//                   onClick={() => {
//                     if (drawer === "country") {
//                       setCountry(item);
//                       setState("");
//                       setCity("");
//                     }
//                     if (drawer === "state") {
//                       setState(item);
//                       setCity("");
//                     }
//                     if (drawer === "city") setCity(item);
//                     setDrawer(null);
//                   }}
//                   className="w-full text-left px-5 py-4 border-b"
//                 >
//                   {item}
//                 </button>
//               ))}
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// /* ---- REUSABLE SELECT FIELD ---- */
// const SelectField = ({ label, value, placeholder, onClick }) => (
//   <div>
//     <label className="block text-sm font-medium text-gray-700 mb-2">
//       {label}
//     </label>
//     <button
//       onClick={onClick}
//       className="w-full border rounded-xl px-4 py-3
//                  flex justify-between items-center text-left"
//     >
//       <span className={value ? "text-gray-800" : "text-gray-400"}>
//         {value || placeholder}
//       </span>
//       <span className="text-gray-400">⌄</span>
//     </button>
//   </div>
// );

// export default LocationDetailsStep;
// steps/LocationDetailsStep.jsx

import React, { useState } from "react";

const COUNTRIES = [
  "India",
  "United States of America",
  "United Arab Emirates",
  "United Kingdom",
  "Saudi Arabia",
  "Canada",
  "Australia",
];

const STATES = {
  India: ["Karnataka", "Maharashtra", "Tamil Nadu", "Bihar", "Telangana"],
  "United States of America": ["California", "Texas", "New York"],
  "United Arab Emirates": ["Dubai", "Abu Dhabi"],
};

const CITIES = {
  Karnataka: ["Bengaluru", "Mysuru", "Hubli"],
  Maharashtra: ["Mumbai", "Pune", "Nagpur"],
  Bihar: ["Patna", "Gaya", "Bhagalpur"],
  California: ["Los Angeles", "San Francisco"],
  Dubai: ["Dubai"],
};

const LocationDetailsStep = ({ data, setData, onNext, onBack }) => {
  const initial = data.locationDetails || {};

  const [country, setCountry] = useState(initial.country || "India");
  const [state, setState] = useState(initial.state || "");
  const [city, setCity] = useState(initial.city || "");

  const [drawer, setDrawer] = useState(null); // country | state | city

  const handleNext = () => {
    setData((prev) => ({
      ...prev,
      locationDetails: {
        country,
        state,
        city,
      },
    }));
    onNext();
  };

  const getList = () => {
    if (drawer === "country") return COUNTRIES;
    if (drawer === "state") return STATES[country] || [];
    if (drawer === "city") return CITIES[state] || [];
    return [];
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* HEADER */}
      <div className="flex items-center gap-3 px-4 py-4 border-b">
        <button onClick={onBack}>←</button>
        <h1 className="text-base font-semibold text-navy">
          Location Details (3/5)
        </h1>
      </div>

      {/* CONTENT */}
      <div className="flex-1 px-4 py-6 space-y-6">
        {/* Country */}
        <SelectField
          label="Friend's residing country"
          value={country}
          onClick={() => setDrawer("country")}
        />

        {/* State */}
        {country && (
          <SelectField
            label="Friend's residing state"
            value={state}
            placeholder="Select friend's resident state"
            onClick={() => setDrawer("state")}
          />
        )}

        {/* City */}
        {state && (
          <SelectField
            label="Friend's residing city"
            value={city}
            placeholder="Select friend's resident city"
            onClick={() => setDrawer("city")}
          />
        )}
      </div>

      {/* FOOTER */}
      <div className="px-4 py-4 border-t">
        <button
          onClick={handleNext}
          disabled={!country || !state || !city}
          className={`w-full py-4 rounded-xl font-semibold text-base
            ${
              country && state && city
                ? "bg-primary text-white"
                : "bg-gray-200 text-gray-400"
            }`}
        >
          Next
        </button>

        <p className="text-xs text-center text-gray-400 mt-3">
          Need help? Call <span className="font-medium">8144-99-88-77</span>
        </p>
      </div>

      {/* SIDE DRAWER */}
      {drawer && (
        <div className="fixed inset-0 z-50 bg-black/40">
          <div className="absolute right-0 top-0 h-full w-[90%] bg-white shadow-lg flex flex-col">
            <div className="px-4 py-4 border-b flex justify-between items-center">
              <h3 className="text-base font-semibold capitalize">
                Select {drawer}
              </h3>
              <button onClick={() => setDrawer(null)}>✕</button>
            </div>

            <div className="flex-1 overflow-y-auto">
              {getList().map((item) => (
                <button
                  key={item}
                  onClick={() => {
                    if (drawer === "country") {
                      setCountry(item);
                      setState("");
                      setCity("");
                    }
                    if (drawer === "state") {
                      setState(item);
                      setCity("");
                    }
                    if (drawer === "city") setCity(item);
                    setDrawer(null);
                  }}
                  className="w-full text-left px-5 py-4 border-b"
                >
                  {item}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const SelectField = ({ label, value, placeholder, onClick }) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-2">
      {label}
    </label>
    <button
      onClick={onClick}
      className="w-full border rounded-xl px-4 py-3
                 flex justify-between items-center text-left"
    >
      <span className={value ? "text-gray-800" : "text-gray-400"}>
        {value || placeholder}
      </span>
      <span className="text-gray-400">⌄</span>
    </button>
  </div>
);

export default LocationDetailsStep;