"use client";

import {
  ExternalLink,
  Sparkles,
  TrendingUp,
  Clock,
  Layers,
  FileText,
  RotateCcw,
  ArrowRight,
  Building2,
} from "lucide-react";
import { CarouselSlide } from "@/lib/gemini";
import { CuratedPostData, RawNewsData } from "./WorkspaceStudio";

interface ExecutiveBriefingViewProps {
  news: RawNewsData;
  curated: CuratedPostData | null;
  slides: CarouselSlide[];
  isPending: boolean;
  onCurate: (newsId: string) => void;
  onSwitchToStudio: () => void;
}

export function ExecutiveBriefingView({
  news,
  curated,
  slides,
  isPending,
  onCurate,
  onSwitchToStudio,
}: ExecutiveBriefingViewProps) {
  const score = curated?.score || 0;

  // Classificação do score de relevância
  const getScoreBadge = (val: number) => {
    if (val >= 8.5) {
      return {
        label: "Impacto Crítico",
        desc: "Fato relevante com potencial de movimentar a bolsa ou setores inteiros.",
        color:
          "bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-400 border-rose-200 dark:border-rose-800/80",
        badgeBg: "bg-rose-500",
      };
    }
    if (val >= 7.0) {
      return {
        label: "Alto Impacto",
        desc: "Notícia importante para fundamentos, balanços e estratégia de carteira.",
        color:
          "bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800/80",
        badgeBg: "bg-emerald-500",
      };
    }
    if (val >= 5.0) {
      return {
        label: "Impacto Moderado",
        desc: "Notícia pontual de empresa ou dados secundários de mercado.",
        color:
          "bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-800/80",
        badgeBg: "bg-amber-500",
      };
    }
    return {
      label: "Ruído de Mercado",
      desc: "Especulação ou oscilação rotineira com baixo impacto de longo prazo.",
      color:
        "bg-slate-100 dark:bg-zinc-800 text-slate-700 dark:text-zinc-300 border-slate-200 dark:border-zinc-700",
      badgeBg: "bg-slate-500",
    };
  };

  const scoreInfo = getScoreBadge(score);

  return (
    <div className="space-y-6">
      {/* 1. Header do Briefing */}
      <div className="pb-5 border-b border-slate-200 dark:border-zinc-800">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-0.5 rounded-md bg-slate-100 dark:bg-zinc-800 text-slate-700 dark:text-zinc-300 border border-slate-200 dark:border-zinc-700">
              <Building2 className="w-3 h-3 text-slate-500" />
              {news.source?.name || "Fonte"}
            </span>

            <span className="text-xs text-slate-400 dark:text-zinc-500 flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {news.pubDate
                ? new Date(news.pubDate).toLocaleDateString("pt-BR", {
                    day: "2-digit",
                    month: "long",
                    hour: "2-digit",
                    minute: "2-digit",
                  })
                : "Recente"}
            </span>
          </div>

          {curated && (
            <div className="flex items-center gap-2">
              <span
                className={`text-xs font-bold px-3 py-1 rounded-full border flex items-center gap-1.5 ${scoreInfo.color}`}
              >
                <span className={`w-2 h-2 rounded-full ${scoreInfo.badgeBg}`} />
                ★ {score.toFixed(1)}/10 — {scoreInfo.label}
              </span>
            </div>
          )}
        </div>

        <h1 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-zinc-100 leading-snug">
          {news.title}
        </h1>

        <div className="mt-3 flex items-center gap-3">
          <a
            href={news.link}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-600 hover:text-emerald-500 dark:text-emerald-400 transition-colors"
          >
            <span>Ler matéria na íntegra no portal</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>

      {/* 2. Estado: Sem Curadoria vs Com Curadoria */}
      {!curated ? (
        <div className="space-y-6">
          {/* Resumo da Notícia Original */}
          <div className="bg-slate-50 dark:bg-zinc-950/50 border border-slate-200 dark:border-zinc-800 rounded-xl p-5 space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-zinc-400 flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5 text-emerald-500" />
              Conteúdo Capturado via RSS
            </h3>
            <p className="text-sm text-slate-700 dark:text-zinc-300 leading-relaxed">
              {news.summary || "Nenhum resumo disponível diretamente da fonte."}
            </p>
          </div>

          {/* Banner de Ação para Análise IA */}
          <div className="border border-dashed border-emerald-500/40 bg-emerald-500/5 rounded-2xl p-6 text-center space-y-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-500 flex items-center justify-center mx-auto">
              <Sparkles className="w-5 h-5" />
            </div>
            <div className="space-y-1">
              <h4 className="text-sm font-bold text-slate-900 dark:text-zinc-100">
                Gerar Briefing Executivo com IA
              </h4>
              <p className="text-xs text-slate-500 dark:text-zinc-400 max-w-md mx-auto">
                O modelo analisa a relevância macroeconômica, sintetiza os impactos práticos para investidores e prepara a pauta para o estúdio visual.
              </p>
            </div>
            <button
              onClick={() => onCurate(news.id)}
              disabled={isPending}
              className="inline-flex items-center gap-2 text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white px-5 py-2.5 rounded-xl shadow-xs transition-all cursor-pointer"
            >
              <Sparkles className={`w-4 h-4 ${isPending ? "animate-spin" : ""}`} />
              <span>{isPending ? "Processando com IA..." : "Analisar Matéria com IA"}</span>
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Diagnóstico da IA / Tese de Mercado */}
          <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-xl p-5 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-emerald-700 dark:text-emerald-400 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                Diagnóstico de Mercado FinPulse ({curated.category || "Finanças"})
              </span>
              <span className="text-[11px] font-medium text-emerald-600/80 dark:text-emerald-400/80">
                {scoreInfo.desc}
              </span>
            </div>
            <p className="text-sm text-slate-800 dark:text-zinc-200 leading-relaxed font-medium">
              {curated.reasoning || "Análise concluída com sucesso pelo modelo."}
            </p>
          </div>

          {/* Resumo Direto da Matéria */}
          {news.summary && (
            <div className="space-y-2">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-zinc-500 flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5" />
                O Fato (Resumo da Pauta)
              </h3>
              <p className="text-xs sm:text-sm text-slate-700 dark:text-zinc-300 leading-relaxed bg-slate-50 dark:bg-zinc-950/60 p-4 rounded-xl border border-slate-200 dark:border-zinc-800/80">
                {news.summary}
              </p>
            </div>
          )}

          {/* Takeaways Estruturados da Análise */}
          {slides.length > 0 && (
            <div className="space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-zinc-500 flex items-center gap-1.5">
                <TrendingUp className="w-3.5 h-3.5 text-emerald-500" />
                Pontos Estratégicos & Impactos
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {slides.map((slide, idx) => (
                  <div
                    key={idx}
                    className="p-4 rounded-xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/60 space-y-2 shadow-2xs hover:border-emerald-500/40 transition-colors"
                  >
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="font-bold text-emerald-600 dark:text-emerald-400 tracking-wide uppercase">
                        {slide.badge || `Lâmina ${idx + 1}`}
                      </span>
                      <span className="text-slate-400 dark:text-zinc-500 font-mono text-[10px]">
                        #{idx + 1}
                      </span>
                    </div>
                    <h4 className="text-xs font-bold text-slate-900 dark:text-zinc-100">
                      {slide.title}
                    </h4>
                    <p className="text-xs text-slate-600 dark:text-zinc-400 leading-relaxed">
                      {slide.description}
                    </p>
                    {slide.highlightText && (
                      <div className="pt-2 border-t border-slate-100 dark:border-zinc-800/60">
                        <span className="text-[11px] font-semibold text-emerald-700 dark:text-emerald-300">
                          {slide.highlightText}
                        </span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Barra de Ação Inferior: Migração para o Estúdio de Carrossel */}
          <div className="p-4 rounded-xl bg-slate-900 dark:bg-zinc-950 text-white border border-slate-800 dark:border-zinc-800 flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="space-y-0.5 text-center sm:text-left">
              <div className="text-xs font-bold text-emerald-400 flex items-center justify-center sm:justify-start gap-1.5">
                <Layers className="w-3.5 h-3.5" />
                <span>Carrossel Visual Disponível</span>
              </div>
              <p className="text-xs text-slate-300">
                Esta notícia já possui {slides.length} lâminas diagramadas e legenda com hashtags pronta para publicação.
              </p>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={() => onCurate(news.id)}
                disabled={isPending}
                className="text-xs text-slate-400 hover:text-white px-3 py-2 rounded-lg border border-slate-700 hover:bg-slate-800 transition-colors flex items-center gap-1.5 cursor-pointer"
                title="Regenerar análise e lâminas"
              >
                <RotateCcw className={`w-3.5 h-3.5 ${isPending ? "animate-spin" : ""}`} />
                <span>Regenerar</span>
              </button>

              <button
                onClick={onSwitchToStudio}
                className="text-xs font-semibold bg-emerald-500 hover:bg-emerald-400 text-slate-950 px-4 py-2 rounded-lg transition-colors flex items-center gap-1.5 shadow-sm cursor-pointer"
              >
                <span>Abrir no Estúdio</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
