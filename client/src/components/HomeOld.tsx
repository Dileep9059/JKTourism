import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useRoleRedirect } from "@/hooks/useRoleRedirect";

export default function HomeOld() {

  useRoleRedirect();

  const navigate = useNavigate();

  return (
    <>
      {/* HERO */}
      <section
        id="hero"
        className="flex flex-col items-center justify-center text-center max-w-3xl mx-auto px-6 py-20 md:py-28"
      >
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-4xl md:text-6xl font-bold leading-tight mb-6"
        >
          JK Govt <span className="text-indigo-500">Land Records</span> {" "}
          <span className="text-purple-500">Digitization</span> System
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-lg md:text-xl text-muted-foreground mb-8"
        >
          Secure, transparent land records system for Jammu & Kashmir Government.
        </motion.p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button size="lg" className="px-8 py-6 text-lg" onClick={() => navigate("/login")}>
            Get Started
          </Button>
        </div>
      </section>

    </>
  );
}
