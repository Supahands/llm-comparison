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
  const [modelA, setModelA] = React.useState<string>("");
  const [modelB, setModelB] = React.useState<string>("");

  const calculateProportion = (data: databaseProps[]) => {
    const modelA = data.reduce((counter, x) => {
      if (x.selected_choice === "A") counter += 1;
      return counter;
    }, 0);
    const modelB = data.reduce((counter, x) => {
      if (x.selected_choice === "B") counter += 1;
      return counter;
    }, 0);
    const draw = data.reduce((counter, x) => {
      if (x.selected_choice === "AB") counter += 1;
      return counter;
    }, 0);
    const reject = data.reduce((counter, x) => {
      if (x.selected_choice === "!AB") counter += 1;
      return counter;
    }, 0);

    setStatProportion([
      {
        task: "summary",
        modelA: Number(((modelA / data.length) * 100).toFixed(2)),
        modelB: Number(((modelB / data.length) * 100).toFixed(2)),
        draw: Number(((draw / data.length) * 100).toFixed(2)),
        reject: Number(((reject / data.length) * 100).toFixed(2)),
      },
    ]);
  };

  const getData = async () => {
    const { data, error } = await supabaseClient
      .from(DATABASE_TABLE.RESPONSE_TABLE)
      .select()
      .eq("session_id", params.slug);

    if (error) {
      console.log("error fetching", error);
      return;
    }

    setAllMessage(
      data?.map((x) => {
        return {
          prompt: x.prompt,
          response1: x.response_model_1,
          response2: x.response_model_2,
          choice: x.selected_choice,
        };
      })
    );

    setModelA(data[0].model_1);
    setModelB(data[0].model_2);

    let i = 1;
    setAllResponseTime(
      data?.map((x) => {
        return {
          task: `Q${i++}`,
          timeModelA: Number((x.response_time_1 / 1000).toFixed(2)),
          timeModelB: Number((x.response_time_2 / 1000).toFixed(2)),
        };
      })
    );

    calculateProportion(data);
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
      />
      <div className="flex justify-stretch gap-4">
        <ModelResponseTime
          allResponseTime={allResponseTime}
          modelA={modelA}
          modelB={modelB}
        />
        <MetricsComposed
          allMetricsComposed={statProportion}
          modelA={modelA}
          modelB={modelB}
        />
      </div>
      {/* <div className="flex justify-stretch gap-4">
        <OverallPage />
        <OverallPage />
      </div> */}
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
