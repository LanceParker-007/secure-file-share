import React from "react";

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center p-6">
      <header className="w-full max-w-2xl mb-8">
        <div className="flex items-center justify-center mb-4">
          <svg
            className="w-10 h-10 text-white"
            viewBox="0 0 24 24"
            fill="currentColor"
          >
            <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"></path>
          </svg>
        </div>
        <h1 className="text-3xl font-bold text-center">Privacy Policy</h1>
      </header>
      <main className="w-full max-w-2xl space-y-8">
        <section>
          <h2 className="text-xl font-semibold mb-4">1. Introduction</h2>
          <p className="text-gray-300">
            Welcome to our Privacy Policy. This policy describes how we collect,
            use, and handle your personal information when you use our services.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-4">
            2. Information We Collect
          </h2>
          <p className="text-gray-300 mb-4">
            We collect information you provide directly to us, such as when you
            create an account, submit content, or contact us for support.
          </p>
          <ul className="list-disc list-inside text-gray-300 space-y-2">
            <li>Account information (e.g., name, email address)</li>
            <li>Profile information (e.g., username, avatar)</li>
            <li>Content you submit (e.g., repositories, comments)</li>
            <li>Communication data (e.g., support requests)</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-4">
            3. How We Use Your Information
          </h2>
          <p className="text-gray-300 mb-4">
            We use the information we collect to:
          </p>
          <ul className="list-disc list-inside text-gray-300 space-y-2">
            <li>Provide, maintain, and improve our services</li>
            <li>Process transactions and send related information</li>
            <li>Send technical notices, updates, and support messages</li>
            <li>Respond to your comments and questions</li>
            <li>Analyze usage patterns and improve user experience</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-4">
            4. Data Sharing and Disclosure
          </h2>
          <p className="text-gray-300 mb-4">
            We do not sell your personal information. We may share your
            information in the following situations:
          </p>
          <ul className="list-disc list-inside text-gray-300 space-y-2">
            <li>With your consent</li>
            <li>To comply with legal obligations</li>
            <li>To protect our rights, privacy, safety, or property</li>
            <li>In connection with a merger, sale, or acquisition</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-4">5. Security</h2>
          <p className="text-gray-300">
            We take reasonable measures to help protect your personal
            information from loss, theft, misuse, unauthorized access,
            disclosure, alteration, and destruction.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-4">
            6. Your Rights and Choices
          </h2>
          <p className="text-gray-300">
            You have the right to access, update, or delete your personal
            information. You can also choose to opt-out of certain
            communications.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-4">
            7. Changes to This Policy
          </h2>
          <p className="text-gray-300">
            We may update this privacy policy from time to time. We will notify
            you of any changes by posting the new policy on this page.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-4">8. Contact Us</h2>
          <p className="text-gray-300">
            If you have any questions about this privacy policy, please contact
            us at privacy@example.com.
          </p>
        </section>
      </main>
    </div>
  );
}
