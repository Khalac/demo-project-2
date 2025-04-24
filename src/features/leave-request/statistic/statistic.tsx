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
} from "@/components/ui";
import { useMemo } from "react";

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
  const barChartData = formatDataForChart(data)
    .sort((a, b) => b.totalRequest - a.totalRequest)
    .slice(0, 3);
  const pieChartData = formatDataForChart(data).map((item, index) => ({
    ...item,
    fill: colors[index % colors.length],
  }));
  const totalRequest = useMemo(() => {
    return pieChartData.reduce((acc, curr) => acc + curr.totalRequest, 0);
  }, [data]);

  return (
    <div className="w-full flex sm:justify-around sm:items-center sm:flex-row flex-col gap-5">
      <Card className="sm:w-1/3 w-full">
        <CardHeader className="items-center pb-0">
          <CardTitle>Employee absence percentage</CardTitle>
        </CardHeader>
        <CardContent className="w-full">
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
                  innerRadius={60}
                  strokeWidth={5}
                  nameKey="name"
                  label={({ payload, ...props }) => {
                    return (
                      <text
                        cx={props.cx}
                        cy={props.cy}
                        x={props.x}
                        y={props.y}
                        textAnchor={props.textAnchor}
                        dominantBaseline={props.dominantBaseline}
                        fill="hsla(var(--foreground))"
                      >
                        {((payload.totalRequest / totalRequest) * 100).toFixed(
                          2
                        )}
                        %
                      </text>
                    );
                  }}
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
      <Card className="sm:w-1/3 w-full">
        <CardHeader>
          <CardTitle>Top 3 employees with the most absences</CardTitle>
        </CardHeader>
        <CardContent className="w-full">
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
