import Link from "next/link";
import { Button } from "../ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { useEffect, useState } from "react";

export default function DataConsentModal() {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  useEffect(() => {
    const dataConsentAccept = localStorage.getItem("data-consent");
    if (!dataConsentAccept) {
      setIsOpen(true);
    }
  }, []);

  const handleDataConsentAccept = () => {
    localStorage.setItem("data-consent", "true");
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen}>
			<DialogContent className="bg-llm-peach50 border-llm-peach50 lg:max-w-full lg:w-[811px]">
        <DialogHeader>
          <DialogTitle>
            <Image
              src={`svg/logo.svg`}
              alt="SUPA logo"
              width={93}
              height={26}
            />
            <div className="mt-7 font-bold text-xl">Data Collection Notice</div>
          </DialogTitle>
          <DialogDescription className="text-base text-llm-grey1 pt-7">
            We want to make AI evaluation better for everyone! This LLM
            comparison tool is completely free for anyone to use. As part of
            SUPA’s open-source research initiative, we collect:
            <ul className="list-disc pl-5 mt-4">
              <li>The questions you ask the models</li>
              <li>The responses each model provides</li>
              <li>Your preferred model selection for each comparison</li>
            </ul>
            <br />
            Don’t worry, no personal information is gathered or shared. Your
            test results will help improve AI research and evaluation methods.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="">
          <div className="w-full flex flex-row justify-between items-center">
            <Link
              href={"https://supa.so/llm-comparison-tool"}
              className="underline underline-offset-2 text-black focus-visible:outline-llm-primary50"
            >
              Learn more about our research
            </Link>
            <Button
              className="rounded-xl text-white text-base"
              style={{
                background: "linear-gradient(180deg, #F0A0A0 0%, #E76C6C 60%)",
              }}
              onClick={handleDataConsentAccept}
              data-testid="data-collection-accept-button"
            >
              Accept and Continue
              <ArrowRight></ArrowRight>
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
