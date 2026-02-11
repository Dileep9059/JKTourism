import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { PropertyDetailsFormValues } from "../schemas/property-detail-schema";
import { propertyDetailsSchema } from "../schemas/property-detail-schema";

import scss from './hotelregister.module.scss';

import { Input } from "../ui/input";
import { axiosPrivate } from "@/axios/axios";
import { toast } from "sonner";
import { d, e } from "../utils/crypto";
import { Button } from "../ui/button";
import { useEffect } from "react";

const PropertyDetails = ({ handleNext, handlePrev, hotelId }: { handleNext: () => void, handlePrev: () => void, hotelId: string }) => {

    const {
        register,
        control,
        handleSubmit, reset,
        formState: { errors },
    } = useForm<PropertyDetailsFormValues>({
        resolver: zodResolver(propertyDetailsSchema),
        defaultValues: {
            liftAvailable: false,
            powerBackup: false,
            wheelchairAccessible: false,
            roomTypes: [
                { roomType: "", roomCount: 1, tariff: 0 },
            ],
        },
    });
    const { fields, append, remove } = useFieldArray({
        control,
        name: "roomTypes",
    });

    const onSubmit = async (data: PropertyDetailsFormValues) => {
        try {
            await axiosPrivate.post(`/api/hotels/${hotelId}/property-details`, await e(data));
            toast.success("Property Details Added Successfully");
            handleNext();
        } catch (error: any) {
            toast.error(await d(error.response.data.message));
        }
    };

    useEffect(() => {
        const fetchPropertyDetails = async () => {
            try {
                const response = await axiosPrivate.get(`/api/hotels/${hotelId}/property-details`);
                const data = JSON.parse(await d(response.data));
                reset(data);
            } catch (error: any) {
                toast.error(JSON.parse(await d(error.response.data)));
            }
        };
        fetchPropertyDetails();
    }, [])

    return (
        <>
            <form onSubmit={handleSubmit(onSubmit)}>
                <div className={scss.form_details}>

                    {/* PROPERTY LEVEL DETAILS */}
                    <div className="grid grid-cols-2 gap-4 md:gap-6">

                        <div className={scss.form_block}>
                            <label>Check-in Time</label>
                            <Input type="time" {...register("checkInTime")} />
                            {errors.checkInTime && (
                                <p className="text-red-500 text-xs">
                                    {errors.checkInTime.message}
                                </p>
                            )}
                        </div>

                        <div className={scss.form_block}>
                            <label>Check-out Time</label>
                            <Input type="time" {...register("checkOutTime")} />
                            {errors.checkOutTime && (
                                <p className="text-red-500 text-xs">
                                    {errors.checkOutTime.message}
                                </p>
                            )}
                        </div>

                        <div className={scss.form_block}>
                            <label>Parking Capacity</label>
                            <Input
                                type="number"
                                {...register("parkingCapacity", { valueAsNumber: true })}
                            />
                            {errors.parkingCapacity && (
                                <p className="text-red-500 text-xs">
                                    {errors.parkingCapacity.message}
                                </p>
                            )}
                        </div>

                        {/* CHECKBOXES */}
                        <div className={scss.form_block}>
                            <label className="flex items-center gap-2">
                                <input type="checkbox" {...register("liftAvailable")} />
                                Lift Available
                            </label>
                        </div>

                        <div className={scss.form_block}>
                            <label className="flex items-center gap-2">
                                <input type="checkbox" {...register("powerBackup")} />
                                Power Backup
                            </label>
                        </div>

                        <div className={scss.form_block}>
                            <label className="flex items-center gap-2">
                                <input type="checkbox" {...register("wheelchairAccessible")} />
                                Wheelchair Accessible
                            </label>
                        </div>
                    </div>

                    {/* ROOM TYPES SECTION */}
                    <div className="mt-8 space-y-4">
                        <div className="flex items-center justify-between">
                            <h4 className="font-semibold text-sm">Room Types & Tariff</h4>
                            <Button
                                type="button"
                                onClick={() =>
                                    append({ roomType: "", roomCount: 1, tariff: 0 })
                                }
                                className="bg-white text-blue-600 text-sm hover:text-white"
                            >
                                + Add another room type
                            </Button>
                        </div>

                        {errors.roomTypes?.message && (
                            <p className="text-red-500 text-xs">
                                {errors.roomTypes.message}
                            </p>
                        )}

                        {fields.map((field, index) => (
                            <div
                                key={field.id}
                                className="grid grid-cols-4 gap-4 items-end border p-4 rounded-md"
                            >
                                {/* Room Type */}
                                <div>
                                    <label>Room Type</label>
                                    <select
                                        className="w-full border rounded px-2 py-2"
                                        {...register(`roomTypes.${index}.roomType`)}
                                    >
                                        <option value="">Select</option>
                                        {ROOM_TYPES.map((type) => (
                                            <option key={type} value={type}>
                                                {type}
                                            </option>
                                        ))}
                                    </select>
                                    {errors.roomTypes?.[index]?.roomType && (
                                        <p className="text-red-500 text-xs">
                                            {errors.roomTypes[index]?.roomType?.message}
                                        </p>
                                    )}
                                </div>

                                {/* Number of Rooms */}
                                <div>
                                    <label>No. of Rooms</label>
                                    <Input
                                        type="number"
                                        {...register(`roomTypes.${index}.roomCount`, {
                                            valueAsNumber: true,
                                        })}
                                    />
                                </div>

                                {/* Tariff */}
                                <div>
                                    <label>Tariff (per night)</label>
                                    <Input
                                        type="number"
                                        {...register(`roomTypes.${index}.tariff`, {
                                            valueAsNumber: true,
                                        })}
                                    />
                                </div>

                                {/* Remove */}
                                <Button
                                    type="button"
                                    onClick={() => remove(index)}
                                    className="bg-red-500 text-white text-sm"
                                >
                                    Remove
                                </Button>
                            </div>
                        ))}
                    </div>
                </div>

                {/* NAVIGATION */}
                <div className={scss.btn_wrapper}>
                    <button
                        type="button"
                        onClick={handlePrev}
                        className={scss.prev_btn}
                    >
                        Prev
                    </button>
                    <button type="submit" className={scss.next_btn}>
                        Next
                    </button>
                </div>
            </form>

        </>
    )
}

export default PropertyDetails;

const ROOM_TYPES = [
  "Standard",
  "Deluxe",
  "Super Deluxe",
  "Suite",
  "Executive",
];
