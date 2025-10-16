import axiosInstance from "@/axios/axios";
import { CircleAlert, Info } from "lucide-react";
import { toast } from "sonner";
import { d } from "../utils/crypto";
import { useEffect, useState } from "react";
import type { CategoryData, SliderImagedData } from "../utils/types";
import ImageSkeleton from "../skeleton/ImageSkeleton";
import { cn } from "@/lib/utils";

import scss from "./category.module.scss";
import CommonSlider from "../slider/CommonSlider";

const DestinationCategories = () => {

    const [categories, setCategories] = useState<CategoryData[]>([]);
    const [sliderImages, setSliderImages] = useState<SliderImagedData[]>([]);

    const baseUrl = "most-visited-destinations";
    const title = "Most Visited Destination";

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

    async function fetchCategories() {
        try {
            const response = await axiosInstance.post(`/api/category/getAllCategories`);

            if (response?.status === 200) {
                const res = JSON.parse(await d(response?.data));
                setCategories(res);
            }
        } catch {
            toast("Error", {
                description: "Unable to fetch categories.",
                icon: <Info className="text-red-600 w-4 h-4" />,
            });
        }
    }

    useEffect(() => {
        fetchCategories();
        fetchSliderImages();
    }, []);

    return (
        <>
            <CommonSlider sliderImages={sliderImages} />

            <div className={cn(scss.category_parent_div, "container pb-14")}>
                <div className={scss.destination_title}>
                    <h2 className={cn(scss.cattitle, "mt-2 mb-0")}>{title}</h2>
                </div>
                <div className={cn(scss.category_data, "mb-3 ")}>
                    {categories.map((category) => (
                        <div key={category.name} className={cn(scss.category_div, "")}>
                            <a href={`/${baseUrl}/${category.url_value}`}>
                                <img
                                    src={`${import.meta.env.VITE_APP_API_BASE_URL}/files/load-file-by-path?path=${category?.cover_image}`}
                                    alt={category.cover_image || "Cover Image"}
                                    className={cn(scss.category_image, "w-full object-cover")}
                                    width={500}
                                    height={250}
                                />
                            </a>
                            <span className="italic">{category.name}</span>
                        </div>
                    ))}
                </div>
                {categories.length === 0 && (
                    <>
                        <div className="grid sm:grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-3">
                            <ImageSkeleton />
                            <ImageSkeleton />
                            <ImageSkeleton />
                            <ImageSkeleton />
                        </div>
                    </>
                )}
            </div>
        </>
    )
}

export default DestinationCategories