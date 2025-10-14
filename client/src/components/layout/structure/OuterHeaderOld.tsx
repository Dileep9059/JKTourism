import { motion, AnimatePresence } from "framer-motion";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeSwitch } from "../../theme-switch";
import useAuth from "@/hooks/useAuth";
import type { AuthType } from "@/context/AuthProvider";

export default function OuterHeaderOld() {
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation(); // Get current route

  const { auth } = useAuth() as { auth: AuthType };


  const isLoginRoute = location.pathname === "/login"; // Check if the current route is /login

  return (
    <header className="sticky top-0 z-50 bg-gradient-to-b from-indigo-100 to-purple-100 dark:from-gray-800 dark:to-gray-900 backdrop-blur-md border-b border-muted-foreground/20">
      <div className="max-w-7xl mx-auto flex justify-between items-center py-4 px-6">
        <div
          onClick={() => navigate("/")}
          className="cursor-pointer font-extrabold text-2xl bg-gradient-to-r from-indigo-500 to-purple-500 bg-clip-text text-transparent"
        >
          JK Land Records
        </div>

        <div className="flex items-center gap-3">
          <ThemeSwitch />
          <div className="hidden md:flex md:items-center gap-3">
            {!isLoginRoute && !auth?.user && (
              <Button variant="outline" onClick={() => navigate("/login")}>
                Login
              </Button>
            )}
            {/* {auth?.user && (
              <Link to={"/admin"}>Dashboard</Link>
            )} */}
            {/* <Button onClick={() => navigate("/register")}>Register</Button> */}
          </div>
          <button
            className="md:hidden"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
          >
            {menuOpen ? (
              <X className="w-6 h-6 text-navy4" />
            ) : (
              <Menu className="w-6 h-6 text-navy4" />
            )}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="md:hidden bg-white dark:bg-gray-950 border-t border-muted-foreground/20 px-6 py-4 space-y-4"
          >
            <div className="flex flex-col gap-3 pt-4 border-t border-muted-foreground/20">
              {!isLoginRoute && (
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => navigate("/login")}
                >
                  Login
                </Button>
              )}
              {/* <Button className="w-full" onClick={() => navigate("/register")}>Register</Button> */}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
