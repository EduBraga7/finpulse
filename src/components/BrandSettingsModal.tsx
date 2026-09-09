"use client";

import { useState, useEffect } from "react";
import { X, Sparkles, AtSign, Tag, Check, ShieldCheck } from "lucide-react";
import { useToast } from "./Toast";

export interface BrandSettings {
  handle: string;
  brandName: string;
  initials: string;
}

const DEFAULT_BRAND: BrandSettings = {
  handle: "@finpulse.ai",
  brandName: "FINPULSE.AI",
  initials: "FP",
};

export function useBrandSettings() {
  const [brand, setBrand] = useState<BrandSettings>(DEFAULT_BRAND);

  useEffect(() => {
    try {
      const saved = localStorage.getItem("finpulse_brand");
      if (saved) {
        setBrand(JSON.parse(saved));
      }
    } catch {
      // Fallback para padrão
    }

    const handleUpdate = () => {
      try {
        const saved = localStorage.getItem("finpulse_brand");
        if (saved) {
          setBrand(JSON.parse(saved));
        }
      } catch {}
    };

    window.addEventListener("brand_settings_updated", handleUpdate);
    return () => window.removeEventListener("brand_settings_updated", handleUpdate);
  }, []);

  const updateBrand = (newBrand: BrandSettings) => {
    try {
      localStorage.setItem("finpulse_brand", JSON.stringify(newBrand));
      setBrand(newBrand);
      window.dispatchEvent(new Event("brand_settings_updated"));
    } catch (err) {
      console.error("Erro ao salvar marca:", err);
    }
  };

  return { brand, updateBrand };
}

interface BrandSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function BrandSettingsModal({ isOpen, onClose }: BrandSettingsModalProps) {
  const { brand, updateBrand } = useBrandSettings();
  const [handle, setHandle] = useState(brand.handle);
  const [brandName, setBrandName] = useState(brand.brandName);
  const [initials, setInitials] = useState(brand.initials);
  const toast = useToast();

  useEffect(() => {
    if (isOpen) {
      setHandle(brand.handle);
      setBrandName(brand.brandName);
      setInitials(brand.initials);
    }
  }, [isOpen, brand]);

  if (!isOpen) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();

    let cleanHandle = handle.trim();
    if (cleanHandle && !cleanHandle.startsWith("@")) {
      cleanHandle = `@${cleanHandle}`;
    }

    const cleanInitials = initials.trim().toUpperCase().slice(0, 3) || "FP";
    const cleanBrandName = brandName.trim().toUpperCase() || "FINPULSE.AI";

    updateBrand({
      handle: cleanHandle || "@finpulse.ai",
      brandName: cleanBrandName,
      initials: cleanInitials,
    });

    toast.success(
      "Marca atualizada com sucesso!",
      `Seu @ e logo foram aplicados a todos os slides e downloads.`
    );
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="w-full max-w-md bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-2xl shadow-2xl p-6 relative">
        {/* Botão Fechar */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-zinc-200 hover:bg-slate-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex items-center gap-2 mb-1">
          <div className="w-8 h-8 rounded-xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
            <Tag className="w-4 h-4" />
          </div>
          <h3 className="text-base font-bold text-slate-900 dark:text-zinc-100">
            Personalizar Marca & Perfil
          </h3>
        </div>
        <p className="text-xs text-slate-500 dark:text-zinc-400 mb-5">
          Defina seu perfil do Instagram e a assinatura visual que aparecerá em todas as lâminas e exportações.
        </p>

        {/* Pré-visualização ao vivo */}
        <div className="mb-5 p-4 rounded-xl bg-zinc-950 border border-zinc-800 flex items-center justify-between text-white">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center font-black text-emerald-400 text-xs">
              {initials.trim().toUpperCase() || "FP"}
            </div>
            <div>
              <p className="text-xs font-bold tracking-wider text-zinc-200">
                {brandName.trim().toUpperCase() || "SUA MARCA"}
              </p>
              <p className="text-[11px] text-zinc-400">
                {handle.trim() ? (handle.startsWith("@") ? handle : `@${handle}`) : "@seu.perfil"}
              </p>
            </div>
          </div>
          <span className="text-[10px] font-semibold text-emerald-400 bg-emerald-950/60 border border-emerald-800/40 px-2 py-0.5 rounded-full flex items-center gap-1">
            <ShieldCheck className="w-3 h-3" />
            <span>Assinatura Ativa</span>
          </span>
        </div>

        <form onSubmit={handleSave} className="space-y-4">
          {/* Campo Handle do Instagram */}
          <div>
            <label className="text-xs font-semibold text-slate-700 dark:text-zinc-300 flex items-center gap-1.5 mb-1.5">
              <AtSign className="w-3.5 h-3.5 text-emerald-500" />
              <span>Seu @ do Instagram:</span>
            </label>
            <input
              type="text"
              placeholder="@meu.perfil"
              value={handle}
              onChange={(e) => setHandle(e.target.value)}
              className="w-full bg-slate-50 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 rounded-lg px-3 py-2 text-xs text-slate-900 dark:text-zinc-100 placeholder-slate-400 focus:outline-none focus:border-emerald-500"
            />
            <p className="text-[10px] text-slate-400 dark:text-zinc-500 mt-1">
              Será exibido no rodapé de cada slide e no simulador de feed.
            </p>
          </div>

          {/* Campo Nome da Marca */}
          <div>
            <label className="text-xs font-semibold text-slate-700 dark:text-zinc-300 block mb-1.5">
              Nome da Marca ou Canal:
            </label>
            <input
              type="text"
              placeholder="FINPULSE.AI ou INVESTIDOR B3"
              value={brandName}
              onChange={(e) => setBrandName(e.target.value)}
              className="w-full bg-slate-50 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 rounded-lg px-3 py-2 text-xs text-slate-900 dark:text-zinc-100 placeholder-slate-400 focus:outline-none focus:border-emerald-500 uppercase"
            />
          </div>

          {/* Campo Iniciais da Logo */}
          <div>
            <label className="text-xs font-semibold text-slate-700 dark:text-zinc-300 block mb-1.5">
              Iniciais da Logo (2 a 3 letras):
            </label>
            <input
              type="text"
              maxLength={3}
              placeholder="FP ou IB"
              value={initials}
              onChange={(e) => setInitials(e.target.value.toUpperCase())}
              className="w-24 bg-slate-50 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 rounded-lg px-3 py-2 text-xs text-slate-900 dark:text-zinc-100 placeholder-slate-400 text-center font-bold tracking-wider focus:outline-none focus:border-emerald-500 uppercase"
            />
          </div>

          {/* Botões do Modal */}
          <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100 dark:border-zinc-800">
            <button
              type="button"
              onClick={onClose}
              className="px-3.5 py-2 text-xs font-medium text-slate-600 hover:text-slate-800 dark:text-zinc-400 dark:hover:text-zinc-200 transition-colors cursor-pointer"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <Check className="w-3.5 h-3.5" />
              <span>Salvar Marca</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
