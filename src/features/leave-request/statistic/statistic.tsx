import type { ListleaveRequest } from "../list-leave-request";
import { formatDataForChart } from "./action";
import { type ChartConfig } from "@/components/ui/chart";
import {
  Bar,
  BarChart,
  CartesianGrid,
  XAxis,
  Label,
  Pie,
  PieChart,
} from "recharts";
import { Label as UILabel } from "@/components/ui";
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Input,
  Separator,
} from "@/components/ui";
import { useMemo, useState } from "react";
import { format } from "date-fns";
import { formatDataForStatistc } from "./action/format-data-for-statistic";

const colors = [
  "#2563eb", // blue
  "#60a5fa", // light blue
  "#10b981", // green
  "#facc15", // yellow
  "#f97316", // orange
  "#ef4444", // red
  "#8b5cf6", // violet
  "#ec4899", // pink
];

const chartConfig = {
  totalRequest: {
    label: "Total request",
    color: "#2563eb",
  },
} satisfies ChartConfig;

const Statistic = ({ data }: { data: ListleaveRequest[] }) => {
  const [month, setMonth] = useState(format(new Date(), "M"));
  const [year, setYear] = useState(format(new Date(), "yyyy"));
  const barChartData = formatDataForChart(data)
    .sort((a, b) => b.totalRequest - a.totalRequest)
    .filter((data) => data.month === month && data.year === year)
    .slice(0, 3);

  const pieChartData = formatDataForChart(data)
    .map((item, index) => ({
      ...item,
      fill: colors[index % colors.length],
    }))
    .filter((data) => data.month === month && data.year === year);
  const totalRequest = useMemo(() => {
    return pieChartData
      .filter((data) => data.month === month && data.year === year)
      .reduce((acc, curr) => acc + curr.totalRequest, 0);
  }, [data, month, year]);
  const statisticData = formatDataForStatistc(data).filter(
    (data) => data.month === month && data.year === year
  );

  return (
    <div className="w-full flex sm:justify-around sm:items-stretch sm:flex-row flex-col gap-5">
      <Card className="sm:w-1/5 w-full flex-grow">
        <CardHeader className="flex justify-center items-center pb-0 w-full">
          <CardTitle className="flex flex-col gap-3 w-fit sm:w-full justify-center items-center">
            <div className="flex items-center gap-2">
              <UILabel className="min-w-[60px]">Month</UILabel>
              <Input
                value={month}
                className="w-20 text-center"
                onChange={(e) => {
                  let value = e.target.value.replace(/\D/g, "");

                  if (value.length > 2) value = value.slice(0, 2);
                  if (parseInt(value.charAt(0)) > 1 && value.length > 1)
                    value = value.slice(0, 1);

                  setMonth(value);
                }}
              />
            </div>
            <div className="flex items-center gap-2">
              <UILabel className="min-w-[60px]">Year</UILabel>
              <Input
                value={year}
                className="w-20 text-center"
                onChange={(e) => {
                  let value = e.target.value.replace(/\D/g, "");
                  if (value.length > 4) value = value.slice(0, 4);
                  setYear(value);
                }}
              />
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent className="w-full flex-grow flex flex-col justify-center items-center gap-5">
          {statisticData.length !== 0 ? (
            statisticData.map((data, index) => {
              return (
                <div
                  key={data.status}
                  className=" w-full flex flex-col items-center text-center gap-2 justify-center"
                >
                  <UILabel>Total requests has status {data.status}</UILabel>
                  <div className="sm:text-xl text-lg"> {data.totalRequest}</div>
                  {index !== statisticData.length - 1 && (
                    <Separator className="w-full" />
                  )}
                </div>
              );
            })
          ) : (
            <div className="h-full w-full flex justify-center items-center text-xs">
              No data found
            </div>
          )}
        </CardContent>
      </Card>
      <Card className="sm:w-1/3 w-full flex-grow">
        <CardHeader className="flex justify-between items-center pb-0">
          <CardTitle>Employee absence total</CardTitle>
        </CardHeader>
        <CardContent className="w-full flex-grow">
          <ChartContainer config={chartConfig} className="min-h-[200px] w-full">
            {pieChartData.length === 0 ? (
              <div className="h-full w-full flex justify-center items-center">
                No data found
              </div>
            ) : (
              <PieChart>
                <ChartTooltip content={<ChartTooltipContent />} />
                <Pie
                  data={pieChartData}
                  dataKey="totalRequest"
                  labelLine={false}
                  innerRadius={50}
                  strokeWidth={5}
                  nameKey="name"
                >
                  <Label
                    content={({ viewBox }) => {
                      if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                        return (
                          <text
                            x={viewBox.cx}
                            y={viewBox.cy}
                            textAnchor="middle"
                            dominantBaseline="middle"
                          >
                            <tspan
                              x={viewBox.cx}
                              y={viewBox.cy}
                              className="fill-foreground text-3xl font-bold"
                            >
                              {totalRequest.toLocaleString()}
                            </tspan>
                            <tspan
                              x={viewBox.cx}
                              y={(viewBox.cy || 0) + 24}
                              className="fill-muted-foreground"
                            >
                              Requests
                            </tspan>
                          </text>
                        );
                      }
                    }}
                  />
                </Pie>
              </PieChart>
            )}
          </ChartContainer>
        </CardContent>
      </Card>
      <Card className="sm:w-1/3 w-full flex-grow">
        <CardHeader>
          <CardTitle>Top 3 employees with the most absences</CardTitle>
        </CardHeader>
        <CardContent className="w-full flex-grow">
          <ChartContainer config={chartConfig} className="min-h-[200px] w-full">
            {barChartData.length === 0 ? (
              <div className="h-full w-full flex justify-center items-center">
                No data found
              </div>
            ) : (
              <BarChart
                accessibilityLayer
                data={barChartData}
                margin={{
                  top: 30,
                }}
              >
                <CartesianGrid vertical={false} />
                <XAxis
                  dataKey="name"
                  tickLine={false}
                  tickMargin={10}
                  axisLine={false}
                />
                <ChartTooltip content={<ChartTooltipContent />} />
                <ChartLegend content={<ChartLegendContent />} />
                <Bar
                  barSize={30}
                  dataKey="totalRequest"
                  fill="var(--color-totalRequest)"
                  radius={4}
                />
              </BarChart>
            )}
          </ChartContainer>
        </CardContent>
      </Card>
    </div>
  );
};

export default Statistic;
