import { Newspaper, Sparkles, CheckCircle2, Award } from "lucide-react";

interface StatsProps {
  totalRaw: number;
  totalCurated: number;
  totalApproved: number;
  avgScore: number;
}

export function StatsCards({ totalRaw, totalCurated, totalApproved, avgScore }: StatsProps) {
  const stats = [
    {
      label: "Notícias Coletadas",
      value: totalRaw,
      icon: Newspaper,
    },
    {
      label: "Carrosséis Gerados",
      value: totalCurated,
      icon: Sparkles,
      highlight: true,
    },
    {
      label: "Prontos / Aprovados",
      value: totalApproved,
      icon: CheckCircle2,
    },
    {
      label: "Score Médio",
      value: avgScore > 0 ? `${avgScore.toFixed(1)}/10` : "—",
      icon: Award,
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
      {stats.map((stat, i) => {
        const Icon = stat.icon;
        return (
          <div
            key={i}
            className="px-4 py-3 rounded-xl border border-slate-200 dark:border-zinc-800/80 bg-white dark:bg-zinc-900/50 backdrop-blur-xs flex items-center justify-between transition-colors shadow-2xs"
          >
            <div>
              <span className="text-[11px] font-medium text-slate-500 dark:text-zinc-400 block">
                {stat.label}
              </span>
              <span className="text-xl font-bold tracking-tight text-slate-900 dark:text-zinc-100">
                {stat.value}
              </span>
            </div>
            <div className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-zinc-800/80 flex items-center justify-center text-slate-600 dark:text-zinc-400">
              <Icon className="w-4 h-4 stroke-[1.8]" />
            </div>
          </div>
        );
      })}
    </div>
  );
}
