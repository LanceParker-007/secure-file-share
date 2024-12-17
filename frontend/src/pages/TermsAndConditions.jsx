import React from "react";

export default function TermsAndConditionsPage() {
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
        <h1 className="text-3xl font-bold text-center">Terms and Conditions</h1>
      </header>
      <main className="w-full max-w-2xl space-y-8">
        <section>
          <h2 className="text-xl font-semibold mb-4">1. Acceptance of Terms</h2>
          <p className="text-gray-300">
            By accessing or using our service, you agree to be bound by these
            Terms and Conditions and our Privacy Policy. If you disagree with
            any part of the terms, you may not access the service.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-4">
            2. Description of Service
          </h2>
          <p className="text-gray-300">
            Our platform provides a marketplace for developers to share and sell
            their code repositories. We do not guarantee the quality, safety, or
            legality of the repositories listed on our platform.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-4">3. User Accounts</h2>
          <p className="text-gray-300">
            You must create an account to use certain features of our service.
            You are responsible for maintaining the confidentiality of your
            account and password. You agree to accept responsibility for all
            activities that occur under your account.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-4">4. User Content</h2>
          <p className="text-gray-300">
            You retain all rights to the content you post on our platform. By
            posting content, you grant us a non-exclusive, worldwide,
            royalty-free license to use, modify, publicly display, reproduce,
            and distribute such content on our platform.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-4">
            5. Intellectual Property
          </h2>
          <p className="text-gray-300">
            The service and its original content, features, and functionality
            are owned by us and are protected by international copyright,
            trademark, patent, trade secret, and other intellectual property or
            proprietary rights laws.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-4">6. Termination</h2>
          <p className="text-gray-300">
            We may terminate or suspend your account immediately, without prior
            notice or liability, for any reason whatsoever, including without
            limitation if you breach the Terms.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-4">
            7. Limitation of Liability
          </h2>
          <p className="text-gray-300">
            In no event shall we be liable for any indirect, incidental,
            special, consequential or punitive damages, including without
            limitation, loss of profits, data, use, goodwill, or other
            intangible losses, resulting from your access to or use of or
            inability to access or use the service.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-4">8. Governing Law</h2>
          <p className="text-gray-300">
            These Terms shall be governed and construed in accordance with the
            laws of [Your Country], without regard to its conflict of law
            provisions.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-4">9. Changes to Terms</h2>
          <p className="text-gray-300">
            We reserve the right, at our sole discretion, to modify or replace
            these Terms at any time. We will provide notice of any significant
            changes by posting the new Terms on this page.
          </p>
        </section>
      </main>
    </div>
  );
}
