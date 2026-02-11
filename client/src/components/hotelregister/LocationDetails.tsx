import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { locationDetailsSchema, type LocationDetailsFormValues } from "../schemas/location-details-schema";
import scss from './hotelregister.module.scss';
import { Input } from "../ui/input";
import { axiosPrivate } from "@/axios/axios";
import { toast } from "sonner";
import { d, e } from "../utils/crypto";
import { useEffect } from "react";


const LocationDetails = ({ handleNext, handlePrev, hotelId }: { handleNext: () => void, handlePrev: () => void, hotelId: string }) => {

    const {
        register,
        handleSubmit,
        formState: { errors }, reset,
    } = useForm<LocationDetailsFormValues>({
        resolver: zodResolver(locationDetailsSchema),
    });

    const onSubmit = async (data: LocationDetailsFormValues) => {
        try {
            await axiosPrivate.post(`/api/hotels/${hotelId}/location`, await e(data));
            toast.success("Location Information Added Successfully");
            handleNext();
        } catch (error: any) {
            toast.error(JSON.parse(await d(error.response.data)));
        }
    };

    useEffect(() => {
        const fetchLocationDetails = async () => {
            try {
                const response = await axiosPrivate.get(`/api/hotels/${hotelId}/location`);
                const data = JSON.parse(await d(response.data));
                reset(data);
            } catch (error: any) {
                toast.error(JSON.parse(await d(error.response.data)));
            }
        };
        fetchLocationDetails();
    }, [])

    return (
        <>
            <form onSubmit={handleSubmit(onSubmit)}>
                <div className={scss.form_details}>
                    <div className="grid grid-cols-2 gap-4">

                        {/* Address Line 1 */}
                        <div className={scss.form_block}>
                            <div className={scss.input_block}>
                                <label>Address line 1</label>
                                <Input
                                    {...register("addressLine1")}
                                    placeholder="Enter Address line 1"
                                />
                                {errors.addressLine1 && (
                                    <p className="text-red-500 text-xs">
                                        {errors.addressLine1.message}
                                    </p>
                                )}
                            </div>
                        </div>

                        {/* Address Line 2 */}
                        <div className={scss.form_block}>
                            <div className={scss.input_block}>
                                <label>Address line 2</label>
                                <Input
                                    {...register("addressLine2")}
                                    placeholder="Enter Address line 2"
                                />
                            </div>
                        </div>

                        {/* City */}
                        <div className={scss.form_block}>
                            <div className={scss.input_block}>
                                <label>City</label>
                                <Input {...register("city")} placeholder="Enter City" />
                                {errors.city && (
                                    <p className="text-red-500 text-xs">{errors.city.message}</p>
                                )}
                            </div>
                        </div>

                        {/* District */}
                        <div className={scss.form_block}>
                            <div className={scss.input_block}>
                                <label>District</label>
                                <Input {...register("district")} placeholder="Enter District" />
                                {errors.district && (
                                    <p className="text-red-500 text-xs">{errors.district.message}</p>
                                )}
                            </div>
                        </div>

                        {/* State */}
                        <div className={scss.form_block}>
                            <div className={scss.input_block}>
                                <label>State</label>
                                <Input {...register("state")} placeholder="Enter State" />
                                {errors.state && (
                                    <p className="text-red-500 text-xs">{errors.state.message}</p>
                                )}
                            </div>
                        </div>

                        {/* Pincode */}
                        <div className={scss.form_block}>
                            <div className={scss.input_block}>
                                <label>Pincode</label>
                                <Input {...register("pincode")} placeholder="Enter Pincode" />
                                {errors.pincode && (
                                    <p className="text-red-500 text-xs">{errors.pincode.message}</p>
                                )}
                            </div>
                        </div>

                        {/* Latitude */}
                        <div className={scss.form_block}>
                            <div className={scss.input_block}>
                                <label>Latitude</label>
                                <Input {...register("latitude")} placeholder="Enter Latitude" />
                                {errors.latitude && (
                                    <p className="text-red-500 text-xs">{errors.latitude.message}</p>
                                )}
                            </div>
                        </div>

                        {/* Longitude */}
                        <div className={scss.form_block}>
                            <div className={scss.input_block}>
                                <label>Longitude</label>
                                <Input {...register("longitude")} placeholder="Enter Longitude" />
                                {errors.longitude && (
                                    <p className="text-red-500 text-xs">
                                        {errors.longitude.message}
                                    </p>
                                )}
                            </div>
                        </div>

                        {/* Google Maps Link */}
                        <div className={scss.form_block}>
                            <div className={scss.input_block}>
                                <label>Google Maps Location Link</label>
                                <Input
                                    {...register("googleMapsLink")}
                                    placeholder="Enter Google Maps Location Link"
                                />
                                {errors.googleMapsLink && (
                                    <p className="text-red-500 text-xs">
                                        {errors.googleMapsLink.message}
                                    </p>
                                )}
                            </div>
                        </div>

                        {/* Nearest Landmark */}
                        <div className={scss.form_block}>
                            <div className={scss.input_block}>
                                <label>Nearest Landmark</label>
                                <Input
                                    {...register("nearestLandmark")}
                                    placeholder="Enter Nearest Landmark"
                                />
                                {errors.nearestLandmark && (
                                    <p className="text-red-500 text-xs">
                                        {errors.nearestLandmark.message}
                                    </p>
                                )}
                            </div>
                        </div>

                    </div>
                </div>

                <div className={scss.btn_wrapper}>
                    <button type="button" onClick={handlePrev} className={scss.prev_btn}>
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

export default LocationDetails