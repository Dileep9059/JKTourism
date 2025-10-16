
import { useEffect, useState } from "react";

import clsx from "clsx";
import scss from "./landingpage.module.scss";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";

import "swiper/swiper-bundle.css";
import AOS from "aos";
import "aos/dist/aos.css";
import { toast } from "sonner";
import { CircleAlert } from "lucide-react";
import axiosInstance from "@/axios/axios";
import { d } from "../utils/crypto";
import type { SliderImagedData } from "../utils/types";
import { Link } from "react-router-dom";


function Categories() {
    const [sliderImages, setSliderImages] = useState<SliderImagedData[]>([]);
    useEffect(() => {
        AOS.init({
            // duration: 10000, // Increased duration for smoother animation
            // easing: 'ease-in-out-sine', // Smoother easing function
            once: true, // Animation happens only once
            // offset: 50, // Trigger animations slightly earlier
        });
    }, []);

    useEffect(() => {
        async function fetchSliderImages() {
            try {
                const res = await axiosInstance.get("/api/landing/slider-images");
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
    return (
        <>

            <div
                className={clsx(scss.category_main)}
                data-aos="fade-up"
                data-aos-duration="2000"
            >
                <div className="">
                    <div
                        className={clsx(scss.category_data, "row justify-content-center")}
                    >
                        <div className={clsx(scss.colgrid, "mx-0")}>
                            <div
                                className={clsx(scss.category_div, scss.no_hover, "border-0")}
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
                                    // Connect with thumbs
                                    className={scss.mainSwiper}
                                >
                                    {sliderImages.map((image, index) => (
                                        <SwiperSlide key={`slide-${index}`}>
                                            <img
                                                src={`${import.meta.env.VITE_APP_API_BASE_URL}/files/load-file-by-path?path=${image.image}`}
                                                className="border-0 w-full max-h-[700px] object-cover"
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
                        <div className="mx-2 lg:mx-auto grid grid-cols-2 lg:grid-cols-4 gap-3 mt-3 mb-3 rounded-2xl lg:max-w-[80%] row">
                            <div
                                className={clsx(scss.colgrid, "rounded-2xl")}
                                data-aos="fade-up"
                                data-aos-delay="200"
                                data-aos-duration="2000"
                            >
                                <div className={clsx(scss.category_div, "rounded-3xl")}>
                                    <Link to={"/most-visited-destinations"}>
                                        <img
                                            src="/assets/images/banner-02.jpg"
                                            alt="Banner"
                                            className={clsx(
                                                scss.category_image,
                                                "w-full object-cover rounded-2xl"
                                            )}
                                        />
                                        <span>Most Visited Destinations</span>
                                    </Link>
                                </div>
                            </div>
                            <div
                                className={clsx(scss.colgrid, "rounded-2xl")}
                                data-aos="fade-up"
                                data-aos-delay="300"
                                data-aos-duration="2000"
                            >
                                <div className={clsx(scss.category_div, "rounded-3xl")}>
                                    <Link to={"/events"}>
                                        <img
                                            src="/assets/images/banner-03.png"
                                            alt="Banner"
                                            className={clsx(
                                                scss.category_image,
                                                "w-full object-cover rounded-2xl"
                                            )}
                                        />
                                        <span>Upcoming Events</span>
                                    </Link>
                                </div>
                            </div>
                            <div
                                className={clsx(scss.colgrid, "rounded-2xl")}
                                data-aos="fade-up"
                                data-aos-delay="400"
                                data-aos-duration="2000"
                            >
                                <div className={clsx(scss.category_div, "rounded-3xl")}>
                                    <Link to={"/experience"}>
                                        <img
                                            src="/assets/images/banner-04.jpg"
                                            alt="Banner"
                                            className={clsx(
                                                scss.category_image,
                                                "w-full object-cover rounded-2xl"
                                            )}
                                        />
                                        <span>Experiences of J&K</span>
                                    </Link>
                                </div>
                            </div>
                            <div
                                className={clsx(scss.colgrid, "rounded-2xl")}
                                data-aos="fade-up"
                                data-aos-delay="500"
                                data-aos-duration="2000"
                            >
                                <div className={clsx(scss.category_div, "rounded-3xl")}>
                                    <Link to="/album">
                                        <img
                                            src="/assets/images/banner-05.png"
                                            alt="Banner"
                                            className={clsx(
                                                scss.category_image,
                                                "w-full object-cover rounded-2xl"
                                            )}
                                        />
                                        <span>Gallery</span>
                                    </Link>
                                </div>
                            </div>
                        </div>
                        <div
                            className={clsx(
                                scss.colgrid,
                                "grid mx-2 lg:mx-auto lg:max-w-[80%] pb-4"
                            )}
                            data-aos="fade-up"
                            data-aos-delay="200"
                            data-aos-duration="2000"
                        >
                            <div
                                className={clsx(
                                    scss.category_div,
                                    scss.ctdiv,
                                    scss.category_contact,
                                    "rounded-2xl"
                                )}
                            >
                                <div className={scss.group_img}>
                                    <img
                                        src="/assets/images/contactld.png"
                                        alt="Banner"
                                        className={clsx(
                                            scss.category_image,
                                            scss.ftdiv,
                                            "w-full object-cover"
                                        )}
                                    />
                                    <img
                                        src="/images/contact_desktop_bg.jpg"
                                        alt="Banner"
                                        className={clsx(
                                            scss.category_image,
                                            scss.ftdiv,
                                            "w-full object-cover"
                                        )}
                                    />
                                </div>
                                <span>
                                    <p className={clsx(scss.category_p, scss.ctdiv, "pb-5")}>
                                        {" "}
                                        Contact Us{" "}
                                    </p>
                                    <div
                                        className={clsx(scss.bottomct, "flex items-center gap-3")}
                                    >
                                        <a href="https://x.com/jandktourism" target="_blank">
                                            <img
                                                src="/assets/images/twitter.png"
                                                alt="Banner"
                                                className={clsx(
                                                    scss.category_image,
                                                    "w-full object-cover"
                                                )}
                                            />
                                        </a>
                                        <a
                                            href="https://www.instagram.com/jktourismofficial"
                                            target="_blank"
                                        >
                                            <img
                                                src="/assets/images/instagram_.png"
                                                alt="Banner"
                                                className={clsx(
                                                    scss.category_image,
                                                    "w-full object-cover"
                                                )}
                                            />
                                        </a>
                                        <a
                                            href="https://www.facebook.com/JKTourismOfficial/"
                                            target="_blank"
                                        >
                                            <img
                                                src="/assets/images/facebook.png"
                                                alt="Banner"
                                                className={clsx(
                                                    scss.category_image,
                                                    "w-full object-cover"
                                                )}
                                            />
                                        </a>
                                        <Link to="/contact-us">
                                            <img
                                                src="/assets/images/contact_us.png"
                                                alt="Banner"
                                                className={clsx(
                                                    scss.category_image,
                                                    "w-full object-cover"
                                                )}
                                            />
                                        </Link>
                                    </div>
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default Categories;
