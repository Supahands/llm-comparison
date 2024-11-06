import React, { useCallback, useEffect, useState } from "react";
import { EmblaCarouselType } from "embla-carousel";

// Extend EmblaApi type to include scrollTo and scrollSnapList methods
type EmblaApi = {
  scrollPrev: () => void;
  scrollNext: () => void;
  canScrollPrev: () => boolean;
  canScrollNext: () => boolean;
  scrollTo: (index: number) => void; // Add scrollTo method here
  selectedScrollSnap: () => number;
  scrollSnapList: () => number[];
  on: (event: string, callback: (api: EmblaApi) => void) => EmblaApi;
};

type ButtonClickHandler = (emblaApi: EmblaCarouselType) => void;

export const useDotButton = (
  emblaApi: EmblaCarouselType | undefined,
  onButtonClick?: ButtonClickHandler
) => {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [scrollSnaps, setScrollSnaps] = useState<number[]>([]);

  const onDotButtonClick = useCallback(
    (index: number) => {
      // Explicitly type 'index' as 'number'
      if (!emblaApi) return;
      emblaApi.scrollTo(index);
      if (onButtonClick) onButtonClick(emblaApi);
    },
    [emblaApi, onButtonClick]
  );

  const onInit = useCallback((emblaApi: EmblaCarouselType) => {
    // Add type for emblaApi
    setScrollSnaps(emblaApi.scrollSnapList());
  }, []);

  const onSelect = useCallback((emblaApi: EmblaCarouselType) => {
    // Add type for emblaApi
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, []);

  useEffect(() => {
    if (!emblaApi) return;

    onInit(emblaApi);
    onSelect(emblaApi);

    emblaApi.on("reInit", onInit).on("reInit", onSelect).on("select", onSelect);
  }, [emblaApi, onInit, onSelect]);

  return {
    selectedIndex,
    scrollSnaps,
    onDotButtonClick,
  };
};

// Define props for DotButton component
interface DotButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children?: React.ReactNode;
}

export const DotButton: React.FC<DotButtonProps> = ({
  children,
  ...restProps
}) => {
  return (
    <button type="button" {...restProps}>
      {children}
    </button>
  );
};
