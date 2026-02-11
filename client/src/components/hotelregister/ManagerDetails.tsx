import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { managerDetailsSchema, type ManagerDetailsFormValues } from "../schemas/manager-detail-schema";
import scss from './hotelregister.module.scss';
import { Input } from "../ui/input";
import { axiosPrivate } from "@/axios/axios";
import { toast } from "sonner";
import { d, e } from "../utils/crypto";
import { useEffect } from "react";


const ManagerDetails = ({ handleNext, handlePrev, hotelId }: { handleNext: () => void, handlePrev: () => void, hotelId: string }) => {

  const {
    register,
    handleSubmit, reset,
    formState: { errors },
  } = useForm<ManagerDetailsFormValues>({
    resolver: zodResolver(managerDetailsSchema),
  });

  const onSubmit = async (data: ManagerDetailsFormValues) => {
    try {
      await axiosPrivate.post(`/api/hotels/${hotelId}/manager`, await e(data));
      toast.success("Manager Information Added Successfully");
      handleNext();
    } catch (error: any) {
      toast.error(JSON.parse(await d(error.response.data)));
    }
  };

  useEffect(() => {
    const fetchManagerDetails = async () => {
      try {
        const response = await axiosPrivate.get(`/api/hotels/${hotelId}/manager`);
        const data = JSON.parse(await d(response.data));
        reset(data);
      } catch (error: any) {
        toast.error(JSON.parse(await d(error.response.data)));
      }
    };
    fetchManagerDetails();
  }, [])

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
                  {...register("name")}
                  placeholder="Enter Manager Name"
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

            {/* Alternate Contact Number */}
            <div className={scss.form_block}>
              <div className={scss.input_block}>
                <label>Alternate Contact Number</label>
                <Input
                  {...register("alternateContact")}
                  placeholder="Enter Alternate Contact Number"
                />
                {errors.alternateContact && (
                  <p className="text-red-500 text-xs">
                    {errors.alternateContact.message}
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