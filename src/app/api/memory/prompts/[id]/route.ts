import { NextRequest, NextResponse } from "next/server";
import { MemoryPrompt } from "@/types";

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

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await req.json();
    const { text, isActive, priority } = body as {
      text?: string;
      isActive?: boolean;
      priority?: number;
    };

    const prompts = getPrompts();
    const index = prompts.findIndex((p) => p.id === id);

    if (index === -1) {
      return NextResponse.json(
        { error: "Memory prompt not found" },
        { status: 404 }
      );
    }

    const updated: MemoryPrompt = {
      ...prompts[index],
      text: text?.trim().slice(0, 500) ?? prompts[index].text,
      isActive: isActive ?? prompts[index].isActive,
      priority: priority ?? prompts[index].priority,
      updatedAt: Date.now(),
    };

    prompts[index] = updated;
    prompts.sort((a, b) => b.priority - a.priority);
    savePrompts(prompts);

    return NextResponse.json({ prompt: updated });
  } catch (error) {
    console.error("[MediLink] Failed to update memory prompt:", error);
    return NextResponse.json(
      { error: "Failed to update memory prompt" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const prompts = getPrompts();
    const filtered = prompts.filter((p) => p.id !== id);

    if (filtered.length === prompts.length) {
      return NextResponse.json(
        { error: "Memory prompt not found" },
        { status: 404 }
      );
    }

    savePrompts(filtered);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[MediLink] Failed to delete memory prompt:", error);
    return NextResponse.json(
      { error: "Failed to delete memory prompt" },
      { status: 500 }
    );
  }
}