import { useEffect, useState } from "react";

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
import EncryptedImage from "@/components/EncryptedImage";
import { axiosPrivate } from "@/axios/axios";
import { e, d } from "@/components/utils/crypto";

type FeedbackData = {
  id: number;
  active: boolean;
  name: string;
  content: string;
  createdon: Date;
  updatedon: Date;
  image: string;
};

const Feedbacks = () => {
  const [data, setData] = useState<FeedbackData[]>([]);
  const [pageIndex, setPageIndex] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [totalCount, setTotalCount] = useState(0);
  const [search, setSearch] = useState("");

  const [sorting, setSorting] = useState<SortingState>([
    { id: "name", desc: false },
  ]);

  const columns: ColumnDef<FeedbackData>[] = [
    {
      // accessorKey: "id",
      header: "S.No.",
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
          {column.getIsSorted() === "asc" && (
            <ArrowUpIcon className="w-3 h-3" />
          )}
          {column.getIsSorted() === "desc" && (
            <ArrowDownIcon className="w-3 h-3" />
          )}
        </button>
      ),
      enableSorting: true,
    },
    {
      accessorKey: "content",
      header: "Content",
      cell: ({ row }) => (
        <div className="whitespace-normal break-words max-w-auto">
          {row.original.content || "-"}
        </div>
      ),
    },
    {
      accessorKey: "createdon",
      header: "Created On",
      cell: ({ row }) => {
        const date = row.original.createdon;
        return date ? format(new Date(date), "dd,MMM yyyy") : "-";
      },
    },
    {
      accessorKey: "updatedon",
      header: "Updated On",
      cell: ({ row }) => {
        const date = row.original.updatedon;
        return date ? format(new Date(date), "dd,MMM yyyy") : "-";
      },
    },

    {
      id: "active",
      header: "Status",
      cell: ({ row }) => {
        const dest = row.original;

        const [isApproved, setIsApproved] = useState(dest.active);
        const handleToggle = async (checked: boolean) => {
          try {
            const params = {
              id: dest.id,
            };

            const encParams = await e(JSON.stringify(params));

            const response = await axiosPrivate.post(
              "/api/feedback/update-feedback-status",
              {
                data: encParams,
              }
            );
            console.log(response);
            const message = JSON.parse(await d(response?.data));
            if (response?.status === 200) {
              setIsApproved(checked);
              toast(message, {
                icon: checked ? (
                  <CheckCircle2 className="text-green-600 w-4 h-4" />
                ) : (
                  <CheckCircle2 className="text-red-600 w-4 h-4" />
                ),
              });
            }
          } catch (error) {
            toast.error("Failed to update status");
          }
        };

        return <Switch checked={isApproved} onCheckedChange={handleToggle} />;
      },
    },

    {
      accessorKey: "image",
      header: "Cover Image",
      cell: ({ row }) => {
        return <EncryptedImage imagePath={row.original.image} />;
      },
    },
  ];

  const fetchFeedbacks = async () => {
    const params = {
      page: pageIndex,
      size: pageSize,
      sort: sorting.map((s) => ({
        field: s.id,
        direction: s.desc ? "desc" : "asc",
      })),
    };

    try {
      const encParams = await e(JSON.stringify(params));
      const res = await axiosPrivate.post(`/api/feedback/get-feedbacks`, encParams);

      const json = JSON.parse(await d(res.data));

      setData(json.content);
      setTotalCount(json.totalElements);
    } catch (error) {
      toast("Error!", {
        description: "Something went wrong while fetching categories.",
        icon: <BadgeMinus className="text-red-600 w-4 h-4" />,
      });
    }
  };

  useEffect(() => {
    fetchFeedbacks();
  }, [pageIndex, pageSize, sorting, search]);

  return (
    <>
      <div className="p-4">
        <h2 className="text-2xl font-bold mb-4 text-[#2b5f60]">Feedbacks</h2>
        <DataTable
          columns={columns}
          data={data}
          pageCount={Math.ceil(totalCount / pageSize)}
          total={totalCount}
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
    </>
  );
};

export default Feedbacks;
