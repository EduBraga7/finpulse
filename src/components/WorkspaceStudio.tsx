"use client";

import { useState, useMemo, useTransition } from "react";
import {
  Search,
  Sparkles,
  CheckCircle,
  ExternalLink,
  RotateCcw,
  CheckCircle2,
  Clock,
  Inbox,
  Filter,
  Trash2,
  PenTool,
  Tag,
} from "lucide-react";
import { InstagramSlideView } from "./InstagramSlideView";
import { InstagramIcon } from "./InstagramIcon";
import { CarouselSlide } from "@/lib/gemini";
import {
  curateNewsAction,
  updatePostStatusAction,
  deleteNewsAction,
  deleteCuratedPostAction,
} from "@/app/actions/news";

import { useToast } from "./Toast";
import { BrandSettingsModal } from "./BrandSettingsModal";
import { CreateManualNewsModal } from "./CreateManualNewsModal";

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

export function WorkspaceStudio({ initialNews }: { initialNews: RawNewsData[] }) {
  const [selectedId, setSelectedId] = useState<string>(
    initialNews.find((n) => n.posts.length > 0)?.id || initialNews[0]?.id || ""
  );
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "curated" | "approved">("all");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [scoreFilter, setScoreFilter] = useState<"all" | "high" | "medium">("all");
  const [isBrandModalOpen, setIsBrandModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const toast = useToast();

  // Notícia atualmente selecionada no Studio
  const selectedNews = useMemo(() => {
    return initialNews.find((n) => n.id === selectedId) || initialNews[0] || null;
  }, [initialNews, selectedId]);

  // Filtro da lista de notícias
  const filteredNews = useMemo(() => {
    return initialNews.filter((item) => {
      const matchesSearch =
        item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (item.summary && item.summary.toLowerCase().includes(searchTerm.toLowerCase()));

      if (!matchesSearch) return false;

      const hasCurated = item.posts.length > 0;
      const isApproved = item.posts.some((p) => p.status === "APPROVED");

      if (statusFilter === "curated" && !hasCurated) return false;
      if (statusFilter === "approved" && !isApproved) return false;

      if (categoryFilter !== "all") {
        const itemCat = item.posts[0]?.category || item.source?.category || "";
        if (!itemCat.toLowerCase().includes(categoryFilter.toLowerCase())) return false;
      }

      if (scoreFilter === "high") {
        const score = item.posts[0]?.score || 0;
        if (score < 8.0) return false;
      } else if (scoreFilter === "medium") {
        const score = item.posts[0]?.score || 0;
        if (score < 6.0) return false;
      }

      return true;
    });
  }, [initialNews, searchTerm, statusFilter, categoryFilter, scoreFilter]);

  const curated = selectedNews?.posts[0] || null;

  const handleCurate = (newsId: string) => {
    startTransition(async () => {
      toast.info("Processando com IA...", "Criando carrossel de lâminas visuais e legenda.");
      const res = await curateNewsAction(newsId);
      if (res.success) {
        toast.success(
          "Carrossel gerado com sucesso!",
          `Nota de relevância: ${res.aiResult?.score.toFixed(1)}/10`
        );
      } else {
        toast.error("Erro na geração", res.error);
      }
    });
  };

  const handleStatusChange = (postId: string, newStatus: "REVIEW" | "APPROVED" | "ARCHIVED") => {
    startTransition(async () => {
      const res = await updatePostStatusAction(postId, newStatus);
      if (res.success) {
        if (newStatus === "APPROVED") {
          toast.success("Post Aprovado!", "Marcado como pronto para postagem no feed.");
        } else {
          toast.info("Status alterado", "Post retornado para revisão.");
        }
      }
    });
  };

  const handleDeleteNews = (newsId: string, e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (!confirm("Tem certeza que deseja excluir esta matéria do feed?")) return;
    startTransition(async () => {
      const res = await deleteNewsAction(newsId);
      if (res.success) {
        toast.success("Matéria excluída", "A notícia foi removida do feed.");
        if (selectedId === newsId) {
          const next = initialNews.find((n) => n.id !== newsId);
          if (next) setSelectedId(next.id);
        }
      }
    });
  };

  const handleDeleteCuratedPost = (postId: string) => {
    if (!confirm("Deseja descartar o carrossel gerado para esta matéria?")) return;
    startTransition(async () => {
      const res = await deleteCuratedPostAction(postId);
      if (res.success) {
        toast.info("Carrossel descartado", "A matéria retornou ao estado de rascunho.");
      }
    });
  };

  // Parse dos slides do post selecionado
  let parsedSlides: CarouselSlide[] = [];
  if (curated?.slidesJson) {
    try {
      parsedSlides = JSON.parse(curated.slidesJson);
    } catch {
      parsedSlides = [];
    }
  }

  // Fallback caso não haja slides gravados ainda
  if (parsedSlides.length === 0 && curated && selectedNews) {
    parsedSlides = [
      {
        slideNumber: 1,
        badge: "RADAR FINPULSE",
        title: selectedNews.title.slice(0, 65),
        description: selectedNews.summary || "Entenda o que aconteceu e como isso afeta seus investimentos.",
        highlightText: "Análise Rápida 📊",
        footer: "@finpulse.ai • Deslize 👉",
      },
      {
        slideNumber: 2,
        badge: "O QUE FAZER",
        title: "Impacto no Seu Bolso",
        description: curated.reasoning || "Acompanhe os fundamentos antes de tomar qualquer decisão.",
        highlightText: "Mantenha o foco 🛡️",
        footer: "Salve para consultar 📌",
      },
    ];
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
      {/* ============================================================ */}
      {/* PAINEL DA ESQUERDA: Feed de Notícias & Triagem (4 colunas)   */}
      {/* ============================================================ */}
      <div className="lg:col-span-4 flex flex-col space-y-3">
        {/* Ações Rápidas: Nova Pauta & Configurar Marca */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold shadow-xs transition-colors cursor-pointer"
          >
            <PenTool className="w-3.5 h-3.5" />
            <span>+ Nova Pauta</span>
          </button>
          <button
            onClick={() => setIsBrandModalOpen(true)}
            className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 hover:bg-slate-50 dark:hover:bg-zinc-800 text-slate-700 dark:text-zinc-300 text-xs font-medium transition-colors cursor-pointer shadow-2xs"
            title="Personalizar @ do Instagram e Marca"
          >
            <Tag className="w-3.5 h-3.5 text-emerald-500" />
            <span>Marca</span>
          </button>
        </div>

        {/* Barra de Busca e Filtros */}
        <div className="p-3 bg-white dark:bg-zinc-900/60 border border-slate-200 dark:border-zinc-800 rounded-xl space-y-2.5 shadow-2xs">
          {/* Campo de Busca */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-400 dark:text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Buscar matéria..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-slate-50 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 rounded-lg pl-8 pr-3 py-1.5 text-xs text-slate-900 dark:text-zinc-100 placeholder-slate-400 dark:placeholder-zinc-500 focus:outline-none focus:border-emerald-500"
            />
          </div>

          {/* Abas Rápidas de Status */}
          <div className="flex items-center justify-between gap-1 text-xs">
            <div className="flex items-center gap-1">
              <button
                onClick={() => setStatusFilter("all")}
                className={`px-2.5 py-1 rounded-md text-[11px] font-medium transition-colors cursor-pointer ${
                  statusFilter === "all"
                    ? "bg-slate-900 text-white dark:bg-zinc-100 dark:text-zinc-900 font-semibold"
                    : "text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-zinc-200"
                }`}
              >
                Todas ({initialNews.length})
              </button>
              <button
                onClick={() => setStatusFilter("curated")}
                className={`px-2.5 py-1 rounded-md text-[11px] font-medium transition-colors cursor-pointer flex items-center gap-1 ${
                  statusFilter === "curated"
                    ? "bg-emerald-600 text-white font-semibold"
                    : "text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-zinc-200"
                }`}
              >
                <Sparkles className="w-3 h-3" />
                <span>Prontos</span>
              </button>
              <button
                onClick={() => setStatusFilter("approved")}
                className={`px-2.5 py-1 rounded-md text-[11px] font-medium transition-colors cursor-pointer flex items-center gap-1 ${
                  statusFilter === "approved"
                    ? "bg-emerald-600 text-white font-semibold"
                    : "text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-zinc-200"
                }`}
              >
                <CheckCircle2 className="w-3 h-3" />
                <span>Aprovados</span>
              </button>
            </div>
          </div>

          {/* Segunda Linha de Filtros: Categoria & Nota IA */}
          <div className="flex items-center gap-1.5 pt-2 border-t border-slate-100 dark:border-zinc-800/60">
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="flex-1 bg-slate-50 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 text-[11px] text-slate-700 dark:text-zinc-300 rounded-md px-2 py-1 focus:outline-none cursor-pointer"
            >
              <option value="all">Todas as Categorias</option>
              <option value="macro">Macroeconomia</option>
              <option value="acoes">Ações & B3</option>
              <option value="fii">FIIs</option>
              <option value="cripto">Cripto</option>
            </select>

            <select
              value={scoreFilter}
              onChange={(e) => setScoreFilter(e.target.value as any)}
              className="flex-1 bg-slate-50 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 text-[11px] text-slate-700 dark:text-zinc-300 rounded-md px-2 py-1 focus:outline-none cursor-pointer"
            >
              <option value="all">Todas as Notas</option>
              <option value="high">🔥 8.0+ Alta Relevância</option>
              <option value="medium">⚡ 6.0+ Relevantes</option>
            </select>
          </div>
        </div>

        {/* Lista Compacta de Notícias */}
        <div className="space-y-2 max-h-[calc(100vh-210px)] overflow-y-auto pr-1">
          {filteredNews.length === 0 ? (
            <div className="p-8 text-center border border-dashed border-slate-200 dark:border-zinc-800 rounded-xl bg-white dark:bg-zinc-900/30">
              <Inbox className="w-6 h-6 text-slate-400 dark:text-zinc-600 mx-auto mb-2" />
              <p className="text-xs text-slate-500 dark:text-zinc-400">Nenhuma matéria encontrada com esses filtros.</p>
            </div>
          ) : (
            filteredNews.map((news) => {
              const isSelected = news.id === selectedId;
              const hasCurated = news.posts.length > 0;
              const post = news.posts[0];
              const score = post?.score || 0;

              return (
                <div
                  key={news.id}
                  onClick={() => setSelectedId(news.id)}
                  className={`group p-3 rounded-xl border transition-all cursor-pointer select-none text-left relative ${
                    isSelected
                      ? "bg-white dark:bg-zinc-900 border-emerald-500 shadow-sm ring-1 ring-emerald-500/30"
                      : "bg-white/80 dark:bg-zinc-900/40 hover:bg-white dark:hover:bg-zinc-900/80 border-slate-200 dark:border-zinc-800/80"
                  }`}
                >
                  <div className="flex items-center justify-between gap-2 mb-1.5">
                    <div className="flex items-center gap-1.5">
                      <span className="text-[10px] font-semibold text-slate-600 dark:text-zinc-400 bg-slate-100 dark:bg-zinc-800 px-1.5 py-0.5 rounded">
                        {news.source?.name || "Fonte"}
                      </span>
                      {hasCurated && (
                        <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/40 px-1.5 py-0.5 rounded flex items-center gap-0.5">
                          <Sparkles className="w-2.5 h-2.5" />
                          <span>{score.toFixed(1)}</span>
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-1">
                      <span className="text-[10px] text-slate-400 dark:text-zinc-500">
                        {news.pubDate
                          ? new Date(news.pubDate).toLocaleDateString("pt-BR", {
                              day: "2-digit",
                              month: "short",
                            })
                          : "Recente"}
                      </span>
                      <button
                        onClick={(e) => handleDeleteNews(news.id, e)}
                        title="Excluir notícia do feed"
                        className="opacity-0 group-hover:opacity-100 hover:text-rose-500 text-slate-400 p-0.5 transition-opacity rounded cursor-pointer"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  </div>

                  <h3
                    className={`text-xs font-semibold leading-snug line-clamp-2 ${
                      isSelected
                        ? "text-emerald-950 dark:text-white"
                        : "text-slate-800 dark:text-zinc-200"
                    }`}
                  >
                    {news.title}
                  </h3>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* ============================================================ */}
      {/* PAINEL DA DIREITA: Estúdio de Criação do Carrossel (8 colunas) */}
      {/* ============================================================ */}
      <div className="lg:col-span-8 flex flex-col space-y-4">
        {selectedNews ? (
          <div className="bg-white dark:bg-zinc-900/80 border border-slate-200 dark:border-zinc-800 rounded-2xl p-6 shadow-sm transition-colors">
            {/* Header da Notícia Ativa */}
            <div className="pb-5 mb-6 border-b border-slate-200 dark:border-zinc-800/80">
              <div className="flex flex-wrap items-center justify-between gap-3 mb-2">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold px-2.5 py-0.5 rounded-md bg-slate-100 dark:bg-zinc-800 text-slate-700 dark:text-zinc-300 border border-slate-200 dark:border-zinc-700">
                    {selectedNews.source?.name || "Fonte"}
                  </span>
                  <span className="text-xs text-slate-400 dark:text-zinc-500 flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {selectedNews.pubDate
                      ? new Date(selectedNews.pubDate).toLocaleDateString("pt-BR", {
                          day: "2-digit",
                          month: "long",
                          hour: "2-digit",
                          minute: "2-digit",
                        })
                      : "Recente"}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  {curated && (
                    <>
                      <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
                        ★ Relevância: {curated.score.toFixed(1)}/10
                      </span>
                      <span
                        className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${
                          curated.status === "APPROVED"
                            ? "bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-700"
                            : "bg-purple-100 dark:bg-purple-950/50 text-purple-800 dark:text-purple-300 border border-purple-200 dark:border-purple-800"
                        }`}
                      >
                        {curated.status === "APPROVED" ? "Aprovado" : "Pronto p/ Instagram"}
                      </span>
                    </>
                  )}
                  <button
                    onClick={() => handleDeleteNews(selectedNews.id)}
                    disabled={isPending}
                    className="text-xs text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 flex items-center gap-1 transition-colors px-2 py-1 rounded-md border border-slate-200 dark:border-zinc-800 hover:bg-slate-50 dark:hover:bg-zinc-800 cursor-pointer"
                    title="Excluir matéria completamente do banco"
                  >
                    <Trash2 className="w-3 h-3" />
                    <span className="hidden sm:inline">Excluir</span>
                  </button>
                </div>
              </div>

              <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-zinc-100 leading-snug">
                <a
                  href={selectedNews.link}
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors inline-flex items-center gap-1.5 group"
                >
                  <span>{selectedNews.title}</span>
                  <ExternalLink className="w-4 h-4 text-slate-400 group-hover:text-emerald-500 shrink-0" />
                </a>
              </h2>

              {selectedNews.summary && (
                <p className="text-xs text-slate-600 dark:text-zinc-400 mt-2 leading-relaxed">
                  {selectedNews.summary}
                </p>
              )}
            </div>

            {/* Conteúdo do Estúdio: Sem Carrossel vs Com Carrossel */}
            {!curated ? (
              <div className="py-16 text-center flex flex-col items-center justify-center border border-dashed border-slate-200 dark:border-zinc-800 rounded-xl bg-slate-50/50 dark:bg-zinc-950/30">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-pink-600 to-amber-500 flex items-center justify-center mb-3 shadow-md shadow-pink-500/20 text-white">
                  <InstagramIcon className="w-6 h-6" />
                </div>
                <h3 className="text-sm font-bold text-slate-800 dark:text-zinc-200">
                  Carrossel do Instagram não gerado
                </h3>
                <p className="text-xs text-slate-500 dark:text-zinc-400 max-w-sm mt-1 mb-5">
                  A IA transformará esta notícia em um carrossel de 4 a 5 lâminas visuais e uma legenda pronta para o feed.
                </p>
                <button
                  onClick={() => handleCurate(selectedNews.id)}
                  disabled={isPending}
                  className="flex items-center gap-2 text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white px-5 py-2.5 rounded-xl shadow-xs transition-all cursor-pointer"
                >
                  <Sparkles className={`w-4 h-4 ${isPending ? "animate-spin" : ""}`} />
                  <span>{isPending ? "Criando Carrossel com IA..." : "Criar Carrossel com IA"}</span>
                </button>
              </div>
            ) : (
              <div className="space-y-6">
                {/* Diagnóstico da IA */}
                {curated.reasoning && (
                  <div className="bg-slate-50 dark:bg-zinc-950/70 border border-slate-200 dark:border-zinc-800/80 p-3.5 rounded-xl">
                    <div className="text-[11px] font-bold text-emerald-700 dark:text-emerald-400 flex items-center gap-1.5 mb-1">
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Diagnóstico FinPulse AI ({curated.category || "Finanças"}):</span>
                    </div>
                    <p className="text-xs text-slate-700 dark:text-zinc-300 italic">{curated.reasoning}</p>
                  </div>
                )}

                {/* Estúdio de Slides & Legenda */}
                <InstagramSlideView
                  key={selectedNews.id}
                  slides={parsedSlides}
                  caption={curated.instagramCaption || ""}
                  category={curated.category}
                  postId={curated.id}
                />

                {/* Rodapé de Ações do Post */}
                <div className="flex items-center justify-between pt-4 border-t border-slate-200 dark:border-zinc-800">
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => handleCurate(selectedNews.id)}
                      disabled={isPending}
                      className="text-xs text-slate-500 hover:text-emerald-600 dark:text-zinc-400 dark:hover:text-emerald-400 flex items-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <RotateCcw className={`w-3.5 h-3.5 ${isPending ? "animate-spin" : ""}`} />
                      <span>Regenerar</span>
                    </button>

                    <button
                      onClick={() => handleDeleteCuratedPost(curated.id)}
                      disabled={isPending}
                      className="text-xs text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 flex items-center gap-1 transition-colors cursor-pointer"
                      title="Excluir o carrossel gerado e voltar ao estado de rascunho"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Descartar</span>
                    </button>
                  </div>

                  <div className="flex items-center gap-2">
                    {curated.status !== "APPROVED" ? (
                      <button
                        onClick={() => handleStatusChange(curated.id, "APPROVED")}
                        disabled={isPending}
                        className="flex items-center gap-1.5 text-xs font-semibold bg-emerald-600/15 hover:bg-emerald-600/25 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-500/40 px-3.5 py-1.5 rounded-lg transition-all cursor-pointer"
                      >
                        <CheckCircle className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                        <span>Aprovar Post</span>
                      </button>
                    ) : (
                      <button
                        onClick={() => handleStatusChange(curated.id, "REVIEW")}
                        disabled={isPending}
                        className="text-xs text-slate-500 hover:text-slate-700 dark:text-zinc-400 dark:hover:text-zinc-200 px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-zinc-800 cursor-pointer"
                      >
                        Voltar para Rascunho
                      </button>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="py-24 text-center border border-dashed border-slate-200 dark:border-zinc-800 rounded-2xl bg-white dark:bg-zinc-900/40">
            <p className="text-xs text-slate-500 dark:text-zinc-400">Selecione uma matéria à esquerda para abrir o Estúdio.</p>
          </div>
        )}
      </div>

      {/* Modais Globais */}
      <BrandSettingsModal
        isOpen={isBrandModalOpen}
        onClose={() => setIsBrandModalOpen(false)}
      />

      <CreateManualNewsModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onCreated={(newId) => setSelectedId(newId)}
      />
    </div>
  );
}
