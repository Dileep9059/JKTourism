import { axiosPrivate } from "@/axios/axios";
import { Card, CardContent } from "@/components/ui/card";
import { FileText, CheckCircle, Clock, Edit3, XCircle } from "lucide-react"; // Icons
import { useEffect, useState } from "react";
import { d } from "../utils/crypto";
import { toast } from "sonner";

const SummaryCards = () => {
    const [stats, setStats] = useState({
        total: 0,
        approved: 0,
        pending_review: 0,
        draft: 0,
        rejected: 0,
        submitted:0
    });

    const cardData = [
        {
            title: "Total Requests",
            value: stats.total,
            icon: FileText,
            bg: "bg-blue-500/10",
            iconColor: "text-blue-600",
        },
        {
            title: "Approved",
            value: stats.approved,
            icon: CheckCircle,
            bg: "bg-green-500/10",
            iconColor: "text-green-600",
        },
        {
            title: "Pending",
            value: stats.pending_review,
            icon: Clock,
            bg: "bg-yellow-500/10",
            iconColor: "text-yellow-600",
        },
        {
            title: "Submitted",
            value: stats.submitted,
            icon: Clock,
            bg: "bg-blue-500/10",
            iconColor: "text-blue-600",
        },
        {
            title: "Draft",
            value: stats.draft,
            icon: Edit3,
            bg: "bg-gray-500/10",
            iconColor: "text-gray-600",
        },
        {
            title: "Rejected",
            value: stats.rejected,
            icon: XCircle,
            bg: "bg-red-500/10",
            iconColor: "text-red-600",
        },
    ];

    async function fetchCardData(){
        try {
            const res = await axiosPrivate.get("/api/admin/hotel-stats");
            const json = JSON.parse(await d(res.data));
            setStats(json);
        } catch (error) {
            toast.error("Something went wrong while fetching card data.");
        }
    }

    useEffect(()=>{
        fetchCardData();
    }, []);

    return (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5 mb-6">
            {cardData.map((item, index) => {
                const Icon = item.icon;

                return (
                    <Card
                        key={index}
                        className="group transition-all hover:shadow-md hover:-translate-y-0.5"
                    >
                        <CardContent className="p-5 flex items-center gap-4">
                            {/* Icon */}
                            <div
                                className={`h-12 w-12 rounded-xl flex items-center justify-center ${item.bg}`}
                            >
                                <Icon className={`h-6 w-6 ${item.iconColor}`} />
                            </div>

                            {/* Text */}
                            <div className="flex flex-col">
                                <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                                    {item.title}
                                </span>
                                <span className="text-2xl font-bold leading-tight">
                                    {item.value}
                                </span>
                            </div>
                        </CardContent>
                    </Card>
                );
            })}
        </div>
    );
};

export default SummaryCards;