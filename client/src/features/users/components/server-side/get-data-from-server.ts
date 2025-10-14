import axios, { axiosPrivate } from "@/axios/axios"
import { d, e } from "@/components/utils/crypto"
import type { ColumnFiltersState, SortingState } from "@tanstack/react-table"
import type { Filter } from "./server-side-data-table"

interface ServerData {
    data: unknown[]
    total: number
    columns: string[]
}

export const fetchUsersFromServer = async ({
    pageIndex,
    pageSize,
    sorting,
    globalFilter, // ✅
}: {
    pageIndex: number
    pageSize: number
    sorting: SortingState
    filters: Filter
    globalFilter: string // ✅
}): Promise<ServerData> => {

    // Default sort
    let sortField = "createdon";
    let sortDirection: "ASC" | "DESC" = "DESC";

    if (sorting.length > 0) {
        // Use user's selected sort
        sortField = sorting[0].id;
        sortDirection = sorting[0].desc ? "DESC" : "ASC";
    }

    const body = {
        page: pageIndex,
        size: pageSize,
        sortField,
        sortDirection,

        // ✅ Use globalFilter for full search
        search: globalFilter || "",

        // Still support column-based filters like status
        filter: {
            district:"",
            tehsil:""
        },

        draw: 1,
    }

    const res = await axiosPrivate.post(`/api/v1/get-all-users`, await e(body))
    const parsed = JSON.parse(await d(res.data))

    return {
        columns: Object.keys(parsed.data[0] || {}),
        data: parsed.data,
        total: parsed.recordsTotal,
    }
}

export const fetchJamabandi = async ({
    pageIndex,
    pageSize,
    sorting,
    filters,
    globalFilter, // ✅
}: {
    pageIndex: number
    pageSize: number
    sorting: SortingState
    filters: Filter
    globalFilter: string // ✅
}): Promise<ServerData> => {
    const body = {
        page: pageIndex,
        size: pageSize,
        sortField: sorting[0]?.id || "id",
        sortDirection: sorting[0]?.desc ? "DESC" : "ASC",

        // ✅ Use globalFilter for full search
        search: globalFilter || "",

        // Still support column-based filters like status
        filter: filters,
        draw: 1,
    }

    const res = await axiosPrivate.post(`/api/v1/get-jamabandi`, await e(body))
    console.log('res ', res)
    const parsed = JSON.parse(await d(res.data))

    return {
        columns: Object.keys(parsed.data[0] || {}),
        data: parsed.data,
        total: parsed.recordsTotal,
    }
}
