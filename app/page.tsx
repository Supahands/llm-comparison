"use client";

import Comparison from "@/components/composition/comparison";
import { Card, CardContent } from "@/components/ui/card";
import ModelSelector from "@/components/composition/model-selector";
import { LinkPreview } from "@/components/ui/link-preview";
import Title from "@/components/ui/title";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import DescriptionCard from "@/components/composition/description-card";
import { useRouter } from "next/navigation";
import useAppStore from "@/hooks/store/useAppStore";
import Lottie from "react-lottie";
import * as animationData from "@/public/animation/finish";
import { supabaseClient } from "@/lib/supabase/supabaseClient";
import { DATABASE_TABLE } from "@/lib/constants/databaseTables";

import { FaGithub } from "react-icons/fa";
import { IoStarOutline } from "react-icons/io5";
import { usePostHog } from "posthog-js/react";

import { useEffect, useState } from "react";

export default function Home() {
  const [stars, setStars] = useState<string>("");
  const router = useRouter();
  const {
    sessionId,
    isStopped,
    selectedChoice,
    selectedModel1,
    selectedModel2,
    responseModel1,
    responseModel2,
    responseTime1,
    responseTime2,
    prompt,
    responseOrder,
    setIsStopped,
    promptToken,
    completionToken1,
    completionToken2,
    temperature,
    systemPrompt,
    topP,
    maxTokens,
    jsonFormat,
    images,
  } = useAppStore();

  const posthog = usePostHog();

  const defaultOptions = {
    loop: 3,
    autoplay: false,
    animationData: animationData,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };

  async function handleUpload() {
    const formData = new FormData();

    images.forEach((file) => {
      formData.append("files", file);
    });
    try {
      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (response.ok) {
        console.log(data);
      } else {
        console.error("error on uploading images", data);
      }
    } catch (err) {
      console.error("error on uploading images", err);
    }
  }

  const handleDataSaving = async (choice: string) => {
    handleUpload();

    let correctChoice = choice;
    if (choice === "A") {
      correctChoice = responseOrder?.choice1 === selectedModel1 ? "A" : "B";
    } else if (choice === "B") {
      correctChoice = responseOrder?.choice2 === selectedModel2 ? "B" : "A";
    }

    const { error } = await supabaseClient
      .from(DATABASE_TABLE.RESPONSE)
      .insert([
        {
          session_id: sessionId,
          selected_choice: correctChoice,
          model_1: selectedModel1,
          model_2: selectedModel2,
          response_model_1: responseModel1.replace(
            /<redacted>(.*?)<\/redacted>/g,
            "$1"
          ),
          response_model_2: responseModel2.replace(
            /<redacted>(.*?)<\/redacted>/g,
            "$1"
          ),
          prompt: prompt,
          response_time_1: responseTime1,
          response_time_2: responseTime2,
          prompt_token: promptToken,
          completion_token_1: completionToken1,
          completion_token_2: completionToken2,
          model_config: `{"system_prompt":"${systemPrompt}","temperature":${temperature},"top_p":${topP},"max_tokens":${maxTokens},"json_format":${jsonFormat}}`,
          image_namefile: images.map((file) => file.name),
        },
      ]);

    if (error) {
      console.log("error fetching", error);
    }
  };

  const handleEvaluation = async () => {
    if (selectedChoice) {
      posthog?.capture("llm-compare.app.end-evaluation");
      await handleDataSaving(selectedChoice.value);
      router.push(`/result/${sessionId}`);
    }
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
        "https://api.github.com/repos/Supahands/llm-comparison-frontend"
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
    getStarsRepo();
  }, []);

  return (
    <div className="bg-llm-background h-full min-h-screen flex flex-col">
      <div className="flex flex-col mt-4">
        <div className="flex lg:flex-row flex-col gap-4 w-full h-full">
          <section className="w-1/2 z-40 hidden lg:flex">
            <DescriptionCard />
          </section>

          <section className="w-full lg:w-1/2 flex">
            <div className="flex flex-col w-full ">
              <Title>Select models to compare</Title>
              <Card className="w-full h-full rounded-xl">
                <CardContent className="w-full h-full p-2">
                  <ModelSelector />
                </CardContent>
              </Card>
            </div>
          </section>
        </div>
      </div>
      <div className="relative z-10">
        <Comparison />
      </div>
      <div className="flex flex-row w-full lg:justify-between justify-end mt-4 mb-4">
        <div className="flex gap-4 relative z-20">
          <LinkPreview
            url="https://supa.so"
            className="focus-visible:outline-llm-primary50 hidden lg:flex"
          >
            <Image
              src={`svg/logo.svg`}
              alt="SUPA logo"
              width={93}
              height={26}
            />
          </LinkPreview>

          <div
            className="hidden lg:flex items-center font-extralight h-full group"
            onClick={() => {
              router.push(
                "https://github.com/Supahands/llm-comparison-frontend"
              );
            }}
          >
            <div className="bg-white w-[40px] flex group-hover:bg-gray-300 items-center justify-center rounded-l-lg border-t border-l border-b h-full">
              <FaGithub size={24} />
            </div>
            <div className="p-2 text-base font-semibold flex gap-[3px] justify-center items-center border-t border-r border-b bg-transparent group-hover:bg-gray-300 rounded-r-lg h-full">
              <IoStarOutline /> {stars === "0" ? "Star" : stars}
            </div>
          </div>
        </div>

        <Button
          className="bg-llm-btn hover:bg-llm-btn_hover text-white rounded-xl relative"
          onClick={handleEvaluation}
          disabled={!selectedChoice}
          id='end-eval-button'
          data-testid='end-eval-button'
        >
          <div className="fixed pointer-events-none">
            <Lottie
              eventListeners={[
                {
                  eventName: "complete",
                  callback: () => {
                    setIsStopped(true);
                  },
                },
              ]}
              width={300}
              height={150}
              options={defaultOptions}
              isStopped={isStopped}
            />
          </div>
          End evaluation and see results
        </Button>
      </div>
    </div>
  );
}
