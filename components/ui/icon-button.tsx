"use client";

import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipArrow,
  TooltipContent,
  TooltipPortal,
  TooltipProvider,
  TooltipRoot,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { motion } from "framer-motion"; // Add this import
import { LucideIcon } from "lucide-react";
import * as React from "react";
import { useState } from "react";

interface IconButtonProps {
  onClick?: () => void;
  icon: LucideIcon;
  popoverContent?: React.ReactNode;
  defaultOpen?: boolean;
  open?: boolean | null;
  onOpenChange?: () => void;
  delayOpen?: number;
}

const IconButton = ({
  onClick = () => {},
  icon,
  popoverContent = null,
  defaultOpen = false,
  open = false,
  onOpenChange = () => {},
  delayOpen,
}: IconButtonProps) => {
  // Add local state to handle hover
  const [isHovered, setIsHovered] = useState(false);
  
  // Determine if tooltip should be shown (either explicitly opened or hovered)
  const showTooltip = open || isHovered;

  if (!popoverContent) {
    return (
      <Button
        className="inline-flex size-[35px] items-center animate-shimmer justify-center rounded-full bg-white text-violet11 shadow-[0_2px_10px] shadow-blackA4 outline-none hover:bg-violet3 focus:shadow-[0_0_0_2px] text-white font-bold transition-colors focus:shadow-black bg-[linear-gradient(110deg,#ff0000,45%,#ff5555,55%,#ff0000)] bg-[length:200%_100%] focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 focus:ring-offset-slate-50"
        onClick={onClick}
      >
        {React.createElement(icon)}
      </Button>
    );
  }

  // Define the shake animation
  const shakeAnimation = {
    initial: { x: 0 },
    animate: {
      x: [0, -5, 5, -5, 5, -3, 3, -2, 2, 0],
      transition: { 
        duration: 0.6,
        ease: "easeInOut",
        times: [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 1]
      }
    }
  };

  return (
    <TooltipProvider>
      <TooltipRoot
        defaultOpen={defaultOpen}
        onOpenChange={onOpenChange}
        delayDuration={delayOpen}
        open={showTooltip}
      >
        <TooltipTrigger asChild>
          <Button
            className="inline-flex size-[35px] items-center animate-shimmer justify-center rounded-full bg-white text-violet11 shadow-[0_2px_10px] shadow-blackA4 outline-none hover:bg-violet3 focus:shadow-[0_0_0_2px] text-white font-bold transition-colors focus:shadow-black bg-[linear-gradient(110deg,#ff0000,45%,#ff5555,55%,#ff0000)] bg-[length:200%_100%] focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 focus:ring-offset-slate-50"
            onClick={onClick}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            {React.createElement(icon)}
          </Button>
        </TooltipTrigger>
        <TooltipPortal>
          <TooltipContent
            className="select-none rounded bg-white px-[15px] py-2.5 text-[15px] leading-none text-violet11 shadow-[hsl(206_22%_7%_/_35%)_0px_10px_38px_-10px,_hsl(206_22%_7%_/_20%)_0px_10px_20px_-15px] will-change-[transform,opacity] data-[state=delayed-open]:data-[side=bottom]:animate-slideUpAndFade data-[state=delayed-open]:data-[side=left]:animate-slideRightAndFade data-[state=delayed-open]:data-[side=right]:animate-slideLeftAndFade data-[state=delayed-open]:data-[side=top]:animate-slideDownAndFade"
            sideOffset={5}
          >
            <motion.div
              initial="initial"
              animate="animate"
              variants={shakeAnimation}
              key={showTooltip ? "visible" : "hidden"} // Re-trigger animation when visibility changes
            >
              {popoverContent}
            </motion.div>
            <TooltipArrow className="fill-white" />
          </TooltipContent>
        </TooltipPortal>
      </TooltipRoot>
    </TooltipProvider>
  );
};

export default IconButton;
