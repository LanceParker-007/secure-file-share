import React from "react";
import FlipNavWrapper from "../components/flip-nav.jsx/FlipNav";
import { NeuHero } from "../components/neu-hero/NeuHero";
import { EmailCapture } from "@/components/email-capture/EmailCapture";
import { font } from "@/fonts";
import { FinalCTA } from "@/components/final-cta/FinalCTA";
import Footer from "../components/footer/Footer";

const LandingPage = () => {
  return (
    <main className={`${font.className} overflow-hidden`}>
      <FlipNavWrapper>
        <NeuHero />
      </FlipNavWrapper>
      <EmailCapture />
      <FinalCTA />
      <Footer />
    </main>
  );
};

export default LandingPage;
