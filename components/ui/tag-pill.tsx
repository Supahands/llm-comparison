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
  let color = "#";
  for (let i = 0; i < 3; i++) {
    const value = (hash >> (i * 8)) & 0xff;
    color += ("00" + value.toString(16)).substr(-2);
  }
  return color;
};

const getContrastColor = (hexcolor: string) => {
  const r = parseInt(hexcolor.slice(1, 3), 16);
  const g = parseInt(hexcolor.slice(3, 5), 16);
  const b = parseInt(hexcolor.slice(5, 7), 16);
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return luminance > 0.5 ? "#000000" : "#FFFFFF";
};

export default function TagPill({ tag, onRemove, size = 'md', className, ...props }: TagPillProps) {
  const bgColor = stringToColor(tag);
  const textColor = getContrastColor(bgColor);

  return (
    <div
      style={{
        backgroundColor: bgColor,
        color: textColor,
      }}
      className={cn(
        "flex items-center gap-1 px-2 py-1 rounded-full opacity-90",
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
