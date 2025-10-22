"use client";
import { useEffect, useState } from "react";
import type { ColumnDef, SortingState } from "@tanstack/react-table";

import clsx from "clsx";
import scss from "./tourguide.module.scss";
import { ArrowDownIcon, ArrowUpIcon, BadgeMinus } from "lucide-react";
import { toast } from "sonner";
import { d, e } from "@/components/utils/crypto";
import { DataTable } from "@/components/ui/data-table";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import FooterLogos from "@/components/footer/FooterLogos";
import axiosInstance from "@/axios/axios";
import DocumentTitle from "../DocumentTitle";

type Guide = {
  id: number;
  name: string;
  properitorName: string;
  district: string;
  contact: string;
};

function TourGuide() {
  const [data, setData] = useState<Guide[]>([]);
  const [pageIndex, setPageIndex] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [totalCount, setTotalCount] = useState(0);
  const [search, setSearch] = useState("");

  const [state, setState] = useState("");
  const [district, setDistrict] = useState("");

  const [districts, setDistricts] = useState([]);

  const [sorting, setSorting] = useState<SortingState>([
    { id: "name", desc: false },
  ]);

  const fetchGuides = async () => {
    const params = {
      page: pageIndex,
      size: pageSize,
      search,
      state: state || "",
      district: district || "",
      sort: sorting.map((s) => ({
        field: s.id,
        direction: s.desc ? "desc" : "asc",
      })),
    };

    try {
      const encParams = await e(JSON.stringify(params));
      const res = await axiosInstance.post(
        `/api/tour-guide/get-tour-guides`,
        encParams
      );

      const json = JSON.parse(await d(res.data));

      setData(json.content);
      setTotalCount(json.totalElements);
    } catch (error) {
      toast("Error!", {
        description: "Something went wrong while fetching guides.",
        icon: <BadgeMinus className="text-red-600 w-4 h-4" />,
      });
    }
  };

  const fetchDistrictsForState = async (state: string) => {
    try {
      const params = {
        state: state,
      };

      const res = await axiosInstance.post(
        `/api/tour-guide/get-districts`,
        await e(JSON.stringify(params))
      );
      const json = JSON.parse(await d(res?.data));
      setDistricts(json);
    } catch (error) {
      console.error("Error fetching districts:", error);
      toast("Error!", {
        description: "Something went wrong while fetching districts.",
        icon: <BadgeMinus className="text-red-600 w-4 h-4" />,
      });
    }
  };

  useEffect(() => {
    fetchGuides();
  }, [pageIndex, pageSize, sorting, search, state, district]);

  const columns: ColumnDef<Guide>[] = [
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
          <span>Name</span>
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
      accessorKey: "district",
      header: "District",
    },
  ];

  return (
    <>
      <DocumentTitle title="Travel Guides" />
      <div className={clsx(scss.travelag_div)}>
        <div className={scss.banner}>
          <img
            src={`${import.meta.env.VITE_BASE}assets/images/tour-guide_1.jpg`}
            alt="Banner"
            className={clsx(
              scss.banner_image,
              "w-full max-h-screen object-cover"
            )}
          />
          <h2 className="text-shadow-lg">Explore Registered Tour Guide</h2>
        </div>
        <div className={clsx(scss.travel_dropdown, scss.travelcontainer, "container")}>
          <Select
            value={state}
            onValueChange={(value) => {
              setState(value);
              setDistrict(""); // reset district
              setPageIndex(0);
              fetchDistrictsForState(value); // fetch updated districts
            }}
          >
            <SelectTrigger className="w-[180px] bg-white">
              <SelectValue placeholder="Select Division" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="jammu">Jammu</SelectItem>
                <SelectItem value="kashmir">Kashmir</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
          <Select
            value={district}
            onValueChange={(value) => {
              setDistrict(value);
              setPageIndex(0);
            }}
          >
            <SelectTrigger className="w-[180px] bg-transparent">
              <SelectValue placeholder="Select District" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {districts.map((district) => (
                  <SelectItem key={district} value={district} className="focus:bg-white focus:text-black hover:bg-gray-100">
                    {district}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
        <div className={clsx(scss.traveltable, scss.travelcontainer, "container")}>
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
        </div>
        <FooterLogos />
      </div>
    </>
  );
}

export default TourGuide;
