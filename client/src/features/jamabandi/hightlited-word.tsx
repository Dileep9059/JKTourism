import { axiosPrivate } from "@/axios/axios";
import { d, e } from "@/components/utils/crypto";
import { diffWords } from "diff";
import { useState } from "react";

interface HighlightedItem {
  oldValue: string;
  currentValue: string;
  status: string;
  khasraID?: string;
}

interface HighlightedWordsProps {
  jsonObj: HighlightedItem[];
}

const HighlightedWords = ({ jsonObj }: HighlightedWordsProps) => {
  const [tooltipData, setTooltipData] = useState<string | null>(null); // To hold API response

  const fetchActionByKhasraID = async (khasraID: string) => {
    try {
      const param = {
        khasraId: khasraID,
      };
      const response = await axiosPrivate.post(
        "/api/v1/get-action-history-by-khasra",
        await e(param)
      );
      if (response?.status === 200) {
        const result = JSON.parse(await d(response.data));
        // console.log(result[0][0])
        setTooltipData(`Modified by ${result[0][0]}`);
      }
    } catch (error) {
      console.error("Failed to fetch Action taken by:", error);
    }
  };


  if (!jsonObj || jsonObj.length === 0) return null;



  return (
    <div className="space-y-1" style={{ direction: "rtl", textAlign: "right" }}>
      {jsonObj.map((item, index) => {
        const { oldValue = "", currentValue = "", status, khasraID } = item;

        // Special case: just return currentValue without diff
        if (status === "JAMABANDI_APPROVED" || status === "JAMABANDI_REJECTED") {
          return (
            <div key={index}>
              <span>{currentValue}</span>
            </div>
          );
        }

        const diffs = diffWords(oldValue, currentValue);

        const statusColors: Record<string, string> = {
          JAMABANDI_EDITED: "#FF0000",
          JAMABANDI_REJECTED: "#96D99F",
          JAMABANDI_VERIFIED: "#9E7878",
          DEFAULT: "",
        };

        const highlightColor = statusColors[status] || statusColors.DEFAULT;

        return (
          <div key={index}>
            {diffs.map((part, i) => (
              <span
                key={i}
                className="relative inline-block"
                style={{
                  backgroundColor: part.added ? highlightColor : "transparent",
                  borderRadius: part.added ? "4px" : undefined,
                  padding: part.added ? "0 3px" : undefined,
                  textDecoration: part.removed ? "line-through" : undefined,
                  color: part.removed ? "#FF0000" : "inherit",
                }}
              >
                {part.value}

                {/* Tooltip for added parts */}
                {part.removed && khasraID && (
                  <span className="absolute -top-1.5 -right-2.5 group">
                    <span
                      className="w-4 h-4 flex items-center justify-center text-[10px] font-semibold text-white bg-blue-500 rounded-full shadow-md hover:bg-blue-600 transition-colors duration-200 cursor-pointer"
                      onClick={() => fetchActionByKhasraID(khasraID)} // Trigger API on click
                    >
                      i
                    </span>
                    <span className="absolute hidden group-hover:block bg-gray-800 text-white text-xs rounded py-1 px-2 whitespace-nowrap bottom-full right-0 mb-1 z-50">
                      {tooltipData ? tooltipData : "Click to Fetch details"} {/* Show tooltip data or loading */}
                    </span>
                  </span>
                )}
              </span>
            ))}
          </div>
        );
      })}

    </div>
  );
};

export default HighlightedWords;
