"use client"

import { useEffect, useState } from "react"
import {
  type ColumnDef,
  type ColumnFiltersState,
  type SortingState,
  type VisibilityState,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"



import { useGenericDialog } from "./GenericDialogProvider"
import { GenerticDataTableToolbar } from "./GenerticDataTableToolbar"
import { DataTableColumnHeader } from "../data-table-column-header"
import { DataTablePagination } from "../data-table-pagination"


interface ServerData {
  data: unknown[]
  total: number
  columns: string[]
}

export type Filter = {
  district: string,
  tehsil: string
  village: string
}

interface DataTableProps {
  fetchData: (params: {
    pageIndex: number
    pageSize: number
    sorting: SortingState
    filters: Filter
    globalFilter: string // ✅ add this

  }) => Promise<ServerData>
  testFilter: Filter
}

export function ServerSideDataTable({ fetchData, testFilter }: DataTableProps) {
  const [data, setData] = useState<unknown[]>([])
  const [total, setTotal] = useState(0)
  const [columns, setColumns] = useState<ColumnDef<unknown>[]>([])

  const [rowSelection, setRowSelection] = useState({})
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [globalFilter, setGlobalFilter] = useState('') // ✅ add this
  const [sorting, setSorting] = useState<SortingState>([])
  const [pageIndex, setPageIndex] = useState(0)
  const [pageSize, setPageSize] = useState(10)

  const { setOpen, setCurrentRow } = useGenericDialog<unknown>()

  useEffect(() => {
    fetchData({
      pageIndex,
      pageSize,
      sorting,
      filters: testFilter,
      globalFilter, // ✅ pass it
    }).then((res) => {
      setData(res.data)
      setTotal(res.total)

      if (res.columns?.length) {

        const generatedColumns: ColumnDef<unknown>[] = [];

        // 1. Add serial number (S.No.) column
        generatedColumns.push({
          accessorKey: "sno",
          header: "S.No.",
          cell: ({ row, table }) => {
            const pageIndex = table.getState().pagination.pageIndex;
            const pageSize = table.getState().pagination.pageSize;
            return row.index + 1 + pageIndex * pageSize;
          },
        });

        // 2. Add dynamic columns from the response
        const dynamicColumns = res.columns.map((col): ColumnDef<unknown> => ({
          accessorKey: col,
          header: ({ column }) => (
            <DataTableColumnHeader
              column={column}
              title={col.charAt(0).toUpperCase() + col.slice(1)}
            />
          ),
          cell: (info) => String(info.getValue() ?? ""),
        }));

        generatedColumns.push(...dynamicColumns);

        // // 3. Add Actions column
        // generatedColumns.push({
        //   id: "actions",
        //   header: "Actions",
        //   cell: ({ row }) => {
        //     const original = row.original;
        //     return (
        //       <DropdownMenu>
        //         <DropdownMenuTrigger asChild>
        //           <Button
        //             variant="ghost"
        //             className="data-[state=open]:bg-muted flex h-8 w-8 p-0"
        //           >
        //             <DotsHorizontalIcon className="h-4 w-4" />
        //             <span className="sr-only">Open menu</span>
        //           </Button>
        //         </DropdownMenuTrigger>
        //         <DropdownMenuContent align="end" className="w-[160px]">
        //           <DropdownMenuItem
        //             onClick={(e) => {
        //               e.stopPropagation();
        //               setCurrentRow(original);
        //               setOpen("edit");
        //             }}
        //           >
        //             Edit
        //             <DropdownMenuShortcut>
        //               <IconEdit size={16} />
        //             </DropdownMenuShortcut>
        //           </DropdownMenuItem>
        //           <DropdownMenuSeparator />
        //           <DropdownMenuItem
        //             onClick={(e) => {
        //               e.stopPropagation();
        //               setCurrentRow(original);
        //               setOpen("delete");
        //             }}
        //             className="text-red-500 focus:text-red-500"
        //           >
        //             Delete
        //             <DropdownMenuShortcut>
        //               <IconTrash size={16} />
        //             </DropdownMenuShortcut>
        //           </DropdownMenuItem>
        //         </DropdownMenuContent>
        //       </DropdownMenu>
        //     );
        //   },
        // });
        // 4. Set columns to state
        setColumns(generatedColumns);
      }
    })
  }, [pageIndex, pageSize, sorting, columnFilters, testFilter, globalFilter, fetchData, setCurrentRow, setOpen])

  const table = useReactTable({
    data,
    columns,
    pageCount: Math.ceil(total / pageSize),
    state: {
      sorting,
      columnVisibility,
      rowSelection,
      columnFilters,
      globalFilter, // ✅
      pagination: { pageIndex, pageSize },
    },
    manualPagination: true,
    manualSorting: true,
    manualFiltering: true,
    manualGlobalFilter: true, // ✅
    onPaginationChange: (updater) => {
      const next =
        typeof updater === "function" ? updater({ pageIndex, pageSize }) : updater
      setPageIndex(next.pageIndex ?? 0)
      setPageSize(next.pageSize ?? 10)
    },
    onRowSelectionChange: setRowSelection,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onGlobalFilterChange: setGlobalFilter, // ✅
    onColumnVisibilityChange: setColumnVisibility,
    getCoreRowModel: getCoreRowModel(),
  })

  return (
    <div className="space-y-4">
      <GenerticDataTableToolbar table={table} />

      <div className="overflow-hidden rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id} colSpan={header.colSpan}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(header.column.columnDef.header, header.getContext())}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>

          <TableBody>
            {data.length > 0 ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  className="cursor-pointer hover:bg-muted/30 transition-colors"
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <DataTablePagination table={table} />
    </div>
  )
}
