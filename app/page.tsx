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
import * as animationData from "../public/animation/finish";
import { supabaseClient } from "@/lib/supabase/supabaseClient";
import { DATABASE_TABLE } from "@/lib/constants/databaseTables";

export default function Home() {
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
    setIsStopped,
  } = useAppStore();

  const defaultOptions = {
    loop: 3,
    autoplay: false,
    animationData: animationData,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };

  const handleDataSaving = async (choice: string) => {
    const { error } = await supabaseClient
      .from(process.env.NEXT_PUBLIC_RESPONSE_TABLE ?? "")
      .insert([
        {
          session_id: sessionId,
          selected_choice: choice,
          model_1: selectedModel1,
          model_2: selectedModel2,
          response_model_1: responseModel1,
          response_model_2: responseModel2,
          prompt: prompt,
          response_time_1: responseTime1,
          response_time_2: responseTime2,
        },
      ]);

    if (error) {
      console.log("error fetching", error);
    }
  };

  const handleEvaluation = async () => {
    if (selectedChoice) {
      await handleDataSaving(selectedChoice.value);
      router.push(`/result/${sessionId}`);
    }
  };

  return (
    <div className="bg-llm-background h-full min-h-screen flex flex-col">
      <div className="flex flex-col mt-4">
        <div className="flex lg:flex-row flex-col gap-4 w-full">
          <section className="w-full z-40 hidden lg:flex">
            <DescriptionCard />
          </section>

          <section className="w-full">
            <Title>Select models to compare</Title>
            <Card className="w-full lg:min-h-[104px] h-fit">
              <CardContent className="">
                <ModelSelector />
              </CardContent>
            </Card>
          </section>
        </div>
      </div>
      <Comparison />
      <div className="flex flex-row w-full justify-between mt-4 mb-4">
        <LinkPreview
          url="https://supa.so"
          className="focus-visible:outline-llm-primary50"
        >
          <Image src={`svg/logo.svg`} alt="SUPA logo" width={93} height={26} />
        </LinkPreview>
        <Button
          className="bg-llm-btn hover:bg-llm-btn_hover text-white rounded-2xl relative"
          onClick={handleEvaluation}
          disabled={!selectedChoice}
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
