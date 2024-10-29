"use client";

import Comparison from "@/components/composition/comparison";
import { Card, CardContent } from "@/components/ui/card";
import ModelSelector from "@/components/composition/model-selector";
import { LinkPreview } from "@/components/ui/link-preview";
import Title from "@/components/ui/title";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import DescriptionCard from "@/components/composition/description-card";

export default function Home() {
  return (
    <div className="bg-llm-background h-full min-h-screen flex flex-col">
      <div className="flex flex-col mt-4">
        <div className="flex flex-row gap-4 w-full">
          <section className="w-full z-50">
            <DescriptionCard />
          </section>

          <section className="w-full">
            <Title>Select models to compare</Title>
            <Card className="w-full h-[104px]">
              <CardContent className="">
                <ModelSelector />
              </CardContent>
            </Card>
          </section>
        </div>
      </div>
      <Comparison />
      <div className="flex flex-row w-full justify-between mt-4 mb-4">
        <LinkPreview url="https://supa.so">
          <Image src={`svg/logo.svg`} alt="SUPA logo" width={93} height={26} />
        </LinkPreview>
        <Button className="bg-llm-btn hover:bg-llm-btn_hover text-white rounded-2xl">End evaluation and see results</Button>
      </div>
    </div>
  );
}
