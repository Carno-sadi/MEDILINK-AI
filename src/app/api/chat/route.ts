import { NextRequest, NextResponse } from "next/server";
import { buildSystemPrompt, PRIMARY_MODEL, BACKUP_MODEL } from "@/lib/openrouter";
import { Profile } from "@/types";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  try {
    const apiKey = process.env.OPENROUTER_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: "OpenRouter API key is not configured" },
        { status: 500 }
      );
    }

    const body = await req.json();
    const { messages, model = "med1-flash", profile } = body as {
      messages: { role: "user" | "assistant"; content: string }[];
      model?: "med1-flash" | "med1-pro";
      profile?: Profile | null;
    };
    const modelUsed = model;

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json(
        { error: "Messages array is required" },
        { status: 400 }
      );
    }

    const systemPrompt = buildSystemPrompt(modelUsed, profile);

    const openRouterMessages = [
      { role: "system", content: systemPrompt },
      ...messages.map((m) => ({
        role: m.role,
        content: m.content,
      })),
    ];

    const maxTokens = modelUsed === "med1-pro" ? 2500 : 1500;
    const temperature = modelUsed === "med1-pro" ? 0.6 : 0.4;

    const requestHeaders = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
      "HTTP-Referer": "https://medilink.com.bd",
      "X-Title": "MediLink Bangladesh",
    };

    // Attempt 1: Call with OpenRouter fallback routing
    let response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: requestHeaders,
      body: JSON.stringify({
        models: [PRIMARY_MODEL, BACKUP_MODEL],
        route: "fallback",
        messages: openRouterMessages,
        stream: true,
        temperature,
        max_tokens: maxTokens,
      }),
    });

    // Attempt 2: If primary call failed with an HTTP error, immediately fallback to backup model directly
    if (!response.ok) {
      const errText = await response.text();
      console.warn("[OpenRouter Primary Failed, Retrying with Backup]:", errText);

      response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: requestHeaders,
        body: JSON.stringify({
          model: BACKUP_MODEL,
          messages: openRouterMessages,
          stream: true,
          temperature,
          max_tokens: maxTokens,
        }),
      });
    }

    if (!response.ok) {
      const errorText = await response.text();
      console.error("[OpenRouter Error]:", errorText);
      return NextResponse.json(
        { error: "Failed to communicate with AI provider", details: errorText },
        { status: response.status }
      );
    }

    if (!response.body) {
      return NextResponse.json(
        { error: "No response stream from AI provider" },
        { status: 500 }
      );
    }

    const encoder = new TextEncoder();
    const decoder = new TextDecoder();

    // Stream transformation to send text chunks directly to client
    const stream = new ReadableStream({
      async start(controller) {
        const reader = response.body!.getReader();
        let buffer = "";

        try {
          while (true) {
            const { done, value } = await reader.read();
            if (done) break;

            buffer += decoder.decode(value, { stream: true });
            const lines = buffer.split("\n");
            buffer = lines.pop() || "";

            for (const line of lines) {
              const trimmed = line.trim();
              if (!trimmed || !trimmed.startsWith("data:")) continue;
              const dataStr = trimmed.replace(/^data:\s*/, "");

              if (dataStr === "[DONE]") {
                controller.close();
                return;
              }

              try {
                const parsed = JSON.parse(dataStr);
                const deltaContent = parsed.choices?.[0]?.delta?.content;
                if (deltaContent) {
                  controller.enqueue(encoder.encode(deltaContent));
                }
              } catch (e) {
                // Ignore parse errors on partial chunks
              }
            }
          }
        } catch (error) {
          controller.error(error);
        } finally {
          controller.close();
        }
      },
    });

    return new Response(stream, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
      },
    });
  } catch (error: any) {
    console.error("[API Chat Error]:", error);
    return NextResponse.json(
      { error: "Internal server error", message: error?.message || "Unknown error" },
      { status: 500 }
    );
  }
}
