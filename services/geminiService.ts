import { GoogleGenAI } from "@google/genai";

const apiKey = process.env.API_KEY || ''; // Ensure this is set in your environment
const ai = new GoogleGenAI({ apiKey });

export const generateSupportResponse = async (userMessage: string): Promise<string> => {
  if (!apiKey) {
    return "I'm currently offline (API Key missing), but feel free to call our support line for assistance!";
  }

  try {
    const model = 'gemini-2.5-flash';
    const systemInstruction = `You are the virtual assistant for Jamhuri Transfers Kenya, a premium airport transfer and comfort ride service. 
    Your tone is professional, warm, and welcoming ("Karibu Nyumbani"). 
    Help users with questions about Nairobi, airport transfer times, safety, and booking procedures.
    The pricing model is 40 KES per km + 5 KES per min. 
    Do not give specific fare quotes, tell them to use the app calculator.
    Keep responses concise and helpful.`;

    const response = await ai.models.generateContent({
      model,
      contents: userMessage,
      config: {
        systemInstruction,
      }
    });

    return response.text || "I apologize, I couldn't process that request right now.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "I'm having trouble connecting to the network. Please try again later.";
  }
};