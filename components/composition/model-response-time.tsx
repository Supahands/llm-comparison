"use client";

import { Skeleton } from "@/components/ui/skeleton";

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

export const description = "A multiple bar chart";

export interface DataProps {
  task: string;
  timeModelA: number;
  timeModelB: number;
}

interface TimeProps {
  allResponseTime: DataProps[];
  modelA: string;
  modelB: string;
  isLoading: boolean;
}

export function ModelResponseTime({
  allResponseTime,
  modelA,
  modelB,
  isLoading,
}: TimeProps) {
  const chartConfig = {
    timeModelA: {
      label: modelA,
      color: "#6B66FA",
    },
    timeModelB: {
      label: modelB,
      color: "#461353",
    },
  } satisfies ChartConfig;

  const maxDataValue = Math.max(
    ...allResponseTime.flatMap((data) => [data.timeModelA, data.timeModelB])
  );
  const adaptiveMax = maxDataValue * 1.1;

  return (
    <Card className="rounded-xl w-full">
      <CardHeader>
        <CardTitle>Response Time Comparison (s)</CardTitle>
        <CardDescription>
          Compare Each Model Response Time (in seconds) for Each Question.
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
          <ChartContainer config={chartConfig} className="min-h-[10px]">
            <BarChart accessibilityLayer data={allResponseTime}>
              <CartesianGrid vertical={false} />
              <XAxis
                className="font-bold text-sm"
                dataKey="task"
                tickLine={false}
                tickMargin={10}
                axisLine={false}
              />
              <YAxis domain={[0, adaptiveMax]} type="number" hide />
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent className="w-40" />}
              />
              <Bar
                dataKey="timeModelA"
                fill={chartConfig.timeModelA.color}
                radius={4}
              >
                <LabelList
                  dataKey="timeModelA"
                  position="top"
                  offset={10}
                  className="text-sm font-light"
                />
              </Bar>
              <Bar
                dataKey="timeModelB"
                fill={chartConfig.timeModelB.color}
                radius={4}
              >
                <LabelList
                  dataKey="timeModelB"
                  position="top"
                  offset={10}
                  className="text-sm font-light"
                />
              </Bar>
              <ChartLegend
                className="text-base font-semibold"
                content={<ChartLegendContent />}
              />
            </BarChart>
          </ChartContainer>
        )}
      </CardContent>
    </Card>
  );
}
