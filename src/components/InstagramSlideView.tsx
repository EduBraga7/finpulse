"use client";

import { useState, useRef, useEffect, useTransition } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Download,
  Copy,
  Check,
  Edit3,
  Save,
  Package,
  Sparkles,
  Palette,
  Smartphone,
  Square,
  Eye,
  SlidersHorizontal,
  Flame,
  Binary,
  Scissors,
} from "lucide-react";
import { toPng } from "html-to-image";
import JSZip from "jszip";
import { CarouselSlide } from "@/lib/gemini";
import { InstagramIcon } from "./InstagramIcon";
import { useToast } from "./Toast";
import { useBrandSettings } from "./BrandSettingsModal";
import { InstagramFeedMockup } from "./InstagramFeedMockup";
import { adjustPostToneAction } from "@/app/actions/news";

export type SlideTheme = "emerald" | "navy" | "gold" | "clean" | "ruby";
export type AspectRatio = "1:1" | "4:5";

export const THEMES: Record<
  SlideTheme,
  {
    name: string;
    label: string;
    bgClass: string;
    borderClass: string;
    badgeClass: string;
    titleClass: string;
    highlightClass: string;
    highlightTextClass: string;
    descClass: string;
    footerBorderClass: string;
    footerTextClass: string;
    actionTextClass: string;
    logoBoxClass: string;
    logoTextClass: string;
    glow1: string;
    glow2: string;
    dotColor: string;
  }
> = {
  emerald: {
    name: "B3 Emerald",
    label: "Mercado & B3",
    bgClass: "bg-gradient-to-br from-zinc-950 via-zinc-900 to-emerald-950/70",
    borderClass: "border-zinc-800",
    badgeClass: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30",
    titleClass: "text-white",
    highlightClass: "bg-zinc-900/90 border-emerald-500/30",
    highlightTextClass: "text-emerald-300",
    descClass: "text-zinc-300",
    footerBorderClass: "border-zinc-800/80",
    footerTextClass: "text-zinc-400",
    actionTextClass: "text-emerald-400",
    logoBoxClass: "bg-emerald-500/20 border-emerald-500/40 text-emerald-400",
    logoTextClass: "text-emerald-400",
    glow1: "bg-emerald-500/15",
    glow2: "bg-teal-500/10",
    dotColor: "bg-emerald-500",
  },
  navy: {
    name: "Deep Navy",
    label: "Macro & Juros",
    bgClass: "bg-gradient-to-br from-slate-950 via-slate-900 to-sky-950/70",
    borderClass: "border-slate-800",
    badgeClass: "bg-sky-500/15 text-sky-400 border-sky-500/30",
    titleClass: "text-white",
    highlightClass: "bg-slate-900/90 border-sky-500/30",
    highlightTextClass: "text-sky-300",
    descClass: "text-slate-300",
    footerBorderClass: "border-slate-800/80",
    footerTextClass: "text-slate-400",
    actionTextClass: "text-sky-400",
    logoBoxClass: "bg-sky-500/20 border-sky-500/40 text-sky-400",
    logoTextClass: "text-sky-400",
    glow1: "bg-sky-500/15",
    glow2: "bg-indigo-500/10",
    dotColor: "bg-sky-500",
  },
  gold: {
    name: "Gold Wealth",
    label: "FIIs & Dividendos",
    bgClass: "bg-gradient-to-br from-stone-950 via-stone-900 to-amber-950/60",
    borderClass: "border-stone-800",
    badgeClass: "bg-amber-500/15 text-amber-400 border-amber-500/30",
    titleClass: "text-white",
    highlightClass: "bg-stone-900/90 border-amber-500/30",
    highlightTextClass: "text-amber-300",
    descClass: "text-stone-300",
    footerBorderClass: "border-stone-800/80",
    footerTextClass: "text-stone-400",
    actionTextClass: "text-amber-400",
    logoBoxClass: "bg-amber-500/20 border-amber-500/40 text-amber-400",
    logoTextClass: "text-amber-400",
    glow1: "bg-amber-500/15",
    glow2: "bg-yellow-500/10",
    dotColor: "bg-amber-500",
  },
  clean: {
    name: "Editorial Clean",
    label: "Modo Claro",
    bgClass: "bg-gradient-to-br from-stone-50 via-white to-slate-100",
    borderClass: "border-slate-300 shadow-lg shadow-slate-200/50",
    badgeClass: "bg-slate-900 text-white border-slate-800",
    titleClass: "text-slate-900",
    highlightClass: "bg-emerald-50 border-emerald-300",
    highlightTextClass: "text-emerald-800",
    descClass: "text-slate-700",
    footerBorderClass: "border-slate-200",
    footerTextClass: "text-slate-500",
    actionTextClass: "text-slate-900 font-bold",
    logoBoxClass: "bg-slate-900 border-slate-700 text-emerald-400",
    logoTextClass: "text-slate-900",
    glow1: "bg-emerald-200/40",
    glow2: "bg-slate-200/40",
    dotColor: "bg-slate-900",
  },
  ruby: {
    name: "Breaking Ruby",
    label: "Alerta Urgente",
    bgClass: "bg-gradient-to-br from-zinc-950 via-zinc-900 to-rose-950/70",
    borderClass: "border-zinc-800",
    badgeClass: "bg-rose-500/15 text-rose-400 border-rose-500/30",
    titleClass: "text-white",
    highlightClass: "bg-zinc-900/90 border-rose-500/30",
    highlightTextClass: "text-rose-300",
    descClass: "text-zinc-300",
    footerBorderClass: "border-zinc-800/80",
    footerTextClass: "text-zinc-400",
    actionTextClass: "text-rose-400",
    logoBoxClass: "bg-rose-500/20 border-rose-500/40 text-rose-400",
    logoTextClass: "text-rose-400",
    glow1: "bg-rose-500/15",
    glow2: "bg-red-500/10",
    dotColor: "bg-rose-500",
  },
};

interface InstagramSlideViewProps {
  slides: CarouselSlide[];
  caption: string;
  category?: string | null;
  postId?: string;
}

export function InstagramSlideView({
  slides: initialSlides,
  caption: initialCaption,
  category,
  postId,
}: InstagramSlideViewProps) {
  const [slides, setSlides] = useState<CarouselSlide[]>(initialSlides);
  const [caption, setCaption] = useState<string>(initialCaption);
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [selectedTheme, setSelectedTheme] = useState<SlideTheme>("emerald");
  const [aspectRatio, setAspectRatio] = useState<AspectRatio>("1:1");
  const [viewMode, setViewMode] = useState<"studio" | "feed">("studio");
  const [isDownloading, setIsDownloading] = useState(false);
  const [isDownloadingZip, setIsDownloadingZip] = useState(false);
  const [copiedCaption, setCopiedCaption] = useState(false);
  const [isEditingSlide, setIsEditingSlide] = useState(false);
  const [isAdjustingTone, startToneTransition] = useTransition();

  const toast = useToast();
  const { brand } = useBrandSettings();
  const slideRef = useRef<HTMLDivElement>(null);
  const offscreenRefs = useRef<(HTMLDivElement | null)[]>([]);

  const themeConfig = THEMES[selectedTheme];

  // Sincronizar slides quando a notícia selecionada mudar
  useEffect(() => {
    setSlides(initialSlides);
    setCurrentSlideIndex(0);
    setIsEditingSlide(false);
  }, [initialSlides]);

  // Sincronizar legenda quando a notícia selecionada mudar
  useEffect(() => {
    setCaption(initialCaption);
    setCopiedCaption(false);
  }, [initialCaption]);

  // Navegação por setas do teclado (← e →)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        isEditingSlide ||
        document.activeElement?.tagName === "TEXTAREA" ||
        document.activeElement?.tagName === "INPUT"
      ) {
        return;
      }
      if (e.key === "ArrowLeft") handlePrev();
      if (e.key === "ArrowRight") handleNext();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isEditingSlide, slides.length]);

  if (!slides || slides.length === 0) {
    return (
      <div className="p-6 text-center text-xs text-zinc-500">
        Nenhum slide gerado ainda.
      </div>
    );
  }

  const currentSlide = slides[currentSlideIndex] || slides[0];

  const handleNext = () => {
    setCurrentSlideIndex((prev) => (prev + 1) % slides.length);
  };

  const handlePrev = () => {
    setCurrentSlideIndex((prev) => (prev - 1 + slides.length) % slides.length);
  };

  // Ajuste de Tom com IA
  const handleAdjustTone = (tone: "viral" | "technical" | "concise") => {
    if (!postId) {
      toast.info("Aviso", "Ajuste de tom disponível após salvar ou selecionar o post.");
      return;
    }

    startToneTransition(async () => {
      toast.info("Ajustando tom com IA...", "Reescrevendo lâminas e legenda.");
      const res = await adjustPostToneAction(postId, tone);
      if (res.success && res.slides) {
        setSlides(res.slides);
        if (res.instagramCaption) setCaption(res.instagramCaption);
        toast.success(
          "Tom atualizado!",
          `Carrossel adaptado para o tom ${tone === "viral" ? "Viral" : tone === "technical" ? "Técnico" : "Direto ao Ponto"}.`
        );
      } else {
        toast.error("Erro ao ajustar tom", res.error);
      }
    });
  };

  // Baixar o slide ativo em PNG
  const handleDownloadCurrentSlide = async () => {
    if (!slideRef.current) return;
    try {
      setIsDownloading(true);
      const dataUrl = await toPng(slideRef.current, {
        cacheBust: true,
        pixelRatio: 2,
      });
      const link = document.createElement("a");
      link.download = `instagram-slide-${currentSlideIndex + 1}-${selectedTheme}.png`;
      link.href = dataUrl;
      link.click();
      toast.success(
        `Slide ${currentSlideIndex + 1} exportado!`,
        `Formato ${aspectRatio} com a assinatura ${brand.handle}.`
      );
    } catch (err) {
      console.error("Erro ao exportar imagem do slide:", err);
      toast.error("Erro na exportação", "Não foi possível gerar a imagem.");
    } finally {
      setIsDownloading(false);
    }
  };

  // Baixar TODOS os slides em um arquivo ZIP com a legenda inclusa
  const handleDownloadAllZip = async () => {
    try {
      setIsDownloadingZip(true);
      const zip = new JSZip();

      for (let i = 0; i < slides.length; i++) {
        const el = offscreenRefs.current[i];
        if (el) {
          const dataUrl = await toPng(el, {
            cacheBust: true,
            pixelRatio: 1,
          });
          const base64Data = dataUrl.replace(/^data:image\/png;base64,/, "");
          zip.file(`slide-${i + 1}.png`, base64Data, { base64: true });
        }
      }

      zip.file("legenda.txt", caption);

      const blob = await zip.generateAsync({ type: "blob" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.download = `carrossel-${brand.handle.replace("@", "")}-${selectedTheme}-${aspectRatio.replace(":", "x")}.zip`;
      link.href = url;
      link.click();
      URL.revokeObjectURL(url);

      toast.success(
        "Carrossel completo baixado!",
        `Arquivo .ZIP com ${slides.length} lâminas e legenda.txt pronto para o Instagram.`
      );
    } catch (err) {
      console.error("Erro ao gerar arquivo ZIP do carrossel:", err);
      toast.error("Erro na compactação", "Falha ao gerar o arquivo ZIP.");
    } finally {
      setIsDownloadingZip(false);
    }
  };

  // Copiar legenda formatada
  const handleCopyCaption = () => {
    if (!caption) return;
    navigator.clipboard.writeText(caption);
    setCopiedCaption(true);
    toast.success("Legenda copiada!", "Pronta para colar no Instagram com quebras e hashtags.");
    setTimeout(() => setCopiedCaption(false), 2500);
  };

  // Atualizar campo do slide em edição
  const updateCurrentSlide = (field: keyof CarouselSlide, value: string) => {
    const updated = [...slides];
    updated[currentSlideIndex] = {
      ...updated[currentSlideIndex],
      [field]: value,
    };
    setSlides(updated);
  };

  // Métricas da legenda
  const charCount = caption.length;
  const hashtagCount = (caption.match(/#[\w\u00C0-\u017F]+/g) || []).length;

  return (
    <div className="space-y-4">
      {/* ============================================================ */}
      {/* BARRA DE CONTROLE: Modo de Exibição, Temas & Proporção       */}
      {/* ============================================================ */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3 bg-slate-50 dark:bg-zinc-950/60 border border-slate-200 dark:border-zinc-800/80 rounded-xl">
        {/* Alternador de Modo: Estúdio vs Feed Mockup */}
        <div className="flex items-center gap-1 bg-white dark:bg-zinc-900 p-1 rounded-lg border border-slate-200 dark:border-zinc-800">
          <button
            onClick={() => setViewMode("studio")}
            className={`px-2.5 py-1 rounded-md text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
              viewMode === "studio"
                ? "bg-emerald-600 text-white shadow-2xs"
                : "text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-zinc-200"
            }`}
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
            <span>Estúdio de Criação</span>
          </button>
          <button
            onClick={() => setViewMode("feed")}
            className={`px-2.5 py-1 rounded-md text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
              viewMode === "feed"
                ? "bg-emerald-600 text-white shadow-2xs"
                : "text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-zinc-200"
            }`}
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Prévia Feed Mobile</span>
          </button>
        </div>

        {/* Seletor de Temas de Cores */}
        <div className="flex items-center gap-1.5">
          <div className="flex items-center gap-1 text-[11px] font-semibold text-slate-500 dark:text-zinc-400 mr-1">
            <Palette className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Tema:</span>
          </div>

          <div className="flex items-center gap-1 bg-white dark:bg-zinc-900 p-1 rounded-lg border border-slate-200 dark:border-zinc-800">
            {(Object.keys(THEMES) as SlideTheme[]).map((themeKey) => {
              const th = THEMES[themeKey];
              const isSelected = selectedTheme === themeKey;
              return (
                <button
                  key={themeKey}
                  onClick={() => setSelectedTheme(themeKey)}
                  className={`px-2 py-1 rounded-md text-[11px] font-medium flex items-center gap-1.5 transition-all cursor-pointer ${
                    isSelected
                      ? "bg-slate-900 text-white dark:bg-zinc-100 dark:text-zinc-900 shadow-2xs font-semibold"
                      : "text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-zinc-200 hover:bg-slate-100 dark:hover:bg-zinc-800"
                  }`}
                  title={th.label}
                >
                  <span className={`w-2 h-2 rounded-full ${th.dotColor}`} />
                  <span>{th.name.split(" ")[0]}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Seletor de Aspect Ratio (1:1 vs 4:5) */}
        <div className="flex items-center gap-1 bg-white dark:bg-zinc-900 p-1 rounded-lg border border-slate-200 dark:border-zinc-800">
          <button
            onClick={() => setAspectRatio("1:1")}
            className={`px-2.5 py-1 rounded-md text-[11px] font-medium flex items-center gap-1 transition-all cursor-pointer ${
              aspectRatio === "1:1"
                ? "bg-emerald-600 text-white font-semibold shadow-2xs"
                : "text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-zinc-200"
            }`}
            title="1080x1080 - Quadrado clássico"
          >
            <Square className="w-3 h-3" />
            <span>1:1</span>
          </button>
          <button
            onClick={() => setAspectRatio("4:5")}
            className={`px-2.5 py-1 rounded-md text-[11px] font-medium flex items-center gap-1 transition-all cursor-pointer ${
              aspectRatio === "4:5"
                ? "bg-emerald-600 text-white font-semibold shadow-2xs"
                : "text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-zinc-200"
            }`}
            title="1080x1350 - Retrato vertical (+25% de tela)"
          >
            <Smartphone className="w-3 h-3" />
            <span>4:5</span>
          </button>
        </div>
      </div>

      {/* RENDERIZAÇÃO CONDICIONAL: MODO FEED MOCKUP */}
      {viewMode === "feed" ? (
        <div className="bg-slate-50/50 dark:bg-zinc-950/40 p-6 rounded-2xl border border-slate-200 dark:border-zinc-800">
          <div className="max-w-md mx-auto mb-3 text-center">
            <p className="text-xs font-semibold text-slate-700 dark:text-zinc-300">
              Visualização Fiel do Feed do Instagram
            </p>
            <p className="text-[11px] text-slate-400 dark:text-zinc-500">
              Assinatura: <span className="text-emerald-500 font-bold">{brand.handle}</span> • Deslize as lâminas ou clique em "...mais" na legenda.
            </p>
          </div>
          <InstagramFeedMockup
            slides={slides}
            caption={caption}
            theme={selectedTheme}
            aspectRatio={aspectRatio}
            category={category}
          />
        </div>
      ) : (
        /* RENDERIZAÇÃO: MODO ESTÚDIO DE CRIAÇÃO */
        <>
          {/* BARRA DE MINIATURAS / STORYLINE */}
          <div className="flex items-center justify-between gap-2 overflow-x-auto pb-1 scrollbar-none">
            <div className="flex items-center gap-1.5">
              {slides.map((s, idx) => {
                const isActive = idx === currentSlideIndex;
                return (
                  <button
                    key={idx}
                    onClick={() => setCurrentSlideIndex(idx)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold shrink-0 transition-all cursor-pointer border flex items-center gap-1.5 ${
                      isActive
                        ? "bg-slate-900 text-white dark:bg-zinc-100 dark:text-zinc-900 border-slate-900 dark:border-white shadow-xs"
                        : "bg-white dark:bg-zinc-900/60 text-slate-600 dark:text-zinc-400 border-slate-200 dark:border-zinc-800 hover:bg-slate-50 dark:hover:bg-zinc-800"
                    }`}
                  >
                    <span
                      className={`w-1.5 h-1.5 rounded-full ${
                        isActive ? "bg-emerald-400" : "bg-slate-300 dark:bg-zinc-600"
                      }`}
                    />
                    <span>
                      {idx + 1}. {s.badge || `Slide ${idx + 1}`}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Ferramentas de Tom com IA */}
            <div className="flex items-center gap-1 shrink-0">
              <span className="text-[10px] text-slate-400 dark:text-zinc-500 font-semibold mr-1 hidden sm:inline">
                Ajustar Tom (IA):
              </span>
              <button
                onClick={() => handleAdjustTone("viral")}
                disabled={isAdjustingTone}
                className="px-2 py-1 rounded text-[10px] font-semibold bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors flex items-center gap-1 cursor-pointer disabled:opacity-50"
                title="Ganchos magnéticos e linguagem viral para engajar"
              >
                <Flame className="w-3 h-3" />
                <span>Viral</span>
              </button>
              <button
                onClick={() => handleAdjustTone("technical")}
                disabled={isAdjustingTone}
                className="px-2 py-1 rounded text-[10px] font-semibold bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 text-sky-600 dark:text-sky-400 hover:bg-sky-50 dark:hover:bg-sky-950/30 transition-colors flex items-center gap-1 cursor-pointer disabled:opacity-50"
                title="Vocabulário técnico, valuation e múltiplos de mercado"
              >
                <Binary className="w-3 h-3" />
                <span>Técnico</span>
              </button>
              <button
                onClick={() => handleAdjustTone("concise")}
                disabled={isAdjustingTone}
                className="px-2 py-1 rounded text-[10px] font-semibold bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 text-amber-600 dark:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-950/30 transition-colors flex items-center gap-1 cursor-pointer disabled:opacity-50"
                title="Frases curtas e leitura rápida de 10 segundos"
              >
                <Scissors className="w-3 h-3" />
                <span>Direto</span>
              </button>
            </div>
          </div>

          {/* ESTÚDIO PRINCIPAL: SLIDE VISUAL + LEGENDA FORMATADA */}
          <div className="flex flex-col lg:flex-row gap-6 items-start">
            {/* Contêiner Invisível de Renderização de Alta Resolução (1080px) para o ZIP */}
            <div className="fixed -left-[9999px] top-0 pointer-events-none" aria-hidden="true">
              {slides.map((s, idx) => (
                <div
                  key={idx}
                  ref={(el) => {
                    offscreenRefs.current[idx] = el;
                  }}
                  className={`p-16 flex flex-col justify-between relative overflow-hidden ${
                    aspectRatio === "4:5" ? "w-[1080px] h-[1350px]" : "w-[1080px] h-[1080px]"
                  } ${themeConfig.bgClass} ${themeConfig.borderClass}`}
                >
                  {/* Topo do Slide Offscreen */}
                  <div className="flex items-center justify-between z-10">
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-12 h-12 rounded-xl border flex items-center justify-center font-black ${themeConfig.logoBoxClass}`}
                      >
                        <span className="text-base">{brand.initials}</span>
                      </div>
                      <span className={`text-xl font-bold tracking-wider ${themeConfig.logoTextClass}`}>
                        {brand.brandName}
                      </span>
                    </div>
                  </div>

                  {/* Centro do Slide Offscreen */}
                  <div className="my-auto py-8 z-10 space-y-6">
                    <div className="inline-block">
                      <span
                        className={`text-sm font-extrabold uppercase tracking-widest px-4 py-2 rounded-md border ${themeConfig.badgeClass}`}
                      >
                        {s.badge || category || "FINANÇAS"}
                      </span>
                    </div>
                    <h4
                      className={`text-4xl font-extrabold leading-snug tracking-tight ${themeConfig.titleClass}`}
                    >
                      {s.title}
                    </h4>
                    {s.highlightText && (
                      <div
                        className={`border px-6 py-3 rounded-xl inline-block ${themeConfig.highlightClass}`}
                      >
                        <span className={`text-2xl font-bold ${themeConfig.highlightTextClass}`}>
                          {s.highlightText}
                        </span>
                      </div>
                    )}
                    <p
                      className={`text-2xl leading-relaxed font-normal ${themeConfig.descClass}`}
                    >
                      {s.description}
                    </p>
                  </div>

                  {/* Rodapé do Slide Offscreen */}
                  <div
                    className={`flex items-center justify-between pt-6 border-t z-10 text-base font-medium ${themeConfig.footerBorderClass} ${themeConfig.footerTextClass}`}
                  >
                    <span>{brand.handle}</span>
                    <span className={themeConfig.actionTextClass}>
                      {idx === slides.length - 1 ? "Salve este post 📌" : "Deslize para o lado 👉"}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Visualizador do Slide do Carrossel (On-Screen) */}
            <div className="w-full lg:w-[380px] flex flex-col items-center">
              {/* Card do Slide Interativo */}
              <div
                ref={slideRef}
                className={`w-full ${
                  aspectRatio === "4:5" ? "aspect-[4/5]" : "aspect-square"
                } ${themeConfig.bgClass} border ${themeConfig.borderClass} rounded-2xl p-6 flex flex-col justify-between shadow-2xl relative overflow-hidden select-none transition-all duration-300`}
              >
                {/* Luz de Fundo Decorativa */}
                <div
                  className={`absolute -top-16 -right-16 w-36 h-36 rounded-full blur-3xl pointer-events-none ${themeConfig.glow1}`}
                />
                <div
                  className={`absolute -bottom-16 -left-16 w-36 h-36 rounded-full blur-3xl pointer-events-none ${themeConfig.glow2}`}
                />

                {/* Topo do Slide: Branding */}
                <div className="flex items-center justify-between z-10">
                  <div className="flex items-center gap-2">
                    <div
                      className={`w-6 h-6 rounded-lg border flex items-center justify-center font-black ${themeConfig.logoBoxClass}`}
                    >
                      <span className="text-[10px]">{brand.initials}</span>
                    </div>
                    <span className={`text-[11px] font-bold tracking-wider ${themeConfig.logoTextClass}`}>
                      {brand.brandName}
                    </span>
                  </div>
                </div>

                {/* Centro do Slide: Conteúdo ou Modo Edição */}
                <div className="my-auto py-3 z-10 space-y-3">
                  {isEditingSlide ? (
                    <div className="space-y-2 bg-zinc-950/90 p-3 rounded-lg border border-emerald-500/40">
                      <div>
                        <label className="text-[10px] text-zinc-400 block mb-0.5">Etiqueta:</label>
                        <input
                          type="text"
                          value={currentSlide.badge}
                          onChange={(e) => updateCurrentSlide("badge", e.target.value)}
                          className="w-full bg-zinc-900 border border-zinc-700 rounded px-2 py-1 text-xs text-emerald-400 font-bold focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] text-zinc-400 block mb-0.5">Título do Slide:</label>
                        <input
                          type="text"
                          value={currentSlide.title}
                          onChange={(e) => updateCurrentSlide("title", e.target.value)}
                          className="w-full bg-zinc-900 border border-zinc-700 rounded px-2 py-1 text-xs text-white font-bold focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] text-zinc-400 block mb-0.5">Destaque / Métrica:</label>
                        <input
                          type="text"
                          value={currentSlide.highlightText || ""}
                          onChange={(e) => updateCurrentSlide("highlightText", e.target.value)}
                          className="w-full bg-zinc-900 border border-zinc-700 rounded px-2 py-1 text-xs text-emerald-300 focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] text-zinc-400 block mb-0.5">Descrição:</label>
                        <textarea
                          rows={2}
                          value={currentSlide.description}
                          onChange={(e) => updateCurrentSlide("description", e.target.value)}
                          className="w-full bg-zinc-900 border border-zinc-700 rounded px-2 py-1 text-xs text-zinc-200 focus:outline-none"
                        />
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="inline-block">
                        <span
                          className={`text-[10px] font-extrabold uppercase tracking-widest px-2.5 py-1 rounded-md border ${themeConfig.badgeClass}`}
                        >
                          {currentSlide.badge || category || "FINANÇAS"}
                        </span>
                      </div>

                      <h4
                        className={`text-lg font-extrabold leading-snug tracking-tight ${themeConfig.titleClass}`}
                      >
                        {currentSlide.title}
                      </h4>

                      {currentSlide.highlightText && (
                        <div
                          className={`border px-3 py-1.5 rounded-lg inline-block ${themeConfig.highlightClass}`}
                        >
                          <span
                            className={`text-xs font-bold ${themeConfig.highlightTextClass}`}
                          >
                            {currentSlide.highlightText}
                          </span>
                        </div>
                      )}

                      <p
                        className={`text-xs leading-relaxed font-normal ${themeConfig.descClass}`}
                      >
                        {currentSlide.description}
                      </p>
                    </>
                  )}
                </div>

                {/* Rodapé do Slide */}
                <div
                  className={`flex items-center justify-between pt-3 border-t z-10 text-[11px] font-medium ${themeConfig.footerBorderClass} ${themeConfig.footerTextClass}`}
                >
                  <span>{brand.handle}</span>
                  <span className={themeConfig.actionTextClass}>
                    {currentSlideIndex === slides.length - 1 ? "Salve 📌" : "Arraste 👉"}
                  </span>
                </div>
              </div>

              {/* Controles de Navegação e Botão Editar */}
              <div className="w-full flex items-center justify-between mt-3 px-1">
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={handlePrev}
                    className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-slate-700 dark:text-zinc-200 transition-colors cursor-pointer"
                    title="Slide anterior (Seta para a esquerda)"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <div className="flex gap-1 px-1">
                    {slides.map((_, i) => (
                      <button
                        key={i}
                        onClick={() => setCurrentSlideIndex(i)}
                        className={`w-2 h-2 rounded-full transition-all cursor-pointer ${
                          i === currentSlideIndex
                            ? "w-4 bg-emerald-500"
                            : "bg-slate-300 dark:bg-zinc-700 hover:bg-slate-400 dark:hover:bg-zinc-600"
                        }`}
                      />
                    ))}
                  </div>
                  <button
                    onClick={handleNext}
                    className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-slate-700 dark:text-zinc-200 transition-colors cursor-pointer"
                    title="Próximo slide (Seta para a direita)"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>

                <button
                  onClick={() => setIsEditingSlide(!isEditingSlide)}
                  className={`flex items-center gap-1 text-xs px-2.5 py-1.5 rounded-lg transition-colors cursor-pointer border ${
                    isEditingSlide
                      ? "bg-emerald-600 text-white border-emerald-500"
                      : "bg-slate-100 hover:bg-slate-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-slate-700 dark:text-zinc-300 border-slate-200 dark:border-zinc-700"
                  }`}
                >
                  {isEditingSlide ? (
                    <>
                      <Save className="w-3.5 h-3.5" />
                      <span>Salvar Slide</span>
                    </>
                  ) : (
                    <>
                      <Edit3 className="w-3.5 h-3.5" />
                      <span>Editar Texto</span>
                    </>
                  )}
                </button>
              </div>

              {/* Botões de Download */}
              <div className="w-full grid grid-cols-2 gap-2 mt-3">
                <button
                  onClick={handleDownloadCurrentSlide}
                  disabled={isDownloading}
                  className="flex items-center justify-center gap-1.5 text-xs font-semibold bg-slate-100 hover:bg-slate-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 border border-slate-200 dark:border-zinc-700 disabled:opacity-50 text-slate-800 dark:text-zinc-200 py-2 rounded-lg transition-all cursor-pointer shadow-2xs"
                  title="Baixar apenas esta lâmina em PNG"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Slide Atual (PNG)</span>
                </button>

                <button
                  onClick={handleDownloadAllZip}
                  disabled={isDownloadingZip}
                  className="flex items-center justify-center gap-1.5 text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white py-2 rounded-lg shadow-sm transition-all cursor-pointer"
                  title="Baixar todas as lâminas e a legenda em um arquivo ZIP"
                >
                  <Package className={`w-3.5 h-3.5 ${isDownloadingZip ? "animate-spin" : ""}`} />
                  <span>{isDownloadingZip ? "Compactando..." : "Baixar Todos (.ZIP)"}</span>
                </button>
              </div>
            </div>

            {/* Painel da Legenda do Instagram */}
            <div className="flex-1 w-full flex flex-col justify-between bg-white dark:bg-zinc-900/60 border border-slate-200 dark:border-zinc-800 rounded-xl p-4 self-stretch shadow-2xs transition-colors">
              <div>
                <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-200 dark:border-zinc-800">
                  <div className="flex items-center gap-2 text-xs font-semibold text-slate-800 dark:text-zinc-200">
                    <InstagramIcon className="w-4 h-4 text-pink-500" />
                    <span>Legenda Formatada para o Feed</span>
                  </div>

                  <button
                    onClick={handleCopyCaption}
                    className="flex items-center gap-1.5 text-xs font-semibold bg-slate-100 hover:bg-slate-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-slate-800 dark:text-zinc-100 px-3 py-1.5 rounded-lg transition-colors cursor-pointer border border-slate-200 dark:border-zinc-700"
                  >
                    {copiedCaption ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-500" />
                        <span className="text-emerald-500">Copiada!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Copiar Legenda</span>
                      </>
                    )}
                  </button>
                </div>

                {/* Campo de edição/leitura da Legenda */}
                <textarea
                  rows={12}
                  value={caption}
                  onChange={(e) => setCaption(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-zinc-950/80 border border-slate-200 dark:border-zinc-800 rounded-lg p-3 text-xs text-slate-800 dark:text-zinc-200 font-sans leading-relaxed focus:outline-none focus:border-emerald-500 resize-y"
                  placeholder="Legenda do post..."
                />
              </div>

              {/* Rodapé da Legenda com Contadores */}
              <div className="pt-3 mt-3 border-t border-slate-200 dark:border-zinc-800 text-[11px] text-slate-500 dark:text-zinc-500 flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-3">
                  <span className={charCount > 2200 ? "text-rose-500 font-bold" : ""}>
                    {charCount} / 2.200 caracteres
                  </span>
                  <span>•</span>
                  <span className={hashtagCount > 30 ? "text-rose-500 font-bold" : ""}>
                    {hashtagCount} / 30 hashtags
                  </span>
                </div>
                <span className="text-emerald-600 dark:text-emerald-400 font-medium">
                  Incluso no .ZIP (legenda.txt)
                </span>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
