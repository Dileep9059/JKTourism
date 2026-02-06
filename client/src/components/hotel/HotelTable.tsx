import type { ColumnDef, SortingState } from '@tanstack/react-table';
import { axiosPrivate } from '@/axios/axios';
import { d, e } from '../utils/crypto';
import { toast } from 'sonner';
import { DataTable } from '../ui/data-table';
import { useEffect, useState } from 'react'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '../ui/dialog';
import { Button } from '../ui/button';
import { Accessibility, ArrowUpDown, Bath, Bell, Building2, Car, Cctv, CheckCircle, Coffee, ConciergeBell, Droplets, Flame, HeartPulse, Heater, Home, Layers, Presentation, Refrigerator, Shirt, Snowflake, Sofa, Tv, Users, Utensils, Waves, Wifi, Wind, Wine, Zap } from 'lucide-react';
import { ScrollArea } from '../ui/scroll-area';
import { IconDesk, IconHanger, IconIroning, IconTeapot } from '@tabler/icons-react';
import { Textarea } from '../ui/textarea';

type HotelAdminListType = {
    hotelId: string;
    displayName: string;
    legalName: string;
    ownerName: string;
    ownerMobile: string;
    ownerEmail: string;
    district: string;
    city: string;
    submittedAt: string;
    status: string;
}

const HotelTable = () => {
    const [data, setData] = useState<HotelAdminListType[]>([]);

    const [pageIndex, setPageIndex] = useState(0);
    const [pageSize, setPageSize] = useState(10);
    const [totalCount, setTotalCount] = useState(0);
    const [search, setSearch] = useState("");

    const [sorting, setSorting] = useState<SortingState>([
        { id: "submittedAt", desc: false },
    ]);

    const [hotelDetails, setHotelDetails] = useState<any>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [loadingDetails, setLoadingDetails] = useState(false);

    const [remark, setRemark] = useState("");


    const handleApprove = async () => {
        try {
            const params = {
                hotelId: hotelDetails.hotelId,
            };
            const encParams = await e(params);
            await axiosPrivate.post(`/api/admin/approve-hotel`, encParams);
            toast.success("Hotel approved successfully.");
            fetchAppliedHotels();
            setIsModalOpen(false);
        } catch (error) {
            toast.error("Something went wrong while approving the hotel.");
        }
    };

    const handleReject = async () => {
        try {
            const params = {
                hotelId: hotelDetails.hotelId,
            };
            const encParams = await e(params);
            await axiosPrivate.post(`/api/admin/reject-hotel`, encParams);
            toast.success("Hotel rejected successfully.");
            fetchAppliedHotels();
            setIsModalOpen(false);
        } catch (error) {
            toast.error("Something went wrong while rejecting the hotel.");
        }
    };

    const handleClarify = async () => {
        if (!remark.trim()) {
            toast.error("Please enter a remark.");
            return;
        }

        // await clarifyHotel({
        //     hotelId: hotelDetails.hotelId,
        //     remark
        // });
        setIsModalOpen(false);
    };



    async function fetchAppliedHotels() {
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
            const encParams = await e(params);
            const res = await axiosPrivate.post(`/api/admin/list-hotels`, encParams);

            const json = JSON.parse(await d(res.data));

            setData(json.content);
            setTotalCount(json.totalElements);
        } catch (error) {
            toast.error("Something went wrong while fetching hotels.");
        }

    }

    async function handleViewDetails(hotel: HotelAdminListType) {
        setIsModalOpen(true);
        setLoadingDetails(true);

        try {
            const res = await axiosPrivate.get(`/api/admin/hotel-details/${hotel.hotelId}`);
            setHotelDetails(res.data); // assume API returns full hotel info
        } catch (error) {
            toast.error("Failed to fetch hotel details.");
            setHotelDetails(null);
        } finally {
            setLoadingDetails(false);
        }
    }


    function handleSeekClarification(hotel: HotelAdminListType) {
        // open a modal with a text area to enter clarification request
        console.log("Seeking clarification for hotel:", hotel);
        // You could call your API here
    }


    const columns: ColumnDef<HotelAdminListType>[] = [
        {
            header: "S.No.",
            cell: ({ row }) => row.index + 1 + pageIndex * pageSize,
        },
        {
            accessorKey: "displayName",
            header: "Display Name"
        },
        {
            accessorKey: "legalName",
            header: "Legal Name",
        },
        {
            accessorKey: "ownerName",
            header: "Owner Name",
        },
        {
            accessorKey: "ownerMobile",
            header: "Owner Mobile",
        },
        {
            accessorKey: "ownerEmail",
            header: "Owner Email",
        },
        {
            accessorKey: "city",
            header: "City",
        },
        {
            accessorKey: "district",
            header: "District",
        },
        {
            accessorKey: "status",
            header: "Status",
        },
        {
            accessorKey: "submittedAt",
            header: "Submitted At",
        },
        {
            id: "actions", // id is required if no accessorKey
            header: "Actions",
            cell: ({ row }) => {
                const hotel = row.original;

                return (
                    <div className="flex gap-2">
                        {/* View Details button */}
                        <Button size="sm" onClick={() => handleViewDetails(hotel)}>View Details</Button>

                        {/* Seek Clarification button */}
                        <Button size="sm" variant="secondary" onClick={() => handleSeekClarification(hotel)}>Clarify</Button>
                    </div>
                );
            },
        },
    ];

    useEffect(() => {
        fetchAppliedHotels();
    }, [pageIndex, pageSize, sorting]);
    return (
        <div>
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
            <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                <DialogContent className="!max-w-5xl  max-h-[90vh] ">
                    <DialogHeader>
                        <DialogTitle>Hotel Details</DialogTitle>
                        <DialogDescription>
                            Review all submitted information before approval.
                        </DialogDescription>
                    </DialogHeader>

                    {loadingDetails ? (
                        <div className="text-center py-10">Loading...</div>
                    ) : hotelDetails ? (
                        <ScrollArea className="h-[60vh] pr-5">
                            <div className="space-y-6 text-sm">

                                {/* Basic Header */}
                                <div className="rounded-lg border p-4 bg-muted/30">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <p className="text-muted-foreground">Display Name</p>
                                            <p className="font-medium">{hotelDetails.displayName}</p>
                                        </div>
                                        <div>
                                            <p className="text-muted-foreground">Legal Name</p>
                                            <p className="font-medium">{hotelDetails.legalName}</p>
                                        </div>
                                        <div>
                                            <p className="text-muted-foreground">Status</p>
                                            <p className="font-medium">{hotelDetails.status}</p>
                                        </div>
                                        <div>
                                            <p className="text-muted-foreground">Submitted At</p>
                                            <p className="font-medium">
                                                {new Date(hotelDetails.submittedAt).toLocaleString()}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* Owner Details */}
                                <section>
                                    <h3 className="font-semibold mb-2">Owner Details</h3>
                                    <div className="grid grid-cols-3 gap-4 border rounded-lg p-4">
                                        <div>
                                            <p className="text-muted-foreground">Name</p>
                                            <p>{hotelDetails.owner.name}</p>
                                        </div>
                                        <div>
                                            <p className="text-muted-foreground">Mobile</p>
                                            <p>{hotelDetails.owner.mobile}</p>
                                        </div>
                                        <div>
                                            <p className="text-muted-foreground">Email</p>
                                            <p>{hotelDetails.owner.email}</p>
                                        </div>
                                    </div>
                                </section>

                                {/* Basic Info */}
                                <section>
                                    <h3 className="font-semibold mb-2">Basic Information</h3>
                                    <div className="grid grid-cols-3 gap-4 border rounded-lg p-4">
                                        <div>
                                            <p className="text-muted-foreground">Hotel Type</p>
                                            <p>{hotelDetails.basicInfo.hotelType}</p>
                                        </div>
                                        <div>
                                            <p className="text-muted-foreground">Star Rating</p>
                                            <p>{hotelDetails.basicInfo.starRating} ⭐</p>
                                        </div>
                                        <div>
                                            <p className="text-muted-foreground">Established Year</p>
                                            <p>{hotelDetails.basicInfo.establishedYear}</p>
                                        </div>
                                        <div>
                                            <p className="text-muted-foreground">Website</p>
                                            <a
                                                href={hotelDetails.basicInfo.website}
                                                target="_blank"
                                                className="text-primary underline"
                                            >
                                                Visit
                                            </a>
                                        </div>
                                        <div>
                                            <p className="text-muted-foreground">Email</p>
                                            <p>{hotelDetails.basicInfo.email}</p>
                                        </div>
                                        <div>
                                            <p className="text-muted-foreground">Mobile</p>
                                            <p>{hotelDetails.basicInfo.mobile}</p>
                                        </div>
                                    </div>
                                </section>

                                {/* Location */}
                                <section>
                                    <h3 className="font-semibold mb-2">Location Details</h3>
                                    <div className="grid grid-cols-2 gap-4 border rounded-lg p-4">
                                        <div>
                                            <p className="text-muted-foreground">Address</p>
                                            <p>
                                                {hotelDetails.location.addressLine1},{" "}
                                                {hotelDetails.location.addressLine2}
                                            </p>
                                        </div>
                                        <div>
                                            <p className="text-muted-foreground">Landmark</p>
                                            <p>{hotelDetails.location.landmark}</p>
                                        </div>
                                        <div>
                                            <p className="text-muted-foreground">City / District</p>
                                            <p>
                                                {hotelDetails.location.city}, {hotelDetails.location.district}
                                            </p>
                                        </div>
                                        <div>
                                            <p className="text-muted-foreground">State / Pincode</p>
                                            <p>
                                                {hotelDetails.location.state} - {hotelDetails.location.pincode}
                                            </p>
                                        </div>
                                        <div>
                                            <p className="text-muted-foreground">Coordinates</p>
                                            <p>
                                                {hotelDetails.location.latitude}, {hotelDetails.location.longitude}
                                            </p>
                                        </div>
                                        <div>
                                            <a
                                                href={hotelDetails.location.googleMapsUrl}
                                                target="_blank"
                                                className="text-primary underline"
                                            >
                                                View on Google Maps
                                            </a>
                                        </div>
                                    </div>
                                </section>

                                {/* Property Details */}
                                <section>
                                    <h3 className="font-semibold mb-2">Property Details</h3>
                                    <div className="grid grid-cols-3 gap-4 border rounded-lg p-4">
                                        <div>
                                            <p className="text-muted-foreground">Check-in</p>
                                            <p>{hotelDetails.property.checkInTime}</p>
                                        </div>
                                        <div>
                                            <p className="text-muted-foreground">Check-out</p>
                                            <p>{hotelDetails.property.checkOutTime}</p>
                                        </div>
                                        <div>
                                            <p className="text-muted-foreground">Parking Capacity</p>
                                            <p>{hotelDetails.property.parkingCapacity}</p>
                                        </div>
                                        <div>Lift: {hotelDetails.property.liftAvailable ? "Yes" : "No"}</div>
                                        <div>Power Backup: {hotelDetails.property.powerBackup ? "Yes" : "No"}</div>
                                        <div>
                                            Wheelchair Accessible:{" "}
                                            {hotelDetails.property.wheelchairAccessible ? "Yes" : "No"}
                                        </div>
                                    </div>
                                </section>

                                {/* Amenities */}
                                <section>
                                    <h3 className="font-semibold mb-2">Amenities</h3>

                                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                                        {hotelDetails.amenities.map((amenity: any) => {
                                            const Icon =
                                                amenityIconMap[amenity.icon] || CheckCircle;

                                            return (
                                                <div
                                                    key={amenity.id}
                                                    className="flex items-center gap-3 border rounded-lg p-3 bg-muted/40"
                                                >
                                                    <Icon className="h-5 w-5 text-primary shrink-0" />
                                                    <div>
                                                        <p className="text-sm font-medium">{amenity.name}</p>
                                                        <p className="text-xs text-muted-foreground">
                                                            {amenity.scope}
                                                        </p>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </section>
                                {/* Admin Remark */}
                                <section className="space-y-2">
                                    <h3 className="font-semibold">Admin Remark</h3>

                                    <Textarea
                                        placeholder="Enter clarification..."
                                        value={remark}
                                        onChange={(e) => setRemark(e.target.value)}
                                    />

                                </section>
                                {/* Clarification History */}
                                <section>
                                    <h3 className="font-semibold mb-2">History</h3>

                                    {hotelDetails?.history?.length === 0 ? (
                                        <p className="text-sm text-muted-foreground">
                                            No previous actions recorded.
                                        </p>
                                    ) : (
                                        <div className="space-y-4">
                                            {hotelDetails?.history?.map((item: any) => (
                                                <div
                                                    key={item.id}
                                                    className="border rounded-lg p-3 bg-muted/40"
                                                >
                                                    <div className="flex justify-between">
                                                        <span className="font-medium">
                                                            {item.action.replaceAll("_", " ")}
                                                        </span>
                                                        <span className="text-xs text-muted-foreground">
                                                            {new Date(item.actedAt).toLocaleString()}
                                                        </span>
                                                    </div>

                                                    <p className="text-sm mt-1">{item.comment}</p>

                                                    <p className="text-xs text-muted-foreground mt-1">
                                                        By {item.actedBy}
                                                    </p>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </section>



                            </div>
                        </ScrollArea>
                    ) : (
                        <div className="text-center py-10">No details available.</div>
                    )}

                    <DialogFooter className="mt-4">
                        <Button variant="outline" onClick={() => setIsModalOpen(false)}>
                            Close
                        </Button>
                        {/*  */}
                        {hotelDetails?.status === "SUBMITTED" && (
                            <Button
                                variant="destructive"
                                onClick={() => handleReject()}
                            >
                                Reject
                            </Button>
                        )}
                        {hotelDetails?.status === "SUBMITTED" && (
                            <Button
                                variant="default"
                                onClick={() => handleApprove()}
                            >
                                Approve
                            </Button>
                        )}
                    </DialogFooter>
                </DialogContent>
            </Dialog>


        </div>
    )
}

export default HotelTable

export const amenityIconMap: Record<string, any> = {
    car: Car,
    bell: Bell,
    wifi: Wifi,
    utensils: Utensils,
    wine: Wine,
    waves: Waves,
    "arrow-up-down": ArrowUpDown,
    zap: Zap,
    presentation: Presentation,
    users: Users,
    shirt: Shirt,
    "concierge-bell": ConciergeBell,
    cctv: Cctv,
    accessibility: Accessibility,
    flame: Flame,
    "heart-pulse": HeartPulse,
    snowflake: Snowflake,
    tv: Tv,
    bath: Bath,
    droplets: Droplets,
    wardrobe: IconHanger,
    refrigerator: Refrigerator,
    kettle: IconTeapot,
    coffee: Coffee,
    heater: Heater,
    "building-2": Building2,
    sofa: Sofa,
    wind: Wind,
    lock: Lock,
    iron: IconIroning,
    desk: IconDesk,
    layers: Layers
};
