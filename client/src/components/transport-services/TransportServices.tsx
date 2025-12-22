import { useEffect, useState } from "react";
import clsx from "clsx";
import scss from "./transport-services.module.scss";


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
import { Button } from "../ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";

export interface TransportServiceRow {
    uuid: string;
    name: string;
    contact: string;
    email: string;
    location: string;
    district: string;
    registrationDetail: string;
}

export interface Vehicle {
    uuid: string;
    vehicleNumber: string;
    vehicleType: string;
    capacity: number;
    rate: string;
}



const TransportServices = () => {
    const [data, setData] = useState<TransportServiceRow[]>([]);
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

    const [open, setOpen] = useState(false);
    const [selectedId, setSelectedId] = useState<string | null>(null);
    const [details, setDetails] = useState<any>(null);
    const [loading, setLoading] = useState(false);


    const openDetailsModal = async (row: TransportServiceRow) => {
        setOpen(true);
        setSelectedId(row.uuid);
        setLoading(true);
        setDetails(null);

        try {
            const res = await axiosInstance.get(`/api/transport-service/${row.uuid}`);
            const data = JSON.parse(await d(res.data));
            setDetails(data);
        } catch (err) {
            console.error(err);
            toast.error("Failed to load details");
            setOpen(false);
        } finally {
            setLoading(false);
        }
    };


    const fetchTransportServices = async () => {
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
            const res = await axiosInstance.post(`/api/transport-service/get-services`, encParams);

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
                `/api/transport-service/get-districts`,
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
        fetchTransportServices();
    }, [pageIndex, pageSize, sorting, search, state, district]);

    const columns: ColumnDef<TransportServiceRow>[] = [
        {
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
            header: "Phone No(s)",
            accessorKey: "contact",
            cell: ({ row }) => (
                <a
                    href={`tel:${row.original.contact}`}
                    className="text-blue-600 hover:underline"
                >
                    {row.original.contact}
                </a>
            ),
            meta: {
                className: "whitespace-normal break-words",
            },
        },
        {
            accessorKey: "email",
            header: "Email ID(s)",
            cell: ({ row }) => (
                <a
                    href={`mailto:${row.original.email}`}
                    className="text-blue-600 hover:underline"
                >
                    {row.original.email}
                </a>
            ),
            meta: {
                className: "whitespace-normal break-words",
            },
        },
        // {
        //     accessorKey: "registrationDetail",
        //     header: "Registration Details",
        //     meta: {
        //         className: "whitespace-normal break-words",
        //     },
        // },
        {
            accessorKey: "location",
            header: "Location",
            meta: {
                className: "whitespace-normal break-words",
            },
        },
        {
            accessorKey: "district",
            header: "District",
        },
        {
            id: "actions",
            header: "Details",
            cell: ({ row }) => (
                <Button
                    onClick={() => openDetailsModal(row.original)}
                    className="cursor-pointer bg-blue-600 hover:bg-blue-700"
                >
                    View
                </Button>
            ),
        }

    ];

    return (
        <>
            <DocumentTitle title="Transport Services" />
            <div className={clsx(scss.travelag_div)}>
                <div className={clsx(scss.banner)}>
                    <img
                        src={`${import.meta.env.VITE_BASE}assets/images/transport-services.jpg`}
                        alt="Banner"
                        className={clsx(
                            scss.banner_image,
                            "w-full max-h-screen object-cover "
                        )}
                    />
                    <h2 className="text-shadow-2xs z-2">Transport Services</h2>
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
                <Dialog open={open} onOpenChange={setOpen}>
                    <DialogContent className=" !max-w-4xl ">
                        <DialogHeader>
                            <DialogTitle>Transport Service Details</DialogTitle>
                        </DialogHeader>

                        {loading && (
                            <div className="py-6 text-center">Loading details...</div>
                        )}

                        {!loading && details && (
                            <div className="space-y-6 max-h-[calc(100vh-10rem)] overflow-y-auto">

                                {/* ================= Transport Service Info ================= */}
                                <div className="rounded-lg border p-4">

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                                        <Info label="Name" value={details.name} />
                                        <Info label="Phone" value={details.contact} />
                                        <Info label="Email" value={details.email} />
                                        <Info label="District" value={details.district} />
                                        <Info label="Location" value={details.location} />
                                        <Info label="Registration" value={details.registrationDetail} />
                                    </div>
                                </div>

                                {/* ================= Vehicles ================= */}
                                <div className="rounded-lg border p-4">
                                    <h3 className="text-base font-semibold mb-3">
                                        Vehicles ({details.vehicles.length})
                                    </h3>

                                    {details.vehicles.length === 0 ? (
                                        <p className="text-sm text-muted-foreground">
                                            No vehicles available
                                        </p>
                                    ) : (
                                        <div className="space-y-3">
                                            {details.vehicles.map((v: Vehicle) => (
                                                <div
                                                    key={v.uuid}
                                                    className="grid grid-cols-2 sm:grid-cols-4 gap-3 rounded-md border p-3 text-sm"
                                                >
                                                    <Info label="Vehicle No" value={v.vehicleNumber || "-"} />
                                                    <Info label="Type" value={v.vehicleType} />
                                                    <Info label="Capacity" value={v.capacity?.toString()} />
                                                    <Info label="Rate" value={`₹ ${v.rate}`} />
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}

                    </DialogContent>
                </Dialog>


                <FooterLogos />
            </div>
        </>
    );
}

type InfoProps = {
    label: string;
    value?: string;
};

const Info: React.FC<InfoProps> = ({ label, value }) => (
    <div>
        <p className="text-xs text-muted-foreground">{label}</p>
        <p className="font-medium">{value || "-"}</p>
    </div>
);

export default TransportServices