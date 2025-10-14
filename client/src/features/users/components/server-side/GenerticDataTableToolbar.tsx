import { Cross2Icon } from '@radix-ui/react-icons'
import { type Table } from '@tanstack/react-table'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { DataTableViewOptions } from '../data-table-view-options'


interface DataTableToolbarProps<TData> {
    table: Table<TData>
}

export function GenerticDataTableToolbar<TData>({
    table,
}: DataTableToolbarProps<TData>) {
    const isFiltered =
        table.getState().columnFilters.length > 0 ||
        !!table.getState().globalFilter

    return (
        <div className="flex items-center justify-between">
            <div className="flex flex-1 flex-col-reverse items-start gap-y-2 sm:flex-row sm:items-center sm:space-x-2">
                {/* ✅ Global search input */}
                <Input
                    placeholder="Search..."
                    value={(table.getState().globalFilter as string) ?? ''}
                    onChange={(event) => table.setGlobalFilter(event.target.value)}
                    className="h-8 w-[150px] lg:w-[250px]"
                />

                {/* Optional: filters like status/priority */}
                {/* 
        <DataTableFacetedFilter ... />
        */}

                {/* ✅ Reset button */}
                {isFiltered && (
                    <Button
                        variant="ghost"
                        onClick={() => {
                            table.resetColumnFilters()
                            table.setGlobalFilter('')
                        }}
                        className="h-8 px-2 lg:px-3"
                    >
                        Reset
                        <Cross2Icon className="ml-2 h-4 w-4" />
                    </Button>
                )}
            </div>

            <DataTableViewOptions table={table} />
        </div>
    )
}
