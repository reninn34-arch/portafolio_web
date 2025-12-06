import { GoogleGenAI } from "@google/genai";
import { Experience, Education, Skill } from "../types";

// Helper to format resume data for the AI context
export const formatResumeForAI = (
  experience: Experience[],
  education: Education[],
  skills: Skill[],
  name: string
): string => {
  const expStr = experience.map(e => `- ${e.role} en ${e.company} (${e.period}): ${e.description}`).join('\n');
  const eduStr = education.map(e => `- ${e.degree} en ${e.institution} (${e.year})`).join('\n');
  const skillStr = skills.map(s => `- ${s.name}`).join(', ');

  return `
    Estás actuando como el asistente virtual profesional para el portafolio de ${name}.
    Aquí tienes el currículum de ${name}:

    EXPERIENCIA:
    ${expStr}

    EDUCACIÓN:
    ${eduStr}

    HABILIDADES:
    ${skillStr}

    INSTRUCCIONES:
    1. Responde preguntas sobre la experiencia y habilidades de ${name} de manera profesional, amable y concisa.
    2. Si te preguntan por contacto, sugiere enviar un correo a contacto@${name.toLowerCase().replace(/\s/g, '')}.com (ficticio para demo).
    3. Si te preguntan algo fuera del contexto profesional, responde educadamente que solo puedes hablar sobre el perfil profesional de ${name}.
    4. Mantén las respuestas breves (menos de 100 palabras si es posible).
  `;
};

export const sendMessageToGemini = async (
  message: string,
  systemInstruction: string,
  history: { role: 'user' | 'model'; text: string }[]
): Promise<string> => {
  try {
    const apiKey = process.env.API_KEY;
    if (!apiKey) {
      throw new Error("API Key no encontrada. Por favor configura tu API Key.");
    }

    const ai = new GoogleGenAI({ apiKey });
    
    // Transform history to Gemini format
    const chatHistory = history.map(h => ({
      role: h.role,
      parts: [{ text: h.text }],
    }));

    const chat = ai.chats.create({
      model: 'gemini-2.5-flash',
      config: {
        systemInstruction: systemInstruction,
      },
      history: chatHistory
    });

    const result = await chat.sendMessage({ message });
    return result.text;
  } catch (error: any) {
    console.error("Error calling Gemini:", error);
    return "Lo siento, hubo un error al procesar tu solicitud. Por favor intenta más tarde.";
  }
};
