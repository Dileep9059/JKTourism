"use client";

import { useEffect, useState } from "react";
import type { ColumnDef, SortingState } from "@tanstack/react-table";

import clsx from "clsx";
import scss from "./houseboat.module.scss";
import { ArrowDownIcon, ArrowUpIcon, BadgeMinus } from "lucide-react";
import { toast } from "sonner";
import axiosInstance from "@/axios/axios";
import { DataTable } from "@/components/ui/data-table";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import FooterLogos from "@/components/footer/FooterLogos";
import { d, e } from "../utils/crypto";
import DocumentTitle from "../DocumentTitle";

type HouseBoat = {
  id: number;
  name: string;
  properitorName: string;
  district: string;
  contact: string;
};

const HouseBoat = () => {
  const [data, setData] = useState<HouseBoat[]>([]);
  const [pageIndex, setPageIndex] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [totalCount, setTotalCount] = useState(0);
  const [search, setSearch] = useState("");

  const [location, setLocation] = useState("");
  const [category, setCategory] = useState("");

  const [categories, setCategories] = useState([]);

  const [locations, setLocations] = useState([]);

  const [sorting, setSorting] = useState<SortingState>([
    { id: "name", desc: false },
  ]);

  const fetchHouseBoats = async () => {
    const params = {
      page: pageIndex,
      size: pageSize,
      search,
      location: location || "",
      category: category || "",
      sort: sorting.map((s) => ({
        field: s.id,
        direction: s.desc ? "desc" : "asc",
      })),
    };

    try {
      const encParams = await e(JSON.stringify(params));
      const res = await axiosInstance.post(`/api/houseboat/get-house-boats`, encParams);

      const json = JSON.parse(await d(res.data));

      setData(json.content);
      setTotalCount(json.totalElements);
    } catch (error) {
      toast("Error!", {
        description: "Something went wrong while fetching house boats.",
        icon: <BadgeMinus className="text-red-600 w-4 h-4" />,
      });
    }
  };

  const fetchCategories = async (loc: string) => {
    try {
      const params = {
        location: loc
      };

      const res = await axiosInstance.post(
        `/api/houseboat/get-categories`,
        await e(JSON.stringify(params))
      );
      const json = JSON.parse(await d(res?.data));
      setCategories(json);
    } catch (error) {
      console.error("Error fetching districts:", error);
      toast("Error!", {
        description: "Something went wrong while fetching districts.",
        icon: <BadgeMinus className="text-red-600 w-4 h-4" />,
      });
    }
  };

  const fetchLocations = async () => {
    try {
      const res = await axiosInstance.post("/api/houseboat/get-locations");
      const json = JSON.parse(await d(res?.data));
      setLocations(json);
    } catch (error) {
      toast.error("Unable to fetch locations.");
    }
  };

  useEffect(() => {
    fetchLocations();
  }, []);

  useEffect(() => {
    fetchHouseBoats();
  }, [pageIndex, pageSize, sorting, search, location, category]);

  const columns: ColumnDef<HouseBoat>[] = [
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
      header: "Properitor Name",
      accessorKey: "properitorName",
    },
    {
      header: "Phone",
      accessorKey: "contact",
    },
    {
      accessorKey: "category",
      header: "Category",
    },
    {
      accessorKey: "location",
      header: "Location",
    },
  ];

  return (
    <>
      <DocumentTitle title="Houseboat" />
      <div className={clsx(scss.travelag_div)}>
        <div className={scss.banner}>
          <img
            src="/assets/images/houseboat.jpg"
            alt="Banner"
            className={clsx(
              scss.banner_image,
              "w-full max-h-screen object-cover"
            )}
          />
          <h2 className="text-shadow-lg">Explore Registered House Boats</h2>
        </div>
        <div className={clsx(scss.travel_dropdown, scss.travelcontainer, "container")}>
          <Select
            value={location}
            onValueChange={(value) => {
              setLocation(value);
              setCategory(""); // reset district
              setPageIndex(0);
              fetchCategories(value); // fetch updated districts
            }}
          >
            <SelectTrigger className="w-[180px] bg-white">
              <SelectValue placeholder="Select Location" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {locations?.map((location) => (
                  <SelectItem key={location} value={location}>{location}</SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
          <Select
            value={category}
            onValueChange={(value) => {
              setCategory(value);
              setPageIndex(0);
            }}
          >
            <SelectTrigger className="w-[180px] bg-transparent">
              <SelectValue placeholder="Select Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {categories.map((cat) => (
                  <SelectItem
                    key={cat}
                    value={cat}
                    className="focus:bg-white focus:text-black hover:bg-gray-100"
                  >
                    {cat}
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
};

export default HouseBoat;
