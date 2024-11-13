"use client";

import Title from "../ui/title";
import { Card, CardContent } from "../ui/card";
import { LinkPreview } from "../ui/link-preview";
import Link from "next/link";

export default function DescriptionCard() {
  return (
    <div className="flex flex-col">
      <Title>How it works</Title>
      <Card className="w-full lg:min-h-[104px] h-fit">
        <CardContent className="p-4 h-full">
          An open-source LLM comparison tool by{" "}
          <LinkPreview
            url="https://supa.so"
            className="focus-visible:outline-llm-primary50"
          >
            <span className="underline underline-offset-2">SUPA</span>
          </LinkPreview>{" "}
          allows users to input prompts and compare the performance of language
          models in a blind test format. Simply select two models, then test
          them across various prompts and scenarios tailored to your domain.
          Each round provides anonymized responses for evaluation, helping you
          gain a deeper understanding of each model’s capabilities. All
          collected data will be published to contribute to open-source
          research.
          <Link
            href={"https://supa.so/llm-comparison-tool"}
            className="underline underline-offset-2 text-black focus-visible:outline-llm-primary50"
          >
            <div>Learn more</div>
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}
