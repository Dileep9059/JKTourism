"use client";

import { useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";
import scss from "./gallery.module.scss";
import clsx from "clsx";

import { BookImage, Camera, Video } from "lucide-react";
import { Link } from "react-router-dom";


export default function GallerySection() {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <section
      className={clsx(
        scss.visualize_jk,
        "relative text-white py-16 pb-2 px-4 md:px-8 sm:px-6 lg:px-8 text-center space-y-12"
      )}
    >
      <div className={scss.dark_wave}>
        <img src="/images/dark_wave.svg" alt="dark wave" />
      </div>
      {/* Background Video */}
      <video
        className="absolute top-0 left-0 w-full h-full object-cover z-0"
        src="/videos/GallaryBg.mp4"
        autoPlay
        loop
        muted
        playsInline
      ></video>

      {/* Gradient Overlay */}
      <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-black/70 via-black/50 to-black/70 z-10"></div>

      {/* Foreground Content */}
      <div className="container relative z-20 mx-auto">
        <div className={clsx(scss.common_title, "mb-12")}>
          <h2
            className={`text-4xl md:text-5xl text-red-700 mb-2 font-[pacifico]`}
          >
            Visualize JK
          </h2>
          <div className="flex justify-center my-6">
            <img
              src="/images/dark_btm_line.svg"
              alt="Decorative Divider"
              width={500}
              height={30}
              className="object-contain"
            />
          </div>
          <p className="text-white text-opacity-80 mx-auto">
            Discover the breathtaking beauty of Jammu & Kashmir through our
            curated collections of photos, videos, and travel brochures.
            Discover the breathtaking beauty of Jammu & Kashmir through our
            curated collections of photos, videos, and travel brochures.
          </p>
        </div>

        {/* Swiper for Cards */}
        <Swiper
          modules={[Autoplay, Pagination]}
          spaceBetween={35}
          slidesPerView={1}
          loop={true}
          // pagination={{ clickable: true }}
          autoplay={{ delay: 3000, disableOnInteraction: false }}
          breakpoints={{
            640: { slidesPerView: 1 },
            768: { slidesPerView: 2 },
            1024: { slidesPerView: 3 },
          }}
        >
          <SwiperSlide className={scss.slide_block}>
            <div
              className={scss.visualize_card}
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
            >
              <div className={scss.visualize_img_wrapper}>
                <a href="/album" className={scss.hover_card}>
                  <Camera />
                </a>
                <div className={scss.visualize_img_block}>
                  <div className={scss.visualize_img}>
                    <img src="/images/visualize-1.1.png" />
                  </div>
                  <div className={scss.visualize_img}>
                    <img src="/images/visualize-1.2.png" />
                  </div>
                </div>

                <div className={scss.visualize_img_block}>
                  <div className={scss.visualize_img}>
                    <img src="/images/visualize-1.3.png" />
                  </div>
                </div>
              </div>

              <div className={scss.visualize_foot}>
                <h3 className="text-2xl font-bold text-red-400 mb-3">
                  Photo Gallery
                </h3>
                <Link to="/album">Explore More</Link>
              </div>
            </div>
          </SwiperSlide>

          <SwiperSlide className={scss.slide_block}>
            <div
              className={scss.visualize_card}
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
            >
              <div className={scss.visualize_img_wrapper}>
                <a href="/album" className={scss.hover_card}>
                  <Video />
                </a>
                <div className={scss.visualize_img_block}>
                  <div className={scss.visualize_img}>
                    <img src="/images/video-1.jpeg" />
                  </div>
                  <div className={scss.visualize_img}>
                    <img src="/images/video-2.jpeg" />
                  </div>
                </div>

                <div className={scss.visualize_img_block}>
                  <div className={scss.visualize_img}>
                    <img src="/images/video-3.jpeg" />
                  </div>
                  <div className={scss.visualize_img}>
                    <img src="/images/video-4.jpeg" />
                  </div>
                </div>
              </div>

              <div className={scss.visualize_foot}>
                <h3 className="text-2xl font-bold text-red-400 mb-3">
                  Video Gallery
                </h3>
                <Link to="/album">Explore More</Link>
              </div>
            </div>
          </SwiperSlide>
          <SwiperSlide className={scss.slide_block}>
            <div
              className={scss.visualize_card}
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
            >
              <div className={scss.visualize_img_wrapper}>
                <a href="/album" className={scss.hover_card}>
                  <BookImage />
                </a>
                <div className={scss.visualize_img_block}>
                  <div className={scss.visualize_img}>
                    <img src="/images/guide-1.jpeg" />
                  </div>
                </div>
              </div>

              <div className={scss.visualize_foot}>
                <h3 className="text-2xl font-bold text-red-400 mb-3">
                  E Brochures
                </h3>
                <Link to="/album">Explore More</Link>
              </div>
            </div>
          </SwiperSlide>
        </Swiper>
      </div>
    </section>
  );
}