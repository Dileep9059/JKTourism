import { useEffect, useState } from "react";

import scss from "./detailtab.module.scss";
import { Swiper, SwiperSlide } from "swiper/react";
import clsx from "clsx";
import { InfoIcon, StarIcon, ViewIcon } from "lucide-react";
import "swiper/swiper-bundle.css";
import { FreeMode, Navigation, Thumbs } from "swiper/modules";
import type { Swiper as SwiperType } from "swiper";

import parse from "html-react-parser";
import type { DestinationInfo } from "../utils/types";
import Gallerytab from "./Gallerytab";
import Reviewtab from "./Reviewtab";

function Detailtab({
    placeName,
    destinationdata,
}: {
    placeName: string;
    destinationdata: DestinationInfo;
}) {

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

    useEffect(() => {
        return () => {
            if (thumbsSwiper && !thumbsSwiper.destroyed) {
                thumbsSwiper.destroy();
            }
        };
    }, [thumbsSwiper]);
    return (
        <div className={clsx(scss.detailtabmain, "container mx-auto mt-5 p-3")}>
            <div className="mx-5 mb-2">
                <div
                    className={clsx(
                        scss.eventdetail_review,
                        "flex items-center justify-between"
                    )}
                >
                    {/* <div className={scss.review_inner}>
                        <button>Jammu</button>
                    </div> */}
                    {/* <div className={clsx(scss.review_inner, "flex items-center gap-2")}>
                        <IoMdStar fontSize={20} />
                        <p>5 (35 positive reviews)</p>
                    </div> */}
                </div>
                <h2 className={clsx(scss.cattitle, "font-bold text-xl")}>
                    {` ${destinationdata?.destination?.title.replace(/^\w/, (c: string) =>
                        c.toUpperCase()
                    )}`}
                </h2>
                {/* <h4 className="flex flex-row gap-2 text-sm items-center">
                    {" "}
                    <MapPin className="h-4 w-4 text-red-600" /> View on Map{" "}
                </h4> */}
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
                <SwiperSlide>
                    <div className={clsx(scss.slide_btn_tab, "slide_btn_tab")}>
                        <StarIcon /> <span>Reviews</span>
                    </div>
                </SwiperSlide>
            </Swiper>

            <Swiper {...mainSwiperOptions} className={scss.album_slider_main}>
                <SwiperSlide className="pt-3">
                    <div className="px-2">
                        <div className="transform transition-all duration-500 ease-in-out bg-gradient-to-br from-white to-rose-50 rounded-xl shadow-lg p-2 lg:p-6 border-t-4 border-rose-500">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="w-1 h-8 bg-gradient-to-b from-indigo-600 to-indigo-300 rounded-full"></div>
                                <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-700 via-purple-700 to-indigo-700">
                                    {`About ${destinationdata?.destination?.title.replace(
                                        /^\w/,
                                        (c: string) => c.toUpperCase()
                                    )}`}
                                </h2>
                            </div>

                            {destinationdata?.destination?.content && (
                                <div className="leading-relaxed relative pl-4 border-l border-gray-200 my-3">
                                    {parse(destinationdata?.destination?.content || "")}
                                </div>
                            )}
                            <p className="text-gray-700 leading-relaxed relative pl-4 border-l border-gray-200">
                                {destinationdata?.destination?.description}
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
                                        Tips to Explore
                                    </h3>
                                </div>
                                <div className="w-32 h-2 bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 rounded-full mt-2 mb-6"></div>
                            </div>

                            <div className="space-y-6">
                                <div
                                    className={clsx(
                                        scss.sub_abtdata,
                                        "p-5 bg-gradient-to-r from-red-50 to-orange-50 rounded-lg border-l-4 border-red-400 hover:shadow-md transition-all duration-300 transform hover:-translate-y-1"
                                    )}
                                >
                                    <h3 className="font-bold text-gray-800 mb-2 flex items-center">
                                        <span className="w-8 h-8 bg-red-100 rounded-full mr-2 flex items-center justify-center">
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                width="16"
                                                height="16"
                                                viewBox="0 0 24 24"
                                                fill="none"
                                                stroke="currentColor"
                                                strokeWidth="2"
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                className="text-red-500"
                                            >
                                                <path d="M12 8v4l3 3m6-3a9 9 0 1 1-18 0 9 9 0 0 1 18 0z"></path>
                                            </svg>
                                        </span>
                                        Best Time to Visit:
                                    </h3>
                                    {/* <p className="flex items-center gap-2 text-gray-600 ml-10"> */}
                                    <ul className="space-y-2 ml-10">
                                        {destinationdata?.whichTime?.map((e: any, idx: number) => (
                                            <li
                                                key={idx}
                                                className={clsx(
                                                    scss.explore_list,
                                                    "flex items-center gap-2 text-gray-600"
                                                )}
                                            >
                                                <div className={scss.explore_list_block}>
                                                    <svg
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        width="16"
                                                        height="16"
                                                        viewBox="0 0 24 24"
                                                        fill="none"
                                                        stroke="currentColor"
                                                        strokeWidth="2"
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        className="text-red-500 flex-shrink-0"
                                                    >
                                                        <circle cx="12" cy="12" r="10"></circle>
                                                        <line x1="12" x2="12" y1="8" y2="12"></line>
                                                        <line x1="12" x2="12.01" y1="16" y2="16"></line>
                                                    </svg>
                                                    {/* <span>Summer (May–June) | Winter (Dec – Feb)</span> */}
                                                    <span className="font-semibold">{e.title}</span>
                                                </div>{" "}
                                                <span className={scss.line}>|</span>{" "}
                                                <span>{e.description}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>

                                <div
                                    className={clsx(
                                        scss.sub_abtdata,
                                        "p-5 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-lg border-l-4 border-blue-400 hover:shadow-md transition-all duration-300 transform hover:-translate-y-1"
                                    )}
                                >
                                    <h3 className="font-bold text-gray-800 mb-2 flex items-center">
                                        <span className="w-8 h-8 bg-blue-100 rounded-full mr-2 flex items-center justify-center">
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                width="16"
                                                height="16"
                                                viewBox="0 0 24 24"
                                                fill="none"
                                                stroke="currentColor"
                                                strokeWidth="2"
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                className="text-blue-500"
                                            >
                                                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
                                            </svg>
                                        </span>
                                        How to Reach:
                                    </h3>
                                    <ul className="space-y-2 ml-10">
                                        {destinationdata?.travel?.map((e: any, idx: number) => (
                                            <li
                                                key={idx}
                                                className={clsx(
                                                    scss.explore_list,
                                                    "flex items-center gap-2 text-gray-600"
                                                )}
                                            >
                                                <div className={scss.explore_list_block}>
                                                    <svg
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        width="16"
                                                        height="16"
                                                        viewBox="0 0 24 24"
                                                        fill="none"
                                                        stroke="currentColor"
                                                        strokeWidth="2"
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        className="text-blue-500 flex-shrink-0"
                                                    >
                                                        <path d="M14.106 5.553a2 2 0 0 0 1.788 0l3.659-1.83A1 1 0 0 1 21 4.619v12.764a1 1 0 0 1-.553.894l-4.553 2.277a2 2 0 0 1-1.788 0l-4.212-2.106a2 2 0 0 0-1.788 0l-3.659 1.83A1 1 0 0 1 3 19.381V6.618a1 1 0 0 1 .553-.894l4.553-2.277a2 2 0 0 1 1.788 0z"></path>
                                                        <path d="M15 5.764v15"></path>
                                                        <path d="M9 3.236v15"></path>
                                                    </svg>
                                                    <span className="font-semibold">{e.title}</span>
                                                </div>{" "}
                                                <span className={scss.line}>|</span>{" "}
                                                <span>{e.description}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>

                                <div
                                    className={clsx(
                                        scss.sub_abtdata,
                                        "p-5 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg border-l-4 border-green-400 hover:shadow-md transition-all duration-300 transform hover:-translate-y-1"
                                    )}
                                >
                                    <h3 className="font-bold text-gray-800 mb-2 flex items-center">
                                        <span className="w-8 h-8 bg-green-100 rounded-full mr-2 flex items-center justify-center">
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                width="16"
                                                height="16"
                                                viewBox="0 0 24 24"
                                                fill="none"
                                                stroke="currentColor"
                                                strokeWidth="2"
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                className="text-green-500"
                                            >
                                                <path d="M20 16.2A4.5 4.5 0 0 0 17.5 8h-1.8A7 7 0 1 0 4 14.9"></path>
                                                <path d="M12 12v9"></path>
                                                <path d="m8 17 4 4 4-4"></path>
                                            </svg>
                                        </span>
                                        Local Attractions
                                    </h3>
                                    <ul className="space-y-3 ml-10">
                                        {destinationdata?.attraction?.map((e: any, idx: number) => (
                                            <li
                                                key={idx}
                                                className={clsx(
                                                    scss.explore_list,
                                                    "flex items-start gap-2 text-gray-600"
                                                )}
                                            >
                                                <div className={scss.explore_list_block}>
                                                    <svg
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        width="16"
                                                        height="16"
                                                        viewBox="0 0 24 24"
                                                        fill="none"
                                                        stroke="currentColor"
                                                        strokeWidth="2"
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        className="text-green-500 flex-shrink-0"
                                                    >
                                                        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                                                    </svg>
                                                    <span className="font-semibold">{e.title}</span>
                                                </div>{" "}
                                                <span className={scss.line}>|</span>{" "}
                                                <span>{e.description}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>

                                <div
                                    className={clsx(
                                        scss.sub_abtdata,
                                        "p-5 bg-gradient-to-r from-purple-50 to-fuchsia-50 rounded-lg border-l-4 border-purple-400 hover:shadow-md transition-all duration-300 transform hover:-translate-y-1"
                                    )}
                                >
                                    <h3 className="font-bold text-gray-800 mb-2 flex items-center">
                                        <span className="w-8 h-8 bg-purple-100 rounded-full mr-2 flex items-center justify-center">
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                width="16"
                                                height="16"
                                                viewBox="0 0 24 24"
                                                fill="none"
                                                stroke="currentColor"
                                                strokeWidth="2"
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                className="text-purple-500"
                                            >
                                                <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                                                <polyline points="9 22 9 12 15 12 15 22"></polyline>
                                            </svg>
                                        </span>
                                        Staying Options
                                    </h3>
                                    <ul className="space-y-3 ml-10">
                                        {destinationdata?.accomodation?.map((e: any, idx: number) => (
                                            <li
                                                key={idx}
                                                className={clsx(
                                                    scss.explore_list,
                                                    "flex items-start gap-2 text-gray-600"
                                                )}
                                            >
                                                <div className={scss.explore_list_block}>
                                                    <svg
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        width="16"
                                                        height="16"
                                                        viewBox="0 0 24 24"
                                                        fill="none"
                                                        stroke="currentColor"
                                                        strokeWidth="2"
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        className="text-purple-500 flex-shrink-0 mt-1"
                                                    >
                                                        <circle cx="12" cy="12" r="10"></circle>
                                                        <line x1="12" x2="12" y1="8" y2="12"></line>
                                                        <line x1="12" x2="12.01" y1="16" y2="16"></line>
                                                    </svg>
                                                    <span className="font-semibold">{e.title}</span>
                                                </div>{" "}
                                                <span className={scss.line}>|</span>{" "}
                                                <span>{e.description}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>

                                <div
                                    className={clsx(
                                        scss.sub_abtdata,
                                        "p-5 bg-gradient-to-r from-yellow-50 to-amber-50 rounded-lg border-l-4 border-yellow-400 hover:shadow-md transition-all duration-300 transform hover:-translate-y-1"
                                    )}
                                >
                                    <h3 className="font-bold text-gray-800 mb-2 flex items-center">
                                        <span className="w-8 h-8 bg-yellow-100 rounded-full mr-2 flex items-center justify-center">
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                width="16"
                                                height="16"
                                                viewBox="0 0 24 24"
                                                fill="none"
                                                stroke="currentColor"
                                                strokeWidth="2"
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                className="text-yellow-500"
                                            >
                                                <path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2"></path>
                                                <path d="M7 2v20"></path>
                                                <path d="M21 15V2v0a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3Zm0 0v7"></path>
                                            </svg>
                                        </span>
                                        Food to Try
                                    </h3>
                                    <ul className="space-y-3 ml-10">
                                        {destinationdata?.cuisine?.map((e: any, idx: number) => (
                                            <li
                                                key={idx}
                                                className={clsx(
                                                    scss.explore_list,
                                                    "flex items-start gap-2 text-gray-600"
                                                )}
                                            >
                                                <div className={scss.explore_list_block}>
                                                    <svg
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        width="16"
                                                        height="16"
                                                        viewBox="0 0 24 24"
                                                        fill="none"
                                                        stroke="currentColor"
                                                        strokeWidth="2"
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        className="text-yellow-500 flex-shrink-0 mt-1"
                                                    >
                                                        <path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2"></path>
                                                        <path d="M7 2v20"></path>
                                                        <path d="M21 15V2v0a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3Zm0 0v7"></path>
                                                    </svg>
                                                    <span className="font-semibold">{e.title}</span>
                                                </div>{" "}
                                                <span className={scss.line}>|</span>{" "}
                                                <span>{e.description}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                </SwiperSlide>
                <SwiperSlide>
                    <div className="px-2">
                        <div className="transform transition-all duration-500 ease-in-out bg-gradient-to-br from-white to-orange-50 rounded-xl shadow-lg p-6 border-t-4 border-orange-500">
                            <Gallerytab galleryImages={destinationdata?.images} />
                        </div>
                    </div>
                </SwiperSlide>

                <SwiperSlide>
                    <div className="px-2">
                        <div className="transform transition-all duration-500 ease-in-out bg-gradient-to-br from-white to-amber-50 rounded-xl shadow-lg p-6 border-t-4 border-amber-500">
                            <Reviewtab reviews={destinationdata?.reviews} />
                        </div>
                    </div>
                </SwiperSlide>
            </Swiper>
        </div>
    );
}

export default Detailtab;
