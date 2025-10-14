import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import "swiper/swiper-bundle.css";

import { Info } from "lucide-react";
import { toast } from "sonner";

import clsx from "clsx";
import scss from "./experience.module.scss";
import { d } from "../utils/crypto";
import axiosInstance from "@/axios/axios";
import type { EperienceData } from "../utils/types";
import { Link } from "react-router-dom";



export default function ExperienceCarousel() {
  const [experiences, setExperiences] = React.useState<EperienceData[]>([]);

  React.useEffect(() => {
    async function fetchExperiences() {
      try {
        const response = await axiosInstance.get(`/api/experiences/get-experiences`);

        if (response?.status === 200) {
          const res = JSON.parse(await d(response?.data));
          setExperiences(res);
        }
      } catch {
        toast("Error", {
          description: "Unable to fetch experiences.",
          icon: <Info className="text-red-600 w-4 h-4" />,
        });
      }
    }

    fetchExperiences();
  }, []);

  return (
    <>
      <div className="w-full relative">
        <div className="relative w-full h-20">
          {" "}
          <img
            src="/images/Vector_.png"
            alt="Wave Pattern"
            width={500}
            height={500}
            className="absolute top-0 w-full"
            style={{ top: "-85%", maxHeight: "150px" }}
            loading="lazy"
          />
        </div>
        <div className={clsx(scss.experiences, "py-10 pt-4 bg-white")}>
          <img
            src="/images/experience_bg.png"
            alt="background image"
            className={scss.exp_bg}
          />
          <div className={scss.common_title}>
            <div className="text-center mb-4">
              <h2
                className="text-5xl text-center mb-4 font-[Pacifico]"
                style={{  color: "#CD0D0D"}}
              >
                Experiences of JK
              </h2>
              <div className="flex justify-center pt-2">
                <img
                  src="/images/dark_btm_line.svg"
                  alt="Decorative Divider"
                  width={500}
                  height={30}
                  className="object-contain w-3/4 sm:w-2/3 md:w-[500px] h-auto"
                />
              </div>
            </div>
            <p className="text-center mx-auto text-gray-700">
              Jammu and Kashmir blend nature and tradition beautifully. Pampore’s
              saffron fields, Srinagar’s Craft Safari, and Bhaderwah’s lavender
              valleys showcase the region’s charm. A serene shikara ride on Dal
              Lake, with Himalayan reflections, completes the experience. Each
              moment in JK is a story of beauty, culture, and timeless memories.
            </p>
          </div>
          <div className="mt-13 px-5">
            <Swiper
              modules={[Autoplay]}
              className={scss.experience_slide_wrapper}
              spaceBetween={20}
              slidesPerView={1}
              autoplay={{ delay: 1500, disableOnInteraction: false }}
              breakpoints={{
                640: { slidesPerView: 1 },
                768: { slidesPerView: 2 },
                1024: { slidesPerView: 3 },
                1280: { slidesPerView: 5 },
              }}
              loop
            >
              {experiences.map((exp, idx) => (
                <SwiperSlide key={idx}>
                  <div
                    className="relative h-[58vh] overflow-hidden group"
                    style={{
                      backgroundImage: `url(${import.meta.env.VITE_APP_API_BASE_URL}/files/load-file-by-path?path=${exp.cover_image})`,
                      backgroundSize: "cover",
                      backgroundPosition: "center",
                    }}
                  > 
                    <div className={clsx(scss.exp_content ,"absolute bottom-0 p-4 text-white")} >
                      <h3 className="text-xl font-bold mb-1">{exp.name}</h3>
                      <Link
                        to={`/experience/` + exp.url_value}
                        className="text-white font-semibold flex items-center gap-1"
                      >
                        Explore More <span className="text-xl">→</span>
                      </Link>
                    </div>
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        </div>
        <div
          className={clsx(
            scss.boat_img,
            "absolute bottom-0 translate-y-30 -translate-5 left-0 z-20"
          )}
        >
          <img
            src="/images/boat.png"
            alt="Bottom Right"
            width={650}
            height={285}
          />
        </div>
      </div>
    </>
  );
}