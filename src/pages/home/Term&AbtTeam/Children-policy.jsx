import React from "react";
import { useNavigate } from "react-router-dom";
import { FiArrowLeft } from "react-icons/fi";

const ChildSafetyPolicy = () => {
    const navigate = useNavigate();
  return (
    <div className="max-w-4xl mx-auto px-6 py-10 text-gray-800">
          <div className="flex items-center mb-6 sticky top-0 bg-white pt-1 z-10">
                  <button
                    onClick={() => navigate(-1)}
                    className="w-9 h-9 rounded-full flex items-center justify-center bg-[#FFF7E9] mr-3 shrink-0"
                  >
                    <FiArrowLeft className="text-navy w-4 h-4" />
                  </button>
                  <h1 className="text-lg font-semibold text-navy">
                    Child Safety Policy
                  </h1>
                </div>
      <h1 className="text-3xl font-bold mb-4">
        Child Safety Standards & Protection Against CSAE
      </h1>

      {/* <p className="mb-2">
        <strong>Effective Date:</strong> [Add Date]
      </p> */}
      <p className="mb-6">
        <strong>App Name:</strong> Sindhuura
      </p>

      <p className="mb-6">
        At <strong>Sindhuura</strong>, we are committed to maintaining a
        safe platform and strictly prohibit any form of Child Sexual Abuse and
        Exploitation (CSAE). Protecting children and preventing harmful
        activity on our platform is a top priority.
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-2">1. Zero Tolerance Policy</h2>
      <p className="mb-3">
        Our platform has zero tolerance for any content or behavior that
        involves:
      </p>
      <ul className="list-disc pl-6 mb-4">
        <li>Child Sexual Abuse Material (CSAM)</li>
        <li>Sexual exploitation of minors</li>
        <li>Grooming or attempting to establish relationships with minors for exploitation</li>
        <li>Sharing, uploading, or distributing inappropriate images involving minors</li>
        <li>Any activity that endangers or harms children</li>
      </ul>
      <p className="mb-4">
        Any user found engaging in such activities will be immediately banned
        from the platform and may be reported to relevant law enforcement
        authorities.
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-2">2. Age Restriction</h2>
      <p className="mb-4">
        Our matrimony service is intended only for adults aged 18 years or
        older. Users under the age of 18 are strictly prohibited from creating
        accounts or using the app. If we discover that an account belongs to a
        minor, we will immediately remove the account and associated data.
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-2">3. User Reporting System</h2>
      <p className="mb-3">
        We provide tools that allow users to report profiles or content that
        may violate our safety policies.
      </p>
      <ul className="list-disc pl-6 mb-4">
        <li>Suspicious accounts</li>
        <li>Underage profiles</li>
        <li>Inappropriate messages or images</li>
        <li>Harassment or abusive behavior</li>
      </ul>
      <p className="mb-4">
        All reports are reviewed promptly, and appropriate action is taken.
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-2">4. Content Moderation</h2>
      <ul className="list-disc pl-6 mb-4">
        <li>Review reported profiles and messages</li>
        <li>Remove inappropriate content</li>
        <li>Suspend or permanently block accounts that violate safety policies</li>
      </ul>

      <h2 className="text-xl font-semibold mt-6 mb-2">
        5. Cooperation with Law Enforcement
      </h2>
      <p className="mb-4">
        If we become aware of any content or activity involving child
        exploitation or abuse, we may report such information to law
        enforcement agencies and cooperate fully with investigations as
        required by law.
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-2">6. User Responsibilities</h2>
      <p className="mb-3">Users must ensure that:</p>
      <ul className="list-disc pl-6 mb-4">
        <li>They are 18 years or older</li>
        <li>They do not upload or share content involving minors</li>
        <li>They respect community guidelines and safety policies</li>
      </ul>
      <p className="mb-4">
        Violating these rules may result in account suspension, permanent
        banning, or legal action.
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-2">
        7. Contact for Child Safety Concerns
      </h2>
      <p className="mb-4">
        If you believe someone is violating this policy or engaging in harmful
        behavior involving minors, please contact us immediately:
      </p>
      <p>Email: support@sindhuura.com</p>
      <p>App Name: Sindhuura</p>
      <p>Safety Team: Child Safety Compliance Team</p>

      <h2 className="text-xl font-semibold mt-6 mb-2">8. Policy Updates</h2>
      <p>
        We may update this Child Safety Standards Policy from time to time to
        ensure continued compliance with Google Play policies and
        international safety standards.
      </p>
    </div>
  );
};

export default ChildSafetyPolicy;