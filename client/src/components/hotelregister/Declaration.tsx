import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, useForm } from 'react-hook-form';
import scss from './hotelregister.module.scss';
import { Form } from '@/components/ui/form';
import { axiosPrivate } from '@/axios/axios';
import { toast } from 'sonner';
import { d, e } from '../utils/crypto';
import { Input } from '../ui/input';
import { declarationSchema, type DeclarationFormValues } from '../schemas/declaration-schema';
import { Checkbox } from '../ui/checkbox';
import { useEffect } from 'react';

const Declaration = ({handlePrev, hotelId }: { handlePrev: () => void, hotelId: string }) => {

    const today = new Date().toISOString().split("T")[0];
    const form = useForm<DeclarationFormValues>({
        resolver: zodResolver(declarationSchema),
        defaultValues: {
            consent: false,
            ownerName: "",
            declarationDate: today,
        },
    });

    const {
        register,
        control,
        formState: { errors },
    } = form;


    const onSubmit = async (data: DeclarationFormValues) => {
        
        const payload = {
            ...data,
            declarationDate: today
        }
        try {
            await axiosPrivate.post(`/api/hotels/${hotelId}/declaration`, await e(payload));
            toast.success("Declaration added successfully");
        } catch (error: any) {
            toast.error(JSON.parse(await d(error.response.data)) ?? "Something went wrong");
        }
    };

    useEffect(() => {
        const fetchDeclaration = async () => {
            try {
                const response = await axiosPrivate.get(`/api/hotels/${hotelId}/declaration`);
                const data = JSON.parse(await d(response.data));
                form.reset(data);
            } catch (error: any) {
                toast.error(JSON.parse(await d(error.response.data)) ?? "Something went wrong");
            }
        };
        fetchDeclaration();
    }, [hotelId]);

    return (
        <Form {...form}>
            <form className={scss.form_details} onSubmit={form.handleSubmit(onSubmit)}>

                {/* Consent */}
                <div className={scss.conset_details}>
                    <Controller
                        name="consent"
                        control={control}
                        render={({ field }) => (
                            <>
                                <Checkbox
                                    checked={field.value}
                                    onCheckedChange={field.onChange}
                                    id="consent"
                                />
                                <label htmlFor="consent">
                                    I hereby declare that the information provided above is true and
                                    correct. I authorize the service provider to list my property on
                                    JKTourism and contact me regarding onboarding and support.
                                </label>
                            </>
                        )}
                    />
                </div>

                {errors.consent && (
                    <p className="text-red-500 text-sm mt-1">
                        {errors.consent.message}
                    </p>
                )}

                {/* Owner name & Date */}
                <div className="grid grid-cols-2 gap-4 md:gap-6">

                    <div className={scss.form_block}>
                        <div className={scss.input_block}>
                            <label>Name</label>
                            <Input
                                type="text"
                                placeholder="Name"
                                {...register("ownerName")}
                            />
                        </div>
                        {errors.ownerName && (
                            <p className="text-red-500 text-sm">
                                {errors.ownerName.message}
                            </p>
                        )}
                    </div>

                    <div className={scss.form_block}>
                        <div className={scss.input_block}>
                            <label>Date</label>
                            <Input
                                type="date"
                                disabled
                                {...register("declarationDate")}
                            />
                        </div>
                        {errors.declarationDate && (
                            <p className="text-red-500 text-sm">
                                {errors.declarationDate.message}
                            </p>
                        )}
                    </div>

                </div>
                <div className={scss.btn_wrapper}>
                    <button onClick={handlePrev} className={scss.prev_btn}>
                        Prev
                    </button>
                    <button
                        type="submit"
                        onClick={form.handleSubmit(onSubmit)}
                        className={scss.submit_btn}
                    >
                        Submit
                    </button>
                </div>
            </form>
        </Form>


    )
}

export default Declaration