
import { useEffect, useState } from "react";
import clsx from "clsx";
import { Info, MapPin } from "lucide-react";
import scss from "./eventdetail.module.scss";
import { IoAlarm } from "react-icons/io5";
import { FaCalendarDays } from "react-icons/fa6";
import { MdAirplaneTicket } from "react-icons/md";
import { IoMdStar } from "react-icons/io";
import { toast } from "sonner";
import { format } from "date-fns";
import {
    formatArrayTimeTOStringTime,
    getGoogleMapsEmbedURL,
} from "@/utils/helpers";
import { useParams } from "react-router-dom";
import axiosInstance from "@/axios/axios";
import { d } from "../utils/crypto";

type EventData = {
    title: string;
    district: string;
    description: string;
    image: string;
    startDate: Date;
    startTime: number[];
    latitude: number;
    longitude: number;
    ticketPrice: number;
};

const EventDetail = () => {
    const [eventData, setEventData] = useState<EventData>({} as EventData);
    const { id } = useParams();

    useEffect(() => {
        async function getEvent() {
            try {
                const resp = await axiosInstance.post(
                    "/api/events/get-event",
                    decodeURIComponent(id ?? "")
                );
                if (resp?.status === 200) {
                    const data = JSON.parse(await d(resp?.data));
                    setEventData(data);
                }
            } catch {
                toast("Error!", {
                    description: "Unable to fetch event detail",
                    icon: <Info className="text-red-500 w-4 h-4" />,
                });
            }
        }
        getEvent();
    }, []);
    return (
        <>
            <div className={scss.event_banner}>
                <img
                    src={`${import.meta.env.VITE_APP_API_BASE_URL}/files/load-file-by-path?path=${eventData.image}`}
                    alt="Banner"
                    width={100}
                    height={50}
                    className={clsx(
                        scss.banner_image,
                        "w-full max-h-[700px] object-cover"
                    )}
                    loading="lazy"
                />
            </div>
            <div className="min-h-screen pb-20 font-[family-name:var(--font-geist-sans)]">
                <div className={scss.innercontent}>
                    <div
                        className={clsx(
                            scss.eventdetail_review,
                            "flex items-center justify-between"
                        )}
                    >
                        <div className={scss.review_inner}>
                            <button>{eventData.district}</button>
                        </div>
                        <div className={clsx(scss.review_inner, "flex items-center gap-2")}>
                            <IoMdStar fontSize={20} />
                            <p>5 (35 positive reviews)</p>
                        </div>
                    </div>
                    <div className={clsx(scss.eventdetail_main, "container-fluid p-0")}>
                        <div className={clsx(scss.destination_title)}>
                            <h2 className={scss.cattitle}>{eventData.title}</h2>
                            <h4 className="flex flex-row gap-2 text-sm items-center">
                                <a
                                    target="_blank"
                                    className="flex items-center gap-2"
                                    href={`https://www.google.com/maps?q=${eventData.latitude},${eventData.longitude}`}
                                >
                                    <MapPin className="h-4 w-4 text-red-600" /> View on Map{" "}
                                </a>
                            </h4>
                        </div>
                    </div>
                    <h2 className="pt-3">About Event</h2>
                    <p className={scss.longTxt}>{eventData.description}</p>
                    <div
                        className={clsx(
                            scss.innerdate,
                            "flex items-center justify-between gap-4"
                        )}
                    >
                        <div className={clsx(scss.date, "flex items-center gap-3 mt-3")}>
                            <div className={scss.icon_wrapper}>
                                <FaCalendarDays fontSize={28} />
                            </div>
                            <div>
                                <h2>
                                    {eventData?.startDate &&
                                        format(new Date(eventData?.startDate), "dd,MMM yyyy")}
                                </h2>
                                <p>Date</p>
                            </div>
                        </div>
                        <div className={clsx(scss.date, "flex items-center gap-3")}>
                            <div className={scss.icon_wrapper}>
                                <IoAlarm fontSize={28} />
                            </div>
                            <div>
                                <h2>
                                    {eventData?.startTime &&
                                        formatArrayTimeTOStringTime(eventData.startTime)}
                                </h2>
                                <p>Time</p>
                            </div>
                        </div>
                        <div className={clsx(scss.date, "flex items-center gap-3")}>
                            <div className={scss.icon_wrapper}>
                                <MdAirplaneTicket fontSize={28} />
                            </div>
                            <div>
                                <h2>₹ {eventData.ticketPrice}</h2>
                                <p>Ticket</p>
                            </div>
                        </div>
                    </div>
                    <div className={clsx(scss.navigatemaps, "position-relative mt-3")}>
                        <iframe
                            src={getGoogleMapsEmbedURL(
                                eventData.latitude,
                                eventData.longitude
                            )}
                            width="600"
                            height="450"
                            className={clsx(scss.map_image, "w-full object-cover")}
                        ></iframe>
                    </div>
                </div>
            </div>
        </>
    );
};

export default EventDetail;
