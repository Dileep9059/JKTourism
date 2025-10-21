
import { zodResolver } from "@hookform/resolvers/zod";

import { useForm, Controller } from "react-hook-form";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { CalendarIcon, Check, Info } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { toast } from "sonner";
import type { EventFormValues } from "@/components/utils/types";
import { eventSchema } from "@/components/schemas/eventSchema";
import { axiosPrivate } from "@/axios/axios";
import { d, e } from "@/components/utils/crypto";

export default function AddEvent() {
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);


    type FormValues = EventFormValues & { dateRange: { from: Date; to: Date } };

    const {
        register,
        handleSubmit,
        control,
        setValue,
        reset,
        formState: { errors },
    } = useForm<FormValues>({
        resolver: zodResolver(eventSchema),
        defaultValues: {
            dateRange: {
                from: undefined,
                to: undefined,
            },
        },
    });

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setValue("image", file);
            setImagePreview(URL.createObjectURL(file));
        } else {
            setValue("image", null as unknown as File);
            setImagePreview(null);
        }
    };

    const onSubmit = async (data: FormValues) => {
        setLoading(true);
        try {
            const { dateRange, image, ...rest } = data;

            const transformedData = {
                ...rest,
                startDate: dateRange?.from,
                endDate: dateRange?.to,
            };

            const formData = new FormData();

            formData.append("file", image);
            formData.append("data", await e(JSON.stringify(transformedData)));

            const response = await axiosPrivate.post("/api/admin/add-event", formData);

            if (response?.status === 200) {
                const resData = JSON.parse(await d(response.data));
                toast("Success", {
                    description: resData || "Event created successfully!",
                    icon: <Check className="h-4 w-4 text-green-500" />,
                })
                setLoading(false);
                reset();
                setImagePreview(null);
            }

        } catch (error) {
            setLoading(false);
            console.log(error)
            toast("Error submitting form.", {
                description: "Please check your input and try again.",
                icon: <Info className="h-4 w-4 text-red-500" />,
            });
        }
    };

    return (
        <div className="p-8">
            <h1 className="text-2xl font-bold mb-4 text-[#2b5f60]">Create Event</h1>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 max-w-xl mx-auto">
                <div>
                    <input {...register("title")} placeholder="Title" className="w-full p-2 border rounded" />
                    {errors.title && <p className="text-red-500 text-sm">{errors.title.message}</p>}
                </div>

                <div>
                    <textarea {...register("description")} placeholder="Description" className="w-full p-2 border rounded" />
                    {errors.description && <p className="text-red-500 text-sm">{errors.description.message}</p>}
                </div>

                <div>
                    <label className="block mb-1 text-sm font-medium text-gray-700">Upload Image</label>
                    <input type="file" accept="image/*" onChange={handleImageChange} className="block w-full" />
                    {errors.image && <p className="text-red-500 text-sm">{errors.image.message}</p>}

                    {imagePreview && (
                        <img src={imagePreview} alt="Preview" className="mt-2 h-32 object-cover rounded" />
                    )}
                </div>
                <div>
                    <select {...register("district")} className="w-full p-2 border rounded" defaultValue={"Jammu"}>
                        <option value="Jammu">Jammu</option>
                        <option value="Kashmir">Kashmir</option>
                    </select>
                    {errors.district && <p className="text-red-500">{errors.district.message}</p>}

                </div>
                <input {...register("ticketPrice")} type="number" placeholder="Ticket Price" className="w-full p-2 border rounded" />
                <input {...register("latitude")} type="number" placeholder="Latitude" className="w-full p-2 border rounded" />
                <input {...register("longitude")} type="number" placeholder="Longitude" className="w-full p-2 border rounded" />

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Event Date Range</label>
                    <Controller
                        name="dateRange"
                        control={control}
                        render={({ field }) => (
                            <Popover>
                                <PopoverTrigger asChild>
                                    <Button
                                        variant="outline"
                                        className={cn(
                                            "w-full justify-start text-left font-normal",
                                            !field.value?.from && "text-muted-foreground"
                                        )}
                                    >
                                        <CalendarIcon className="mr-2 h-4 w-4" />
                                        {field.value?.from ? (
                                            field.value.to ? (
                                                <>
                                                    {format(field.value.from, "LLL dd, y")} – {format(field.value.to, "LLL dd, y")}
                                                </>
                                            ) : (
                                                format(field.value.from, "LLL dd, y")
                                            )
                                        ) : (
                                            <span>Pick a date range</span>
                                        )}
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto p-0">
                                    <Calendar
                                        mode="range"
                                        selected={field.value}
                                        onSelect={(range) => field.onChange(range)}
                                        numberOfMonths={2}
                                        disabled={{ before: new Date() }}
                                    />
                                </PopoverContent>
                            </Popover>
                        )}
                    />
                    {errors.dateRange?.from && (
                        <p className="text-red-500 text-sm">{errors.dateRange.from.message}</p>
                    )}
                    {errors.dateRange?.to && (
                        <p className="text-red-500 text-sm">{errors.dateRange.to.message}</p>
                    )}
                </div>
                <div>
                    <label>Start Time</label>
                    <input type="time" {...register("startTime")} className="w-full p-2 border rounded" />
                    {errors.startTime && <p className="text-red-500">{errors.startTime.message}</p>}
                </div>

                <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded" disabled={loading}>
                    {loading ? "Submitting..." : "Create Event"}
                </button>
            </form>
        </div>
    );
}