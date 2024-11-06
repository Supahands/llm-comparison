"use client";

import React, { useEffect } from "react";

import ResultComparison from "@/components/composition/result-comparison";
import { Card, CardContent } from "@/components/ui/card";
import ModelSelector from "@/components/composition/model-selector";
import { LinkPreview } from "@/components/ui/link-preview";
import Title from "@/components/ui/title";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { ModelResponseTime } from "@/components/composition/model-response-time";
import { supabaseClient } from "@/lib/supabase/supabaseClient";
import { Message } from "@/lib/types/message";
import { DATABASE_TABLE } from "@/lib/constants/databaseTables";
import { dataProps } from "@/components/composition/model-response-time";
import { MetricsComposed } from "@/components/composition/metrics-composed";
import OverallPage from "@/components/composition/overall";
import { useRouter } from "next/navigation";

interface databaseProps {
  id: number;
  model_1: string;
  model_2: string;
  response_model_1: string;
  response_model_2: string;
  prompt: string;
  selected_choice: string;
  session_id: string;
  response_time_1: number;
  response_time_2: number;
  completion_token_1: number;
  completion_token_2: number;
}

export interface metricsProps {
  task: string;
  modelA: number;
  modelB: number;
  draw: number;
  reject: number;
}

const ResultPage = ({ params }: { params: { slug: string } }) => {
  const router = useRouter();
  const [allMessage, setAllMessage] = React.useState<Message[]>([]);
  const [allResponseTime, setAllResponseTime] = React.useState<dataProps[]>([]);
  const [statProportion, setStatProportion] = React.useState<metricsProps[]>(
    []
  );
  const [isLoading, setIsLoading] = React.useState<boolean>(true);
  const [modelA, setModelA] = React.useState<string>("");
  const [modelB, setModelB] = React.useState<string>("");
  const [winRateModelA, setWinRateModelA] = React.useState<number>(0);
  const [winRateModelB, setWinRateModelB] = React.useState<number>(0);
  const [averageTokenA, setAverageTokenA] = React.useState<number>(0);
  const [averageTokenB, setAverageTokenB] = React.useState<number>(0);
  const [averageResponseTimeA, setAverageResponseTimeA] =
    React.useState<number>(0);
  const [averageResponseTimeB, setAverageResponseTimeB] =
    React.useState<number>(0);
  const [avgTokenPerResponseTimeA, setAvgTokenPerResponseTimeA] =
    React.useState<number>(0);
  const [avgTokenPerResponseTimeB, setAvgTokenPerResponseTimeB] =
    React.useState<number>(0);

  const handleDownloadMetadata = () => {
    // Convert JSON data to a string
    const jsonString = JSON.stringify({
      message: allMessage,
      response_time: allResponseTime,
      performance_metrics: statProportion,
      latest_metrics: {
        model_a: modelA,
        model_b: modelB,
        model_a_wins: winRateModelA,
        model_b_wins: winRateModelB,
        average_response_time_model_a: winRateModelA,
        average_response_time_model_b: winRateModelB,
        average_token_output_model_a: averageTokenA,
        average_token_output_model_b: averageTokenB,
        average_token_generated_per_second_model_a: avgTokenPerResponseTimeA,
        average_token_generated_per_second_model_b: avgTokenPerResponseTimeB,
      },
    });

    // Create a Blob with the JSON data
    const blob = new Blob([jsonString], { type: "application/json" });

    // Create a download link and click it to start the download
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "data.json"; // Name of the downloaded file
    link.click();

    // Clean up the URL object
    URL.revokeObjectURL(link.href);
  };

  const calculateProportion = (data: databaseProps[] | null) => {
    const modelA = data
      ? data.reduce((counter, x) => {
          if (x.selected_choice === "A") counter += 1;
          return counter;
        }, 0)
      : 0;
    const modelB = data
      ? data.reduce((counter, x) => {
          if (x.selected_choice === "B") counter += 1;
          return counter;
        }, 0)
      : 0;
    const draw = data
      ? data.reduce((counter, x) => {
          if (x.selected_choice === "AB") counter += 1;
          return counter;
        }, 0)
      : 0;
    const reject = data
      ? data.reduce((counter, x) => {
          if (x.selected_choice === "!AB") counter += 1;
          return counter;
        }, 0)
      : 0;

    setStatProportion([
      {
        task: "summary",
        modelA: data ? Number(((modelA / data.length) * 100).toFixed(2)) : 0,
        modelB: data ? Number(((modelB / data.length) * 100).toFixed(2)) : 0,
        draw: data ? Number(((draw / data.length) * 100).toFixed(2)) : 0,
        reject: data ? Number(((reject / data.length) * 100).toFixed(2)) : 0,
      },
    ]);
  };

  async function fetchDataBySessionId(sessionId: string) {
    const { data, error } = await supabaseClient
      .from(
        process.env.NEXT_PUBLIC_RESPONSE_TABLE
          ? process.env.NEXT_PUBLIC_RESPONSE_TABLE
          : ""
      )
      .select()
      .eq("session_id", sessionId);

    return { data, error };
  }

  async function fetchDataAllTime(modelA: string, modelB: string) {
    const { data, error } = await supabaseClient
      .from(
        process.env.NEXT_PUBLIC_RESPONSE_TABLE
          ? process.env.NEXT_PUBLIC_RESPONSE_TABLE
          : ""
      )
      .select()
      .or(
        `and(model_1.eq.${modelA},model_2.eq.${modelB}),and(model_1.eq.${modelB},model_2.eq.${modelA})`
      )
      .order("id", { ascending: false })
      .limit(100);

    calculateDataAllTime(data ? data : [], modelA, modelB);

    return { dataAllTime: data, errorAllTime: error };
  }

  function calculateDataAllTime(
    data: databaseProps[],
    modelA: string,
    modelB: string
  ) {
    let winA = 0;
    let winB = 0;
    let totalTokenA = 0;
    let totalTokenB = 0;
    let responseTimeA = 0;
    let responseTimeB = 0;

    data.map((x) => {
      if (x.model_1 === modelA) {
        totalTokenA += x.completion_token_1;
        totalTokenB += x.completion_token_2;
        responseTimeA += x.response_time_1;
        responseTimeB += x.response_time_2;
        if (x.selected_choice === "A") winA += 1;
        else if (x.selected_choice === "B") winB += 1;
      } else {
        totalTokenA += x.completion_token_2;
        totalTokenB += x.completion_token_1;
        responseTimeA += x.response_time_2;
        responseTimeB += x.response_time_1;
        if (x.selected_choice === "B") winA += 1;
        else if (x.selected_choice === "A") winB += 1;
      }
    });

    setWinRateModelA(winA);
    setWinRateModelB(winB);
    setAverageTokenA(totalTokenA / data.length);
    setAverageTokenB(totalTokenB / data.length);
    setAverageResponseTimeA(
      Number((responseTimeA / data.length / 1000).toFixed(2))
    );
    setAverageResponseTimeB(
      Number((responseTimeB / data.length / 1000).toFixed(2))
    );
    setAvgTokenPerResponseTimeA(
      Number((totalTokenA / responseTimeA / 1000).toFixed(2))
    );
    setAvgTokenPerResponseTimeB(
      Number((totalTokenB / responseTimeB / 1000).toFixed(2))
    );

    return;
  }

  const getData = async () => {
    setIsLoading(true);

    const { data, error } = await fetchDataBySessionId(params.slug);

    const { dataAllTime, errorAllTime } = await fetchDataAllTime(
      data ? data[0].model_1 : "",
      data ? data[0].model_2 : ""
    );

    if (error) {
      console.log("error fetching", error);
      setIsLoading(false);
      return;
    }

    setAllMessage(
      data
        ? data.map(
            (x: {
              id: number;
              prompt: any;
              response_model_1: any;
              response_model_2: any;
              selected_choice: any;
            }) => {
              return {
                id: x.id,
                prompt: x.prompt,
                response1: x.response_model_1,
                response2: x.response_model_2,
                choice: x.selected_choice,
              };
            }
          )
        : []
    );

    setModelA(data ? data[0].model_1 : "");
    setModelB(data ? data[0].model_2 : "");

    let i = 1;
    setAllResponseTime(
      data
        ? data.map(
            (x: {
              id: number;
              response_time_1: number;
              response_time_2: number;
            }) => {
              return {
                task: `Q${i++}`,
                id: x.id,
                timeModelA: Number((x.response_time_1 / 1000).toFixed(2)),
                timeModelB: Number((x.response_time_2 / 1000).toFixed(2)),
              };
            }
          )
        : []
    );

    calculateProportion(data);
    setIsLoading(false);
  };

  useEffect(() => {
    getData();
  }, []);

  return (
    <div className="bg-llm-background h-full space-y-5 pt-7 pb-7 pl-10 pr-10">
      <h1 className="font-bold text-2xl">LLM Comparison Result</h1>
      <div className="flex justify-between gap-4">
        <Button
          onClick={() => router.push(`/`)}
          className="bg-llm-primary50 hover:bg-llm-primary50_hover text-white rounded-2xl"
        >
          Back To Home
        </Button>
        <Button
          onClick={() => {
            if (!isLoading) {
              handleDownloadMetadata();
            }
          }}
          className="bg-llm-btn hover:bg-llm-btn_hover text-white rounded-2xl"
        >
          Export the Metadata
        </Button>
      </div>
      <div className="flex justify-stretch gap-4">
        <ModelResponseTime
          allResponseTime={allResponseTime}
          modelA={modelA}
          modelB={modelB}
          isLoading={isLoading}
        />
        <MetricsComposed
          allMetricsComposed={statProportion}
          modelA={modelA}
          modelB={modelB}
          isLoading={isLoading}
        />
      </div>
      <div className="flex justify-stretch gap-4">
        <OverallPage
          modelA={modelA}
          modelB={modelB}
          avgTime1={averageResponseTimeA}
          avgTime2={averageResponseTimeB}
          totalWinA={winRateModelA}
          totalWinB={winRateModelB}
          avgTokenA={averageTokenA}
          avgTokenB={averageTokenB}
          avgTokenPerTimeA={avgTokenPerResponseTimeA}
          avgTokenPerTimeB={avgTokenPerResponseTimeB}
          isLoading={isLoading}
        />
        {/* <OverallPage /> */}
      </div>
      <ResultComparison
        allMessage={allMessage}
        modelA={modelA}
        modelB={modelB}
        isLoading={isLoading}
      />
      <div className="flex flex-row w-full justify-between mt-4">
        <LinkPreview url="https://supa.so">
          <Image src={`/svg/logo.svg`} alt="SUPA logo" width={93} height={26} />
        </LinkPreview>
      </div>
    </div>
  );
};

export default ResultPage;
