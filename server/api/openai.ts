import { createError, defineEventHandler, readBody } from 'h3';
import OpenAI from "openai";

interface OpenAIMessage {
  role: 'user' | 'system' | 'assistant';
  content: string;
}

interface OpenAIRequestBody {
  messages: OpenAIMessage[];
}

interface OpenAIResponse {
  id: string;
  object: string;
  created: number;
  model: string;
  choices: {
    message: OpenAIMessage;
    finish_reason: string;
    index: number;
  }[];
  usage: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}

export default defineEventHandler(async (event) => {
  const body = await readBody<OpenAIRequestBody>(event);

  if (!body || !body.messages || !Array.isArray(body.messages)) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Invalid request body. "messages" array is required.',
    });
  }

  const openai = new OpenAI({
    apiKey: useRuntimeConfig().public.openaiApiKey,
  });

  const result = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    store: true,
    messages: body.messages,
  });

  return {
    status: 200,
    body: result.choices[0].message.content,
  };
});
