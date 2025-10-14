export interface User {
  name: string;
  email: string;
  bio: string;
  profilePicture: string;
}

export interface ChangePasswordModalProps {
  onClose: () => void;
  onSubmit: (currentPassword: string, newPassword: string, confirmPassword: string) => void;
}


import { z } from "zod";
import type { eventSchema } from "../schemas/eventSchema";

export type CategoryData = {
  name: string;
  cover_image: string;
  url_value: string;
}

export type DestinationData = {
  destination_description: string;
  destination_title: string;
  destination_url: string;
  gallery_image: string;
  gallery_title: string;
}

export type CommonInfo = {
  title: string;
  description: string;
  content: string;
}

export type ActivityType = {
  name: string;
  description: string;
}

export type DestinationInfo = {
  destination: CommonInfo;
  accomodation: CommonInfo[] | [];
  activities: ActivityType[] | [];
  attraction: CommonInfo[] | [];
  cuisine: CommonInfo[] | [];
  travel: CommonInfo[] | [];
  travelTips: CommonInfo[] | [];
  whichTime: CommonInfo[] | [];
  whyVisit: CommonInfo[] | [];
  images: string[];
  reviews: Review[] | [];
}

export type SliderImagedData = {
  title: string;
  image: string;
}

export type EventFormValues = z.infer<typeof eventSchema>;

export type EperienceData = {
  name: string;
  cover_image: string;
  url_value: string;
};

export type Review = {
  name: string;
  rating: number;
  content: string;
  image: string;
}