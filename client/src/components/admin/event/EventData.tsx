import {
    useEffect,
    useState
} from "react";

import type { ColumnDef, SortingState } from "@tanstack/react-table";
import { DataTable } from "@/components/ui/data-table";
import { Switch } from "@/components/ui/switch";


import { format } from "date-fns";
import { ArrowDownIcon, ArrowUpIcon, BadgeMinus, CheckCircle2, IndianRupee } from "lucide-react";
import { toast } from "sonner";
import EncryptedImage from "@/components/EncryptedImage";
import { axiosPrivate } from "@/axios/axios";
import { d, e } from "@/components/utils/crypto";

type EventData = {
    id: number;
    isApproved: boolean;
    title: string;
    startDate: Date;
    startTime: string;
    ticketPrice: number;
    createdOn: Date;
    updatedOn: Date;
    image: string;
};

const EventData = () => {

    const [data, setData] = useState<EventData[]>([]);
    const [pageIndex, setPageIndex] = useState(0);
    const [pageSize, setPageSize] = useState(10);
    const [totalCount, setTotalCount] = useState(0);
    const [search, setSearch] = useState("");

    const [sorting, setSorting] = useState<SortingState>([
        { id: "title", desc: false },
    ]);

    const columns: ColumnDef<EventData>[] = [
        {
            // accessorKey: "id",
            header: "S.No.",
            cell: ({ row }) => row.index + 1 + pageIndex * pageSize,
        },
        {
            accessorKey: "title",
            header: ({ column }) => (
                <button
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                    className="flex items-center space-x-1"
                >
                    <span>Title</span>
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
            accessorKey: "startDate",
            header: "Event Date",
            cell: ({ row }) => {
                const date = row.original.startDate;
                return date ? format(new Date(date), "dd,MMM yyyy") : "-";
            },
        },
        {
            accessorKey: "startTime",
            header: "Event Time",
            cell: ({ row }) => {
                const [hour, minute] = row.original.startTime;
                const date = new Date();
                date.setHours(parseInt(hour), parseInt(minute), 0, 0);

                // Format to hh:mm:ss AM/PM
                const formattedTime = date.toLocaleTimeString('en-US', {
                    hour: '2-digit',
                    minute: '2-digit',
                    second: '2-digit',
                    hour12: true,
                });
                return formattedTime;
            },
        },
        {
            accessorKey: "ticketPrice",
            header: "Ticket Price",
            cell: ({ row }) => {
                const price = row.original.ticketPrice;
                return price === 0 ? (
                    "Free"
                ) : (
                    <div className="flex items-center gap-1">
                        <IndianRupee className="w-3 h-3" />
                        {price}
                    </div>
                );
            },
        },

        {
            id: "status",
            header: "Status",
            cell: ({ row }) => {
                const dest = row.original;
                const [isApproved, setIsApproved] = useState(dest.isApproved);
                const handleToggle = async (checked: boolean) => {
                    try {
                        const encCategoryStatus = await e(
                            JSON.stringify({
                                id: dest.id,
                                isApproved: checked,
                            })
                        );
                        const formData = new FormData();
                        formData.append("data", encCategoryStatus);
                        const response = await axiosPrivate.post(
                            "/api/admin/update-event-status",
                            formData
                        );
                        const message = JSON.parse(await d(response?.data?.message));
                        if (message === "Event Status Updated Successfully.") {
                            setIsApproved(checked);
                            toast(
                                `${dest.title} ${checked ? "enabled" : "disabled"
                                } successfully`,
                                {
                                    icon: checked ? (
                                        <CheckCircle2 className="text-green-600 w-4 h-4" />
                                    ) : (
                                        <CheckCircle2 className="text-red-600 w-4 h-4" />
                                    ),
                                }
                            );
                        } else {
                            toast.success(message);
                        }
                    } catch (error) {
                        toast.error("Failed to update status");
                    }
                };

                return <Switch checked={isApproved} onCheckedChange={handleToggle} className={`!rounded-full ${isApproved
                    ? "bg-green-500 data-[state=checked]:bg-green-500"
                    : "bg-gray-300 data-[state=unchecked]:bg-gray-300"
                    }`} />;
            },
        },

        {
            accessorKey: "image",
            header: "Cover Image",
            cell: ({ row }) => {
                return <EncryptedImage imagePath={row.original.image} />;
            },
        },
        {
            accessorKey: "createdOn",
            header: ({ column }) => (
                <button
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                    className="flex items-center space-x-1"
                >
                    <span>Event Created On</span>
                    {column.getIsSorted() === "asc" && (
                        <ArrowUpIcon className="w-3 h-3" />
                    )}
                    {column.getIsSorted() === "desc" && (
                        <ArrowDownIcon className="w-3 h-3" />
                    )}
                </button>
            ),
            cell: ({ row }) => {
                const date = row.original.createdOn;
                return date ? format(new Date(date), "dd,MMM yyyy HH:mm") : "-";
            },
        },
    ];

    const fetchDestinations = async () => {
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
            const res = await axiosPrivate.post(`/api/admin/get-events`, encParams);

            const json = JSON.parse(await d(res.data));

            setData(json.content);
            setTotalCount(json.totalElements);
        } catch (error) {
            console.log(error)
            toast("Error!", {
                description: "Something went wrong while fetching categories.",
                icon: <BadgeMinus className="text-red-600 w-4 h-4" />,
            });
        }
    };

    useEffect(() => {
        fetchDestinations();
    }, [pageIndex, pageSize, sorting, search]);


    return (
        <>
            <div className="p-4">
                <h2 className="text-2xl font-bold mb-4 text-[#2b5f60]">Events</h2>
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
    )
}


export default EventData;