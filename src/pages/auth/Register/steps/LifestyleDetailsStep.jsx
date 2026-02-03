
import React, { useState } from "react";
import apiClient from "../../../../services/apiClient";
import { API_ROUTES } from "../../../../constants/ApiRoutes";

/* ---- STATIC OPTIONS (API READY) ---- */
const MUSIC_GENRES = ["Classical", "Pop", "Rock", "Jazz", "Devotional", "Folk"];
const MUSIC_ACTIVITIES = ["Listening", "Singing", "Instrument"];
const READING_PREFS = ["Books", "Newspaper", "Blogs", "Magazines"];
const MOVIE_GENRES = ["Action", "Drama", "Comedy", "Romance", "Thriller"];

const EATING = ["Veg", "Non-veg", "Eggetarian"];
const SMOKING = ["Never", "Occasionally", "Regular"];
const DRINKING = ["Never", "Occasionally", "Regular"];

/* ---- MAPPINGS TO API VALUES ---- */
const EATING_MAP = {
  "Veg": "veg",
  "Non-veg": "non_veg",
  "Eggetarian": "eggetarian",
};

const SMOKING_MAP = {
  "Never": "never",
  "Occasionally": "occasionally",
  "Regular": "regular",
};

const DRINKING_MAP = {
  "Never": "never",
  "Occasionally": "occasionally",
  "Regular": "regular",
};

const toIds = (selected, allOptions) =>
  selected
    .map((val) => allOptions.indexOf(val) + 1) // 1-based IDs
    .filter((id) => id > 0);

const normalizeTime = (time) => {
  if (!time) return "";
  // "06:30" -> "06:30:00"
  if (time.length === 5) return `${time}:00`;
  return time;
};

const buildLifestylePayload = (local) => ({
  music_genres: toIds(local.music_genres, MUSIC_GENRES),
  music_activities: toIds(local.music_activities, MUSIC_ACTIVITIES),
  reading_preferences: toIds(local.reading_preferences, READING_PREFS),
  movie_tv_genres: toIds(local.movie_tv_genres, MOVIE_GENRES),

  reading_language: local.reading_language || "",
  favorite_sports: local.favorite_sports || "",
  fitness_activity: local.fitness_activity || "",

  spoken_languages: local.spoken_languages || "",
  cooking: !!local.cooking,

  time_of_birth: normalizeTime(local.time_of_birth),
  place_of_birth: local.place_of_birth || "",
  nakshatra: local.nakshatra || "",
  rashi: local.rashi || "",

  eating_habits: EATING_MAP[local.eating_habits] || "",
  smoking: SMOKING_MAP[local.smoking] || "",
  drinking: DRINKING_MAP[local.drinking] || "",

  college: local.college || "",
  course_degree: local.course_degree || "",
  passing_year: local.passing_year
    ? Number(local.passing_year)
    : null,
});

const LifestyleDetailsStep = ({ data, setData, onBack, navigate }) => {
  const initial = data.lifestyleDetails || {
    music_genres: [],
    music_activities: [],
    reading_preferences: [],
    movie_tv_genres: [],

    reading_language: "",
    favorite_sports: "",
    fitness_activity: "",
    spoken_languages: "",
    cooking: false,

    time_of_birth: "",
    place_of_birth: "",
    nakshatra: "",
    rashi: "",

    eating_habits: "",
    smoking: "",
    drinking: "",

    college: "",
    course_degree: "",
    passing_year: "",
  };

  const [local, setLocal] = useState(initial);
  const [loading, setLoading] = useState(false);

  const toggleMulti = (key, value) => {
    setLocal((prev) => ({
      ...prev,
      [key]: prev[key].includes(value)
        ? prev[key].filter((v) => v !== value)
        : [...prev[key], value],
    }));
  };

  // Function to handle navigation to welcome screen
  const navigateToWelcome = (uniqueId = null) => {
    const finalUniqueId = uniqueId || localStorage.getItem("unique_id") || "SN2026W01";
    console.log("🚀 Navigating to /welcome with uniqueId:", finalUniqueId);
    
    navigate("/welcome", { 
      state: { 
        uniqueId: finalUniqueId
      } 
    });
  };

  const handleNext = async () => {
    setData((prev) => ({
      ...prev,
      lifestyleDetails: local,
    }));

    const payload = buildLifestylePayload(local);
    const token = localStorage.getItem("token");
    console.log("🔐 Lifestyle token from localStorage:", token);

    setLoading(true);
    
    try {
      // Submit lifestyle data
      const res = await apiClient(API_ROUTES.AUTH.ADD_PERSONAL_DETAILS, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify(payload),
      });

      console.log("✅ Lifestyle details saved:", res);

      // Get unique_id from lifestyle API response
      const uniqueIdFromLifestyle = res?.response?.user?.unique_id || 
                                    res?.unique_id || 
                                    localStorage.getItem("unique_id");
      
      console.log("🆔 unique_id from lifestyle API:", uniqueIdFromLifestyle);

      // Store it in localStorage for WelcomeScr to access
      if (uniqueIdFromLifestyle) {
        localStorage.setItem("unique_id", uniqueIdFromLifestyle);
      }

      // Navigate to welcome screen
      navigateToWelcome(uniqueIdFromLifestyle);
      
    } catch (error) {
      console.error("❌ Failed to save lifestyle details:", error);
      
      // Even if API fails, try to navigate with whatever unique_id we have
      navigateToWelcome();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">

      {/* HEADER */}
      <div className="flex items-center gap-3 px-4 py-4 border-b">
        <button onClick={onBack}>←</button>
        <h1 className="text-base font-semibold text-navy">
          Lifestyle & Other Details (Optional)
        </h1>
      </div>

      {/* CONTENT */}
      <div className="flex-1 overflow-y-auto px-4 py-6 space-y-6">

        <MultiSelect
          label="Music genres"
          options={MUSIC_GENRES}
          selected={local.music_genres}
          onToggle={(v) => toggleMulti("music_genres", v)}
        />

        <MultiSelect
          label="Music activities"
          options={MUSIC_ACTIVITIES}
          selected={local.music_activities}
          onToggle={(v) => toggleMulti("music_activities", v)}
        />

        <MultiSelect
          label="Reading preferences"
          options={READING_PREFS}
          selected={local.reading_preferences}
          onToggle={(v) => toggleMulti("reading_preferences", v)}
        />

        <MultiSelect
          label="Movie / TV genres"
          options={MOVIE_GENRES}
          selected={local.movie_tv_genres}
          onToggle={(v) => toggleMulti("movie_tv_genres", v)}
        />

        <Input label="Reading language" value={local.reading_language}
          onChange={(v) => setLocal({ ...local, reading_language: v })} />

        <Input label="Favorite sports" value={local.favorite_sports}
          onChange={(v) => setLocal({ ...local, favorite_sports: v })} />

        <Input label="Fitness activity" value={local.fitness_activity}
          onChange={(v) => setLocal({ ...local, fitness_activity: v })} />

        <Input label="Spoken languages" value={local.spoken_languages}
          onChange={(v) => setLocal({ ...local, spoken_languages: v })} />

        <Toggle
          label="Do you like cooking?"
          value={local.cooking}
          onChange={(v) => setLocal({ ...local, cooking: v })}
        />

        <Input label="Time of birth" type="time"
          value={local.time_of_birth}
          onChange={(v) => setLocal({ ...local, time_of_birth: v })} />

        <Input label="Place of birth" value={local.place_of_birth}
          onChange={(v) => setLocal({ ...local, place_of_birth: v })} />

        <Input label="Nakshatra" value={local.nakshatra}
          onChange={(v) => setLocal({ ...local, nakshatra: v })} />

        <Input label="Rashi" value={local.rashi}
          onChange={(v) => setLocal({ ...local, rashi: v })} />

        <SingleSelect label="Eating habits" options={EATING}
          value={local.eating_habits}
          onSelect={(v) => setLocal({ ...local, eating_habits: v })} />

        <SingleSelect label="Smoking" options={SMOKING}
          value={local.smoking}
          onSelect={(v) => setLocal({ ...local, smoking: v })} />

        <SingleSelect label="Drinking" options={DRINKING}
          value={local.drinking}
          onSelect={(v) => setLocal({ ...local, drinking: v })} />

        <Input label="College" value={local.college}
          onChange={(v) => setLocal({ ...local, college: v })} />

        <Input label="Course / Degree" value={local.course_degree}
          onChange={(v) => setLocal({ ...local, course_degree: v })} />

        <Input label="Passing year" type="number"
          value={local.passing_year}
          onChange={(v) => setLocal({ ...local, passing_year: v })} />
      </div>

      {/* FOOTER */}
      <div className="px-4 py-4 border-t">
        <button
          onClick={handleNext}
          disabled={loading}
          className="w-full bg-primary text-white py-4 rounded-xl font-semibold disabled:opacity-50"
        >
          {loading ? "Saving..." : "Continue"}
        </button>
        <button
          onClick={() => navigateToWelcome()} // Fixed: Now calls the function
          className="w-full mt-2 border border-gray-300 text-gray-700 py-3 rounded-xl font-medium"
        >
          Skip Lifestyle Details
        </button>
      </div>
    </div>
  );
};

/* ---------- REUSABLE UI ---------- */

const MultiSelect = ({ label, options, selected, onToggle }) => (
  <div>
    <p className="text-sm font-medium mb-2">{label}</p>
    <div className="flex flex-wrap gap-3">
      {options.map((o) => (
        <button
          key={o}
          onClick={() => onToggle(o)}
          className={`px-4 py-2 rounded-full border text-sm
            ${selected.includes(o)
              ? "bg-primary text-white border-red-600"
              : "border-gray-300 text-gray-700"}`}
        >
          {o}
        </button>
      ))}
    </div>
  </div>
);

const SingleSelect = ({ label, options, value, onSelect }) => (
  <div>
    <p className="text-sm font-medium mb-2">{label}</p>
    <div className="flex flex-wrap gap-3">
      {options.map((o) => (
        <button
          key={o}
          onClick={() => onSelect(o)}
          className={`px-4 py-2 rounded-full border text-sm
            ${value === o
              ? "bg-primary text-white border-red-600"
              : "border-gray-300 text-gray-700"}`}
        >
          {o}
        </button>
      ))}
    </div>
  </div>
);

const Input = ({ label, value, onChange, type = "text" }) => (
  <div>
    <p className="text-sm font-medium mb-2">{label}</p>
    <input
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full border rounded-xl px-4 py-3"
    />
  </div>
);

const Toggle = ({ label, value, onChange }) => (
  <div>
    <p className="text-sm font-medium mb-2">{label}</p>
    <div className="flex gap-3">
      {["Yes", "No"].map((v) => (
        <button
          key={v}
          onClick={() => onChange(v === "Yes")}
          className={`flex-1 py-3 rounded-full border
            ${(value && v === "Yes") || (!value && v === "No")
              ? "bg-primary text-white border-red-600"
              : "border-gray-300 text-gray-700"}`}
        >
          {v}
        </button>
      ))}
    </div>
  </div>
);

export default LifestyleDetailsStep;

// import React, { useState } from "react";
// import apiClient from "../../../../services/apiClient";
// import { API_ROUTES } from "../../../../constants/ApiRoutes";

// /* ---- STATIC OPTIONS (API READY) ---- */
// const MUSIC_GENRES = ["Classical", "Pop", "Rock", "Jazz", "Devotional", "Folk"];
// const MUSIC_ACTIVITIES = ["Listening", "Singing", "Instrument"];
// const READING_PREFS = ["Books", "Newspaper", "Blogs", "Magazines"];
// const MOVIE_GENRES = ["Action", "Drama", "Comedy", "Romance", "Thriller"];

// const EATING = ["Veg", "Non-veg", "Eggetarian"];
// const SMOKING = ["Never", "Occasionally", "Regular"];
// const DRINKING = ["Never", "Occasionally", "Regular"];

// /* ---- MAPPINGS TO API VALUES ---- */
// const EATING_MAP = {
//   "Veg": "veg",
//   "Non-veg": "non_veg",
//   "Eggetarian": "eggetarian",
// };

// const SMOKING_MAP = {
//   "Never": "never",
//   "Occasionally": "occasionally",
//   "Regular": "regular",
// };

// const DRINKING_MAP = {
//   "Never": "never",
//   "Occasionally": "occasionally",
//   "Regular": "regular",
// };

// const toIds = (selected, allOptions) =>
//   selected
//     .map((val) => allOptions.indexOf(val) + 1) // 1-based IDs
//     .filter((id) => id > 0);

// const normalizeTime = (time) => {
//   if (!time) return "";
//   // "06:30" -> "06:30:00"
//   if (time.length === 5) return `${time}:00`;
//   return time;
// };

// const buildLifestylePayload = (local) => ({
//   music_genres: toIds(local.music_genres, MUSIC_GENRES),
//   music_activities: toIds(local.music_activities, MUSIC_ACTIVITIES),
//   reading_preferences: toIds(local.reading_preferences, READING_PREFS),
//   movie_tv_genres: toIds(local.movie_tv_genres, MOVIE_GENRES),

//   reading_language: local.reading_language || "",
//   favorite_sports: local.favorite_sports || "",
//   fitness_activity: local.fitness_activity || "",

//   spoken_languages: local.spoken_languages || "",
//   cooking: !!local.cooking,

//   time_of_birth: normalizeTime(local.time_of_birth),
//   place_of_birth: local.place_of_birth || "",
//   nakshatra: local.nakshatra || "",
//   rashi: local.rashi || "",

//   eating_habits: EATING_MAP[local.eating_habits] || "",
//   smoking: SMOKING_MAP[local.smoking] || "",
//   drinking: DRINKING_MAP[local.drinking] || "",

//   college: local.college || "",
//   course_degree: local.course_degree || "",
//   passing_year: local.passing_year
//     ? Number(local.passing_year)
//     : null,
// });

// const LifestyleDetailsStep = ({ data, setData, onBack, onNext,navigate }) => {
//   const initial = data.lifestyleDetails || {
//     music_genres: [],
//     music_activities: [],
//     reading_preferences: [],
//     movie_tv_genres: [],

//     reading_language: "",
//     favorite_sports: "",
//     fitness_activity: "",
//     spoken_languages: "",
//     cooking: false,

//     time_of_birth: "",
//     place_of_birth: "",
//     nakshatra: "",
//     rashi: "",

//     eating_habits: "",
//     smoking: "",
//     drinking: "",

//     college: "",
//     course_degree: "",
//     passing_year: "",
//   };

//   const [local, setLocal] = useState(initial);
//     const [loading, setLoading] = useState(false); // ADDED: loading state


//   const toggleMulti = (key, value) => {
//     setLocal((prev) => ({
//       ...prev,
//       [key]: prev[key].includes(value)
//         ? prev[key].filter((v) => v !== value)
//         : [...prev[key], value],
//     }));
//   };

//  const handleNext = async () => {
//   setData((prev) => ({
//     ...prev,
//     lifestyleDetails: local,
//   }));

//   const payload = buildLifestylePayload(local);
//   const token = localStorage.getItem("token");
//   console.log("🔐 Lifestyle token from localStorage:", token);

//   setLoading(true);
  
//   try {
//     // Submit lifestyle data
//     const res = await apiClient(API_ROUTES.AUTH.ADD_PERSONAL_DETAILS, {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//         ...(token ? { Authorization: `Bearer ${token}` } : {}),
//       },
//       body: JSON.stringify(payload),
//     });

//     console.log("✅ Lifestyle details saved:", res);

//     // Get unique_id from lifestyle API response
//     const uniqueIdFromLifestyle = res?.response?.user?.unique_id || 
//                                   res?.unique_id || 
//                                   localStorage.getItem("unique_id");
    
//     console.log("🆔 unique_id from lifestyle API:", uniqueIdFromLifestyle);

//     // Store it in localStorage for WelcomeScr to access
//     if (uniqueIdFromLifestyle) {
//       localStorage.setItem("unique_id", uniqueIdFromLifestyle);
//     }

//     // Navigate to welcome screen
//     navigate("/welcome", { 
//       state: { 
//         uniqueId: uniqueIdFromLifestyle
//       } 
//     });
    
//   } catch (error) {
//     console.error("❌ Failed to save lifestyle details:", error);
    
//     // Even if API fails, try to navigate with whatever unique_id we have
//     const fallbackUniqueId = localStorage.getItem("unique_id") || "SN2026W01";
    
//     navigate("/welcome", { 
//       state: { 
//         uniqueId: fallbackUniqueId
//       } 
//     });
//   } finally {
//     setLoading(false);
//   }
// };
//   return (
//     <div className="min-h-screen bg-white flex flex-col">

//       {/* HEADER */}
//       <div className="flex items-center gap-3 px-4 py-4 border-b">
//         <button onClick={onBack}>←</button>
//         <h1 className="text-base font-semibold text-navy">
//           Lifestyle & Other Details (Optional)
//         </h1>
//       </div>

//       {/* CONTENT */}
//       <div className="flex-1 overflow-y-auto px-4 py-6 space-y-6">

//         <MultiSelect
//           label="Music genres"
//           options={MUSIC_GENRES}
//           selected={local.music_genres}
//           onToggle={(v) => toggleMulti("music_genres", v)}
//         />

//         <MultiSelect
//           label="Music activities"
//           options={MUSIC_ACTIVITIES}
//           selected={local.music_activities}
//           onToggle={(v) => toggleMulti("music_activities", v)}
//         />

//         <MultiSelect
//           label="Reading preferences"
//           options={READING_PREFS}
//           selected={local.reading_preferences}
//           onToggle={(v) => toggleMulti("reading_preferences", v)}
//         />

//         <MultiSelect
//           label="Movie / TV genres"
//           options={MOVIE_GENRES}
//           selected={local.movie_tv_genres}
//           onToggle={(v) => toggleMulti("movie_tv_genres", v)}
//         />

//         <Input label="Reading language" value={local.reading_language}
//           onChange={(v) => setLocal({ ...local, reading_language: v })} />

//         <Input label="Favorite sports" value={local.favorite_sports}
//           onChange={(v) => setLocal({ ...local, favorite_sports: v })} />

//         <Input label="Fitness activity" value={local.fitness_activity}
//           onChange={(v) => setLocal({ ...local, fitness_activity: v })} />

//         <Input label="Spoken languages" value={local.spoken_languages}
//           onChange={(v) => setLocal({ ...local, spoken_languages: v })} />

//         <Toggle
//           label="Do you like cooking?"
//           value={local.cooking}
//           onChange={(v) => setLocal({ ...local, cooking: v })}
//         />

//         <Input label="Time of birth" type="time"
//           value={local.time_of_birth}
//           onChange={(v) => setLocal({ ...local, time_of_birth: v })} />

//         <Input label="Place of birth" value={local.place_of_birth}
//           onChange={(v) => setLocal({ ...local, place_of_birth: v })} />

//         <Input label="Nakshatra" value={local.nakshatra}
//           onChange={(v) => setLocal({ ...local, nakshatra: v })} />

//         <Input label="Rashi" value={local.rashi}
//           onChange={(v) => setLocal({ ...local, rashi: v })} />

//         <SingleSelect label="Eating habits" options={EATING}
//           value={local.eating_habits}
//           onSelect={(v) => setLocal({ ...local, eating_habits: v })} />

//         <SingleSelect label="Smoking" options={SMOKING}
//           value={local.smoking}
//           onSelect={(v) => setLocal({ ...local, smoking: v })} />

//         <SingleSelect label="Drinking" options={DRINKING}
//           value={local.drinking}
//           onSelect={(v) => setLocal({ ...local, drinking: v })} />

//         <Input label="College" value={local.college}
//           onChange={(v) => setLocal({ ...local, college: v })} />

//         <Input label="Course / Degree" value={local.course_degree}
//           onChange={(v) => setLocal({ ...local, course_degree: v })} />

//         <Input label="Passing year" type="number"
//           value={local.passing_year}
//           onChange={(v) => setLocal({ ...local, passing_year: v })} />
//       </div>

//       {/* FOOTER */}
//       <div className="px-4 py-4 border-t">
//         <button
//           onClick={handleNext}
//           disabled={loading}
//           className="w-full bg-primary text-white py-4 rounded-xl font-semibold"
//         >
//         {loading ? "Saving..." : "Continue"}
//         </button>
//         <button
//           onClick={navigateToWelcome}
//           className="w-full mt-2 border border-gray-300 text-gray-700 py-3 rounded-xl font-medium"
//         >
//           Skip Lifestyle Details
//         </button>
//       </div>
//     </div>
//   );
// };

// /* ---------- REUSABLE UI ---------- */

// const MultiSelect = ({ label, options, selected, onToggle }) => (
//   <div>
//     <p className="text-sm font-medium mb-2">{label}</p>
//     <div className="flex flex-wrap gap-3">
//       {options.map((o) => (
//         <button
//           key={o}
//           onClick={() => onToggle(o)}
//           className={`px-4 py-2 rounded-full border text-sm
//             ${selected.includes(o)
//               ? "bg-primary text-white border-red-600"
//               : "border-gray-300 text-gray-700"}`}
//         >
//           {o}
//         </button>
//       ))}
//     </div>
//   </div>
// );

// const SingleSelect = ({ label, options, value, onSelect }) => (
//   <div>
//     <p className="text-sm font-medium mb-2">{label}</p>
//     <div className="flex flex-wrap gap-3">
//       {options.map((o) => (
//         <button
//           key={o}
//           onClick={() => onSelect(o)}
//           className={`px-4 py-2 rounded-full border text-sm
//             ${value === o
//               ? "bg-primary text-white border-red-600"
//               : "border-gray-300 text-gray-700"}`}
//         >
//           {o}
//         </button>
//       ))}
//     </div>
//   </div>
// );

// const Input = ({ label, value, onChange, type = "text" }) => (
//   <div>
//     <p className="text-sm font-medium mb-2">{label}</p>
//     <input
//       type={type}
//       value={value}
//       onChange={(e) => onChange(e.target.value)}
//       className="w-full border rounded-xl px-4 py-3"
//     />
//   </div>
// );

// const Toggle = ({ label, value, onChange }) => (
//   <div>
//     <p className="text-sm font-medium mb-2">{label}</p>
//     <div className="flex gap-3">
//       {["Yes", "No"].map((v) => (
//         <button
//           key={v}
//           onClick={() => onChange(v === "Yes")}
//           className={`flex-1 py-3 rounded-full border
//             ${(value && v === "Yes") || (!value && v === "No")
//               ? "bg-primary text-white border-red-600"
//               : "border-gray-300 text-gray-700"}`}
//         >
//           {v}
//         </button>
//       ))}
//     </div>
//   </div>
// );

// export default LifestyleDetailsStep;