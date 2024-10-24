"use client"

import Comparison from "@/components/composition/comparison";
import { ebGaramond } from "./layout";
import { Card, CardContent } from "@/components/ui/card";
import { ComboBox, ComboBoxItem } from "@/components/ui/combo-box";
import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";
import AvailableModel, { createAvailableModel } from "@/lib/types/availableModel";
import { DATABASE_TABLE } from "@/lib/constants/databaseTables";


const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? ""
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? ""
const supabase = createClient(supabaseUrl,  supabaseKey)

const frameworks = [
  {
    value: "next.js",
    label: "Next.js",
  },
  {
    value: "sveltekit",
    label: "SvelteKit",
  },
  {
    value: "nuxt.js",
    label: "Nuxt.js",
  },
  {
    value: "remix",
    label: "Remix",
  },
  {
    value: "astro",
    label: "Astro",
  },
];

export default function Home() {
  const [selectedModel1, setSelectedModel1] = useState<string>("");
  const [selectedModel2, setSelectedModel2] = useState<string>("");
  const [availableModels, setAvailableModels] = useState<ComboBoxItem[]>([])

  useEffect(() => {
    getAvailableModels()
  }, [])
  
  const getAvailableModels = async () => {
    const { data, error } = await supabase.from("available_models").select()
    if (error) {
      console.log('error fetching', error)
      return
    }
    const availableModels: AvailableModel[] = data?.map(x => createAvailableModel({
      id: x.id,
      provider: x.provider,
      model_name: x.model_name
    })) || [];
    const items = availableModels.map(x => x.toComboBoxItem())
    console.log('available models', items)
    setAvailableModels(items);
  }

  return (
    <div className="bg-llm-background h-full">
      <div className="flex flex-col">
        <div className="flex flex-row gap-4 w-full">
          <section className="w-full">
            <h1
              className={`text-2xl ${ebGaramond.className} font-semibold text-llm-grey1`}
            >
              How it works
            </h1>
            <Card className="w-full h-[104px]">
              <CardContent className="p-4 h-full">
                This is a simple LLM Comparison Tool built by SUPA where users
                can input prompts and compare the outputs of two different LLMs
                in a blind test format. This will allow users to objectively
                assess the performance of two models without bias. Learn more
              </CardContent>
            </Card>
          </section>

          <section className="w-full">
            <h1
              className={`text-2xl ${ebGaramond.className} font-semibold text-llm-grey1`}
            >
              Select models to compare
            </h1>
            <Card className="w-full h-[104px]">
              <CardContent className="p-4 h-full flex items-center gap-4 ">
                <div>
                  <div>Model 1</div>
                  <ComboBox
                    items={availableModels}
                    onItemSelect={setSelectedModel1}
                  ></ComboBox>
                </div>
                <div>
                  <div>Model 2</div>
                  <ComboBox
                    items={availableModels}
                    onItemSelect={setSelectedModel2}
                  ></ComboBox>
                </div>
              </CardContent>
            </Card>
          </section>
        </div>
      </div>
      <Comparison />
    </div>
  );
}
