
import { GoogleGenAI, Type } from "@google/genai";
import { AnalysisResponse } from "../types";

const API_KEY = process.env.API_KEY;

export async function analyzeDocumentForErrors(base64Content: string, mimeType: string): Promise<AnalysisResponse> {
  if (!API_KEY) {
    throw new Error("API Key não configurada.");
  }

  const ai = new GoogleGenAI({ apiKey: API_KEY });
  
  const prompt = `
    Analise rigorosamente o texto presente neste documento (${mimeType}) em busca de erros de português (pt-BR).
    Verifique ortografia, gramática, pontuação, concordância e coesão.
    
    Atenção especial para:
    - Uso de maiúsculas/minúsculas (meses do ano em PT-BR são minúsculos).
    - Pontuação ausente entre frases.
    - Erros comuns de acentuação.
    - Erros de digitação.

    Responda EXCLUSIVAMENTE em formato JSON seguindo o schema fornecido.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: {
        parts: [
          { inlineData: { mimeType: mimeType, data: base64Content } },
          { text: prompt }
        ]
      },
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            hasErrors: { type: Type.BOOLEAN },
            summary: { type: Type.STRING },
            overallConfidence: { type: Type.NUMBER },
            corrections: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  originalText: { type: Type.STRING },
                  correctedText: { type: Type.STRING },
                  reason: { type: Type.STRING },
                  type: { 
                    type: Type.STRING,
                    description: "Um dos: spelling, grammar, punctuation, style, context" 
                  },
                  severity: { 
                    type: Type.STRING,
                    description: "Um dos: low, medium, high" 
                  }
                },
                required: ["originalText", "correctedText", "reason", "type", "severity"]
              }
            }
          },
          required: ["hasErrors", "summary", "corrections", "overallConfidence"]
        }
      }
    });

    const resultText = response.text || "{}";
    return JSON.parse(resultText) as AnalysisResponse;
  } catch (error) {
    console.error("Erro na análise do Gemini:", error);
    throw new Error("Falha ao analisar o documento. Tente novamente.");
  }
}
