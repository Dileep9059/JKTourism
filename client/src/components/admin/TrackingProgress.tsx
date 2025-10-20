import scss from "./chart.module.scss";
import clsx from "clsx";
import DestinationChart from "./charts/DestinationChart";
import ExperienceChart from "./charts/ExperienceChart";
import ActivityChart from "./charts/ActivityChart";
import ShoppingChart from "./charts/ShoppingChart";

export function TrackingProgress() {
    return (
        <>
            <div className={clsx(scss.chart_wrapper, "flex-shrink-0 flex-1 mb-3")}>
                <div className='p-4 w-[calc(50%-1rem)] min-w-[300px] h-full rounded-[10px] border border-[#d8d5d5]  dark:bg-black'>
                    <h3 className="mb-2 dark:text-white">Most Visited Destinations</h3>
                    <DestinationChart />
                </div>
                <div className='p-4 w-[calc(50%-1rem)] min-w-[300px] h-full rounded-[10px] border border-[#d8d5d5]  dark:bg-black'>
                    <h3 className="mb-2 dark:text-white">Experience of J&K</h3>
                    <ExperienceChart />
                </div>
                <div className='p-4 w-[calc(50%-1rem)] min-w-[300px] h-full rounded-[10px] border border-[#d8d5d5]  dark:bg-black'>
                    <h3 className="mb-2 dark:text-white">What to do</h3>
                    <ActivityChart />
                </div>
                <div className='p-4 w-[calc(50%-1rem)] min-w-[300px] h-full rounded-[10px] border border-[#d8d5d5]  dark:bg-black'>
                    <h3 className="mb-2 dark:text-white">Shopping</h3>
                    <ShoppingChart />
                </div>
            </div>
        </>
    );
}
