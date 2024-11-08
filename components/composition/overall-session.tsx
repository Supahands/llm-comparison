import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

import { Skeleton } from "@/components/ui/skeleton";
interface componentProps {
  modelA: string;
  modelB: string;
  avgTime1: number;
  avgTime2: number;
  totalWinA: number;
  totalWinB: number;
  avgTokenA: number;
  avgTokenB: number;
  avgTokenPerTimeA: number;
  avgTokenPerTimeB: number;
  isLoading: boolean;
}

const OverallSessionPage = ({
  modelA,
  modelB,
  avgTime1,
  avgTime2,
  totalWinA,
  totalWinB,
  avgTokenA,
  avgTokenB,
  avgTokenPerTimeA,
  avgTokenPerTimeB,
  isLoading,
}: componentProps) => {
  console.log(modelA, modelB);
  return (
    <Card className="w-full rounded-xl">
      <CardHeader>
        <CardTitle>Head to Head Comparison</CardTitle>
        <CardDescription>Based on this session</CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex flex-col">
            <div className="flex justify-between mb-3">
              <Skeleton className="w-32 h-5  border border-gray-200 rounded-xl" />
              <Skeleton className="w-32 h-5  border border-gray-200 rounded-xl" />
            </div>
            <div className="flex justify-between mb-3">
              <Skeleton className="w-5 h-5  border border-gray-200 rounded-xl" />
              <Skeleton className="w-32 h-5  border border-gray-200 rounded-xl" />
              <Skeleton className="w-5 h-5  border border-gray-200 rounded-xl" />
            </div>
            <div className="flex justify-between mb-3">
              <Skeleton className="w-full h-5  border border-gray-200 rounded-xl" />
            </div>
            <div className="flex justify-between mb-3">
              <Skeleton className="w-5 h-5  border border-gray-200 rounded-xl" />
              <Skeleton className="w-32 h-5  border border-gray-200 rounded-xl" />
              <Skeleton className="w-5 h-5  border border-gray-200 rounded-xl" />
            </div>
            <div className="flex justify-between mb-3">
              <Skeleton className="w-full h-5  border border-gray-200 rounded-xl" />
            </div>
            <div className="flex justify-between mb-3">
              <Skeleton className="w-5 h-5  border border-gray-200 rounded-xl" />
              <Skeleton className="w-32 h-5  border border-gray-200 rounded-xl" />
              <Skeleton className="w-5 h-5  border border-gray-200 rounded-xl" />
            </div>
            <div className="flex justify-between mb-3">
              <Skeleton className="w-full h-5  border border-gray-200 rounded-xl" />
            </div>
            <div className="flex justify-between mb-3">
              <Skeleton className="w-5 h-5  border border-gray-200 rounded-xl" />
              <Skeleton className="w-32 h-5  border border-gray-200 rounded-xl" />
              <Skeleton className="w-5 h-5  border border-gray-200 rounded-xl" />
            </div>
            <div className="flex justify-between mb-3">
              <Skeleton className="w-full h-5  border border-gray-200 rounded-xl" />
            </div>
          </div>
        ) : (
          <div className="pl-4 pr-4 pb-4">
            <div className="flex flex-col mb-3">
              <div className="flex justify-between justify-self-center mb-5 gap-4 text-xl font-semibold">
                <p className="text-base md:text-xl">{modelA}</p>
                <p className="text-base md:text-xl">{modelB}</p>
              </div>
              <div className="flex justify-between justify-self-center mb-3">
                <p className="text-sm md:text-base">{totalWinA}</p>
                <p className="text-sm md:text-base text-gray-500">Wins</p>
                <p className="text-sm md:text-base">{totalWinB}</p>
              </div>
              <Progress
                value={totalWinA}
                max={totalWinA + totalWinB}
                indicatorColor="bg-[#6B66fa]"
                className="bg-[#461353]"
              />
            </div>
            <div className="flex flex-col mb-3">
              <div className="flex justify-between mb-3 gap-4">
                <p className="text-sm md:text-base">{avgTime1.toFixed(3)}</p>
                <p className="text-sm md:text-base text-gray-500">
                  Avg. Response Time (s)
                </p>
                <p className="text-sm md:text-base">{avgTime2.toFixed(3)}</p>
              </div>
              <Progress
                value={avgTime1}
                max={avgTime1 + avgTime2}
                indicatorColor="bg-[#6B66fa]"
                className="bg-[#461353]"
              />
            </div>
            <div className="flex flex-col mb-3">
              <div className="flex justify-between mb-3 gap-4">
                <p className="text-sm md:text-base">{avgTokenA.toFixed(3)}</p>
                <p className="text-sm md:text-base text-gray-500">
                  Avg. Token Generated
                </p>
                <p className="text-sm md:text-base">{avgTokenB.toFixed(3)}</p>
              </div>
              <Progress
                value={avgTokenA}
                max={avgTokenA + avgTokenB}
                indicatorColor="bg-[#6B66fa]"
                className="bg-[#461353]"
              />
            </div>
            <div className="flex flex-col mb-3 ">
              <div className="flex justify-between gap-4 mb-3">
                <p className="text-sm md:text-base">
                  {avgTokenPerTimeA.toFixed(3)}
                </p>
                <p className="text-sm md:text-base text-gray-500">
                  Avg. Token Generated per second
                </p>
                <p className="text-sm md:text-base">
                  {avgTokenPerTimeB.toFixed(3)}
                </p>
              </div>
              <Progress
                value={avgTokenPerTimeA}
                indicatorColor="bg-[#6B66fa]"
                className="bg-[#461353]"
                max={avgTokenPerTimeA + avgTokenPerTimeB}
              />
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default OverallSessionPage;
