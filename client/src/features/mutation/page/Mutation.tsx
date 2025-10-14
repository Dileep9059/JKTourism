import { Main } from "@/components/layout/main";
import { Sun, CloudSun, Moon } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import useAuth from "@/hooks/useAuth";
import type { AuthType } from "@/context/AuthProvider";

import { useEffect, useState } from "react";
import { axiosPrivate } from "@/axios/axios";
import { d, e } from "@/components/utils/crypto";

import type { ColumnFiltersState, SortingState } from "@tanstack/react-table";
import { backlogMutationColumns, type BacklogMutation } from "@/features/jamabandi/columns";
import { DataTable } from "@/features/jamabandi/data-table";
import { InnerHeader } from "@/components/layout/structure/InnerHeader";
import BacklogMutationForm from "@/features/mutation/component/BacklogMutationForm";

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";
import ReactSelect from "react-select";


interface ServerData<T> {
    data: T[];
    total: number;
    filteredTotal: number;
}

async function getBackLogMutationEntry({
    pageIndex,
    pageSize,
    sorting,
    filters,
    selectedData,
    globalFilter,
}: {
    pageIndex: number;
    pageSize: number;
    sorting: SortingState;
    filters: ColumnFiltersState;
    selectedData: {
        district: string;
        tehsil: string;
        village: string;
    };
    globalFilter: string;
}): Promise<ServerData<BacklogMutation>> {
    const params = {
        page: pageIndex,
        size: pageSize,
        sortField: sorting[0]?.id || "id",
        sortDirection: sorting[0]?.desc ? "DESC" : "ASC",
        search: globalFilter || "",
        status: filters.find((f) => f.id === "status")?.value || "",
        //   filters:filters,
        selectedData,
        draw: 1,
    };

    const res = await axiosPrivate.post(`/api/v1/get-backlog-mutation`, await e(params));
    const parsed = JSON.parse(await d(res.data));
    // console.log('DATA: ', parsed);
    return {
        data: parsed.data,
        total: parsed.recordsTotal,
        filteredTotal: parsed.recordsFiltered,
    };
}


const Mutation = () => {
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

    const [districts, setDistricts] = useState<District[]>([]); // list from API
    const [selectedDistrict, setSelectedDistrict] = useState<string>(""); // chosen district

    const [tehsils, setTehsils] = useState<Tehsil[]>([]);
    const [selectedTehsils, setSelectedTehsils] = useState<string>(""); // chosen tehsil

    const [villages, setVillages] = useState<village[]>([]);
    const [selectedVillage, setSelectedVillages] = useState<string>(""); // chosen village

    const [openDialog, setOpenDialog] = useState(false); // for backlog mutation entry form

    const [selectedData, setSelectedData] = useState({
        district: "",
        tehsil: "",
        village: "",
    });

    const { auth } = useAuth() as { auth: AuthType };
    const roles = auth?.roles ?? [];
    const isPatwari = roles.includes("ROLE_PATWARI");
    const isMasterAdmin = roles.includes("ROLE_MASTER_ADMIN");

    const [counts, setCounts] = useState({
        total_count: 0,
        approved_count: 0,
        rejected_count: 0,
        updated_count: 0,
    });

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

    const fetchLoggedInUser = async () => {
        try {
            const response = await axiosPrivate.post("/api/v1/get-loggedin-user");
            if (response?.status === 200) {
                const result = JSON.parse(await d(response.data));
                // console.log(result)
                if (result.roles[0].name == "ROLE_PATWARI") {
                    const districtId = result.districtId?.toString() || "";
                    const tehsilId = result.tehsilId?.toString() || "";
                    const villId = result.villageId?.toString() || "";

                    setSelectedData((prev) => ({
                        ...prev,
                        village: villId,
                    }));

                    setSelectedDistrict(districtId);
                    setSelectedTehsils(tehsilId);
                    setSelectedVillages(villId);
                    fetchDistricts();
                    fetchTehsil(districtId);
                    fetchVillages(tehsilId);
                } else if (isMasterAdmin) {
                    fetchDistricts();
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
    const [backlogmutation, setBacklogMutation] = useState<BacklogMutation[]>([]);
    const [total, setTotal] = useState(0);
    const [pageIndex, setPageIndex] = useState(0);
    const [pageSize, setPageSize] = useState(10);
    const [sorting, setSorting] = useState<SortingState>([]);
    const [filters, setFilters] = useState<ColumnFiltersState>([]);
    const [globalFilter, setGlobalFilter] = useState("");

    const fetchMutationData = async () => {
        if (!selectedVillage) return;

        const res = await getBackLogMutationEntry({
            pageIndex,
            pageSize,
            sorting,
            filters,
            globalFilter,
            selectedData,
        });

        setBacklogMutation(res.data);
        setTotal(res.total);
    };


    // For server-side
    useEffect(() => {
        jamabandiCount();
        fetchLoggedInUser();
        fetchDistricts();
        if (selectedVillage) {
            fetchMutationData();
        }
    }, [pageIndex, pageSize, sorting, filters, globalFilter, selectedVillage]);

    return (
        <section>
            <InnerHeader />

            <Main>
                <div className="mb-2 flex items-center justify-between space-y-2">
                    <h1 className="text-2xl font-bold tracking-tight mb-4">
                        {getGreetingWithName(auth?.name)}
                    </h1>

                </div>
                <Tabs
                    orientation="vertical"
                    defaultValue="overview"
                    className="space-y-4"
                >


                    <TabsContent value="overview" className="space-y-4">

                        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">

                            <Card>
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <CardTitle className="text-sm font-medium">Total Mutations</CardTitle>
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
                                        Mutation Types
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
                                    <CardTitle className="text-sm font-medium">Total Area (Kanal/Marla)</CardTitle>
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
                                        {counts?.updated_count}
                                    </div>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <CardTitle className="text-sm font-medium">
                                        Most Recent Mutation
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

                        </div>


                        <div className="grid grid-cols-1 gap-4">
                            <Card className="col-span-1 lg:col-span-4">
                                <CardContent className="pl-2">
                                    <Main>
                                        {/* Top Header */}
                                        <div className="mb-4 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                                            {/* Heading */}
                                            <div>
                                                <h2 className="text-2xl font-bold tracking-tight">
                                                    Mutation Tracker & Entry
                                                </h2>
                                            </div>

                                            {/* District / Tehsil / Village Selects */}
                                            <div className="flex flex-col sm:flex-row sm:flex-wrap gap-3">

                                                {/* District */}
                                                <ReactSelect
                                                    options={districts.map((dist) => ({ value: dist.distId, label: `${dist.distNameE} / ${dist.distNameU}` }))}
                                                    value={
                                                        selectedDistrict
                                                            ? (() => {
                                                                const dist = districts.find(
                                                                    (d) => d.distId.toString() === selectedDistrict
                                                                );
                                                                return dist
                                                                    ? { value: dist.distId, label: `${dist.distNameE} / ${dist.distNameU}` }
                                                                    : null;
                                                            })()
                                                            : null
                                                    }
                                                    onChange={(option) => {
                                                        if (!option) return;
                                                        setSelectedDistrict(option.value.toString());
                                                        if (isMasterAdmin) { fetchTehsil(option.value.toString()) }
                                                    }}
                                                    isDisabled={isPatwari}
                                                    placeholder="Select District"
                                                    className="w-full sm:w-48 text-sm"
                                                    classNamePrefix="react-select"
                                                    menuPlacement="auto"
                                                />

                                                {/* Tehsil */}
                                                <ReactSelect
                                                    options={tehsils.map((teh) => ({ value: teh.tehId, label: `${teh.tehNameE} / ${teh.tehNameU}` }))}
                                                    value={
                                                        selectedTehsils
                                                            ? (() => {
                                                                const teh = tehsils.find(
                                                                    (t) => t.tehId.toString() === selectedTehsils
                                                                );
                                                                return teh
                                                                    ? { value: teh.tehId, label: `${teh.tehNameE} / ${teh.tehNameU}` }
                                                                    : null;
                                                            })()
                                                            : null
                                                    }
                                                    onChange={(option) => {
                                                        if (!option) return;
                                                        setSelectedTehsils(option.value.toString());
                                                        setSelectedVillages("");
                                                        fetchVillages(option.value.toString());
                                                    }}
                                                    isDisabled={isPatwari}
                                                    placeholder="Select Tehsil"
                                                    className="w-full sm:w-48 text-sm"
                                                    classNamePrefix="react-select"
                                                    menuPlacement="auto"
                                                />

                                                {/* Village */}
                                                <ReactSelect
                                                    options={villages.map((vill) => ({ value: vill.villId, label: `${vill.villNameE} / ${vill.villNameU}` }))}
                                                    value={
                                                        selectedVillage
                                                            ? (() => {
                                                                const vill = villages.find(
                                                                    (t) => t.villId.toString() === selectedVillage
                                                                );
                                                                return vill
                                                                    ? { value: vill.villId, label: `${vill.villNameE} / ${vill.villNameU}` }
                                                                    : null;
                                                            })()
                                                            : null
                                                    }
                                                    onChange={(option) => {
                                                        if (!option) return;
                                                        setSelectedVillages(option.value.toString());
                                                        setSelectedData((prev) => ({
                                                            ...prev,
                                                            village: option.value.toString(),
                                                        }));

                                                        setFilters((oldFilters) => {
                                                            const currentFilters = Array.isArray(oldFilters) ? oldFilters : [];
                                                            const withoutVillage = currentFilters.filter((f) => f.id !== "village");
                                                            return [...withoutVillage, { id: "village", value: option.value.toString() }];
                                                        });
                                                    }}
                                                    isDisabled={isPatwari}
                                                    placeholder="Select Village"
                                                    className="w-full sm:w-48 text-sm"
                                                    classNamePrefix="react-select"
                                                    menuPlacement="auto"
                                                />

                                                {/* Add Mutation button + dialog */}
                                                {isPatwari && selectedVillage && (
                                                    <Dialog open={openDialog} onOpenChange={setOpenDialog}>
                                                        <DialogTrigger asChild>
                                                            <Button variant="default">Add Mutation</Button>
                                                        </DialogTrigger>
                                                        <DialogContent className="sm:max-w-[90vw] max-h-[90vh] overflow-y-auto">
                                                            <DialogHeader>
                                                                <DialogTitle>Add Mutation</DialogTitle>
                                                            </DialogHeader>
                                                            <BacklogMutationForm
                                                                districtId={selectedDistrict}
                                                                tehsilId={selectedTehsils}
                                                                villageId={selectedVillage}
                                                                onSuccess={() => {
                                                                    setTimeout(() => {
                                                                        setOpenDialog(false);
                                                                        fetchMutationData();
                                                                    }, 500); // .5 seconds delay (500ms)
                                                                }}
                                                            />
                                                        </DialogContent>
                                                    </Dialog>
                                                )}

                                            </div>
                                        </div>


                                        <div className="-mx-4 flex-1 overflow-auto px-4 py-1 lg:flex-row lg:space-y-0 lg:space-x-12">

                                            {selectedVillage && (
                                                <DataTable
                                                    columns={backlogMutationColumns}
                                                    data={backlogmutation}
                                                    pageCount={Math.ceil(total / pageSize)}
                                                    totalRows={total}
                                                    state={{
                                                        sorting,
                                                        columnFilters: filters,
                                                        globalFilter,
                                                    }}
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

export default Mutation;
