
import { GoogleGenAI } from "@google/genai";

const API_KEY = process.env.API_KEY;
if (!API_KEY) {
  console.warn("Gemini API key not found. Please set the API_KEY environment variable.");
}

export const ai = new GoogleGenAI({ apiKey: API_KEY! });

export const getPostureTip = async (status: string): Promise<string> => {
  if (!API_KEY) {
    // Fallback tips if no API key
    const tips = [
      "Keep your feet flat on the floor.",
      "Ensure your monitor is at eye level.",
      "Take a deep breath and roll your shoulders back.",
      "Engage your core slightly to support your lower back."
    ];
    return tips[Math.floor(Math.random() * tips.length)];
  }
  
  try {
    const context = status === 'Good Posture' 
      ? "The user has good posture right now. Give a NEW and UNIQUE tip on maintaining it or a general ergonomic fact. Do not repeat previous advice." 
      : `The user is currently ${status}. Give a specific, short correction tip that is different from generic advice.`;
    
    // Add a random seed to the prompt to force variety
    const randomSeed = Math.floor(Math.random() * 10000);

    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: `You are a creative posture coach. ${context} The tip must be under 15 words. Random seed: ${randomSeed}. Variations: Humor, Scientific Fact, Direct Command.`,
    });

    return response.text || "Keep your spine aligned.";
  } catch (error) {
    console.error("Error fetching posture tip from Gemini:", error);
    return "Remember to take breaks every 30 minutes.";
  }
};
