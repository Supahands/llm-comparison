"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import TagPill from "@/components/ui/tag-pill";
import useAppStore from "@/hooks/store/useAppStore";
import { usePromptGeneration } from "@/hooks/use-prompt-generation";
import { useCallback, useState } from "react";

export default function TagSelector() {
  const { preferredTags = [], setPreferredTags } = useAppStore();
  const [newTag, setNewTag] = useState("");
  const { invalidatePrompts } = usePromptGeneration();

  const handleAddTag = () => {
    if (newTag.trim() && (preferredTags?.length ?? 0) < 5) {
      const updatedTags = [...(preferredTags ?? []), newTag.trim().toLowerCase()];
      setPreferredTags(updatedTags);
      setNewTag("");
      invalidatePrompts();
    }
  };

  const handleRemoveTag = (indexToRemove: number) => {
    const updatedTags = (preferredTags ?? []).filter((_, index) => index !== indexToRemove);
    setPreferredTags(updatedTags);
    invalidatePrompts();
  };

  return (
    <div className="w-full max-w-[900px] mx-auto mb-4 p-4 bg-llm-grey4 rounded-xl border border-llm-neutral90">
      <div className="text-sm mb-2">
        <span className="text-llm-grey1">
          Select tags for your prompts (max 10). First tag will be the main category.
        </span>
      </div>
      <div className="flex gap-2">
        <Input
          value={newTag}
          onChange={(e) => setNewTag(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              handleAddTag();
            }
          }}
          characterLimit={20}
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
