import React from "react";

import ResultComparison from "@/components/composition/result-comparison";
import { Card, CardContent } from "@/components/ui/card";
import ModelSelector from "@/components/composition/model-selector";
import { LinkPreview } from "@/components/ui/link-preview";
import Title from "@/components/ui/title";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { ModelResponseTime } from "@/components/composition/model-response-time";

const ResultPage = () => {
  return (
    <div className="bg-llm-background h-full space-y-5">
      <h1 className="font-bold text-2xl">LLM Comparison Result</h1>
      <ResultComparison />
      <ModelResponseTime />
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
