import { motion, AnimatePresence } from "framer-motion";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { useState } from "react";
import {
  ChevronDown,
  Users,
  CreditCard,
} from "lucide-react";

import { FaNetworkWired } from "react-icons/fa";
import { IoIosMan } from "react-icons/io";
import { Button } from "@/components/ui/button";
import { ThemeSwitch } from "../../theme-switch";
import useAuth from "@/hooks/useAuth";
import type { AuthType } from "@/context/AuthProvider";
import { HamburgerMenuIcon } from "@radix-ui/react-icons";

export default function OuterHeader() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState<string | null>(null);
  const navigate = useNavigate();
  const location = useLocation();

  const { auth } = useAuth() as { auth: AuthType };
  const isLoginRoute = location.pathname === "/login";

  const navigationItems = [
    { title: "HOME", href: "/", active: true },
    {
      title: "ABOUT DISTRICT",
      href: "#",
      hasDropdown: true,
      dropdownItems: [
        { name: "History", href: "#" },
        { name: "Geography", href: "#" },
        { name: "Demographics", href: "#" },
        { name: "Administration", href: "#" }
      ]
    },



    {
      title: "DOCUMENTS",
      href: "#",
      hasDropdown: true,
      dropdownItems: [
        { name: "Policies", href: "#" },
        { name: "Reports", href: "#" },
        { name: "Circulars", href: "#" }
      ]
    },
    {
      title: "NOTICES",
      href: "#",
      hasDropdown: true,
      dropdownItems: [
        { name: "Public Notices", href: "#" },
        { name: "Tender Notices", href: "#" },

      ]
    },

  ];

  return (
    <header className="sticky top-0 z-50 bg-white dark:bg-gray-950 shadow-sm">
      {/* Top Bar */}
      <div className="dark:bg-gray-900 border-b border-black dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-2 sm:px-4">
          <div className="flex flex-col sm:flex-row justify-between items-center text-xs sm:text-sm">
            <div className="flex items-center gap-2 sm:gap-6 py-2 sm:py-0">
              <span className="text-gray-700 dark:text-gray-300">
                केंद्र शासित प्रदेश जम्मू और कश्मीर
                <span className="border-l ml-2 pl-2">
                  Union Territory of Jammu and Kashmir
                </span>
              </span>
            </div>

            {/* Icons Row */}
            <div className="relative flex items-center dark:bg-gray-900 ">
              <div className="flex items-center bg-white dark:bg-gray-900 border  overflow-hidden">
                {/* Payment Button */}
                <Button
                  variant="ghost"
                  size="sm"
                  className="p-2 border-r  border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer"
                  aria-label="Payment services"
                >
                  <CreditCard className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                </Button>

                {/* Users Button */}
                <Button
                  variant="ghost"
                  size="sm"
                  className="p-2 border-r border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700"
                  aria-label="User services"
                >
                  <Users className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                </Button>

                {/* Network Button */}
                <Button
                  variant="ghost"
                  size="sm"
                  className="p-2 border-r border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700"
                  aria-label="Network services"
                >
                  <FaNetworkWired className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                </Button>

                {/* Profile Button */}
                <Button
                  variant="ghost"
                  size="sm"
                  className="p-2 border-r border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700"
                  aria-label="Profile"
                >
                  <IoIosMan className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                </Button>

                <ThemeSwitch />

              </div>

            </div>

          </div>
        </div>
      </div>

      {/* Main Header */}
      <div className="bg-white dark:bg-[#101828]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between py-2 space-x-4 sm:space-x-8">

            {/* Left Section - Logo and Center Text */}
            <div className="flex items-center space-x-2 sm:space-x-4">  {/* Reduced space-x for mobile */}
              <div className="w-12 sm:w-16 h-12 sm:h-16 flex items-center justify-center">
                <img
                  src={`${import.meta.env.VITE_BASE.replace(/\/$/, '')}/national_Logo.png`}
                  alt="National Logo"
                  className="h-14 sm:h-16 md:h-20 object-contain"
                />
              </div>

              {/* Center Text */}
              <div className="leading-tight text-left"> {/* Removed text-center for mobile */}
                <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
                  राजस्व विभाग
                </h1>
                <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-black dark:text-white">
                  REVENUE DEPARTMENT
                </h2>
                <h2 className="text-base sm:text-lg md:text-xl font-bold text-gray-900 dark:text-white">
                  محکمہ مال
                </h2>
              </div>
            </div>

            {/* Right Section - Seal Logo */}
            <div className="flex items-center justify-center sm:justify-end">
              <img
                src={`${import.meta.env.VITE_BASE.replace(/\/$/, '')}/swach-bharat_icon.png`}
                alt="Swachh Bharat Icon"
                className="md:h-20 object-contain rounded-md dark:invert"
              />
            </div>

          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="bg-white text-blue shadow-md border-t  border-black  dark:bg-gray-900 dark:text-white dark:border-white ">
        <div className="max-w-7xl mx-auto px-2 sm:px-4 ">
          {/* Desktop / Tablet Navigation */}
          <div className="hidden md:flex justify-between items-center">
            <div className="flex items-center ">
              {navigationItems.map((item, index) => (
                <div
                  key={index}
                  className="relative"
                  onMouseEnter={() =>
                    item.hasDropdown && setDropdownOpen(item.title)
                  }
                  onMouseLeave={() => setDropdownOpen(null)}
                >
                  <Link
                    to={item.href}
                    className={`
                      flex items-center gap-1 px-3 sm:px-4 py-3 text-xs sm:text-sm font-medium transition-all text-black dark:text-white
                      ${item.active
                        ? "bg-[#9e6b22] text-white"
                        : "hover:bg-[#9e6b22] text-amber-100 hover:text-white"
                      }
                    `}
                  >
                    {item.title}
                    {item.hasDropdown && (
                      <ChevronDown
                        className={`w-3 sm:w-4 h-3 sm:h-4 transition-transform duration-200 ${dropdownOpen === item.title ? "rotate-180" : ""
                          }`}
                      />
                    )}
                  </Link>

                  {/* Dropdown */}
                  {item.hasDropdown && dropdownOpen === item.title && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="absolute top-full left-0 w-52 sm:w-64 bg-[#e5ab57] dark:bg-gray-800 shadow-lg border border-white dark:border-gray-700 z-50"
                    >
                      {item.dropdownItems?.map((dropdownItem, dropdownIndex) => (
                        <Link
                          key={dropdownIndex}
                          to={dropdownItem.href}
                          className="block px-3 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm text-black dark:text-gray-300 hover:bg-[#9e6b22] dark:hover:bg-gray-700 hover:text-white dark:hover:text-amber-400 transition-colors"
                        >
                          {dropdownItem.name}
                        </Link>
                      ))}
                    </motion.div>
                  )}
                </div>
              ))}
            </div>

            {/* Desktop Login */}
            <div>
              {!isLoginRoute && !auth?.user && (
                <Button
                  variant="outline"
                  className=" bg-[#9e6b22] text-white cursor-pointer mr-22 hover:bg-[#9e6b22] dark:hover:bg-[#9e6b22] hover:text-white dark:bg-[#9e6b22]"
                  onClick={() => {
                    navigate("/login");
                    setMenuOpen(false);
                  }}
                >
                  Login
                </Button>
              )}
            </div>
          </div>

          {/* Mobile Nav Header */}
          <div className="md:hidden flex items-center justify-center py-2">

            <Button
              variant="ghost"
              size="sm"
              onClick={() => setMenuOpen(!menuOpen)}
              className="text-black dark:text-white hover:bg-gray-200 dark:hover:bg-gray-700"
            >

              <HamburgerMenuIcon className="w-4 h-4" />

            </Button>
          </div>



        </div>

        {/* Mobile Nav */}
        <AnimatePresence>
          {menuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden bg-[#9e6b22] border-t border-amber-700 dark:bg-[#101828] dark:text-white"
            >
              <div className="px-2 sm:px-4 py-4 space-y-2">
                {navigationItems.map((item, index) => (
                  <div key={index}>
                    <Link
                      to={item.href}
                      className={`
                        block px-3 py-2 rounded-md text-sm font-medium dark:bg-[#101828] dark:text-white 
                        ${item.active
                          ? "bg-amber-900 text-white dark:bg-blue-900"
                          : "text-amber-100 hover:bg-amber-700 hover:text-white"}
                      `}
                      onClick={() => setMenuOpen(false)}
                    >
                      {item.title}
                    </Link>
                  </div>
                ))}

                {!isLoginRoute && !auth?.user && (
                  <div className="pt-4 border-t border-amber-700">
                    <Button
                      variant="outline"
                      className="w-full bg-white text-amber-800 hover:bg-gray-100 dark:bg-white "
                      onClick={() => {
                        navigate("/login");
                        setMenuOpen(false);
                      }}
                    >
                      Login
                    </Button>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

    </header>
  );
}
