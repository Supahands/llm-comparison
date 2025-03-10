"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  LabelList,
  XAxis,
  YAxis,
} from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { MetricsProps } from "@/app/result/[slug]/page";
import { Skeleton } from "@/components/ui/skeleton";

export const description = "A stacked bar chart with a legend";

const chartData = [{ month: "January", desktop: 186, mobile: 80 }];

const maxDataValue = Math.max(
  ...chartData.map((data) => data.desktop + data.mobile)
);

interface ComponentProps {
  allMetricsComposed: MetricsProps[] | undefined;
  modelA: string;
  modelB: string;
  isLoading: boolean;
}

export function MetricsComposed({
  allMetricsComposed,
  modelA,
  modelB,
  isLoading,
}: ComponentProps) {
  const chartConfig = {
    modelA: {
      label: `${modelA} won`,
      color: "#6B66FA",
    },
    modelB: {
      label: `${modelB} won`,
      color: "#461353",
    },
    draw: {
      label: "Both Selected",
      color: "#395B50",
    },
    reject: {
      label: "Both Rejected",
      color: "#e03e3e",
    },
  } satisfies ChartConfig;

  const renderLabel = (props: any) => {
    if (props === 0) return "";
    else return `${props}%`;
  };
  return (
    <Card className="rounded-xl w-full">
      <CardHeader>
        <CardTitle>Performance Metrics</CardTitle>
        <CardDescription>
          Percentage of Winning, Draw, or Rejected
        </CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex flex-col">
            <Skeleton className="w-full h-96 p-4 border border-gray-200 rounded-xl mb-3" />
            <div className="flex justify-center gap-4">
              <div className="flex gap-2">
                <Skeleton className="w-4 h-4  border border-gray-200 rounded-xl" />
                <Skeleton className="w-20 h-4  border border-gray-200 rounded-xl" />
              </div>
              <div className="flex gap-2">
                <Skeleton className="w-4 h-4  border border-gray-200 rounded-xl" />
                <Skeleton className="w-20 h-4  border border-gray-200 rounded-xl" />
              </div>
            </div>
          </div>
        ) : (
          <ChartContainer config={chartConfig} className="min-h-[220px] w-full">
            <BarChart
              accessibilityLayer
              data={allMetricsComposed}
              layout="vertical"
            >
              <CartesianGrid horizontal={false} />
              <YAxis
                dataKey="month"
                type="category"
                tickLine={false}
                tickMargin={10}
                axisLine={false}
                tickFormatter={(value) => value.slice(0, 3)}
                hide
              />
              <XAxis dataKey="desktop" domain={[0, 100]} type="number" hide />
              <ChartTooltip
                cursor={false}
                content={
                  <ChartTooltipContent indicator="line" className="w-40" />
                }
              />
              <Bar
                dataKey="modelA"
                layout="vertical"
                fill="var(--color-modelA)"
                stackId="a"
              >
                <LabelList
                  className="text-base md:text-xl font-bold"
                  position="middle"
                  fill="#ffffff"
                  dataKey="modelA"
                  formatter={renderLabel}
                ></LabelList>
              </Bar>
              <Bar
                dataKey="modelB"
                layout="vertical"
                fill="var(--color-modelB)"
                stackId="a"
              >
                <LabelList
                  className="text-base md:text-xl font-bold"
                  position="middle"
                  fill="#ffffff"
                  formatter={renderLabel}
                  dataKey="modelB"
                ></LabelList>
              </Bar>
              <Bar
                dataKey="draw"
                layout="vertical"
                fill="var(--color-draw)"
                stackId="a"
              >
                <LabelList
                  className="text-base md:text-xl font-bold"
                  position="middle"
                  fill="#ffffff"
                  dataKey="draw"
                  formatter={renderLabel}
                ></LabelList>
              </Bar>
              <Bar
                dataKey="reject"
                layout="vertical"
                fill="var(--color-reject)"
                stackId="a"
              >
                <LabelList
                  className="text-base md:text-xl font-bold"
                  position="middle"
                  fill="#ffffff"
                  dataKey="reject"
                  formatter={renderLabel}
                ></LabelList>
              </Bar>
              <ChartLegend
                className="text-sm justify-between font-semibold grid grid-cols-2 md:grid-cols-4"
                content={<ChartLegendContent className="" />}
              />
            </BarChart>
          </ChartContainer>
        )}
      </CardContent>
    </Card>
  );
}
