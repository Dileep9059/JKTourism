"use client";
import { useEffect, useState } from "react";
import clsx from "clsx";
import scss from "./travelagent.module.scss";


import type { ColumnDef, SortingState } from "@tanstack/react-table";
import { toast } from "sonner";
import {
    ArrowDownIcon,
    ArrowUpIcon,
    BadgeMinus,
} from "lucide-react";
import { DataTable } from "@/components/ui/data-table";

import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import FooterLogos from "@/components/footer/FooterLogos";
import { d, e } from "../utils/crypto";
import axiosInstance from "@/axios/axios";
import DocumentTitle from "../DocumentTitle";

type destination = {
    id: number;
    name: string;
    properitorName: string;
    district: string;
    contact: string;
};

function TravelAgent() {
    const [data, setData] = useState<destination[]>([]);
    const [pageIndex, setPageIndex] = useState(0);
    const [pageSize, setPageSize] = useState(10);
    const [totalCount, setTotalCount] = useState(0);
    const [search, setSearch] = useState("");
    const [state, setState] = useState("");
    const [district, setDistrict] = useState("");

    const [districts, setDistricts] = useState([]);

    const [sorting, setSorting] = useState<SortingState>([
        { id: "name", desc: false },
    ]);

    const fetchAgents = async () => {
        const params = {
            page: pageIndex,
            size: pageSize,
            search,
            state: state || "",
            district: district || "",
            sort: sorting.map((s) => ({
                field: s.id,
                direction: s.desc ? "desc" : "asc",
            })),
        };

        try {
            const encParams = await e(JSON.stringify(params));
            const res = await axiosInstance.post(`/api/travel-agent/get-agents`, encParams);

            const json = JSON.parse(await d(res.data));

            setData(json.content);
            setTotalCount(json.totalElements);
        } catch (error) {
            toast("Error!", {
                description: "Something went wrong while fetching agents.",
                icon: <BadgeMinus className="text-red-600 w-4 h-4" />,
            });
        }
    };

    const fetchDistrictsForState = async (state: string) => {
        try {
            const params = {
                state: state,
            };
            const res = await axiosInstance.post(
                `/api/travel-agent/get-districts`,
                await e(JSON.stringify(params))
            );
            const json = JSON.parse(await d(res?.data));

            setDistricts(json);
        } catch (error) {
            console.error("Error fetching districts:", error);
            toast("Error!", {
                description: "Something went wrong while fetching districts.",
                icon: <BadgeMinus className="text-red-600 w-4 h-4" />,
            });
        }
    };

    useEffect(() => {
        fetchAgents();
    }, [pageIndex, pageSize, sorting, search, state, district]);

    const columns: ColumnDef<destination>[] = [
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
            accessorKey: "properitorName",
            header: "Properitor Name",
        },
        {
            accessorKey: "district",
            header: "District",
        },
        {
            header: "Phone",
            accessorKey: "contact",
            cell: ({ row }) => (
                <a
                    href={`tel:${row.original.contact}`}
                    className="text-blue-600 hover:underline"
                >
                    {row.original.contact}
                </a>
            ),
        },
    ];

    return (
        <>
            <DocumentTitle title="Travel Agent" />
            <div className={clsx(scss.travelag_div)}>
                <div className={scss.banner}>
                    <img
                        src="/assets/images/travel-agent.jpg"
                        alt="Banner"
                        className={clsx(
                            scss.banner_image,
                            "w-full max-h-screen object-cover"
                        )}
                    />
                    <h2 className="text-shadow-2xs">Explore Registered Travel agent</h2>
                </div>
                <div className={clsx(scss.travel_dropdown, scss.travelcontainer, "container")}>
                    <Select
                        value={state}
                        onValueChange={(value) => {
                            setState(value);
                            setDistrict(""); // reset district
                            setPageIndex(0);
                            fetchDistrictsForState(value); // fetch updated districts
                        }}
                    >
                        <SelectTrigger className="w-[180px] bg-white">
                            <SelectValue placeholder="Select Division" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectGroup>
                                <SelectItem value="jammu">Jammu</SelectItem>
                                <SelectItem value="kashmir">Kashmir</SelectItem>
                            </SelectGroup>
                        </SelectContent>
                    </Select>
                    <Select
                        value={district}
                        onValueChange={(value) => {
                            setDistrict(value);
                            setPageIndex(0);
                        }}
                    >
                        <SelectTrigger className="w-[180px] bg-transparent">
                            <SelectValue placeholder="Select District" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectGroup>
                                {districts.map((district) => (
                                    <SelectItem key={district} value={district} className="focus:bg-white focus:text-black hover:bg-gray-100">
                                        {district}
                                    </SelectItem>
                                ))}
                            </SelectGroup>
                        </SelectContent>
                    </Select>
                </div>
                <div className={clsx(scss.traveltable, scss.travelcontainer, "container")}>
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
                <FooterLogos />
            </div>
        </>
    );
}

export default TravelAgent;