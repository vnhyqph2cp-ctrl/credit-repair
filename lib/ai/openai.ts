// lib/ai/openai.ts

import OpenAI from "openai";

export const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
});

// AI Analysis function
export async function analyzeWithAI(prompt: string): Promise<any> {
  const completion = await openai.chat.completions.create({
    model: "gpt-4",
    messages: [{ role: "user", content: prompt }],
    response_format: { type: "json_object" },
  });
  
  const content = completion.choices[0]?.message?.content || "{}";
  return JSON.parse(content);
}
