"use client";

import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { useEffect, useState } from "react";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { Info, Star } from "lucide-react";
import { Button } from "../ui/button";

import { toast } from "sonner";

import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import scss from './feedback.module.scss';

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import clsx from "clsx";
import { e, d } from "../utils/crypto";
import axiosInstance from "@/axios/axios";

interface FeedbackModalProps {
  open: boolean;
  onClose: () => void;
}

const feedbackSchema = z.object({
  name: z
    .string()
    .nonempty("Name is required")
    .regex(/^[A-Za-z\s]+$/, "Name must contain only alphabets"),
  email: z.string().email("Invalid email"),
  content: z
    .string()
    .nonempty("Feedback is required")
    .refine((val) => val.trim().split(/\s+/).length <= 50, {
      message: "Feedback must be 50 words or less",
    }),
  location: z.string().nonempty("Location is required"),
  rating: z.number().min(1, "Please give a rating"),
  photo: z
    .any()
    .refine((file) => file instanceof File, "Photo is required")
    .refine((file) => file?.size <= 5 * 1024 * 1024, "File size must be ≤ 5MB")
    .refine(
      (file) => ["image/jpeg", "image/png"].includes(file?.type),
      "Only JPG or PNG files are allowed"
    ),
});

export default function FeedbackModal({ open, onClose }: FeedbackModalProps) {
  const [locations, setLocations] = useState([]);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
    watch,
    reset,
  } = useForm({
    resolver: zodResolver(feedbackSchema),
  });

  const rating = watch("rating");

  useEffect(() => {
    async function fetchDestinations() {
      try {
        const response = await axiosInstance.get(
          "/api/destination/get-destinations-groupby-category"
        );
        const data = JSON.parse(await d(response.data));
        setLocations(data);
      } catch {
        toast("Error fetching destinations", {
          description: "Please try again later.",
          icon: <Info className="text-red-500 w-4 h-4" />,
        });
      }
    }
    fetchDestinations();
  }, []);

  const handleFormSubmit = async (data: any) => {
    const formData = new FormData();

    // extract the file from the data object and a objec with the rest of the data
    const { photo, ...rest } = data;

    formData.append("file", photo);
    formData.append("data", await e(JSON.stringify(rest)));

    try {
      const res = await axiosInstance.post("/api/feedback/submit-feedback", formData);
      if (res.status === 200) {
        toast("Feedback submitted successfully", {
          description: "Thank you for your feedback!",
          icon: <Star className="text-green-500 w-4 h-4" />,
        });
        reset();
        onClose();
      }
    } catch {
      toast("Error submitting feedback", {
        description: "Please try again later.",
        icon: <Info className="text-red-500 w-4 h-4" />,
      });
    }
  };
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogTitle className="flex flex-col space-y-1"></DialogTitle>
      <DialogContent className="max-w-full  z-50 px-0 overflow-hidden">
        <div className={clsx(scss.feedback_wrapper,"position-relative")} style={{maxHeight: "450px", overflowY: 'scroll'}}>
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-[#240b36] to-[#c31432]  opacity-90 z-[-1]" />
          <div className="px-4 py-8 sm:px-8 flex flex-col ">
            <h2 className="text-white text-2xl font-bold text-center mb-8">
              Feedback
            </h2>
            <form className="space-y-6" onSubmit={handleSubmit(handleFormSubmit)}>
              <div>
                <Label className="text-white">Name</Label>
                <Input type="text" required {...register("name")} />
                {errors.name && (
                  <p className="text-red-500">{errors.name.message}</p>
                )}
              </div>

              <div>
                <Label className="text-white">Email</Label>
                <Input type="email" {...register("email")} required />
                {errors.email && (
                  <p className="text-red-500">{errors.email.message}</p>
                )}
              </div>

              <div>
                <Label className="text-white">Upload Photo</Label>
                <Input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    setValue("photo", file);
                  }}
                />
                {errors.photo && (
                  <p className="text-red-500">{String(errors.photo.message)}</p>
                )}
              </div>

              <div>
                <Label className="text-white">Your Feedback</Label>
                <Textarea {...register("content")} required />
                {errors.content && (
                  <p className="text-red-500">{errors.content.message}</p>
                )}
              </div>

              <div>
                <Label className="text-white">Select Location</Label>
                <Select onValueChange={(val) => setValue("location", val)}>
                  <SelectTrigger className="w-full p-2 rounded-md border">
                    <SelectValue placeholder="Select a destination" />
                  </SelectTrigger>
                  <SelectContent>
                    {locations.map((destination: any) => (
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
                {errors.location && (
                  <p className="text-red-500">{errors.location.message}</p>
                )}
              </div>

              <div>
                <Label className="text-white">Rate Destination</Label>
                <div className="flex space-x-1 mt-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className={`h-6 w-6 cursor-pointer ${
                        rating >= star ? "text-yellow-400" : "text-gray-300"
                      }`}
                      onClick={() => setValue("rating", star)}
                      fill={rating >= star ? "#facc15" : "none"}
                    />
                  ))}
                </div>
                {errors.rating && (
                  <p className="text-red-500">{errors.rating.message}</p>
                )}
              </div>

              <div className="flex justify-center pt-4">
                <Button
                  type="submit"
                  className="bg-white text-black hover:bg-gray-200"
                >
                  Submit Feedback
                </Button>
              </div>
            </form>
          </div>
        </div>
        
        
      </DialogContent>
    </Dialog>
  );
}