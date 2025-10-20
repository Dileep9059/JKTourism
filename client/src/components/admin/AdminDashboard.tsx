import DocumentTitle from "../DocumentTitle";
import { ChartAreaInteractive } from "./ChartAreaInteractive";
import { SectionCards } from "./dashboard/SectionCards";
import { TrackingProgress } from "./TrackingProgress";

export default function AdminDashboard() {
  return (
    <>
    <DocumentTitle title="Dashboard" />
      <div className="flex flex-1 flex-col">
        <div className="@container/main flex flex-1 flex-col gap-2">
          <div className="px-2 py-4">
            <SectionCards />
            <div className="px-4 lg:px-6 mb-3">
              <ChartAreaInteractive />
            </div>
            <TrackingProgress />
          </div>
        </div>
      </div>
    </>
  );
}
