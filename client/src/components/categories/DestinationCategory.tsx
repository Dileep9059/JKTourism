import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import type { DestinationData, SliderImagedData } from '../utils/types';
import axiosInstance from '@/axios/axios';
import { d, e } from '../utils/crypto';
import { toast } from 'sonner';
import { CircleAlert, Info } from 'lucide-react';
import Categorydetail from './Categorydetail';
import Missing from '../Missing';

const DestinationCategory = () => {

    const { categoryName } = useParams();

    const [destinations, setdestinations] = useState<DestinationData[]>([]);
    const [coverImage, setcoverImage] = useState("");
    const [sliderImages, setSliderImages] = useState<SliderImagedData[]>([]);

    async function fetchCategories() {
        const params = {
            categoryName: categoryName,
        };

        try {
            const response = await axiosInstance.post(
                `/api/destination/getDestinationByCategory`,
                await e(JSON.stringify(params))
            );

            if (response?.status === 200) {
                const res = JSON.parse(await d(response?.data));

                setdestinations(res?.destinations);
                setcoverImage(res?.coverImage);
            }
        } catch {
            toast("Error", {
                description: "Unable to fetch categories.",
                icon: <Info className="text-red-600 w-4 h-4" />,
            });
        }
    }

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

    useEffect(() => {
        fetchCategories();
    }, []);

    useEffect(() => {
        fetchSliderImages();
    }, []);

    if (!categoryName) return <Missing />
    return (
        <>
            <Categorydetail
                categoryName={categoryName}
                destinations={destinations}
                coverImage={coverImage}
                baseUrl={`/category/${categoryName}`}
                sliderImages={sliderImages}
            />
        </>
    )
}

export default DestinationCategory