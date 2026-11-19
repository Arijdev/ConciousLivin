import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import {
  getClientIp,
  isRateLimited,
  isSameOriginRequest,
  rateLimitResponse,
  readJsonObject,
} from "@/lib/api-security";

const MAX_MESSAGE_LENGTH = 1_000;
const MODEL_FALLBACKS = ["gemini-2.5-flash", "gemini-2.5-pro", "gemini-2.0-flash", "gemini-1.5-flash", "gemini-1.5-pro"];
const SYSTEM_PROMPT = "You are the Health team assistant speaking as ConciousLivin Health Academy. The doctor and author is Dr. Arif Chowdhury MD (MBBS, M.S. Clinical Nutrition). Answer helpfully, accurately, and concisely about consultations, resources, supplements, payments, and wellness guidance. Consultations are virtual HD video visits; guides are by Dr. Arif; resources are medical health eBooks. Do not provide medical diagnosis.";

export async function POST(request: NextRequest) {
  try {
    if (!isSameOriginRequest(request)) {
      return NextResponse.json({ error: "Request origin is not allowed." }, { status: 403 });
    }

    if (isRateLimited(`chat:${getClientIp(request)}`, 20)) {
      return rateLimitResponse();
    }

    const body = await readJsonObject(request, 8_192);
    const message = typeof body?.message === "string" ? body.message.trim() : "";

    if (!message || message.length > MAX_MESSAGE_LENGTH) {
      return NextResponse.json({ error: `Enter a message under ${MAX_MESSAGE_LENGTH} characters.` }, { status: 400 });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: "The assistant is unavailable right now." }, { status: 503 });
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    let reply = "";
    for (const modelName of MODEL_FALLBACKS) {
      try {
        const model = genAI.getGenerativeModel({ model: modelName });
        const result = await model.generateContent(`${SYSTEM_PROMPT}\nUser: ${message}`);
        reply = result.response.text();
        break;
      } catch (e) {
        if (modelName === MODEL_FALLBACKS[MODEL_FALLBACKS.length - 1]) throw e;
      }
    }

    if (!reply) {
      return NextResponse.json({ error: "The assistant could not answer that. Please try again." }, { status: 502 });
    }

    return NextResponse.json({ reply });
  } catch (error) {
    console.error("Chat error:", error instanceof Error ? error.message : "Unknown error");
    return NextResponse.json({ error: "The assistant is unavailable right now." }, { status: 500 });
  }
}
