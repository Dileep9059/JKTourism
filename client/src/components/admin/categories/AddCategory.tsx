import { motion } from "framer-motion";

import React, { useRef, useState } from "react";

import {
  Upload,
  Plus,
} from "lucide-react";

import { toast } from "sonner";
import { axiosPrivate } from "@/axios/axios";
import { e } from "@/components/utils/crypto";
import { useMutation } from "@tanstack/react-query";

interface AddCategoriesProps {
  onSuccess?: () => void;
}

const AddCategory = ({ onSuccess }: AddCategoriesProps) => {
  const categoryRef = useRef<HTMLInputElement>(null);
  const categoryFileRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);


  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
    }
  };

  const { mutate, isPending } = useMutation({
    mutationFn: async (data: FormData) => {
      return await axiosPrivate.post("/api/admin/add-category", data);
      // return axiosPrivate.post('/api/categories', newCategory)
    },
    onSuccess: () => {
      onSuccess?.();
      categoryRef.current!.value = ""; // Clear the input field after successful addition
      setFile(null);
    },
  })

  const handleAddCategory = async () => {
    const categoryName = categoryRef.current?.value;
    if (!categoryName) {
      toast.error("Category name cannot be empty.");
      return;
    }

    // do not allow empty spaces in category name
    if (categoryName && categoryName.trim() === "") {
      toast.error("Category name cannot be empty.");
      return;
    }
    // do not allow special characters and numbers in category name
    if (categoryName && /\d/.test(categoryName)) {
      toast("Category name cannot contain numbers.");
      return;
    }
    if (categoryName && /[!@#$%^&*(),.?":{}|<>]/.test(categoryName)) {
      toast.error("Category name cannot contain special characters.");
      return;
    }
    if (categoryName && categoryName.length < 3) {
      toast.error("Category name must be at least 3 characters long.");
      return;
    }
    if (categoryName && categoryName.length > 50) {
      toast.error("Category name must be less than 20 characters long.");
      return;
    }

    try {
      const encCategory = await e(JSON.stringify(categoryName));

      const formData = new FormData();
      formData.append("data", encCategory);

      if (file) {
        formData.append("file", file);
      }

      mutate(formData);

    } catch (error) {
      toast.error("An error occurred. Please try again.");
    }
  };
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4 }}
      className="w-full mx-auto rounded-2xl border  bg-[#f9f9f9] px-6 py-5 flex flex-col sm:flex-row gap-4 items-center justify-between dark:bg-black dark:text-white"
    >
      {/* Category Name */}
      <input
        ref={categoryRef}
        type="text"
        placeholder="Category Name"
        className="flex-1 w-full rounded-lg border border-[#e1e1e1] bg-[#ffffff] px-4 py-2 text-sm focus:outline-none transition text-foreground placeholder:text-muted-foreground dark:bg-background dark:text-white"
      />

      {/* File Upload */}
      <div className="w-full sm:w-auto flex items-center">
        <label className="flex items-center gap-2 rounded-lg border border-dashed bg-[#2b5f60]/10 border-[#2b5f60] px-4 py-2 text-sm text-black cursor-pointer transition">
          <Upload className="w-4 h-4 text-black dark:text-white" />

          <div className="text-sm text-black truncate max-w-[200px] dark:text-white">
            Upload Image : {file ? file.name : "No file chosen"}
          </div>
          <input
            type="file"
            onChange={handleFileChange}
            className="hidden"
            accept="image/*"
            ref={categoryFileRef}
          />
        </label>
      </div>

      {/* Submit Button */}
      <motion.button
        whileTap={{ scale: 0.97 }}
        whileHover={{ scale: 1.02 }}
        onClick={handleAddCategory}
        className="flex items-center gap-2 bg-[#eecba0] border border-[#eecba0] text-black px-4 py-2 rounded-lg text-sm font-medium shadow-sm hover:border-black hover:bg-black hover:text-white transition"
        disabled={isPending}
      >
        <Plus className="w-4 h-4" />
        {isPending ? 'Adding...' : 'Add Category'}
      </motion.button>
    </motion.div>
  );
};
export default AddCategory;
