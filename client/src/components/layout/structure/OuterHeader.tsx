import { Link } from "react-router-dom";
import { useState } from "react";
import {
  Menu,
  User,
} from "lucide-react";

import MenuModal from "@/components/Hamburger/MenuModal";

export default function OuterHeader() {
  const [hamburgerModal, setHamburgerModal] = useState<{
    open: boolean;
  }>({
    open: false,
  });

  const openHamburgerModal = () => setHamburgerModal({ open: true });
  const closeHamburgerModal = () => setHamburgerModal({ open: false });


  return (
    <>
      <header className="absolute top-0 left-0 w-full z-40">
        <div className="container-fluid w-3/4 mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between py-4 relative">
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
            <Link to="/"> <img
              src={`${import.meta.env.VITE_BASE}images/jk-tourism-logo.png`}
              alt="J&K Tourism Logo"
              width={120}
              height={60}
              className="h-12 w-auto sm:h-14 md:h-16"
              loading="lazy"
            />
            </Link>
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
              className="backdrop-blur-sm bg-white hover:bg-white/80 rounded-2xl p-3 shadow-lg transition cursor-pointer"
              onClick={() => openHamburgerModal()}
            >
              <Menu className="w-6 h-6 text-gray-600 drop-shadow" />
            </button>
          </div>
        </div>
      </header>
      <MenuModal open={hamburgerModal.open} onClose={closeHamburgerModal} />
    </>
  );
}
