import React from "react";
import { SectionHeading } from "../shared/SectionHeading";
import { LogoLarge } from "../navigation/Logo";
import { Button } from "../shared/Button";
import { Link } from "react-router-dom";

export const FinalCTA = () => {
  return (
    <section className="-mt-8 bg-white px-2 py-24 md:px-4">
      <div className="mx-auto flex max-w-5xl flex-col items-center">
        <LogoLarge />
        <SectionHeading>Ready to share?</SectionHeading>
        <p className="mx-auto mb-8 text-center text-base leading-relaxed md:text-xl md:leading-relaxed">
          All the best with your file sharing journey 🙌
        </p>
        <Link to="/signin">
          <Button intent="primary">
            <span className="font-bold">Get started 🚀</span>
          </Button>
        </Link>
      </div>
    </section>
  );
};
