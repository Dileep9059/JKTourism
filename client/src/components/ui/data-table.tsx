import {
  type ColumnDef,
  flexRender,
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
  type SortingState,
  type VisibilityState,
} from "@tanstack/react-table";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import React from "react";
import { Input } from "./input";
import { DataTablePagination } from "./data-table-pagination";
import { DataTableViewOptions } from "./data-table-view-columns";
import { cn } from "@/lib/utils";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  pageCount: number;
  total: number;
  pageIndex: number;
  pageSize: number;
  search: string;
  sorting: SortingState;
  setPageIndex: (index: number) => void;
  setPageSize: (size: number) => void;
  setSearch: (query: string) => void;
  setSorting: (updater: SortingState | ((old: SortingState) => SortingState)) => void;
}

export function DataTable<TData, TValue>({
  columns,
  data,
  pageCount,
  total,
  pageIndex,
  pageSize,
  search,
  setSearch,
  setPageIndex,
  setPageSize,
  sorting,
  setSorting,
}: DataTableProps<TData, TValue>) {

  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({})

  const table = useReactTable({
    data,
    columns,
    pageCount,
    state: {
      pagination: {
        pageIndex,
        pageSize,
      },
      sorting,
      columnVisibility,
    },
    manualPagination: true,
    manualSorting: true,
    onPaginationChange: updater => {
      const newPagination =
        typeof updater === "function"
          ? updater({ pageIndex, pageSize })
          : updater;
      setPageIndex(newPagination.pageIndex);
      setPageSize(newPagination.pageSize);
    },
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onSortingChange: setSorting,
  });

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between py-2">
        <Input
          type="text"
          placeholder="Search"
          value={search}
          onChange={e => {
            setPageIndex(0);
            setSearch(e.target.value);
          }}
          className="px-3 py-2 border rounded-lg border-[#e2e2e2] bg-white w-64 text-sm"
        />
        <DataTableViewOptions table={table} />
      </div>
      <div className="rounded-md border">

        <Table>
          <TableHeader className="bg-[#2b5f60]">
            {table.getHeaderGroups().map(headerGroup => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map(header => (
                  <TableHead key={header.id} className="text-white">
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map(row => (
                <TableRow key={row.id}>
                  {row.getVisibleCells().map(cell => (
                    <TableCell key={cell.id} className={cn(
                      "align-top",
                      cell.column.columnDef.meta?.className
                    )}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="text-center">
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className=" space-x-2 py-4">
        <DataTablePagination table={table} />
      </div>
    </div>
  );
}
