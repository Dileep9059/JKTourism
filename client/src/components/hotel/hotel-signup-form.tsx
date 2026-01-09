import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { useState } from "react"

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "@/axios/axios"
import { toast } from "sonner"
import { registerSchema, type RegisterFormData } from "../schemas/register-schema"
import { e } from "../utils/crypto"
import { allowOnlyAlphabets, allowOnlyNumbers } from "@/utils/utilityFunction"

export function HotelSignupForm({
  className,
  ...props
}: React.ComponentProps<"div">) {

  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    mode: "onChange",
  });

  const onSubmit = async (data: RegisterFormData) => {
    try {
      setLoading(true);
      await registerUser(data);
      toast.success("Account created successfully");
      reset();
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="overflow-hidden p-0">
        <CardContent className="grid p-0 md:grid-cols-2">
          <form className="p-6 md:p-8" onSubmit={handleSubmit(onSubmit)}>
            <FieldGroup>

              {/* Header */}
              <div className="flex flex-col items-center gap-2 text-center">
                <h1 className="text-2xl font-bold">Create your account</h1>
                <p className="text-muted-foreground text-sm text-balance">
                  Fill in the details below to create your account
                </p>
              </div>

              {/* Name Fields */}
              <Field className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Field>
                  <FieldLabel htmlFor="firstname">First Name</FieldLabel>
                  <Input id="firstname" type="text" {...register("firstname")} onKeyDown={allowOnlyAlphabets} />
                  {errors.firstname && (
                    <p className="text-sm text-red-500">{errors.firstname.message}</p>
                  )}
                </Field>

                <Field>
                  <FieldLabel htmlFor="middlename">Middle Name</FieldLabel>
                  <Input id="middlename" type="text" {...register("middlename")} onKeyDown={allowOnlyAlphabets} />
                  {errors.middlename && (
                    <p className="text-sm text-red-500">{errors.middlename.message}</p>
                  )}
                </Field>

                <Field>
                  <FieldLabel htmlFor="lastname">Last Name</FieldLabel>
                  <Input id="lastname" type="text" {...register("lastname")} onKeyDown={allowOnlyAlphabets} />
                  {errors.lastname && (
                    <p className="text-sm text-red-500">{errors.lastname.message}</p>
                  )}
                </Field>
              </Field>

              {/* Email */}
              <Field>
                <FieldLabel htmlFor="email">Email</FieldLabel>
                <Input
                  id="email"
                  type="email"
                  placeholder="m@example.com"
                  {...register("email")}
                />
                {errors.email && (
                  <p className="text-sm text-red-500">{errors.email.message}</p>
                )}
                <FieldDescription>
                  We&apos;ll use this to contact you. We will not share your email.
                </FieldDescription>
              </Field>

              {/* Mobile & Gender */}
              <Field className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Field>
                  <FieldLabel htmlFor="mobile">Mobile Number</FieldLabel>
                  <Input
                    id="mobile"
                    type="tel"
                    placeholder="9876543210"
                    inputMode="numeric"
                    maxLength={10}
                    onKeyDown={allowOnlyNumbers}
                    {...register("mobile")}
                  />
                  {errors.mobile && (
                    <p className="text-sm text-red-500">{errors.mobile.message}</p>
                  )}
                </Field>

                <Field>
                  <FieldLabel htmlFor="gender">Gender</FieldLabel>
                  <select
                    id="gender"
                    className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
                    {...register("gender")}
                  >
                    <option value="">Select</option>
                    <option value="MALE">Male</option>
                    <option value="FEMALE">Female</option>
                  </select>
                  {errors.gender && (
                    <p className="text-sm text-red-500">{errors.gender.message}</p>
                  )}
                </Field>
              </Field>

              {/* Password Fields */}
              <Field className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Field>
                  <FieldLabel htmlFor="password">Password</FieldLabel>
                  <Input id="password" type="password" {...register("password")} />
                  {errors.password && (
                    <p className="text-sm text-red-500">{errors.password.message}</p>
                  )}
                </Field>

                <Field>
                  <FieldLabel htmlFor="confirmpassword">
                    Confirm Password
                  </FieldLabel>
                  <Input id="confirmpassword" type="password" {...register("confirmpassword")} />
                  {errors.confirmpassword && (
                    <p className="text-sm text-red-500">{errors.confirmpassword.message}</p>
                  )}
                </Field>
              </Field>

              <FieldDescription>
                Password must be at least 8 characters long.
              </FieldDescription>

              {/* Submit */}
              <Field>
                <Button type="submit" className="w-full">
                  Create Account
                </Button>
              </Field>
            </FieldGroup>
          </form>

          <div className="bg-muted relative hidden md:block">
            <img
              src="/placeholder.svg"
              alt="Image"
              className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
            />
          </div>
        </CardContent>
      </Card>
      <FieldDescription className="px-6 text-center">
        By clicking continue, you agree to our <a href="#">Terms of Service</a>{" "}
        and <a href="#">Privacy Policy</a>.
      </FieldDescription>
    </div>
  )
}

export const registerUser = async (data: any) => {
  console.log(data);
  data['role'] = 'hotel';
  const response = await axios.post("/api/auth/signup", await e(data));
  return response.data;
};
