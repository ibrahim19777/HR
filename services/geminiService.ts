
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateJobDescription = async (role: string, lang: 'en' | 'ar') => {
  const prompt = lang === 'ar' 
    ? `اكتب وصفًا وظيفيًا مفصلاً باللغة العربية لوظيفة: ${role}. اجعله احترافيًا وشاملاً للمهام والمتطلبات.`
    : `Generate a professional job description for a ${role} position. Include responsibilities, requirements, and benefits.`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
    });
    return response.text;
  } catch (error) {
    console.error("AI Generation Error:", error);
    return "Failed to generate text. Please try again.";
  }
};

export const explainLaborLaw = async (country: string, topic: string, lang: 'en' | 'ar') => {
  const prompt = `Explain the labor law in ${country} regarding ${topic}. Respond in ${lang === 'ar' ? 'Arabic' : 'English'}. Include key points like leave entitlement or end-of-service benefits if applicable.`;
  
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
    });
    return response.text;
  } catch (error) {
    console.error("Labor Law AI Error:", error);
    return "Error fetching legal information.";
  }
};
