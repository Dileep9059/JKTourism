import ContentSection from "../components/content-section"
import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import {
    Form,
    FormField,
    FormItem,
    FormLabel,
    FormControl,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

const confirmationPhrase = "delete my account";



const DeleteAccountSchema = z.object({
    email: z.string().email("Please enter a valid email"),
    confirmation: z
        .string()
        .refine((val) => val === "delete my account", {
            message: `You must type "${confirmationPhrase}" exactly`,
        }),
});

type DeleteAccountFormValues = {
    email: string;
    confirmation: string;
};

const DeleteAccount = () => {

    const form = useForm<DeleteAccountFormValues>({
        resolver: zodResolver(DeleteAccountSchema),
        defaultValues: {
            email: "",
            // confirmation: "", 
        },
    });

    const onSubmit = async (data: DeleteAccountFormValues) => {
        console.log("Form submitted:", data);
        // 🔥 Make API call to delete account here
    };


    return (
        <>
            <ContentSection
                title='Delete account'
                desc='Update your password.'
            >
                <>
                    <Label className="my-3 block text-sm text-muted-foreground">
                        Once you delete your account, there is no going back. Please be certain.
                    </Label>

                    <Dialog>
                        <DialogTrigger asChild>
                            <Button className="text-red-500 bg-accent hover:text-white hover:bg-red-500">
                                Delete my account
                            </Button>
                        </DialogTrigger>

                        <DialogContent className="sm:max-w-[425px]">
                            <Form {...form}>
                                <form onSubmit={form.handleSubmit(onSubmit)}>
                                    <DialogHeader>
                                        <DialogTitle>Are you sure?</DialogTitle>
                                        <DialogDescription className="space-y-2 text-muted-foreground text-sm">
                                            <p>
                                                We’ll permanently delete all of your data — comments, feedback, issues,
                                                images, and videos.
                                            </p>
                                            <p>
                                                You will lose access immediately. Your username will be available after 1 day.
                                            </p>
                                        </DialogDescription>
                                    </DialogHeader>

                                    <div className="grid gap-4 py-4">
                                        <FormField
                                            control={form.control}
                                            name="email"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Email</FormLabel>
                                                    <FormControl>
                                                        <Input placeholder="you@example.com" {...field} />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <FormField
                                            control={form.control}
                                            name="confirmation"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>
                                                        To confirm, type{" "}
                                                        <span className="italic text-red-500">{confirmationPhrase}</span>
                                                    </FormLabel>
                                                    <FormControl>
                                                        <Input placeholder={confirmationPhrase} {...field} />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </div>

                                    <DialogFooter>
                                        <Button
                                            type="submit"
                                            className="text-red-500 bg-accent hover:text-white hover:bg-red-500"
                                        >
                                            Delete this account
                                        </Button>
                                    </DialogFooter>
                                </form>
                            </Form>
                        </DialogContent>
                    </Dialog>
                </>
            </ContentSection>
        </>
    )
}

export default DeleteAccount