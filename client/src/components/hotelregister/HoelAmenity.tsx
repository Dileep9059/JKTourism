import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { amenitySchema, type AmenityFormValues } from "../schemas/amenity-schema";
import scss from './hotelregister.module.scss';
import { useEffect, useState } from "react";
import { axiosPrivate } from "@/axios/axios";
import { d, e } from "../utils/crypto";
import { Checkbox } from "../ui/checkbox";
import { toast } from "sonner";

const HoelAmenity = ({ handleNext, handlePrev, hotelId }: { handleNext: () => void, handlePrev: () => void, hotelId: string }) => {
    const [amenitiesFromDB, setAmenitiesFromDB] = useState<any[]>([]);
    const {
        control,
        handleSubmit,
        watch,
        setValue,
        formState: { errors },
    } = useForm<AmenityFormValues>({
        resolver: zodResolver(amenitySchema),
        defaultValues: {
            amenities: [],
        },
    });

    const selectedAmenities = watch("amenities");

    const fetchAmenities = async () => {
        const payload = {
            scope: "PROPERTY"
        }
        const response = await axiosPrivate.post("/api/hotels/amenities", await e(payload));
        const data = JSON.parse(await d(response.data));
        setAmenitiesFromDB(data);
    };

    const onSubmit = async (data: AmenityFormValues) => {
        try {
            const payload = {
                amenities: data.amenities
            }
            const response = await axiosPrivate.post(`/api/hotels/${hotelId}/amenities`, await e(payload));
            const res = JSON.parse(await d(response.data));
            toast.success(res.message);
            handleNext();
        } catch (error: any) {
            toast.error(JSON.parse(await d(error.response.data)))
        }
    };


    useEffect(() => {
        fetchAmenities();
    }, []);

    return (
        <>
            <form onSubmit={handleSubmit(onSubmit)}>
                <div className={scss.form_details}>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                        {amenitiesFromDB.map((amenity) => (
                            <div key={amenity.id} className={scss.form_block}>
                                <div className={scss.inputblock_wrapper}>
                                    <div className={scss.input_block}>
                                        <Checkbox
                                            id={`amenity-${amenity.id}`}
                                            checked={selectedAmenities.includes(amenity.name)}
                                            onCheckedChange={(checked) => {
                                                const updated = checked
                                                    ? [...selectedAmenities, amenity.name]
                                                    : selectedAmenities.filter(
                                                        (a) => a !== amenity.name
                                                    );

                                                setValue("amenities", updated, {
                                                    shouldValidate: true,
                                                });
                                            }}
                                        />
                                        <label htmlFor={`amenity-${amenity.id}`}>
                                            {amenity.name}
                                        </label>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                    {errors.amenities && (
                        <p className="text-red-500 text-xs mt-2">
                            {errors.amenities.message}
                        </p>
                    )}
                </div>

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

export default HoelAmenity