"use client";

import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";
import { axiosPrivate } from "@/axios/axios";
import { d, e } from "@/components/utils/crypto";
import ReactSelect from "react-select";

interface BacklogMutationFormProps {
    districtId: string;
    tehsilId: string;
    villageId: string;
    onSuccess?: () => void; // ✅ new callback for dialog auto-close
}

export default function BacklogMutationForm({
    districtId,
    tehsilId,
    villageId,
    onSuccess,
}: BacklogMutationFormProps) {
    // Define types
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
    type SoilTypes = {
        soilId: string;
        soilNameE: string;
        soilNameU: string;
    };
    type MutationTypes = {
        mut_id: number;
        mut_type_e: string;
        mut_type_u: string;
    };

    // Create hooks & map types
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
    const [soilType, setSoilType] = useState<SoilTypes[]>([]);
    const [selectedSoilType, setSelectedSoilType] = useState<{
        id: string | number;
        no: string;
    }>({ id: "", no: "" });
    const [mutType, setMutType] = useState<MutationTypes[]>([]);
    const [selectedMutType, setSelectedMutType] = useState<{
        id: string | number;
        no: string;
    }>({ id: "", no: "" });

    // Khewat API
    const fetchKhewatByVillage = async () => {
        try {
            const param = {
                villageId: villageId,
            };
            const response = await axiosPrivate.post(
                "/api/v1/get-khewat-by-village",
                await e(param)
            );
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
                villageId: villageId,
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
                villageId: villageId,
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

    // Mutation & Soil Type API
    const fetchOptions = async () => {
        try {
            const soilRes = await axiosPrivate.post("/api/v1/get-soil-type");
            const mutRes = await axiosPrivate.post("/api/v1/get-mutation-type");

            if (soilRes?.status === 200)
                setSoilType(JSON.parse(await d(soilRes.data)));
            // console.log(JSON.parse(await d(soilRes.data)));
            if (mutRes?.status === 200) setMutType(JSON.parse(await d(mutRes.data)));
            // console.log(JSON.parse(await d(mutRes.data)));
        } catch (err) {
            console.error("Options fetch failed", err);
        }
    };

    // used useEffect for onload call for khewat & Mutation & Soil Type.
    useEffect(() => {
        fetchKhewatByVillage();
        fetchOptions();
    }, []);

    if (!districtId || !tehsilId || !villageId) {
        return (
            <Card className="mt-6">
                <CardContent className="py-6 text-center text-muted-foreground">
                    Please select <strong>District</strong>, <strong>Tehsil</strong> and{" "}
                    <strong>Village</strong> above to proceed with mutation entry.
                </CardContent>
            </Card>
        );
    }

    const handleMutationEntrySubmit = async (
        ee: React.FormEvent<HTMLFormElement>
    ) => {
        ee.preventDefault();
        try {
            const formData = new FormData(ee.currentTarget);
            const data = Object.fromEntries(formData.entries());

            // Manually add ReactSelect values
            data["old_khewat_no"] = selectedKhewat.no;
            data["old_khewat_id"] = selectedKhewat.id.toString();
            data["old_khata_no"] = selectedKhata.no;
            data["old_khata_id"] = selectedKhata.id.toString();
            data["old_khasra_no"] = selectedKhasra.no;
            data["old_khasra_id"] = selectedKhasra.id.toString();
            data["mutation_type"] = selectedMutType.no;
            data["mut_type_id"] = selectedMutType.id.toString();
            data["soil_type"] = selectedSoilType.no;
            data["soil_type_id"] = selectedSoilType.id.toString();

            // Simulate API call (replace with real fetch/axios call)
            // console.log("Submitted Data:", data);

            try {
                const res = await axiosPrivate.post(
                    "/api/v1/backlog-mutation-entry",
                    await e({ mutation: data })
                );
                if (res?.status === 200) {
                    const result = JSON.parse(await d(res.data));
                    toast.success(result?.message);
                }
            } catch (error) {
                console.error("Upload failed", error);
                // Check if error is due to status code 429
                if (error.response && error.response.status === 429) {
                    toast.error(error?.response.data);
                } else {
                    toast.error("Upload failed", {
                        description: "Something went wrong while uploading the file.",
                    });
                }
            }

            onSuccess?.(); // ✅ auto-close dialog
        } catch (err: any) {
            toast.error("Something went wrong!");
        }
    };

    return (
        <>
            <form
                onSubmit={handleMutationEntrySubmit}
                className="grid grid-cols-1 gap-4 md:grid-cols-2"
            >
                {/* Hidden IDs */}
                <Input type="hidden" name="district_id" value={districtId} />
                <Input type="hidden" name="tehsil_id" value={tehsilId} />
                <Input type="hidden" name="village_id" value={villageId} />

                {/* Entry Date */}
                <div className="col-span-1 md:col-span-2">
                    <Label>Entry Date & Time</Label>
                    <Input
                        name="entry_datetime"
                        value={new Date().toISOString().slice(0, 19).replace("T", " ")}
                        readOnly
                        className="mt-1 w-full cursor-not-allowed"
                    />
                </div>

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
                            fetchKhasraByKhata(option.value.toString()); // Fetch Khasra data based on Khata ID
                            setSelectedKhasra({ id: "", no: "" }); // Reset Khasra selection
                        }}
                        placeholder="Select Khata Number"
                        className="w-full sm:w-48 md:w-64 lg:w-full text-sm"
                        classNamePrefix="react-select"
                        menuPlacement="auto"
                    />
                </div>

                <div>
                    <Label>New Khata Number</Label>
                    <Input name="new_khata_no" required className="mt-1 w-full" placeholder="Enter new khata" />
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
                        }}
                        placeholder="Select Khasra Number"
                        className="w-full sm:w-48 md:w-64 lg:w-full text-sm"
                        classNamePrefix="react-select"
                        menuPlacement="auto"
                    />
                </div>

                {/* New Khasra */}
                <div>
                    <Label>New Khasra Number</Label>
                    <Input
                        name="new_khasra_no"
                        placeholder="Enter new khasra if splitting"
                        className="mt-1 w-full"
                    />
                </div>

                {/* Mutation Type */}
                <div>
                    <Label>Mutation Type</Label>
                    <ReactSelect
                        options={mutType.map((mt) => ({
                            value: mt.mut_id, // ID
                            label: `${mt.mut_type_e} / ${mt.mut_type_u}`, // Mutation Type
                        }))}
                        value={
                            selectedMutType.id
                                ? {
                                    value: selectedMutType.id,
                                    label: `${selectedMutType.no}`,
                                }
                                : null
                        }
                        onChange={(option) => {
                            if (!option) return;
                            // Store both ID and No (label) in the state
                            setSelectedMutType({ id: option.value, no: option.label });
                        }}
                        placeholder="Select Mutation Type"
                        className="w-full sm:w-48 md:w-64 lg:w-full text-sm"
                        classNamePrefix="react-select"
                        menuPlacement="auto"
                    />
                </div>

                <div>
                    <Label>Mutation Number</Label>
                    <Input name="mutation_number" required className="mt-1 w-full" />
                </div>

                {/* Mutation Date */}
                <div>
                    <Label>Mutation Date</Label>
                    <Input
                        type="date"
                        name="mutation_date"
                        required
                        className="mt-1 w-full"
                    />
                </div>

                {/* Owner */}
                <div>
                    <Label>Owner Name (Cultivator)</Label>
                    <Input name="owner_name" className="mt-1 w-full" />
                </div>

                {/* Area */}
                <div>
                    <Label>Area Kanal</Label>
                    <Input
                        type="number"
                        step="0.01"
                        name="area_kanal"
                        className="mt-1 w-full"
                    />
                </div>
                <div>
                    <Label>Area Marla</Label>
                    <Input
                        type="number"
                        step="0.01"
                        name="area_marla"
                        className="mt-1 w-full"
                    />
                </div>

                {/* Soil Type */}
                <div>
                    <Label>Qism Zameen (Soil Type)</Label>
                    <ReactSelect
                        options={soilType.map((sl) => ({
                            value: sl.soilId, // ID
                            label: `${sl.soilNameE} / ${sl.soilNameU}`, // Soil Type Name
                        }))}
                        value={
                            selectedSoilType.id
                                ? {
                                    value: selectedSoilType.id,
                                    label: `${selectedSoilType.no}`,
                                }
                                : null
                        }
                        onChange={(option) => {
                            if (!option) return;
                            // Store both ID and No (label) in the state
                            setSelectedSoilType({ id: option.value, no: option.label });
                        }}
                        placeholder="Select Qism Zameen (Soil Type)"
                        className="w-full sm:w-48 md:w-64 lg:w-full text-sm"
                        classNamePrefix="react-select"
                        menuPlacement="auto"
                    />
                </div>

                {/* Patwari */}
                <div>
                    <Label>Patwari Name</Label>
                    <Input
                        name="patwari_name"
                        placeholder="Enter Patwari Name"
                        required
                        className="mt-1 w-full"
                    />
                </div>

                {/* Remarks */}
                <div className="col-span-1 md:col-span-2">
                    <Label>Remarks (Column 12)</Label>
                    <Textarea name="remarks" className="mt-1 w-full" />
                </div>

                <div className="col-span-1 md:col-span-2 flex justify-center">
                    <Button type="submit" className="w-full sm:w-auto">
                        Save Mutation
                    </Button>
                </div>
            </form>
        </>
    );
}
