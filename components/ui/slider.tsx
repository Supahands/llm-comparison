"use client";

import * as React from "react";
import * as SliderPrimitive from "@radix-ui/react-slider";

import { cn } from "@/lib/utils";

interface CustomSliderProps
  extends React.ComponentPropsWithoutRef<typeof SliderPrimitive.Root> {
  indicatorColor?: string;
}

const Slider = React.forwardRef<
  React.ElementRef<typeof SliderPrimitive.Root>,
  CustomSliderProps
>(({ className, indicatorColor, ...props }, ref) => (
  <SliderPrimitive.Root
    ref={ref}
    className={cn(
      "relative flex w-full touch-none select-none items-center",
      className
    )}
    {...props}
  >
    <SliderPrimitive.Track
      className={`relative h-2 w-full grow bg-secondary overflow-hidden rounded-full`}
    >
      <SliderPrimitive.Range
        className={`absolute h-full ${
          indicatorColor ? `bg-${indicatorColor}` : "bg-primary"
        }`}
      />
    </SliderPrimitive.Track>
    <SliderPrimitive.Thumb
      className={`block h-5 w-5 rounded-full border-2 ${
        indicatorColor ? `border-${indicatorColor}` : "border-primary"
      } bg-background ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50`}
    />
  </SliderPrimitive.Root>
));
Slider.displayName = SliderPrimitive.Root.displayName;

export { Slider };
