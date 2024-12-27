import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Slider } from "@/components/ui/slider";
import { ConfigRequest } from "@/lib/types/message";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";

export function BadgeDestructive() {
  return <Badge variant="destructive">Destructive</Badge>;
}

interface ModelConfigProps {
  config: ConfigRequest | null | undefined;
  modelA: string;
  modelB: string;
  isLoading: boolean;
}

export default function ModelConfig({
  config,
  modelA,
  modelB,
  isLoading,
}: ModelConfigProps) {
  return (
    <Card className="rounded-xl w-full">
      <CardHeader>
        <CardTitle>Model Config</CardTitle>
        <CardDescription>
          Custom made configuration for both models.
        </CardDescription>
      </CardHeader>
      <CardContent className="px-6 pb-6 h-full">
        {isLoading ? (
          <div className="flex flex-col">
            <div className="flex items-center w-full justify-center gap-4">
              <div className="text-center w-full">
                <Skeleton className="px-4 py-2 md:px-6 md:py-3 w-32 rounded-full justify-self-center h-14" />
                <p className="text-xs md:text-base text-gray-500 mt-1">
                  Model A
                </p>
              </div>
              <span className="text-xl text-center w-[5vw] font-medium text-gray-400">
                vs
              </span>
              <div className="text-center w-full">
                <Skeleton className="px-4 py-2 md:px-6 md:py-3 w-32 rounded-full justify-self-center h-14" />
                <p className="text-xs md:text-base text-gray-500 mt-1">
                  Model B
                </p>
              </div>
            </div>

            <Separator className="my-6" />

            <div className="flex w-full h-full gap-4 flex-col md:flex-row">
              {/* Left Column */}
              <div className="flex w-full flex-col h-full space-y-6">
                <div className="flex w-full flex-col gap-2">
                  <div className="flex justify-between">
                    <p className="font-bold text-sm md:text-base">
                      Temperature
                    </p>
                    <Skeleton className="w-10 h-5 rounded-full" />
                  </div>
                  <Skeleton className="w-full h-4 rounded-full" />
                </div>
                <div className="flex w-full flex-col gap-2">
                  <div className="flex justify-between flex-row">
                    <p className="font-bold text-sm md:text-base">Top P</p>
                    <Skeleton className="w-10 h-5 rounded-full" />
                  </div>
                  <Skeleton className="w-full h-4 rounded-full" />
                </div>
                <div className="flex w-full flex-col gap-2">
                  <div className="flex flex-row justify-between">
                    <p className="font-bold text-sm md:text-base">Max Tokens</p>
                    <Skeleton className="w-10 h-5 rounded-full" />
                  </div>
                  <Skeleton className="w-full h-4 rounded-full" />
                </div>
                <div className="flex w-full flex-row gap-2 justify-between">
                  <p className="font-bold text-sm md:text-base">JSON Format</p>
                  <Skeleton className="w-16 h-5 rounded-full" />
                </div>
              </div>

              {/* Right Column */}
              <div className="flex w-full flex-col  h-full flex-grow">
                <div className="flex flex-col h-full flex-grow gap-2">
                  <p className="font-bold text-sm md:text-base">
                    System Prompt
                  </p>
                  <Skeleton className="w-full h-36 rounded-xl" />
                  {/* <ScrollArea className="flex-grow w-full border text-sm lg:text-base h-36 border-gray-300 p-2 md:p-3 rounded-xl ">
                    {config ? config.system_prompt : ""}
                  </ScrollArea> */}
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div>
            <div className="flex items-center w-full justify-center gap-4">
              <div className="text-center w-full">
                <Badge
                  variant="secondary"
                  className="text-xs md:text-lg px-4 py-2 md:px-6 md:py-3"
                >
                  {modelA}
                </Badge>
                <p className="text-xs md:text-base text-gray-500 mt-1">
                  Model A
                </p>
              </div>
              <span className="text-xl text-center w-[5vw] font-medium text-gray-400">
                vs
              </span>
              <div className="text-center w-full">
                <Badge
                  variant="secondary"
                  className="text-xs md:text-lg px-4 py-2 md:px-6 md:py-3"
                >
                  {modelB}
                </Badge>
                <p className="text-xs md:text-base text-gray-500 mt-1">
                  Model B
                </p>
              </div>
            </div>

            <Separator className="my-6" />

            <div className="flex w-full h-full gap-4 flex-col md:flex-row">
              {/* Left Column */}
              <div className="flex w-full flex-col h-full space-y-6">
                <div className="flex w-full flex-col gap-2">
                  <div className="flex justify-between">
                    <p className="font-bold text-sm md:text-base">
                      Temperature
                    </p>
                    <p className="font-bold text-sm md:text-base">
                      {config && config.temperature}
                    </p>
                  </div>
                  <Slider
                    max={1}
                    min={0}
                    step={0.01}
                    value={[config ? config.temperature : 0]}
                    disabled={true}
                    indicatorColor="llm-primary50"
                  />
                </div>
                <div className="flex w-full flex-col gap-2">
                  <div className="flex justify-between flex-row">
                    <p className="font-bold text-sm md:text-base">Top P</p>
                    <p className="font-bold text-sm md:text-base">
                      {config && config.top_p}
                    </p>
                  </div>
                  <Slider
                    max={1}
                    min={0}
                    step={0.01}
                    value={[config ? config.top_p : 0]}
                    disabled={true}
                    indicatorColor="llm-primary50"
                  />
                </div>
                <div className="flex w-full flex-col gap-2">
                  <div className="flex flex-row justify-between">
                    <p className="font-bold text-sm md:text-base">Max Tokens</p>
                    <p className="font-bold text-sm md:text-base">
                      {config && config.max_tokens}
                    </p>
                  </div>
                  <Slider
                    max={4000}
                    min={100}
                    step={0.01}
                    value={[config ? config.max_tokens : 0]}
                    disabled={true}
                    indicatorColor="llm-primary50"
                  />
                </div>
                <div className="flex w-full flex-row gap-2 justify-between">
                  <p className="font-bold text-sm md:text-base">JSON Format</p>
                  <Badge
                    variant={`${
                      config?.json_format ? "default" : "destructive"
                    }`}
                    className={`${config?.json_format && "bg-llm-primary50"}`}
                  >
                    {config?.json_format ? "Enabled" : "Disabled"}
                  </Badge>
                </div>
              </div>

              {/* Right Column */}
              <div className="flex w-full flex-col  h-full flex-grow">
                <div className="flex flex-col h-full flex-grow gap-2">
                  <p className="font-bold text-sm md:text-base">
                    System Prompt
                  </p>
                  <ScrollArea className="flex-grow w-full border text-sm lg:text-base h-36 border-gray-300 p-2 md:p-3 rounded-xl ">
                    {config ? config.system_prompt : ""}
                  </ScrollArea>
                </div>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
