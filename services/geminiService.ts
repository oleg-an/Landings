import { GoogleGenAI, Type } from "@google/genai";
import { ProjectType, RepairCategory, RemodelGoal, AiAnalysisResult } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const analyzePlumbingIssue = async (
  projectType: ProjectType,
  categoryOrGoal: string,
  description: string
): Promise<AiAnalysisResult> => {
  try {
    const isRemodel = projectType === ProjectType.REMODEL;
    
    const context = isRemodel 
      ? `User wants a bathroom remodel. Goal: ${categoryOrGoal}.` 
      : `User has a plumbing repair issue. Category: ${categoryOrGoal}.`;

    const prompt = `
      You are an expert consultant for HomeBuddy (bathroom remodeling and repair service).
      ${context}
      User Description: "${description || 'No specific details provided.'}"

      Please analyze this and return a JSON response.
      
      If REMODEL:
      1. 'title': "Project Insight"
      2. 'content': A quick tip on why this upgrade is great (e.g., "Walk-in showers increase safety...").
      3. 'highlight': Estimated installation time (e.g., "Typically installs in 1-2 days").

      If REPAIR:
      1. 'title': "Preliminary Diagnosis"
      2. 'content': A short guess of what is wrong and advice (e.g., "Likely a worn cartridge. Turn off water if leaking.").
      3. 'highlight': Urgency level (e.g., "High Priority" or "Routine Fix").

      Respond in English. Tone: Professional, helpful, encouraging.
    `;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING },
            content: { type: Type.STRING },
            highlight: { type: Type.STRING }
          },
          required: ['title', 'content', 'highlight']
        }
      }
    });

    const text = response.text;
    if (!text) throw new Error("No response from AI");

    return JSON.parse(text) as AiAnalysisResult;

  } catch (error) {
    console.error("AI Analysis failed:", error);
    return {
      title: "Request Received",
      content: "Our specialists will review your details and provide a custom quote shortly.",
      highlight: "Response within 15 mins"
    };
  }
};