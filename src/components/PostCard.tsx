"use client";

import { useState, useTransition } from "react";
import {
  ExternalLink,
  Sparkles,
  CheckCircle,
  Clock,
  RotateCcw,
} from "lucide-react";
import {
  curateNewsAction,
  updatePostStatusAction,
} from "@/app/actions/news";
import { InstagramSlideView } from "./InstagramSlideView";
import { CarouselSlide } from "@/lib/gemini";
import { InstagramIcon } from "./InstagramIcon";

export interface CuratedPostData {
  id: string;
  score: number;
  reasoning: string | null;
  category: string | null;
  instagramCaption: string | null;
  slidesJson: string | null;
  linkedinPost: string | null;
  twitterPost: string | null;
  newsletterPost: string | null;
  status: string;
}

export interface RawNewsData {
  id: string;
  title: string;
  link: string;
  summary: string | null;
  pubDate: Date | null;
  source: { name: string; category: string } | null;
  posts: CuratedPostData[];
}

export function PostCard({ news }: { news: RawNewsData }) {
  const [isPending, startTransition] = useTransition();
  const curated = news.posts[0] || null;

  const handleCurate = () => {
    startTransition(async () => {
      await curateNewsAction(news.id);
    });
  };

  const handleStatusChange = (newStatus: "REVIEW" | "APPROVED" | "ARCHIVED") => {
    if (!curated) return;
    startTransition(async () => {
      await updatePostStatusAction(curated.id, newStatus);
    });
  };

  // Score color helper
  const getScoreColor = (score: number) => {
    if (score >= 8.0) return "bg-emerald-500/10 text-emerald-400 border-emerald-500/30";
    if (score >= 6.0) return "bg-amber-500/10 text-amber-400 border-amber-500/30";
    return "bg-zinc-800 text-zinc-400 border-zinc-700";
  };

  const formattedDate = news.pubDate
    ? new Date(news.pubDate).toLocaleDateString("pt-BR", {
        day: "2-digit",
        month: "short",
        hour: "2-digit",
        minute: "2-digit",
      })
    : "Recente";

  // Parse dos slides salvos
  let parsedSlides: CarouselSlide[] = [];
  if (curated?.slidesJson) {
    try {
      parsedSlides = JSON.parse(curated.slidesJson);
    } catch {
      parsedSlides = [];
    }
  }

  // Fallback caso não tenha slides gravados ainda
  if (parsedSlides.length === 0 && curated) {
    parsedSlides = [
      {
        slideNumber: 1,
        badge: "RADAR FINPULSE",
        title: news.title.slice(0, 65),
        description: news.summary || "Entenda o que aconteceu e como isso afeta seus investimentos.",
        highlightText: "Análise Rápida 📊",
        footer: "@finpulse.ai • Deslize 👉",
      },
      {
        slideNumber: 2,
        badge: "O QUE FAZER",
        title: "Impacto no Seu Bolso",
        description: curated.reasoning || "Acompanhe os fundamentos antes de tomar qualquer decisão de alocação.",
        highlightText: "Mantenha o foco 🛡️",
        footer: "Salve para consultar 📌",
      },
    ];
  }

  return (
    <div className="bg-zinc-900/80 border border-zinc-800 rounded-2xl overflow-hidden shadow-lg hover:border-zinc-700 transition-all flex flex-col">
      {/* Top Header Notícia */}
      <div className="p-5 border-b border-zinc-800/80 bg-zinc-950/40">
        <div className="flex items-center justify-between gap-2 mb-2">
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-semibold bg-zinc-800 text-zinc-300 px-2.5 py-0.5 rounded-md border border-zinc-700">
              {news.source?.name || "Fonte"}
            </span>
            <span className="text-xs text-zinc-500 flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {formattedDate}
            </span>
          </div>

          {curated && (
            <div className="flex items-center gap-2">
              <span
                className={`text-xs font-bold px-2.5 py-0.5 rounded-full border ${getScoreColor(
                  curated.score
                )}`}
              >
                ★ {curated.score.toFixed(1)}/10
              </span>
              <span
                className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${
                  curated.status === "APPROVED"
                    ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                    : curated.status === "ARCHIVED"
                    ? "bg-zinc-800 text-zinc-400"
                    : "bg-pink-500/20 text-pink-300 border border-pink-500/30"
                }`}
              >
                {curated.status === "APPROVED"
                  ? "Aprovado"
                  : curated.status === "ARCHIVED"
                  ? "Arquivado"
                  : "Pronto p/ Instagram"}
              </span>
            </div>
          )}
        </div>

        {/* Título da Notícia Original */}
        <h3 className="text-base font-bold text-zinc-100 leading-snug">
          <a
            href={news.link}
            target="_blank"
            rel="noreferrer"
            className="hover:text-emerald-400 transition-colors inline-flex items-center gap-1.5 group"
          >
            <span>{news.title}</span>
            <ExternalLink className="w-3.5 h-3.5 text-zinc-500 group-hover:text-emerald-400 shrink-0" />
          </a>
        </h3>

        {news.summary && (
          <p className="text-xs text-zinc-400 mt-2 line-clamp-2 leading-relaxed">
            {news.summary}
          </p>
        )}
      </div>

      {/* Conteúdo Gerado ou Botão de Ação */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        {!curated ? (
          <div className="py-10 text-center flex flex-col items-center justify-center">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-pink-600 to-amber-500 flex items-center justify-center mb-3 shadow-lg shadow-pink-950/50">
              <InstagramIcon className="w-6 h-6 text-white" />
            </div>
            <h4 className="text-sm font-semibold text-zinc-200">Carrossel do Instagram não gerado</h4>
            <p className="text-xs text-zinc-400 mb-5 max-w-sm mt-1">
              Transforme esta matéria em um carrossel visual com lâminas para download e legenda pronta para postar.
            </p>
            <button
              onClick={handleCurate}
              disabled={isPending}
              className="flex items-center gap-2 text-xs font-semibold bg-gradient-to-r from-pink-600 via-rose-500 to-amber-500 hover:from-pink-500 hover:to-amber-400 disabled:opacity-50 text-white px-5 py-2.5 rounded-xl shadow-md shadow-pink-950 transition-all cursor-pointer"
            >
              <Sparkles className={`w-4 h-4 ${isPending ? "animate-spin" : ""}`} />
              <span>{isPending ? "Gerando Carrossel & Legenda..." : "Criar Carrossel para Instagram"}</span>
            </button>
          </div>
        ) : (
          <div className="flex-1 flex flex-col space-y-4">
            {/* Justificativa da IA */}
            {curated.reasoning && (
              <div className="bg-zinc-950/70 border border-zinc-800 p-3 rounded-xl">
                <div className="text-[11px] font-bold text-emerald-400 flex items-center gap-1.5 mb-1">
                  <Sparkles className="w-3 h-3" />
                  <span>Diagnóstico do Mercado ({curated.category || "Finanças"}):</span>
                </div>
                <p className="text-xs text-zinc-300 italic">{curated.reasoning}</p>
              </div>
            )}

            {/* Visualizador de Slides e Legenda do Instagram */}
            <InstagramSlideView
              slides={parsedSlides}
              caption={curated.instagramCaption || ""}
              category={curated.category}
            />

            {/* Footer de Ações e Status */}
            <div className="flex items-center justify-between pt-4 border-t border-zinc-800">
              <button
                onClick={handleCurate}
                disabled={isPending}
                title="Regenerar Carrossel com IA"
                className="text-xs text-zinc-400 hover:text-emerald-400 flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <RotateCcw className={`w-3.5 h-3.5 ${isPending ? "animate-spin" : ""}`} />
                <span>Regenerar Carrossel</span>
              </button>

              <div className="flex items-center gap-2">
                {curated.status !== "APPROVED" ? (
                  <button
                    onClick={() => handleStatusChange("APPROVED")}
                    disabled={isPending}
                    className="flex items-center gap-1.5 text-xs font-semibold bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 border border-emerald-500/40 px-3.5 py-1.5 rounded-lg transition-all cursor-pointer"
                  >
                    <CheckCircle className="w-3.5 h-3.5" />
                    <span>Aprovar Post</span>
                  </button>
                ) : (
                  <button
                    onClick={() => handleStatusChange("REVIEW")}
                    disabled={isPending}
                    className="text-xs text-zinc-400 hover:text-zinc-200 px-3 py-1.5 rounded-lg bg-zinc-800 cursor-pointer"
                  >
                    Voltar para Rascunho
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
