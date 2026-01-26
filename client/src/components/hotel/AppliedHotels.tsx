import { useEffect, useState } from 'react'
import DocumentTitle from '../DocumentTitle'
import type { ColumnDef, SortingState } from '@tanstack/react-table';
import { axiosPrivate } from '@/axios/axios';
import { d, e } from '../utils/crypto';
import { toast } from 'sonner';
import { DataTable } from '../ui/data-table';
import { ArrowDownIcon, ArrowUpIcon } from 'lucide-react';

const AppliedHotels = () => {

    const [appliedHotels, setAppliedHotels] = useState([]);

    const [pageIndex, setPageIndex] = useState(0);
    const [pageSize, setPageSize] = useState(10);
    const [totalCount, setTotalCount] = useState(0);
    const [search, setSearch] = useState("");

    const [sorting, setSorting] = useState<SortingState>([
        { id: "name", desc: false },
    ]);

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
            const encParams = await e(JSON.stringify(params));
            const res = await axiosPrivate.post(`/api/home-stay/get-home-stays`, encParams);

            const json = JSON.parse(await d(res.data));

            setAppliedHotels(json.content);
            setTotalCount(json.totalElements);
        } catch (error) {
            toast("Something went wrong while fetching hotels.");
        }

    }

    const columns: ColumnDef<any>[] = [
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
                    <span>Unit Name</span>
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
        {
            accessorKey: "address",
            header: "Address",
        },
        {
            accessorKey: "district",
            header: "District",
        },
    ];

    useEffect(() => {
        fetchAppliedHotels();
    }, []);

    return (
        <>
            <DocumentTitle title="Applied Hotels" />

            <DataTable
                columns={columns}
                data={appliedHotels}
                search={search}
                setSearch={setSearch}
                pageIndex={pageIndex}
                setPageIndex={setPageIndex}
                pageSize={pageSize}
                setPageSize={setPageSize}
                totalCount={totalCount}
                sorting={sorting}
                setSorting={setSorting}
            />

        </>
    )
}

export default AppliedHotels