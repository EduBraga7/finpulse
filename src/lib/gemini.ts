import { GoogleGenAI } from "@google/genai";

export interface CarouselSlide {
  slideNumber: number;
  badge: string;
  title: string;
  description: string;
  highlightText?: string;
  footer?: string;
}

export interface AIAnalysisResult {
  score: number;
  reasoning: string;
  category: string;
  instagramCaption: string;
  slides: CarouselSlide[];
  linkedinPost?: string;
  twitterPost?: string;
  newsletterPost?: string;
}

export async function curateAndGenerateContent(news: {
  title: string;
  summary?: string | null;
  content?: string | null;
}): Promise<AIAnalysisResult> {
  const apiKey = process.env.GEMINI_API_KEY?.trim();

  const fallbackResult: AIAnalysisResult = {
    score: 7.5,
    reasoning:
      "Notícia analisada em modo offline/demonstração. Conecte sua chave do Gemini para obter scores e análises dinâmicas em tempo real.",
    category: "Macroeconomia",
    instagramCaption: `🚨 Radar Financeiro: ${news.title}\n\nEntenda em detalhes os reflexos dessa matéria no mercado financeiro e no bolso do investidor.\n\n👉 Deslize para ver os slides explicativos!\n\n💬 O que achou dessa movimentação? Comente abaixo!\n\n#investimentos #b3 #mercadofinanceiro #economia`,
    slides: [
      {
        slideNumber: 1,
        badge: "RADAR DO MERCADO",
        title: news.title.slice(0, 65),
        description: news.summary || "Entenda o que aconteceu e os principais pontos de atenção.",
        highlightText: "Mercado em Movimento 📊",
        footer: "@finpulse.ai • Deslize 👉",
      },
      {
        slideNumber: 2,
        badge: "IMPACTO",
        title: "O Que Muda Para Você?",
        description: "Acompanhe os fundamentos dos seus ativos antes de tomar decisões financeiras.",
        highlightText: "Foco no Longo Prazo 🛡️",
        footer: "Salve para consultar 📌",
      },
    ],
  };

  if (!apiKey) {
    return fallbackResult;
  }

  try {
    const ai = new GoogleGenAI({ apiKey });

    const prompt = `Você é um analista financeiro sênior e estrategista de conteúdo do Instagram (FinPulse AI).
Analise a seguinte notícia do mercado financeiro e crie um carrossel de slides e legenda.

Notícia:
Título: "${news.title}"
Resumo/Contexto: "${news.summary || news.content || "Sem resumo adicional"}"

DIRETRIZES CRÍTICAS PARA O SCORE:
- Avalie a relevância de 1.0 a 10.0 com RIGOR e REALISMO (NÃO use sempre o mesmo número! Varie conforme a relevância real):
  * 3.0 a 5.0: Matérias fracas, ruído diário, especulação sem fundamento ou fofoca de mercado.
  * 5.1 a 7.0: Notícias moderadas ou pontuais de empresas menores.
  * 7.1 a 8.5: Notícias relevantes sobre empresas da B3, resultados trimestrais ou inflação.
  * 8.6 a 10.0: Apenas grandes fatos macroeconômicos (decisão da taxa Selic, do Banco Central, corte de juros do Fed, ou lucros/dividendos bilionários de estatais e blue chips).

FORMATO DE RESPOSTA OBRIGATÓRIO (retorne SOMENTE um JSON válido com esta estrutura exata, sem textos antes ou depois):
{
  "score": 7.8,
  "reasoning": "explicação de 2 linhas do porquê essa nota foi atribuída",
  "category": "Ações/B3 ou Macroeconomia ou FIIs ou Renda Fixa ou Cripto",
  "slides": [
    {
      "slideNumber": 1,
      "badge": "RADAR DO MERCADO",
      "title": "título curto do slide 1",
      "description": "texto explicativo claro",
      "highlightText": "métrica ou frase de destaque",
      "footer": "@finpulse.ai • Deslize 👉"
    },
    {
      "slideNumber": 2,
      "badge": "O FATO",
      "title": "título curto do slide 2",
      "description": "texto explicativo claro",
      "highlightText": "destaque 2",
      "footer": "@finpulse.ai • Slide 2/4"
    },
    {
      "slideNumber": 3,
      "badge": "IMPACTO",
      "title": "título curto do slide 3",
      "description": "texto explicativo claro",
      "highlightText": "destaque 3",
      "footer": "@finpulse.ai • Slide 3/4"
    },
    {
      "slideNumber": 4,
      "badge": "ESTRATÉGIA",
      "title": "título curto do slide 4",
      "description": "texto explicativo claro",
      "highlightText": "destaque 4",
      "footer": "Salve para consultar 📌"
    }
  ],
  "instagramCaption": "Legenda completa formatada para o feed com emojis, quebras de linha limpas, pergunta para comentários e 8 a 10 hashtags."
}`;

    const CANDIDATE_MODELS = [
      "gemini-3.5-flash-lite",
      "gemini-3.1-flash-lite",
      "gemini-3.5-flash",
    ];
    let responseText = "";
    let lastError: any = null;

    for (const modelName of CANDIDATE_MODELS) {
      try {
        const timeoutPromise = new Promise((_, reject) =>
          setTimeout(() => reject(new Error(`Timeout ao chamar modelo ${modelName}`)), 35000)
        );
        const apiPromise = ai.models.generateContent({
          model: modelName,
          contents: prompt,
        });

        const response: any = await Promise.race([apiPromise, timeoutPromise]);
        responseText = response.text || "";
        if (responseText) {
          console.log(`[FinPulse AI] Sucesso usando o modelo: ${modelName}`);
          break;
        }
      } catch (err: any) {
        lastError = err;
        console.warn(`[FinPulse AI] Tentativa com ${modelName} falhou:`, err?.message?.slice(0, 100));
      }
    }

    if (!responseText && lastError) {
      throw lastError;
    }

    const jsonMatch = responseText.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error("Resposta do modelo não contém JSON válido");
    }

    const parsed = JSON.parse(jsonMatch[0]);

    // Garantir nota numérica precisa
    const rawScore = typeof parsed.score === "number" ? parsed.score : parseFloat(parsed.score);
    const score = !isNaN(rawScore) ? Math.min(Math.max(rawScore, 1.0), 10.0) : 7.2;

    return {
      score,
      reasoning: parsed.reasoning || "Análise concluída pelo FinPulse AI.",
      category: parsed.category || "Finanças",
      slides: Array.isArray(parsed.slides) && parsed.slides.length > 0 ? parsed.slides : fallbackResult.slides,
      instagramCaption: parsed.instagramCaption || fallbackResult.instagramCaption,
    };
  } catch (error: any) {
    console.error("Erro na API Gemini:", error);
    const msg = error?.message || String(error);
    if (msg.includes("429") || msg.includes("quota") || msg.includes("RESOURCE_EXHAUSTED")) {
      throw new Error("Limite de requisições da API atingido. Aguarde cerca de 30 segundos e tente novamente.");
    }
    throw new Error(`Erro na API do Gemini: ${msg.slice(0, 120)}`);
  }
}

export async function rewriteContentWithTone(
  slides: CarouselSlide[],
  caption: string,
  tone: "viral" | "technical" | "concise"
): Promise<{ slides: CarouselSlide[]; instagramCaption: string }> {
  const apiKey = process.env.GEMINI_API_KEY?.trim();
  if (!apiKey) {
    return { slides, instagramCaption: caption };
  }

  const toneInstructions = {
    viral:
      "Ajuste para TOM VIRAL/MAGNÉTICO: Use ganchos fortes de curiosidade no Slide 1, linguagem dinâmica e enérgica, que gere urgência e vontade imediata de compartilhar ou comentar.",
    technical:
      "Ajuste para TOM TÉCNICO & ANALÍTICO: Use terminologia financeira sólida (valuation, múltiplos, fundamentos, risco-retorno), foco em dados e embasamento racional de mercado.",
    concise:
      "Ajuste para TOM DIRETO AO PONTO / ULTRA CONCISO: Reduza o texto pela metade, frases curtas, objetivas, leitura rápida de menos de 10 segundos por slide.",
  }[tone];

  const prompt = `Você é o estrategista chefe de conteúdo do FinPulse AI.
Reescreva o carrossel do Instagram e a legenda abaixo aplicando a seguinte diretriz de tom:
${toneInstructions}

Slides Atuais:
${JSON.stringify(slides, null, 2)}

Legenda Atual:
"${caption}"

FORMATO OBRIGATÓRIO (retorne SOMENTE um JSON válido com esta estrutura exata, sem textos antes ou depois):
{
  "slides": [
    {
      "slideNumber": 1,
      "badge": "ETIQUETA",
      "title": "título curto e ajustado",
      "description": "descrição ajustada",
      "highlightText": "destaque ajustado",
      "footer": "@finpulse.ai • Deslize 👉"
    }
  ],
  "instagramCaption": "Legenda reescrita completa..."
}`;

  try {
    const ai = new GoogleGenAI({ apiKey });
    const CANDIDATE_MODELS = [
      "gemini-3.5-flash-lite",
      "gemini-3.1-flash-lite",
      "gemini-3.5-flash",
    ];
    let responseText = "";

    for (const modelName of CANDIDATE_MODELS) {
      try {
        const timeoutPromise = new Promise((_, reject) =>
          setTimeout(() => reject(new Error(`Timeout ao chamar modelo ${modelName}`)), 30000)
        );
        const apiPromise = ai.models.generateContent({
          model: modelName,
          contents: prompt,
        });

        const response: any = await Promise.race([apiPromise, timeoutPromise]);
        responseText = response.text || "";
        if (responseText) break;
      } catch (err) {
        console.warn(`Tentativa de reescrita com ${modelName} falhou:`, err);
      }
    }

    if (!responseText) return { slides, instagramCaption: caption };

    const jsonMatch = responseText.match(/\{[\s\S]*\}/);
    if (!jsonMatch) return { slides, instagramCaption: caption };

    const parsed = JSON.parse(jsonMatch[0]);
    return {
      slides: Array.isArray(parsed.slides) && parsed.slides.length > 0 ? parsed.slides : slides,
      instagramCaption: parsed.instagramCaption || caption,
    };
  } catch (error) {
    console.error("Erro ao reescrever conteúdo:", error);
    return { slides, instagramCaption: caption };
  }
}
