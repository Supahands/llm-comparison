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
      .from(DATABASE_TABLE.RESPONSE_TABLE)
      .select()
      .eq("session_id", sessionId);

    return { data, error };
  }

  async function fetchDataAllTime(modelA: string, modelB: string) {
    console.log(
      `and(model_1.eq.${modelA},model_2.eq.${modelB}),and(model_1.eq.${modelB},model_2.eq.${modelA})`
    );
    const { data, error } = await supabaseClient
      .from(DATABASE_TABLE.RESPONSE_TABLE)
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

    console.log(winA);
    console.log(winB);
    console.log(totalTokenA / data.length);
    console.log(totalTokenB / data.length);
    console.log(Number((responseTimeA / data.length / 1000).toFixed(2)));
    console.log(Number((responseTimeB / data.length / 1000).toFixed(2)));
    console.log(Number((totalTokenA / responseTimeA / 1000).toFixed(2)));
    console.log(Number((totalTokenB / responseTimeB / 1000).toFixed(2)));

    return;
  }

  const getData = async () => {
    setIsLoading(true);

    const { data, error } = await fetchDataBySessionId(params.slug);

    const { dataAllTime, errorAllTime } = await fetchDataAllTime(
      data ? data[0].model_1 : "",
      data ? data[0].model_2 : ""
    );
    console.log(dataAllTime);

    if (error) {
      console.log("error fetching", error);
      setIsLoading(false);
      return;
    }

    setAllMessage(
      data
        ? data.map(
            (x: {
              prompt: any;
              response_model_1: any;
              response_model_2: any;
              selected_choice: any;
            }) => {
              return {
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
            (x: { response_time_1: number; response_time_2: number }) => {
              return {
                task: `Q${i++}`,
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
      <ResultComparison
        allMessage={allMessage}
        modelA={modelA}
        modelB={modelB}
        isLoading={isLoading}
      />
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
      <div className="flex flex-row w-full justify-between mt-4">
        <LinkPreview url="https://supa.so">
          <Image src={`svg/logo.svg`} alt="SUPA logo" width={93} height={26} />
        </LinkPreview>
        <Button className="bg-llm-btn hover:bg-llm-btn_hover text-white rounded-2xl">
          Export the Metadata
        </Button>
      </div>
    </div>
  );
};

export default ResultPage;
