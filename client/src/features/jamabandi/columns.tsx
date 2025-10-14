import { type ColumnDef } from "@tanstack/react-table";

import { DataTableColumnHeader } from "./data-table-column-header";

import JamabandiActions from "./jamabandiDetail";
import HighlightedWords from "./hightlited-word";

export type Jamabandi = {
  id: string;
  khewat_no: string;
  old_khewat_no: string;
  taraf_patti_nm: string;
  owner_str: string;
  khata_no: string;
  kast_str: string;
  khasra_no: string;
  old_khasra_no: string | null;
  khet_name: string | null;
  area_kanal: number;
  area_marla: number;
  qism_zameen: string;
  soil_typ_id_list: string;
  irrigation_source: string | null;
  irr_typ_id_list: string | null;
  mutation_no_list: string;
  mutation_type_list: string;
  status: string;
  isSummary: boolean;
  history_owner_str: string;
  history_kast_str: string;
  showOwner:string;
  khewat_remark:string;
  soil_details:[];
  isKhataTotalRow:string;
  isKhewatTotalRow:string;
  totalMarla:string;
  totalKanal:string
};

export const jamabandiColumns: ColumnDef<Jamabandi>[] = [
  // {
  //     accessorKey: "sno",
  //     header: ({ column }) => (
  //         <DataTableColumnHeader column={column} title="S.No." />
  //     ),
  //     cell: ({ row, table }) => {
  //         const pageIndex = table.getState().pagination.pageIndex; // current page
  //         const pageSize = table.getState().pagination.pageSize;
  //         return row.index + 1 + pageIndex * pageSize;
  //     },
  //     // enableSorting: false, // disable sorting for serial number
  //     // enableColumnFilter: false,
  // },

  {
    accessorKey: "id",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="ID" />
    ),
  },

  {
    header: "١٢", // Top-level group
    columns: [
      {
        header: "Remarks", // Second-level group
        columns: [
        
          { accessorKey: "khewat_remark", header: "",
              cell:({row})=>{
               if (!row.original.showOwner) return null; // show only once per khewat
               return (
              <div className="px-2 py-1 text-left align-middle">
               
                  <span>
                    {row.original.khewat_remark}
                  </span>
                
              </div>

               );
            }
           },
       
        ],
      },
    ],
  },

  {
    header: "١١",
    columns: [
      {
        header: "Reference Mutation Type",
        columns: [
          {
            accessorKey: "mutation_type_list",
            header: "Type",
            // cell: ({ row, table }) => {

            //   const currentValue = row.original.mutation_type_list;
            //   const oldValue = row.original.history_mutation_type_list; // 👈 from jmHis in SQL

            //   return (
            //     <div
            //       className="px-2 py-1 text-left align-middle"
            //     >
            //       {oldValue ? (
            //         <HighlightedWords oldText={oldValue} newText={currentValue} />
            //       ) : (
            //         <span >{currentValue}</span>
            //       )}
            //     </div>
            //   );
            // },
          },
          { accessorKey: "mutation_no_list", header: "Number" },
        ],
      },
    ],
  },

  {
    header: "١٠", // Top-level group
    columns: [
      {
        header: "Demand & Assets", // Second-level group
        columns: [
          {
            id: "demand&Assets", // Actual data field
            cell: () => "",
          },
        ],
      },
    ],
  },

  {
    header: "٩", // Top-level group
    columns: [
      {
        header: "Rent Paid By Tenant", // Second-level group
        columns: [
          {
            id: "demand&rentPaidByTenant", // Actual data field
            cell: () => "",
          },
        ],
      },
    ],
  },


  {
    header: "٨",
    columns: [
      {
        header: "Area With Type",
        columns: [
          // Qism Zameen
          {
            accessorKey: "qism_zameen",
            header: "Qism Zameen",
            cell: ({ row }) => {
              const soils = row.original.soil_details || [];
              const isKhataTotalRow = row.original.isKhataTotalRow;
              const isKhewatTotalRow = row.original.isKhewatTotalRow;
            //  console.log('isKhataTotalRow  ',isKhataTotalRow)
              return (
                <div>
                  {soils.map((soil, index) => (
                    <div
                      key={index}
                      className={`py-1 ${index < soils.length - 1 ? "border-b border-gray-300" : ""}`}
                      style={{ whiteSpace: "nowrap" }}
                    >
                      {soil.qism_zameen}
                    </div>
                  ))}


                  {/* total area */}
                  <div className={isKhataTotalRow ? "font-bold pt-2 text-blue-600": (isKhewatTotalRow ? "font-bold text-green-600":"font-bold pt-2") } style={{ whiteSpace: "nowrap" }}>
                   <span>{isKhataTotalRow ? "Total Area For Khata": (isKhewatTotalRow ? "Total Area For Khewat":"Total Area For Khasra")}</span> 
                  </div>
                </div>
              );
            },
            size: 200,
            minSize: 100,
            maxSize: 1000,
          },

          // Marla
          {
            id: "marla",
            header: "Marla",
            cell: ({ row }) => {
              const soils = row.original.soil_details || [];
              const totals = row.original.totalMarla || 0;
              const isKhataTotalRow = row.original.isKhataTotalRow;
              const isKhewatTotalRow = row.original.isKhewatTotalRow;
              return (
                <div>
                  {soils.map((soil, index) => (
                    <div
                      key={index}
                      className={`py-1 ${index < soils.length - 1 ? "border-b border-gray-300" : ""}`}
                      style={{ whiteSpace: "nowrap" }}
                    >
                      {soil.area_marla}
                    </div>
                  ))}

                  {/* <div className="border-b border-gray-300"></div> */}

                  {/* Sum of all marlas for this khasra */}
                  <div className="pt-2 font-bold" style={{ whiteSpace: "nowrap" }}>
                    <span className={isKhataTotalRow ? "font-bold pt-2 text-blue-600": (isKhewatTotalRow ? "font-bold text-green-600":"font-bold pt-2") }>{totals}</span>
                  </div>
                </div>
              );
            },
            size: 100,
            minSize: 80,
            maxSize: 400,
          },

          // Kanal
          {
            id: "kanal",
            header: "Kanal",
            cell: ({ row }) => {
              const soils = row.original.soil_details || [];
              const totals = row.original.totalKanal || 0;
              const isKhataTotalRow = row.original.isKhataTotalRow;
              const isKhewatTotalRow = row.original.isKhewatTotalRow;
              return (
                <div>
                  {soils.map((soil, index) => (
                    <div
                      key={index}
                      className={`py-1 ${index < soils.length - 1 ? "border-b border-gray-300" : ""}`}
                      style={{ whiteSpace: "nowrap" }}
                    >
                      {soil.area_kanal}
                    </div>
                  ))}
                  {/* <div className={"border-b border-gray-300"}></div> */}
                  {/* Totals for this khasra */}
                  <div className="pt-2 font-bold" style={{ whiteSpace: "nowrap" }}>
                    <span className={isKhataTotalRow ? "font-bold pt-2 text-blue-600": (isKhewatTotalRow ? "font-bold text-green-600":"font-bold pt-2") }>{totals}</span>
                  </div>
                </div>
              );
            },
            size: 100,
            minSize: 80,
            maxSize: 400,
          },
        ],
      },
    ],
  },

  {
    header: "٧",
    columns: [
      {
        header: "Khasra No. & Field Name",
        columns: [
          {
            accessorKey: "khasra_no", header: "New",
            // cell: ({ row, table }) => {

            //   const currentValue = row.original.khasra_no;
            //   const oldValue = row.original.history_khasra_no; // 👈 from jmHis in SQL

            //   return (
            //     <div
            //       className="px-2 py-1 text-left align-middle"
            //     >
            //       {oldValue ? (
            //         <HighlightedWords oldText={oldValue} newText={currentValue} />
            //       ) : (
            //         <span >{currentValue}</span>
            //       )}
            //     </div>
            //   );
            // },
          },
          { accessorKey: "old_khasra_no", header: "Old" },
        ],
      },
    ],
  },

  {
    header: "٦", // Top-level group
    columns: [
      {
        header: "Irrigation Source", // Second-level group
        columns: [
          {
            accessorKey: "irrigation_source",
            header: "",
          },
        ],
      },
    ],
  },

  {
    header: "٥", // Top-level group
    columns: [
      {
        header: "Cultivator Name", // Second-level group
        columns: [
          {
            id: "Cultivator",
            header: "",
            cell: ({ row, table }) => {
              const allRows = table.getRowModel().rows;
              const currentIndex = row.index;
              const currentValue = row.original.kast_str;
              const oldValue = row.original.history_kast_str;
              const status = row.original.status;

              const highlightJsonObject = [{
                oldValue: oldValue,
                currentValue: currentValue,
                status: status,
                khasraID: row.original.id
              }]

              // count how many consecutive rows share the same owner_str
              let rowSpan = 1;
              for (let i = currentIndex + 1; i < allRows.length; i++) {
                if (allRows[i].original.kast_str === currentValue) {
                  rowSpan++;
                } else {
                  break;
                }
              }

              // skip rendering if previous row already has same owner_str
              if (
                currentIndex > 0 &&
                allRows[currentIndex - 1].original.kast_str === currentValue
              ) {
                return null; // don't render <td>
              }

              // render once with rowspan

              return (
                <div
                  className="px-2 py-1 text-left align-middle"
                  style={{ gridRow: `span ${rowSpan}` }}
                >
                  {oldValue ? (
                    // <HighlightedWords oldText={oldValue} newText={currentValue} status={status} />
                    <HighlightedWords jsonObj={highlightJsonObject} />

                  ) : (
                    <span >{currentValue}</span>
                  )}
                </div>
              );
            },
          },
        ],
      },
    ],
  },

 {
  header: "٤", // Top-level group header
  columns: [
    {
      header: "Owner Name", // Second-level group
      columns: [
        {
          id: "owner_str_display",
          header: "",
          cell: ({ row }) => {
            if (!row.original.showOwner) return null; // show only once per khewat

            const currentValue = row.original.owner_str;
            const oldValue = row.original.history_owner_str;
            const status = row.original.status;

            const highlightJsonObject = [{
              oldValue: oldValue,
              currentValue: currentValue,
              status: status,
              khasraID: row.original.id
            }];

            return (
              <div className="px-2 py-1 text-left align-middle">
                {oldValue ? (
                  <HighlightedWords jsonObj={highlightJsonObject} />
                ) : (
                  <span className={row.original.isSummary ? "font-bold text-blue-600" : ""}>
                    {currentValue}
                  </span>
                )}
              </div>
            );
          },
        },
      ],
    },
  ],
}


  ,

  {
    header: "٣", // Top-level group
    columns: [
      {
        header: "Name Of Patti With Name Numberdar", // Second-level group
        columns: [
          {
            id: "taraf_patti_nm",
            header: "",
            cell:({row})=>{
               if (!row.original.showOwner) return null; // show only once per khewat
               return (
              <div className="px-2 py-1 text-left align-middle">
               
                  <span>
                    {row.original.taraf_patti_nm}
                  </span>
                
              </div>

               );
            }
          },
        ],
      },
    ],
  },

  {
    header: "٢", // Top-level group
    columns: [
      {
        header: "Khata No", // Second-level group
        columns: [
          {
            accessorKey: "khata_no",
            header: "",
            cell: ({ row, table }) => {
              const allRows = table.getRowModel().rows;
              const currentIndex = row.index;
              const currentValue = row.original.khata_no;
              //  const oldValue = row.original.history_khata_no; 

              // count how many consecutive rows share the same khata_no
              let rowSpan = 1;
              for (let i = currentIndex + 1; i < allRows.length; i++) {
                if (allRows[i].original.khata_no === currentValue) {
                  rowSpan++;
                } else {
                  break;
                }
              }

              // skip rendering if previous row already has same khata_no
              if (
                currentIndex > 0 &&
                allRows[currentIndex - 1].original.khata_no === currentValue
              ) {
                return null; // don't render <td>
              }

              // render once with rowspan
              return (
                <div
                  className="px-2 py-1 text-left align-middle"
                  style={{ gridRow: `span ${rowSpan}` }}
                >
                  <div
                    className={
                      row.original.isSummary ? "font-bold text-blue-600" : ""
                    }
                  >
                    {/* {oldValue ? (
                      <HighlightedWords oldText={oldValue} newText={currentValue} />
                    ) : (
                      <span>{currentValue}</span>
                    )} */}
                    <span>{currentValue}</span>
                  </div>
                </div>
              );
            },

          },
        ],
      },
    ],
  },

  {
    header: "١", // Top-level group header
    columns: [
      {
        header: "Khewat No", // Second-level header
        columns: [
          {
            id: "khewat_no_display",
            header: "", // Third-level (actual column header)
            cell: ({ row, table }) => {
              const allRows = table.getRowModel().rows;
              const currentIndex = row.index;
              const currentValue = row.original.khewat_no;

              // count how many consecutive rows share the same khewat_no
              let rowSpan = 1;
              for (let i = currentIndex + 1; i < allRows.length; i++) {
                if (allRows[i].original.khewat_no === currentValue) {
                  rowSpan++;
                } else {
                  break;
                }
              }

              // skip rendering if previous row already has same khewat_no
              if (
                currentIndex > 0 &&
                allRows[currentIndex - 1].original.khewat_no === currentValue
              ) {
                return null; // don't render <td>
              }

              // render once with rowspan
              return (
                <>
                  {currentValue && (
                    <span className="underline block">{currentValue}</span>
                  )}
                  {row.original.old_khewat_no && (
                    <span className="text-red-500 block">
                      {row.original.old_khewat_no}
                    </span>
                  )}
                </>
              );
            },
          },
        ],
      },
    ],
  },

  {
    header: " ", // Top-level group
    columns: [
      {
        header: "Status", // Second-level group
        columns: [
          {
            accessorKey: "status",
            header: "",
            cell: ({ row }) => {
              const status = row.original.status;
              if (!status) return "";
              const rowStatus = status.toUpperCase();
              switch (rowStatus) {
                case "JAMABANDI_APPROVED":
                  return "Approved";
                case "JAMABANDI_EDITED":
                  return "Edited";
                case "JAMABANDI_SUBMITTED":
                  return "Pending";
                case "JAMABANDI_VERIFIED":
                  return "Verified";
                case "JAMABANDI_RESUBMITTED":
                  return "Re-submitted";
                case "JAMABANDI_REJECTED":
                  return "Rejected";
                case "JAMABANDI_CLARIFICATION_REQUIRED":
                  return "Sent For Clarification";
                case "JAMABANDI_UNDER_VERIFICATION":
                  return "Verification Pending";
                default:
                  return "";
              }
            }
          },
        ],
      },
    ],
  },

  {
    header: " ",
    columns: [
      {
        header: "Action",
        columns: [
          {
            id: "actions",
            header: () => <div className="font-medium"></div>,
            cell: ({ row }) => <JamabandiActions record={row.original} />,
          },
        ],
      },
    ],
  }

];


// For Backlog Mutation DataTable
export type BacklogMutation = {
  id: number,
  districtID: number,
  districtName: string,
  tehsilID: number,
  tehsilName: string,
  villageID: number,
  villageName: string,
  oldKhewatNo: string,
  oldKhataNo: string,
  newKhataNo: string,
  oldKhasraNo: string,
  newKhasraNo: string,
  mutationNo: string,
  mutationType: string,
  mutationDate: string,
  remarks: string,
  ownerName: string,
  areaKanal: number,
  areaMarla: number,
  patwariName: string,
  soilType: string
};

export const backlogMutationColumns: ColumnDef<BacklogMutation>[] = [
  {
    accessorKey: "id",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="ID" />
    ),
  },
  {
    accessorKey: "districtName",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="District" />
    ),
  },
  {
    accessorKey: "tehsilName",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Tehsil" />
    ),
  },
  {
    accessorKey: "villageName",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Village" />
    ),
  },
  {
    accessorKey: "oldKhewatNo",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Khewat No" />
    ),
  },
  {
    accessorKey: "oldKhataNo",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Khata No" />
    ),
  },
  {
    accessorKey: "newKhataNo",
    id: "newKhataDisplay",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="New Khata No" />
    ),
    cell: ({ row }) => {
      const newKhata = row.original.newKhataNo;
      const oldKhata = row.original.oldKhataNo;

      return (
        <>
          {oldKhata && (
            <span className="underline block">{oldKhata}</span>
          )}
          {newKhata && (
            <span className="text-red-500 block">{newKhata}</span>
          )}
        </>
      );
    },
  },
  {
    accessorKey: "oldKhasraNo",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Khasra No" />
    ),
  },
  {
    accessorKey: "newKhasraNo",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="New Khasra No" />
    ),
  },
  {
    accessorKey: "mutationNo",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Mutation No" />
    ),
  },
  {
    accessorKey: "mutationType",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Mutation Type" />
    ),
  },
  {
    accessorKey: "mutationDate",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Mutation Date" />
    ),
  },
  {
    accessorKey: "remarks",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Remarks" />
    ),
  },
  {
    accessorKey: "ownerName",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Owner Name" />
    ),
  },
  {
    accessorKey: "areaKanal",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Area Kanal" />
    ),
  },
  {
    accessorKey: "areaMarla",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Area Marla" />
    ),
  },
  {
    accessorKey: "patwariName",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Patwari Name" />
    ),
  },
  {
    accessorKey: "soilType",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Soil Type" />
    ),
  },
];