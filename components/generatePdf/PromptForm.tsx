"use client";

import { useState, useTransition } from "react";

import { Button } from "@/components/ui/button";
import { createJob } from "@/actions/jobs";

const PromptForm = () => {
  const [prompt, setPrompt] = useState<string>("");
  const [isGenerating, setIsGenerating] = useTransition();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsGenerating(async () => {
      await createJob(prompt);
      setPrompt("");
    });
  };

  return (
    <div className="hero-card-border">
      <form
        onSubmit={handleSubmit}
        className="bg-white/5 backdrop-blur-sm shadow-xl rounded-2xl p-6 border border-gray-200/10"
      >
        <label
          htmlFor="prompt"
          className="block text-lg font-medium text-gray-100 mb-2"
        >
          What should your PDF be about?
        </label>
        <textarea
          id="prompt"
          rows={4}
          className="w-full p-3 bg-gray-900/50 border border-gray-500/50 rounded-lg text-gray-200 focus:ring-2 focus:ring-primary focus:border-primary transition-shadow duration-300 placeholder-gray-400"
          placeholder="e.g., A comprehensive guide to TypeScript"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          disabled={isGenerating}
        />
        <Button
          type="submit"
          disabled={isGenerating || !prompt.trim()}
          className="mt-4 w-full"
        >
          Generate PDF
        </Button>
      </form>
    </div>
  );
};

export default PromptForm;
