import { useEffect, useState } from "react";
import clsx from 'clsx'
import scss from './event.module.scss'

import { toast } from "sonner";
import { Info } from "lucide-react";

import { format } from "date-fns";
import axiosInstance from "@/axios/axios";
import { d } from "../utils/crypto";
import { Input } from "../ui/input";
import { Link } from "react-router-dom";

type Events = {
    id: string;
    image: string;
    title: string;
    startDate: Date;
}

const Event = () => {
    const [selectedDate, setSelectedDate] = useState(null);
    const [events, setEvents] = useState<Events[]>([]);

    useEffect(() => {
        async function fetchEvents() {
            try {
                const result = await axiosInstance.get("/api/events/all");
                if (result?.status === 200) {
                    const response = JSON.parse(await d(result?.data));
                    setEvents(response)
                }
            } catch {
                toast("Error!", {
                    description: "Error while fetching events.",
                    icon: <Info className="h-4 w-4 text-red-500" />
                })
            }
        }
        fetchEvents();
    }, [])
    return (
        <>
            <div className={clsx(scss.eventcontainer, "min-h-screen pt-20 pb-20 font-[family-name:var(--font-geist-sans)] flex justify-center")}>
                <div className={clsx(scss.event_main, 'mx-2 lg:mx-auto lg:max-w-[80%]')}>
                    <div className={clsx(scss.event_data_top, "grid grid-cols-2 justify-center gap-4")}>
                        <div className={clsx(scss.colgrid, "flex items-center justify-end")}>
                            <div className={clsx(scss.searchInput, "w-100 ")}>
                                <Input type='date' placeholder='From Date' className={scss.formInput} />
                            </div>
                        </div>
                        <div className={clsx(scss.colgrid, "flex items-center justify-start")}>
                            <div className={clsx(scss.searchInput, "w-100")}>
                                <Input type='date' placeholder='To Date' className={scss.formInput} />

                            </div>
                        </div>
                    </div>

                    <div className={clsx(scss.event_data)}>
                        <h2 className={clsx(scss.event_data, scss.main_title, "mt-2")}>Events in J&K</h2>
                        <div className={clsx(scss.event_data, "grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 mt-2")}>
                            {events?.map((event: Events) => (
                                <div className={(clsx(scss.eventgrid, ""))} key={event?.id}>
                                    <img
                                        src={`${import.meta.env.VITE_APP_API_BASE_URL
                                            }/files/load-file-by-path?path=${event.image}`}
                                        alt="Preview"
                                        width={1000}
                                        height={600}
                                        className={clsx(scss.event_image)}
                                    />
                                    <h2>{event.title}</h2>
                                    <span><img src={`${import.meta.env.VITE_BASE}assets/images/calendar.svg`} />{format(new Date(event?.startDate), "MMM dd, yyyy")}</span>
                                    <Link to={`/events/${encodeURIComponent(event?.id)}`}>View</Link>
                                </div>
                            ))}

                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Event;