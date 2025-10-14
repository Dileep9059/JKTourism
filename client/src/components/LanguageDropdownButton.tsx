import {
    DropdownMenu,
    DropdownMenuTrigger,
    DropdownMenuContent,
    DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { LanguagesIcon, ChevronDownIcon, CheckIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export function LanguageDropdownButton({ selectedLanguage, setSelectedLanguage, setSelectedData }) {
    // height matching SelectTrigger (e.g. 2.5rem = 40px)
    // You can adjust this value to perfectly match your selects
    const buttonHeightClass = "h-9";

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <button
                    className={`flex items-center gap-2 px-3 rounded-md text-sm border border-border bg-background shadow-sm hover:bg-muted transition-colors duration-150 ${buttonHeightClass}`}
                    aria-label="Select language"
                >
                    <LanguagesIcon className="w-5 h-5 text-muted-foreground" />
                    <span className="font-semibold text-muted-foreground">
                        {selectedLanguage === "ur_in" && (
                            <span className="flex items-center gap-1">اردو</span>
                        )}
                        {selectedLanguage === "en_in" && (
                            <span className="flex items-center gap-1">EN</span>
                        )}
                    </span>
                    <ChevronDownIcon className="w-4 h-4 text-muted-foreground" />
                </button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end" className="w-36">
                {[
                    { label: "اردو", value: "ur_in" },
                    { label: "EN", value: "en_in" },
                ].map((lang) => (
                    <DropdownMenuItem
                        key={lang.value}
                        onClick={() => {
                            setSelectedLanguage(lang.value);
                            setSelectedData((prev: String) => ({ ...prev, lang: lang.value }));
                        }}
                        className={cn(
                            "flex justify-between items-center cursor-pointer text-sm",
                            selectedLanguage === lang.value
                                ? "font-semibold text-primary"
                                : "text-muted-foreground"
                        )}
                    >
                        <span className="flex items-center gap-2">{lang.label}</span>
                        {selectedLanguage === lang.value && (
                            <CheckIcon className="w-4 h-4 text-primary" />
                        )}
                    </DropdownMenuItem>
                ))}
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
