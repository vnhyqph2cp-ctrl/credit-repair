// lib/ai/analyzeWithAI.ts

import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
});

export async function analyzeWithAI<T = unknown>(
  prompt: string
): Promise<T> {
  const completion = await client.chat.completions.create({
    model: "gpt-4",
    messages: [{ role: "user", content: prompt }],
    response_format: { type: "json_object" },
  });

  const content = completion.choices[0]?.message?.content;

  if (!content) {
    throw new Error("AI response was empty");
  }

  return JSON.parse(content) as T;
}
