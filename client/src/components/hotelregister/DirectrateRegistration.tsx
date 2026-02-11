import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import scss from './hotelregister.module.scss';
import { Form } from '@/components/ui/form';
import { axiosPrivate } from '@/axios/axios';
import { toast } from 'sonner';
import { d, e } from '../utils/crypto';
import { registrationSchema, type RegistrationFormValues } from '../schemas/hotel-registration-schema';
import { Input } from '../ui/input';
import { useEffect } from 'react';

const DirectrateRegistration = ({ handleNext, handlePrev, hotelId }: { handleNext: () => void, handlePrev: () => void, hotelId: string }) => {

    const form = useForm<RegistrationFormValues>({
        resolver: zodResolver(registrationSchema),
        defaultValues: {
            registrationNumber: "",
            registrationCertificate: undefined,
        },
    });

    const {
        register,
        formState: { errors },
    } = form;

    const onSubmit = async (data: RegistrationFormValues) => {

        try {
            const payload = {
                registrationNumber: data.registrationNumber,
            }
            const formData = new FormData();
            formData.append("data", await e(payload));
            formData.append("file", data.registrationCertificate?.[0]);

            await axiosPrivate.post(`/api/hotels/${hotelId}/registration`, formData);
            toast.success("Hotel registration documents submitted.");
            handleNext();
        } catch (error: any) {
            toast.error(JSON.parse(await d(error.response?.data)) || "Failed to update hotel documents.");
        }
    };

    useEffect(() => {
        const fetchRegistrationDetails = async () => {
            try {
                const response = await axiosPrivate.get(`/api/hotels/${hotelId}/registration`);
                const data = JSON.parse(await d(response.data));
                form.reset({
                    registrationNumber: data.registrationNumber,
                    registrationCertificate: undefined,
                });
            } catch (error: any) {
                toast.error(JSON.parse(await d(error.response?.data)) || "Failed to fetch hotel registration details.");
            }
        };
        fetchRegistrationDetails();
    }, [hotelId]);

    return (
        <Form {...form}>
            <form className={scss.form_details} onSubmit={form.handleSubmit(onSubmit)}>

                <div className="grid grid-cols-2 gap-4 md:gap-6">

                    {/* Registration Number */}
                    <div className={scss.form_block}>
                        <div className={scss.input_block}>
                            <label>Registration no.</label>
                            <Input
                                type="text"
                                placeholder="Enter Registration no."
                                {...register("registrationNumber")}
                            />
                        </div>

                        {errors.registrationNumber && (
                            <p className="text-red-500 text-sm">
                                {errors.registrationNumber.message}
                            </p>
                        )}
                    </div>

                    {/* Registration Certificate */}
                    <div className={scss.form_block}>
                        <div className={scss.input_block}>
                            <label>Upload Registration certificate</label>
                            <Input
                                type="file"
                                accept=".pdf"
                                {...register("registrationCertificate")}
                            />
                            <span className="text-sm text-muted-foreground">
                                File should be in PDF format and should not be greater than 2MB.
                            </span>
                        </div>

                        {errors.registrationCertificate && (
                            <p className="text-red-500 text-sm">
                                {errors.registrationCertificate.message as string}
                            </p>
                        )}
                    </div>

                </div>
                <div className={scss.btn_wrapper}>
                    <button onClick={handlePrev} className={scss.prev_btn}>
                        Prev
                    </button>
                    <button type='submit' className={scss.next_btn}>
                        Next
                    </button>
                </div>
            </form>
        </Form>

    )
}

export default DirectrateRegistration