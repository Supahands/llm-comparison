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
          This is a simple LLM Comparison Tool built by{" "}
          <LinkPreview
            url="https://supa.so"
            className="focus-visible:outline-llm-primary50"
          >
            <span className="underline underline-offset-2">SUPA</span>
          </LinkPreview>{" "}
          where users can input prompts and compare the outputs of two different
          LLMs in a blind test format. This will allow users to objectively
          assess the performance of two models without bias.
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
