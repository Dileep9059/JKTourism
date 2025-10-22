"use client";
import { useEffect, useState } from "react";
import scss from "./album.module.scss";
import { Swiper, SwiperSlide } from "swiper/react";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import "swiper/swiper.css";
import { FreeMode, Navigation, Thumbs } from "swiper/modules";

import type { Swiper as SwiperType } from "swiper";
import clsx from "clsx";
import { toast } from "sonner";
import { FileText, Info } from "lucide-react";
import axiosInstance from "@/axios/axios";
import { d, e } from "../utils/crypto";

type BrochureData = {
  title: string;
  url: string;
};
type AlbumData = {
  images: string[];
  videos: string[];
  brochures: BrochureData[];
};

function Gallery() {
  const [thumbsSwiper, setThumbsSwiper] = useState<SwiperType | null>(null);
  const [destinations, setDestinations] = useState([]);
  const [selectedDestination, setSelectedDestination] = useState("");

  const [files, setFiles] = useState<AlbumData>({} as AlbumData);

  const handleDestinationChange = (value: string) => {
    setSelectedDestination(() => value);
  };

  async function getAlbums() {
    try {
      setFiles({ images: [], videos: [], brochures: [] });

      const params = {
        urlValue: selectedDestination,
      };
      const response = await axiosInstance.post(
        "/api/destination/get-album-by-destination",
        await e(JSON.stringify(params))
      );
      const data = JSON.parse(await d(response.data));
      setFiles(data);
    } catch (error) {
      toast.error("Something went wrong");
    }
  }

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
  };

  useEffect(() => {
    async function fetchDestinations() {
      try {
        const response = await axiosInstance.get(
          "/api/destination/get-destinations-groupby-category"
        );
        const data = JSON.parse(await d(response.data));
        setDestinations(data);
      } catch {
        toast("Error fetching destinations", {
          description: "Please try again later.",
          icon: <Info className="text-red-500 w-4 h-4" />,
        });
      }
    }
    fetchDestinations();
  }, []);

  useEffect(() => {
    if (selectedDestination) {
      getAlbums();
    }
  }, [selectedDestination]);

  return (
    <>
      <div className={scss.common_page}>
        <div className="banner">
          <img
            src={`${import.meta.env.VITE_BASE}assets/images/gallery.png`}
            alt="Banner"
            className={clsx(
              scss.banner_image,
              "w-full max-h-[700px] object-cover"
            )}
          />
        </div>
        <div className="container max-w-auto mx-auto">
          <div className={scss.destination_title}>
            <h2 className={clsx(scss.cattitle, "mt-5")}>Gallery</h2>
          </div>

          <div className="mb-5">
            <Swiper {...thumbsSwiperOptions} className="mb-3">
              {/* <div className="grid grid-cols-12"></div> */}
              <SwiperSlide>
                <div className={scss.album_block}>
                  <div className={scss.album_icon}>
                    <img
                      src={`${import.meta.env.VITE_BASE}assets/images/icons/photo-icon.svg`}
                      alt="video icon"
                    />
                  </div>
                  <h6>Photos</h6>
                </div>
              </SwiperSlide>
              <SwiperSlide>
                <div className={scss.album_block}>
                  <div className={scss.album_icon}>
                    <img
                      src={`${import.meta.env.VITE_BASE}assets/images/icons/video-icon.svg`}
                      alt="video icon"
                    />
                  </div>
                  <h6>Videos</h6>
                </div>
              </SwiperSlide>
              <SwiperSlide>
                <div className={scss.album_block}>
                  <div className={scss.album_icon}>
                    <img
                      src={`${import.meta.env.VITE_BASE}assets/images/icons/brochures-icon.svg`}
                      alt="video icon"
                    />
                  </div>
                  <h6>E-Brochures</h6>
                </div>
              </SwiperSlide>
            </Swiper>
            <div className={scss.album_filter_search}>
              <label>Select Destination :</label>
              <Select onValueChange={handleDestinationChange}>
                <SelectTrigger className="w-[280px]">
                  <SelectValue placeholder="Select a destination" />
                </SelectTrigger>
                <SelectContent>
                  {destinations.map((destination: any) => (
                    <SelectGroup key={destination.category}>
                      <SelectLabel>{destination.category}</SelectLabel>
                      {destination.destinations.map((destination: any) => (
                        <SelectItem value={destination[1]} key={destination[1]}>
                          {destination[0]}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Swiper {...mainSwiperOptions} className={scss.album_slider_main}>
              <SwiperSlide>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {files?.images &&
                    files?.images.map((image: string, index: number) => (
                      <div key={`images${selectedDestination}${index}`}>
                        <div className={clsx(scss.album_img, "w-full")}>
                          <img
                            src={`${import.meta.env.VITE_APP_API_BASE_URL}/files/load-file-by-path?path=${image}`}
                            alt="Preview"
                            width={1000}
                            height={1000}
                            className="object-cover w-full h-auto"
                          />
                        </div>
                      </div>
                    ))}
                </div>
              </SwiperSlide>
              <SwiperSlide className="pt-3">
                <div>
                  <div className={scss.album_slider}>
                    {files?.videos &&
                      files?.videos.map((video: string, index: number) => (
                        <div
                          className={scss.w_half}
                          key={`videos${selectedDestination}${index}`}
                        >
                          <div className={scss.img_block}>
                            <video
                              controls
                              className="w-full h-auto"
                              controlsList="nodownload"
                              style={{ pointerEvents: "auto" }}
                            >
                              <source
                                src={`${process.env.NEXT_PUBLIC_API_URL}/files/load-file-by-path?path=${video}`}
                                type="video/mp4"
                              />
                              Your browser does not support the video tag.
                            </video>
                          </div>
                        </div>
                      ))}
                    {files?.videos?.length === 0 && (
                      <span>No videos found.</span>
                    )}
                  </div>
                </div>
              </SwiperSlide>
              <SwiperSlide>
                <div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {files?.brochures?.map(
                      (pdf: BrochureData, index: number) => (
                        <div
                          key={`brochures${selectedDestination}${index}`}
                          className="bg-white border border-gray-200 rounded-xl shadow-sm p-4 hover:shadow-md transition-shadow flex flex-col justify-between"
                        >
                          <div className="flex items-center gap-4 mb-4">
                            <div className="p-3 rounded-full bg-blue-100 text-blue-600">
                              <FileText className="h-6 w-6" />
                            </div>
                            <h3 className="text-base font-semibold text-gray-800 line-clamp-2">
                              {pdf.title || "Untitled PDF"}
                            </h3>
                          </div>

                          <div className="mt-auto">
                            <a
                              href={`${process.env.NEXT_PUBLIC_API_URL}/files/load-file-by-path?path=${pdf.url}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 transition"
                            >
                              View PDF
                            </a>
                          </div>
                        </div>
                      )
                    )}
                    {files?.brochures?.length === 0 && (
                      <span>No Brochures found.</span>
                    )}
                  </div>
                </div>
              </SwiperSlide>
            </Swiper>
          </div>
        </div>
      </div>
    </>
  );
}

export default Gallery;
