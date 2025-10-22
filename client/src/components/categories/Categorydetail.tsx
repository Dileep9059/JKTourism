
import clsx from "clsx";
import scss from "./categorydetail.module.scss";
import type { DestinationData, SliderImagedData } from "../utils/types";
import CommonSlider from "../slider/CommonSlider";
import { Link } from "react-router-dom";



function Categorydetail({
    categoryName,
    destinations,
    coverImage,
    baseUrl,
    sliderImages,
}: {
    categoryName: string;
    destinations: DestinationData[];
    coverImage: string;
    baseUrl: string;
    sliderImages: SliderImagedData[];
}) {

    return (
        <>
            <CommonSlider sliderImages={sliderImages} />

            <div
                className={clsx(scss.categorydetail_div, "container mx-auto m-5 pb-14")}
            >
                {/* {!coverImage && <ImageSkeleton />} */}

                <div className={scss.destination_title}>
                    <h2 className={clsx(scss.cattitle, "mt-1")}>
                        {categoryName.charAt(0).toUpperCase() + categoryName.slice(1)} in
                        J&amp;K
                    </h2>
                </div>

                <div className={clsx(scss.category_data, "mb-5")}>
                    {destinations.map((item, idx) => (
                        <div key={idx} className={scss.category_div}>
                            <Link to={`${baseUrl}/${item.destination_url}`}>
                                <img
                                    src={`${import.meta.env.VITE_APP_API_BASE_URL}/files/load-file-by-path?path=${item.gallery_image}`}
                                    width={900}
                                    height={500}
                                    alt={item.gallery_title}
                                    className={clsx(scss.banner_image, "w-full max-h-[700px]")}
                                    loading="lazy"
                                />
                                <div
                                    className={clsx(scss.wrap_span, "absolute bottom-0 p-3 z-10")}
                                >
                                    <span>{item.destination_title}</span>
                                    <p className="text-white/70 mb-2">
                                        {item.destination_description}
                                    </p>
                                </div>
                            </Link>
                        </div>
                    ))}
                </div>
            </div>
        </>
    );
}

export default Categorydetail;
