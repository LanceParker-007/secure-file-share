import React from "react";
import { FiArrowUpRight } from "react-icons/fi";
import { Link } from "react-router-dom";

export const NeuHero = () => {
  return (
    <section id="about" className="overflow-hidden bg-white">
      <div className="relative flex flex-col items-center justify-center px-12 pb-48 pt-12 md:pt-24">
        <Copy />
      </div>
    </section>
  );
};

const Copy = () => {
  return (
    <>
      <div className="mb-1.5 rounded-full bg-zinc-600">
        <a
          href="#"
          target="_blank"
          rel="nofollow"
          className="flex origin-top-left items-center rounded-full border border-zinc-900 bg-white p-0.5 text-sm transition-transform hover:-rotate-2"
        >
          <span className="rounded-full bg-[#FF6154] px-2 py-0.5 font-medium text-white">
            HEY!
          </span>
          <span className="ml-1.5 mr-1 inline-block">We're live!</span>
          <FiArrowUpRight className="mr-2 inline-block" />
        </a>
      </div>
      <h1 className="max-w-6xl text-center text-4xl font-black leading-[1.15] md:text-6xl md:leading-[1.15]">
        Share your files SECURELY with ABSharing
        <br />
      </h1>
      <p className="mx-auto my-4 max-w-3xl text-center text-base leading-relaxed md:my-6 md:text-xl md:leading-relaxed">
        ABSharing! It is a tool build by abnormal security (World's one of the
        best security companies) to share your files securely.
      </p>
      <Link to="/signin">
        <button className="rounded-lg bg-indigo-600 p-3 uppercase text-white transition-colors hover:bg-indigo-700">
          <span className="font-bold">Get started 🚀 </span>
        </button>
      </Link>
    </>
  );
};
