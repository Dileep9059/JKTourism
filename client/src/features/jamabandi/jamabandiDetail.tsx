import { axiosPrivate } from "@/axios/axios";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { d, e } from "@/components/utils/crypto";
import type { AuthType } from "@/context/AuthProvider";
import useAuth from "@/hooks/useAuth";
import { MoreHorizontal } from "lucide-react";
import { useEffect, useState, useCallback } from "react";
import JamabandiHistory from "./jamabandi-history";
import type { ColumnDef } from "@tanstack/react-table";
import type { Jamabandi } from "./columns";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import ReactSelect from "react-select";
import { toast } from "sonner";


// ---- Types
type SoilTypes = {
    soilId: string;
    soilNameU: string;
    soilNameE: string;
    soildtid: string;
};
type MutationTypes = {
    mut_id: number;
    mut_type_u: string;
    mut_type_e: string;
};

type MutationDetails = {
    mutdtl_id: string,
    mut_no: string
}

type Clarifications = {
    remark: string,
    name: string
}

// ---- Optimized Component
const JamabandiActions: React.FC<{ record: any }> = ({ record }) => {

    // console.log(record)

    const [open, setOpen] = useState(false);
    const [historyId, setHistoryId] = useState<string | null>(null);
    const [isEditable, setIsEditable] = useState(false);
    const [errors, setErrors] = useState<{ [key: string]: string }>({});
    const [isButtonDisabled, setIsButtonDisabled] = useState(false);


    const [soilType, setSoilType] = useState<SoilTypes[]>([]);
    const [mutType, setMutType] = useState<MutationTypes[]>([]);

    // Split states instead of deep object
    const [khewatId, setKhewatId] = useState("");
    const [khasraId, setkhasraId] = useState("");
    const [khataId, setkhataId] = useState("");

    const [mutationDetails, setMutationDetails] = useState<MutationDetails[]>([]);

    const [khewatNo, setKhewatNo] = useState("");
    const [khasraNo, setKhasraNo] = useState("");
    const [khataNo, setKhataNo] = useState("");
    const [areaKanal, setAreaKanal] = useState("");
    const [areaMarla, setAreaMarla] = useState("");
    const [ownerStr, setOwnerStr] = useState("");
    const [patti, setPatti] = useState("");
    const [kastStr, setKastStr] = useState("");
    const [remark, setRemark] = useState("");
    const [jamabandiStatus, setJamabandiStatus] = useState("")
    //const [action, setAction] = useState("");

    const [selectedSoilType, setSelectedSoilType] = useState<{ soil_id: string; soil_name_u: string, soil_name_e: string; soildetid: string, area_kanal: number, area_marla: number }[]>([]);
    const [selectedMutationType, setSelectedMutationType] = useState<{ mut_no: string; mut_type: string; mutdtl_id: string; mut_type_e: string }[]>([]);
    const [isMutExist, setIsMutExist] = useState<boolean>(false);
    const [isKastStrExist, setIsKastStrExist] = useState<boolean>(false);
    const [clarification, setClarification] = useState<Clarifications[]>([]);


    const { auth } = useAuth() as { auth: AuthType };
    const roles = auth?.roles ?? [];
    const isTehsildar = roles.includes("ROLE_TEHSILDAR");
    const isPatwari = roles.includes("ROLE_PATWARI");
    const isNaibTehsildar = roles.includes("ROLE_NAIB_TEHSILDAR");


    // ---- API Fetchers
    const fetchDetail = useCallback(async () => {
        try {

            const param = {
                khasraId: record.id.toUpperCase(),
                //   soilTypeId: record.soil_typ_id
            }

            //  console.log("dd dd  ", param)
            const response = await axiosPrivate.post("/api/v1/get-jamabandi-by-khasra", await e({ param }));
            if (response?.status === 200) {
                const result = JSON.parse(await d(response.data));

                console.log(result)

                setKhewatNo(result.khewat.khewat_no || "");
                setKhewatId(result.khewat.khewat_id)
                setkhasraId(result.khasra.khasra_id)
                setkhataId(result.khata.kh_khata_id)
                setKhasraNo(result.khasra.khasra_no || "");
                setKhataNo(result.khata.khata_no || "");
                //   setAreaKanal(result.soilType[0].area_kanal?.toString() || "");
                //  setAreaMarla(result.soilType[0].area_marla?.toString() || "");
                setOwnerStr(result.khewat.owner_str || "");
                setPatti(result.khewat.taraf_patti_nm || "");
                setKastStr(result.khata.kast_str || "");
                setRemark(result.remark || "");
                // setSelectedSoilType(result.soilType.soil_id?.to || "");
                setSelectedSoilType(result.soilType || []);
                // setSelectedMutationType(result.mutation.mut_id?.toString() || "");
                setSelectedMutationType(result.mutationDetail || [])
                setMutationDetails(result.mutationDetail)
                setJamabandiStatus(result.khasra.status)
                setClarification(result.clarification);


                if (result.khata.kast_str && result.khata.kast_str.trim() !== "") {
                    setIsKastStrExist(true)
                }

                if (selectedMutationType) {
                    setIsMutExist(true);
                }

            }
        } catch (err) {
            console.error("Failed: ", err);
        }
    }, [record.id]);

    const fetchOptions = async () => {
        try {
            const soilRes = await axiosPrivate.post("/api/v1/get-soil-type");
            const mutRes = await axiosPrivate.post("/api/v1/get-mutation-type");

            if (soilRes?.status === 200) setSoilType(JSON.parse(await d(soilRes.data)));
            if (mutRes?.status === 200) setMutType(JSON.parse(await d(mutRes.data)));
        } catch (err) {
            console.error("Options fetch failed", err);
        }
    };

    // useEffect(() => {


    // }, []);

    // ---- Handlers
    const handleOpen = useCallback(
        (value: string) => {
            if (value === "Details") {
                fetchOptions();
                fetchDetail();
                setOpen(true);
                setIsEditable(false);
                setErrors({});
                setIsButtonDisabled(false);

            } else {
                setHistoryId(record.id);
            }

        },
        [fetchDetail, record.id]
    );

    const handleEditClick = () => {
        setIsEditable(true);
        setIsButtonDisabled(true);
    };

    const handleSave = useCallback(
        async (action: string) => {
            if (!validateForm()) {
                alert("Please fill all required fields correctly.");
                return; // Stop updating
            }
            const payload = {
                khewatId,
                khasraId,
                khataId,
                khewatNo,
                khasraNo,
                khataNo,
                // areaKanal,
                //  areaMarla,
                ownerStr,
                kastStr,
                remark,
                selectedSoilType,
                selectedMutationType,
                mutationDetails,
                action,
                patti
            };

           // console.log("payload  ", payload)
            try {
                const res = await axiosPrivate.post("/api/v1/update-jamabandi", await e({ jamabandi: payload }));
                
                if (res?.status === 200) {
                    const result = JSON.parse(await d(res.data));
                    if (result?.statusCode === "1") {
                        toast.success(result?.message);
                        setOpen(false)
                        
                        // window.location.reload();
                    } else {
                        toast.error(result?.message);
                    }
                }
            } catch (error:any) {
                            console.error("Upload failed", error);
                            // Check if error is due to status code 429
                            if (error?.response && error?.response?.status === 429) {
                                toast.error(error?.response?.data);
                            } else {
                                toast.error("Upload failed", {
                                    description: "Something went wrong.",
                                });
                            }
                        }
        },
        [khewatId, khasraId, khataId, khewatNo, khasraNo, khataNo, ownerStr, kastStr, remark, selectedSoilType, selectedMutationType, mutationDetails]
    );


    // const handleMutationChange = (index: number, field: string, value: string) => {
    //     console.log("value  ",value)
    //     setMutationDetails((prev) => {
    //         const updated = [...prev];
    //         updated[index] = { ...updated[index], [field]: value };
    //         return updated;
    //     });
    // };

    const validateText = (value: string) => {
        // English, Urdu (Arabic range), numbers, spaces, common punctuation + slash
        return /^[\u0600-\u06FFa-zA-Z0-9\s.,،!?()'"\-\/]*$/.test(value);
    };

    // Allow only numbers
    const validateNumber = (value: string) => {
        return /^[0-9]*\.?[0-9]*$/.test(value);
    };


    const isEmpty = (value: string) => value.trim() === "";

    const validateForm = () => {
        let valid = true;
        const newErrors: { [key: string]: string } = {};

        // Khewat No
        if (!khewatNo.trim()) {
            newErrors.khewatNo = "Khewat No is required";
            valid = false;
        }

        // Khasra No
        if (!khasraNo.trim()) {
            newErrors.khasraNo = "Khasra No is required";
            valid = false;
        }

        // Khata No
        if (!khataNo.trim()) {
            newErrors.khataNo = "Khata No is required";
            valid = false;
        }

        // Area Kanal & Marla
        // if (!areaKanal.trim() || !/^\d+(\.\d+)?$/.test(areaKanal)
        // ) {
        //     newErrors.areaKanal = "Valid Area (Kanal) is required";
        //     valid = false;
        // }
        // if (!areaMarla.trim() || !/^\d+(\.\d+)?$/.test(areaMarla)
        // ) {
        //     newErrors.areaMarla = "Valid Area (Marla) is required";
        //     valid = false;
        // }

        // Owner & Cultivator
        if (!ownerStr.trim()) {
            newErrors.ownerStr = "Owner is required";
            valid = false;
        }


        if (isKastStrExist) {
            if (!kastStr.trim()) {
                newErrors.kastStr = "Cultivator is required";
                valid = false;
            }
        }

        if (isMutExist) {
            // Mutation Details
            mutationDetails.forEach((item, index) => {
                if (!item.mut_no.trim()) {
                    newErrors[`mutation_${index}`] = "Mutation No is required";
                    valid = false;
                }
            });

            // Mutation Type & Soil Type
            if (!selectedMutationType) {
                newErrors.selectedMutationType = "Select Mutation Type";
                valid = false;
            }
        }
        if (!selectedSoilType) {
            newErrors.selectedSoilType = "Select Soil Type";
            valid = false;
        }

        if (!remark) {
            newErrors.remark = "Add Remark";
            valid = false;
        }


        setErrors(newErrors);
        return valid;
    };



    return (
        <>
            {!record.isSummary && (
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0"><MoreHorizontal className="h-4 w-4" /></Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        {(
                            (isPatwari && ["JAMABANDI_CLARIFICATION_REQUIRED", "JAMABANDI_SUBMITTED"].includes(record.status)) ||
                            (isNaibTehsildar && ["JAMABANDI_EDITED", "JAMABANDI_RESUBMITTED", "JAMABANDI_UNDER_VERIFICATION"].includes(record.status)) ||
                            (isTehsildar && ["JAMABANDI_VERIFIED"].includes(record.status))
                        ) && (
                                <DropdownMenuItem onClick={() => handleOpen("Details")}>
                                    View Detail/Edit
                                </DropdownMenuItem>
                            )}

                        <DropdownMenuItem onClick={() => handleOpen("History")}>History</DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            )}

            {/* Details Dialog */}
            <Dialog open={open} onOpenChange={setOpen}>
                 <DialogContent
    className="sm:max-w-[90vw] max-h-[80vh] overflow-y-auto"  // ✅ added height + scroll
  >
                   <DialogHeader>
                        <DialogTitle>Record Details</DialogTitle>
                        <DialogDescription>Khasra ID: {record.id}</DialogDescription>
                    </DialogHeader>

 <div className="mt-2 space-y-4">
                    {/* Only render form when open */}
                    {open && (
                        <form className="grid grid-cols-2 gap-4">

                            {/* Khewat No */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Khewat No</label>
                                <Input
                                    value={khewatNo}
                                    onChange={(e) => validateNumber(e.target.value) && setKhewatNo(e.target.value)}
                                    disabled={!isEditable}
                                    placeholder="Enter Khewat No"
                                />
                                {isEmpty(khewatNo) && <p className="text-red-500 text-xs">Khewat No is required</p>}
                            </div>

                            {/* Khata No */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Khata No</label>
                                <Input
                                    value={khataNo}
                                    onChange={(e) => validateNumber(e.target.value) && setKhataNo(e.target.value)}
                                    disabled={!isEditable}
                                    placeholder="Enter Khata No"
                                />
                                {isEmpty(khataNo) && <p className="text-red-500 text-xs">Khata No is required</p>}
                            </div>
                            {/* taraf patti */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Name Of Patti</label>
                                <Input
                                    value={patti}
                                    onChange={(e) => validateText(e.target.value) && setPatti(e.target.value)}
                                    disabled={!isEditable}
                                    placeholder="Enter Patti"
                                />
                            </div>

                            {/* Khasra No */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Khasra No</label>
                                <Input
                                    value={khasraNo}
                                    onChange={(e) => validateNumber(e.target.value) && setKhasraNo(e.target.value)}
                                    disabled={!isEditable}
                                    placeholder="Enter Khasra No"
                                />
                                {isEmpty(khasraNo) && <p className="text-red-500 text-xs">Khasra No is required</p>}
                            </div>


                            {/* Owner */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Owner</label>
                                <Input
                                    value={ownerStr}
                                    onChange={(e) => validateText(e.target.value) && setOwnerStr(e.target.value)}
                                    disabled={!isEditable}
                                    placeholder="Enter Owner Name"
                                />
                                {isEmpty(ownerStr) && <p className="text-red-500 text-xs">Owner name is required</p>}
                            </div>

                            {/* Cultivator */}
                            {isKastStrExist && (
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Cultivator</label>
                                    <Input
                                        value={kastStr}
                                        onChange={(e) => validateText(e.target.value) && setKastStr(e.target.value)}
                                        disabled={!isEditable}
                                        placeholder="Enter Cultivator Name"
                                    />
                                    {isEmpty(kastStr) && <p className="text-red-500 text-xs">Cultivator name is required</p>}
                                </div>
                            )}

                            {/* Soil Type */}
                            <div className="flex flex-col gap-4 col-span-2">
                                <label className="block text-sm font-medium text-gray-700 mb-1">Soil Type</label>
                                {selectedSoilType.map((soil, index) => (
                                    <div key={index} className="flex gap-4 items-center">
                                        <ReactSelect
                                            options={soilType.map((s) => ({ value: s.soilId, label: s.soilNameE }))}
                                            value={soil ? { value: soil.soil_id, label: soil.soil_name_e } : null}
                                            onChange={(option) => {
                                                if (!option) return;
                                                setSelectedSoilType((prev) => {
                                                    const updated = [...prev];
                                                    updated[index] = {
                                                        ...prev[index],
                                                        soil_id: option.value,
                                                        soil_name_e: option.label,
                                                    };
                                                    return updated;
                                                });
                                            }}
                                            isDisabled={!isEditable}
                                            placeholder="Select Soil Type"
                                            className="w-60"
                                            classNamePrefix="react-select"
                                            menuPlacement="auto"
                                        />

                                        <div className="flex flex-col">
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Area (Kanal)</label>
                                            <Input
                                                value={soil.area_kanal.toString()}
                                                onChange={(e) => {
                                                    const value = e.target.value;
                                                    setSelectedSoilType((prev) => {
                                                        const updated = [...prev];
                                                        updated[index] = {
                                                            ...prev[index],
                                                            area_kanal: value === "" ? 0 : Number(value),
                                                        };
                                                        return updated;
                                                    });
                                                }}
                                                disabled={!isEditable}
                                                placeholder="Area (Kanal)"
                                            />
                                        </div>

                                        <div className="flex flex-col">
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Area (Marla)</label>
                                            <Input
                                                value={soil.area_marla.toString()}
                                                onChange={(e) => {
                                                    const value = e.target.value;
                                                    setSelectedSoilType((prev) => {
                                                        const updated = [...prev];
                                                        updated[index] = {
                                                            ...prev[index],
                                                            area_marla: value === "" ? 0 : Number(value),
                                                        };
                                                        return updated;
                                                    });
                                                }}
                                                disabled={!isEditable}
                                                placeholder="Area (Marla)"
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>


                            {/* Mutation Type */}
                            <div className="flex flex-col gap-4 col-span-2">
                                {selectedMutationType.length > 0 && <label className="block text-sm font-medium text-gray-700 mb-1">Mutation Type</label>}
                                {selectedMutationType.map((mutation, index) => (
                                    <div key={index} className="flex gap-4 items-center">
                                        <ReactSelect
                                            options={mutType.map((m) => ({ value: m.mut_id.toString(), label: m.mut_type_e }))}
                                            value={mutation ? { value: mutation.mut_type, label: mutation.mut_type_e } : null}
                                            onChange={(option) => {
                                                if (!option) return;
                                                setSelectedMutationType((prev) => {
                                                    const updated = [...prev];
                                                    updated[index] = {
                                                        ...prev[index],
                                                        mut_type: option.value,
                                                        mut_type_e: option.label,
                                                    };
                                                    return updated;
                                                });
                                            }}
                                            isDisabled={!isEditable}
                                            placeholder="Select Mutation Type"
                                            className="w-60"
                                            classNamePrefix="react-select"
                                            menuPlacement="auto"
                                        />

                                        <div className="flex flex-col">
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Mutation No</label>
                                            <Input
                                                value={mutation.mut_no}
                                                onChange={(e) => {
                                                    const value = e.target.value;
                                                    setSelectedMutationType((prev) => {
                                                        const updated = [...prev];
                                                        updated[index] = {
                                                            ...prev[index],
                                                            mut_no: value,
                                                        };
                                                        return updated;
                                                    });
                                                }}
                                                disabled={!isEditable}
                                                placeholder="Mutation No"
                                            />
                                            {isEmpty(mutation.mut_no) && <p className="text-red-500 text-xs">Mutation no. is required</p>}
                                        </div>
                                    </div>
                                ))}
                            </div>


                            {/* {clarification.map((cl, index) => {
                                const isRight = index % 2 === 1; // even index -> left, odd index -> right
                                return (
                                    <div
                                        key={index}
                                        className={`flex w-full mb-4 ${isRight ? "justify-end" : "justify-start"}`}
                                    >
                                        <div className="max-w-xs">
                                            <p
                                                className={`text-xs font-semibold mb-1 ${isRight ? "text-right" : "text-left"
                                                    }`}
                                            >
                                                {cl.name}
                                            </p>
                                            <div
                                                className={`rounded-2xl px-4 py-2 text-sm shadow 
            ${isRight ? "bg-blue-500 text-white rounded-br-none" : "bg-gray-200 text-gray-900 rounded-bl-none"}`}
                                            >
                                                {cl.remark}
                                            </div>
                                        </div>
                                    </div>
                                );
                            })} */}


                            {/* Remark */}
                            <div className="col-span-2">
                                <label className="block text-sm font-medium text-gray-700 mb-1">Remark</label>
                                <Textarea
                                    value={remark}
                                    onChange={(e) => validateText(e.target.value) && setRemark(e.target.value)}
                                    placeholder="Enter Remark"
                                />
                                {isEmpty(remark) && <p className="text-red-500 text-xs">Remark is required</p>}
                            </div>

                            {/* Action Buttons */}
                            <div className="flex gap-2 col-span-2 justify-center mt-4">
                                {isTehsildar &&
                                    <div>
                                        <Button type="button" variant="outline" disabled={isButtonDisabled} onClick={() => handleSave("JAMABANDI_APPROVED")}>
                                            Approve
                                        </Button>
                                        <Button type="button" variant="outline" disabled={isButtonDisabled} onClick={() => handleSave("JAMABANDI_REJECTED")}>
                                            Reject
                                        </Button>
                                    </div>
                                }
                                {isNaibTehsildar &&
                                    <div>
                                        <Button type="button" variant="outline" disabled={isButtonDisabled} onClick={() => handleSave("JAMABANDI_VERIFIED")}>
                                            Verify
                                        </Button>
                                        <Button type="button" variant="outline" disabled={isButtonDisabled} onClick={() => handleSave("JAMABANDI_CLARIFICATION_REQUIRED")}>
                                            Seek Clarification
                                        </Button>
                                    </div>
                                }

                                {isPatwari && (
                                    <>
                                        {(jamabandiStatus === "JAMABANDI_SUBMITTED") && (

                                            <div>
                                                {!isEditable &&
                                                    <Button
                                                        type="button"
                                                        onClick={() => handleSave("JAMABANDI_UNDER_VERIFICATION")}
                                                    >
                                                        Submit
                                                    </Button>
                                                }
                                                <Button
                                                    type="button"
                                                    onClick={isEditable ? () => handleSave("JAMABANDI_EDITED") : handleEditClick}
                                                >
                                                    {isEditable ? "Save" : "Edit"}
                                                </Button>
                                            </div>
                                        )}

                                        {jamabandiStatus === "JAMABANDI_CLARIFICATION_REQUIRED" && (
                                            <div>
                                                <Button
                                                    type="button"
                                                    onClick={isEditable ? () => handleSave("JAMABANDI_RESUBMITTED") : handleEditClick}
                                                >
                                                    {isEditable ? "Resubmit" : "Edit"}
                                                </Button>
                                            </div>
                                        )}
                                    </>
                                )}

                            </div>
                        </form>

                    )}
                    </div>
                </DialogContent>
            </Dialog>

            {/* History Dialog */}
            <Dialog open={!!historyId} onOpenChange={() => setHistoryId(null)}>
                <DialogContent className="sm:max-w-[90vw] max-h-[90vh] flex flex-col">
                    <DialogHeader><DialogTitle>Record History</DialogTitle></DialogHeader>
                    {historyId && <JamabandiHistory khasraId={historyId.toUpperCase()} jamabandiColumns={jamabandiHistoryColumns} />}
                </DialogContent>
            </Dialog>
        </>
    );
};

// History table columns
const jamabandiHistoryColumns: ColumnDef<Jamabandi>[] = [
    { accessorKey: "sno", header: "S.No.", cell: ({ row, table }) => row.index + 1 + table.getState().pagination.pageIndex * table.getState().pagination.pageSize },
    { accessorKey: "id", header: "ID" },
    { accessorKey: "mutation_type_list", header: "Mutation Type" },
    { accessorKey: "mutation_no_list", header: "Mutation Number" },
    { accessorKey: "qism_zameen", header: "Qism Zameen" },
    { accessorKey: "area_marla", header: "Area(Marla)" },
    { accessorKey: "area_kanal", header: "Area(Kanal)" },
    { accessorKey: "khasra_no", header: "Khasra No" },
    { accessorKey: "kast_str", header: "Cultivator" },
    { accessorKey: "owner_str", header: "Owner" },
    { accessorKey: "patti", header: "Patti Name" },
    { accessorKey: "khata_no", header: "Khata No." },
    { accessorKey: "khewat_no", header: "Khewat No." },
    { accessorKey: "name", header: "Updated By" },
    { accessorKey: "updatedDate", header: "Updated On" },
    { accessorKey: "remark", header: "Remark" },
    { accessorKey: "status", header: "Status" },
];

export default JamabandiActions;
