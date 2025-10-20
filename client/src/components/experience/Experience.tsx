import { useEffect, useState } from "react";
import scss from "./experience.module.scss";
import clsx from "clsx";
import AOS from "aos";
import "aos/dist/aos.css"; // Import AOS styles

import { toast } from "sonner";
import { CircleAlert, Info } from "lucide-react";
import type { EperienceData, SliderImagedData } from "../utils/types";
import axiosInstance from "@/axios/axios";
import { d } from "../utils/crypto";
import DocumentTitle from "../DocumentTitle";
import CommonSlider from "../slider/CommonSlider";


const Experience = () => {
    const [sliderImages, setSliderImages] = useState<SliderImagedData[]>([]);
    const [experiences, setExperiences] = useState<EperienceData[]>([]);

    useEffect(() => {
        AOS.init({
            // duration: 10000, // Increased duration for smoother animation
            // easing: 'ease-in-out-sine', // Smoother easing function
            once: true, // Animation happens only once
            // offset: 50, // Trigger animations slightly earlier
        });
    }, []);

    // get slider images
    useEffect(() => {
        async function fetchSliderImages() {
            try {
                const res = await axiosInstance.get("/api/experiences/slider-images");
                if (res.status === 200) {
                    const images = JSON.parse(await d(res?.data));
                    setSliderImages(images);
                }
            } catch {
                toast("Error!", {
                    description: "Unable to fetch images.",
                    icon: <CircleAlert className="text-red-500" />,
                });
            }
        }

        fetchSliderImages();
    }, []);

    useEffect(() => {
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
            <DocumentTitle title="Experience" />
            <CommonSlider sliderImages={sliderImages} />
            <div className={clsx(scss.category_div)}>
                <div className="container">
                    <div className={scss.destination_title}>
                        <h2 className={clsx(scss.cattitle, "mt-5")}>Experiences of J&K</h2>
                    </div>
                    <div className={clsx(scss.category_data, "pb-12")}>
                        {experiences.length > 0 &&
                            experiences.map((item, index) => (
                                <div
                                    className={clsx(scss.category_div, scss.halfdiv)}
                                    data-aos="fade-up"
                                    data-aos-delay="100"
                                    data-aos-duration="2000"
                                    key={index}
                                >
                                    <a href={`/experience/${item.url_value}`}>
                                        <img
                                            src={`${import.meta.env.VITE_APP_API_BASE_URL
                                                }/files/load-file-by-path?path=${item?.cover_image}`}
                                            alt={item.cover_image || "Cover Image"}
                                            className={clsx(
                                                scss.category_image,
                                                "w-full object-cover"
                                            )}
                                            width={500}
                                            height={250}
                                            loading="lazy"
                                        />
                                        <span>{item.name}</span>
                                    </a>
                                </div>
                            ))}
                    </div>
                </div>
            </div>
        </>
    );
}

export default Experience