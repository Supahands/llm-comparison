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
import { FaDownload } from "react-icons/fa6";
import OverallSessionPage from "@/components/composition/overall-session";

import { FaGithub } from "react-icons/fa";
import { IoStarOutline } from "react-icons/io5";

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

  const [stars, setStars] = React.useState<string>("");
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

  const [winRateModelASession, setWinRateModelASession] =
    React.useState<number>(0);
  const [winRateModelBSession, setWinRateModelBSession] =
    React.useState<number>(0);
  const [averageTokenASession, setAverageTokenASession] =
    React.useState<number>(0);
  const [averageTokenBSession, setAverageTokenBSession] =
    React.useState<number>(0);
  const [averageResponseTimeASession, setAverageResponseTimeASession] =
    React.useState<number>(0);
  const [averageResponseTimeBSession, setAverageResponseTimeBSession] =
    React.useState<number>(0);
  const [avgTokenPerResponseTimeASession, setAvgTokenPerResponseTimeASession] =
    React.useState<number>(0);
  const [avgTokenPerResponseTimeBSession, setAvgTokenPerResponseTimeBSession] =
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

    const responseTime1 = data
      ? data.reduce((total, x) => {
          return (total += x.response_time_1);
        }, 0) / 1000
      : 0;

    const responseTime2 = data
      ? data.reduce((total, x) => {
          return (total += x.response_time_2);
        }, 0) / 1000
      : 0;

    const totalToken1 = data
      ? data.reduce((total, x) => {
          return (total += x.completion_token_1);
        }, 0)
      : 0;

    const totalToken2 = data
      ? data.reduce((total, x) => {
          return (total += x.completion_token_2);
        }, 0)
      : 0;

    const tokenPerResponseTime1 = totalToken1 / responseTime1;

    const tokenPerResponseTime2 = totalToken2 / responseTime2;

    setWinRateModelASession(modelA);
    setWinRateModelBSession(modelB);
    setAverageResponseTimeASession(data ? responseTime1 / data.length : 0);
    setAverageResponseTimeBSession(data ? responseTime2 / data.length : 0);
    setAverageTokenASession(data ? totalToken1 / data.length : 0);
    setAverageTokenBSession(data ? totalToken2 / data.length : 0);
    setAvgTokenPerResponseTimeASession(tokenPerResponseTime1);
    setAvgTokenPerResponseTimeBSession(tokenPerResponseTime2);

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
      Number((totalTokenA / (responseTimeA / 1000)).toFixed(2))
    );
    setAvgTokenPerResponseTimeB(
      Number((totalTokenB / (responseTimeB / 1000)).toFixed(2))
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

  function formatStarCount(count: number): string {
    if (count >= 1000000) {
      return (count / 1000000).toFixed(1) + "M";
    } else if (count >= 1000) {
      return (count / 1000).toFixed(1) + "K";
    }
    return count.toString();
  }

  const getStarsRepo = async (): Promise<void> => {
    try {
      const response = await fetch(
        "https://api.github.com/repos/Supahands/llm-comparison-frontend",
        {
          headers: {
            Authorization: `token ${process.env.NEXT_PUBLIC_TOKEN}`,
          },
        }
      );
      if (!response.ok) {
        throw new Error(`Failed to fetch: ${response.statusText}`);
      }

      const data = (await response.json()) as { stargazers_count: number };
      setStars(formatStarCount(data.stargazers_count || 0));
    } catch (error) {
      console.error("Error fetching stars:", error);
      setStars("0");
    }
  };

  useEffect(() => {
    getData();
    getStarsRepo();
  }, []);

  return (
    <div className="bg-llm-background h-full space-y-5 pt-7 pb-7 lg:px-10 px-3">
      <Title>Evaluation Summary</Title>
      <div className="grid grid-cols-1 md:grid-cols-2 justify-between gap-4 items-center">
        <div className="bg-white border border-gray-200 p-5 rounded-xl">
          Review your blind test results and decide which Large Language Model
          is the best for your use case. Want to start over?
          <a className="hover:underline" href="/">
            {" "}
            Click Here!
          </a>
        </div>
        <div className="flex justify-end">
          <Button
            onClick={() => {
              if (!isLoading) {
                handleDownloadMetadata();
              }
            }}
            className="bg-llm-btn hover:bg-llm-btn_hover text-white rounded-3xl"
          >
            Export Results
            <FaDownload />
          </Button>
        </div>
      </div>
      <div>
        <Title>Session</Title>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 justify-stretch gap-4">
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
      <div className="flex gap-4">
        <OverallSessionPage
          modelA={modelA}
          modelB={modelB}
          avgTime1={averageResponseTimeASession}
          avgTime2={averageResponseTimeBSession}
          totalWinA={winRateModelASession}
          totalWinB={winRateModelBSession}
          avgTokenA={averageTokenASession}
          avgTokenB={averageTokenBSession}
          avgTokenPerTimeA={avgTokenPerResponseTimeASession}
          avgTokenPerTimeB={avgTokenPerResponseTimeBSession}
          isLoading={isLoading}
        />
      </div>
      <ResultComparison
        allMessage={allMessage}
        modelA={modelA}
        modelB={modelB}
        isLoading={isLoading}
      />
      <div>
        <Title>Global</Title>
      </div>
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
      <div className="flex flex-row w-full justify-between">
        <div className="flex gap-4 items-center w-full mb-6">
          <LinkPreview
            url="https://supa.so"
            className="focus-visible:outline-llm-primary50 h-full flex"
          >
            <Image
              src={`/svg/logo.svg`}
              alt="SUPA logo"
              className="mb-5 h-full"
              width={93}
              height={26}
            />
          </LinkPreview>
          <div
            className=" items-center flex font-extralight h-full group"
            onClick={() => {
              router.push(
                "https://github.com/Supahands/llm-comparison-frontend"
              );
            }}
          >
            <div className="bg-white w-[40px] flex h-full group-hover:bg-gray-300 items-center justify-center rounded-l-lg border-t border-l border-b">
              <FaGithub size={24} />
            </div>
            <div className="p-2 text-base font-semibold flex gap-[3px] justify-center items-center border-t border-r border-b bg-transparent group-hover:bg-gray-300 rounded-r-lg h-full">
              <IoStarOutline /> {stars === "0" ? "Star" : stars}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResultPage;
