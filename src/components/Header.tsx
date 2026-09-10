"use client";

import { useState, useTransition } from "react";
import { TrendingUp, RefreshCw, Sparkles, Zap } from "lucide-react";
import { syncNewsAction, curateBatchAction } from "@/app/actions/news";
import { ThemeToggle } from "./ThemeToggle";

import { useToast } from "./Toast";

interface HeaderProps {
  hasApiKey: boolean;
}

export function Header({ hasApiKey }: HeaderProps) {
  const [isPending, startTransition] = useTransition();
  const toast = useToast();

  const handleSync = () => {
    startTransition(async () => {
      toast.info("Buscando notícias...", "Varrendo feeds RSS dos portais brasileiros.");
      const res = await syncNewsAction();
      if (res.success) {
        toast.success(
          "Sincronização concluída",
          res.cleanedCount && res.cleanedCount > 0
            ? `${res.newCount} novas matérias encontradas (${res.cleanedCount} matérias antigas limpas).`
            : `${res.newCount} novas matérias encontradas e adicionadas ao feed.`
        );
      } else {
        toast.error("Erro na busca", res.error);
      }
    });
  };

  const handleBatchCurate = () => {
    startTransition(async () => {
      toast.info(
        "Gerando Top 3...",
        "A IA está avaliando a relevância e montando os carrosséis."
      );
      const res = await curateBatchAction(3);
      if (res.success) {
        toast.success(
          "Top 3 gerado com sucesso!",
          `${res.processedCount} carrosséis completos prontos para o Instagram.`
        );
      } else {
        toast.error("Erro na geração", res.error);
      }
    });
  };

  return (
    <header className="border-b border-slate-200 dark:border-zinc-800/80 bg-white/90 dark:bg-zinc-950/90 backdrop-blur-md sticky top-0 z-40 transition-colors">
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
        {/* Logo & Marca */}
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-emerald-600 text-white flex items-center justify-center shadow-xs">
            <TrendingUp className="w-4 h-4 stroke-[2.5]" />
          </div>
          <div className="flex items-baseline gap-2">
            <h1 className="font-bold text-sm tracking-tight text-slate-900 dark:text-zinc-100">
              FinPulse<span className="text-emerald-600 dark:text-emerald-400">.Studio</span>
            </h1>
            <span className="text-[10px] font-medium text-slate-500 dark:text-zinc-400 hidden sm:inline">
              Instagram Carousels
            </span>
          </div>
        </div>

        {/* Ações e Controles */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Status Gemini */}
          <div
            className={`hidden md:flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-md border font-medium ${
              hasApiKey
                ? "bg-emerald-50 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-800/50 text-emerald-700 dark:text-emerald-400"
                : "bg-amber-50 dark:bg-amber-950/30 border-amber-200 dark:border-amber-800/50 text-amber-700 dark:text-amber-400"
            }`}
          >
            <Sparkles className="w-3 h-3" />
            <span>Gemini Flash AI</span>
          </div>

          {/* Botão Sincronizar */}
          <button
            onClick={handleSync}
            disabled={isPending}
            className="flex items-center gap-1.5 text-xs font-medium bg-slate-100 hover:bg-slate-200 dark:bg-zinc-900 dark:hover:bg-zinc-800 border border-slate-200 dark:border-zinc-800 text-slate-700 dark:text-zinc-300 px-3 py-1.5 rounded-lg transition-colors cursor-pointer disabled:opacity-50"
            title="Buscar notícias dos feeds RSS"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isPending ? "animate-spin" : ""}`} />
            <span className="hidden sm:inline">Buscar Notícias</span>
          </button>

          {/* Botão Gerar Top 3 */}
          <button
            onClick={handleBatchCurate}
            disabled={isPending}
            className="flex items-center gap-1.5 text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white px-3.5 py-1.5 rounded-lg transition-all shadow-xs cursor-pointer"
            title="A IA analisa e cria carrosséis para as 3 melhores matérias"
          >
            <Zap className="w-3.5 h-3.5 fill-current" />
            <span>{isPending ? "Gerando..." : "Gerar Top 3 (IA)"}</span>
          </button>

          {/* Alternador de Tema Dark/Light */}
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
