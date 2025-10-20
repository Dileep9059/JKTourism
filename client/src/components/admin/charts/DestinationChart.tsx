
import Highcharts from "highcharts";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import "highcharts/modules/drilldown";
import { axiosPrivate } from "@/axios/axios";
import { d } from "@/components/utils/crypto";
import HighchartsReact from "highcharts-react-official";
import { useTheme } from "@/context/theme-context";
import { darkTheme, lightTheme } from "@/lib/highchartsTheme";

type CategoryStat = {
  category: string;
  hits: number;
};

type SubCategoryStat = {
  category: string;
  subCategory: string;
  hits: number;
};

type DestinationChartResponse = {
  categories: CategoryStat[];
  subCategories: SubCategoryStat[];
};

export default function DestinationChart() {
  const [options, setOptions] = useState<any>(null);
  const [chartData, setChartData] = useState<DestinationChartResponse | null>(
    null
  );
  const { theme } = useTheme();
  async function getChartData(): Promise<DestinationChartResponse | undefined> {
    try {
      const res = await axiosPrivate.post("/api/dashboard/destination-chart");
      const json = JSON.parse(await d(res?.data));
      return json;
    } catch (error: any) {
      toast.error("Unable to get destination chart data.");
    }
  }

  function transformToHighcharts(data: DestinationChartResponse | null) {
    const series = [
      {
        name: "Categories",
        colorByPoint: true,
        data: data?.categories.map((c) => ({
          name: c.category,
          y: c.hits,
          drilldown: c.category,
        })),
      },
    ];

    const drilldown = {
      colorByPoint: true,
      breadcrumbs: {
        position: {
          align: "right",
        },
      },
      series: data?.categories.map((c) => ({
        id: c.category,
        data: data.subCategories
          .filter((s) => s.category === c.category)
          .map((s) => [s.subCategory, s.hits]),
      })),
    };

    return { series, drilldown };
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
    const { series, drilldown } = transformToHighcharts(chartData);

    setOptions({
      chart: { type: "column" },
      title: { text: "Destination Hits" },
      xAxis: { type: "category" },
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
        headerFormat: '<span style="font-size:11px">{series.name}</span><br>',
        pointFormat:
          '<span style="color:{point.color}">{point.name}</span>: ' +
          "<b>{point.y}</b><br/>",
      },
      series: series,
      drilldown: drilldown,
      accessibility: {
        enabled: true,
      },
      credits: { enabled: false },
    });
  }, [chartData]);

  if (!options) return <p>Loading chart...</p>;

  return <HighchartsReact key={theme} highcharts={Highcharts} options={options} />;
}
