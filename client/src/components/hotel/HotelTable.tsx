import type { ColumnDef, SortingState } from '@tanstack/react-table';
import { axiosPrivate } from '@/axios/axios';
import { d, e } from '../utils/crypto';
import { toast } from 'sonner';
import { DataTable } from '../ui/data-table';
import { useEffect, useState } from 'react'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '../ui/dialog';
import { Button } from '../ui/button';

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

    const [selectedHotelId, setSelectedHotelId] = useState<string | null>(null);
    const [hotelDetails, setHotelDetails] = useState<any>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [loadingDetails, setLoadingDetails] = useState(false);


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
        setSelectedHotelId(hotel.hotelId);
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
                <DialogContent className="max-w-2xl">
                    <DialogHeader>
                        <DialogTitle>Hotel Details</DialogTitle>
                        <DialogDescription>
                            View submitted details for the hotel.
                        </DialogDescription>
                    </DialogHeader>

                    {loadingDetails ? (
                        <div className="text-center py-8">Loading...</div>
                    ) : hotelDetails ? (
                        <div className="space-y-2">
                            <div><strong>Display Name:</strong> {hotelDetails.displayName}</div>
                            <div><strong>Legal Name:</strong> {hotelDetails.legalName}</div>
                            <div><strong>Owner Name:</strong> {hotelDetails.ownerName}</div>
                            <div><strong>Owner Email:</strong> {hotelDetails.ownerEmail}</div>
                            <div><strong>Owner Mobile:</strong> {hotelDetails.ownerMobile}</div>
                            <div><strong>City:</strong> {hotelDetails.city}</div>
                            <div><strong>District:</strong> {hotelDetails.district}</div>
                            <div><strong>Status:</strong> {hotelDetails.status}</div>
                            <div><strong>Submitted At:</strong> {hotelDetails.submittedAt}</div>
                            {/* Add any additional fields returned by your API here */}
                        </div>
                    ) : (
                        <div className="text-center py-8">No details available.</div>
                    )}

                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsModalOpen(false)}>Close</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

        </div>
    )
}

export default HotelTable