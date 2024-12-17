import React, { useState } from "react";
import { SectionHeading } from "../shared/SectionHeading";
import { Button } from "../shared/Button";
import { CheckListItem } from "./CheckListItem";
import { Toggle } from "./Toggle";
import { AnimatePresence, motion } from "framer-motion";
import { Link } from "react-router-dom";

export const Pricing = () => {
  return (
    <section id="pricing" className="mx-auto max-w-7xl px-2 md:px-4">
      <SectionHeading>Earnings Distribution!</SectionHeading>

      <div className="mt-6 lg:mt-12 max-w-2xl mx-auto bg-red-100">
        <PriceColumn title="Teams" highlight />
      </div>
    </section>
  );
};

const PriceColumn = ({ highlight }) => {
  return (
    <div
      style={{
        boxShadow: highlight ? "0px 6px 0px rgb(24, 24, 27)" : "",
      }}
      className={`max-w-2xl  relative w-full rounded-lg p-6 md:p-8 ${
        highlight ? "border-2 border-zinc-900 bg-white" : ""
      }`}
    >
      <div className="mb-6 flex items-center gap-3 flex justify-center">
        <AnimatePresence mode="popLayout">
          <motion.span
            initial={{
              y: 24,
              opacity: 0,
            }}
            animate={{
              y: 0,
              opacity: 1,
            }}
            exit={{
              y: -24,
              opacity: 0,
            }}
            transition={{
              duration: 0.25,
              ease: "easeInOut",
            }}
            className="block sm:text-3xl text-xl font-bold"
          >
            We charge 6% for each purchase!
          </motion.span>
        </AnimatePresence>
      </div>

      <Link to="/signin">
        <Button className="w-full" intent={highlight ? "primary" : "secondary"}>
          Let's Go
        </Button>
      </Link>
    </div>
  );
};
