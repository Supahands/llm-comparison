import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

import { Skeleton } from "@/components/ui/skeleton";
interface ComponentProps {
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

const OverallPage = ({
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
}: ComponentProps) => {
  return (
    <Card className="w-full rounded-xl">
      <CardHeader>
        <CardTitle>Head-to-Head Comparison Last 100 Questions</CardTitle>
        <CardDescription>Winning rate and other metrics </CardDescription>
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
          <div>
            <div className="flex flex-col mb-3">
              <div className="flex justify-between justify-self-center mb-5 text-xl font-semibold">
                <p>{modelA}</p>
                <p>{modelB}</p>
              </div>
              <div className="flex justify-between justify-self-center mb-3">
                <p>{totalWinA}</p>
                <p>Wins</p>
                <p>{totalWinB}</p>
              </div>
              <Progress value={totalWinA} max={totalWinA + totalWinB} />
            </div>
            <div className="flex flex-col mb-3">
              <div className="flex justify-between mb-3">
                <p>{avgTime1.toFixed(3)}</p>
                <p>Avg. Response Time (s)</p>
                <p>{avgTime2.toFixed(3)}</p>
              </div>
              <Progress value={avgTime1} max={avgTime1 + avgTime2} />
            </div>
            <div className="flex flex-col mb-3">
              <div className="flex justify-between mb-3">
                <p>{avgTokenA.toFixed(3)}</p>
                <p>Avg. Token Generated</p>
                <p>{avgTokenB.toFixed(3)}</p>
              </div>
              <Progress value={avgTokenA} max={avgTokenA + avgTokenB} />
            </div>
            <div className="flex flex-col mb-3">
              <div className="flex justify-between mb-3">
                <p>{avgTokenPerTimeA.toFixed(3)}</p>
                <p>Avg. Token Generated per second</p>
                <p>{avgTokenPerTimeB.toFixed(3)}</p>
              </div>
              <Progress
                value={avgTokenPerTimeA}
                max={avgTokenPerTimeA + avgTokenPerTimeB}
              />
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default OverallPage;
