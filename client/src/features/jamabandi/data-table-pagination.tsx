import { type Table } from "@tanstack/react-table"
import {
    ChevronLeft,
    ChevronRight,
    ChevronsLeft,
    ChevronsRight,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

interface DataTablePaginationProps<TData> {
    table: Table<TData>;
    totalRows: number; // Pass from parent
}

export function DataTablePagination<TData>({
    table,
    totalRows,
}: DataTablePaginationProps<TData>) {
    const pageIndex = table.getState().pagination.pageIndex
    const pageSize = table.getState().pagination.pageSize

    const start = totalRows === 0 ? 0 : pageIndex * pageSize + 1
    const end = Math.min((pageIndex + 1) * pageSize, totalRows)

    return (
        <div className="flex items-right justify-between space-x-6 lg:space-x-8">
            {/* Rows per page selector */}
            <div className="flex items-center space-x-2">
                <p className="text-sm font-medium">Rows per page</p>
                <Select
                    value={`${pageSize}`}
                    onValueChange={(value) => {
                        table.setPageSize(Number(value))
                    }}
                >
                    <SelectTrigger className="h-8 w-[70px]">
                        <SelectValue placeholder={pageSize} />
                    </SelectTrigger>
                    <SelectContent side="top">
                        {[10, 20, 25, 30, 40, 50].map((size) => (
                            <SelectItem key={size} value={`${size}`}>
                                {size}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>

            {/* Showing X–Y of Z */}
            <div className="flex w-[200px] items-center justify-center text-sm font-medium">
                Showing {start}–{end} of {totalRows} records
            </div>

            {/* Pagination buttons */}
            <div className="flex items-center space-x-2">
                <Button
                    variant="outline"
                    size="icon"
                    className="hidden size-8 lg:flex"
                    onClick={() => table.setPageIndex(0)}
                    disabled={pageIndex === 0}
                >
                    <span className="sr-only">Go to first page</span>
                    <ChevronsLeft />
                </Button>
                <Button
                    variant="outline"
                    size="icon"
                    className="size-8"
                    onClick={() => table.setPageIndex(pageIndex - 1)}
                    disabled={pageIndex === 0}
                >
                    <span className="sr-only">Go to previous page</span>
                    <ChevronLeft />
                </Button>
                <Button
                    variant="outline"
                    size="icon"
                    className="size-8"
                    onClick={() => table.setPageIndex(pageIndex + 1)}
                    disabled={(pageIndex + 1) >= table.getPageCount()}
                >
                    <span className="sr-only">Go to next page</span>
                    <ChevronRight />
                </Button>
                <Button
                    variant="outline"
                    size="icon"
                    className="hidden size-8 lg:flex"
                    onClick={() => table.setPageIndex(table.getPageCount() - 1)}
                    disabled={(pageIndex + 1) >= table.getPageCount()}
                >
                    <span className="sr-only">Go to last page</span>
                    <ChevronsRight />
                </Button>
            </div>
        </div>
    )
}
