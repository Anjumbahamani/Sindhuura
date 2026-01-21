// import { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import ProfileForStep from "./steps/ProfileForStep";
// import PhoneOtpStep from "./steps/PhoneOtpStep";
// import OtpStep from "./steps/Otp";
// import PersonalDetailsStep from "./steps/PersonalDetail";
// import ReligionDetailsStep from "./steps/ReligionDetailsStep";
// import ProfessionalDetailsStep from "./steps/ProfessionalDetailsStep";
// import LocationDetailsStep from "./steps/LocationDetailsStep";
// import FinalProfileStep from "./steps/FamilyDetail";
// import LifestyleDetailsStep from "./steps/LifestyleDetailsStep";
// import RegistrationCongrats from "./steps/Congrats";
// import { useRegister } from "../../../hooks/useRegister";


// const RegisterFlow = () => {
//   const navigate = useNavigate();
//   const [step, setStep] = useState(1);

//   const [formData, setFormData] = useState({
//     profileFor: "",
//     motherTongue: "",
//     phone: "",
//     otp: "",
//   });

//   const { submitRegistration } = useRegister();

//   const next = () => setStep((s) => s + 1);
//   const back = () => {
//     if (step === 1) navigate(-1);
//     else setStep((s) => s - 1);
//   };

//   /* ✅ ONLY PLACE WHERE REGISTRATION API IS CALLED */
//   const handleFinalSubmit = async () => {
//     console.log("📤 Final payload:", formData);

//     const result = await submitRegistration(formData);

//     if (result.success) {
//       console.log("🎉 Registration successful");
//       next(); 
//     } else {
//       console.error("❌ Registration failed:", result.error);
//       alert(result.error || "Registration failed");
//     }
//   };

//   return (
//     <>
//       {step === 1 && (
//         <ProfileForStep data={formData} setData={setFormData} onNext={next} onBack={back} />
//       )}

//       {step === 2 && (
//         <PhoneOtpStep data={formData} setData={setFormData}   phone={formData.phone}  onNext={next} onBack={back} />
//       )}

//       {step === 3 && (
//         <OtpStep data={formData} setData={setFormData} onNext={next} onBack={back} />
//       )}

//       {step === 4 && (
//         <RegistrationCongrats data={formData} setData={setFormData} onNext={next} onBack={back} />
//       )}

//       {step === 5 && (
//         <PersonalDetailsStep data={formData} setData={setFormData} onNext={next} onBack={back} />
//       )}

//       {step === 6 && (
//         <ReligionDetailsStep data={formData} setData={setFormData} onNext={next} onBack={back} />
//       )}

//       {step === 7 && (
//         <LocationDetailsStep data={formData} setData={setFormData} onNext={next} onBack={back} />
//       )}

//       {step === 8 && (
//         <ProfessionalDetailsStep data={formData} setData={setFormData} onNext={next} onBack={back} />
//       )}

//       {step === 9 && (
//         <FinalProfileStep
//           data={formData}
//           setData={setFormData}
//           onBack={back}
//           onNext={next}
//           onSubmit={handleFinalSubmit} // 🔥 API HIT HERE
//         />
//       )}

//       {step === 10 && (
//         <LifestyleDetailsStep data={formData} setData={setFormData} onBack={back} />
//       )}
//     </>
//   );
// };

// export default RegisterFlow;


// src/.../RegisterFlow.jsx
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

    console.log("🔎 access_token from register response:", accessToken);

    if (accessToken) {
      localStorage.setItem("token", accessToken);
      console.log(
        "🔐 Token stored in localStorage after register:",
        localStorage.getItem("token")
      );
    } else {
      console.warn(
        "⚠️ No access_token in register response; lifestyle API will be unauthorized."
      );
    }

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
          onNext={() => navigate("/login")}
        />
      )}
    </>
  );
};

export default RegisterFlow;


// // RegisterFlow.jsx
// import { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import ProfileForStep from "./steps/ProfileForStep";
// import PhoneOtpStep from "./steps/PhoneOtpStep";
// import OtpStep from "./steps/Otp";
// import PersonalDetailsStep from "./steps/PersonalDetail";
// import ReligionDetailsStep from "./steps/ReligionDetailsStep";
// import ProfessionalDetailsStep from "./steps/ProfessionalDetailsStep";
// import LocationDetailsStep from "./steps/LocationDetailsStep";
// import FinalProfileStep from "./steps/FamilyDetail";
// import LifestyleDetailsStep from "./steps/LifestyleDetailsStep";
// import RegistrationCongrats from "./steps/Congrats";
// import { useRegister } from "../../../hooks/useRegister";
// import { useAuth } from "../../../context/AuthProvider"; // adjust path if different
// import { loginUser } from "../../../services/auth.service";

// const RegisterFlow = () => {
//   const navigate = useNavigate();
//   const [step, setStep] = useState(1);

//   const [formData, setFormData] = useState({
//     profileFor: "",
//     motherTongue: "",
//     phone: "",
//     otp: "",
//   });

//   const { submitRegistration } = useRegister();
//   const { login } = useAuth(); 

//   const next = () => setStep((s) => s + 1);
//   const back = () => {
//     if (step === 1) navigate(-1);
//     else setStep((s) => s - 1);
//   };

//   const handleFinalSubmit = async (finalProfile) => {
//     const payload = {
//       ...formData,
//       finalProfile,
//     };

//     console.log("📤 Final payload (payload):", payload);

//     const result = await submitRegistration(payload);

//    if (result.success) {
//   console.log("🎉 Registration successful");
//   const apiRes = result.data;
//   console.log("ℹ️ Raw register response:", apiRes);

//   // 1) Get token & user from register response
//   const regData = apiRes?.response || {};
//   let token = regData.access_token || null;
//   let user = regData.user || null;

//   console.log("🔎 Token from register response:", token);

//   // 2) If no token, auto-login
//   if (!token) {
//     try {
//       const loginRes = await loginUser({
//         email: payload.email,
//         password: payload.password,
//       });
//       console.log("ℹ️ Auto-login after register:", loginRes);

//       const loginData = loginRes?.response || {};
//       token = loginData.access_token || token;
//       user = loginData.user || user;

//       console.log("🔎 Token from login response:", token);
//     } catch (e) {
//       console.error("❌ Auto-login after register failed:", e);
//     }
//   }

//   // 3) Store token in context + localStorage
//   if (token) {
//     // if you have useAuth:
//     if (login) {
//       login(user, token);
//     }
//     localStorage.setItem("token", token);
//     console.log("🔐 Token stored after register:", token);
//     console.log("🔐 Token now in localStorage:", localStorage.getItem("token"));
//   } else {
//     console.warn(
//       "⚠️ No auth token found in register/login response. Lifestyle API will be unauthorized."
//     );
//   }

//   next(); // to LifestyleDetailsStep
// } else {
//   console.error("❌ Registration failed:", result.error);
//   alert(result.error || "Registration failed");
// }
//   };

//   return (
//     <>
//       {step === 1 && (
//         <ProfileForStep
//           data={formData}
//           setData={setFormData}
//           onNext={next}
//           onBack={back}
//         />
//       )}

//       {step === 2 && (
//         <PhoneOtpStep
//           data={formData}
//           setData={setFormData}
//           onNext={next}
//           onBack={back}
//         />
//       )}

//       {step === 3 && (
//         <OtpStep
//           data={formData}
//           setData={setFormData}
//           phone={formData.phone}
//           onNext={next}
//           onBack={back}
//         />
//       )}

//       {step === 4 && (
//         <RegistrationCongrats
//           data={formData}
//           setData={setFormData}
//           onNext={next}
//           onBack={back}
//         />
//       )}

//       {step === 5 && (
//         <PersonalDetailsStep
//           data={formData}
//           setData={setFormData}
//           onNext={next}
//           onBack={back}
//         />
//       )}

//       {step === 6 && (
//         <ReligionDetailsStep
//           data={formData}
//           setData={setFormData}
//           onNext={next}
//           onBack={back}
//         />
//       )}

//       {step === 7 && (
//         <LocationDetailsStep
//           data={formData}
//           setData={setFormData}
//           onNext={next}
//           onBack={back}
//         />
//       )}

//       {step === 8 && (
//         <ProfessionalDetailsStep
//           data={formData}
//           setData={setFormData}
//           onNext={next}
//           onBack={back}
//         />
//       )}

//       {step === 9 && (
//         <FinalProfileStep
//           data={formData}
//           setData={setFormData}
//           onBack={back}
//           onNext={next}
//           onSubmit={handleFinalSubmit}
//         />
//       )}

//       {step === 10 && (
//         <LifestyleDetailsStep
//           data={formData}
//           setData={setFormData}
//           onBack={back}
//           onNext={() => navigate("/login")}
//         />
//       )}
//     </>
//   );
// };

// export default RegisterFlow;