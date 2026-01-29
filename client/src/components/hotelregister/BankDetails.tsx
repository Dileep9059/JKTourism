import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import scss from './hotelregister.module.scss';
import { Form } from '@/components/ui/form';
import { axiosPrivate } from '@/axios/axios';
import { toast } from 'sonner';
import { d, e } from '../utils/crypto';
import { Input } from '../ui/input';
import { bankDetailsSchema, type BankDetailsFormValues } from '../schemas/bank-detail-schema';

const BankDetails = ({ handleNext, handlePrev, hotelId }: { handleNext: () => void; handlePrev: () => void, hotelId: string }) => {

    const form = useForm<BankDetailsFormValues>({
        resolver: zodResolver(bankDetailsSchema),
        defaultValues: {
            accountHolderName: "",
            bankName: "",
            accountNumber: "",
            confirmAccountNumber: "",
            ifscCode: "",
            cancelledCheque: undefined,
        },
    });

    const {
        register,
        formState: { errors },
    } = form;

    const onSubmit = async (data: BankDetailsFormValues) => {
        const formData = new FormData();

        const {cancelledCheque, ...rest} = data;

        formData.append("data", await e(rest));
        formData.append("file", cancelledCheque[0]);

        try{
            await axiosPrivate.post(`/api/hotels/${hotelId}/bank`, formData);
            toast.success("Bank details added successfully");
            handleNext();
        } catch (error: any) {
          toast.error(JSON.parse(await d(error.response.data)) ?? "Something went wrong")  ;
        }
    };

    return (
        <Form {...form}>
            <form className={scss.form_details} onSubmit={form.handleSubmit(onSubmit)} autoComplete='off'>
                <div className="grid grid-cols-2 gap-4 md:gap-6">

                    <div className={scss.form_block}>
                        <div className={scss.input_block}>
                            <label>Account Holder Name</label>
                            <Input {...register("accountHolderName")} type='text' autoComplete='off' />
                        </div>
                        {errors.accountHolderName && (
                            <p className="text-red-500 text-sm">
                                {errors.accountHolderName.message}
                            </p>
                        )}
                    </div>

                    <div className={scss.form_block}>
                        <div className={scss.input_block}>
                            <label>Bank Name</label>
                            <Input {...register("bankName")} />
                        </div>
                        {errors.bankName && (
                            <p className="text-red-500 text-sm">
                                {errors.bankName.message}
                            </p>
                        )}
                    </div>

                    <div className={scss.form_block}>
                        <div className={scss.input_block}>
                            <label>Account Number</label>
                            <Input type="password" {...register("accountNumber")} />
                        </div>
                        {errors.accountNumber && (
                            <p className="text-red-500 text-sm">
                                {errors.accountNumber.message}
                            </p>
                        )}
                    </div>

                    <div className={scss.form_block}>
                        <div className={scss.input_block}>
                            <label>Confirm Account Number</label>
                            <Input {...register("confirmAccountNumber")} />
                        </div>
                        {errors.confirmAccountNumber && (
                            <p className="text-red-500 text-sm">
                                {errors.confirmAccountNumber.message}
                            </p>
                        )}
                    </div>

                    <div className={scss.form_block}>
                        <div className={scss.input_block}>
                            <label>IFSC Code</label>
                            <Input {...register("ifscCode")} />
                        </div>
                        {errors.ifscCode && (
                            <p className="text-red-500 text-sm">
                                {errors.ifscCode.message}
                            </p>
                        )}
                    </div>

                    <div className={scss.form_block}>
                        <div className={scss.input_block}>
                            <label>Cancelled Cheque Upload</label>
                            <Input type="file" accept=".pdf" {...register("cancelledCheque")} />
                            <span className="text-sm text-muted-foreground">
                                File should be in PDF format and should not be greater than 2MB.
                            </span>
                        </div>
                        {errors.cancelledCheque && (
                            <p className="text-red-500 text-sm">
                                {errors.cancelledCheque.message as string}
                            </p>
                        )}
                    </div>

                </div>
                <div className={scss.btn_wrapper}>
                    <button onClick={handlePrev} className={scss.prev_btn}>Prev</button>
                    <button type='submit' className={scss.next_btn}>Next</button>
                </div>
            </form>
        </Form>


    )
}

export default BankDetails