import { Link } from "react-router-dom";

import { useRef, useEffect } from "react";
import axios from "../../axios/axios";
import { Phone } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { d, e } from "../utils/crypto";
import DocumentTitle from "../DocumentTitle";

const REGISTER_URL = "/api/auth/signup";

const schema = z
  .object({
    firstname: z
      .string()
      .min(1, "First name is required")
      .regex(/^[A-Za-z\s]+$/, "Only alphabets allowed"),
    lastname: z
      .string()
      .min(1, "Last name is required")
      .regex(/^[A-Za-z\s]+$/, "Only alphabets allowed"),
    mobile: z
      .string()
      .min(10, "Mobile number must be at least 10 digits")
      .regex(/^\d+$/, "Only numbers allowed"),
    email: z.string().email("Invalid email"),
    acceptTerms: z.literal(true, {
      errorMap: () => ({ message: "You must accept terms" }),
    }),
    password: z
      .string()
      .min(6, "Password must be at least 6 characters")
      .max(16, "Password must be at most 16 characters"),
    confirmpassword: z.string(),
  })
  .refine((data) => data.password === data.confirmpassword, {
    message: "Passwords do not match",
    path: ["confirmpassword"],
  });


type FormData = z.infer<typeof schema>;

const Register = () => {
  const firstnameRef = useRef<HTMLInputElement>(null);
  const errRef = useRef<HTMLParagraphElement>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });


  useEffect(() => {
    firstnameRef.current?.focus();
  }, []);


  const onSubmit = async (data: FormData) => {

    const { acceptTerms, ...formData } = data; // Exclude acceptTerms from the data sent to the server
    try {
      const response = await axios.post(
        REGISTER_URL,
        await e(JSON.stringify(formData)),
        {
          headers: { "Content-Type": "text/plain" },
          withCredentials: true,
        }
      );
      reset(); // Reset form fields after successful registration
      toast.success(JSON.parse(await d(response?.data.message)));

    } catch (err: any) {
      if (!err?.response) {
        toast.error("No Server Response");
      } else if (err?.response?.status === 409) {
        toast.error("Username Taken");
      } else {
        toast.error("Registration Failed");
      }
      errRef.current?.focus();
    }
  };

  return (
    <>
      <DocumentTitle title="Register" />
      <div className="flex items-center justify-center">
        <div className="shadow-md rounded-xl w-full max-w-lg p-6 space-y-6">
          <h2 className="text-2xl font-bold text-center text-gray-600">REGISTRATION</h2>

          <form className="space-y-4 text-gray-600" autoComplete="off" onSubmit={handleSubmit(onSubmit)}>
            {/* First Name */}
            <div className="relative">
              <div>
                <input
                  type="text"
                  {...register("firstname")}
                  ref={(e) => {
                    register("firstname").ref(e);
                    firstnameRef.current = e;
                  }}
                  placeholder="First Name"
                  className={`w-full border ${errors?.firstname?.message ? "border-red-500 focus:ring-red-500" : "border-gray-300 focus:ring-blue-500"} rounded-md px-4 py-2 focus:outline-none focus:ring-2 `}
                />
              </div>
              {errors.firstname && (
                <p className="text-red-500 text-sm mb-1">{errors.firstname.message}</p>
              )}
            </div>

            {/* Last Name */}
            <div className="relative">
              <input
                type="text"
                placeholder="Last Name"
                {...register("lastname")}
                className={`w-full border ${errors?.lastname?.message ? "border-red-500 focus:ring-red-500" : "border-gray-300 focus:ring-blue-500"} rounded-md px-4 py-2 focus:outline-none focus:ring-2 `}
              />
              {errors.lastname && (
                <p className="text-red-500 text-sm mb-1">{errors.lastname.message}</p>
              )}
            </div>

            {/* Mobile Number */}
            <div className="flex items-center space-x-2">
              <div className="flex items-center border border-gray-300 rounded-md px-3 py-2 bg-gray-100 text-gray-800">
                <Phone className="mr-1 text-blue-800 w-5 h-5" />
                <span className="text-sm">+91</span>
              </div>
              <input
                type="tel"
                placeholder="Mobile Number"
                {...register("mobile")}
                maxLength={10}
                className={`w-full border ${errors?.mobile?.message ? "border-red-500 focus:ring-red-500" : "border-gray-300 focus:ring-blue-500"} rounded-md px-4 py-2 focus:outline-none focus:ring-2 `}
              />
            </div>
            {errors.mobile && (
              <p className="text-red-500 text-sm mb-1">{errors.mobile.message}</p>
            )}

            {/* Email */}
            <div>
              <input
                type="email"
                placeholder="Email"
                {...register("email")}
                className={`w-full border ${errors?.email?.message ? "border-red-500 focus:ring-red-500" : "border-gray-300 focus:ring-blue-500"} rounded-md px-4 py-2 focus:outline-none focus:ring-2 `}
              />
              {errors.email && (
                <p className="text-red-500 text-sm mb-1">{errors.email.message}</p>
              )}
            </div>
            <div>
              <input
                type="password"
                placeholder="Password"
                {...register("password")}
                className={`w-full border ${errors?.password?.message ? "border-red-500 focus:ring-red-500" : "border-gray-300 focus:ring-blue-500"} rounded-md px-4 py-2 focus:outline-none focus:ring-2 `}
              />
              {errors.password && (
                <p className="text-red-500 text-sm mb-1">{errors.password.message}</p>
              )}
            </div>
            <div>
              <input
                type="password"
                placeholder="Confirm password"
                {...register("confirmpassword")}
                className={`w-full border ${errors?.confirmpassword?.message ? "border-red-500 focus:ring-red-500" : "border-gray-300 focus:ring-blue-500"} rounded-md px-4 py-2 focus:outline-none focus:ring-2 `}
              />
              {errors.confirmpassword && (
                <p className="text-red-500 text-sm mb-1">{errors.confirmpassword.message}</p>
              )}
            </div>

            {/* Accept Terms */}
            <div className="flex items-center space-x-2">
              <input type="checkbox" {...register("acceptTerms")} id="terms" />
              <label htmlFor="terms" className="text-sm text-gray-700">
                Accept Terms & Conditions
              </label>
            </div>
            {errors.acceptTerms && (
              <p className="text-red-500 text-sm mb-1">{errors.acceptTerms.message}</p>
            )}

            {/* Register Button */}
            <button
              type="submit"
              className="w-full bg-blue-800 text-white py-2 rounded-md hover:bg-blue-900"
            >
              Register
            </button>
          </form>

          <p className="text-center text-sm text-gray-600">
            Already have an account?{" "}
            <Link to="/login" className="text-blue-800 font-medium hover:underline">
              Login
            </Link>
          </p>
        </div>
      </div>

    </>
  );
};
export default Register;
