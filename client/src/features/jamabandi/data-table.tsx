// data-table.tsx
import * as React from "react";
import {
  type ColumnDef,
  flexRender,
  type SortingState,
  type VisibilityState,
  getCoreRowModel,
  type ColumnFiltersState,
  useReactTable,
} from "@tanstack/react-table";


import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { DataTablePagination } from "./data-table-pagination";
import { MixerHorizontalIcon } from "@radix-ui/react-icons";
import { Loader2 } from "lucide-react";




// ✅ Simple debounce hook
function useDebounce<T>(value: T, delay: number): T {
  const [debounced, setDebounced] = React.useState(value);
  React.useEffect(() => {
    const handler = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);
  return debounced;
}

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  pageCount: number;
  totalRows: number;

  isLoading: boolean,

  state: {
    sorting: SortingState;
    columnFilters: ColumnFiltersState;
    globalFilter: string;
  };

  onSortingChange: (updater: SortingState) => void;
  onColumnFiltersChange: (updater: ColumnFiltersState) => void;
  onGlobalFilterChange: (value: string) => void;

  pageIndex: number;
  pageSize: number;
  onPaginationChange: (pagination: { pageIndex: number; pageSize: number }) => void;

  manualPagination?: boolean;
  manualSorting?: boolean;
  manualFiltering?: boolean;
}

export function DataTable<TData, TValue>({
  columns,
  data,
  pageCount,
  totalRows,
  isLoading,
  state,
  onSortingChange,
  onColumnFiltersChange,
  onGlobalFilterChange,
  pageIndex,
  pageSize,
  onPaginationChange,
  manualPagination = true,
  manualSorting = true,
  manualFiltering = true,
}: DataTableProps<TData, TValue>) {
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({ id: false });
  const [search, setSearch] = React.useState(state.globalFilter ?? "");

  // ✅ Debounce search value
  const debouncedSearch = useDebounce(search, 500);
  React.useEffect(() => {
    if (debouncedSearch !== state.globalFilter) {
      onGlobalFilterChange(debouncedSearch);
    }
  }, [debouncedSearch, state.globalFilter, onGlobalFilterChange]);

  const table = useReactTable({
    data,
    columns,
    manualPagination,
    manualSorting,
    manualFiltering,
    pageCount,
    getCoreRowModel: getCoreRowModel(),

    onSortingChange,
    onColumnFiltersChange,
    // ✅ Fix: allow column visibility changes to update state
    onColumnVisibilityChange: setColumnVisibility,

    onPaginationChange: (updater) => {
      const resolved =
        typeof updater === "function" ? updater({ pageIndex, pageSize }) : updater;
      onPaginationChange({
        pageIndex: resolved.pageIndex,
        pageSize: resolved.pageSize,
      });
    },

    state: {
      sorting: state.sorting,
      columnFilters: state.columnFilters,
      globalFilter: state.globalFilter,
      pagination: { pageIndex, pageSize },
      columnVisibility,
    },
  });


  return (
    <div>
      <div className="flex items-center py-4">
        {/* ✅ Debounced Global Search */}
        {/* <Input
          placeholder="Search..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="max-w-sm"
        /> */}

        {/* Export Buttons */}
        {/* <div className="flex space-x-2">
                    <Button variant="outline" size="sm" onClick={handleExportExcel}>
                        Export Excel
                    </Button>
                    <Button variant="outline" size="sm" onClick={handleExportPDF}>
                        Export PDF
                    </Button>
                    <Button variant="outline" size="sm" onClick={handlePrint}>
                        Print
                    </Button>
                </div> */}

        {/* Column Visibility Toggle */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="ml-auto hidden h-8 lg:flex">
              <MixerHorizontalIcon className="mr-2 h-4 w-4" />
              View
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Toggle columns</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {table
              .getAllLeafColumns() // ✅ Only leaf columns
              .filter((column) => column.getCanHide())
              .map((column) => (
                <DropdownMenuCheckboxItem
                  key={column.id}
                  className="capitalize"
                  checked={column.getIsVisible()}
                  onCheckedChange={(value) => column.toggleVisibility(!!value)}
                >
                  {column.id}
                </DropdownMenuCheckboxItem>
              ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table
          className="min-w-full border border-gray-300 dark:border-gray-700 border-collapse"
          cellPadding="5"
        >
          <thead className="bg-gray-100 dark:bg-gray-800">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    colSpan={header.colSpan}
                    className="border border-gray-300 dark:border-gray-700 px-4 py-2 text-left text-gray-900 dark:text-gray-100"
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td
                  colSpan={columns.length}
                  className="border border-gray-300 dark:border-gray-700 px-4 py-2 text-center text-gray-900 dark:text-gray-100"
                >
                  <div className="flex items-center justify-center space-x-2">
                    <Loader2 className="h-6 w-6 animate-spin text-blue-500" />
                    <span className="text-gray-700 dark:text-gray-300 text-sm font-medium">
                      Processing data transliteration. This may take a moment.
                    </span>
                  </div>
                </td>


              </tr>
            ) : table.getRowModel().rows.length > 0 ? (
              table.getRowModel().rows.map((row, idx) => (
                <tr
                  key={row.id}
                  className={
                    idx % 2 === 0
                      ? "bg-white dark:bg-gray-900"
                      : "bg-gray-50 dark:bg-gray-800"
                  }
                >
                  {row.getVisibleCells().map((cell) => (
                    <td
                      key={cell.id}
                      className="border border-gray-300 dark:border-gray-700 px-2 sm:px-4 py-2 text-gray-900 dark:text-gray-100 text-sm sm:text-base"
                    >
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={columns.length}
                  className="border border-gray-300 dark:border-gray-700 px-4 py-2 text-center text-gray-900 dark:text-gray-100"
                >
                  No results.
                </td>
              </tr>
            )}
          </tbody>

        </table>
      </div>

      {/* Pagination */}
      {/* <div className="space-x-2 py-4">
        <DataTablePagination table={table} totalRows={totalRows} />
      </div> */}
    </div>
  );
}
