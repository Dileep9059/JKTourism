import { useEffect } from "react";

import clsx from "clsx";
import landingScss from "@/components/home/landingpage.module.scss";


import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";

import "swiper/swiper-bundle.css";

import AOS from "aos";
import "aos/dist/aos.css";
import type { SliderImagedData } from "../utils/types";


const CommonSlider = ({
    sliderImages,
}: {
    sliderImages: SliderImagedData[];
}) => {

    useEffect(() => {
        AOS.init({
            // duration: 10000, // Increased duration for smoother animation
            // easing: 'ease-in-out-sine', // Smoother easing function
            once: true, // Animation happens only once
            // offset: 50, // Trigger animations slightly earlier
        });
    }, []);
    return (
        <>
            <div
                className={clsx(landingScss.category_main)}
                data-aos="fade-up"
                data-aos-duration="2000"
            >
                <div className="sm:container-fluid">
                    <div
                        className={clsx(
                            landingScss.category_data,
                            "row justify-content-center"
                        )}
                    >
                        <div className={clsx(landingScss.colgrid)}>
                            <div
                                className={clsx(
                                    landingScss.category_div,
                                    landingScss.no_hover,
                                    "border-0"
                                )}
                                data-aos="fade-up"
                                data-aos-delay="100"
                                data-aos-duration="2000"
                            >
                                <Swiper
                                    spaceBetween={50}
                                    slidesPerView={1}
                                    loop={true}
                                    speed={1000}
                                    autoplay={{ delay: 3000, disableOnInteraction: false }} // Enable autoplay
                                    modules={[Autoplay]}
                                    className={landingScss.mainSwiper}
                                >
                                    {sliderImages.map((image, index) => (
                                        <SwiperSlide key={`slide-${index}`}>
                                            <img
                                                src={`${import.meta.env.VITE_APP_API_BASE_URL}/files/load-file-by-path?path=${image.image}`}
                                                className="w-full lg:object-cover  border-0"
                                                width={1000}
                                                height={500}
                                                alt={`img-${index}`}
                                                loading="lazy"
                                            />
                                            <span>{image.title}</span>
                                        </SwiperSlide>
                                    ))}
                                </Swiper>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default CommonSlider;
