import { useEffect, useRef, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { BadgeMinus, Star } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import clsx from "clsx";
import scss from "./review.module.scss";
import { d } from "../utils/crypto";
import axiosInstance from "@/axios/axios";


type FeedbackData = {
  name: string;
  rating: number;
  image: string;
  content: string;
  destination: string;
};

export default function ReviewSlider() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [reviews, setReviews] = useState<FeedbackData[]>([]);

  const resetTimeout = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
  };

  useEffect(() => {
    const fetchFeedbacks = async () => {
      try {
        const res = await axiosInstance.get(`/api/feedback/get-public-feedbacks`);
        const json = JSON.parse(await d(res.data));

        if (Array.isArray(json)) {
          setReviews(json);
        } else {
          setReviews([]);
        }
      } catch (error) {
        toast("Error!", {
          description: "Something went wrong while fetching feedbacks.",
          icon: <BadgeMinus className="text-red-600 w-4 h-4" />,
        });
        setReviews([]);
      }
    };

    fetchFeedbacks();
  }, []);

  useEffect(() => {
    resetTimeout();

    if (!isHovered && reviews.length > 4) {
      timeoutRef.current = setTimeout(() => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % (reviews.length - 4));
      }, 3000);
    }

    return () => resetTimeout();
  }, [currentIndex, isHovered, reviews]);

  const visibleReviews =
    reviews.length >= 5
      ? reviews.slice(currentIndex, currentIndex + 5)
      : reviews;

  return (
    <div
      className={clsx(
        scss.tourist,
        "bg-white text-center py-8 md:py-15 relative overflow-hidden"
      )}
    >
      <div
        className="absolute"
        style={{ left: "0", top: "0", width: "100%", height: "100%" }}
      >
        <img
          src="/images/tourist_bg.png"
          alt="JK Tourism Background"
          className="object-cover z-0 inset-0 w-full h-full"
          loading="lazy"
        />
      </div>
      <div className="relative mt-6 sm:mt-10 h-[400px] sm:h-[500px] w-full">
        <div>
          <div className={scss.common_title}>
            <h2 className="text-3xl sm:text-4xl md:text-5xl text-black mb-2 font-[pacifico]">
              Experiences of Our Beloved Tourists
            </h2>
            <div className="flex justify-center my-6">
              <img
                src="/images/dark_btm_line.svg"
                alt="Decorative Divider"
                width={500}
                height={30}
                className="object-contain"
                loading="lazy"
              />
            </div>
            <p className="text-gray-700 mx-auto mt-3 sm:mt-5 mb-8">
              Visitors to Jammu & Kashmir cherish every moment—wandering through
              saffron fields, enjoying the Craft Safari, or gliding on Dal Lake
              in a shikara. Surrounded by nature and culture, their experiences
              reflect the timeless charm and heartfelt hospitality that make JK
              truly unforgettable.
            </p>
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.6, ease: "easeInOut" }}
              className="absolute w-full flex justify-center gap-3 sm:gap-6 px-4 sm:px-6 md:px-10"
            >
              {visibleReviews?.map((review, idx) => (
                <Card
                  key={`${currentIndex}-${idx}`}
                  onMouseEnter={() => setIsHovered(true)}
                  onMouseLeave={() => setIsHovered(false)}
                  className="rounded-2xl sm:rounded-3xl shadow-md overflow-hidden w-[250px] sm:w-[300px] flex-shrink-0 p-0 transition-transform hover:scale-105 bg-white"
                >
                  <div className="relative group">
                    <div className="relative h-32 sm:h-40 w-full overflow-hidden rounded-t-2xl sm:rounded-t-3xl bg-black">
                      <img
                        src={`${import.meta.env.VITE_APP_API_BASE_URL}/files/load-file-by-path?path=${review.image}`}
                        alt="video preview"
                        className="object-cover inset-0 w-full h-full rounded-t-2xl sm:rounded-t-3xl"
                        loading="lazy"
                      />
                    </div>

                    <CardContent className="text-left p-3 sm:p-4 space-y-1 sm:space-y-2 bg-white">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-bold text-sm sm:text-base">
                            {review.name}
                          </h3>
                          <span className="text-xs sm:text-sm text-gray-500">
                            📍 {review.destination}
                          </span>
                        </div>
                        <span className="text-xs sm:text-sm flex items-center gap-1 text-orange-500">
                          <Star size={12} fill="orange" /> {review.rating}
                        </span>
                      </div>
                      <p className="text-xs sm:text-sm text-gray-600 ">
                        {review.content}
                      </p>
                    </CardContent>
                  </div>
                </Card>
              ))}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
