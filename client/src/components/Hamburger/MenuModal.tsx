import React, {  useEffect } from "react";
import { X, Triangle } from "lucide-react";

import FeedbackModal from "../feedback/FeedbackForm";
import clsx from "clsx";
import scss from "./menu.module.scss";
import { Link } from "react-router-dom";

interface HamModalProps {
  open: boolean;
  onClose: () => void;
}


type MenuItem = {
  title: string;
  icon: string;
  items: SimpleItem[];
};

type SimpleItem = {
  title: string;
  url: string;
};


export default function MenuModal({ open, onClose }: HamModalProps) {

  const [feedbackModal, setFeedbackModal] = React.useState({
    open: false,
  });

  const [expanded, setExpanded] = React.useState<number | null>(null);


  const openFeedbackModal = () => setFeedbackModal({ open: true });
  const closeFeedbackModal = () => setFeedbackModal({ open: false });

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (open) {
      document.addEventListener("keydown", handleKeyDown);
    }
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <>
      {/* Backdrop & Modal Wrapper */}
      <div
        className={`fixed inset-0 z-40 flex transition-opacity duration-300 ${open ? "opacity-100" : "opacity-0 pointer-events-none"
          }`}
      >
        {/* Backdrop */}
        <div
          onClick={onClose}
          className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        />

        {/* Modal content */}
        <div
          onClick={(e) => e.stopPropagation()}
          className={`relative z-50 w-full h-full text-white overflow-y-auto transition-transform duration-300 transform ${open ? "scale-100 opacity-100" : "scale-95 opacity-0"
            }`}
        >
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-6 left-6 md:right-6 md:left-auto p-2 rounded-full hover:bg-gray-800 transition-colors z-50"
            aria-label="Close menu"
          >
            <X className="w-8 h-8" />
          </button>

          {/* Modal Body */}
          <div
            className="container-fluid relative mx-auto px-8 py-16 flex flex-col"
            style={{ minHeight: "100vh" }}
          >
            <div className="absolute inset-0 w-full h-screen z-[-1]">
              <img
                src={`${import.meta.env.VITE_BASE}images/JKTMobileAppBg.jpg`}
                alt="JK Tourism Background"

                className="object-cover object-center opacity-90 inset-0 w-full h-full"

              />
              <div className="absolute inset-0 bg-gradient-to-r from-[#6C0200] to-[#6c020000]" />
            </div>
            <div className={scss.content_menu}>
              <div className="text-center mb-14">
                <h1
                  className={clsx(
                    scss.title_menu,
                    `text-4xl md:text-6xl font-[Pacifico] mb-4 drop-shadow-lg`
                  )}
                >
                  Mesmerizing <span className="text-white">JK</span>
                </h1>
              </div>

              {/* Mobile Collapsible Menu */}
              <div className="block md:hidden space-y-4">
                {menuColumns.map((col, i) => (
                  <div key={i} className="border-b border-white/30 pb-2">
                    <button
                      onClick={() => setExpanded(expanded === i ? null : i)}
                      className="w-full flex justify-between items-center text-white font-semibold italic text-lg"
                    >
                      {col.title}
                      <span>{expanded === i ? "-" : "+"}</span>
                    </button>
                    {expanded === i && (
                      <ul className="mt-2 pl-4 space-y-1">
                        {col.items.map((item, j) => (
                          <li
                            key={j}
                            className="text-white hover:text-white italic"
                          >
                            <Link
                              to={item.url}
                              className="items-center flex gap-2"
                              onClick={onClose}
                            >
                              <span className="text-orange-400 mr-2 group-hover:mr-3 transition-all">
                                <Triangle
                                  className="rotate-90"
                                  style={{ maxWidth: "12px" }}
                                />
                              </span>
                              {item.title}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                ))}

                {quickLinks.map((link, k) => (
                  <div key={k} className="border-b border-white/20 py-2">
                    <Link
                      to={link.url}
                      onClick={onClose}
                      className="flex itemsMesmerizing-center text-white hover:text-orange-300 italic font-semibold "
                    >
                      <span className="text-orange-400 mr-2 group-hover:mr-3 transition-all">
                        <Triangle
                          className="rotate-90"
                          style={{ maxWidth: "12px" }}
                        />
                      </span>
                      {link.title}
                    </Link>
                  </div>
                ))}
              </div>

              {/* Desktop Grid Menu */}
              <div
                className={clsx(
                  scss.head_menu,
                  "hidden text-base md:text-lg lg:text-xl flex-grow pb-8"
                )}
              >
                {menuColumns.map((col, i) => (
                  <div
                    key={i}
                    className={clsx(scss.menu_item, "space-y-1 sm:space-y-6")}
                  >
                    <h2
                      className={clsx(
                        scss.head_title,
                        "text-xl sm:text-2xl md:text-3xl font-bold italic mt-0 mb-2"
                      )}
                    >
                      {col.title}
                    </h2>
                    <ul
                      className={clsx(scss.list_head, "space-y-2 sm:space-y-3")}
                    >
                      {col.items.map((item, j) => (
                        <li
                          key={j}
                          className="italic text-gray-300 hover:text-white transition"
                        >
                          <Link
                            to={item.url}
                            onClick={onClose}
                            className="text-base sm:text-lg md:text-xl"
                          >
                            {item.title}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}

                <div className="space-y-4 sm:space-y-6">
                  <h2
                    className={clsx(
                      scss.head_title,
                      "text-xl sm:text-2xl md:text-3xl font-bold italic"
                    )}
                  >
                    Quick Links
                  </h2>
                  <ul
                    className={clsx(
                      scss.link_wrapper,
                      "space-y-3 sm:space-y-4"
                    )}
                  >
                    {quickLinks.map((link, k) => (
                      <li key={k}>
                        <Link
                          to={link.url}
                          onClick={onClose}
                          className="flex items-center hover:text-orange-400 transition group italic text-base"
                        >
                          <span className="text-orange-400 mr-2 group-hover:mr-3 transition-all">
                            <Triangle className="rotate-90" />
                          </span>
                          {link.title}
                        </Link>
                      </li>
                    ))}
                    <li>
                      <a
                        role="button"
                        className="flex items-center hover:text-orange-400 transition group italic text-base cursor-pointer"
                        onClick={() => openFeedbackModal()}
                      >
                        <span className="text-orange-400 mr-2 group-hover:mr-3 transition-all text-xl">
                          <Triangle className="rotate-90" />
                        </span>
                        Feedback
                      </a>
                    </li>
                    <li>
                      <Link
                        role="button"
                        className="flex items-center hover:text-orange-400 transition group italic text-base cursor-pointer"
                        to={"/login"}
                        onClick={onClose}
                      >
                        <span className="text-orange-400 mr-2 group-hover:mr-3 transition-all text-xl">
                          <Triangle className="rotate-90" />
                        </span>
                        Login
                      </Link>


                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <FeedbackModal open={feedbackModal.open} onClose={closeFeedbackModal} />
    </>
  );
}


const menuColumns: MenuItem[] = [
  {
    title: "What to do",
    icon: "/images/JKT16.gif",
    items: [
      { title: "Trekking", url: "/activities/Trekking" },
      { title: "Gondola", url: "/activities/Gondola" },
      { title: "Skiing", url: "/activities/Skiing" },
      { title: "Angling", url: "/activities/Angling" },
      { title: "Wildlife", url: "/activities/Wildlife" },
      { title: "Paragliding", url: "/activities/Paragliding" },
      { title: "Birding", url: "/activities/Birding" },
      { title: "Golf Course", url: "/activities/GolfCourse" },
      { title: "Houseboats", url: "/activities/Houseboats" },
    ],
  },
  {
    title: "Plan Your Trip",
    icon: "/images/JKT17.gif",
    items: [
      { title: "How to Reach JK", url: "/plan-trip" },
      {
        title: "Registered Travel Operators of JK",
        url: "/travel-agent",
      },
      { title: "Registered Travel Guides", url: "/tour-guide" },
      { title: "Registered Home Stays", url: "/homestays" },
      { title: "Registered Houseboats", url: "/houseboats" },
      { title: "Transport Services", url: "/transport-services" },
      {
        title: "How to Spend 3 days in J&K",
        url: "/plan-trip?days=3-days",
      },
      {
        title: "How to Spend 4 days in J&K",
        url: "/plan-trip?days=4-days",
      },
      {
        title: "How to Spend 5 days in J&K",
        url: "/plan-trip?days=5-days",
      },
      {
        title: "How to Spend 6 days in J&K",
        url: "/plan-trip?days=6-days",
      },
      {
        title: "How to Spend 7 days in J&K",
        url: "/plan-trip?days=7-days",
      },
    ],
  },
  {
    title: "Where to Stay",
    icon: "/images/JKT15.gif",
    items: [{ title: "JKTDC", url: "https://www.jktdc.co.in/" }],
  },
  {
    title: "Shopping",
    icon: "/images/JKT15.gif",
    items: [
      { title: "Poloview", url: "/shopping/PoloView" },
      { title: "Maharaja Bazaar", url: "/shopping/MaharajaBazaar" },
      { title: "Lal Chowk", url: "/shopping/LalChowk" },
      { title: "Goni Khan Market", url: "/shopping/GoniKhanMarket" },
      { title: "Makkah Market", url: "/shopping/MakkahMarket" },
      { title: "Residency Road Market", url: "/shopping/ResidencyRoadMarket" },
      { title: "Koker Bazaar", url: "/shopping/KokerBazaar" },
    ],
  },
];

const quickLinks: SimpleItem[] = [
  { title: "Travel Facilities", url: "/amenities" },
  { title: "Medical Facilities", url: "/amenities" },
  { title: "Wayside Amenities", url: "/amenities" },
  { title: "Contact us", url: "/contact-us" },
];
