import {
    useEffect,
    useState,
} from "react";

import type { ColumnDef, SortingState } from "@tanstack/react-table";
import { DataTable } from "@/components/ui/data-table";
import { Switch } from "@/components/ui/switch";

import { format } from "date-fns";
import { ArrowDownIcon, ArrowUpIcon, BadgeMinus, CheckCircle2, Eye, Pencil } from "lucide-react";
import { toast } from "sonner";
import { axiosPrivate } from "@/axios/axios";
import { d, e } from "@/components/utils/crypto";
import { Link } from "react-router-dom";


type ActivityData = {
    isApproved: boolean;
    id: number;
    title: string;
    urlValue: string;
    createdOn: Date;
    updatedOn: Date;
};

export type activityRef = {
    refetch: () => void;
};

const ShowActivities = () => {
    const [data, setData] = useState<ActivityData[]>([]);
    const [pageIndex, setPageIndex] = useState(0);
    const [pageSize, setPageSize] = useState(10);
    const [totalCount, setTotalCount] = useState(0);
    const [search, setSearch] = useState("");

    const [sorting, setSorting] = useState<SortingState>([
        { id: "title", desc: false },
    ]);

    const fetchActivities = async () => {
        const params = {
            page: pageIndex,
            size: pageSize,
            sort: sorting.map((s) => ({
                field: s.id,
                direction: s.desc ? "desc" : "asc",
            })),
        };

        try {
            const encParams = await e(params);
            const res = await axiosPrivate.post(`/api/admin/get-activities`, encParams);

            const json = JSON.parse(await d(res.data));

            //  console.log(json)
            setData(json.content);
            setTotalCount(json.totalElements);
        } catch (error) {
            toast("Error!", {
                description: "Something went wrong while fetching activities.",
                icon: <BadgeMinus className="text-red-600 w-4 h-4" />,
            });
        }
    };

    useEffect(() => {
        fetchActivities();
    }, [pageIndex, pageSize, sorting, search]);

    const columns: ColumnDef<ActivityData>[] = [
        {
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
            accessorKey: "updatedOn",
            header: "Updated On",
            cell: ({ row }) => {
                const date = row.original.updatedOn;
                return date ? format(new Date(date), "MMM dd, yyyy HH:mm") : "-";
            },
        },
        {
            accessorKey: "createdOn",
            header: ({ column }) => (
                <button
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                    className="flex items-center space-x-1"
                >
                    <span>Created On</span>
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
                return date ? format(new Date(date), "MMM dd, yyyy HH:mm") : "-";
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
                            "/api/admin/update-activity-status",
                            formData
                        );
                        const message = JSON.parse(await d(response?.data?.message));
                        if (message === "Activity Status Updated Successfully.") {
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
            header: "Action",
            cell: ({ row }) => {
                const viewUrl = `/activities/${row.original.urlValue}`
                const editUrl = `activity/${row.original.urlValue}/edit`
                return (
                    <>
                        {/* edit & view icons */}
                        <div className="flex gap-3 items-center">
                            <Link to={editUrl}><Pencil className="text-red-500 h-4 w-4" /></Link>
                            <Link to={viewUrl} target="_blank"><Eye className="text-blue-500" /></Link>
                        </div>
                    </>
                )
            },
        },
    ];

    return (
        <>
            <div className="p-4">
                <h1 className="text-2xl font-bold text-[#2b5f60]">Activities</h1>
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

export default ShowActivities;
