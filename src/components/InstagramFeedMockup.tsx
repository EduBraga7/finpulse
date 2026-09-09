"use client";

import { useState } from "react";
import {
  Heart,
  MessageCircle,
  Send,
  Bookmark,
  MoreHorizontal,
  ChevronLeft,
  ChevronRight,
  Music2,
  CheckCircle,
} from "lucide-react";
import { CarouselSlide } from "@/lib/gemini";
import { SlideTheme, AspectRatio } from "./InstagramSlideView";
import { useBrandSettings } from "./BrandSettingsModal";

interface InstagramFeedMockupProps {
  slides: CarouselSlide[];
  caption: string;
  theme: SlideTheme;
  aspectRatio: AspectRatio;
  category?: string | null;
}

export function InstagramFeedMockup({
  slides,
  caption,
  theme,
  aspectRatio,
  category,
}: InstagramFeedMockupProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLiked, setIsLiked] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [likesCount, setLikesCount] = useState(1482);
  const [isCaptionExpanded, setIsCaptionExpanded] = useState(false);
  const { brand } = useBrandSettings();

  if (!slides || slides.length === 0) return null;

  const currentSlide = slides[currentIndex] || slides[0];

  const handleLike = () => {
    if (isLiked) {
      setIsLiked(false);
      setLikesCount((prev) => prev - 1);
    } else {
      setIsLiked(true);
      setLikesCount((prev) => prev + 1);
    }
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % slides.length);
  };

  return (
    <div className="flex justify-center w-full py-4">
      {/* Moldura do Post do Instagram (Estilo Mobile) */}
      <div className="w-full max-w-[420px] bg-white dark:bg-black border border-slate-200 dark:border-zinc-800 rounded-3xl overflow-hidden shadow-2xl transition-all">
        {/* Topo do Post: Perfil & Menu */}
        <div className="p-3.5 flex items-center justify-between border-b border-slate-100 dark:border-zinc-900">
          <div className="flex items-center gap-2.5">
            {/* Avatar com Anel Gradiente dos Stories */}
            <div className="w-9 h-9 rounded-full p-[2px] bg-gradient-to-tr from-amber-500 via-rose-500 to-purple-600">
              <div className="w-full h-full rounded-full bg-white dark:bg-zinc-900 flex items-center justify-center font-black text-[11px] text-emerald-500">
                {brand.initials}
              </div>
            </div>

            <div>
              <div className="flex items-center gap-1">
                <span className="text-xs font-bold text-slate-900 dark:text-zinc-100">
                  {brand.handle.replace("@", "")}
                </span>
                <span className="w-1 h-1 rounded-full bg-slate-400" />
                <span className="text-[11px] font-semibold text-sky-500">Seguir</span>
              </div>
              <div className="flex items-center gap-1 text-[10px] text-slate-500 dark:text-zinc-400">
                <Music2 className="w-2.5 h-2.5" />
                <span>Áudio original • Mercado Financeiro</span>
              </div>
            </div>
          </div>

          <button className="text-slate-400 hover:text-slate-600 dark:hover:text-zinc-200 p-1">
            <MoreHorizontal className="w-4 h-4" />
          </button>
        </div>

        {/* Área do Slide (Carrossel Interativo) */}
        <div className="relative w-full overflow-hidden select-none bg-zinc-950">
          <div
            className={`w-full ${
              aspectRatio === "4:5" ? "aspect-[4/5]" : "aspect-square"
            } bg-gradient-to-br from-zinc-900 via-zinc-950 to-emerald-950/70 p-6 flex flex-col justify-between relative`}
          >
            {/* Topo do Slide Mockup */}
            <div className="flex items-center justify-between z-10">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-lg bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center font-black text-[10px] text-emerald-400">
                  {brand.initials}
                </div>
                <span className="text-[11px] font-bold tracking-wider text-zinc-300">
                  {brand.brandName}
                </span>
              </div>

              <span className="text-[10px] font-semibold bg-black/40 text-zinc-300 px-2 py-0.5 rounded-full border border-white/10">
                {currentIndex + 1}/{slides.length}
              </span>
            </div>

            {/* Centro do Slide Mockup */}
            <div className="my-auto py-2 z-10 space-y-2.5">
              <div className="inline-block">
                <span className="text-[9px] font-extrabold uppercase tracking-widest px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  {currentSlide.badge || category || "FINANÇAS"}
                </span>
              </div>
              <h4 className="text-base font-extrabold text-white leading-snug">
                {currentSlide.title}
              </h4>
              {currentSlide.highlightText && (
                <div className="bg-zinc-900/90 border border-emerald-500/30 px-2.5 py-1 rounded inline-block">
                  <span className="text-[11px] font-bold text-emerald-300">
                    {currentSlide.highlightText}
                  </span>
                </div>
              )}
              <p className="text-xs text-zinc-300 leading-relaxed">
                {currentSlide.description}
              </p>
            </div>

            {/* Rodapé do Slide Mockup */}
            <div className="flex items-center justify-between pt-2 border-t border-zinc-800/80 z-10 text-[10px] text-zinc-400">
              <span>{brand.handle}</span>
              <span className="text-emerald-400 font-semibold">
                {currentIndex === slides.length - 1 ? "Salve este post 📌" : "Deslize 👉"}
              </span>
            </div>

            {/* Botões de Navegação Flutuantes no Slide */}
            <button
              onClick={handlePrev}
              className="absolute left-2 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-black/50 hover:bg-black/80 text-white flex items-center justify-center transition-all z-20 cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={handleNext}
              className="absolute right-2 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-black/50 hover:bg-black/80 text-white flex items-center justify-center transition-all z-20 cursor-pointer"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Barra de Ações: Curtir, Comentar, Enviar, Salvar */}
        <div className="p-3.5 space-y-2.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3.5">
              <button
                onClick={handleLike}
                className="transition-transform active:scale-125 cursor-pointer"
              >
                <Heart
                  className={`w-6 h-6 ${
                    isLiked
                      ? "fill-rose-500 text-rose-500"
                      : "text-slate-800 dark:text-zinc-200"
                  }`}
                />
              </button>
              <button className="text-slate-800 dark:text-zinc-200 cursor-pointer">
                <MessageCircle className="w-6 h-6" />
              </button>
              <button className="text-slate-800 dark:text-zinc-200 cursor-pointer">
                <Send className="w-5 h-5" />
              </button>
            </div>

            {/* Pontos de Paginação Centralizados */}
            <div className="flex gap-1">
              {slides.map((_, i) => (
                <span
                  key={i}
                  className={`w-1.5 h-1.5 rounded-full transition-all ${
                    i === currentIndex
                      ? "w-3 bg-sky-500"
                      : "bg-slate-300 dark:bg-zinc-700"
                  }`}
                />
              ))}
            </div>

            <button
              onClick={() => setIsSaved(!isSaved)}
              className="transition-transform active:scale-125 cursor-pointer"
            >
              <Bookmark
                className={`w-6 h-6 ${
                  isSaved
                    ? "fill-slate-900 dark:fill-white text-slate-900 dark:text-white"
                    : "text-slate-800 dark:text-zinc-200"
                }`}
              />
            </button>
          </div>

          {/* Contagem de Curtidas */}
          <div className="text-xs font-bold text-slate-900 dark:text-zinc-100">
            {likesCount.toLocaleString("pt-BR")} curtidas
          </div>

          {/* Legenda do Feed com Expandir/Recolher */}
          <div className="text-xs leading-relaxed text-slate-800 dark:text-zinc-200">
            <span className="font-bold text-slate-900 dark:text-zinc-100 mr-1.5">
              {brand.handle.replace("@", "")}
            </span>
            {isCaptionExpanded ? (
              <span className="whitespace-pre-line">{caption}</span>
            ) : (
              <span>
                {caption.slice(0, 95)}...
                <button
                  onClick={() => setIsCaptionExpanded(true)}
                  className="text-slate-500 dark:text-zinc-400 ml-1 font-semibold hover:underline cursor-pointer"
                >
                  mais
                </button>
              </span>
            )}
          </div>

          {isCaptionExpanded && (
            <button
              onClick={() => setIsCaptionExpanded(false)}
              className="text-[11px] text-slate-400 dark:text-zinc-500 font-medium hover:underline cursor-pointer"
            >
              Recolher legenda
            </button>
          )}

          <div className="text-[11px] text-slate-400 dark:text-zinc-500">
            Ver todos os 48 comentários
          </div>
          <div className="text-[10px] text-slate-400 uppercase tracking-wider">
            Há 2 horas
          </div>
        </div>
      </div>
    </div>
  );
}
