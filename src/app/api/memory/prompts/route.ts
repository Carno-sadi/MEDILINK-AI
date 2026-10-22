import { NextRequest, NextResponse } from "next/server";
import { MemoryPrompt, createMemoryPromptId } from "@/types";

export const runtime = "nodejs";

const PROMPTS_KEY = "medilink_memory_prompts";

function getPrompts(): MemoryPrompt[] {
  if (typeof window !== "undefined") {
    try {
      const stored = localStorage.getItem(PROMPTS_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  }
  return [];
}

function savePrompts(prompts: MemoryPrompt[]): void {
  if (typeof window !== "undefined") {
    localStorage.setItem(PROMPTS_KEY, JSON.stringify(prompts));
  }
}

export async function GET() {
  try {
    const prompts = getPrompts();
    return NextResponse.json({ prompts });
  } catch (error) {
    console.error("[MediLink] Failed to fetch memory prompts:", error);
    return NextResponse.json(
      { error: "Failed to fetch memory prompts" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { text, priority = 0 } = body as { text?: string; priority?: number };

    if (!text || typeof text !== "string" || !text.trim()) {
      return NextResponse.json(
        { error: "Prompt text is required" },
        { status: 400 }
      );
    }

    const prompts = getPrompts();
    const newPrompt: MemoryPrompt = {
      id: createMemoryPromptId(),
      text: text.trim().slice(0, 500),
      isActive: true,
      priority,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };

    prompts.push(newPrompt);
    prompts.sort((a, b) => b.priority - a.priority);
    savePrompts(prompts);

    return NextResponse.json({ prompt: newPrompt });
  } catch (error) {
    console.error("[MediLink] Failed to create memory prompt:", error);
    return NextResponse.json(
      { error: "Failed to create memory prompt" },
      { status: 500 }
    );
  }
}