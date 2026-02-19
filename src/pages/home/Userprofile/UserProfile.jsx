

import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FiArrowLeft,
  FiMapPin,
  FiBriefcase,
  FiBookOpen,
  FiImage,
  FiHeart,
  FiPlusCircle,
  FiTrash2,
  FiFileText,
} from "react-icons/fi";
import BottomNav from "../../../components/BottomNav";
import {
  getUserProfile,
  updateUserProfile,
  getUserImages,
  deleteUserImage,
  getMySuccessStories,
  addSuccessStory,
  deleteSuccessStory,
} from "../../../services/auth.service";
import { LuCrown } from "react-icons/lu";
import { FiEye } from "react-icons/fi";
import { getMembershipFromProfile } from "../../../utils/membership";

const formatHeight = (h) => {
  if (!h) return "";
  const [feetStr, inchStr] = String(h).split(".");
  const feet = feetStr;
  const inches = inchStr || "0";
  return `${feet}' ${inches}"`;
};

// Simple static options – must match backend IDs
const MUSIC_OPTIONS = [
  { id: 1, label: "Classical" },
  { id: 2, label: "Rock" },
  { id: 3, label: "Folk" },
];

const READING_OPTIONS = [
  { id: 1, label: "Fiction" },
  { id: 2, label: "Non Fiction" },
  { id: 3, label: "Biographies" },
];

const DRINKING_OPTIONS = ["never", "occasionally", "regular"];

const UserProfile = () => {
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [membership, setMembership] = useState({
    type: "free",
    isPremium: false,
    planName: null,
    planLimit: 0,
    contactViewed: 0,
    contactRemaining: 0,
    expiryDate: null,
  });

  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState("");
  const [saveSuccess, setSaveSuccess] = useState("");

  // --- User Images ---
  const [images, setImages] = useState([]);
  const [imagesLoading, setImagesLoading] = useState(false);
  const [imageError, setImageError] = useState("");
  const [deleting, setDeleting] = useState(false);

  // Editable form state – includes all profile fields we show
  const [form, setForm] = useState({
    user: { name: "", address: "" },

    this_account_for: "",
    city: "",
    state: "",
    country: "",
    description: "",
    education: "",
    course_degree: "",
    college: "",
    passing_year: "",
    occupation: "",
    annual_income: "",

    family_status: "",
    family_worth: "",
    mother_tongue: "",
    physical_status: "",
    children_count: "",
    willing_inter_caste: "",
    date_of_birth: "",

    lifestyle: {
      music_genre_ids: [],
      reading_preference_ids: [],
      drinking: "",
      fitness_activity: "",
      spoken_languages: "",
      eating_habits: "",
      cooking: false,
      time_of_birth: "",
      place_of_birth: "",
      nakshatra: "",
      rashi: "",
    },
  });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        setError("");

        const token = localStorage.getItem("token");
        if (!token) {
          setError("Please login to view profile.");
          return;
        }

        const res = await getUserProfile(token);
        const resp = res.response || null;
        setData(resp);

        if (resp) {
          const m = getMembershipFromProfile(resp);
          setMembership(m);

          const ls = resp.lifestyle || {};

          // Initialise editable form from response
          setForm({
            user: {
              name: resp.user?.name || "",
              address: resp.user?.address || "",
            },
            this_account_for: resp.this_account_for || "",
            city: resp.city || "",
            state: resp.state || "",
            country: resp.country || "",
            description: resp.description || "",
            education: resp.education || "",
            religion_name: resp.religion?.name || "", // Fix: extract from object
  caste_name: resp.caste?.name || "",       // Fix: extract from object
  sub_caste: resp.sub_caste || "",
            course_degree: resp.course_degree || "",
            college: resp.college || "",
            passing_year: resp.passing_year || "",
            occupation: resp.occupation || "",
            annual_income: resp.annual_income || "",

            family_status: resp.family_status || "",
            family_worth: resp.family_worth || "",
            mother_tongue: resp.mother_tongue || "",
            physical_status: resp.physical_status || "",
            children_count:
              resp.children_count === null || resp.children_count === undefined
                ? ""
                : String(resp.children_count),
            willing_inter_caste:
              resp.willing_inter_caste === null ||
              resp.willing_inter_caste === undefined
                ? ""
                : resp.willing_inter_caste
                  ? "Yes"
                  : "No",
            date_of_birth: resp.date_of_birth || "",

            lifestyle: {
              // if backend later sends *_ids, this will prefill
              music_genre_ids: ls.music_genre_ids || [],
              reading_preference_ids: ls.reading_preference_ids || [],
              drinking: ls.drinking || "",
              fitness_activity: ls.fitness_activity || "",
              spoken_languages: ls.spoken_languages || "",
              eating_habits: ls.eating_habits || "",
              cooking: !!ls.cooking,
              time_of_birth: ls.time_of_birth || "",
              place_of_birth: ls.place_of_birth || "",
              nakshatra: ls.nakshatra || "",
              rashi: ls.rashi || "",
                college: ls.college || "", 
  course_degree: ls.course_degree || "",
  passing_year: ls.passing_year ? String(ls.passing_year) : "", 
            },
          });
        }
      } catch (err) {
        console.error("Failed to load user profile:", err);
        setError("Could not load profile. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const profile = data || {};
  const user = profile.user || {};
  const lifestyle = profile.lifestyle || null;

  const imageUrl = user.profile_image || null;

  const handleChange = (path, value) => {
    if (path.startsWith("user.")) {
      const key = path.split(".")[1];
      setForm((prev) => ({
        ...prev,
        user: { ...prev.user, [key]: value },
      }));
    } else if (path.startsWith("lifestyle.")) {
      const key = path.split(".")[1];
      setForm((prev) => ({
        ...prev,
        lifestyle: { ...prev.lifestyle, [key]: value },
      }));
    } else {
      setForm((prev) => ({
        ...prev,
        [path]: value,
      }));
    }
  };

  const toggleMultiId = (listKey, id) => {
    setForm((prev) => {
      const current = prev.lifestyle[listKey] || [];
      const exists = current.includes(id);
      return {
        ...prev,
        lifestyle: {
          ...prev.lifestyle,
          [listKey]: exists
            ? current.filter((x) => x !== id)
            : [...current, id],
        },
      };
    });
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      setSaveError("");
      setSaveSuccess("");

      const token = localStorage.getItem("token");
      if (!token) {
        setSaveError("Please login to update profile.");
        return;
      }

      const payload = {
        user: {
          name: form.user.name,
          address: form.user.address || null,
        },
        this_account_for: form.this_account_for || null,

        city: form.city || null,
        state: form.state || null,
        country: form.country || null,
        description: form.description || null,
        religion_name: form.religion_name || null,
        sub_caste: form.sub_caste || null,
        education: form.education || null,
          college: form.college || null,
  course_degree: form.course_degree || null,
  passing_year: form.passing_year || null,
        occupation: form.occupation || null,
        annual_income: form.annual_income || null,

        family_status: form.family_status || null,
        family_worth: form.family_worth || null,
        mother_tongue: form.mother_tongue || null,
        physical_status: form.physical_status || null,

        children_count:
          form.children_count === ""
            ? null
            : Number.isNaN(Number(form.children_count))
              ? null
              : Number(form.children_count),

        willing_inter_caste:
          form.willing_inter_caste === ""
            ? null
            : form.willing_inter_caste.toLowerCase() === "yes",

        date_of_birth: form.date_of_birth || null,

        lifestyle: {
          music_genre_ids: form.lifestyle.music_genre_ids,
          reading_preference_ids: form.lifestyle.reading_preference_ids,
          drinking: form.lifestyle.drinking || null,
          fitness_activity: form.lifestyle.fitness_activity || null,
          spoken_languages: form.lifestyle.spoken_languages || null,
          eating_habits: form.lifestyle.eating_habits || null,
          cooking: form.lifestyle.cooking,
          time_of_birth: form.lifestyle.time_of_birth || null,
          place_of_birth: form.lifestyle.place_of_birth || null,
          nakshatra: form.lifestyle.nakshatra || null,
          rashi: form.lifestyle.rashi || null,
        },
      };

      const res = await updateUserProfile(payload, token);
      console.log("✅ Profile updated:", res);
      setSaveSuccess("Profile updated successfully.");

      if (res.response) setData(res.response);

      setEditing(false);
    } catch (err) {
      console.error("❌ Failed to update profile:", err);
      setSaveError("Could not update profile. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  useEffect(() => {
    const loadAllImages = async () => {
      try {
        setImagesLoading(true);
        const token = localStorage.getItem("token");
        if (!token) return;

        const imgRes = await getUserImages(token);
        const list = imgRes?.response || imgRes || [];

        const profRes = await getUserProfile(token);
        const mainImg = profRes?.response?.user?.profile_image || null;

        const combined =
          mainImg && !list.find((x) => x.image === mainImg)
            ? [{ id: "profile-main", image: mainImg }, ...list]
            : list;

        setImages(combined);
      } catch (err) {
        console.error("Error loading user images:", err);
        setImageError("Could not load your images.");
      } finally {
        setImagesLoading(false);
      }
    };

    loadAllImages();
  }, []);

  const handleDeleteImage = async (id) => {
    try {
      setDeleting(true);
      const token = localStorage.getItem("token");
      await deleteUserImage(id, token);
      setImages((prev) => prev.filter((img) => img.id !== id));
    } catch (err) {
      console.error("Delete image failed:", err);
      alert("Could not delete this image. Please try again.");
    } finally {
      setDeleting(false);
    }
  };

  // --- Success stories ---
  const [stories, setStories] = useState([]);
  const [storiesLoading, setStoriesLoading] = useState(false);
  const [storyError, setStoryError] = useState("");

  const [storyForm, setStoryForm] = useState({
    groom_name: "",
    bride_name: "",
    wedding_date: "",
    venue: "",
    description: "",
    images: [],
  });
  const [uploadingStory, setUploadingStory] = useState(false);
  const [showStoryForm, setShowStoryForm] = useState(false);

  useEffect(() => {
    const loadStories = async () => {
      try {
        setStoriesLoading(true);
        const token = localStorage.getItem("token");
        if (!token) return;

        const res = await getMySuccessStories(token);
        const list = res?.response || [];
        setStories(list);
      } catch (err) {
        console.error("Error loading success stories:", err);
        setStoryError("Could not load stories.");
      } finally {
        setStoriesLoading(false);
      }
    };

    loadStories();
  }, []);

  const handleStoryFileChange = (e) => {
    const files = Array.from(e.target.files || []);
    setStoryForm((prev) => ({ ...prev, images: files }));
  };

  const handleAddStory = async () => {
    try {
      setUploadingStory(true);
      const token = localStorage.getItem("token");
      if (!token) {
        alert("Please login first.");
        return;
      }

      const formData = new FormData();
      formData.append("groom_name", storyForm.groom_name);
      formData.append("bride_name", storyForm.bride_name);
      formData.append("wedding_date", storyForm.wedding_date);
      formData.append("venue", storyForm.venue);
      formData.append("description", storyForm.description);
      storyForm.images.forEach((file) => formData.append("images", file));

      await addSuccessStory(formData, token);

      const refreshed = await getMySuccessStories(token);
      setStories(refreshed?.response || []);
      setStoryForm({
        groom_name: "",
        bride_name: "",
        wedding_date: "",
        venue: "",
        description: "",
        images: [],
      });
      setShowStoryForm(false);
    } catch (err) {
      console.error("Add story failed:", err);
      alert("Could not upload story. Try again.");
    } finally {
      setUploadingStory(false);
    }
  };

  const handleDeleteStory = async (storyId) => {
    try {
      const confirmDel = window.confirm("Delete this success story?");
      if (!confirmDel) return;
      const token = localStorage.getItem("token");
      if (!token) {
        alert("Please login first.");
        return;
      }
      await deleteSuccessStory(storyId, token);
      setStories((prev) => prev.filter((s) => s.id !== storyId));
    } catch (err) {
      console.error("Delete story failed:", err);
      alert("Could not delete story. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-white pb-20">
      <div className="max-w-md mx-auto min-h-screen bg-white pb-20">
        {/* HEADER */}
        <header className="flex items-center gap-3 px-4 py-3 shadow-sm bg-white">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center"
          >
            <FiArrowLeft className="w-4 h-4 text-navy" />
          </button>
          <h1 className="text-base font-semibold text-navy">My Profile</h1>
          <div className="ml-auto">
            {!loading && !error && data && (
              <button
                type="button"
                onClick={() => setEditing((e) => !e)}
                className="text-[11px] font-semibold text-primary"
              >
                {editing ? "Cancel" : "Edit"}
              </button>
            )}
          </div>
        </header>

        {/* CONTENT */}
        <main className="px-4 py-4 space-y-4">
          {loading && <p className="text-sm text-gray-500">Loading profile…</p>}

          {error && !loading && <p className="text-sm text-red-500">{error}</p>}

          {!loading && !error && data && (
            <>
              <MembershipCard
                membership={membership}
                onUpgradeClick={() => navigate("/home")}
              />

              {/* IMAGE BLOCK */}
              <section className="rounded-3xl bg-[#F5F7FA] overflow-hidden shadow-sm h-64">
                {imagesLoading && (
                  <div className="h-full flex items-center justify-center text-gray-500 text-[11px]">
                    Loading photos…
                  </div>
                )}

                {!imagesLoading && images.length === 0 && (
                  <div className="h-full flex flex-col items-center justify-center text-gray-400">
                    <FiImage className="w-10 h-10 mb-2" />
                    <p className="text-[11px]">Add profile photos from Home</p>
                  </div>
                )}

                {!imagesLoading && images.length > 0 && (
                  <div className="relative h-full">
                    <div
                      className="flex gap-2 h-full overflow-x-auto scroll-smooth snap-x snap-mandatory scrollbar-hide"
                      style={{ scrollSnapType: "x mandatory" }}
                    >
                      {images.map((img, idx) => (
                        <div
                          key={img.id || idx}
                          className="relative flex-shrink-0 w-full h-full snap-start rounded-3xl overflow-hidden"
                        >
                          <img
                            src={img.image}
                            alt={`User photo ${idx + 1}`}
                            className="w-full h-full object-cover"
                          />

                          {editing && (
                            <button
                              type="button"
                              onClick={() =>
                                img.id !== "profile-main" &&
                                handleDeleteImage(img.id)
                              }
                              disabled={deleting || img.id === "profile-main"}
                              className={`absolute top-2 right-2 w-8 h-8 rounded-full flex items-center justify-center text-white shadow transition ${
                                img.id === "profile-main"
                                  ? "bg-gray-400/50 cursor-not-allowed"
                                  : "bg-black/50 hover:bg-red-600"
                              }`}
                              title={
                                img.id === "profile-main"
                                  ? "Main photo"
                                  : "Delete photo"
                              }
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                className="w-4 h-4"
                              >
                                <line x1="18" y1="6" x2="6" y2="18" />
                                <line x1="6" y1="6" x2="18" y2="18" />
                              </svg>
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </section>

              {/* PROFILE SUMMARY – ID + LOCATION ONLY (no duplicated fields) */}
              <section className="bg-white rounded-3xl shadow-sm border border-gray-100 p-4 text-[11px] space-y-3">
                <p className="text-[10px] text-red-500 font-semibold">
                  Profile ID:{" "}
                  <span className="text-gray-950">
                    {user?.unique_id || "-"}
                  </span>
                </p>

                {/* Location */}
                <div className="flex items-center gap-2">
                  <FiMapPin className="w-3 h-3 text-primary" />
                  <p className="text-gray-700">
                    {[profile.city, profile.state, profile.country]
                      .filter(Boolean)
                      .join(", ") || "Location not specified"}
                  </p>
                </div>

                {/* Description / About */}
                <div className="flex items-start gap-2">
                  {/* <FiFileText className="w-8 h-7 text-primary mt-[2px]" /> */}
                  <div>
                    <p className="text-[10px] font-semibold text-gray-700 mb-0.5">
                      About :{" "}
                      <span className="text-red-500 ml-1">
                        {profile.user.name}
                      </span>
                    </p>
                    {editing ? (
                      <textarea
                        className="w-full border rounded-xl px-3 py-2 text-[11px] bg-white text-gray-800 min-h-[60px] focus:ring-1 focus:ring-primary focus:outline-none"
                        value={form.description || ""}
                        onChange={(e) =>
                          handleChange("description", e.target.value)
                        }
                      />
                    ) : (
                      <p className="text-gray-600 leading-snug">
                        {profile.description || "No description added yet."}
                      </p>
                    )}
                  </div>
                </div>
              </section>

              {/* BASIC DETAILS (EDITABLE) */}
              <section className="bg-white rounded-3xl shadow-sm border border-gray-100 p-4 text-[11px] space-y-2">
                <p className="text-sm font-semibold text-navy mb-1">
                  Basic Details
                </p>

                <div className="space-y-1.5">
                  <LabeledInput
                    label="Name"
                    value={editing ? form.user.name : user.name}
                    onChange={(v) => editing && handleChange("user.name", v)}
                    disabled={!editing}
                  />
                  <LabeledInput
                    label="Address"
                    value={editing ? form.user.address : user.address || ""}
                    onChange={(v) => editing && handleChange("user.address", v)}
                    disabled={!editing}
                  />
                  <LabeledInput
                    label="Profile for"
                    value={
                      editing
                        ? form.this_account_for
                        : profile.this_account_for || ""
                    }
                    onChange={(v) =>
                      editing && handleChange("this_account_for", v)
                    }
                    disabled={!editing}
                  />
                  <LabeledInput
                    label="City"
                    value={editing ? form.city : profile.city || ""}
                    onChange={(v) => editing && handleChange("city", v)}
                    disabled={!editing}
                  />
                  <LabeledInput
                    label="State"
                    value={editing ? form.state : profile.state || ""}
                    onChange={(v) => editing && handleChange("state", v)}
                    disabled={!editing}
                  />
                  <LabeledInput
                    label="Country"
                    value={editing ? form.country : profile.country || ""}
                    onChange={(v) => editing && handleChange("country", v)}
                    disabled={!editing}
                  />
  {/* Inside BASIC DETAILS SECTION */}
<LabeledInput
  label="Religion"
  value={editing ? form.religion_name : profile.religion?.name || ""}
  disabled={true} 
/>
<LabeledInput
  label="Caste"
  value={editing ? form.caste_name : profile.caste?.name || ""}
  disabled={true}
/>
<LabeledInput
  label="Sub Caste"
  value={editing ? form.sub_caste : profile.sub_caste || ""}
  onChange={(v) => editing && handleChange("sub_caste", v)}
  disabled={!editing}
/>

                </div>
              </section>

              {/* EDUCATION & CAREER (EDITABLE, no duplicates in Basic) */}
              <section className="bg-white rounded-3xl shadow-sm border border-gray-100 p-4 text-[11px] space-y-2">
                <p className="text-sm font-semibold text-navy mb-1">
                  Education & Career
                </p>

                <div className="space-y-1.5">
                  <LabeledInput
                    label="Highest Education"
                    value={editing ? form.education : profile.education || ""}
                    onChange={(v) => editing && handleChange("education", v)}
                    disabled={!editing}
                  />
                  <LabeledInput
                    label="Degree"
                    value={
                      editing ? form.course_degree : lifestyle?.course_degree || ""
                    }
                    onChange={(v) =>
                      editing && handleChange("course_degree", v)
                    }
                    disabled={!editing}
                  />
                  <LabeledInput
  label="College"
  value={editing ? form.college : lifestyle?.college || ""}
  onChange={(v) => editing && handleChange("college", v)}
  disabled={!editing}
/>
<LabeledInput
  label="Passing Year"
  value={editing ? form.passing_year : String(lifestyle?.passing_year || "")}
  onChange={(v) => editing && handleChange("passing_year", v)}
  disabled={!editing}
/>
                  <LabeledInput
                    label="Occupation"
                    value={editing ? form.occupation : profile.occupation || ""}
                    onChange={(v) => editing && handleChange("occupation", v)}
                    disabled={!editing}
                  />
                  <LabeledInput
                    label="Annual Income"
                    value={
                      editing ? form.annual_income : profile.annual_income || ""
                    }
                    onChange={(v) =>
                      editing && handleChange("annual_income", v)
                    }
                    disabled={!editing}
                  />
                </div>
              </section>

              {/* LIFESTYLE & INTERESTS (EDITABLE) */}
              <section className="bg-white rounded-3xl shadow-sm border border-gray-100 p-4 text-[11px] space-y-3">
                <p className="text-sm font-semibold text-navy mb-1">
                  Lifestyle & Interests
                </p>

                {/* Music genres */}
                <div>
                  <p className="text-[11px] font-semibold text-gray-700 mb-1">
                    Music genres
                  </p>
                  <div className="flex flex-wrap gap-1">
                    {MUSIC_OPTIONS.map((opt) => {
                      const selected = form.lifestyle.music_genre_ids.includes(
                        opt.id,
                      );
                      return (
                        <button
                          key={opt.id}
                          type="button"
                          disabled={!editing}
                          onClick={() =>
                            editing && toggleMultiId("music_genre_ids", opt.id)
                          }
                          className={`px-2 py-0.5 rounded-full border text-[10px] ${
                            selected
                              ? "bg-primary text-white border-primary"
                              : "bg-gray-50 text-gray-600 border-gray-200"
                          }`}
                        >
                          {opt.label}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Reading preferences */}
                <div>
                  <p className="text-[11px] font-semibold text-gray-700 mb-1">
                    Reading preferences
                  </p>
                  <div className="flex flex-wrap gap-1">
                    {READING_OPTIONS.map((opt) => {
                      const selected =
                        form.lifestyle.reading_preference_ids.includes(opt.id);
                      return (
                        <button
                          key={opt.id}
                          type="button"
                          disabled={!editing}
                          onClick={() =>
                            editing &&
                            toggleMultiId("reading_preference_ids", opt.id)
                          }
                          className={`px-2 py-0.5 rounded-full border text-[10px] ${
                            selected
                              ? "bg-primary text-white border-primary"
                              : "bg-gray-50 text-gray-600 border-gray-200"
                          }`}
                        >
                          {opt.label}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Drinking */}
                <div>
                  <p className="text-[11px] font-semibold text-gray-700 mb-1">
                    Drinking
                  </p>
                  <div className="flex flex-wrap gap-1">
                    {DRINKING_OPTIONS.map((opt) => {
                      const selected = form.lifestyle.drinking === opt;
                      return (
                        <button
                          key={opt}
                          type="button"
                          disabled={!editing}
                          onClick={() =>
                            editing && handleChange("lifestyle.drinking", opt)
                          }
                          className={`px-2 py-0.5 rounded-full border text-[10px] ${
                            selected
                              ? "bg-primary text-white border-primary"
                              : "bg-gray-50 text-gray-600 border-gray-200"
                          }`}
                        >
                          {opt}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Fitness activity */}
                <LabeledInput
                  label="Fitness activity"
                  value={
                    editing
                      ? form.lifestyle.fitness_activity
                      : lifestyle?.fitness_activity || ""
                  }
                  onChange={(v) =>
                    editing && handleChange("lifestyle.fitness_activity", v)
                  }
                  disabled={!editing}
                />

                {/* Languages */}
                <LabeledInput
                  label="Languages you speak"
                  value={
                    editing
                      ? form.lifestyle.spoken_languages
                      : lifestyle?.spoken_languages || ""
                  }
                  onChange={(v) =>
                    editing && handleChange("lifestyle.spoken_languages", v)
                  }
                  disabled={!editing}
                />

                {/* Eating habits */}
                <LabeledInput
                  label="Eating habits"
                  value={
                    editing
                      ? form.lifestyle.eating_habits
                      : lifestyle?.eating_habits || ""
                  }
                  onChange={(v) =>
                    editing && handleChange("lifestyle.eating_habits", v)
                  }
                  disabled={!editing}
                />

                {/* Cooking */}
                <div>
                  <p className="text-[11px] font-semibold text-gray-700 mb-0.5">
                    Cooking
                  </p>
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      disabled={!editing}
                      checked={
                        editing ? form.lifestyle.cooking : !!lifestyle?.cooking
                      }
                      onChange={(e) =>
                        editing &&
                        handleChange("lifestyle.cooking", e.target.checked)
                      }
                      className="w-3 h-3"
                    />
                    <span className="text-[11px] text-gray-700">
                      I like cooking
                    </span>
                  </div>
                </div>
              </section>

              {/* FAMILY DETAILS (EDITABLE) */}
              <section className="bg-white rounded-3xl shadow-sm border border-gray-100 p-4 text-[11px] space-y-2">
                <p className="text-sm font-semibold text-navy mb-1">
                  Family Details
                </p>

                <div className="space-y-1.5">
                  <LabeledInput
                    label="Family Status"
                    value={
                      editing ? form.family_status : profile.family_status || ""
                    }
                    onChange={(v) =>
                      editing && handleChange("family_status", v)
                    }
                    disabled={!editing}
                  />
                  <LabeledInput
                    label="Family Worth"
                    value={
                      editing ? form.family_worth : profile.family_worth || ""
                    }
                    onChange={(v) => editing && handleChange("family_worth", v)}
                    disabled={!editing}
                  />
                  <LabeledInput
                    label="Mother Tongue"
                    value={
                      editing ? form.mother_tongue : profile.mother_tongue || ""
                    }
                    onChange={(v) =>
                      editing && handleChange("mother_tongue", v)
                    }
                    disabled={!editing}
                  />
                  <LabeledInput
                    label="Physical Status"
                    value={
                      editing
                        ? form.physical_status
                        : profile.physical_status || ""
                    }
                    onChange={(v) =>
                      editing && handleChange("physical_status", v)
                    }
                    disabled={!editing}
                  />
                  <LabeledInput
                    label="Children (count)"
                    value={
                      editing
                        ? form.children_count
                        : profile.children_count === null ||
                            profile.children_count === undefined
                          ? ""
                          : String(profile.children_count)
                    }
                    onChange={(v) =>
                      editing && handleChange("children_count", v)
                    }
                    disabled={!editing}
                  />
                  <LabeledInput
                    label="Inter-caste (Yes/No)"
                    value={
                      editing
                        ? form.willing_inter_caste
                        : profile.willing_inter_caste === null ||
                            profile.willing_inter_caste === undefined
                          ? ""
                          : profile.willing_inter_caste
                            ? "Yes"
                            : "No"
                    }
                    onChange={(v) =>
                      editing && handleChange("willing_inter_caste", v)
                    }
                    disabled={!editing}
                  />
                </div>
              </section>

              {/* BIRTH & HOROSCOPE (EDITABLE) */}
              <section className="bg-white rounded-3xl shadow-sm border border-gray-100 p-4 text-[11px] space-y-2">
                <p className="text-sm font-semibold text-navy mb-1">
                  Birth & Horoscope
                </p>

                <div className="space-y-1.5">
                  <LabeledInput
                    label="Date of Birth"
                    value={
                      editing ? form.date_of_birth : profile.date_of_birth || ""
                    }
                    onChange={(v) =>
                      editing && handleChange("date_of_birth", v)
                    }
                    disabled={!editing}
                  />
                  <LabeledInput
                    label="Time of Birth"
                    value={
                      editing
                        ? form.lifestyle.time_of_birth
                        : lifestyle?.time_of_birth || ""
                    }
                    onChange={(v) =>
                      editing && handleChange("lifestyle.time_of_birth", v)
                    }
                    disabled={!editing}
                  />
                  <LabeledInput
                    label="Place of Birth"
                    value={
                      editing
                        ? form.lifestyle.place_of_birth
                        : lifestyle?.place_of_birth || ""
                    }
                    onChange={(v) =>
                      editing && handleChange("lifestyle.place_of_birth", v)
                    }
                    disabled={!editing}
                  />
                  <LabeledInput
                    label="Nakshatra"
                    value={
                      editing
                        ? form.lifestyle.nakshatra
                        : lifestyle?.nakshatra || ""
                    }
                    onChange={(v) =>
                      editing && handleChange("lifestyle.nakshatra", v)
                    }
                    disabled={!editing}
                  />
                  <LabeledInput
                    label="Rashi"
                    value={
                      editing ? form.lifestyle.rashi : lifestyle?.rashi || ""
                    }
                    onChange={(v) =>
                      editing && handleChange("lifestyle.rashi", v)
                    }
                    disabled={!editing}
                  />
                </div>
              </section>

              {/* SAVE SECTION – single place to save all editable fields */}
              {(editing || saveError || saveSuccess) && (
                <section className="bg-white rounded-3xl shadow-sm border border-gray-100 p-4 text-[11px] space-y-2">
                  {saveError && (
                    <p className="text-[11px] text-red-500">{saveError}</p>
                  )}
                  {saveSuccess && (
                    <p className="text-[11px] text-green-600">{saveSuccess}</p>
                  )}

                  {editing && (
                    <button
                      type="button"
                      onClick={handleSave}
                      disabled={saving}
                      className="mt-1 w-full bg-primary text-white py-2.5 rounded-full text-[12px] font-semibold shadow disabled:opacity-60"
                    >
                      {saving ? "Saving..." : "Save Changes"}
                    </button>
                  )}
                </section>
              )}
            </>
          )}

          {/* SUCCESS STORIES */}
          <section className="bg-white rounded-3xl shadow-sm border border-gray-100 p-4 text-[11px] space-y-3">
            <div className="flex justify-between items-center">
              <p className="text-sm font-semibold text-navy flex items-center gap-1">
                <FiHeart className="text-primary" />  Your Success Stories
              </p>
              <button
                type="button"
                onClick={() => setShowStoryForm((s) => !s)}
                className="flex items-center gap-1 text-[11px] font-semibold text-primary"
              >
                <FiPlusCircle className="w-3 h-3" />
                Add
              </button>
            </div>

            {storiesLoading && (
              <p className="text-center text-gray-500 text-[11px]">
                Loading stories…
              </p>
            )}
            {storyError && (
              <p className="text-center text-red-500 text-[11px]">
                {storyError}
              </p>
            )}

            {!storiesLoading && stories.length === 0 && !storyError && (
              <p className="text-center text-gray-500 text-[11px]">
                You haven’t shared any success stories yet.
              </p>
            )}

            {/* List */}
            <div className="space-y-3">
              {stories.map((s) => (
                <div
                  key={s.id}
                  className="relative border border-gray-100 rounded-2xl p-3 shadow-sm"
                >
                  {editing && (
                    <button
                      type="button"
                      onClick={() => handleDeleteStory(s.id)}
                      className="absolute top-2 right-2 w-7 h-7 rounded-full bg-black/50 hover:bg-red-600 flex items-center justify-center text-white shadow transition"
                      title="Delete story"
                    >
                      <FiTrash2 className="w-3.5 h-3.5" />
                    </button>
                  )}

                  <p className="text-[12px] font-semibold text-navy pr-6">
                    {s.couple_name || `${s.groom_name} & ${s.bride_name}`}
                  </p>
                  <p className="text-[11px] text-gray-600">{s.venue}</p>
                  <p className="text-[10px] text-gray-500 mb-1">
                    {s.wedding_date} • {s.created_at}
                  </p>
                  <p className="text-[11px] text-gray-700 leading-snug break-all whitespace-normal">
                    {s.description}
                  </p>

                  {s.images && s.images.length > 0 && (
                    <div className="mt-2 flex gap-2 overflow-x-auto scrollbar-hide">
                      {s.images.map((obj, i) => (
                        <img
                          key={obj.id || i}
                          src={obj.image}
                          alt="story"
                          className="w-24 h-24 object-cover rounded-xl border"
                          onError={(e) =>
                            (e.currentTarget.style.display = "none")
                          }
                        />
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Add new story form */}
            {showStoryForm && (
              <div className="mt-3 border-t border-gray-100 pt-3 space-y-2">
                <LabeledInput
                  label="Groom Name"
                  value={storyForm.groom_name}
                  onChange={(v) =>
                    setStoryForm((prev) => ({ ...prev, groom_name: v }))
                  }
                />
                <LabeledInput
                  label="Bride Name"
                  value={storyForm.bride_name}
                  onChange={(v) =>
                    setStoryForm((prev) => ({ ...prev, bride_name: v }))
                  }
                />
                <div>
                  <p className="text-[11px] font-semibold text-gray-700 mb-0.5">
                    Wedding Date
                  </p>
                  <input
                    type="date"
                    value={storyForm.wedding_date || ""}
                    onChange={(e) =>
                      setStoryForm((prev) => ({
                        ...prev,
                        wedding_date: e.target.value,
                      }))
                    }
                    className="w-full border rounded-xl px-3 py-2 text-[11px] bg-white text-gray-800 focus:ring-1 focus:ring-primary focus:outline-none"
                  />
                </div>

                <LabeledInput
                  label="Venue"
                  value={storyForm.venue}
                  onChange={(v) =>
                    setStoryForm((prev) => ({ ...prev, venue: v }))
                  }
                />
                <div>
                  <p className="text-[11px] font-semibold text-gray-700 mb-0.5">
                    Description
                  </p>
                  <textarea
                    value={storyForm.description}
                    onChange={(e) =>
                      setStoryForm((prev) => ({
                        ...prev,
                        description: e.target.value,
                      }))
                    }
                    className="w-full border rounded-xl px-3 py-2 text-[11px] bg-white text-gray-800 min-h-[60px]"
                  ></textarea>
                </div>

                <div>
                  <p className="text-[11px] font-semibold text-gray-700 mb-0.5">
                    Upload Images (max 3)
                  </p>
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleStoryFileChange}
                    className="text-[10px]"
                  />
                  {storyForm.images.length > 0 && (
                    <p className="text-[10px] text-gray-500 mt-0.5">
                      {storyForm.images.length} file(s) selected
                    </p>
                  )}
                </div>

                <button
                  type="button"
                  onClick={handleAddStory}
                  disabled={uploadingStory}
                  className="w-full bg-primary text-white py-2.5 rounded-full text-[12px] font-semibold shadow disabled:opacity-60"
                >
                  {uploadingStory ? "Uploading..." : "Submit Story"}
                </button>
              </div>
            )}
          </section>
        </main>
<div className="pt-10 pb-10 px-4">
  <button 
    onClick={() => navigate("/deleteacc")}
    className="w-full flex items-center justify-center gap-2 text-red-500 text-xs font-semibold py-4 border border-red-100 rounded-2xl bg-red-100"
  >
    <FiTrash2 /> Delete My Account
  </button>
</div>
        <BottomNav />
      </div>
    </div>
  );
};

const LabeledInput = ({ label, value, onChange, disabled }) => (
  <div>
    <p className="text-[11px] font-semibold text-gray-700 mb-0.5">{label}</p>
    <input
      type="text"
      value={value || ""}
      onChange={(e) => onChange && onChange(e.target.value)}
      disabled={disabled}
      className={`w-full border rounded-xl px-3 py-2 text-[11px] ${
        disabled
          ? "bg-gray-100 text-gray-500 cursor-not-allowed"
          : "bg-white text-gray-800"
      }`}
    />
  </div>
);

const FREE_CONTACT_LIMIT = 5;

const MembershipCard = ({ membership, onUpgradeClick }) => {
  const {
    isPremium,
    planName,
    planLimit,
    contactViewed,
    contactRemaining,
    expiryDate,
  } = membership;

  const expiryText = expiryDate
    ? expiryDate.toLocaleDateString(undefined, {
        year: "numeric",
        month: "short",
        day: "numeric",
      })
    : null;

  const used = contactViewed || 0;
  const totalForPremium =
    planLimit || (contactViewed || 0) + (contactRemaining || 0);
  const total = isPremium ? totalForPremium : FREE_CONTACT_LIMIT;
  const remaining = isPremium
    ? contactRemaining
    : Math.max(0, FREE_CONTACT_LIMIT - used);
  const progressPercent = total > 0 ? Math.min(100, (used / total) * 100) : 0;

  if (!isPremium) {
    return (
      <section className="rounded-2xl bg-gradient-to-r from-[#FFF7E9] via-[#FFF9F1] to-[#FFFFFF] border border-[#FFE0B2] px-4 py-3 text-[11px] shadow-sm">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-full bg-[#FFE7C2] flex items-center justify-center">
              <FiEye className="w-3.5 h-3.5 text-[#B36A1E]" />
            </div>
            <div>
              <p className="text-[12px] font-semibold text-navy">
                Membership: Free Trial
              </p>
              {/* <p className="text-[10px] text-gray-600">
                Limited access to contacts & chat.
              </p> */}
            </div>
          </div>

          <span className="px-2 py-0.5 rounded-full bg-white text-[10px] font-semibold text-[#B36A1E] border border-[#F5C58B]">
            Free Trial
          </span>
        </div>

        {/* <div className="mt-1">
          <p className="text-[10px] text-gray-700 mb-1 font-medium">
            Contact reveal attempts
          </p>
          <div className="flex items-center justify-between mb-1">
            <span className="text-[10px] text-gray-700">
              Used: <span className="font-semibold">{used}</span> /{" "}
              <span className="font-semibold">{FREE_CONTACT_LIMIT}</span>
            </span>
            <span className="text-[10px] text-gray-700">
              Remaining: <span className="font-semibold">{remaining}</span>
            </span>
          </div>
          <div className="w-full h-1.5 rounded-full bg-gray-200 overflow-hidden">
            <div
              className="h-full bg-primary"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
          <p className="text-[10px] text-gray-500 mt-1">
            You have <span className="font-semibold">5 lifetime attempts</span>{" "}
            to reveal contacts. After that, you’ll need to upgrade to view more
            contact details.
          </p>
        </div> */}

        <div className="mt-2 rounded-2xl bg-white/80 border border-[#FAD1E5] px-3 py-2">
          <p className="text-[10px] text-gray-700">
            Upgrade to Premium to unlock{" "}
            <span className="font-semibold">
              priority visibility, premium chat, and higher chances of
              responses.
            </span>
          </p>
        </div>

        <button
          type="button"
          onClick={onUpgradeClick}
          className="mt-2 w-full bg-primary text-white py-2.5 rounded-full text-[12px] font-semibold shadow hover:bg-primary/90 active:scale-[0.99] transition"
        >
          View Premium Plans
        </button>
      </section>
    );
  }

  return (
    <section className="rounded-2xl bg-gradient-to-r from-[#FFE6F4] via-[#FFF2DD] to-[#FFFFFF] border border-[#F8C3E8] px-4 py-3 text-[11px] shadow-sm">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-full bg-white flex items-center justify-center shadow-sm">
            <LuCrown className="w-4 h-4 text-primary" />
          </div>
          <div>
            <p className="text-[12px] font-semibold text-navy">
              Premium Member
            </p>
            <p className="text-[10px] text-gray-600">
              Plan:{" "}
              <span className="font-semibold">
                {planName?.toUpperCase() || "PREMIUM"}
              </span>
            </p>
          </div>
        </div>

        <span className="px-2 py-0.5 rounded-full bg-white text-[10px] font-semibold text-primary border border-primary/30">
          Active
        </span>
      </div>

      <div className="flex items-center flex-wrap gap-2 mb-2">
        <div className="px-2.5 py-1 rounded-full bg-white/80 border border-white text-[10px] text-gray-800 flex items-center gap-1">
          <FiEye className="w-3.5 h-3.5 text-primary" />
          <span>
            Total contacts:{" "}
            <span className="font-semibold">{total || "-"}</span>
          </span>
        </div>
        <div className="px-2.5 py-1 rounded-full bg-white/80 border border-white text-[10px] text-gray-800">
          Remaining: <span className="font-semibold">{remaining}</span>
        </div>
        {expiryText && (
          <div className="px-2.5 py-1 rounded-full bg-white/70 border border-white text-[10px] text-gray-700">
            Valid till: <span className="font-semibold">{expiryText}</span>
          </div>
        )}
      </div>

      {total > 0 && (
        <div className="mb-1">
          <div className="w-full h-1.5 rounded-full bg-gray-200 overflow-hidden">
            <div
              className="h-full bg-primary"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
          <p className="text-[10px] text-gray-600 mt-1">
            You’ve used{" "}
            <span className="font-semibold">
              {used}/{total}
            </span>{" "}
            contact views in this plan.
          </p>
        </div>
      )}

      <p className="text-[10px] text-gray-700 mt-1">
        As a Premium member, you have extended contact access and{" "}
        <span className="font-semibold">
          full chat with compatible premium matches
        </span>{" "}
        on Sindhuura.
      </p>
    </section>
  );
};

export default UserProfile;
