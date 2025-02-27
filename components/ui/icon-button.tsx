"use client";

import * as React from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
  TooltipRoot,
  TooltipArrow,
  TooltipPortal,
} from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import { LucideIcon } from "lucide-react";

interface IconButtonProps {
  onClick?: () => void;
  icon: LucideIcon;
  popoverContent?: React.ReactNode;
}

const IconButton = ({ onClick, icon, popoverContent}: IconButtonProps) => {
  return (
    <TooltipProvider>
      <TooltipRoot>
        <TooltipTrigger asChild>
          <Button className="inline-flex size-[35px] items-center animate-shimmer justify-center rounded-full bg-white text-violet11 shadow-[0_2px_10px] shadow-blackA4 outline-none hover:bg-violet3 focus:shadow-[0_0_0_2px] text-slate-400 transition-colors focus:shadow-black bg-[linear-gradient(110deg,#000103,45%,#1e2631,55%,#000103)] bg-[length:200%_100%] focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 focus:ring-offset-slate-50" onClick={onClick}>
            {React.createElement(icon)}
          </Button>
        </TooltipTrigger>
        <TooltipPortal>
          <TooltipContent
            className="select-none rounded bg-white px-[15px] py-2.5 text-[15px] leading-none text-violet11 shadow-[hsl(206_22%_7%_/_35%)_0px_10px_38px_-10px,_hsl(206_22%_7%_/_20%)_0px_10px_20px_-15px] will-change-[transform,opacity] data-[state=delayed-open]:data-[side=bottom]:animate-slideUpAndFade data-[state=delayed-open]:data-[side=left]:animate-slideRightAndFade data-[state=delayed-open]:data-[side=right]:animate-slideLeftAndFade data-[state=delayed-open]:data-[side=top]:animate-slideDownAndFade"
            sideOffset={5}
          >
            {popoverContent}
            <TooltipArrow className="fill-white" />
          </TooltipContent>
        </TooltipPortal>
      </TooltipRoot>
    </TooltipProvider>
  );
};

export default IconButton;
      
