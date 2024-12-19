import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogOverlay,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import useAppStore from "@/hooks/store/useAppStore";
import { ComboBox } from "../ui/combo-box";
import { usePostHog } from "posthog-js/react";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Slider } from "@/components/ui/slider";

export function TextareaDemo() {
  return <Textarea placeholder="Type your message here." />;
}

export function AdvancedOptions() {
  const {
    isComparingModel,
    availableModels,
    userChoices,
    selectedModel1,
    selectedModel2,
    setSelectedModel1,
    setSelectedModel2,
    temperature,
    setTemperature,
    topP,
    setTopP,
    maxTokens,
    setMaxTokens,
    systemPrompt,
    setSystemPrompt,
    jsonFormat,
    setJSONFormat,
  } = useAppStore();
  const posthog = usePostHog();

  const handleModel1Select = (model: string) => {
    posthog?.capture("llm-compare.models.select", {
      model,
    });
    setSelectedModel1(model);
  };

  const handleModel2Select = (model: string) => {
    posthog?.capture("llm-compare.models.select", {
      model,
    });
    setSelectedModel2(model);
  };

  const handleTemperature = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTemperature(Number(event.target.value));
  };

  const handleMaxTokens = (event: React.ChangeEvent<HTMLInputElement>) => {
    setMaxTokens(Number(event.target.value));
  };

  const handleTopP = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTopP(Number(event.target.value));
  };

  const setAllValue = () => {
    setTemperature(0.7);
    setSystemPrompt("");
    setTopP(1);
    setMaxTokens(1000);
  };

  const handleSystemPrompt = (
    event: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    setSystemPrompt(event.target.value);
  };

  const checkIfValid = (): boolean => {
    return (
      0 <= temperature &&
      temperature <= 1 &&
      0 <= topP &&
      topP <= 1 &&
      100 <= maxTokens &&
      maxTokens <= 4000
    );
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="w-full bg-transparent border text-black hover:bg-gray-100">
          Advanced Settings
        </Button>
      </DialogTrigger>
      <DialogContent
        className="rounded-3xl min-w-fit"
        onInteractOutside={(e) => {
          console.log(checkIfValid());
          if (!checkIfValid()) {
            e.preventDefault();
          }
        }}
        onEscapeKeyDown={(e) => {
          console.log(checkIfValid());
          if (!checkIfValid()) {
            e.preventDefault();
          }
        }}
      >
        <DialogHeader>
          <DialogTitle>Advanced Options</DialogTitle>
          <DialogDescription>
            Setup test using advanced Large Language Model (LLM) options
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-3 w-full overflow-auto">
          <div className="flex flex-row w-full justify-between gap-3">
            <div className="flex flex-col w-1/2 ">
              <p className="font-bold">Model 1</p>
              <ComboBox
                items={availableModels}
                onItemSelect={handleModel1Select}
                disabled={isComparingModel || userChoices.length > 0}
                defaultValue={selectedModel1}
              />
            </div>
            <div className="flex flex-col w-1/2 ">
              <p className="font-bold">Model 2</p>
              <ComboBox
                items={availableModels}
                onItemSelect={handleModel2Select}
                disabled={isComparingModel || userChoices.length > 0}
                defaultValue={selectedModel2}
              />
            </div>
          </div>
          <div className="flex flex-col space-y-1">
            <p className="font-bold">System Prompt </p>
            <Textarea
              className="h-20"
              value={systemPrompt}
              onChange={handleSystemPrompt}
              placeholder="Type your message here."
              maxLength={2000}
            />
            <p className="flex justify-end font-semibold text-sm">
              {systemPrompt.length} / 2000 characters
            </p>
          </div>
          <div className="flex flex-col w-full space-y-1">
            <p
              className={`font-bold ${
                0 > temperature || temperature > 1 ? "text-red-600" : ""
              }`}
            >
              Temperature : {temperature}
            </p>
            <div className="flex flex-row gap-2">
              <Slider
                max={1}
                min={0}
                step={0.01}
                onValueChange={(newValue: number[]) => {
                  setTemperature(newValue[0]);
                }}
                indicatorColor={`${
                  0 > temperature || temperature > 1 ? "red-600" : ""
                }`}
                value={[temperature]}
              />
              <Input
                id="name"
                type="number"
                className="w-20"
                max={1}
                min={0}
                step={0.01}
                value={temperature}
                onChange={handleTemperature}
              />
            </div>
          </div>
          <div className="flex flex-col w-full space-y-1">
            <p
              className={`font-bold ${
                0 > topP || topP > 1 ? "text-red-600" : ""
              }`}
            >
              Top P : {topP}
            </p>
            <div className="flex flex-row gap-2">
              <Slider
                max={1}
                min={0}
                step={0.01}
                onValueChange={(newValue: number[]) => {
                  setTopP(newValue[0]);
                }}
                indicatorColor={`${0 > topP || topP > 1 ? "red-600" : ""}`}
                value={[topP]}
              />
              <Input
                id="topP"
                type="number"
                className="w-20"
                max={1}
                min={0}
                step={0.01}
                value={topP}
                onChange={handleTopP}
              />
            </div>
          </div>
          <div
            className={`flex flex-col w-full space-y-1 ${
              100 >= maxTokens && maxTokens >= 4000
                ? "border-2 border-red-600"
                : ""
            }`}
          >
            <p
              className={`font-bold ${
                100 > maxTokens || maxTokens > 4000 ? "text-red-600" : ""
              }`}
            >
              Max Tokens : {maxTokens}
            </p>
            <div className="flex flex-row gap-2">
              <Slider
                max={4000}
                min={100}
                step={1}
                onValueChange={(newValue: number[]) => {
                  setMaxTokens(newValue[0]);
                }}
                indicatorColor={`${
                  100 > maxTokens || maxTokens > 4000 ? "red-600" : ""
                }`}
                value={[maxTokens]}
              />
              <Input
                id="name"
                type="number"
                className="w-20"
                max={4000}
                min={100}
                step={1}
                value={maxTokens}
                onChange={handleMaxTokens}
              />
            </div>
          </div>
          <div className="flex flex-row gap-2 items-center justify-between font-bold">
            <p>JSON Format : {jsonFormat ? "On" : "Off"}</p>
            <Switch
              checked={jsonFormat}
              onCheckedChange={(value: boolean) => setJSONFormat(value)}
            />
          </div>
        </div>
        <DialogFooter className="w-full">
          <div className="flex flex-row w-full justify-between gap-2">
            <Button
              className="bg-white text-black border hover:bg-gray-100"
              onClick={setAllValue}
              type="submit"
            >
              Reset to Default
            </Button>
            <Button type="submit">Save changes</Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
