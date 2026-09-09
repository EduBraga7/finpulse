"use client";

import React, { createContext, useContext, useState, useCallback } from "react";
import { CheckCircle2, AlertCircle, Info, X } from "lucide-react";

export type ToastType = "success" | "error" | "info";

export interface ToastMessage {
  id: string;
  type: ToastType;
  title: string;
  description?: string;
}

interface ToastContextType {
  toast: (title: string, description?: string, type?: ToastType) => void;
  success: (title: string, description?: string) => void;
  error: (title: string, description?: string) => void;
  info: (title: string, description?: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const addToast = useCallback(
    (title: string, description?: string, type: ToastType = "success") => {
      const id = Math.random().toString(36).substring(2, 9);
      setToasts((prev) => [...prev, { id, title, description, type }]);

      setTimeout(() => {
        removeToast(id);
      }, 3500);
    },
    [removeToast]
  );

  const success = useCallback((title: string, description?: string) => addToast(title, description, "success"), [addToast]);
  const error = useCallback((title: string, description?: string) => addToast(title, description, "error"), [addToast]);
  const info = useCallback((title: string, description?: string) => addToast(title, description, "info"), [addToast]);

  return (
    <ToastContext.Provider value={{ toast: addToast, success, error, info }}>
      {children}
      <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2 pointer-events-none max-w-sm w-full">
        {toasts.map((t) => (
          <div
            key={t.id}
            className={`pointer-events-auto flex items-start gap-3 p-3.5 rounded-xl shadow-xl border backdrop-blur-md transition-all animate-in fade-in slide-in-from-bottom-3 duration-200 ${
              t.type === "success"
                ? "bg-white/95 dark:bg-zinc-900/95 border-emerald-500/30 text-slate-900 dark:text-zinc-100"
                : t.type === "error"
                ? "bg-white/95 dark:bg-zinc-900/95 border-rose-500/30 text-slate-900 dark:text-zinc-100"
                : "bg-white/95 dark:bg-zinc-900/95 border-sky-500/30 text-slate-900 dark:text-zinc-100"
            }`}
          >
            {t.type === "success" && <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />}
            {t.type === "error" && <AlertCircle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />}
            {t.type === "info" && <Info className="w-4 h-4 text-sky-500 shrink-0 mt-0.5" />}

            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold leading-tight">{t.title}</p>
              {t.description && (
                <p className="text-[11px] text-slate-500 dark:text-zinc-400 mt-0.5 leading-normal">
                  {t.description}
                </p>
              )}
            </div>

            <button
              onClick={() => removeToast(t.id)}
              className="text-slate-400 hover:text-slate-600 dark:hover:text-zinc-200 p-0.5 transition-colors cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) {
    throw new Error("useToast deve ser usado dentro de um ToastProvider");
  }
  return ctx;
}
