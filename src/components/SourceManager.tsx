"use client";

import { useState, useTransition } from "react";
import { Plus, Rss, ChevronDown, ChevronUp, Trash2 } from "lucide-react";
import { addSourceAction, deleteSourceAction } from "@/app/actions/news";

interface SourceItem {
  id: string;
  name: string;
  url: string;
  category: string;
  active: boolean;
}

export function SourceManager({ sources }: { sources: SourceItem[] }) {
  const [isOpen, setIsOpen] = useState(false);
  const [name, setName] = useState("");
  const [url, setUrl] = useState("");
  const [category, setCategory] = useState("macro");
  const [isPending, startTransition] = useTransition();
  const [message, setMessage] = useState<string | null>(null);

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !url) return;

    startTransition(async () => {
      const res = await addSourceAction(name, url, category);
      if (res.success) {
        setName("");
        setUrl("");
        setMessage("Fonte adicionada com sucesso!");
        setTimeout(() => setMessage(null), 3000);
      } else {
        setMessage(`Erro: ${res.error}`);
        setTimeout(() => setMessage(null), 4000);
      }
    });
  };

  return (
    <div className="border border-slate-200 dark:border-zinc-800/80 bg-white dark:bg-zinc-900/50 rounded-xl overflow-hidden transition-colors shadow-2xs">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-4 py-2.5 flex items-center justify-between text-left text-xs font-medium text-slate-700 dark:text-zinc-300 hover:bg-slate-50 dark:hover:bg-zinc-800/40 transition-colors cursor-pointer"
      >
        <div className="flex items-center gap-2">
          <Rss className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
          <span>Portais & Feeds RSS ({sources.length})</span>
        </div>
        {isOpen ? (
          <ChevronUp className="w-3.5 h-3.5 text-slate-400 dark:text-zinc-500" />
        ) : (
          <ChevronDown className="w-3.5 h-3.5 text-slate-400 dark:text-zinc-500" />
        )}
      </button>

      {isOpen && (
        <div className="p-4 border-t border-slate-200 dark:border-zinc-800/80 space-y-3 bg-slate-50/50 dark:bg-zinc-950/30">
          {/* Lista de Fontes Atuais */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
            {sources.map((src) => (
              <div
                key={src.id}
                className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 p-2.5 rounded-lg flex items-center justify-between shadow-2xs"
              >
                <div className="truncate pr-2">
                  <div className="text-xs font-semibold text-slate-800 dark:text-zinc-200 truncate">
                    {src.name}
                  </div>
                  <div className="text-[10px] text-slate-400 dark:text-zinc-500 truncate">{src.url}</div>
                </div>
                <div className="flex items-center gap-1.5 shrink-0">
                  <span className="text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded bg-slate-100 dark:bg-zinc-800 text-slate-600 dark:text-zinc-400 border border-slate-200 dark:border-zinc-700">
                    {src.category}
                  </span>
                  <button
                    onClick={() => {
                      if (confirm(`Excluir a fonte "${src.name}"?`)) {
                        startTransition(async () => {
                          await deleteSourceAction(src.id);
                        });
                      }
                    }}
                    title="Excluir fonte RSS"
                    className="p-1 text-slate-400 hover:text-rose-500 transition-colors cursor-pointer rounded"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Adicionar Nova Fonte */}
          <form
            onSubmit={handleAdd}
            className="pt-2 border-t border-slate-200 dark:border-zinc-800/60 flex flex-col md:flex-row items-center gap-2"
          >
            <input
              type="text"
              placeholder="Nome (ex: Bloomberg Línea)"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full md:w-1/3 bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-lg px-3 py-1.5 text-xs text-slate-800 dark:text-zinc-200 focus:outline-none focus:border-emerald-500"
              required
            />
            <input
              type="url"
              placeholder="URL RSS (https://...)"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              className="w-full md:w-1/2 bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-lg px-3 py-1.5 text-xs text-slate-800 dark:text-zinc-200 focus:outline-none focus:border-emerald-500"
              required
            />
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full md:w-auto bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-lg px-2.5 py-1.5 text-xs text-slate-700 dark:text-zinc-300 focus:outline-none focus:border-emerald-500"
            >
              <option value="macro">Macro</option>
              <option value="acoes">Ações</option>
              <option value="fii">FIIs</option>
              <option value="cripto">Cripto</option>
            </select>
            <button
              type="submit"
              disabled={isPending}
              className="w-full md:w-auto shrink-0 flex items-center justify-center gap-1.5 bg-emerald-600 hover:bg-emerald-500 text-white px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Adicionar</span>
            </button>
          </form>

          {message && <p className="text-xs text-emerald-600 dark:text-emerald-400">{message}</p>}
        </div>
      )}
    </div>
  );
}
