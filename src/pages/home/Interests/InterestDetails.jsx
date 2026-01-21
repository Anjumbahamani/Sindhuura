import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FiArrowLeft, FiMapPin } from "react-icons/fi";
import BottomNav from "../../../components/BottomNav";
import { getInterestDetails } from "../../../services/match.service";

const InterestDetails = () => {
  const { userId } = useParams(); // ✅ only param
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!userId) {
      setError("Invalid profile");
      setLoading(false);
      return;
    }

    const fetchDetails = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await getInterestDetails(userId, token); // ✅ FIX
        setUser(res.response);
      } catch (err) {
        console.error(err);
        setError("Failed to load profile details");
      } finally {
        setLoading(false);
      }
    };

    fetchDetails();
  }, [userId]); // ✅ FIX

  if (loading) {
    return <p className="p-4 text-sm text-gray-500">Loading details…</p>;
  }

  if (error) {
    return <p className="p-4 text-sm text-red-500">{error}</p>;
  }

  const profile = user.profile || {};

  return (
    <div className="min-h-screen bg-white pb-20">
      <div className="max-w-md mx-auto">

        {/* HEADER */}
        <div className="flex items-center gap-2 px-4 pt-4 pb-2">
          <button onClick={() => navigate(-1)}>
            <FiArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-lg font-semibold text-navy">
            Profile Details
          </h1>
        </div>

        {/* IMAGE */}
        <div className="h-72 bg-gray-200">
          {user.profile_image && (
            <img
              src={user.profile_image}
              alt={user.name}
              className="w-full h-full object-cover"
            />
          )}
        </div>

        {/* INFO */}
        <div className="px-4 py-3">
          <h2 className="text-lg font-semibold text-navy">
            {user.name}
          </h2>

          <p className="text-[12px] text-gray-500 mt-1 flex items-center gap-1">
            <FiMapPin />
            {profile.city}, {profile.state}
          </p>

          <p className="text-[12px] text-gray-600 mt-2">
            Joined on: {new Date(user.date_joined).toLocaleDateString()}
          </p>

          {profile.description && (
            <div className="mt-4">
              <p className="text-[12px] font-semibold text-gray-600 mb-1">
                About
              </p>
              <p className="text-[13px] text-gray-700">
                {profile.description}
              </p>
            </div>
          )}
        </div>
      </div>

      <BottomNav />
    </div>
  );
};

export default InterestDetails;
