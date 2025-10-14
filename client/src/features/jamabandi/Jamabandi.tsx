
import { useEffect, useState } from "react"
import { jamabandiColumns, type Jamabandi } from "./columns"

import { DataTable } from "./data-table"
import type { ColumnFiltersState, SortingState } from "@tanstack/react-table"
import { axiosPrivate } from "@/axios/axios"
import { d, e } from "@/components/utils/crypto"

import { InnerHeader } from "@/components/layout/structure/InnerHeader"

interface ServerData<T> {
    data: T[];
    total: number;
    filteredTotal: number;
}


async function getJamabandi({
    pageIndex,
    pageSize,
    sorting,
    filters,
    globalFilter,
}: {
    pageIndex: number;
    pageSize: number;
    sorting: SortingState;
    filters: ColumnFiltersState;
    globalFilter: string;
}): Promise<ServerData<Jamabandi>> {
    const params = {
        page: pageIndex,
        size: pageSize,
        sortField: sorting[0]?.id || "id",
        sortDirection: sorting[0]?.desc ? "DESC" : "ASC",
        search: globalFilter || "",
        status: filters.find((f) => f.id === "status")?.value || "",
        draw: 1,
    };

    const res = await axiosPrivate.post(`/api/v1/get-jamabandi`, await e(params));
    const parsed = JSON.parse(await d(res.data))
    // console.log('paresed-data ', parsed)
    return {
        data: parsed.data,
        total: parsed.recordsTotal,
        filteredTotal: parsed.recordsFiltered,
    };
};


export default function Jamabandi() {

    // For server-side
    const [jamabandis, setJamabandis] = useState<Jamabandi[]>([]);
    const [total, setTotal] = useState(0);

    const [pageIndex, setPageIndex] = useState(0);
    const [pageSize, setPageSize] = useState(10);
    const [sorting, setSorting] = useState<SortingState>([]);
    const [filters, setFilters] = useState<ColumnFiltersState>([]);
    const [globalFilter, setGlobalFilter] = useState("");


    // For server-side
    useEffect(() => {
        getJamabandi({ pageIndex, pageSize, sorting, filters, globalFilter })
            .then((res) => {
                setJamabandis(res.data);
                setTotal(res.total);
            })
    }, [pageIndex, pageSize, sorting, filters, globalFilter]);

    return (

        <>
            <InnerHeader fixed />

            <div className="container mx-auto py-10 mt-4">
              <DataTable
                    columns={jamabandiColumns}
                    data={jamabandis}
                    pageCount={Math.ceil(total / pageSize)}
                    totalRows={total}
                    state={{ sorting, columnFilters: filters, globalFilter }}
                    onSortingChange={setSorting}
                    onColumnFiltersChange={setFilters}
                    onGlobalFilterChange={setGlobalFilter}
                    manualPagination
                    manualSorting
                    manualFiltering
                    pageIndex={pageIndex}
                    pageSize={pageSize}
                    onPaginationChange={({ pageIndex, pageSize }) => {
                        setPageIndex(pageIndex);
                        setPageSize(pageSize);
                    }}
                />
            </div>

        </>

    )
}