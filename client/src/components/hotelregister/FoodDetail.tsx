import { useEffect } from 'react'
import { foodSchema, type FoodFormValues } from '../schemas/food-schema';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import scss from './hotelregister.module.scss';
import clsx from 'clsx';
import { Checkbox } from '@/components/ui/checkbox';
import { Field, FieldGroup, FieldLabel, FieldSet, FieldLegend } from '@/components/ui/field';
import { Form } from '@/components/ui/form';
import { Controller } from 'react-hook-form';
import { RadioGroup, RadioGroupItem } from '../ui/radio-group';
import { axiosPrivate } from '@/axios/axios';
import { toast } from 'sonner';
import { d, e } from '../utils/crypto';

const FoodDetail = ({ handleNext, handlePrev, hotelId }: { handleNext: () => void, handlePrev: () => void, hotelId: string }) => {

    const form = useForm<FoodFormValues>({
        resolver: zodResolver(foodSchema),
        defaultValues: {
            inHouseRestaurant: false,
            roomService: false,
            foodType: "VEG",
        },
    });
    const { control, formState, handleSubmit } = form;

    const onSubmit = async (data: FoodFormValues) => {
        try {
            await axiosPrivate.post(`/api/hotels/${hotelId}/food`, await e(data));
            toast.success("Food Details Added Successfully.");
            handleNext();
        } catch (error: any) {
            toast.error(JSON.parse(await d(error.response.data)))
        }
    };

    useEffect(() => {
        const getFoodDetails = async () => {
            try {
                const response = await axiosPrivate.get(`/api/hotels/${hotelId}/food`);
                const data = JSON.parse(await d(response.data));
                form.reset(data);
            } catch (error: any) {
                toast.error(JSON.parse(await d(error.response.data)))
            }
        };
        getFoodDetails();
    }, [hotelId]);


    return (
        <>
            <Form {...form}>
                <form className={scss.form_details} onSubmit={handleSubmit(onSubmit)}>
                    <div className="grid grid-cols-2 gap-4 md:gap-6">

                        {/* In-house Restaurant */}
                        <div className={clsx(scss.form_block, "")}>
                            <Controller
                                name="inHouseRestaurant"
                                control={control}
                                render={({ field }) => (
                                    <FieldGroup className="mx-auto w-56">
                                        <Field orientation="horizontal">
                                            <Checkbox
                                                checked={field.value}
                                                onCheckedChange={field.onChange}
                                            />
                                            <FieldLabel htmlFor='inHouseRestaurant'>
                                                In-house Restaurant Available
                                            </FieldLabel>
                                        </Field>
                                    </FieldGroup>
                                )}
                            />
                        </div>

                        {/* Room Service */}
                        <div className={clsx(scss.form_block, "")}>
                            <Controller
                                name="roomService"
                                control={control}
                                render={({ field }) => (
                                    <FieldGroup className="mx-auto w-56">
                                        <Field orientation="horizontal">
                                            <Checkbox
                                                checked={field.value}
                                                onCheckedChange={field.onChange}
                                            />
                                            <FieldLabel htmlFor='roomService'>
                                                Room Service Available
                                            </FieldLabel>
                                        </Field>
                                    </FieldGroup>
                                )}
                            />
                        </div>

                        {/* Food Type */}
                        <div className={clsx(scss.form_block, "col-span-2")}>
                            <Controller
                                name="foodType"
                                control={control}
                                render={({ field }) => (
                                    <FieldSet className="w-full max-w-xs">
                                        <FieldLegend variant="label">Food Type</FieldLegend>

                                        <RadioGroup
                                            value={field.value}
                                            onValueChange={field.onChange}
                                        >
                                            <Field orientation="horizontal">
                                                <RadioGroupItem value="VEG" id="veg" />
                                                <FieldLabel htmlFor="veg">Veg</FieldLabel>
                                            </Field>

                                            <Field orientation="horizontal">
                                                <RadioGroupItem value="NON-VEG" id="non-veg" />
                                                <FieldLabel htmlFor="non-veg">Non-Veg</FieldLabel>
                                            </Field>

                                            <Field orientation="horizontal">
                                                <RadioGroupItem value="BOTH" id="both" />
                                                <FieldLabel htmlFor="both">Both</FieldLabel>
                                            </Field>
                                        </RadioGroup>
                                    </FieldSet>
                                )}
                            />

                            {formState.errors.foodType && (
                                <p className="text-red-500 text-sm mt-1">
                                    {formState.errors.foodType.message}
                                </p>
                            )}
                        </div>

                    </div>
                    <div className={scss.btn_wrapper}>
                        <button onClick={handlePrev} className={scss.prev_btn}>Prev</button>
                        <button type="submit" className={scss.next_btn}>Next</button>
                    </div>
                </form>
            </Form>

        </>
    )
}

export default FoodDetail