// constants/registerMappings.js

export const ACCOUNT_FOR_MAP = {
  Myself: "myself",       // ⬅︎ adjust these values to match your backend
  Son: "son",
  Daughter: "daughter",
  Brother: "brother",
  Sister: "sister",
  Friend: "friend",
  Relative: "relative", // ⬅︎ adjust if backend expects something else
};

export const GENDER_MAP = {
  Male: "male",
  Female: "female",
};


export const PHYSICAL_STATUS_MAP = {
  Normal: "normal",
  "Physically challenged": "challenged",
};

export const MARITAL_STATUS_MAP = {
  "Never married": "never_married",
  "Awaiting divorce": "separated",
  Divorced: "divorced",
  Widow: "widowed",
};

export const EDUCATION_MAP = {
  Diploma: "diploma",
  "Bachelor's degree": "bachelors",
  "Master's degree": "masters",
  Doctorate: "phd",
  Other: "other",
};

export const OCCUPATION_MAP = {
  "Software Engineer": "software",
  Doctor: "doctor",
  Teacher: "teacher",
  "Business Owner": "business",
  Business: "business",
  Government: "govt",
  Banking: "banking",
  Other: "other",
};

export const CHILDREN_COUNT_MAP = {
  "1": 1,
  "2": 2,
  "3": 3,
  "4+": 4, // "4 or more" – confirm with backend if needed
};
export const INCOME_MAP = {
  "2–5 Lakhs": "2-5",
  "5–10 Lakhs": "5-10",
  "10–15 Lakhs": "10-15",
  "15–25 Lakhs": "15-25",
  "25–50 Lakhs": "25-50",
  "50+ Lakhs": "50+",
};

export const FAMILY_STATUS_MAP = {
  "Middle class": "middle",
  "Upper middle class": "upper_middle",
  "Rich": "Rich",
  "Affluent": "Affluent", 
};

/**
 * FAMILY_WORTH_CHOICES from backend:
 *
 * FAMILY_WORTH_CHOICES = (
 *   ('5', '5 Lakh'),
 *   ('5-10', '5–10 Lakh'),
 *   ('10-25', '10–25 Lakh'),
 *   ('25-50', '25–50 Lakh'),
 *   ('50-100', '50 Lakh – 1 Crore'),
 *   ('1cr+', '1 Crore+'),
 * )
 *
 * Your UI shows: ["Below average", "Average", "Above average", "Rich"]
 * We map those 4 labels to valid backend values:
 */
export const FAMILY_WORTH_MAP = {
  "Below average": "5",       // 5 Lakh
  "Average": "5-10",          // 5–10 Lakh
  "Above average": "10-25",   // 10–25 Lakh
  "Rich": "1cr+",             // 1 Crore+ (or change as backend/PM prefers)
};