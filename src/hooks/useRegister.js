// hooks/useRegister.js

import { registerUser } from "../services/auth.service";
import {
  ACCOUNT_FOR_MAP,
  GENDER_MAP,
  PHYSICAL_STATUS_MAP,
  MARITAL_STATUS_MAP,
  FAMILY_STATUS_MAP,
  FAMILY_WORTH_MAP,
  CHILDREN_COUNT_MAP,
} from "../constants/registerMappings";

const monthMap = {
  Jan: "01",
  Feb: "02",
  Mar: "03",
  Apr: "04",
  May: "05",
  Jun: "06",
  Jul: "07",
  Aug: "08",
  Sep: "09",
  Oct: "10",
  Nov: "11",
  Dec: "12",
};

const convertHeightLabelToNumeric = (label) => {
  if (!label || typeof label !== "string") return "";

  // Match "5 ft 4 in" part
  const match = label.match(/(\d+)\s*ft\s*(\d+)\s*in/i);
  if (!match) {
    // If format is unexpected, just return original label
    return label;
  }

  const feet = parseInt(match[1], 10);
  const inches = parseInt(match[2], 10);

  if (!Number.isFinite(feet) || !Number.isFinite(inches)) {
    return label;
  }

  // Postman style: 5 ft 6 in => "5.6"
  if (inches === 0) return String(feet);
  return `${feet}.${inches}`;
};

export const useRegister = () => {
  const submitRegistration = async (data) => {
    try {
       console.log("🔍 Data received in submitRegistration:", data);
      const fd = new FormData();

      /* ---------- BASIC ---------- */
      fd.append("email", data.email || "");
      fd.append("password", data.password || "");
      fd.append("confirm_password", data.confirm_password || "");
      fd.append("phone_number", data.phone || "");
      fd.append("name", data.name || "");
      fd.append("this_account_for", ACCOUNT_FOR_MAP[data.profileFor] || "");
      fd.append("mother_tongue", data.motherTongue || "");

      /* ---------- PERSONAL ---------- */
      const p = data.personalDetails;
      if (!p) throw new Error("Personal details missing");

      if (!p.dobYear || !p.dobMonth || !p.dobDay) {
        throw new Error("Date of birth incomplete");
      }

      const month = monthMap[p.dobMonth];
      if (!month) throw new Error("Invalid month in date of birth");

      const dob = `${p.dobYear}-${month}-${String(p.dobDay).padStart(2, "0")}`;
      fd.append("date_of_birth", dob); // YYYY-MM-DD

      fd.append("gender", GENDER_MAP[p.gender]);
 const heightValue = convertHeightLabelToNumeric(p.height);
      fd.append("height", heightValue);
            fd.append("physical_status", PHYSICAL_STATUS_MAP[p.physicalStatus]);
      fd.append("marital_status", MARITAL_STATUS_MAP[p.maritalStatus]);

      if (p.childrenCount && p.childrenCount !== "None") {
  const mappedCount = CHILDREN_COUNT_MAP[p.childrenCount];

  if (mappedCount != null) {
    fd.append("children_count", mappedCount);
    fd.append("children_with_me", p.childrenLivingTogether === "Yes");
  }
}


      /* ---------- RELIGION ---------- */
      const r = data.religionDetails || {};

     // These are numeric IDs from the step (admin can add more without code changes)
      if (r.religionId) fd.append("religion", r.religionId);
      if (r.casteId) fd.append("caste", r.casteId);

      if (r.subCaste) fd.append("sub_caste", r.subCaste);
      fd.append("willing_inter_caste", !!r.anyCaste);

      /* ---------- LOCATION ---------- */
      const l = data.locationDetails || {};
      if (l.country) fd.append("country", l.country);
      if (l.state) fd.append("state", l.state);
      if (l.city) fd.append("city", l.city);

      /* ---------- PROFESSIONAL ---------- */
      const pr = data.professionalDetails;
      if (!pr) throw new Error("Professional details missing");

      fd.append("education", pr.education);
      fd.append("field_of_study", pr.fieldOfStudy || pr.education);
      fd.append("occupation", pr.occupation);
      fd.append("annual_income", pr.income);

      /* ---------- FAMILY / FINAL PROFILE ---------- */
       const f = data.finalProfile || {};
      if (!f) {
         console.error("❗ finalProfile missing in data:", data);
        throw new Error("Final profile missing");
      }
      // family_status & family_worth must match backend choices
      fd.append(
        "family_status",
        FAMILY_STATUS_MAP[f.familyStatus] || f.familyStatus || ""
      );
       fd.append(
        "family_worth",
        FAMILY_WORTH_MAP[f.familyWorth] || "" // map UI label -> backend code
      );
      fd.append("description", f.description || "");
      fd.append("terms_accepted", f.accepted);

      if (f.profileImage) fd.append("profile_image", f.profileImage);
      if (f.aadhaarImage) fd.append("aadhaar_card", f.aadhaarImage);

      /* ---------- DEBUG ---------- */
      console.group("📦 Registration Payload");
      for (let pair of fd.entries()) {
        console.log(pair[0], pair[1]);
      }
      console.groupEnd();

      /* ---------- API ---------- */
      const response = await registerUser(fd);

      console.log("✅ Registration success:", response);
      return { success: true, data: response };
    } catch (error) {
      console.error("❌ Registration failed:", error?.response || error);
        // apiClient throws the parsed body, not an Axios-style error
      let message;
      if (typeof error === "string") {
        message = error;
      } else if (Array.isArray(error)) {
        message = error.join(" | ");
      } else if (error && typeof error === "object") {
        message = JSON.stringify(error);
      } else {
        message = "Unknown error";
      }
      return {
        success: false,
        error: error?.response?.data || error.message,
      };
    }
  };

  return { submitRegistration };
};