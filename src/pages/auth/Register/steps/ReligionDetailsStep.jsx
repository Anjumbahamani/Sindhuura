

import React, { useState, useEffect } from "react";
import apiClient from "../../../../services/apiClient";
import { API_ROUTES } from "../../../../constants/ApiRoutes";

/*
  Backend:
  GET api/auth/religions/
  GET api/auth/castes/?religion_id=<id>
*/

const ReligionDetailsStep = ({ data, setData, onNext, onBack }) => {
  const initial = data.religionDetails || {};

  const [religions, setReligions] = useState([]);
  const [castes, setCastes] = useState([]);


  const [religionId, setReligionId] = useState(initial.religionId || null);
  const [religionName, setReligionName] = useState(initial.religionName || "");

  const [casteId, setCasteId] = useState(initial.casteId || null);
  const [casteName, setCasteName] = useState(initial.casteName || "");

  const [subCaste, setSubCaste] = useState(initial.subCaste || "");
  const [anyCaste, setAnyCaste] = useState(!!initial.anyCaste);

  const [drawer, setDrawer] = useState(null); // "religion" | "caste" | null
  const [loadingReligions, setLoadingReligions] = useState(false);
  const [loadingCastes, setLoadingCastes] = useState(false);

  // Fetch religions on mount
  useEffect(() => {
    const fetchReligions = async () => {
      try {
        setLoadingReligions(true);
        const res = await apiClient(API_ROUTES.AUTH.RELIGIONS, {
          method: "GET",
        });
        // assuming { status, message, response: [...] }
        setReligions(res.response || []);
      } catch (err) {
        console.error("Failed to load religions", err);
      } finally {
        setLoadingReligions(false);
      }
    };

    fetchReligions();
  }, []);

  // Fetch castes when a religion is selected
  useEffect(() => {
    const fetchCastes = async () => {
      if (!religionId) {
        setCastes([]);
        return;
      }

      try {
        setLoadingCastes(true);
        const url = `${API_ROUTES.AUTH.CASTES}?religion_id=${religionId}`;
        const res = await apiClient(url, { method: "GET" });
        setCastes(res.response || []);
      } catch (err) {
        console.error("Failed to load castes", err);
      } finally {
        setLoadingCastes(false);
      }
    };

    fetchCastes();
  }, [religionId]);

  const handleNext = () => {
    setData((prev) => ({
      ...prev,
      religionDetails: {
        religionId,
        religionName,
        casteId: anyCaste ? null : casteId,
        casteName: anyCaste ? "Any" : casteName,
        subCaste,
        anyCaste,
      },
    }));
    onNext();
  };

  const handleSelectReligion = (item) => {
    const name = (item.name || "").trim();
    setReligionId(item.id);
    setReligionName(item.name.trim());
        setReligionName(name);
    // reset caste
    setCasteId(null);
    setCasteName("");
    setAnyCaste(false);
    setDrawer(null);
  };

  const handleSelectCaste = (item) => {
    const name = (item.name || "").trim();
    setCasteId(item.id);
    setCasteName(name);
    setDrawer(null);
  };

  const canContinue = !!religionId && (anyCaste || !!casteId);

  return (
    <div className="min-h-screen bg-white flex flex-col">

      {/* ---------- HEADER ---------- */}
      <div className="flex items-center gap-3 px-4 py-4 border-b">
        <button onClick={onBack}>←</button>
        <h1 className="text-base font-semibold text-navy">
          Religious Details (2/5)
        </h1>
      </div>

      {/* ---------- CONTENT ---------- */}
      <div className="flex-1 px-4 py-6 space-y-6">

        {/* Religion */}
        <div>
          <label className="text-sm font-medium text-gray-700 mb-2 block">
            Religion
          </label>
          <button
            onClick={() => setDrawer("religion")}
            className="w-full border rounded-xl px-4 py-3
                       flex justify-between items-center"
          >
            <span className={religionName ? "text-gray-800" : "text-gray-400"}>
              {loadingReligions
                ? "Loading..."
                : religionName || "Select religion"}
            </span>
            <span className="text-gray-400">›</span>
          </button>
        </div>

        {/* Caste (only after religion) */}
        {religionId && (
          <div>
            <label className="text-sm font-medium text-gray-700 mb-2 block">
              Caste
            </label>
            <button
              onClick={() => setDrawer("caste")}
              disabled={anyCaste || loadingCastes}
              className={`w-full border rounded-xl px-4 py-3
                          flex justify-between items-center
                          ${anyCaste && "bg-gray-100 text-gray-400"}`}
            >
              <span>
                {anyCaste
                  ? "Any caste"
                  : loadingCastes
                  ? "Loading..."
                  : casteName || "Select caste"}
              </span>
              <span className="text-gray-400">›</span>
            </button>
          </div>
        )}

        {/* Sub-caste */}
        {religionId && !anyCaste && (
          <div>
            <label className="text-sm font-medium text-gray-700 mb-2 block">
              Sub caste (optional)
            </label>
            <input
              value={subCaste}
              onChange={(e) => setSubCaste(e.target.value)}
              placeholder="Enter sub caste"
              className="w-full border rounded-xl px-4 py-3
                         focus:ring-2 focus:ring-primary outline-none"
            />
          </div>
        )}

        {/* Any caste checkbox */}
        {religionId && (
          <label className="flex items-center gap-3 mt-2">
            <input
              type="checkbox"
              checked={anyCaste}
              onChange={(e) => {
                setAnyCaste(e.target.checked);
                if (e.target.checked) {
                  setCasteId(null);
                  setCasteName("");
                }
              }}
              className="w-5 h-5 accent-primary"
            />
            <span className="text-sm text-gray-700">
              Willing to marry from any caste
            </span>
          </label>
        )}
      </div>

      {/* ---------- FOOTER ---------- */}
      <div className="px-4 py-4 border-t">
        <button
          onClick={handleNext}
          disabled={!canContinue}
          className={`w-full py-4 rounded-xl font-semibold text-base
            ${
              canContinue
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

      {/* ---------- SIDE DRAWER ---------- */}
      {drawer && (
        <div className="fixed inset-0 z-50 bg-black/40">
          <div className="absolute right-0 top-0 h-full w-[90%] bg-white
                          shadow-lg flex flex-col">

            <div className="px-4 py-4 border-b flex justify-between items-center">
              <h3 className="text-base font-semibold capitalize">
                Select {drawer}
              </h3>
              <button onClick={() => setDrawer(null)}>✕</button>
            </div>

            <div className="flex-1 overflow-y-auto">
              {(drawer === "religion" ? religions : castes).map((item) => (
                <button
                  key={item.id}
                  onClick={() =>
                    drawer === "religion"
                      ? handleSelectReligion(item)
                      : handleSelectCaste(item)
                  }
                  className="w-full text-left px-5 py-4 border-b"
                >
                  {item.name?.trim()}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReligionDetailsStep;