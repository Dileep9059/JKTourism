/* eslint-disable @typescript-eslint/no-explicit-any */
import { Main } from "@/components/layout/main";
import { Sun, CloudSun, Moon } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LanguageDropdownButton } from "@/components/LanguageDropdownButton";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import useAuth from "@/hooks/useAuth";
import type { AuthType } from "@/context/AuthProvider";

import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

import { useEffect, useState } from "react";
import { axiosPrivate } from "@/axios/axios";
import { d, e } from "@/components/utils/crypto";

import type { ColumnFiltersState, SortingState } from "@tanstack/react-table";
import { jamabandiColumns, type Jamabandi } from "@/features/jamabandi/columns";
import { DataTable } from "@/features/jamabandi/data-table";
import { InnerHeader } from "@/components/layout/structure/InnerHeader";
import CreateAnnouncementDialog from "@/components/notifications/CreateAnnouncementDialog";
import { Label } from "@/components/ui/label";
import ReactSelect from "react-select";
import { motion } from "framer-motion";

interface ServerData<T> {
  data: T[];
  total: number;
  filteredTotal: number;
}

async function getJamabandi({
  pageIndex,
  pageSize,
  sorting,
  //filters,
  filterStatus,
  selectedData,
  globalFilter,
}: {
  pageIndex: number;
  pageSize: number;
  sorting: SortingState;
  filters: ColumnFiltersState;
  filterStatus: string
  selectedData: {
    district: string;
    tehsil: string;
    village: string;
    khewat: string
  };
  globalFilter: string;
}): Promise<ServerData<Jamabandi>> {
  const params = {
    page: pageIndex,
    size: pageSize,
    sortField: sorting[0]?.id || "id",
    sortDirection: sorting[0]?.desc ? "DESC" : "ASC",
    search: globalFilter || "",
    // status: filters.find((f) => f.id === "status")?.value || "",
    //   filters:filters,
    status: filterStatus,
    selectedData,
    draw: 1,
  };

  //console.log(params)

  const res = await axiosPrivate.post(`/api/v1/get-jamabandi`, await e(params));
  const parsed = JSON.parse(await d(res.data));
  console.log('DATA', parsed);
  return {
    data: parsed.data,
    total: parsed.recordsTotal,
    filteredTotal: parsed.recordsFiltered,
  };
}


// helper to normalize kanal/marla
function normalizeArea(kanal: number, marla: number) {
  if (marla >= 20) {
    kanal = kanal + Math.floor(marla / 20);
    marla = Math.round((marla % 20) * 1e6) / 1e6;

  }
  return { kanal, marla };
}


function groupByKhasraAndKhata(
  data: any[],
  setKhewatBubble?: (val: { no: string; kanal: number; marla: number } | null) => void
) {
  const result: any[] = [];
  const seenOwners = new Set<string>();
  let khataRows: any[] = [];
  let khewatTotals = { kanal: 0, marla: 0 };
  let currentKhewatNo: any = null; // track current khewat for totals

  const pushKhataTotals = () => {
    if (khataRows.length === 0) return;

    let sumKanal = khataRows.reduce((a, r) => a + r.totalKanal, 0);
    let sumMarla = khataRows.reduce((a, r) => a + r.totalMarla, 0);
    const normalized = normalizeArea(sumKanal, sumMarla);

    result.push(...khataRows);
    result.push({
      isKhataTotalRow: true,
      totalKanal: normalized.kanal,
      totalMarla: normalized.marla,
      fullRow: true,
    });

    khataRows = [];
  };

  const pushKhewatTotals = (khewatNo: any) => {
    const normalized = normalizeArea(khewatTotals.kanal, khewatTotals.marla);
    // result.push({
    //   isKhewatTotalRow: true,
    //   khewat_no: khewatNo,
    //   totalKanal: normalized.kanal,
    //   totalMarla: normalized.marla,
    //   fullRow: true,
    // });

    // update bubble in the dashboard if setter provided
    if (setKhewatBubble) {
      // slight delay helps avoid render race
      setTimeout(() => {
        setKhewatBubble({
          no: khewatNo,
          kanal: normalized.kanal,
          marla: normalized.marla,
        });
      }, 100);
    }

    khewatTotals = { kanal: 0, marla: 0 };
  };

  data.forEach((row, index) => {
    // remember current khewat
    currentKhewatNo = row.khewat_no;

    // parse & normalize row area
    let kanal = parseFloat(row.area_kanal) || 0;
    let marla = parseFloat(row.area_marla) || 0;
    ({ kanal, marla } = normalizeArea(kanal, marla));

    // check if khasra already exists
    const existing = khataRows.find(r => r.khasra_no === row.khasra_no);
    if (existing) {
      existing.soil_details.push({
        qism_zameen: row.qism_zameen,
        area_kanal: kanal,
        area_marla: marla,
      });

      existing.totalKanal += kanal;
      existing.totalMarla += marla;

      // normalize totals for this khasra
      const normalized = normalizeArea(existing.totalKanal, existing.totalMarla);
      existing.totalKanal = normalized.kanal;
      existing.totalMarla = normalized.marla;
    } else {
      const ownerKey = row.khewat_no + "_" + row.owner_str;
      const showOwner = !seenOwners.has(ownerKey);
      if (showOwner) seenOwners.add(ownerKey);

      khataRows.push({
        ...row,
        showOwner,
        soil_details: [
          { qism_zameen: row.qism_zameen, area_kanal: kanal, area_marla: marla },
        ],
        totalKanal: kanal,
        totalMarla: marla,
      });
    }

    // accumulate khewat totals
    khewatTotals.kanal += kanal;
    khewatTotals.marla += marla;

    // detect boundaries
    const next = data[index + 1];
    const khataChange = !next || next.khataId !== row.khataId;
    const khewatChange = !next || next.khewat_no !== row.khewat_no;
    const lastRow = index === data.length - 1;

    if (khataChange || lastRow) pushKhataTotals();
    if (khewatChange || lastRow) pushKhewatTotals(currentKhewatNo);
  });

  return result;
}

const Dashboard = () => {
  type District = {
    distId: number;
    distNameE: string;
    distNameU: string;
  };

  type Tehsil = {
    tehId: number;
    tehNameE: string;
    tehNameU: string;
  };

  type village = {
    villId: number;
    villNameE: string;
    villNameU: string;
  };

  type Khewats = {
    khewatno: string;
    khewatid: string;
  };

  type Khatas = {
    khatano: string;
    khataid: string;
  };
  type Khasras = {
    khasrano: string;
    khasraid: string;
  };

  const [khewatBubble, setKhewatBubble] = useState<{ no: string; kanal: number, marla: number } | null>(null);

  const [districts, setDistricts] = useState<District[]>([]); // list from API
  const [selectedDistrict, setSelectedDistrict] = useState<string>(""); // chosen district

  const [tehsils, setTehsils] = useState<Tehsil[]>([]);
  const [selectedTehsils, setSelectedTehsils] = useState<string>(""); // chosen tehsil

  const [villages, setVillages] = useState<village[]>([]);
  const [selectedVillage, setSelectedVillages] = useState<string>(""); // chosen village

  const [khewat, setKhewat] = useState<Khewats[]>([]);
  const [selectedKhewat, setSelectedKhewat] = useState<{
    id: string | number;
    no: string;
  }>({ id: "", no: "" });

  const [khata, setKhata] = useState<Khatas[]>([]);
  const [selectedKhata, setSelectedKhata] = useState<{
    id: string | number;
    no: string;
  }>({ id: "", no: "" });

  const [khasra, setKhasra] = useState<Khasras[]>([]);
  const [selectedKhasra, setSelectedKhasra] = useState<{
    id: string | number;
    no: string;
  }>({ id: "", no: "" });

  const [selectedLanguage, setSelectedLanguage] = useState(""); // chosen language

  const [selectedData, setSelectedData] = useState({
    district: "",
    tehsil: "",
    village: "",
    khewat: "",
    khata: "",
    khasra: "",
    lang: selectedLanguage,
  });



  const { auth } = useAuth() as { auth: AuthType };
  const roles = auth?.roles ?? [];
  const isMasterAdmin = roles.includes("ROLE_MASTER_ADMIN");
  const isTehsildar = roles.includes("ROLE_TEHSILDAR");
  const isPatwari = roles.includes("ROLE_PATWARI");
  const isNaibTehsildar = roles.includes("ROLE_NAIB_TEHSILDAR");


  const [counts, setCounts] = useState({
    total_count: 0,
    approved_count: 0,
    rejected_count: 0,
    submitted_count: 0,
    verified_count: 0,
    edited_count: 0,
    resubmitted_count: 0,
    clarificationrequired_count: 0
  });

  // Access the dialog context
  // const { setOpen } = useGenericDialog<unknown>()

  // Dynamic button configuration
  // const buttons = [
  //   { label: "Invite User", icon: <IconMailPlus size={18} />, variant: "outline", action: "invite" },
  //   { label: "Add User", icon: <IconUserPlus size={18} />, variant: "default", action: "add" },
  // ]

  const getGreetingWithName = (name?: string) => {
    const hour = new Date().getHours();

    let icon;
    let greetingText;

    if (hour < 12) {
      icon = <Sun className="text-yellow-400" size={24} />;
      greetingText = "Good Morning";
    } else if (hour < 18) {
      icon = <CloudSun className="text-blue-400" size={24} />;
      greetingText = "Good Afternoon";
    } else {
      icon = <Moon className="text-indigo-500" size={24} />;
      greetingText = "Good Evening";
    }

    return (
      <span className="flex items-center space-x-2">
        {icon}
        <span>
          {greetingText}, {name}
        </span>
      </span>
    );
  };



  const fetchDistricts = async () => {
    try {
      const response = await axiosPrivate.post("/api/v1/get-districts");
      if (response?.status === 200) {
        const result = JSON.parse(await d(response.data));
        //   console.log(result)
        setDistricts(result); // assuming response.data is an array
      }
    } catch (error) {
      console.error("Failed to fetch districts:", error);
    }
  };

  const fetchTehsil = async (disrictId: string) => {
    try {
      const param = {
        district: disrictId,
      };
      const response = await axiosPrivate.post(
        "/api/v1/get-tehsil-by-district",
        await e(param)
      );
      if (response?.status === 200) {
        const result = JSON.parse(await d(response.data));
        //   console.log(result)
        setTehsils(result); // assuming response.data is an array
      }
    } catch (error) {
      console.error("Failed to fetch Tehsil:", error);
    }
  };

  const fetchVillages = async (tehsilId: string) => {
    try {
      const param = {
        tehsil: tehsilId,
      };
      const response = await axiosPrivate.post(
        "/api/v1/get-village-by-tehsil",
        await e(param)
      );
      if (response?.status === 200) {
        const result = JSON.parse(await d(response.data));
        //   console.log(result)
        setVillages(result); // assuming response.data is an array
      }
    } catch (error) {
      console.error("Failed to fetch Tehsil:", error);
    }
  };

  // Khewat API
  const fetchKhewatByVillage = async (villageId: string) => {
    try {
      const param = {
        villageId: villageId,
      };

      const response = await axiosPrivate.post(
        "/api/v1/get-khewat-by-village",
        await e(param)
      );

      // console.log(" dsfdfdsdfdsfsdf  ",response?.status)
      if (response?.status === 200) {
        const result = JSON.parse(await d(response.data));
        // console.log(result);
        setKhewat(result); // assuming response.data is an array
      }
    } catch (error) {
      console.error("Failed to fetch Tehsil:", error);
    }
  };

  // Khata API
  const fetchKhataByKhewat = async (khewatId: string) => {
    try {
      const param = {
        villageId: selectedVillage,
        khewatId: khewatId,
      };
      const response = await axiosPrivate.post(
        "/api/v1/get-khata-by-khewat",
        await e(param)
      );
      if (response?.status === 200) {
        const result = JSON.parse(await d(response.data));
        // console.log(result);
        setKhata(result); // assuming response.data is an array
      }
    } catch (error) {
      console.error("Failed to fetch Tehsil:", error);
    }
  };

  // Khasra API
  const fetchKhasraByKhata = async (khataId: string) => {
    try {
      const param = {
        villageId: selectedVillage,
        khataId: khataId,
      };
      const response = await axiosPrivate.post(
        "/api/v1/get-khasra-by-khata",
        await e(param)
      );
      if (response?.status === 200) {
        const result = JSON.parse(await d(response.data));
        // console.log(result);
        setKhasra(result); // assuming response.data is an array
      }
    } catch (error) {
      console.error("Failed to fetch Tehsil:", error);
    }
  };

  const fetchLoggedInUser = async () => {
    try {
      const response = await axiosPrivate.post("/api/v1/get-loggedin-user");
      if (response?.status === 200) {
        const result = JSON.parse(await d(response.data));

        const districtId = result.districtId?.toString() || "";
        const tehsilId = result.tehsilId?.toString() || "";
        const villId = result.villageId?.toString() || "";
        // console.log(result)
        jamabandiCount();
        fetchDistricts();
        if (["ROLE_TEHSILDAR", "ROLE_NAIB_TEHSILDAR"].some(role =>
          result.roles[0].name.includes(role))) {

          setSelectedDistrict(districtId);
          setSelectedTehsils(tehsilId);
          fetchTehsil(districtId);
          fetchVillages(tehsilId);
          //  fetchKhewatByVillage(villId)
        } else if (result.roles[0].name == "ROLE_PATWARI") {


          setSelectedDistrict(districtId);
          setSelectedTehsils(tehsilId);
          setSelectedVillages(villId);

          fetchTehsil(districtId);
          fetchVillages(tehsilId);
          fetchKhewatByVillage(villId)

        }
      }
    } catch (error) {
      console.error("Failed to fetch User:", error);
    }
  };

  const jamabandiCount = async () => {
    try {
      const response = await axiosPrivate.post("/api/v1/get-jamabandi-count");
      if (response?.status === 200) {
        const result = JSON.parse(await d(response.data));
        // console.log(result)
        setCounts(result);
      }
    } catch (error) {
      console.error("Failed to fetch Tehsil:", error);
    }
  };

  // For server-side
  const [jamabandis, setJamabandis] = useState<Jamabandi[]>([]);
  const [total, setTotal] = useState(0);
  const [pageIndex, setPageIndex] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [sorting, setSorting] = useState<SortingState>([]);
  const [filters, setFilters] = useState<ColumnFiltersState>([]);
  const [globalFilter, setGlobalFilter] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [isLoading, setIsLoading] = useState(false); // Track loading state for the table



  // For server-side
  useEffect(() => {
    fetchLoggedInUser();
    if (selectedKhewat.id) {
      setIsLoading(true);
      setKhewatBubble(null); // reset bubble before fetch (optional)

      getJamabandi({
        pageIndex,
        pageSize,
        sorting,
        filters,
        globalFilter,
        filterStatus,
        selectedData,
      }).then((res) => {
        const processed = groupByKhasraAndKhata(res.data, setKhewatBubble);
        setJamabandis(processed);
        setTotal(res.total);
      }).catch((error) => {
        console.error("Error fetching jamabandi data:", error);
      }).finally(() => {
        setIsLoading(false);
      });
    }
  }, [pageIndex, pageSize, sorting, filters, globalFilter, selectedVillage, selectedLanguage, selectedKhewat, selectedKhata, selectedKhasra]);

  // const filteredData = async (countValue: string) => {
  //   setFilterStatus(countValue);
  //   getJamabandi({
  //     pageIndex,
  //     pageSize,
  //     sorting,
  //     filters,
  //     globalFilter,
  //     filterStatus,
  //     selectedData,
  //   }).then((res) => {
  //     setJamabandis(addSummaryRows(res.data));
  //     setTotal(res.total);
  //   });

  // }

  return (
    <section>
      <InnerHeader />

      <Main>
        <div className="mb-4 flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
          <h1 className="text-2xl font-bold tracking-tight sm:mb-0">
            {getGreetingWithName(auth?.name)}
          </h1>
          {isMasterAdmin && (
            <div className="flex justify-center sm:justify-end">
              <CreateAnnouncementDialog />
            </div>
          )}
        </div>

        <Tabs
          orientation="vertical"
          defaultValue="overview"
          className="space-y-4"
        >
          {/* <div className="w-full overflow-x-auto pb-2 text-right">
            <TabsList>
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="analytics" disabled>
                Analytics
              </TabsTrigger>
              <TabsTrigger value="reports" disabled>
                Reports
              </TabsTrigger>
              <TabsTrigger value="notifications" disabled>
                Notifications
              </TabsTrigger>
            </TabsList>
          </div> */}

          <TabsContent value="overview" className="space-y-4">

            {/* Counts Div */}
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total</CardTitle>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    className="text-muted-foreground h-4 w-4"
                  >
                    <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                  </svg>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {counts?.total_count}
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Approved
                  </CardTitle>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    className="text-muted-foreground h-4 w-4"
                  >
                    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                    <circle cx="9" cy="7" r="4" />
                    <path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
                  </svg>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {counts?.approved_count}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Rejected
                  </CardTitle>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    className="text-muted-foreground h-4 w-4"
                  >
                    <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
                  </svg>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {counts?.rejected_count}
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Pending</CardTitle>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    className="text-muted-foreground h-4 w-4"
                  >
                    <rect width="20" height="14" x="2" y="5" rx="2" />
                    <path d="M2 10h20" />
                  </svg>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {counts?.submitted_count}
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Verified</CardTitle>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    className="text-muted-foreground h-4 w-4"
                  >
                    <rect width="20" height="14" x="2" y="5" rx="2" />
                    <path d="M2 10h20" />
                  </svg>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {counts?.verified_count}
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Edited/Submitted</CardTitle>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    className="text-muted-foreground h-4 w-4"
                  >
                    <rect width="20" height="14" x="2" y="5" rx="2" />
                    <path d="M2 10h20" />
                  </svg>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {counts?.edited_count}
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Re-Submitted</CardTitle>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    className="text-muted-foreground h-4 w-4"
                  >
                    <rect width="20" height="14" x="2" y="5" rx="2" />
                    <path d="M2 10h20" />
                  </svg>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {counts?.resubmitted_count}
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Sent For Clarification</CardTitle>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    className="text-muted-foreground h-4 w-4"
                  >
                    <rect width="20" height="14" x="2" y="5" rx="2" />
                    <path d="M2 10h20" />
                  </svg>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {counts?.clarificationrequired_count}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Main heading & Datatable rendering */}
            <div className="grid grid-cols-1 gap-4">
              <Card className="col-span-1 lg:col-span-4">
                <CardContent className="pl-2">
                  <Main>
                    {/* Top Header NEW */}
                    <div className="mb-4 flex flex-col md:flex-row md:items-center md:justify-between gap-4">

                      {/* Heading + Language Dropdown on mobile */}
                      <div className="flex justify-between items-center w-full md:w-auto">
                        <div>
                          <h2 className="text-2xl font-bold tracking-tight">Jamabandi</h2>
                          <p className="text-muted-foreground">Manage jamabandi here.</p>
                        </div>

                        {/* Language dropdown visible only on small screens */}
                        <div className="md:hidden">
                          <LanguageDropdownButton
                            selectedLanguage={selectedLanguage}
                            setSelectedLanguage={setSelectedLanguage}
                            setSelectedData={setSelectedData}
                          />
                        </div>
                      </div>

                      {/* District / Tehsil / Village Selects + Language dropdown on md+ */}
                      <div className="flex flex-col sm:flex-row sm:flex-wrap gap-3 items-center">

                        {/* District */}
                        <Select
                          value={selectedDistrict}
                          onValueChange={(value) => {
                            setSelectedVillages("");
                            setSelectedTehsils("");
                            // Reset dependent selections
                            setSelectedKhewat({ id: "", no: "" });   // ✅ Reset Khewat
                            setSelectedKhata({ id: "", no: "" });    // ✅ Reset Khata
                            setSelectedKhasra({ id: "", no: "" });   // ✅ Reset Khasra

                            setSelectedData((prev) => ({
                              ...prev,
                              village: "",
                              khewat: "",
                              khata: "",
                              khasra: "",
                            }));

                            setSelectedDistrict(value);
                            fetchTehsil(value);
                          }}
                          disabled={isTehsildar || isPatwari || isNaibTehsildar}
                        >
                          <SelectTrigger className="w-full sm:w-48">
                            <SelectValue placeholder="Select District" />
                          </SelectTrigger>
                          <SelectContent>
                            {districts.map((district) => (
                              <SelectItem
                                key={district.distId}
                                value={district.distId.toString()}
                              >
                                {district.distNameE} / {district.distNameU}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>

                        {/* Tehsil */}
                        <Select
                          value={selectedTehsils}
                          onValueChange={(value) => {
                            setSelectedTehsils(value);
                            setSelectedVillages("");
                            // Reset dependent selections
                            setSelectedKhewat({ id: "", no: "" });   // ✅ Reset Khewat
                            setSelectedKhata({ id: "", no: "" });    // ✅ Reset Khata
                            setSelectedKhasra({ id: "", no: "" });   // ✅ Reset Khasra

                            setSelectedData((prev) => ({
                              ...prev,
                              village: "",
                              khewat: "",
                              khata: "",
                              khasra: "",
                            }));

                            fetchVillages(value);

                          }}
                          disabled={isTehsildar || isPatwari || isNaibTehsildar}
                        >
                          <SelectTrigger className="w-full sm:w-48">
                            <SelectValue placeholder="Select Tehsil" />
                          </SelectTrigger>
                          <SelectContent>
                            {tehsils.map((teh) => (
                              <SelectItem
                                key={teh.tehId}
                                value={teh.tehId.toString()}
                              >
                                {teh.tehNameE} / {teh.tehNameU}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>

                        {/* Village */}
                        <Select
                          value={selectedVillage}
                          onValueChange={(value) => {
                            setSelectedVillages(value);

                            // Reset dependent selections
                            setSelectedKhewat({ id: "", no: "" });   // ✅ Reset Khewat
                            setSelectedKhata({ id: "", no: "" });    // ✅ Reset Khata
                            setSelectedKhasra({ id: "", no: "" });   // ✅ Reset Khasra

                            setSelectedData((prev) => ({
                              ...prev,
                              village: value,
                              khewat: "",
                              khata: "",
                              khasra: "",
                            }));

                            fetchKhewatByVillage(value);

                            setFilters((oldFilters) => {
                              const currentFilters = Array.isArray(oldFilters) ? oldFilters : [];
                              const withoutVillage = currentFilters.filter((f) => f.id !== "village");
                              return [...withoutVillage, { id: "village", value }];
                            });
                          }}
                          disabled={isPatwari}
                        >
                          <SelectTrigger className="w-full sm:w-48">
                            <SelectValue placeholder="Select Village" />
                          </SelectTrigger>
                          <SelectContent>
                            {villages.map((vill) => (
                              <SelectItem key={vill.villId} value={vill.villId.toString()}>
                                {vill.villNameE} / {vill.villNameU}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>

                        {/* Khewat */}
                        <div>
                          <Label>Khewat Number</Label>
                          <ReactSelect
                            options={khewat.map((kh) => ({
                              value: kh.khewatid, // ID
                              label: kh.khewatno, // Khewat No
                            }))}
                            value={
                              selectedKhewat.id
                                ? {
                                  value: selectedKhewat.id,
                                  label: selectedKhewat.no,
                                }
                                : null
                            }
                            onChange={(option) => {
                              if (!option) return;
                              // Store both ID and No (label) in the state
                              setSelectedKhewat({ id: option.value, no: option.label });
                              setSelectedData((prev) => ({
                                ...prev,
                                khewat: option.value.toString(),
                                khata: "",
                                khasra: ""
                              }));
                              fetchKhataByKhewat(option.value.toString()); // Fetch Khata data based on Khewat ID
                              setSelectedKhata({ id: "", no: "" }); // Reset Khata selection
                              setSelectedKhasra({ id: "", no: "" }); // Reset Khasra selection
                            }}
                            placeholder="Select Khewat Number"
                            className="w-full sm:w-48 md:w-64 lg:w-full text-sm"
                            classNamePrefix="react-select"
                            menuPlacement="auto"
                          />
                        </div>
                        {/* Khata */}
                        <div>
                          <Label>Khata Number</Label>
                          <ReactSelect
                            options={khata.map((ka) => ({
                              value: ka.khataid, // ID
                              label: ka.khatano, // Khata No
                            }))}
                            value={
                              selectedKhata.id
                                ? {
                                  value: selectedKhata.id,
                                  label: selectedKhata.no,
                                }
                                : null
                            }
                            onChange={(option) => {
                              if (!option) return;
                              // Store both ID and No (label) in the state
                              setSelectedKhata({ id: option.value, no: option.label });
                              setSelectedData((prev) => ({
                                ...prev,
                                khata: option.value.toString(),
                                khasra: ""
                              }));
                              fetchKhasraByKhata(option.value.toString()); // Fetch Khasra data based on Khata ID
                              setSelectedKhasra({ id: "", no: "" }); // Reset Khasra selection
                            }}
                            placeholder="Select Khata Number"
                            className="w-full sm:w-48 md:w-64 lg:w-full text-sm"
                            classNamePrefix="react-select"
                            menuPlacement="auto"
                          />
                        </div>

                        {/* Khasra */}
                        <div>
                          <Label>Khasra Number</Label>
                          <ReactSelect
                            options={khasra.map((ks) => ({
                              value: ks.khasraid, // ID
                              label: ks.khasrano, // Khasra No
                            }))}
                            value={
                              selectedKhasra.id
                                ? {
                                  value: selectedKhasra.id,
                                  label: selectedKhasra.no,
                                }
                                : null
                            }
                            onChange={(option) => {
                              if (!option) return;
                              // Store both ID and No (label) in the state
                              setSelectedKhasra({ id: option.value, no: option.label });
                              setSelectedData((prev) => ({
                                ...prev,
                                khasra: option.value.toString(),
                              }));
                            }}
                            placeholder="Select Khasra Number"
                            className="w-full sm:w-48 md:w-64 lg:w-full text-sm"
                            classNamePrefix="react-select"
                            menuPlacement="auto"
                          />
                        </div>

                        {/* Language dropdown visible only on md and up */}
                        <div className="hidden md:block self-start">
                          <LanguageDropdownButton
                            selectedLanguage={selectedLanguage}
                            setSelectedLanguage={setSelectedLanguage}
                            setSelectedData={setSelectedData}
                          />
                        </div>
                      </div>
                    </div>


                    <div className="-mx-4 flex-1 overflow-auto px-4 py-1 lg:flex-row lg:space-y-0 lg:space-x-12">
                      {/* {selectedVillage && <ServerSideDataTable fetchData={fetchJamabandi} testFilter={selectedData} />} */}

                      {selectedKhewat.id && (
                        <DataTable
                          columns={jamabandiColumns}
                          data={jamabandis}
                          pageCount={Math.ceil(total / pageSize)}
                          totalRows={total}
                          state={{
                            sorting,
                            columnFilters: filters,
                            globalFilter,
                          }}
                          isLoading={isLoading} // Set the loading state here
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
                      )}
                    </div>

                    {khewatBubble && (
                      <motion.div
                        drag
                        dragMomentum={false}
                        whileHover={{ scale: 1.08 }}
                        whileTap={{ scale: 0.95 }}
                        className="fixed bottom-6 right-6
               backdrop-blur-md bg-gradient-to-r from-indigo-500/90 to-blue-500/90
               text-white px-6 py-4 rounded-2xl shadow-xl z-50
               flex flex-col sm:flex-row items-center gap-2 sm:gap-3
               cursor-move select-none border border-white/20"
                        style={{
                          boxShadow: "0 8px 20px rgba(59, 130, 246, 0.4)",
                        }}
                      >
                        <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 text-sm font-medium">
                          {khewatBubble.no && (
                            <span className="text-white/90 font-semibold tracking-wide">
                              🏡 Khewat&nbsp;
                              <span className="font-bold text-white">{khewatBubble.no}</span>
                            </span>
                          )}
                          <span className="hidden sm:inline text-white/70">•</span>
                          <div className="flex items-center gap-2">
                            <span className="bg-white/20 rounded-full px-3 py-1 text-xs font-semibold">
                              Marla: <span className="text-white">{khewatBubble.marla.toFixed(2)}</span>
                            </span>
                            <span className="bg-white/20 rounded-full px-3 py-1 text-xs font-semibold">
                              Kanal: <span className="text-white">{khewatBubble.kanal.toFixed(2)}</span>
                            </span>
                          </div>
                        </div>
                      </motion.div>
                    )}

                  </Main>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </Main>
    </section>
  );
};

export default Dashboard;
