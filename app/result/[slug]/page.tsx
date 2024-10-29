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

const ResultPage = ({ params }: { params: { slug: string } }) => {
  const [allMessage, setAllMessage] = React.useState<Message[]>([]);
  const [allResponseTime, setAllResponseTime] = React.useState<dataProps[]>([]);

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
    let i = 0;
    setAllResponseTime(
      data?.map((x) => {
        return {
          task: `Q${i++}`,
          timeModelA: x.response_time_1,
          timeModelB: x.response_time_2,
        };
      })
    );

    console.log(allMessage);
    console.log(allResponseTime);
  };

  useEffect(() => {
    getData();
  }, []);

  return (
    <div className="bg-llm-background h-full space-y-5 pt-7 pb-7 pl-10 pr-10">
      <h1 className="font-bold text-2xl">LLM Comparison Result</h1>
      <ResultComparison allMessage={allMessage} />
      <ModelResponseTime allResponseTime={allResponseTime} />
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
