
import { useEffect, useState } from "react";

import scss from "./detailtab.module.scss";
import { Swiper, SwiperSlide } from "swiper/react";
import clsx from "clsx";

import "swiper/swiper.css";
import { FreeMode, Navigation, Thumbs } from "swiper/modules";
import type { Swiper as SwiperType } from "swiper";
import parse from "html-react-parser";
import { Download, FileText, InfoIcon, ViewIcon } from "lucide-react";
import { d, e } from "../utils/crypto";
import axiosInstance from "@/axios/axios";
import Missing from "../Missing";
import Slider from "../slider/Slider";
import { toast } from "sonner";
import Gallerytab from "../categories/Gallerytab";
import { useParams } from "react-router-dom";
import DocumentTitle from "../DocumentTitle";

type Activity = {
    title: string;
    description: string;
    content: string;
};

type Brochures = {
    title: string;
    file: string;
}

type ActivityData = {
    activity: Activity;
    images: string[];
    brochures: Brochures[]
};

const ActivityName = () => {
    const { activityName } = useParams();
    const [activityData, setActivityData] = useState<ActivityData>({} as ActivityData);

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
        thumbs: { swiper: thumbsSwiper },
        modules: [FreeMode, Navigation, Thumbs],
        className: "mySwiper2",
        autoHeight: true,
    };

    async function getchActivityData() {
        const params = {
            activityName: activityName
        }
        try {
            const encParams = await e(JSON.stringify(params));
            const resp = await axiosInstance.post(
                "/api/activities/get-activity-by-name",
                encParams
            );
            if (resp?.status === 200) {
                const data = JSON.parse(await d(resp.data));
                setActivityData(data);
            }
        } catch (error: any) {
            setActivityData({} as ActivityData);
            toast.error("Activity not found.")
        }
    }
    useEffect(() => {
        getchActivityData();
    }, [activityName]);


    useEffect(() => {
        return () => {
            if (thumbsSwiper && !thumbsSwiper.destroyed) {
                thumbsSwiper.destroy();
            }
        };
    }, [thumbsSwiper]);


    if (Object.keys(activityData).length === 0) return <Missing />

    return (
        <>
            <DocumentTitle title={activityName ?? ""} />
            {activityData?.images && <Slider sliderImages={activityData.images} />}
            <div className={clsx(scss.detailtabmain, "container mx-auto mt-5 p-3")}>
                <div className="mx-5 mb-2">
                    <h2 className={clsx(scss.cattitle, "font-bold text-xl")}>
                        {` ${activityData?.activity?.title.replace(/^\w/, (c: string) =>
                            c.toUpperCase()
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
                                        {`About ${activityData?.activity?.title.replace(
                                            /^\w/,
                                            (c: string) => c.toUpperCase()
                                        )}`}
                                    </h2>
                                </div>

                                <p className="text-gray-700 leading-relaxed relative pl-4 border-l border-gray-200">
                                    {activityData?.activity?.description}
                                </p>

                                <div className={clsx(scss.tips_explore, "relative mt-12 mb-6")}>
                                    <div className="flex items-center gap-2 relative">
                                        <div className={scss.star_icon}>
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
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
                                    {parse(activityData?.activity?.content || "")}
                                </div>

                                {/* BROCHURES */}
                                {(activityData?.brochures?.length ?? 0) > 0 && (
                                    <div className="w-full  mx-auto rounded-xl"> {/* Increased max-width, added mx-auto for centering */}
                                        <h3 className="mb-6 text-2xl font-bold text-gray-900">Brochures & Resources</h3> {/* More prominent heading */}

                                        {/* Responsive Grid for Brochures */}
                                        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6"> {/* Responsive grid classes */}
                                            {activityData?.brochures.map((brochure, index) => (
                                                <a
                                                    key={index}
                                                    href={`${import.meta.env.VITE_APP_API_BASE_URL}/files/load-file-by-path?path=${brochure.file}`}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="group flex flex-col items-center p-5 rounded-lg border border-gray-100 bg-gray-50 text-center 
                     transition-all duration-200 hover:bg-white hover:border-indigo-200 hover:shadow-md 
                     focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                                                >
                                                    {/* Icon (assuming FileText is your icon component) */}
                                                    <FileText className="h-10 w-10 text-indigo-500 mb-4 group-hover:text-indigo-600 transition-colors duration-200" />

                                                    {/* Brochure Title */}
                                                    <span className="font-semibold text-lg text-gray-800 group-hover:text-indigo-700 leading-tight mb-2 truncate w-full px-2">
                                                        {brochure.title}
                                                    </span>

                                                    {/* Optional: Visual cue for download */}
                                                    <div className="mt-4 text-indigo-500 group-hover:text-indigo-700 transition-all duration-200 transform group-hover:translate-y-0.5">
                                                        <Download />
                                                    </div>
                                                </a>
                                            ))}
                                        </div>
                                    </div>
                                )}

                            </div>
                        </div>
                    </SwiperSlide>
                    <SwiperSlide>
                        <div className="px-2">
                            <div className="transform transition-all duration-500 ease-in-out bg-gradient-to-br from-white to-orange-50 rounded-xl shadow-lg p-6 border-t-4 border-orange-500">
                                {activityData?.images && (
                                    <Gallerytab galleryImages={activityData.images} />
                                )}
                            </div>
                        </div>
                    </SwiperSlide>
                </Swiper>

            </div >
        </>
    );
};

export default ActivityName;