import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { basicInfoSchema, type BasicInfoFormValues } from "../schemas/basic-info-schema";
import scss from './hotelregister.module.scss';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Input } from "../ui/input";
import { axiosPrivate } from "@/axios/axios";
import { toast } from "sonner";
import { d, e } from "../utils/crypto";
import { useEffect, useMemo } from "react";

const BasicInfo = ({ handleNext }: { handleNext: () => void }) => {

    const years = useMemo(() => {
        const currentYear = new Date().getFullYear();
        return Array.from(
            { length: currentYear - 1950 + 1 },
            (_, i) => String(currentYear - i)
        );
    }, []);

    const {
        register,
        handleSubmit,
        control,
        formState: { errors }, reset
    } = useForm<BasicInfoFormValues>({
        resolver: zodResolver(basicInfoSchema),
        defaultValues: {
            starRating: "",
            yearOfEstablishment: undefined as any
        },
    });

    const onSubmit = async (data: BasicInfoFormValues) => {
        try {
            await axiosPrivate.post("/api/hotels/basic-info", await e(data));
            toast.success("Basic Information Added Successfully");
            handleNext();
        } catch (error: any) {
            toast.error(await d(error.response.data.message));
        }
    };

    async function getBasicInfo() {
        try {
            const response = await axiosPrivate.get("/api/hotels/basic-info");
            const data = JSON.parse(await d(response.data));
            reset({
                displayName: data?.displayName ?? "",
                legalName: data?.legalName ?? "",
                hotelType: data?.hotelType ?? undefined,
                starRating: data?.starRating ?? "",
                yearOfEstablishment: data?.establishedYear
                    ? String(data.establishedYear)
                    : undefined,
                websiteUrl: data?.websiteUrl ?? "",
                publicEmail: data?.publicEmail ?? "",
                publicPhone: data?.publicPhone ?? "",
            });
        } catch (error: any) {
            toast.error(await d(error.response.data.message));
        }
    }

    useEffect(() => {
        getBasicInfo();
    }, []);


    return (
        <>
            <form onSubmit={handleSubmit(onSubmit)}>
                <div className={scss.form_details}>
                    <div className="grid grid-cols-2 gap-6">

                        {/* Legal Name */}
                        <div className={scss.form_block}>
                            <div className={scss.input_block}>
                                <label>Legal Name</label>
                                <Input {...register("legalName")} placeholder="Enter Legal Name" />
                                {errors.legalName && (
                                    <p className="text-red-500 text-xs">{errors.legalName.message}</p>
                                )}
                            </div>
                        </div>

                        {/* Display Name */}
                        <div className={scss.form_block}>
                            <div className={scss.input_block}>
                                <label>Display Name</label>
                                <Input {...register("displayName")} placeholder="Enter Display Name" />
                                {errors.displayName && (
                                    <p className="text-red-500 text-xs">{errors.displayName.message}</p>
                                )}
                            </div>
                        </div>

                        {/* Website URL */}
                        <div className={scss.form_block}>
                            <div className={scss.input_block}>
                                <label>Website URL</label>
                                <Input {...register("websiteUrl")} placeholder="Enter Website URL" />
                                {errors.websiteUrl && (
                                    <p className="text-red-500 text-xs">{errors.websiteUrl.message}</p>
                                )}
                            </div>
                        </div>

                        {/* Public Email */}
                        <div className={scss.form_block}>
                            <div className={scss.input_block}>
                                <label>Public Email</label>
                                <Input {...register("publicEmail")} placeholder="Enter Public Email" />
                                {errors.publicEmail && (
                                    <p className="text-red-500 text-xs">{errors.publicEmail.message}</p>
                                )}
                            </div>
                        </div>

                        {/* Public Phone */}
                        <div className={scss.form_block}>
                            <div className={scss.input_block}>
                                <label>Public Phone</label>
                                <Input {...register("publicPhone")} placeholder="Enter Public Phone" />
                                {errors.publicPhone && (
                                    <p className="text-red-500 text-xs">{errors.publicPhone.message}</p>
                                )}
                            </div>
                        </div>

                        {/* Hotel Type */}
                        <div className={scss.form_block}>
                            <div className={scss.input_block}>
                                <label>Hotel Type</label>
                                <Controller
                                    control={control}
                                    name="hotelType"
                                    render={({ field }) => (
                                        <Select onValueChange={field.onChange} value={field.value}>
                                            <SelectTrigger className="w-full">
                                                <SelectValue placeholder="Select Hotel Type" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="hotel">Hotel</SelectItem>
                                                <SelectItem value="resort">Resort</SelectItem>
                                                <SelectItem value="guest-house">Guest House</SelectItem>
                                                <SelectItem value="home-stay">Home Stay</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    )}
                                />
                                {errors.hotelType && (
                                    <p className="text-red-500 text-xs">{errors.hotelType.message}</p>
                                )}
                            </div>
                        </div>

                        {/* Star Rating */}
                        <div className={scss.form_block}>
                            <div className={scss.input_block}>
                                <label>Star Rating (if applicable)</label>
                                <Controller
                                    control={control}
                                    name="starRating"
                                    render={({ field }) => (
                                        <Select onValueChange={field.onChange} value={field.value}>
                                            <SelectTrigger className="w-full">
                                                <SelectValue placeholder="Select Star Rating" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {[1, 2, 3, 4, 5].map((star) => (
                                                    <SelectItem key={star} value={String(star)}>
                                                        {star}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    )}
                                />
                            </div>
                        </div>

                        {/* Year of Establishment */}
                        <div className={scss.form_block}>
                            <div className={scss.input_block}>
                                <label>Year of Establishment</label>
                                <Controller
                                    control={control}
                                    name="yearOfEstablishment"
                                    render={({ field }) => (
                                        <Select onValueChange={field.onChange} value={field.value}>
                                            <SelectTrigger className="w-full">
                                                <SelectValue placeholder="Select year" />
                                            </SelectTrigger>
                                            <SelectContent className="max-h-64">
                                                {years.map((year) => (
                                                    <SelectItem key={year} value={year}>
                                                        {year}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    )}
                                />
                                {errors.yearOfEstablishment && (
                                    <p className="text-red-500 text-xs">
                                        {errors.yearOfEstablishment.message}
                                    </p>
                                )}
                            </div>
                        </div>

                    </div>
                </div>

                <div className={scss.btn_wrapper}>
                    <button type="submit" className={scss.next_btn}>
                        Next
                    </button>
                </div>
            </form>

        </>
    )
}

export default BasicInfo