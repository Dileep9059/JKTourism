import { useEffect, useState } from "react";

import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import "swiper/swiper.css";

import { toast } from "sonner";
import { Info } from "lucide-react";

import ImageSkeleton from "../skeleton/ImageSkeleton";
import clsx from "clsx";
import scss from "./landingpage.module.scss";
import axiosInstance from "@/axios/axios";
import { Link } from "react-router-dom";
import { d } from "../utils/crypto";
import type { CategoryData } from "../utils/types";

const ExploreDestination = () => {
  const [categories, setCategories] = useState<CategoryData[]>([]);


  async function fetchCategories() {
    try {
      const response = await axiosInstance.post(
        `/api/category/getAllCategories`
      );

      if (response?.status === 200) {
        const res = JSON.parse(await d(response?.data));
        setCategories(res);
      }
    } catch {
      toast("Error", {
        description: "Unable to fetch categories.",
        icon: <Info className="text-red-600 w-4 h-4" />,
      });
    }
  }
  useEffect(() => {
    fetchCategories();
  }, []);

  return (
    <section
      className={clsx(
        scss.destination_wrapper,
        "relative bg-gradient-to-b from-[#f1dd77d3] to-[#88e6e7] py-16 pb-26 md:py-24 lg:py-25 overflow-hidden"
      )}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-4 text-center">
        <div className={scss.common_title}>
          <div className="relative inline-block text-center mb-8 md:mb-12">
            <h2
              className={`text-3xl sm:text-4xl md:text-5xl text-black mb-2 font-[Pacifico]`}
            >
              Explore Destinations
              <div className="absolute left-1/2 top-full -translate-x-1/2 mt-1 md:mt-2 w-40 sm:w-60 md:w-80 h-8 sm:h-16 md:h-10">
                <img
                  src={`${import.meta.env.VITE_BASE}images/dark_btm_line.svg`}
                  alt="Temple Decoration"
                  className="object-contain"
                  loading="lazy"
                />
              </div>
            </h2>
          </div>
          <p className="text-gray-800 mb-8 sm:mb-12 mx-auto">
            Explore the Destinations that suits you best
          </p>
        </div>

        {/* Carousel Section */}
        <div className="px-0 sm:px-0">
          <Swiper
            modules={[Autoplay]}
            spaceBetween={16}
            slidesPerView={1}
            autoplay={{ delay: 3000, disableOnInteraction: false }}

            // loop
            breakpoints={{
              640: {
                slidesPerView: 1,
                spaceBetween: 20,
              },
              768: {
                slidesPerView: 2,
                spaceBetween: 24,
              },
              1024: {
                slidesPerView: 3,
                spaceBetween: 28,
              },
            }}
          >
            {categories.map((category) => (
              <>
                <SwiperSlide key={category.name}>
                  <div className="group relativ overflow-hidden">
                    <div className="relative w-full h-[52vh] ">
                      <img
                        src={`${import.meta.env.VITE_APP_API_BASE_URL}/files/load-file-by-path?path=${category.cover_image}`}
                        alt={category.name}
                        loading="lazy"
                        className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 rounded-lg"
                      />

                      <div className="absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center hover:rounded-lg">
                        <Link
                          to={`/most-visited-destinations/${category.url_value}`}
                          className="bg-white text-black px-6 py-2 rounded-full shadow-md hover:bg-yellow-200 transition-all cursor-pointer"
                          aria-label={`View ${category.name}`}
                        >
                          View {category.name}
                        </Link>
                      </div>
                    </div>
                    <div className="p-2">
                      <h3 className="text-2xl font-semibold mt-2">
                        {category.name}
                      </h3>
                    </div>
                  </div>
                </SwiperSlide>
              </>
            ))}
            {categories.length === 0 && (
              <>
                <div className="grid grid-cols-3 max-h-60">
                  <ImageSkeleton />
                  <ImageSkeleton />
                  <ImageSkeleton />
                </div>
              </>
            )}
          </Swiper>
        </div>
      </div>

      {/* Decorative Bottom Elements */}
      <div className="w-full">
        {/* Left Temple */}
        <div className="absolute bottom-0 sm:!bottom-8 md:!bottom-7 left-0 w-20 sm:w-32 md:w-40 h-26 sm:h-24 md:h-32 z-20">
          <img
            src={`${import.meta.env.VITE_BASE}images/Isolation_Mode-1.png`}
            alt="Left Temple"
            loading="lazy"
            className={clsx(
              scss.tample_img,
              "object-contain object-left-bottom"
            )}
          />
        </div>

        {/* Wave Pattern */}
        <div className="absolute bottom-0 xs:!-bottom-50 left-0 right-0 h-12 sm:h-16 md:h-20 z-10">
          <div className="relative w-full h-full">
            <img
              src={`${import.meta.env.VITE_BASE}images/Vector.png`}
              alt="Wave Pattern"
              className="object-cover object-top w-full"
              sizes="100vw"
              loading="lazy"
            />
          </div>
        </div>

        {/* Right Temple */}
        <div className="absolute bottom-8 sm:bottom-8 md:bottom-11 right-0 w-20 sm:w-32 md:w-40 h-16 sm:h-24 md:h-32 z-20">
          <img
            src={`${import.meta.env.VITE_BASE}images/Isolation_Mode-1.png`}
            alt="Right Temple"
            className={clsx(
              scss.temple_img,
              "object-contain object-right-bottom scale-x-[-1]"
            )}
          />
        </div>
      </div>
    </section>
  );
};

export default ExploreDestination;