"use client";

import Title from "../ui/title";
import { Card, CardContent } from "../ui/card";
import { LinkPreview } from "../ui/link-preview";

export default function DescriptionCard() {
  return (
    <>
      <Title>How it works</Title>
      <Card className="w-full h-[104px]">
        <CardContent className="p-4 h-full">
          This is a simple LLM Comparison Tool built by{" "}
          <LinkPreview url="https://supa.so" className="z-50">
            <span className="underline underline-offset-2">SUPA</span>
          </LinkPreview>{" "}
          where users can input prompts and compare the outputs of two different
          LLMs in a blind test format. This will allow users to objectively
          assess the performance of two models without bias. Learn more
        </CardContent>
      </Card>
    </>
  );
}
