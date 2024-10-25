"use client";

import { TrendingUp } from "lucide-react";
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

export const description = "A multiple bar chart";

const chartData: dataProps[] = [
  { task: "Q1", timeModelA: 3.3, timeModelB: 5.5 },
  { task: "Q2", timeModelA: 3.2, timeModelB: 6.6 },
  { task: "Q3", timeModelA: 4.1, timeModelB: 7.1 },
  { task: "Q4", timeModelA: 2.8, timeModelB: 9.1 },
];

interface dataProps {
  task: string;
  timeModelA: number;
  timeModelB: number;
}

const chartConfig = {
  timeModelA: {
    label: "Model A",
    color: "#395b50",
  },
  timeModelB: {
    label: "Model B",
    color: "#c5d1eb",
  },
} satisfies ChartConfig;

export function ModelResponseTime() {
  return (
    <Card className="rounded-xl">
      <CardHeader>
        <CardTitle>Bar Chart - Multiple</CardTitle>
        <CardDescription>January - June 2024</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="min-h-[200px]">
          <BarChart accessibilityLayer data={chartData}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="task"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
            />
            <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
            <Bar
              dataKey="timeModelA"
              fill={chartConfig.timeModelA.color}
              radius={4}
            />
            <Bar
              dataKey="timeModelB"
              fill={chartConfig.timeModelB.color}
              radius={4}
            />
          </BarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="flex gap-2 font-medium leading-none">
          Trending up by 5.2% this month <TrendingUp className="h-4 w-4" />
        </div>
        <div className="leading-none text-muted-foreground">
          Showing total visitors for the last 6 months
        </div>
      </CardFooter>
    </Card>
  );
}
