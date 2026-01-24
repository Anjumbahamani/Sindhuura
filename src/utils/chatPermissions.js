// src/utils/chatPermissions.js

export function getChatMode(myMembershipType, otherMembershipType) {
  const myPremium = myMembershipType === "premium";
  const otherPremium = otherMembershipType === "premium";

  if (myPremium && otherPremium) return "full";            // WhatsApp-like
  if (!myPremium && !otherPremium) return "predefined_only"; // free↔free
  return "none";                                           // free↔premium
}