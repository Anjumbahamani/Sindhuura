

import React, { useState } from "react";

// const COUNTRIES = [
//   "India",
// ];

const STATES = {
  India: ["Andhra Pradesh", "Bihar", "Karnataka", "Maharashtra", "Tamil Nadu", "Telangana", "Uttar Pradesh", "West Bengal"],
};

const CITIES = {
  Karnataka: ["Bengaluru", "Mysuru", "Hubli", "Mangaluru"],
  Maharashtra: ["Mumbai", "Pune", "Nagpur", "Nashik"],
  Bihar: ["Patna", "Gaya", "Bhagalpur"],
  "Tamil Nadu": ["Chennai", "Coimbatore", "Madurai"],
  Telangana: ["Hyderabad", "Warangal"],
  // Add other mapping as needed
};

const LocationDetailsStep = ({ data, setData, onNext, onBack }) => {
  const initial = data.locationDetails || {};

   const country = "India";
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
    // if (drawer === "country") return COUNTRIES;
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
          label="Residing country"
          value={country}
          // onClick={() => setDrawer("country")}
        />

        {/* State */}
        {country && (
          <SelectField
            label="Residing state"
            value={state}
            placeholder="Select resident state"
            onClick={() => setDrawer("state")}
          />
        )}

        {/* City */}
        {state && (
          <SelectField
            label="Residing city"
            value={city}
            placeholder="Select resident city"
            onClick={() => setDrawer("city")}
          />
        )}
      </div>

      {/* FOOTER */}
      <div className="px-4 py-4 border-t">
        <button
          onClick={handleNext}
          disabled={!state || !city}
          className={`w-full py-4 rounded-xl font-semibold text-base
            ${
              state && city
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