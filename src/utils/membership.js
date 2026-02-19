// // src/utils/membership.js

// export function getMembershipFromProfile(profileResponse) {
//   const sub = profileResponse?.subscription;

//   // If there's no subscription object at all → free trial
//   if (!sub) {
//     return {
//       type: "free_trial",
//       isPremium: false,
//       planName: null,
//       planLimit: 0,
//       contactViewed: 0,
//       contactRemaining: 0,
//       expiryDate: null,
//     };
//   }

//   const rawPlan = sub.plan;
//   const plan = rawPlan ? String(rawPlan).toLowerCase() : "";

//   // Explicitly treat these as FREE TRIAL:
//   // - plan is null/empty
//   // - plan is "none"
//   // - plan is "free" or "free_trial" (if backend ever uses those)
//   if (!plan || plan === "none" || plan === "free" || plan === "free_trial") {
//     return {
//       type: "free_trial",
//       isPremium: false,
//       planName: rawPlan, // "none" or similar
//       planLimit: sub.plan_limit ?? 0,
//       contactViewed: sub.contact_viewed ?? 0,
//       contactRemaining: sub.contact_remaining ?? 0,
//       expiryDate: sub.expiry_date ? new Date(sub.expiry_date) : null,
//     };
//   }

//   // Any other plan name (silver, gold, etc.) → treat as premium
//   const expiryDate = sub.expiry_date ? new Date(sub.expiry_date) : null;
//   const now = new Date();
//   const isExpired = expiryDate && expiryDate < now;

//   // If expired, fall back to free_trial state
//   if (isExpired) {
//     return {
//       type: "free_trial",
//       isPremium: false,
//       planName: null,
//       planLimit: 0,
//       contactViewed: 0,
//       contactRemaining: 0,
//       expiryDate,
//     };
//   }

//   // Active premium plan
//   return {
//     type: "premium",
//     isPremium: true,
//     planName: rawPlan, // e.g. "silver"
//     planLimit: sub.plan_limit ?? 0,
//     contactViewed: sub.contact_viewed ?? 0,
//     contactRemaining: sub.contact_remaining ?? 0,
//     expiryDate,
//   };
// }

// src/utils/membership.js

export function getMembershipFromProfile(profileResponse) {
  const sub = profileResponse?.subscription;

  // If there's no subscription object at all → free trial
  if (!sub) {
    return {
      type: "free_trial",
      isPremium: false,
      planName: null,
      planLimit: 0,
      contactViewed: 0,
      contactRemaining: 0,
      expiryDate: null,
    };
  }

  const rawPlan = sub.plan;
  const plan = rawPlan ? String(rawPlan).toLowerCase() : "";

  // Explicitly treat these as FREE TRIAL:
  // - plan is null/empty
  // - plan is "none"
  // - plan is "free" or "free_trial" (if backend ever uses those)
  if (!plan || plan === "none" || plan === "free" || plan === "free_trial") {
    return {
      type: "free_trial",
      isPremium: false,
      planName: rawPlan, // "none" or similar
      // Use the correct field names from your API
      planLimit: sub.reveal_limit ?? 0,
      contactViewed: sub.reveal_contact_count ?? 0,
      contactRemaining: sub.reveal_remaining ?? 0,
      expiryDate: sub.expiry_date ? new Date(sub.expiry_date) : null,
    };
  }

  // Any other plan name (silver, gold, etc.) → treat as premium
  const expiryDate = sub.expiry_date ? new Date(sub.expiry_date) : null;
  const now = new Date();
  const isExpired = expiryDate && expiryDate < now;

  // If expired, fall back to free_trial state
  if (isExpired) {
    return {
      type: "free_trial",
      isPremium: false,
      planName: null,
      planLimit: 0,
      contactViewed: 0,
      contactRemaining: 0,
      expiryDate,
    };
  }

  // Active premium plan - use the correct field names from your API
  return {
    type: "premium",
    isPremium: true,
    planName: rawPlan, // e.g. "Silver Plan"
    planLimit: sub.reveal_limit ?? 0,
    contactViewed: sub.reveal_contact_count ?? 0,
    contactRemaining: sub.reveal_remaining ?? 0,
    expiryDate,
  };
}