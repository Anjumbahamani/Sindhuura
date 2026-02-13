import React from "react";
import { useNavigate } from "react-router-dom";
import { FiArrowLeft } from "react-icons/fi";

const TermsAndConditions = () => {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-white px-5 py-6">
      <div className="max-w-md mx-auto">
        {/* Header */}
        <div className="flex items-center mb-6 sticky top-0 bg-white pt-1 z-10">
          <button
            onClick={() => navigate(-1)}
            className="w-9 h-9 rounded-full flex items-center justify-center bg-[#FFF7E9] mr-3 shrink-0"
          >
            <FiArrowLeft className="text-navy w-4 h-4" />
          </button>
          <h1 className="text-lg font-semibold text-navy">
            Terms & Conditions
          </h1>
        </div>

        {/* T&C Content */}
        <div className="text-[13px] text-gray-600 leading-relaxed space-y-6 pb-10">
          <p className="text-gray-500 italic">Last updated: 20 May 2025</p>

          <p>
            Welcome to Sindhuuraa. These Terms and Conditions govern your use of the Sindhuuraa mobile application and website. By creating an account, accessing or using Sindhuuraa, you agree to be bound by these terms.
          </p>

          <div className="space-y-2">
            <h3 className="font-semibold text-navy text-sm">1. Eligibility</h3>
            <p>To use Sindhuuraa you confirm that:</p>
            <ul className="list-disc pl-4 space-y-1">
              <li>You are at least 18 years of age</li>
              <li>You are legally eligible to enter into marriage under the laws applicable to you</li>
              <li>You are creating an account for yourself only. You may not create an account on behalf of a friend, family member or any other third party unless you are their legal guardian.</li>
            </ul>
          </div>

          <div className="space-y-2">
            <h3 className="font-semibold text-navy text-sm">2. Account Registration</h3>
            <p>You are responsible for maintaining the confidentiality of your account login details and for all activities conducted under your account. We reserve the right to suspend or terminate any account at our sole discretion without notice.</p>
          </div>

          <div className="space-y-2">
            <h3 className="font-semibold text-navy text-sm">3. Profile Rules</h3>
            <p>You agree that all information you provide on your profile is accurate, current and complete. You may not post misleading, false or deceptive information. You agree to update your profile immediately if any of your information changes.</p>
          </div>

          <div className="space-y-2">
            <h3 className="font-semibold text-navy text-sm">4. Premium Subscriptions & Payments</h3>
            <ul className="list-disc pl-4 space-y-1">
              <li>All subscription fees are non-refundable except as explicitly stated in our refund policy</li>
              <li>Unused portions of a subscription are not eligible for partial refund</li>
              <li>Subscriptions auto-renew unless cancelled at least 48 hours before the end of the current billing period</li>
              <li>We reserve the right to change our pricing at any time with 30 days notice</li>
            </ul>
          </div>

          <div className="space-y-2">
            <h3 className="font-semibold text-navy text-sm">5. Important Verification Disclaimer</h3>
            <blockquote className="border-l-4 border-orange-300 pl-3 py-2 bg-[#FFF7E9] text-gray-700">
              Sindhuuraa is a communication platform only. We do not independently verify the truthfulness, accuracy or completeness of any information posted on user profiles including but not limited to age, marital status, education, employment, income, family background or criminal history.
              <br /><br />
              We do not conduct any background checks unless you explicitly purchase our paid Premium Verification service. You are solely responsible for verifying all information of any user you choose to communicate or meet with. Sindhuuraa is not liable for any loss or damage arising out of your interactions with other users.
            </blockquote>
          </div>

          <div className="space-y-2">
            <h3 className="font-semibold text-navy text-sm">6. Prohibited Conduct</h3>
            <p>You agree not to:</p>
            <ul className="list-disc pl-4 space-y-1">
              <li>Use Sindhuuraa for any purpose other than finding a marriage partner</li>
              <li>Solicit money, donations or goods from other users</li>
              <li>Advertise or promote any product, service, religion or political cause</li>
              <li>Share another user's personal information without their explicit consent</li>
              <li>Create multiple accounts</li>
              <li>Harass, abuse or threaten any other user</li>
            </ul>
          </div>

          <div className="space-y-2">
            <h3 className="font-semibold text-navy text-sm">7. Intellectual Property</h3>
            <p>All content, features, design and functionality of Sindhuuraa is the exclusive property of Sindhuuraa and is protected by copyright, trademark and other intellectual property laws.</p>
          </div>

          <div className="space-y-2">
            <h3 className="font-semibold text-navy text-sm">8. Governing Law</h3>
            <p>These terms are governed by the laws of India. Any dispute arising from the use of Sindhuuraa will be subject to the exclusive jurisdiction of the courts in Bengaluru, Karnataka.</p>
          </div>

          <div className="space-y-2">
            <h3 className="font-semibold text-navy text-sm">9. Changes To Terms</h3>
            <p>We reserve the right to update these Terms and Conditions at any time. We will notify all active users of any material changes at least 15 days before they come into effect.</p>
          </div>

          <div className="space-y-2">
            <h3 className="font-semibold text-navy text-sm">10. Contact Us</h3>
            <p>If you have any questions about these Terms and Conditions, you can contact us at support@sindhuuraa.com</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TermsAndConditions;