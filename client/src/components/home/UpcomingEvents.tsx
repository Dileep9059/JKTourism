import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination } from 'swiper/modules';
import "swiper/swiper-bundle.css";
// import { FestiveSeasons } from '@/components/festivals/FestiveSeasons';
import { CalendarDays } from 'lucide-react';
import scss from './landingpage.module.scss'
import clsx from 'clsx';

export default function UpcomingEvents() {
    return (
        <section className="relative bg-black py-6 md:py-12 lg:py-1">
            <div className={clsx(scss.festive_season, "lg:max-w-full mx-auto px-4 sm:px-6 lg:px-8 xl:px-10 text-center lg:pb-20 position-relative")}>
                <div className="mt-2 sm:mt-6 md:mt-8">
                    {/* <FestiveSeasons /> */}
                </div>

                <div className="mt-10 sm:mt-12 md:mt-16 lg:mt-20 px-2 sm:px-0">
                    <Swiper
                        modules={[Autoplay, Pagination]}
                        spaceBetween={16}
                        slidesPerView={1}
                        loop
                        autoplay={{
                            delay: 3500,
                            disableOnInteraction: false,
                            pauseOnMouseEnter: true
                        }}
                        pagination={{
                            clickable: true,
                            dynamicBullets: true,
                        }}
                        breakpoints={{
                            // Mobile (default): 1 slide
                            640: {
                                slidesPerView: 1.2,
                                spaceBetween: 20
                            },
                            // Tablet: 2 slides
                            768: {
                                slidesPerView: 2,
                                spaceBetween: 24
                            },
                            // Small desktop: 2.5 slides
                            900: {
                                slidesPerView: 2.5,
                                spaceBetween: 24
                            },
                            // Desktop: 3 slides
                            1024: {
                                slidesPerView: 3,
                                spaceBetween: 28
                            },
                            1280: {
                                slidesPerView: 3,
                                spaceBetween: 32
                            }
                        }}
                        className="!pb-12" // Add padding for pagination
                    >
                        {experiences.map((exp, idx) => (
                            <SwiperSlide key={idx}>
                                <div className="flex flex-col items-center group h-full px-1 sm:px-2">
                                    <div className="relative w-full h-[280px] xs:h-[320px] sm:h-[360px] md:h-[400px] lg:h-[450px] xl:h-[500px] rounded-2xl md:rounded-3xl overflow-hidden border-2 border-white hover:border-orange-400 transition-all duration-300 shadow-lg hover:shadow-xl hover:shadow-amber-400/20">
                                        <img
                                            src={exp.image}
                                            alt={exp.title}

                                            className="object-cover absolute inset-0 w-full h-full transition-transform duration-500 group-hover:scale-105"
                                            sizes="(max-width: 640px) 90vw, (max-width: 768px) 45vw, (max-width: 1024px) 30vw, 400px"
                                        />
                                        <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-red-500 to-orange-400 p-2 w-4/5 sm:w-3/5 md:w-1/2 rounded-t-2xl text-center">
                                            <div className="flex flex-col items-center justify-center">
                                                <h3 className="text-lg sm:text-lg md:text-xl font-bold text-white">{exp.title}</h3>
                                                <p className="flex items-center gap-2 text-sm sm:text-base text-white mt-1">
                                                    <CalendarDays className="w-4 h-4 sm:w-5 sm:h-5" />
                                                    <span>{exp.date}</span>
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </SwiperSlide>
                        ))}
                    </Swiper>
                </div>
                <img src="/images/flower_img.png"
                    alt="flower-image"
                    className={scss.flower_img}
                />
            </div>
        </section>
    );
}


const experiences = [
    {
        title: "House Boat Festival",
        date: "March 15th to April 20th, 2025",
        image: "/images/JKTimg12.jpg",
    },
    {
        title: "Baisakhi Festival",
        date: "July 8th to July 9th, 2025",
        image: "/images/JKTimg11.jpg",
    },
    {
        title: "Holi",
        date: "Yet to announced",
        image: "/images/JKTimg10.png",
    },
    {
        title: "House Boat Festival",
        date: "March 15th to April 20th, 2025",
        image: "/images/JKTimg12.jpg",
    },
    {
        title: "Baisakhi Festival",
        date: "July 8th to July 9th, 2025",
        image: "/images/JKTimg11.jpg",
    },
    {
        title: "Holi",
        date: "Yet to announced",
        image: "/images/JKTimg10.png",
    },
];