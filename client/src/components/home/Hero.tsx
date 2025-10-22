import React from "react";


import clsx from "clsx";
import scss from "./landingpage.module.scss";
import { Link } from "react-router-dom";

const Hero: React.FC = () => {
  const navItems = [
    { title: "What to Do", url: "/activities" },
    { title: "Plan Your Trip", url: "/plan-trip" },
    { title: "Get Started", url: "/categories" },
    { title: "Medical Facilities", url: "/amenities" },
    { title: "Shopping", url: "/shopping" },
  ];



  return (
    <>
      <section className="relative h-screen w-full overflow-hidden font-sans">
        {/* Background Video */}
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover z-0"
        >
          <source src={`${import.meta.env.VITE_BASE}videos/vd1.mp4`} type="video/mp4" />
          Your browser does not support the video tag.
        </video>

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-blue-500/50 to-transparent z-10" />


        {/* Center Title & Subtitle */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center z-20 text-white px-4">
          <h1 className="text-5xl md:text-8xl drop-shadow-lg font-[Pacifico]">
            Touch the Sky
          </h1>
          <p className="mt-3 text-2xl md:text-3xl font-light drop-shadow-md">
            Ride the Gondola to Paradise
          </p>
        </div>

        <nav
          className="absolute bottom-0 left-0 right-0 z-20 flex justify-center items-center px-4 w-full"
          aria-label="Tourism sections"
        >
          <div
            className={clsx(
              scss.custom_tab,
              "flex flex-wrap justify-center gap-2 sm:gap-3 md:gap-0"
            )}
          >
            {navItems.map((item, idx) => (
              <Link
                key={idx}
                to={item.url}
                className={clsx(
                  scss.list_item,
                  "text-sm sm:text-base md:text-lg lg:text-xl font-medium px-4 sm:px-6 md:px-18 py-2 sm:py-3 md:py-4 rounded-t-2xl shadow-md transition-all whitespace-nowrap"
                )}
              >
                {item.title}
              </Link>
            ))}
          </div>
        </nav>
      </section>
      {/* Hamburger Modal */}
    </>
  );
};

export default Hero;
