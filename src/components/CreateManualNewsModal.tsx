"use client";

import { useState, useTransition } from "react";
import { X, Sparkles, PlusCircle, PenTool, CheckCircle } from "lucide-react";
import { createManualNewsAction } from "@/app/actions/news";
import { useToast } from "./Toast";

interface CreateManualNewsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreated?: (newsId: string) => void;
}

export function CreateManualNewsModal({
  isOpen,
  onClose,
  onCreated,
}: CreateManualNewsModalProps) {
  const [title, setTitle] = useState("");
  const [summary, setSummary] = useState("");
  const [category, setCategory] = useState("Ações/B3");
  const [curateNow, setCurateNow] = useState(true);
  const [isPending, startTransition] = useTransition();
  const toast = useToast();

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      toast.error("Título obrigatório", "Digite o título da matéria ou tese.");
      return;
    }

    startTransition(async () => {
      toast.info("Criando pauta...", curateNow ? "A IA iniciará a curadoria e criação dos slides." : "Salvando no feed.");
      const res = await createManualNewsAction({
        title: title.trim(),
        summary: summary.trim() || undefined,
        category,
        curateNow,
      });

      if (res.success && res.newsId) {
        toast.success(
          "Pauta criada com sucesso!",
          curateNow
            ? "O carrossel e a legenda já foram gerados pela IA."
            : "A matéria foi adicionada ao feed de rascunhos."
        );
        setTitle("");
        setSummary("");
        onCreated?.(res.newsId);
        onClose();
      } else {
        toast.error("Erro ao criar pauta", res.error);
      }
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="w-full max-w-lg bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-2xl shadow-2xl p-6 relative">
        {/* Botão Fechar */}
        <button
          onClick={onClose}
          disabled={isPending}
          className="absolute top-4 right-4 p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-zinc-200 hover:bg-slate-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex items-center gap-2 mb-1">
          <div className="w-8 h-8 rounded-xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
            <PenTool className="w-4 h-4" />
          </div>
          <h3 className="text-base font-bold text-slate-900 dark:text-zinc-100">
            Criar Nova Pauta ou Notícia Manual
          </h3>
        </div>
        <p className="text-xs text-slate-500 dark:text-zinc-400 mb-5">
          Insira qualquer notícia externa, fato relevante ou ideia de investimento para transformar em carrossel.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Título da Notícia */}
          <div>
            <label className="text-xs font-semibold text-slate-700 dark:text-zinc-300 block mb-1.5">
              Título da Pauta / Fato Principal:
            </label>
            <input
              type="text"
              placeholder="Ex: Por que os dividendos da Petrobras surpreenderam o mercado hoje..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className="w-full bg-slate-50 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 rounded-lg px-3 py-2 text-xs text-slate-900 dark:text-zinc-100 placeholder-slate-400 focus:outline-none focus:border-emerald-500"
            />
          </div>

          {/* Resumo / Pontos Importantes */}
          <div>
            <label className="text-xs font-semibold text-slate-700 dark:text-zinc-300 block mb-1.5">
              Contexto, Resumo ou Dados Relevantes:
            </label>
            <textarea
              rows={4}
              placeholder="Cole aqui o texto da matéria, números do balanço, cotações ou os principais insights que a IA deve cobrir nos slides..."
              value={summary}
              onChange={(e) => setSummary(e.target.value)}
              className="w-full bg-slate-50 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 rounded-lg p-3 text-xs text-slate-900 dark:text-zinc-100 placeholder-slate-400 focus:outline-none focus:border-emerald-500 resize-y"
            />
          </div>

          {/* Categoria */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-slate-700 dark:text-zinc-300 block mb-1.5">
                Categoria:
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full bg-slate-50 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 rounded-lg px-3 py-2 text-xs text-slate-900 dark:text-zinc-100 focus:outline-none focus:border-emerald-500 cursor-pointer"
              >
                <option value="Ações/B3">Ações & B3</option>
                <option value="Macroeconomia">Macroeconomia</option>
                <option value="FIIs">Fundos Imobiliários (FIIs)</option>
                <option value="Renda Fixa">Renda Fixa & Crédito</option>
                <option value="Cripto">Criptoativos</option>
              </select>
            </div>

            {/* Opção Gerar Imediatamente */}
            <div className="flex flex-col justify-end">
              <label className="flex items-center gap-2 p-2 rounded-lg bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/40 text-xs font-medium text-emerald-800 dark:text-emerald-300 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={curateNow}
                  onChange={(e) => setCurateNow(e.target.checked)}
                  className="rounded text-emerald-600 focus:ring-emerald-500 w-3.5 h-3.5 cursor-pointer"
                />
                <span className="flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5 text-emerald-500" />
                  <span>Gerar carrossel com IA</span>
                </span>
              </label>
            </div>
          </div>

          {/* Botões do Modal */}
          <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100 dark:border-zinc-800">
            <button
              type="button"
              onClick={onClose}
              disabled={isPending}
              className="px-3.5 py-2 text-xs font-medium text-slate-600 hover:text-slate-800 dark:text-zinc-400 dark:hover:text-zinc-200 transition-colors cursor-pointer"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isPending}
              className="px-4 py-2 text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white rounded-xl shadow-xs transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <Sparkles className={`w-3.5 h-3.5 ${isPending ? "animate-spin" : ""}`} />
              <span>{isPending ? "Processando com IA..." : "Criar & Curar"}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
