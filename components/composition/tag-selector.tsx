"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import TagPill from "@/components/ui/tag-pill";
import useAppStore from "@/hooks/store/useAppStore";
import { useQueryClient } from "@tanstack/react-query";
import debounce from 'lodash/debounce';
import { X } from "lucide-react";
import { useCallback, useState } from "react";

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

export default function TagSelector() {
  const { preferredTags = [], setPreferredTags } = useAppStore();
  const [newTag, setNewTag] = useState("");
  const queryClient = useQueryClient();

  // Debounce the query invalidation
  const debouncedInvalidate = useCallback(
    debounce(() => {
      queryClient.invalidateQueries({ queryKey: ['questions'] });
    }, 500),
    []
  );

  const validateTag = (tag: string) => {
    // Only allow alphanumeric characters and underscores
    const cleanTag = tag.replace(/[^a-zA-Z0-9_]/g, '');
    return cleanTag === tag && tag.length > 0;
  }
  const handleAddTag = () => {
    if (newTag.trim() && (preferredTags?.length ?? 0) < 5) {
      const updatedTags = [...(preferredTags ?? []), newTag.trim().toLowerCase()];
      setPreferredTags(updatedTags);
      setNewTag("");
      debouncedInvalidate();
    }
  };

  const handleRemoveTag = (indexToRemove: number) => {
    const updatedTags = (preferredTags ?? []).filter((_, index) => index !== indexToRemove);
    setPreferredTags(updatedTags);
    debouncedInvalidate();
  };

  return (
    <div className="w-full max-w-[900px] mx-auto mb-4 p-4 bg-llm-grey4 rounded-xl border border-llm-neutral90">
      <div className="text-sm mb-2">
        <span className="text-llm-grey1">
          Select tags for your prompts (max 5). First tag will be the main category.
        </span>
      </div>
      <div className="flex gap-2 items-center">
        <Input
          value={newTag}
          onChange={(e) => setNewTag(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              handleAddTag();
            }
          }}
          placeholder="Add a tag"
          className="bg-white"
          disabled={(preferredTags?.length ?? 0) >= 5}
        />
        <Button
          onClick={handleAddTag}
          disabled={(preferredTags?.length ?? 0) >= 5}
          className="bg-llm-primary50 hover:bg-llm-hover_primary50"
        >
          Add
        </Button>
      </div>
      {preferredTags?.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-3">
          {preferredTags.map((tag, index) => (
            <TagPill
              key={index}
              tag={tag}
              onRemove={() => handleRemoveTag(index)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
