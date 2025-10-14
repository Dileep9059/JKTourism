import type { ColumnDef, ColumnFiltersState, SortingState } from "@tanstack/react-table";
import { useState, useEffect } from "react";
import type { Jamabandi } from "./columns";
import { axiosPrivate } from "@/axios/axios";
import { d, e } from "@/components/utils/crypto";
import { DataTable } from "./data-table";

type JamabandiHistoryProps = {
  khasraId: string;
  jamabandiColumns: ColumnDef<Jamabandi>[];
};

function JamabandiHistory({ khasraId, jamabandiColumns }: JamabandiHistoryProps) {
  interface ServerData<T> {
    data: T[];
    total: number;
    filteredTotal: number;
  }

  const [jamabandis, setJamabandis] = useState<Jamabandi[]>([]);
  const [total, setTotal] = useState(0);
  const [pageIndex, setPageIndex] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [sorting, setSorting] = useState<SortingState>([]);
  const [filters, setFilters] = useState<ColumnFiltersState>([]);
  const [globalFilter, setGlobalFilter] = useState("");

  useEffect(() => {
    getJamabandi({ pageIndex, pageSize, sorting, filters, globalFilter }).then((res) => {
      setJamabandis(res.data);
      setTotal(res.total);
    });
  }, [pageIndex, pageSize, sorting, filters, globalFilter]);

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
      khasraId,
      draw: 1,
    };

    const res = await axiosPrivate.post(`/api/v1/get-history-by-khasra`, await e(params));
    const parsed = JSON.parse(await d(res.data));
    console.log(parsed)
    return {
      data: parsed.data,
      total: parsed.recordsTotal,
      filteredTotal: parsed.recordsFiltered,
    };
  }

  return (
    <div className="flex-1 overflow-y-auto -mx-4 px-4 py-1">
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
  );
}

export default JamabandiHistory;
