"use client";
import { use, useEffect, useState } from "react";


import scss from "@/components/categories/detailtab.module.scss";
import { Swiper, SwiperSlide } from "swiper/react";
import clsx from "clsx";


import parse from "html-react-parser";

import "swiper/swiper.css";
import { FreeMode, Navigation, Thumbs } from "swiper/modules";
import type { Swiper as SwiperType } from "swiper";
import Slider from "../slider/Slider";
import { InfoIcon, ViewIcon } from "lucide-react";
import Gallerytab from "../categories/Gallerytab";
import { d, e } from "../utils/crypto";
import axiosInstance from "@/axios/axios";
import { useParams } from "react-router-dom";
import Missing from "../Missing";

type ShoppingLocation = {
    title: string;
    description: string;
    content: string;
};

type ShoppingLocationData = {
    shopping: ShoppingLocation;
    images: string[];
};


const ShoppingLocation = () => {
    const { shoppingLocation } = useParams();
    const [notFoundFlag, setNotFoundFlag] = useState(false);
    const [shoppingLocations, setShoppingLocations] =
        useState<ShoppingLocationData>();

    const [thumbsSwiper, setThumbsSwiper] = useState<SwiperType | null>(null);

    const thumbsSwiperOptions = {
        onSwiper: (swiper: SwiperType) => setThumbsSwiper(swiper),
        spaceBetween: 10,
        slidesPerView: 3,
        freeMode: true,
        watchSlidesProgress: true,
        modules: [FreeMode, Navigation, Thumbs],
        className: "mySwiper",
    };

    const mainSwiperOptions = {
        spaceBetween: 10,
        navigation: false,
        thumbs: thumbsSwiper && !thumbsSwiper.destroyed
            ? { swiper: thumbsSwiper }
            : undefined,
        modules: [FreeMode, Navigation, Thumbs],
        className: "mySwiper2",
        autoHeight: true,
    };

    async function getchActivityData() {
        try {
            const b = {
                name: shoppingLocation
            }
            const encParams = await e(JSON.stringify(b));
            const resp = await axiosInstance.post(
                "/api/shopping/v2/get-shopping-location-by-name",
                encParams
            );
            if (resp?.status === 200) {
                const data = JSON.parse(await d(resp.data));
                setShoppingLocations(data);
                setNotFoundFlag(false);
            }
        } catch (error) {
            setShoppingLocations({} as ShoppingLocationData);
            setNotFoundFlag(true);
        }
    }

    useEffect(() => {
        getchActivityData();
    }, [shoppingLocation]);



    useEffect(() => {
        return () => {
            if (thumbsSwiper && !thumbsSwiper.destroyed) {
                thumbsSwiper.destroy();
            }
        };
    }, [thumbsSwiper]);

    if (notFoundFlag) return <Missing />

    return (
        <>
            {shoppingLocations?.images && (
                <Slider sliderImages={shoppingLocations.images} />
            )}
            <div className={clsx(scss.detailtabmain, "container mx-auto mt-5 p-3")}>
                <div className="mx-5 mb-2">
                    <h2 className={clsx(scss.cattitle, "font-bold")}>
                        {` ${shoppingLocations?.shopping?.title.replace(
                            /^\w/,
                            (c: string) => c.toUpperCase()
                        )}`}
                    </h2>
                </div>


                <Swiper
                    {...thumbsSwiperOptions}
                    className={clsx(scss.mobiletab, "mob_tab")}
                >
                    <SwiperSlide>
                        <div className={clsx(scss.slide_btn_tab, "slide_btn_tab")}>
                            <InfoIcon />
                            <span>About</span>
                        </div>
                    </SwiperSlide>
                    <SwiperSlide>
                        <div className={clsx(scss.slide_btn_tab, "slide_btn_tab")}>
                            <ViewIcon /> <span>Gallery</span>
                        </div>
                    </SwiperSlide>
                </Swiper>

                <Swiper {...mainSwiperOptions} className={scss.album_slider_main}>
                    <SwiperSlide className="pt-3">
                        <div className="px-2">
                            <div className="transform transition-all duration-500 ease-in-out bg-gradient-to-br from-white to-rose-50 rounded-xl shadow-lg p-2 lg:p-6 border-t-4 border-rose-500">
                                <div className="flex items-center gap-3 mb-6">
                                    <div className="w-1 h-8 bg-gradient-to-b from-indigo-600 to-indigo-300 rounded-full"></div>
                                    <h2 className={clsx(scss.title_common, "text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-700 via-purple-700 to-indigo-700")}>
                                        {`About ${shoppingLocations?.shopping?.title.replace(
                                            /^\w/,
                                            (c: string) => c.toUpperCase()
                                        )}`}
                                    </h2>
                                </div>

                                <p className="text-gray-700 leading-relaxed relative pl-4 border-l border-gray-200">
                                    {shoppingLocations?.shopping?.description}
                                </p>

                                <div className={clsx(scss.tips_explore, "relative mt-12 mb-6")}>

                                    <div className="flex items-center gap-2 relative">
                                        <div className={scss.star_icon}>
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                width="28"
                                                height="28"
                                                viewBox="0 0 24 24"
                                                fill="none"
                                                stroke="currentColor"
                                                strokeWidth="2"
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                className="text-yellow-500"
                                            >
                                                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                                            </svg>

                                        </div>
                                        <h3 className="font-bold text-xl text-gray-800">
                                            Information
                                        </h3>
                                    </div>
                                    <div className="w-32 h-2 bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 rounded-full mt-2 mb-6"></div>
                                </div>

                                <div className="prose prose-sm max-w-none">
                                    {parse(shoppingLocations?.shopping?.content || "")}
                                </div>
                            </div>
                        </div>
                    </SwiperSlide>
                    <SwiperSlide>
                        <div className="px-2">
                            <div className="transform transition-all duration-500 ease-in-out bg-gradient-to-br from-white to-orange-50 rounded-xl shadow-lg p-6 border-t-4 border-orange-500">
                                {shoppingLocations?.images && (
                                    <Gallerytab galleryImages={shoppingLocations.images} />
                                )}
                            </div>
                        </div>
                    </SwiperSlide>
                </Swiper>
            </div>
        </>
    );
};

export default ShoppingLocation;