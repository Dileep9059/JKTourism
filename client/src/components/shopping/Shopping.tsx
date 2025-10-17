"use client";

import { useEffect, useState } from "react";
import scss from "./shopping.module.scss";
import clsx from "clsx";
import AOS from "aos";
import "aos/dist/aos.css";

import { toast } from "sonner";
import { CircleAlert, Info } from "lucide-react";
import type { SliderImagedData } from "../utils/types";
import DocumentTitle from "../DocumentTitle";
import CommonSlider from "../slider/CommonSlider";
import axiosInstance from "@/axios/axios";
import { d } from "../utils/crypto";


export type ShoppingData = {
    name: string;
    cover_image: string;
    url_value: string;
};

function Shopping() {
    const [sliderImages, setSliderImages] = useState<SliderImagedData[]>([]);
    const [shoppingLocations, setShoppingLocations] = useState<ShoppingData[]>(
        []
    );

    useEffect(() => {
        AOS.init({
            // duration: 10000, // Increased duration for smoother animation
            // easing: 'ease-in-out-sine', // Smoother easing function
            once: true, // Animation happens only once
            // offset: 50, // Trigger animations slightly earlier
        });
    }, []);

    async function fetchShoppingLocations() {
        try {
            const response = await axiosInstance.get(
                `/api/shopping/get-shopping-locations`
            );

            if (response?.status === 200) {
                const res = JSON.parse(await d(response?.data));
                setShoppingLocations(res);
            }
        } catch {
            toast("Error", {
                description: "Unable to fetch experiences.",
                icon: <Info className="text-red-600 w-4 h-4" />,
            });
        }
    }
    async function fetchSliderImages() {
        try {
            const res = await axiosInstance.get("/api/shopping/slider-images");
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
    useEffect(() => {
        fetchSliderImages();
    }, []);

    useEffect(() => {
        fetchShoppingLocations();
    }, []);

    return (
        <>
            <DocumentTitle title="Shopping"/>
            <CommonSlider sliderImages={sliderImages} />
            <div
                className={clsx(scss.categorydetail_div)}
                data-aos="fade-up"
                data-aos-duration="2000"
            >
                <div className="container">
                    <div className={scss.destination_title}>
                        <h2 className={clsx(scss.cattitle, "mt-5")}>Shopping in JK</h2>
                    </div>
                    <div className={clsx(scss.category_data, "mb-5")}>
                        {shoppingLocations.length > 0 &&
                            shoppingLocations.map((item, index) => (
                                <div
                                    className={clsx(scss.category_div, scss.halfdiv)}
                                    data-aos="fade-up"
                                    data-aos-delay="100"
                                    data-aos-duration="2000"
                                    key={index}
                                >
                                    <a href={`/shopping/${item.url_value}`}>
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

export default Shopping;
