import axiosInstance from '@/axios/axios';
import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom';
import type { DestinationInfo } from '../utils/types';
import { toast } from 'sonner';
import { Info } from 'lucide-react';
import { d, e } from '../utils/crypto';
import Slider from '../slider/Slider';
import DocumentTitle from '../DocumentTitle';
import Missing from '../Missing';
import Detailtab from './Detailtab';

const DestinationDetails = () => {
    const { categoryName, placeName } = useParams();
    const [destinationdata, setdestinationdata] = useState<DestinationInfo>(
        {} as DestinationInfo
    );
    const [images, setImages] = useState<string[]>([]);

    useEffect(() => {
        async function getdata() {
            const params = {
                placeName: placeName,
            };
            try {
                const response = await axiosInstance.post(
                    `/api/destination/getDetailsByDestination`,
                    await e(JSON.stringify(params))
                );

                if (response?.status === 200) {
                    const res = JSON.parse(await d(response?.data));
                    // console.log(res)
                    setdestinationdata(res);
                    setImages(res?.images);
                }
            } catch {
                toast("Error", {
                    description: "Unable to fetch categories.",
                    icon: <Info className="text-red-600 w-4 h-4" />,
                });
            }
        }
        getdata();
    }, []);
    if (!placeName) return <Missing />
    return (
        <>
            <DocumentTitle title={`${placeName} | ${categoryName}`} />
            <Slider sliderImages={images} />
            <Detailtab placeName={placeName} destinationdata={destinationdata} />
        </>
    )
}

export default DestinationDetails