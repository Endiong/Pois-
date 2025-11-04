
import { GoogleGenAI } from "@google/genai";

const API_KEY = process.env.API_KEY;
if (!API_KEY) {
  console.warn("Gemini API key not found. Please set the API_KEY environment variable.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY! });

export const getPostureTip = async (): Promise<string> => {
  if (!API_KEY) {
    return "Gemini API key not configured. Please contact support.";
  }
  
  try {
    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: "Give me a single, short, actionable tip for improving my posture while sitting at a desk. The tip should be concise and easy to follow. Maximum 2 sentences.",
    });

    return response.text;
  } catch (error) {
    console.error("Error fetching posture tip from Gemini:", error);
    return "Could not fetch a tip at the moment. Please try again later.";
  }
};
