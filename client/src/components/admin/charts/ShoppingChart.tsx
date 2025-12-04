import { axiosPrivate } from "@/axios/axios";
import { d } from "@/components/utils/crypto";

import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import "highcharts/modules/drilldown";
import { useTheme } from "@/context/theme-context";
import { darkTheme, lightTheme } from "@/lib/highchartsTheme";

type ShoppingStat = {
  shopping: string;
  hits: number;
};

export default function ShoppingChart() {
  const [options, setOptions] = useState<any>(null);
  const [chartData, setChartData] = useState<ShoppingStat[] | null>(null);

   const { theme } = useTheme();

  async function getChartData(): Promise<ShoppingStat[] | undefined> {
    try {
      const res = await axiosPrivate.post("/api/dashboard/shopping-chart");
      const json = JSON.parse(await d(res?.data));
      return json;
    } catch (error: any) {
      toast.error("Unable to get destination chart data.");
    }
  }

  useEffect(() => {
    (async () => {
      const data = await getChartData();
      if (data) setChartData(data);
    })();
  }, []);

  useEffect(() => {
    if (theme === "dark") {
      Highcharts.setOptions(darkTheme);
    } else {
      Highcharts.setOptions(lightTheme);
    }
  }, [theme]);

  useEffect(() => {
    setOptions({
      chart: { type: "column" },
      title: { text: "Shopping  Hits" },
      xAxis: {
        categories: chartData?.map((d: ShoppingStat) => d.shopping),
        title: { text: "Shopping Locations" },
      },
      legend: { enabled: false },
      plotOptions: {
        series: {
          borderWidth: 0,
          colorByPoint: true,
          dataLabels: {
            enabled: true,
          },
        },
      },
      tooltip: {
        pointFormat: `<span style="color:{point.color}">{point.y}</span>`,
      },
      series: [
        {
          name: "Hits",
          data: chartData?.map((d) => d.hits),
        },
      ],
      accessibility: {
        enabled: true,
      },
      credits: { enabled: false },
    });
  }, [chartData]);

  if (!options) return <p>Loading chart...</p>;

  return <HighchartsReact key={theme} highcharts={Highcharts} options={options} />;
}
