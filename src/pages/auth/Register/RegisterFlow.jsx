
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import ProfileForStep from "./steps/ProfileForStep";
import PhoneOtpStep from "./steps/PhoneOtpStep";
import OtpStep from "./steps/Otp";
import PersonalDetailsStep from "./steps/PersonalDetail";
import ReligionDetailsStep from "./steps/ReligionDetailsStep";
import ProfessionalDetailsStep from "./steps/ProfessionalDetailsStep";
import LocationDetailsStep from "./steps/LocationDetailsStep";
import FinalProfileStep from "./steps/FamilyDetail";
import LifestyleDetailsStep from "./steps/LifestyleDetailsStep";
import RegistrationCongrats from "./steps/Congrats";
import { useRegister } from "../../../hooks/useRegister";

const RegisterFlow = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
    const [uniqueId, setUniqueId] = useState(null); 

  const [formData, setFormData] = useState({
    profileFor: "",
    motherTongue: "",
    phone: "",
    otp: "",
  });

  const { submitRegistration } = useRegister();

  const next = () => setStep((s) => s + 1);
  const back = () => {
    if (step === 1) navigate(-1);
    else setStep((s) => s - 1);
  };

  const handleFinalSubmit = async (finalProfile) => {
    const payload = {
      ...formData,
      finalProfile,
    };

    console.log("📤 Final payload (payload):", payload);

    const result = await submitRegistration(payload);

    if (!result.success) {
      console.error("❌ Registration failed:", result.error);
      alert(result.error || "Registration failed");
      return;
    }

    console.log("✅ Registration success:", result.data);

    const apiRes = result.data;
    const accessToken = apiRes?.response?.access_token || null;
   const uniqueIdFromResponse = apiRes?.response?.user?.unique_id || null;

    console.log("🔎 access_token from register response:", accessToken);
  console.log("🆔 unique_id from register response:", uniqueIdFromResponse);
    if (accessToken) {
      localStorage.setItem("token", accessToken);
       localStorage.setItem("unique_id", uniqueIdFromResponse);
      console.log(
        "🔐 Token stored in localStorage after register:",
        localStorage.getItem("token")
      );
    } else {
      console.warn(
        "⚠️ No access_token in register response; lifestyle API will be unauthorized."
      );
    }
  setFormData(prev => ({
    ...prev,
    uniqueId: uniqueIdFromResponse
  }));
    next(); // go to LifestyleDetailsStep
  };

  return (
    <>
      {step === 1 && (
        <ProfileForStep
          data={formData}
          setData={setFormData}
          onNext={next}
          onBack={back}
        />
      )}

      {step === 2 && (
        <PhoneOtpStep
          data={formData}
          setData={setFormData}
          onNext={next}
          onBack={back}
        />
      )}

      {step === 3 && (
        <OtpStep
          data={formData}
          setData={setFormData}
          phone={formData.phone}
          onNext={next}
          onBack={back}
        />
      )}

      {step === 4 && (
        <RegistrationCongrats
          data={formData}
          setData={setFormData}
          onNext={next}
          onBack={back}
        />
      )}

      {step === 5 && (
        <PersonalDetailsStep
          data={formData}
          setData={setFormData}
          onNext={next}
          onBack={back}
        />
      )}

      {step === 6 && (
        <ReligionDetailsStep
          data={formData}
          setData={setFormData}
          onNext={next}
          onBack={back}
        />
      )}

      {step === 7 && (
        <LocationDetailsStep
          data={formData}
          setData={setFormData}
          onNext={next}
          onBack={back}
        />
      )}

      {step === 8 && (
        <ProfessionalDetailsStep
          data={formData}
          setData={setFormData}
          onNext={next}
          onBack={back}
        />
      )}

      {step === 9 && (
        <FinalProfileStep
          data={formData}
          setData={setFormData}
          onBack={back}
          onNext={next}
          onSubmit={handleFinalSubmit}
        />
      )}

      {step === 10 && (
  <LifestyleDetailsStep
    data={formData}
    setData={setFormData}
    onBack={back}
    navigate={navigate} // Pass navigate function directly
    
  />
)}
    </>
  );
};

export default RegisterFlow;
