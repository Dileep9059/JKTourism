"use client";

import React, { useState } from "react";
import { Menu, User } from "lucide-react";
import MenuModal from "@/components/Hamburger/MenuModal";


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


  // For Hamburgur Menu
  const [hamburgerModal, setHamburgerModal] = useState<{
    open: boolean;
  }>({
    open: false,
  });

  const openHamburgerModal = () => setHamburgerModal({ open: true });
  const closeHamburgerModal = () => setHamburgerModal({ open: false });

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
          <source src="videos/vd1.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-blue-500/50 to-transparent z-10" />

        <header className="w-full top-0 left-0 z-50">
          <div className="container-fluid mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between py-4 relative">
            {/* Menu Button - Left (Mobile) */}
            <div className="block md:hidden absolute left-4 z-30">
              <button
                className="bg-white/80 hover:bg-white rounded-2xl p-3 shadow-lg transition cursor-pointer"
                aria-label="User Login"
                onClick={() => openHamburgerModal()}
              >
                <Menu className="w-6 h-6" />
              </button>
            </div>

            {/* Logo - Center on mobile, Left on desktop */}
            <div className="flex-1 flex justify-center md:justify-start z-20">
              <img
                src="/images/jk-tourism-logo.png"
                alt="J&K Tourism Logo"
                width={120}
                height={60}
                className="h-12 w-auto sm:h-14 md:h-16"
                loading="lazy"
              />
            </div>

            {/* Login Avatar Button - Right (Mobile Only) */}
            <div className="block md:hidden absolute right-4 z-30">
              <button
                className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center hover:bg-gray-200 transition-colors cursor-pointer"
                aria-label="User Login"

              >
                <User className="w-6 h-6 text-black-600" />
              </button>
            </div>

            {/* Right side for desktop - MenuModal */}
            <div className="hidden md:block z-30">
              <button
                className="bg-white/80 hover:bg-white rounded-2xl p-3 shadow-lg transition cursor-pointer"
                aria-label="User Login"
                onClick={() => openHamburgerModal()}
              >
                <Menu className="w-6 h-6" />
              </button>
            </div>
          </div>
        </header>

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
      <MenuModal open={hamburgerModal.open} onClose={closeHamburgerModal} />
    </>
  );
};

export default Hero;
