"use client";

import Comparison from "@/components/composition/comparison";
import { ebGaramond } from "./layout";
import { Card, CardContent } from "@/components/ui/card";
import { ComboBox, ComboBoxItem } from "@/components/ui/combo-box";
import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";
import AvailableModel, {
  createAvailableModel,
} from "@/lib/types/availableModel";
import { DATABASE_TABLE } from "@/lib/constants/databaseTables";
import ModelSelector from "@/components/composition/model-selector";
import { LinkPreview } from "@/components/ui/link-preview";
import Title from "@/components/ui/title";
import Image from "next/image";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div className="bg-llm-background h-full">
      <div className="flex flex-col">
        <div className="flex flex-row gap-4 w-full">
          <section className="w-full">
            <Title>How it works</Title>
            <Card className="w-full h-[104px]">
              <CardContent className="p-4 h-full">
                This is a simple LLM Comparison Tool built by{" "}
                <LinkPreview url="https://supa.so">
                  <span className="underline underline-offset-2">SUPA</span>
                </LinkPreview>{" "}
                where users can input prompts and compare the outputs of two
                different LLMs in a blind test format. This will allow users to
                objectively assess the performance of two models without bias.
                Learn more
              </CardContent>
            </Card>
          </section>

          <section className="w-full">
            <Title>Select models to compare</Title>
            <Card className="w-full h-[104px]">
              <CardContent>
                <ModelSelector />
              </CardContent>
            </Card>
          </section>
        </div>
      </div>
      <Comparison />
      <div className="flex flex-row w-full justify-between mt-4">
        <LinkPreview url="https://supa.so">
          <Image src={`svg/logo.svg`} alt="SUPA logo" width={93} height={26} />
        </LinkPreview>
        <Button className="bg-llm-btn hover:bg-llm-btn_hover text-white rounded-2xl">End evaluation and see results</Button>
      </div>
    </div>
  );
}
