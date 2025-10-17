

import { Info } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import type { DestinationData, SliderImagedData } from "../utils/types";
import axiosInstance from "@/axios/axios";
import { d } from "../utils/crypto";
import Categorydetail from "../categories/Categorydetail";

const Activities = () => {
  const [sliderImages, setSliderImages] = useState<SliderImagedData[]>([]);
  const [activities, setActivities] = useState<DestinationData[]>([]);

  useEffect(() => {
    async function fetchSliderImages() {
      try {
        const resp = await axiosInstance.get("/api/activities/slider-images");
        if (resp?.status === 200){
          const data = JSON.parse(await d(resp.data))
          setSliderImages(data)
        }
      } catch {
        toast("Error!", {
          description: "Unable to get images.",
          icon: <Info className="text-red-500" />,
        });
      }
    }
    fetchSliderImages();
  }, []);

  useEffect(() => {
    async function fetchActivities() {
      try {
        const resp = await axiosInstance.get("/api/activities/activities");
        if (resp?.status === 200){
          const data = JSON.parse(await d(resp.data))
          setActivities(data?.destinations)
        }
      } catch {
        toast("Error!", {
          description: "Unable to get activities.",
          icon: <Info className="text-red-500" />,
        });
      }
    }
    fetchActivities();
  }, [])
  return (
    <>
      <Categorydetail
        categoryName="Things to do"
        destinations={activities}
        coverImage={""}
        baseUrl={`/activities`}
        sliderImages={sliderImages}
      />
    </>
  );
};

export default Activities;
