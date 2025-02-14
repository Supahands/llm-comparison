"use client";

import { cn } from "@/lib/utils";
import { X } from "lucide-react";
import { ButtonHTMLAttributes } from "react";

interface TagPillProps extends ButtonHTMLAttributes<HTMLDivElement> {
  tag: string;
  onRemove?: () => void;
  size?: 'sm' | 'md';
}

const stringToColor = (str: string) => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }

  // Increase brightness by adjusting HSL values
  const h = hash % 360;
  const s = 65 + (hash % 20); // Saturation between 65-85%
  const l = 65 + (hash % 15); // Lightness between 65-80%

  return `hsl(${h}, ${s}%, ${l}%)`;
};

const getContrastColor = (hexcolor: string) => {
  // For HSL colors, we can determine text color based on lightness
  const match = hexcolor.match(/hsl\(\d+,\s*\d+%,\s*(\d+)%\)/);
  if (match) {
    const lightness = parseInt(match[1]);
    return lightness > 65 ? "#000000" : "#FFFFFF";
  }
  return "#000000";
};

export default function TagPill({ tag, onRemove, size = 'md', className, ...props }: TagPillProps) {
  const bgColor = stringToColor(tag);
  const textColor = getContrastColor(bgColor);

  return (
    <div
      style={{
        backgroundColor: bgColor,
        color: textColor,
        border: '1px solid rgba(0,0,0,0.1)',
      }}
      className={cn(
        "flex items-center gap-1 px-2 py-1 rounded-full opacity-95 shadow-sm font-medium",
        size === 'sm' ? "text-[10px]" : "text-sm",
        className
      )}
      {...props}
    >
      <span>{tag}</span>
      {onRemove && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onRemove();
          }}
          className="p-1 hover:bg-black/10 rounded-full"
          style={{ color: textColor }}
        >
          <X className={size === 'sm' ? "h-2 w-2" : "h-3 w-3"} />
        </button>
      )}
    </div>
  );
}
