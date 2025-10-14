"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { axiosPrivate } from "@/axios/axios";
import { d, e } from "../utils/crypto";
import { toast } from "sonner";

// Zod schema
const announcementSchema = z.object({
  audience: z.enum(["ALL",
    "PUBLIC",
    "USER",
    "DISTRICT",
    "TEHSIL",
    "VILLAGE"], {
    required_error: "Audience is required",
  }),
  validTill: z.string().min(1, "Valid till date is required"),
  description: z.string().min(1, "Description is required"),
  file: z
    .any()
    .optional()
    .refine(
      (file) => {
        if (!file) return true;
        return file instanceof File && file.size <= 10 * 1024 * 1024; // 10MB
      },
      { message: "File must be under 10MB" }
    ),
});

type AnnouncementFormValues = z.infer<typeof announcementSchema>;

export default function CreateAnnouncementDialog() {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    // watch,
    reset,
    formState: { errors },
  } = useForm<AnnouncementFormValues>({
    resolver: zodResolver(announcementSchema),
  });

  // const file = watch("file");

  const onSubmit = async (data: AnnouncementFormValues) => {
    const payload = {
      title: "New Announcement",
      message: data.description,
      recipientId: 123,
      audienceType: data.audience,
      notificationType: "ANNOUNCEMENT",
      category: "GENERAL",
      channel: "WEB",
      expiryAt: data.validTill,
      scheduledAt: data.validTill,
    };

    const formData = new FormData();
    formData.append("req", await e(JSON.stringify([payload])));
    if (data.file) {
      formData.append("file", data.file);
    }

    setLoading(true);

    try {
      const res = await axiosPrivate.post(`/api/v1/createNotification`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      const parsed = JSON.parse(await d(res.data));
      // console.log("NOTIFICATION", parsed);

      if (parsed.success) {
        toast.success(parsed.notificationStatus || "Notification created successfully!");
        setOpen(false);
        reset();
      } else {
        toast.error(parsed.notificationStatus || "Failed to create notification.", {
          description: parsed.error || "Unknown error occurred",
        });
      }
    } catch (error) {
      console.error("Upload failed", error);
      // Check if error is due to status code 429
      if (error.response && error.response.status === 429) {
        toast.error(error?.response.data);
      } else {
        toast.error("Upload failed", {
          description: "Something went wrong while uploading the file.",
        });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button onClick={() => setOpen(true)}>Create Announcement</Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Create Notification / Announcement</DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 py-2">
            {/* Audience */}
            <div className="space-y-1">
              <Label>To</Label>
              <Select onValueChange={(val) => setValue("audience", val)}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select audience" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ALL">All</SelectItem>
                  <SelectItem value="PUBLIC">Public</SelectItem>
                  <SelectItem value="DISTRICT">District</SelectItem>
                  <SelectItem value="TEHSIL">Tehsil</SelectItem>
                  <SelectItem value="VILLAGE">Village</SelectItem>
                </SelectContent>
              </Select>
              {errors.audience && (
                <p className="text-sm text-red-600">{errors.audience.message}</p>
              )}
            </div>

            {/* Valid Till */}
            <div className="space-y-1">
              <Label htmlFor="validTill">Announcement Valid Till</Label>
              <Input type="datetime-local" {...register("validTill")} />
              {errors.validTill && (
                <p className="text-sm text-red-600">{errors.validTill.message}</p>
              )}
            </div>

            {/* File Upload */}
            <div className="space-y-1">
              <Label htmlFor="file">Attach Document (optional)</Label>
              <Input
                type="file"
                accept=".pdf,.doc,.docx,.png,.jpg,.jpeg"
                onChange={(e) =>
                  setValue("file", e.target.files?.[0] || undefined)
                }
              />
              {errors.file?.message && (
                <p className="text-sm text-red-600">{String(errors.file.message)}</p>
              )}
            </div>

            {/* Announcement Text */}
            <div className="space-y-1">
              <Label htmlFor="announcement">Description</Label>
              <Textarea
                id="announcement"
                placeholder="Write your description here..."
                {...register("description")}
              />
              {errors.description && (
                <p className="text-sm text-red-600">
                  {errors.description.message}
                </p>
              )}
            </div>

            {/* Footer */}
            <DialogFooter className="mt-4">
              <Button type="submit" disabled={loading}>
                {loading ? "Submitting..." : "Create"}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
                disabled={loading}
              >
                Cancel
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
