
import React, { useState } from "react";

const FAMILY_WORTH = ["Below average", "Average", "Above average", "Rich"];

const FAMILY_STATUS = [
  "Middle class",
  "Upper middle class",
  "Rich",
  // "Affluent",
];

const FinalProfileStep = ({ data, setData, onBack, onSubmit, onNext }) => {
  const initialFinal = data.finalProfile || {};

  const [profileImage, setProfileImage] = useState(initialFinal.profileImage || null);
  const [aadhaarImage, setAadhaarImage] = useState(initialFinal.aadhaarImage || null);
  const [familyWorth, setFamilyWorth] = useState(initialFinal.familyWorth || "");
  const [familyStatus, setFamilyStatus] = useState(initialFinal.familyStatus || "");
  const [description, setDescription] = useState(initialFinal.description || "");
  const [accepted, setAccepted] = useState(!!initialFinal.accepted);

  const handleFinish = () => {
    const finalProfile = {
      profileImage,
      aadhaarImage,
      familyWorth,
      familyStatus,
      description,
      accepted,
    };

    // Keep global form data in sync (optional, but nice)
    setData((prev) => ({
      ...prev,
      finalProfile,
    }));

    // IMPORTANT: pass finalProfile up so parent can use it immediately
    if (onSubmit) {
      onSubmit(finalProfile);
    } else if (onNext) {
      onNext();
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* HEADER */}
      <div className="flex items-center gap-3 px-4 py-4 border-b">
        <button onClick={onBack}>←</button>
        <h1 className="text-base font-semibold text-navy">
          Final Details (5/5)
        </h1>
      </div>

      {/* CONTENT */}
      <div className="flex-1 overflow-y-auto px-4 py-6 space-y-6">
        {/* Profile Image */}
        <UploadField
          label="Profile image"
          required
          onChange={(file) => setProfileImage(file)}
        />

        {/* Aadhaar */}
        <UploadField
          label="Aadhaar card (optional)"
          onChange={(file) => setAadhaarImage(file)}
        />

        {/* Family Worth */}
        <div>
          <p className="text-sm font-medium mb-2">Family worth</p>
          <div className="flex flex-wrap gap-3">
            {FAMILY_WORTH.map((item) => (
              <SelectButton
                key={item}
                value={item}
                selected={familyWorth}
                onClick={setFamilyWorth}
              />
            ))}
          </div>
        </div>

        {/* Family Status */}
        <div>
          <p className="text-sm font-medium mb-2">Family status</p>
          <div className="flex flex-wrap gap-3">
            {FAMILY_STATUS.map((item) => (
              <SelectButton
                key={item}
                value={item}
                selected={familyStatus}
                onClick={setFamilyStatus}
              />
            ))}
          </div>
        </div>

        {/* Description */}
        <div>
          <p className="text-sm font-medium mb-2">About yourself</p>
          <textarea
            rows={4}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Write a short description about yourself..."
            className="w-full border rounded-xl px-4 py-3
                       focus:ring-2 focus:ring-primary outline-none"
          />
        </div>

        {/* Terms */}
        <label className="flex gap-3 items-start">
          <input
            type="checkbox"
            checked={accepted}
            onChange={(e) => setAccepted(e.target.checked)}
            className="mt-1 w-5 h-5 accent-primary"
          />
          <span className="text-sm text-gray-700">
            I agree to the{" "}
            <span className="text-primary underline cursor-pointer">
              Terms & Conditions
            </span>{" "}
            and{" "}
            <span className="text-primary underline cursor-pointer">
              Privacy Policy
            </span>
          </span>
        </label>
      </div>

      {/* FOOTER */}
      <div className="px-4 py-4 border-t">
        <button
          onClick={handleFinish}
          disabled={!profileImage || !familyWorth || !familyStatus || !accepted}
          className="w-full py-4 rounded-xl font-semibold text-base bg-primary text-white"
        >
          Next
        </button>
      </div>
    </div>
  );
};

/* ---------- REUSABLE COMPONENTS ---------- */

const UploadField = ({ label, onChange, required }) => (
  <div>
    <p className="text-sm font-medium mb-2">
      {label} {required && <span className="text-red-500">*</span>}
    </p>
    <input
      type="file"
      accept="image/*"
      onChange={(e) => onChange(e.target.files[0])}
      className="w-full border rounded-xl px-4 py-3
                 file:border-0 file:bg-transparent"
    />
  </div>
);

const SelectButton = ({ value, selected, onClick }) => (
  <button
    onClick={() => onClick(value)}
    className={`px-5 py-2.5 rounded-full border text-sm font-medium
      ${
        selected === value
          ? "bg-primary text-white border-red-600"
          : "border-gray-300 text-gray-700"
      }`}
  >
    {value}
  </button>
);

export default FinalProfileStep;