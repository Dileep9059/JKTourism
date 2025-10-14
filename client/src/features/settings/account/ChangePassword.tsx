import ContentSection from "../components/content-section"

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { axiosPrivate } from "@/axios/axios";
import { d, e } from "@/components/utils/crypto";
import useAuth from "@/hooks/useAuth";
import type { AuthType } from "@/context/AuthProvider";
import useLogout from "@/hooks/useLogout";
import { useNavigate } from "react-router-dom";

const passwordSchema = z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[a-z]/, "At least one lowercase letter required")
    .regex(/[A-Z]/, "At least one uppercase letter required")
    .regex(/[0-9]/, "At least one number required")
    .regex(/[^a-zA-Z0-9]/, "At least one special character required");

const ChangePasswordSchema = z
    .object({
        oldPassword: z.string().min(1, "Old password is required"),
        newPassword: passwordSchema,
        confirmPassword: z.string(),
    })
    .refine((data) => data.oldPassword !== data.newPassword, {
        message: "New password must be different from old password",
        path: ["newPassword"],
    })
    .refine((data) => data.newPassword === data.confirmPassword, {
        message: "Passwords do not match",
        path: ["confirmPassword"],
    });

type ChangePasswordFormData = z.infer<typeof ChangePasswordSchema>;

const ChangePassword = () => {

    const { auth } = useAuth() as { auth: AuthType };

    const logout = useLogout();
    const navigate = useNavigate();

    const signOut = async () => {
        // if used in more components, this should be in context
        // axios to /logout endpoint
        await logout();
        navigate("/login");
    };

    const form = useForm<ChangePasswordFormData>({
        resolver: zodResolver(ChangePasswordSchema),
        defaultValues: {
            oldPassword: "",
            newPassword: "",
            confirmPassword: "",
        },
    });

    const onSubmit = async (values: ChangePasswordFormData) => {
        try {
            const params = {
                username: auth?.user,
                currentPassword: values.oldPassword,
                newPassword: values.newPassword,
                confirmPassword: values.confirmPassword
            }
            const result = await axiosPrivate.post('/api/profile/change-password', await e(JSON.stringify(params)));
            const message = JSON.parse(await d(result?.data?.message));
            toast.success(message);
            // after 10 seconds logout the user
            setTimeout(() => {
                signOut();
            }, 10000);
            // show a toast message for 10 seconds
            toast.info("You will be logged out in 10 seconds", {
                duration: 10000,     // Show for 10 seconds
                dismissible: false,  // Prevent manual dismissal (X button)
            });

        } catch (error) {
            console.log(error)
            toast.error("");
        }
    };

    return (
        <>
            <ContentSection
                title='Change Password'
                desc='Update your password.'
            >
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        <FormField
                            control={form.control}
                            name="oldPassword"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Old Password</FormLabel>
                                    <FormControl>
                                        <Input type="password" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="newPassword"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>New Password</FormLabel>
                                    <FormControl>
                                        <Input type="password" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="confirmPassword"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Confirm New Password</FormLabel>
                                    <FormControl>
                                        <Input type="password" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <Button type="submit" className="w-full">
                            Change Password
                        </Button>
                    </form>
                </Form>
            </ContentSection>
        </>
    )
}

export default ChangePassword