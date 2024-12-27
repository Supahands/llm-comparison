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
  DialogClose,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import useAppStore from "@/hooks/store/useAppStore";
import { ComboBox } from "../ui/combo-box";
import { usePostHog } from "posthog-js/react";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Slider } from "@/components/ui/slider";
import { useState } from "react";

export function TextareaDemo() {
  return <Textarea placeholder="Type your message here." />;
}

interface AdvancedProps {
  isDisabled: boolean;
}

export function AdvancedOptions({ isDisabled }: AdvancedProps) {
  const {
    availableModels,
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

  const [currTemp, setCurrTemp] = useState<number>(temperature);
  const [currTopP, setCurrTopP] = useState<number>(topP);
  const [currSystemPrompt, setCurrSystemPrompt] =
    useState<string>(systemPrompt);
  const [currMaxTokens, setCurrMaxTokens] = useState<number>(maxTokens);
  const [currJSONFormat, setCurrJSONFormat] = useState<boolean>(jsonFormat);

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
    setCurrTemp(Number(event.target.value));
  };

  const handleMaxTokens = (event: React.ChangeEvent<HTMLInputElement>) => {
    setCurrMaxTokens(Number(event.target.value));
  };

  const handleTopP = (event: React.ChangeEvent<HTMLInputElement>) => {
    setCurrTopP(Number(event.target.value));
  };

  const setDefaultValue = () => {
    setCurrTemp(0.7);
    setCurrSystemPrompt("");
    setCurrTopP(1);
    setCurrMaxTokens(1000);
    setCurrJSONFormat(false);
  };

  const setCurrentValue = () => {
    setCurrTemp(temperature);
    setCurrMaxTokens(maxTokens);
    setCurrSystemPrompt(systemPrompt);
    setCurrJSONFormat(jsonFormat);
    setCurrTopP(topP);
  };

  const setValue = () => {
    setTemperature(currTemp);
    setSystemPrompt(currSystemPrompt);
    setTopP(currTopP);
    setMaxTokens(currMaxTokens);
    setJSONFormat(currJSONFormat);
  };

  const handleSystemPrompt = (
    event: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    setCurrSystemPrompt(event.target.value);
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
        <Button
          className="w-full bg-transparent border text-black hover:bg-gray-100"
          onClick={setCurrentValue}
        >
          Advanced Settings
        </Button>
      </DialogTrigger>
      <DialogContent
        className={`${checkIfValid() ? "" : "[&>button]:hidden"}`}
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
                disabled={isDisabled}
                defaultValue={selectedModel1}
              />
            </div>
            <div className="flex flex-col w-1/2 ">
              <p className="font-bold">Model 2</p>
              <ComboBox
                items={availableModels}
                onItemSelect={handleModel2Select}
                disabled={isDisabled}
                defaultValue={selectedModel2}
              />
            </div>
          </div>
          <div className="flex flex-col space-y-1">
            <p className="font-bold">System Prompt </p>
            <Textarea
              className="h-20"
              value={currSystemPrompt}
              onChange={handleSystemPrompt}
              placeholder="Type your message here."
              maxLength={2000}
              disabled={isDisabled}
            />
            <p className="flex justify-end font-semibold text-sm">
              {currSystemPrompt.length} / 2000 characters
            </p>
          </div>
          <div className="flex flex-col w-full space-y-1">
            <p
              className={`font-bold ${
                0 > currTemp || currTemp > 1 ? "text-red-600" : "llm-primary50"
              }`}
            >
              Temperature : {currTemp}
            </p>
            <div className="flex flex-row gap-2">
              <Slider
                max={1}
                min={0}
                step={0.01}
                onValueChange={(newValue: number[]) => {
                  setCurrTemp(newValue[0]);
                }}
                indicatorColor={`${
                  0 > currTemp || currTemp > 1 ? "red-600" : "llm-primary50"
                }`}
                value={[currTemp]}
                disabled={isDisabled}
              />
              <Input
                id="name"
                type="number"
                className="w-20"
                max={1}
                min={0}
                step={0.01}
                value={currTemp}
                onChange={handleTemperature}
                disabled={isDisabled}
              />
            </div>
          </div>
          <div className="flex flex-col w-full space-y-1">
            <p
              className={`font-bold ${
                0 > currTopP || currTopP > 1 ? "text-red-600" : "llm-primary50"
              }`}
            >
              Top P : {currTopP}
            </p>
            <div className="flex flex-row gap-2">
              <Slider
                max={1}
                min={0}
                step={0.01}
                onValueChange={(newValue: number[]) => {
                  setCurrTopP(newValue[0]);
                }}
                indicatorColor={`${
                  0 > currTopP || currTopP > 1 ? "red-600" : "llm-primary50"
                }`}
                value={[currTopP]}
                disabled={isDisabled}
              />
              <Input
                id="topP"
                type="number"
                className="w-20"
                max={1}
                min={0}
                step={0.01}
                value={currTopP}
                onChange={handleTopP}
                disabled={isDisabled}
              />
            </div>
          </div>
          <div
            className={`flex flex-col w-full space-y-1 ${
              100 >= currMaxTokens && currMaxTokens >= 4000
                ? "border-2 border-red-600"
                : "llm-primary50"
            }`}
          >
            <p
              className={`font-bold ${
                100 > currMaxTokens || currMaxTokens > 4000
                  ? "text-red-600"
                  : "llm-primary50"
              }`}
            >
              Max Tokens : {currMaxTokens}
            </p>
            <div className="flex flex-row gap-2">
              <Slider
                max={4000}
                min={100}
                step={1}
                disabled={isDisabled}
                onValueChange={(newValue: number[]) => {
                  setCurrMaxTokens(newValue[0]);
                }}
                indicatorColor={`${
                  100 > currMaxTokens || currMaxTokens > 4000
                    ? "red-600"
                    : "llm-primary50"
                }`}
                value={[currMaxTokens]}
              />
              <Input
                id="name"
                type="number"
                className="w-20"
                max={4000}
                min={100}
                step={1}
                value={currMaxTokens}
                disabled={isDisabled}
                onChange={handleMaxTokens}
              />
            </div>
          </div>
          <div className="flex flex-row gap-2 items-center justify-between font-bold">
            <p>JSON Format : {currJSONFormat ? "On" : "Off"}</p>
            <Switch
              checked={currJSONFormat}
              disabled={isDisabled}
              className="data-[state=checked]:bg-llm-primary50"
              onCheckedChange={(value: boolean) => setCurrJSONFormat(value)}
            />
          </div>
        </div>
        <DialogFooter className="w-full">
          <div className="flex flex-row w-full justify-between gap-2">
            <Button
              className="bg-white text-black border hover:bg-gray-100"
              onClick={setDefaultValue}
              type="submit"
              disabled={isDisabled}
            >
              Reset to Default
            </Button>
            <DialogClose>
              <Button type="submit" onClick={setValue} disabled={isDisabled}>
                Save changes
              </Button>
            </DialogClose>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
