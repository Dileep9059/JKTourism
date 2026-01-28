import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import scss from './hotelregister.module.scss';

import { Input } from "../ui/input";
import { axiosPrivate } from "@/axios/axios";
import { toast } from "sonner";
import { d, e } from "../utils/crypto";
import { ownerDetailsSchema } from "../schemas/owner-detail-schema";
import type { OwnerDetailsFormValues } from "../schemas/owner-detail-schema";

const OwnerDetails = ({ handleNext, handlePrev, hotelId }: { handleNext: () => void, handlePrev: () => void, hotelId: string }) => {

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<OwnerDetailsFormValues>({
        resolver: zodResolver(ownerDetailsSchema),
    });

    const onSubmit = async (data: OwnerDetailsFormValues) => {
        console.log("OWNER DETAILS 👉", data);
        try {
            const { idProofFile, ...restData } = data;
            const formData = new FormData();

            formData.append("file", idProofFile[0]);
            formData.append("data", await e(restData));

            await axiosPrivate.post(`/api/hotels/${hotelId}/owner-details`, formData)
            toast.success("Owner details added successfully");
            handleNext();
        } catch (error: any) {
            toast.error(JSON.parse(await d(error.response.data)));
        }
    };

    return (
        <>
            <form onSubmit={handleSubmit(onSubmit)}>
                <div className={scss.form_details}>
                    <div className="grid grid-cols-2 gap-4 md:gap-6">

                        {/* Owner Full Name */}
                        <div className={scss.form_block}>
                            <div className={scss.input_block}>
                                <label>Owner’s Full Name</label>
                                <Input
                                    {...register("name")}
                                    placeholder="Enter Owner's Full Name"
                                />
                                {errors.name && (
                                    <p className="text-red-500 text-xs">
                                        {errors.name.message}
                                    </p>
                                )}
                            </div>
                        </div>

                        {/* Mobile Number */}
                        <div className={scss.form_block}>
                            <div className={scss.input_block}>
                                <label>Mobile Number</label>
                                <Input
                                    {...register("mobile")}
                                    placeholder="Enter Mobile Number"
                                />
                                {errors.mobile && (
                                    <p className="text-red-500 text-xs">
                                        {errors.mobile.message}
                                    </p>
                                )}
                            </div>
                        </div>

                        {/* Email Address */}
                        <div className={scss.form_block}>
                            <div className={scss.input_block}>
                                <label>Email Address</label>
                                <Input
                                    type="email"
                                    {...register("email")}
                                    placeholder="Enter Email Address"
                                />
                                {errors.email && (
                                    <p className="text-red-500 text-xs">
                                        {errors.email.message}
                                    </p>
                                )}
                            </div>
                        </div>

                        {/* ID Proof Type */}
                        <div className={scss.form_block}>
                            <div className={scss.input_block}>
                                <label>ID Proof Type</label>
                                <Input
                                    {...register("idProofType")}
                                    placeholder="Enter ID Proof Type"
                                />
                                {errors.idProofType && (
                                    <p className="text-red-500 text-xs">
                                        {errors.idProofType.message}
                                    </p>
                                )}
                            </div>
                        </div>

                        {/* ID Proof File */}
                        <div className={scss.form_block}>
                            <div className={scss.input_block}>
                                <label>ID Proof File</label>
                                <Input
                                    type="file"
                                    accept="image/jpeg,image/jpg,image/png"
                                    {...register("idProofFile")}
                                />
                                {errors.idProofFile && (
                                    <p className="text-red-500 text-xs">
                                        {errors.idProofFile.message as string}
                                    </p>
                                )}
                            </div>
                        </div>

                    </div>
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

export default OwnerDetails