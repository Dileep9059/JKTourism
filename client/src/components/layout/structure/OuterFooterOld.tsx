// src/components/footer/OuterFooter.tsx
import { AnimatePresence, motion } from "framer-motion";
import { ArrowUp, Clock3, Code2, Users } from "lucide-react";
import { useEffect, useState } from "react";

export default function OuterFooterOld() {
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [visitorCount, setVisitorCount] = useState(0);

  useEffect(() => {
    const onScroll = () => setShowScrollTop(window.scrollY > 200);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const scrollToTop = () => {
    document.getElementById("hero")?.scrollIntoView({ behavior: "smooth" });
  };

  // Simulate visitor count (frontend only)
  useEffect(() => {
    const storedCount = localStorage.getItem("visitorCount");
    const count = storedCount ? parseInt(storedCount, 10) + 1 : 1;
    localStorage.setItem("visitorCount", count.toString());
    setVisitorCount(count);
  }, []);

  const lastUpdated = "16/09/2025";
  const buildVersion = "0.0.6 D";

  return (
    <footer
      id="footer"
      className="bg-gradient-to-b from-indigo-100 to-purple-100 dark:from-gray-800 dark:to-gray-900 text-foreground mt-auto relative"
    >
      {/* MAIN FOOTER CONTENT */}
      <div className="max-w-7xl mx-auto py-6 px-6 grid md:grid-cols-4 gap-12">
        <div className="md:col-span-4 flex flex-col items-center text-center">
          <h3 className="text-2xl font-bold bg-gradient-to-r from-indigo-500 to-purple-500 bg-clip-text text-transparent mb-4">
            JK Land Records
          </h3>
          <p className="text-muted-foreground mb-4 max-w-md">
            Ensuring secure, transparent land record digitization.
          </p>

        </div>
      </div>


      {/* MODERN SYSTEM INFO BOX */}
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className="max-w-4xl mx-auto mb-16 px-6"
        >
          <div className="backdrop-blur-md bg-white/30 dark:bg-white/10 border border-border rounded-xl shadow-md p-6 grid grid-cols-1 sm:grid-cols-3 gap-6 text-center">
            <div>
              <Clock3 className="mx-auto mb-1 text-indigo-500" size={20} />
              <p className="text-sm text-muted-foreground">Last Updated</p>
              <p className="text-base font-medium text-foreground">{lastUpdated}</p>
            </div>
            <div>
              <Code2 className="mx-auto mb-1 text-indigo-500" size={20} />
              <p className="text-sm text-muted-foreground">Build Version</p>
              <p className="text-base font-medium text-foreground">{buildVersion}</p>
            </div>
            <div>
              <Users className="mx-auto mb-1 text-indigo-500" size={20} />
              <p className="text-sm text-muted-foreground">Visitors</p>
              <p className="text-base font-medium text-foreground">{visitorCount.toLocaleString()}</p>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* COPYRIGHT */}
      <div className="flex flex-col md:flex-row justify-between items-center px-4 text-center gap-2">
        <p className="text-muted-foreground text-sm">
          © {new Date().getFullYear()}, Website Developed by BISAG-N.
        </p>
        <p className="text-muted-foreground text-sm">
          © {new Date().getFullYear()} Content Owned by Government of J&K. All rights reserved.
        </p>
      </div>



      {/* SCROLL TO TOP BUTTON */}
      <AnimatePresence>
        {showScrollTop && (
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={scrollToTop}
            className="fixed bottom-6 right-6 bg-indigo-500 text-white p-3 rounded-full shadow-lg hover:bg-indigo-600 transition"
          >
            <ArrowUp className="w-5 h-5" />
          </motion.button>
        )}
      </AnimatePresence>
    </footer>
  );
}
