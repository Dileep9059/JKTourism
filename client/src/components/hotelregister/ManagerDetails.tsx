import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { managerDetailsSchema, type ManagerDetailsFormValues } from "../schemas/manager-detail-schema";
import scss from './hotelregister.module.scss';
import { Input } from "../ui/input";
import { axiosPrivate } from "@/axios/axios";
import { toast } from "sonner";
import { d, e } from "../utils/crypto";


const ManagerDetails = ({ handleNext, handlePrev, hotelId }: { handleNext: () => void, handlePrev: () => void, hotelId: string }) => {

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ManagerDetailsFormValues>({
    resolver: zodResolver(managerDetailsSchema),
  });

  const onSubmit = async (data: ManagerDetailsFormValues) => {
    console.log("MANAGER DETAILS 👉", data);
    try {
      await axiosPrivate.post(`/api/hotels/${hotelId}/manager`, await e(data));
      toast.success("Manager Information Added Successfully");
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

            {/* Manager Name */}
            <div className={scss.form_block}>
              <div className={scss.input_block}>
                <label>Manager Name</label>
                <Input
                  {...register("managerName")}
                  placeholder="Enter Manager Name"
                />
                {errors.managerName && (
                  <p className="text-red-500 text-xs">
                    {errors.managerName.message}
                  </p>
                )}
              </div>
            </div>

            {/* Mobile Number */}
            <div className={scss.form_block}>
              <div className={scss.input_block}>
                <label>Mobile Number</label>
                <Input
                  {...register("mobileNumber")}
                  placeholder="Enter Mobile Number"
                />
                {errors.mobileNumber && (
                  <p className="text-red-500 text-xs">
                    {errors.mobileNumber.message}
                  </p>
                )}
              </div>
            </div>

            {/* Alternate Contact Number */}
            <div className={scss.form_block}>
              <div className={scss.input_block}>
                <label>Alternate Contact Number</label>
                <Input
                  {...register("alternateContactNumber")}
                  placeholder="Enter Alternate Contact Number"
                />
                {errors.alternateContactNumber && (
                  <p className="text-red-500 text-xs">
                    {errors.alternateContactNumber.message}
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
                  {...register("emailAddress")}
                  placeholder="Enter Email Address"
                />
                {errors.emailAddress && (
                  <p className="text-red-500 text-xs">
                    {errors.emailAddress.message}
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

export default ManagerDetails