import { useEffect, useState } from "react";
import clsx from "clsx";
import scss from "./contact.module.scss";
import type { ColumnDef, SortingState } from "@tanstack/react-table";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";


import AOS from "aos";
import "aos/dist/aos.css"; // Import AOS styles
import { toast } from "sonner";
import { ArrowDownIcon, ArrowUpIcon, BadgeMinus } from "lucide-react";

import { DataTable } from "@/components/ui/data-table";
import { Button } from "@/components/ui/button";
import axiosInstance from "@/axios/axios";
import { d, e } from "../utils/crypto";

type ContactUs = {
  id: number;
  name: string;
  properitorName: string;
  district: string;
  phone: string;
  email: string;
};


const ContactUs = () => {
    const [data, setData] = useState<ContactUs[]>([]);
  const [pageIndex, setPageIndex] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [totalCount, setTotalCount] = useState(0);
  const [search, setSearch] = useState("");

  const [state, setState] = useState("");
  const [district, setDistrict] = useState("");
  const [policeDepartment, setPoliceDepartment] = useState("");

  const [districts, setDistricts] = useState([]);

  const [sorting, setSorting] = useState<SortingState>([
    { id: "name", desc: false },
  ]);

  const columns: ColumnDef<ContactUs>[] = [
    {
      header: "S.No.",
      cell: ({ row }) => row.index + 1 + pageIndex * pageSize,
    },
    {
      accessorKey: "district",
      header: ({ column }) => (
        <button
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="flex items-center space-x-1"
        >
          <span>District</span>
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
      accessorKey: "state",
      header: "State",
    },
    {
      header: "Email ID",
      accessorKey: "email",
      cell: ({ row }) => (
        <a
          href={`mailto:${row.original.email}`}
          className="text-blue-600 hover:underline"
        >
          {row.original.email}
        </a>
      ),
    },
    {
      header: "Phone No.",
      accessorKey: "phone",
      cell: ({ row }) => (
        <a
          href={`tel:${row.original.phone}`}
          className="text-blue-600 hover:underline"
        >
          {row.original.phone}
        </a>
      ),
    },
  ];

  useEffect(() => {
    AOS.init({
      // duration: 10000, // Increased duration for smoother animation
      // easing: 'ease-in-out-sine', // Smoother easing function
      once: true, // Animation happens only once
      // offset: 50, // Trigger animations slightly earlier
    });
  }, []);

  const fetchPoliceDetails = async () => {
    const params = {
      page: pageIndex,
      size: pageSize,
      search,
      state,
      district,
      policeDepartment,
      sort: sorting.map((s) => ({
        field: s.id,
        direction: s.desc ? "desc" : "asc",
      })),
    };

    try {
      const encParams = await e(JSON.stringify(params));
      const res = await axiosInstance.post(
        `/api/police-location/get-police-locations`,
        encParams
      );

      const json = JSON.parse(await d(res.data));
      setData(json.content);
      setTotalCount(json.totalElements);
    } catch (error) {
      toast("Error!", {
        description: "Something went wrong while fetching police locations.",
        icon: <BadgeMinus className="text-red-600 w-4 h-4" />,
      });
    }
  };

  const fetchDistrictsForState = async (state: string) => {
    try {
      const params = {
        state : state,
      }
      const res = await axiosInstance.post(
        `/api/police-location/get-districts`,
        await e(JSON.stringify(params))
      );
      const json = JSON.parse(await d(res?.data));
      setDistricts(json);
    } catch (error) {
      toast("Error!", {
        description: "Something went wrong while fetching districts.",
        icon: <BadgeMinus className="text-red-600 w-4 h-4" />,
      });
    }
  };

  useEffect(() => {
    fetchPoliceDetails();
  }, [pageIndex, pageSize, sorting, search, state, district, policeDepartment]);

  return (
    <>
      <div className={clsx(scss.category_div)}>
        <div className="banner">
          <img
            src={`${import.meta.env.VITE_BASE}images/contact-us.png`}
            alt="Banner"
            className={clsx(
              scss.banner_image,
              "w-full max-h-[400px] object-cover"
            )}
          />
          <div className={clsx(scss.titlect, "px-4 pb-3 mx-auto md:hidden")}>
            Contact us
          </div>
        </div>
        <div className="container-fluid">
          <div className={scss.destination_title}>
            <h2 className={clsx(scss.cattitle, "mt-5")}>
              Contact Details of Police
            </h2>
          </div>
          <div
            className={clsx(
              scss.contact_dropdown,
              "flex flex-col lg:flex-row justify-between items-center"
            )}
          >
            <div className="h-10">
              <Select
                onValueChange={(value) => {
                  setPoliceDepartment(value);
                }}
                value={policeDepartment || ""}
              >
                <SelectTrigger className="w-[300px] h-8 rounded-lg py-4 bg-white text-black cursor-pointer transition-colors duration-300">
                  <SelectValue
                    placeholder="Select Police Department"
                    className="text-black"
                  />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value="reception">
                      Director Tourism Kashmir,Tourist Reception
                    </SelectItem>
                    <SelectItem value="commissioner">
                      Office of Deputy Commissioner
                    </SelectItem>
                    <SelectItem value="superintendent">
                      Office of Superintendent of Police
                    </SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
            <div className="h-10">
              <Select
                value={state || ""}
                onValueChange={(value) => {
                  console.log("Selected State:", value);
                  setState(value);
                  setDistrict("");
                  setPageIndex(0);
                  fetchDistrictsForState(value);
                }}
              >
                <SelectTrigger className="w-[300px] h-8  rounded-lg py-4 bg-white text-black cursor-pointer transition-colors duration-300">
                  <SelectValue
                    placeholder="Select State"
                    className="text-black"
                  />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value="jammu">Jammu</SelectItem>
                    <SelectItem value="kashmir">Kashmir</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
            <div className="h-10">
              <Select
                value={district || ""}
                onValueChange={(value) => {
                  setDistrict(value);
                  setPageIndex(0);
                }}
              >
                <SelectTrigger className="w-[300px] h-8 rounded-lg py-4 bg-white text-black cursor-pointer transition-colors duration-300">
                  <SelectValue
                    placeholder="Select District"
                    className="text-black"
                  />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {districts.map((district) => (
                      <SelectItem key={district} value={district}>
                        {" "}
                        {district}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
            <div className="h-10">
              <Button
                onClick={() => {
                  setPageIndex(0);
                  setState("");
                  setDistrict("");
                  setPoliceDepartment("");
                  setSearch("");
                  fetchPoliceDetails();
                }}
              >
                Reset
              </Button>
            </div>
          </div>
          <div className="m-3">
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
          <div className={scss.destination_title}>
            <h2 className={clsx(scss.cattitle, "mt-5")}>Social Media</h2>
          </div>
          <div className={clsx(scss.category_data, "mb-5")}>
            <div
              className={clsx(scss.category_div, scss.halfdiv)}
              data-aos="fade-up"
              data-aos-duration="2000"
            >
              <a href="https://x.com/jandktourism" target="_blank">
                <img
                  src={`${import.meta.env.VITE_BASE}assets/images/twitterbg_.png`}
                  alt="Banner"
                  className={clsx(scss.category_image, "w-full object-cover")}
                />
                <div>
                  <img
                    src={`${import.meta.env.VITE_BASE}assets/images/twitter.png`}
                    alt="Banner"
                    className={clsx(scss.category_image, "w-full object-cover")}
                  />
                </div>
                <p>X</p>
              </a>
            </div>
            <div
              className={clsx(scss.category_div, scss.halfdiv)}
              data-aos="fade-up"
              data-aos-delay="100"
              data-aos-duration="2000"
            >
              <a href="https://www.instagram.com/jktourismofficial" target="_blank">
                <img
                  src={`${import.meta.env.VITE_BASE}assets/images/instagrambg_.png`}
                  alt="Banner"
                  className={clsx(scss.category_image, "w-full object-cover")}
                />
                <div>
                  <img
                    src={`${import.meta.env.VITE_BASE}assets/images/instagram_.png`}
                    alt="Banner"
                    className={clsx(scss.category_image, "w-full object-cover")}
                  />
                </div>
                <p>Instagram</p>
              </a>
            </div>
            <div
              className={clsx(scss.category_div, scss.halfdiv, scss.marginnone)}
              data-aos="fade-up"
              data-aos-delay="200"
              data-aos-duration="2000"
            >
              <a href="https://www.facebook.com/JKTourismOfficial/" target="_blank">
                <img
                  src={`${import.meta.env.VITE_BASE}assets/images/facebookbg_.png`}
                  alt="Banner"
                  className={clsx(scss.category_image, "w-full object-cover")}
                />
                <div>
                  <img
                    src={`${import.meta.env.VITE_BASE}assets/images/facebook.png`}
                    alt="Banner"
                    className={clsx(scss.category_image, "w-full object-cover")}
                  />
                </div>
                <p>Facebook</p>
              </a>
            </div>
            <div
              className={clsx(scss.category_div, scss.fulldiv)}
              data-aos="fade-up"
              data-aos-delay="100"
              data-aos-duration="2000"
            >
              <section>
                <img
                  src={`${import.meta.env.VITE_BASE}assets/images/trc.png`}
                  alt="Banner"
                  className={clsx(scss.category_image, "w-full object-cover")}
                />
                <span className={scss.main_title}>TRC</span>
                <p>
                  This is a facility in Srinagar, Jammu and Kashmir, designed to
                  assist tourists with information, booking accommodations, and
                  other travel-related services.
                </p>
                <div className={clsx(scss.trcmap)}>
                  <div>
                    <a
                      href={`https://www.google.com/maps?q=${34.0738},${74.8292}`}
                      className="text-decoration-none"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Visit TRC Kashmir
                    </a>
                    <img
                      src={`${import.meta.env.VITE_BASE}assets/images/map.png`}
                      alt="Banner"
                      className={clsx(
                        scss.category_image,
                        "w-full object-cover"
                      )}
                    />
                  </div>
                  <div>
                    <a
                      href={`https://www.google.com/maps?q=${32.73},${74.87}`}
                      className="text-decoration-none"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Visit TRC Jammu
                    </a>
                    <img
                      src={`${import.meta.env.VITE_BASE}assets/images/map.png`}
                      alt="Banner"
                      className={clsx(
                        scss.category_image,
                        "w-full object-cover"
                      )}
                    />
                  </div>
                </div>
              </section>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default ContactUs