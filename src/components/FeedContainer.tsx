"use client";

import { useState, useMemo } from "react";
import { Search, Filter, Sparkles, CheckCircle2, ListFilter } from "lucide-react";
import { PostCard, RawNewsData, CuratedPostData } from "./PostCard";

export function FeedContainer({ initialNews }: { initialNews: RawNewsData[] }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "curated" | "approved">("all");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");

  const filteredNews = useMemo(() => {
    return initialNews.filter((item) => {
      // Filtro de texto
      const matchesSearch =
        item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (item.summary && item.summary.toLowerCase().includes(searchTerm.toLowerCase()));

      if (!matchesSearch) return false;

      // Filtro de status
      const hasCurated = item.posts.length > 0;
      const isApproved = item.posts.some((p) => p.status === "APPROVED");

      if (statusFilter === "curated" && !hasCurated) return false;
      if (statusFilter === "approved" && !isApproved) return false;

      // Filtro de categoria
      if (categoryFilter !== "all") {
        const itemCat = item.posts[0]?.category || item.source?.category || "";
        if (!itemCat.toLowerCase().includes(categoryFilter.toLowerCase())) return false;
      }

      return true;
    });
  }, [initialNews, searchTerm, statusFilter, categoryFilter]);

  return (
    <div className="space-y-6">
      {/* Barra de Filtros e Busca */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 bg-zinc-900/60 p-3 rounded-xl border border-zinc-800">
        {/* Abas Rápidas */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0">
          <button
            onClick={() => setStatusFilter("all")}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer shrink-0 ${
              statusFilter === "all"
                ? "bg-zinc-800 text-zinc-100 border border-zinc-700"
                : "text-zinc-400 hover:text-zinc-200"
            }`}
          >
            Todas ({initialNews.length})
          </button>
          <button
            onClick={() => setStatusFilter("curated")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer shrink-0 ${
              statusFilter === "curated"
                ? "bg-purple-950/60 text-purple-300 border border-purple-800/60"
                : "text-zinc-400 hover:text-zinc-200"
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-purple-400" />
            <span>Curadas por IA</span>
          </button>
          <button
            onClick={() => setStatusFilter("approved")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer shrink-0 ${
              statusFilter === "approved"
                ? "bg-emerald-950/60 text-emerald-300 border border-emerald-800/60"
                : "text-zinc-400 hover:text-zinc-200"
            }`}
          >
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            <span>Prontas / Aprovadas</span>
          </button>
        </div>

        {/* Busca e Categoria */}
        <div className="flex items-center gap-2">
          <div className="relative flex-1 md:w-64">
            <Search className="w-3.5 h-3.5 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Buscar palavra-chave..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-zinc-950 border border-zinc-800 rounded-lg pl-8 pr-3 py-1.5 text-xs text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-emerald-500"
            />
          </div>

          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-1.5 text-xs text-zinc-300 focus:outline-none focus:border-emerald-500 cursor-pointer"
          >
            <option value="all">Todas as Categorias</option>
            <option value="macro">Macroeconomia</option>
            <option value="acoes">Ações / B3</option>
            <option value="fii">FIIs</option>
            <option value="cripto">Cripto</option>
          </select>
        </div>
      </div>

      {/* Grid de Cards */}
      {filteredNews.length === 0 ? (
        <div className="bg-zinc-900/30 border border-dashed border-zinc-800 rounded-xl py-16 text-center">
          <ListFilter className="w-8 h-8 text-zinc-600 mx-auto mb-3" />
          <h3 className="text-sm font-semibold text-zinc-300">Nenhuma notícia encontrada</h3>
          <p className="text-xs text-zinc-500 mt-1 max-w-sm mx-auto">
            {initialNews.length === 0
              ? "Clique no botão 'Buscar Notícias' no topo para coletar as últimas matérias das fontes financeiras cadastradas."
              : "Tente ajustar seus termos de busca ou filtros para ver mais notícias."}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {filteredNews.map((item) => (
            <PostCard key={item.id} news={item} />
          ))}
        </div>
      )}
    </div>
  );
}
