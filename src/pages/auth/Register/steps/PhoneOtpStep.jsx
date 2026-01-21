// const PhoneOtpStep = ({ data, setData, onNext, onBack }) => {
//   const isFriendFlow =
//     data.profileFor === "Friend" ||
//     data.profileFor === "Relative"||
//     data.profileFor === "Sister"||
//     data.profileFor === "Brother"||
//     data.profileFor === "Son"||
//     data.profileFor === "Daughter"||
//     data.profileFor === "Myself";

//   return (
//     <div className="min-h-screen bg-white flex flex-col">

//       {/* Header */}
//       <div className="flex items-center gap-3 px-4 py-4 border-b">
//         <button onClick={onBack}>←</button>
//         <h1 className="text-base font-semibold text-navy">
//           Basic Details
//         </h1>
//       </div>

//       {/* Content */}
//       <div className="flex-1 px-4 py-6">

//         {/* Dynamic name field */}
//         {isFriendFlow && (
//           <div className="mb-5">
//             <input
//               type="text"
//               placeholder={`Enter your ${data.profileFor.toLowerCase()}'s name`}
//               value={data.name || ""}
//               onChange={(e) =>
//                 setData({ ...data, name: e.target.value })
//               }
//               className="w-full px-4 py-3 rounded-xl border border-gray-300
//                          focus:outline-none focus:ring-2 focus:ring-primary"
//             />
//           </div>
//         )}

//         {/* Phone */}
//         <div className="mb-3 flex gap-3">
//           <div className="w-[90px] flex items-center justify-center
//                           border border-gray-300 rounded-xl">
//             🇮🇳 +91
//           </div>

//           <input
//             type="tel"
//             placeholder="Enter mobile number"
//             value={data.phone}
//             onChange={(e) =>
//               setData({ ...data, phone: e.target.value })
//             }
//             className="flex-1 px-4 py-3 rounded-xl border border-gray-300
//                        focus:outline-none focus:ring-2 focus:ring-primary"
//           />
//         </div>

//         <p className="text-sm text-gray-500">
//           OTP will be sent to this number
//         </p>
//       </div>

//       {/* CTA */}
//       <div className="px-4 py-4 border-t">
//         <button
//           onClick={onNext}
//           disabled={!data.phone || data.phone.length < 10}
//           className={`w-full py-4 rounded-xl font-semibold text-base
//             ${
//               data.phone?.length === 10
//                 ? "bg-primary text-white"
//                 : "bg-gray-200 text-gray-400 cursor-not-allowed"
//             }`}
//         >
//           Get OTP
//         </button>

//         <p className="text-xs text-center text-gray-400 mt-3">
//           By registering, I agree to the{" "}
//           <span className="underline">T&C</span> and{" "}
//           <span className="underline">Privacy Policy</span>
//         </p>
//       </div>
//     </div>
//   );
// };

// export default PhoneOtpStep;
// steps/PhoneOtpStep.jsx

const PhoneOtpStep = ({ data, setData, onNext, onBack }) => {
  const isFriendFlow =
    data.profileFor === "Friend" ||
    data.profileFor === "Relative" ||
    data.profileFor === "Sister" ||
    data.profileFor === "Brother" ||
    data.profileFor === "Son" ||
    data.profileFor === "Daughter" ||
    data.profileFor === "Myself";

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Header */}
      <div className="flex items-center gap-3 px-4 py-4 border-b">
        <button onClick={onBack}>←</button>
        <h1 className="text-base font-semibold text-navy">Basic Details</h1>
      </div>

      {/* Content */}
      <div className="flex-1 px-4 py-6">
        {/* Dynamic name field */}
        {isFriendFlow && (
          <div className="mb-5">
            <input
              type="text"
              placeholder={`Enter your ${data.profileFor.toLowerCase()}'s name`}
              value={data.name || ""}
              onChange={(e) => setData({ ...data, name: e.target.value })}
              className="w-full px-4 py-3 rounded-xl border border-gray-300
                         focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
        )}

        {/* Phone */}
        <div className="mb-3 flex gap-3">
          <div className="w-[90px] flex items-center justify-center
                          border border-gray-300 rounded-xl">
            🇮🇳 +91
          </div>

          <input
            type="tel"
            placeholder="Enter mobile number"
            value={data.phone}
            onChange={(e) => setData({ ...data, phone: e.target.value })}
            className="flex-1 px-4 py-3 rounded-xl border border-gray-300
                       focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        <p className="text-sm text-gray-500">
          OTP will be sent to this number
        </p>
      </div>

      {/* CTA */}
      <div className="px-4 py-4 border-t">
        <button
          onClick={onNext}
          disabled={!data.phone || data.phone.length < 10}
          className={`w-full py-4 rounded-xl font-semibold text-base
            ${
              data.phone?.length === 10
                ? "bg-primary text-white"
                : "bg-gray-200 text-gray-400 cursor-not-allowed"
            }`}
        >
          Get OTP
        </button>

        <p className="text-xs text-center text-gray-400 mt-3">
          By registering, I agree to the{" "}
          <span className="underline">T&amp;C</span> and{" "}
          <span className="underline">Privacy Policy</span>
        </p>
      </div>
    </div>
  );
};

export default PhoneOtpStep;