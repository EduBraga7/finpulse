import dotenv from "dotenv";
dotenv.config();
import { GoogleGenAI } from "@google/genai";

async function main() {
  const apiKey = process.env.GEMINI_API_KEY;
  const ai = new GoogleGenAI({ apiKey });

  console.log("Chamando gemini-3.6-flash com prompt JSON...");
  const start = Date.now();
  const res = await ai.models.generateContent({
    model: "gemini-3.6-flash",
    contents: `Você é um analista de investimentos. Analise a matéria: "Petrobras aprova pagamento de R$ 12 bilhões em dividendos extraordinários".
Dê uma nota realista de 1.0 a 10.0 (não use sempre o mesmo número, varie conforme a relevância real).
Retorne SOMENTE um JSON válido:
{
  "score": 9.4,
  "reasoning": "Impacto imediato para detentores de PETR4 e fluxo na B3.",
  "category": "Ações/B3"
}`,
  });

  console.log(`Tempo: ${Date.now() - start}ms`);
  const text = res.text || "";
  console.log("Texto retornado:", text);

  const clean = text.replace(/```json/g, "").replace(/```/g, "").trim();
  const parsed = JSON.parse(clean);
  console.log("JSON Parseado com sucesso! Score:", parsed.score);
}

main().catch(console.error);
