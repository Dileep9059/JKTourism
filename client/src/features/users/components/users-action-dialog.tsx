"use client";

import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Input } from "@/components/ui/input";
import { PasswordInput } from "@/components/password-input";
import { SelectDropdown } from "@/components/select-dropdown";
import { userTypes } from "../data/data";
import { type User } from "../data/schema";
import axios, { axiosPrivate } from "@/axios/axios";
import { useEffect, useState } from "react";
import { d, e } from "@/components/utils/crypto";
import { toast } from "sonner";

const formSchema = z
  .object({
    district: z.string(),
    tehsil: z.string(),
    village: z.string(),
    username: z.string().min(1, "Username is required."),
    firstname: z.string().min(1, "First Name is required."),
    middlename: z.string(),
    lastname: z.string().min(1, "Last Name is required."),
    mobile: z.string().min(1, "Mobile number is required.").max(10),
    email: z
      .string()
      .min(1, "Email is required.")
      .email("Invalid email address."),
    password: z.string().transform((pwd) => pwd.trim()),
    confirmpassword: z.string().transform((pwd) => pwd.trim()),
    role: z.string().min(1, "Role is required."),
    isEdit: z.boolean(),
  })
  .superRefine((data, ctx) => {
    const { isEdit, password, confirmpassword, role, district, tehsil, village } = data;

    // Password required if not editing
    if (!isEdit && password.trim().length === 0) {
      ctx.addIssue({
        path: ["password"],
        code: z.ZodIssueCode.custom,
        message: "Password is required.",
      });
    }

    // Password length
    if (!isEdit || password.trim().length > 0) {
      if (password.length < 8) {
        ctx.addIssue({
          path: ["password"],
          code: z.ZodIssueCode.custom,
          message: "Password must be at least 8 characters long.",
        });
      }

      if (!/[a-z]/.test(password)) {
        ctx.addIssue({
          path: ["password"],
          code: z.ZodIssueCode.custom,
          message: "Password must contain at least one lowercase letter.",
        });
      }

      if (!/\d/.test(password)) {
        ctx.addIssue({
          path: ["password"],
          code: z.ZodIssueCode.custom,
          message: "Password must contain at least one number.",
        });
      }

      if (password !== confirmpassword) {
        ctx.addIssue({
          path: ["confirmpassword"],
          code: z.ZodIssueCode.custom,
          message: "Passwords don't match.",
        });
      }
    }

    // Role-based validation for district, tehsil, and village
    if (role === "PATWARI") {
      // For Patwari, district, tehsil, and village are mandatory
      if (district.trim().length === 0) {
        ctx.addIssue({
          path: ["district"],
          code: z.ZodIssueCode.custom,
          message: "District is required for Patwari.",
        });
      }

      if (tehsil.trim().length === 0) {
        ctx.addIssue({
          path: ["tehsil"],
          code: z.ZodIssueCode.custom,
          message: "Tehsil is required for Patwari.",
        });
      }

      if (village.trim().length === 0) {
        ctx.addIssue({
          path: ["village"],
          code: z.ZodIssueCode.custom,
          message: "Village is required for Patwari.",
        });
      }
    } else if (role === "TEHSILDAR" || role === "NAIB_TEHSILDAR") {
      // For Tehsildar and Naib Tehsildar, only district and tehsil are mandatory
      if (district.trim().length === 0) {
        ctx.addIssue({
          path: ["district"],
          code: z.ZodIssueCode.custom,
          message: "District is required for Tehsildar/Naib Tehsildar.",
        });
      }

      if (tehsil.trim().length === 0) {
        ctx.addIssue({
          path: ["tehsil"],
          code: z.ZodIssueCode.custom,
          message: "Tehsil is required for Tehsildar/Naib Tehsildar.",
        });
      }
    } else if (role === "DISTRICT_ADMIN") {
      // For District Admin, only district is mandatory
      if (district.trim().length === 0) {
        ctx.addIssue({
          path: ["district"],
          code: z.ZodIssueCode.custom,
          message: "District is required for District Admin.",
        });
      }
    }

  });


type UserForm = z.infer<typeof formSchema>;

interface Props {
  currentRow?: User;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

//const errRef = useRef<HTMLParagraphElement>(null);


export function UsersActionDialog({ currentRow, open, onOpenChange }: Props) {
  const isEdit = !!currentRow;
  const form = useForm<UserForm>({
    resolver: zodResolver(formSchema),
    defaultValues: isEdit
      ? {
        ...currentRow,
        password: "",
        confirmpassword: "",
        isEdit,
      }
      : {
        district: "",
        tehsil: "",
        village: "",
        username: "",
        firstname: "",
        middlename: "",
        lastname: "",
        email: "",
        role: "",
        mobile: "",
        password: "",
        confirmpassword: "",
        isEdit,
      },
  });

  // const onSubmit = (values: UserForm) => {
  //   form.reset();
  //   showSubmittedData(values);
  //   onOpenChange(false);
  // };

  const isPasswordTouched = !!form.formState.dirtyFields.password;

  const [districts, setDistricts] = useState([]);

  const [tehsils, setTehsils] = useState([]);

  const [villages, setVillage] = useState([]);

  const [selectedRole, setSelectedRole] = useState("");


  const fetchDistricts = async () => {
    try {
      const response = await axiosPrivate.post("/api/v1/get-districts");
      if (response?.status === 200) {

        const result = JSON.parse(await d(response.data))
        //   console.log(result)
        setDistricts(result); // assuming response.data is an array
      }
    } catch (error) {
      console.error("Failed to fetch districts:", error);
    }
  };

  useEffect(() => {

    fetchDistricts();
  }, []);

  const fetchTehsil = async (disrictId: string) => {
    try {
      const param = {
        district: disrictId
      }
      const response = await axiosPrivate.post("/api/v1/get-tehsil-by-district", await e(param));
      if (response?.status === 200) {

        const result = JSON.parse(await d(response.data))
        //   console.log(result)
        setTehsils(result); // assuming response.data is an array
      }
    } catch (error) {
      console.error("Failed to fetch Tehsil:", error);
    }
  };

  const fetchVillage = async (tehsilId: string) => {
    try {
      const param = {
        tehsil: tehsilId
      }

      // console.log(param)
      const response = await axiosPrivate.post("/api/v1/get-village-by-tehsil", await e(param));
      if (response?.status === 200) {

        const result = JSON.parse(await d(response.data))
        // console.log('village', result)
        setVillage(result); // assuming response.data is an array
      }
    } catch (error) {
      console.error("Failed to fetch Village:", error);
    }
  };

  const saveUser = async (data: UserForm) => {
    try {
      const formData = {
        ...data,
        role: [data.role],
      };
      const response = await axios.post(
        "/api/auth/signup",
        await e(JSON.stringify(formData)),
        {
          headers: { "Content-Type": "text/plain" },
          withCredentials: true,
        }
      );
      if (response.data && response.data.message) {
        toast.success(JSON.parse(await d(response.data.message)));
        form.reset();
        onOpenChange(false);
      } else {
        toast.error("Something went wrong. Please try again.");
      }
    } catch (error: any) {
      if (error?.response && error?.response?.status === 429) {
        toast.error(error?.response?.data);
      } else {
        toast.error("Something went wrong. Please try again.");
      }
    }
  };




  return (
    <Dialog
      open={open}
      onOpenChange={(state) => {
        form.reset();
        onOpenChange(state);
      }}
    >
      <DialogContent className="sm:max-w-lg">
        <DialogHeader className="text-left">
          <DialogTitle>{isEdit ? "Edit User" : "Add New User"}</DialogTitle>
          <DialogDescription>
            {isEdit ? "Update the user here." : "Add new user here."}
          </DialogDescription>
        </DialogHeader>

        <div className="h-[26.25rem] w-full overflow-y-auto py-1 pr-4">
          <Form {...form}>
            <form
              id="user-form"
              onSubmit={form.handleSubmit(saveUser)}
              className="space-y-4 p-2 sm:p-4"  // Adjust padding for mobile screens
            >
              {/* Role Dropdown */}
              <FormField
                control={form.control}
                name="role"
                render={({ field }) => (
                  <FormItem className="grid grid-cols-6 items-center gap-x-4 gap-y-2 sm:gap-y-4">
                    <FormLabel className="col-span-2 text-right">Role</FormLabel>
                    <FormControl>
                      <SelectDropdown
                        defaultValue={field.value}
                        onValueChange={(val) => {
                          field.onChange(val);
                          setSelectedRole(val);
                        }}
                        placeholder="Select a role"
                        className="col-span-4 w-auto"
                        items={userTypes.map(({ label, value }) => ({ label, value }))}
                      />
                    </FormControl>
                    <FormMessage className="col-span-4 col-start-3" />
                  </FormItem>
                )}
              />

              {/* Conditional Dropdowns (District, Tehsil, Village) */}
              {(selectedRole === "DISTRICT_ADMIN" || selectedRole === "TEHSILDAR" || selectedRole === "NAIB_TEHSILDAR" || selectedRole === "PATWARI") && (
                <FormField
                  control={form.control}
                  name="district"
                  render={({ field }) => (
                    <FormItem className="grid grid-cols-6 items-center gap-x-4 gap-y-2 sm:gap-y-4">
                      <FormLabel className="col-span-2 text-right">District</FormLabel>
                      <FormControl >
                        <Select
                          onValueChange={(value) => {
                            field.onChange(value);
                            fetchTehsil(value);
                            setTehsils([]);
                            setVillage([]);
                          }}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger className="col-span-4 w-auto">
                              <SelectValue placeholder="Select District" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {districts?.map((district, index) => (
                              <SelectItem key={index} value={district.distId.toString()}>
                                {district.distNameE} / {district.distNameU}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage className="col-span-4 col-start-3" />
                    </FormItem>
                  )}
                />
              )}

              {(selectedRole === "TEHSILDAR" || selectedRole === "NAIB_TEHSILDAR" || selectedRole === "PATWARI") && (
                <FormField
                  control={form.control}
                  name="tehsil"
                  render={({ field }) => (
                    <FormItem className="grid grid-cols-6 items-center gap-x-4 gap-y-2 sm:gap-y-4">
                      <FormLabel className="col-span-2 text-right">Tehsil</FormLabel>
                      <FormControl>
                        <Select
                          onValueChange={(value) => {
                            field.onChange(value);
                            fetchVillage(value);
                            setVillage([]);
                          }}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger className="col-span-4 w-auto">
                              <SelectValue placeholder="Select Tehsil" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {tehsils?.map((tehsil, index) => (
                              <SelectItem key={index} value={tehsil.tehId.toString()}>
                                {tehsil.tehNameE} / {tehsil.tehNameU}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage className="col-span-4 col-start-3" />
                    </FormItem>
                  )}
                />
              )}

              {(selectedRole === "PATWARI") && (
                <FormField
                  control={form.control}
                  name="village"
                  render={({ field }) => (
                    <FormItem className="grid grid-cols-6 items-center gap-x-4 gap-y-2 sm:gap-y-4">
                      <FormLabel className="col-span-2 text-right">Village</FormLabel>
                      <FormControl>
                        <Select onValueChange={(value) => field.onChange(value)} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger className="col-span-4 w-auto">
                              <SelectValue placeholder="Select Village" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {villages?.map((vill, index) => (
                              <SelectItem key={index} value={vill.villId.toString()}>
                                {vill.villNameE} / {vill.villNameU}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage className="col-span-4 col-start-3" />
                    </FormItem>
                  )}
                />
              )}

              {/* Other Fields */}
              {[
                { name: "username", placeholder: "teh_tehsil" },
                { name: "firstname", placeholder: "John" },
                { name: "middlename", placeholder: "teh_tehsil" },
                { name: "lastname", placeholder: "Doe" },
                { name: "email", placeholder: "john.doe@gmail.com" },
                { name: "mobile", placeholder: "9874563215", maxLength: 10 },
              ].map(({ name, placeholder, maxLength }, idx) => (
                <FormField
                  key={idx}
                  control={form.control}
                  name={name}
                  render={({ field }) => (
                    <FormItem className="grid grid-cols-6 items-center gap-x-4 gap-y-2 sm:gap-y-4">
                      <FormLabel className="col-span-2 text-right">{name.charAt(0).toUpperCase() + name.slice(1)}</FormLabel>
                      <FormControl>
                        <Input
                          placeholder={placeholder}
                          className="col-span-4"
                          autoComplete="off"
                          maxLength={maxLength}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage className="col-span-4 col-start-3" />
                    </FormItem>
                  )}
                />
              ))}

              {/* Password Fields */}
              {[
                { name: "password", placeholder: "e.g., S3cur3P@ssw0rd" },
                { name: "confirmpassword", placeholder: "e.g., S3cur3P@ssw0rd", disabled: !isPasswordTouched },
              ].map(({ name, placeholder, disabled }, idx) => (
                <FormField
                  key={idx}
                  control={form.control}
                  name={name}
                  render={({ field }) => (
                    <FormItem className="grid grid-cols-6 items-center gap-x-4 gap-y-2 sm:gap-y-4">
                      <FormLabel className="col-span-2 text-right">{name.charAt(0).toUpperCase() + name.slice(1)}</FormLabel>
                      <FormControl>
                        <PasswordInput
                          placeholder={placeholder}
                          disabled={disabled}
                          className="col-span-4"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage className="col-span-4 col-start-3" />
                    </FormItem>
                  )}
                />
              ))}

              <DialogFooter>
                <Button type="submit" form="user-form" className="w-full sm:w-auto">
                  {isEdit ? "Update User" : "Add User"}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </div>
      </DialogContent>
    </Dialog>

  );
}
