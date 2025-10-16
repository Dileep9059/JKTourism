import { Navigation,  Scrollbar, A11y, Thumbs } from "swiper/modules";
import { useState, useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";

// Import Swiper styles
import "swiper/swiper.css";
import scss from "./slider.module.scss";


export default function Slider({ sliderImages }: { sliderImages: string[] }) {
  const [thumbsSwiper, setThumbsSwiper] = useState(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [isMobile, setIsMobile] = useState(false);

  const BACKEND_BASE = import.meta.env.VITE_APP_API_BASE_URL;

  // Number of thumbnails to show per page on mobile
  const thumbsPerPage = 5;
  // Calculate total pages
  const totalPages = Math.ceil(sliderImages.length / thumbsPerPage);

  // Check if mobile on mount and window resize
  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    checkIfMobile();

    window.addEventListener('resize', checkIfMobile);

    return () => window.removeEventListener('resize', checkIfMobile);
  }, []);

  const handleNextPage = (event: React.MouseEvent) => {
    event.stopPropagation();
    const nextPage = (currentPage + 1) % totalPages;
    setCurrentPage(nextPage);
  };
  const getCurrentThumbnails = () => {
    const startIndex = currentPage * thumbsPerPage;
    const endIndex = Math.min(startIndex + thumbsPerPage, sliderImages.length);
    return sliderImages.slice(startIndex, endIndex);
  };

  const remainingThumbs = sliderImages.length - ((currentPage + 1) * thumbsPerPage);

  return (
    <div className={scss.sliderContainer}>
      <div className={scss.sliderWrapper}>
        {/* Main Swiper */}
        <Swiper
          modules={[Navigation, Scrollbar, A11y, Thumbs]}
          spaceBetween={50}
          slidesPerView={1}
          navigation
          // Connect with thumbs
          thumbs={{ swiper: thumbsSwiper }}
          className={scss.mainSwiper}
        //   onSwiper={(swiper) => { })}
        // onSlideChange={() => { }}
        >
          {sliderImages.map((image, index) => (
            <SwiperSlide key={`slide-${index}`}>
              <img
                src={`${BACKEND_BASE
                  }/files/load-file-by-path?path=${image}`}
                width={920}
                height={700}
                className="w-full max-h-[700px] object-cover"
                alt={`img-${index}`}
                loading="lazy"
              />
            </SwiperSlide>
          ))}
        </Swiper>

        {/* Thumbnail Swiper - positioned overlay */}
        <div className={scss.thumbsWrapper}>
          {/* Mobile Thumbnails with Pagination */}
          {isMobile ? (
            <Swiper
              modules={[Thumbs]}
              spaceBetween={6}
              slidesPerView={thumbsPerPage}
              watchSlidesProgress={true}
              // onSwiper={setThumbsSwiper}
              className={scss.thumbsSwiper}

            >
              {/* Current page of thumbnails */}
              {getCurrentThumbnails().map((image, index) => (
                <SwiperSlide key={`thumb-mobile-${currentPage}-${index}`} className={scss.thumbSlide}>
                  <img
                    src={`${BACKEND_BASE
                      }/files/load-file-by-path?path=${image}`}
                    width={920}
                    height={700}
                    className="w-full h-full object-cover"
                    alt={`thumbnail-${currentPage * thumbsPerPage + index + 1}`}
                  />
                </SwiperSlide>
              ))}

              {/* "Next" button if there are more thumbnails */}
              {remainingThumbs > 0 && (
                <SwiperSlide className={`${scss.thumbSlide} ${scss.remainingThumb}`}>
                  <div
                    onClick={handleNextPage}
                    className="w-full h-full flex items-center justify-center bg-black bg-opacity-70 text-white font-bold text-lg cursor-pointer"
                  >
                    +{remainingThumbs}
                  </div>
                </SwiperSlide>
              )}
            </Swiper>
          ) : (
            /* Desktop Thumbnails (all visible) */
            <Swiper
              modules={[Thumbs]}
              // spaceBetween={20}
              slidesPerView={10}
              watchSlidesProgress={true}
              // onSwiper={setThumbsSwiper}
              className={scss.thumbsSwiper}
            >
              {sliderImages.map((image, index) => (
                <SwiperSlide key={`thumb-desktop-${index}`} className={scss.thumbSlide}>
                  <img
                    src={`${BACKEND_BASE
                      }/files/load-file-by-path?path=${image}`}
                    width={920}
                    height={700}
                    className="w-full h-full object-cover"
                    alt={`thumbnail-${index + 1}`}
                    loading="lazy"
                  />
                </SwiperSlide>
              ))}
            </Swiper>
          )}

          {/* Mobile pagination indicator */}
          {isMobile && totalPages > 1 && (
            <div className={scss.paginationIndicator}>
              {Array.from({ length: totalPages }).map((_, index) => (
                <span
                  key={`page-${index}`}
                  className={`${scss.pageIndicator} ${currentPage === index ? scss.activePage : ''}`}
                  onClick={() => setCurrentPage(index)}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div >
  );
}