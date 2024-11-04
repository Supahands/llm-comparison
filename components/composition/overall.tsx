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
}: componentProps) => {
  console.log(modelA, modelB);
  return (
    <Card className="w-full rounded-xl">
      <CardHeader>
        <CardTitle>Head-to-Head Comparison Last 100 Questions</CardTitle>
        <CardDescription>Winning rate and other metrics </CardDescription>
      </CardHeader>
      <CardContent>
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
            <p>{avgTime1}</p>
            <p>Avg. Response Time (s)</p>
            <p>{avgTime2}</p>
          </div>
          <Progress value={avgTime1} max={avgTime1 + avgTime2} />
        </div>
        <div className="flex flex-col mb-3">
          <div className="flex justify-between mb-3">
            <p>{avgTokenA}</p>
            <p>Avg. Token Generated</p>
            <p>{avgTokenB}</p>
          </div>
          <Progress value={avgTokenA} max={avgTokenA + avgTokenB} />
        </div>
        <div className="flex flex-col mb-3">
          <div className="flex justify-between mb-3">
            <p>{avgTokenPerTimeA}</p>
            <p>Avg. Token Generated per second</p>
            <p>{avgTokenPerTimeB}</p>
          </div>
          <Progress
            value={avgTokenPerTimeA}
            max={avgTokenPerTimeA + avgTokenPerTimeB}
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default OverallPage;
