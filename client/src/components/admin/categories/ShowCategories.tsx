import {
  useState,
} from "react";

import type { ColumnDef, SortingState } from "@tanstack/react-table";
import { DataTable } from "@/components/ui/data-table";
import { Switch } from "@/components/ui/switch";


import { format } from "date-fns";
import {
  ArrowDownIcon,
  ArrowUpIcon,
  BadgeMinus,
  CheckCircle2,
} from "lucide-react";
import { toast } from "sonner";
import { axiosPrivate } from "@/axios/axios";
import { d, e } from "@/components/utils/crypto";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import EncryptedImage from "@/components/EncryptedImage";

type Category = {
  isApproved: boolean;
  id: number;
  name: string;
  createdOn: Date;
  updatedOn: Date;
  coverImage: string;
};

export const ShowCategories = () => {
  const queryClient = useQueryClient();

  const [pageIndex, setPageIndex] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [search, setSearch] = useState("");
  const [sorting, setSorting] = useState<SortingState>([
    { id: "name", desc: false },
  ]);

  // ✅ Fetch categories using TanStack Query
  const {
    data,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["categories", pageIndex, pageSize, sorting, search],
    queryFn: async () => {
      const params = {
        page: pageIndex,
        size: pageSize,
        search,
        sort: sorting.map((s) => ({
          field: s.id,
          direction: s.desc ? "desc" : "asc",
        })),
      };

      try {
        const encParams = await e(JSON.stringify(params));
        const res = await axiosPrivate.post(`/api/admin/get-categories`, encParams);
        return JSON.parse(await d(res.data));
      } catch (error) {
        toast("Error!", {
          description: "Something went wrong while fetching categories.",
          icon: <BadgeMinus className="text-red-600 w-4 h-4" />,
        });
        throw error;
      }
    },
  });

  const columns: ColumnDef<Category>[] = [
    {
      header: "ID",
      cell: ({ row }) => row.index + 1 + pageIndex * pageSize,
    },
    {
      accessorKey: "name",
      header: ({ column }) => (
        <button
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="flex items-center space-x-1"
        >
          <span>Name</span>
          {column.getIsSorted() === "asc" && <ArrowUpIcon className="w-3 h-3" />}
          {column.getIsSorted() === "desc" && <ArrowDownIcon className="w-3 h-3" />}
        </button>
      ),
    },
    {
      accessorKey: "updatedOn",
      header: "Updated On",
      cell: ({ row }) =>
        row.original.updatedOn
          ? format(new Date(row.original.updatedOn), "dd,MMM yyyy HH:mm")
          : "-",
    },
    {
      accessorKey: "createdOn",
      header: ({ column }) => (
        <button
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="flex items-center space-x-1"
        >
          <span>Created On</span>
          {column.getIsSorted() === "asc" && <ArrowUpIcon className="w-3 h-3" />}
          {column.getIsSorted() === "desc" && <ArrowDownIcon className="w-3 h-3" />}
        </button>
      ),
      cell: ({ row }) =>
        row.original.createdOn
          ? format(new Date(row.original.createdOn), "dd,MMM yyyy HH:mm")
          : "-",
    },
    {
      id: "status",
      header: "Status",
      cell: ({ row }) => {
        const category = row.original;
        const [isApproved, setIsApproved] = useState(category.isApproved);

        const handleToggle = async (checked: boolean) => {
          try {
            const encParams = await e(JSON.stringify({ id: category.id }));
            const formData = new FormData();
            formData.append("data", encParams);

            const response = await axiosPrivate.post(
              "/api/admin/update-category-status",
              formData
            );

            const message = JSON.parse(await d(response?.data?.message));

            if (message === "Category Status Updated Successfully.") {
              setIsApproved(checked);
              toast(
                `${category.name} ${checked ? "enabled" : "disabled"} successfully.`,
                {
                  icon: (
                    <CheckCircle2
                      className={`w-4 h-4 ${checked ? "text-green-600" : "text-red-600"}`}
                    />
                  ),
                }
              );
              queryClient.invalidateQueries({ queryKey: ["categories"] });
            } else {
              toast.success(message);
            }
          } catch (error) {
            toast.error("Failed to update status");
          }
        };

        return <Switch checked={isApproved} onCheckedChange={handleToggle} title={isApproved ? "True" : "False"}
          className={`!rounded-full ${isApproved
            ? "bg-green-500 data-[state=checked]:bg-green-500"
            : "bg-gray-300 data-[state=unchecked]:bg-gray-300"
            }`} />;
      },
    },
    {
      accessorKey: "coverImage",
      header: "Cover Image",
      cell: ({ row }) => <EncryptedImage imagePath={row.original.coverImage} />,
    },
  ];

  if (isLoading) return <p>Loading...</p>;
  if (isError) return <p>Failed to load categories</p>;

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4 text-[#2b5f60]">Categories</h2>
      <DataTable
        columns={columns}
        data={data?.content ?? []}
        pageCount={Math.ceil((data?.totalElements ?? 0) / pageSize)}
        total={data?.totalElements ?? 0}
        pageIndex={pageIndex}
        pageSize={pageSize}
        search={search}
        setSearch={setSearch}
        setPageIndex={setPageIndex}
        setPageSize={setPageSize}
        sorting={sorting}
        setSorting={setSorting}
      />
    </div>
  );
};


export default ShowCategories;
