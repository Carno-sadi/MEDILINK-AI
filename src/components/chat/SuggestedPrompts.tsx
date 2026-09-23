import React from "react";
import { Sparkles } from "lucide-react";
import { Profile } from "@/types";

interface SuggestedPromptsProps {
  profile: Profile | null;
  onSelect: (prompt: string) => void;
}

export const SuggestedPrompts: React.FC<SuggestedPromptsProps> = ({ profile, onSelect }) => {
  // Generate context-aware prompts based on diseases
  const getPrompts = () => {
    const basePrompts = [
      "I have a mild fever and headache.",
      "What are some common remedies for a sore throat?",
      "Can you help me find a pediatrician nearby?",
    ];

    if (!profile) return basePrompts;

    const customPrompts: string[] = [];
    if (profile.diseases.includes("Diabetes")) {
      customPrompts.push("What should I eat to manage my blood sugar today?");
    }
    if (profile.diseases.includes("Asthma")) {
      customPrompts.push("My asthma is acting up due to the dust. What should I do?");
    }
    if (profile.diseases.includes("High Blood Pressure")) {
      customPrompts.push("Are there specific foods I should avoid for high blood pressure?");
    }

    // Mix custom with base, taking up to 3 total
    const combined = [...customPrompts, ...basePrompts].slice(0, 3);
    return combined;
  };

  const prompts = getPrompts();

  return (
    <div className="flex flex-wrap gap-2 justify-center mt-6 max-w-[800px] mx-auto">
      {prompts.map((prompt, idx) => (
        <button
          key={idx}
          onClick={() => onSelect(prompt)}
          className="flex items-center gap-2 px-4 py-2 bg-white border border-border-soft rounded-full text-[13px] font-medium text-brand hover:border-brand-soft hover:bg-brand-light transition-colors text-left"
        >
          <Sparkles className="w-4 h-4 shrink-0" />
          <span className="truncate max-w-[200px] sm:max-w-none">{prompt}</span>
        </button>
      ))}
    </div>
  );
};
