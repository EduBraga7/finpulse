import { prisma } from "@/lib/prisma";
import { ensureDefaultSources } from "@/lib/rss";
import { Header } from "@/components/Header";
import { StatsCards } from "@/components/StatsCards";
import { SourceManager } from "@/components/SourceManager";
import { WorkspaceStudio } from "@/components/WorkspaceStudio";

export const dynamic = "force-dynamic";

export default async function Home() {
  // Garantir fontes financeiras padrões no SQLite
  await ensureDefaultSources();

  // Buscar fontes cadastradas
  const sources = await prisma.source.findMany({
    orderBy: { name: "asc" },
  });

  // Buscar notícias e posts relacionados
  const rawNewsList = await prisma.rawNews.findMany({
    take: 60,
    orderBy: { pubDate: "desc" },
    include: {
      source: {
        select: { name: true, category: true },
      },
      posts: {
        orderBy: { createdAt: "desc" },
      },
    },
  });

  // Estatísticas do Dashboard
  const totalRaw = await prisma.rawNews.count();
  const totalCurated = await prisma.curatedPost.count();
  const totalApproved = await prisma.curatedPost.count({
    where: { status: "APPROVED" },
  });

  const avgScoreAggregate = await prisma.curatedPost.aggregate({
    _avg: { score: true },
  });
  const avgScore = avgScoreAggregate._avg.score || 0;

  const hasApiKey = Boolean(process.env.GEMINI_API_KEY?.trim());

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-zinc-950 text-slate-900 dark:text-zinc-100 flex flex-col transition-colors">
      {/* Header com Status, Sincronização, Lote e Toggle Dark/Light */}
      <Header hasApiKey={hasApiKey} />

      {/* Conteúdo do Workspace */}
      <main className="flex-1 max-w-[1600px] w-full mx-auto px-4 sm:px-6 py-6 space-y-6">
        {/* Banner discreto caso falte a API Key */}
        {!hasApiKey && (
          <div className="bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/60 rounded-xl p-3.5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="space-y-0.5">
              <span className="text-xs font-bold text-amber-800 dark:text-amber-300">
                ⚡ Modo de Demonstração Ativo
              </span>
              <p className="text-xs text-amber-700 dark:text-amber-200/80">
                Adicione sua chave gratuita do Gemini no arquivo <code className="bg-amber-100 dark:bg-amber-900/50 px-1 py-0.5 rounded font-mono text-[11px]">.env</code> para gerar análises ao vivo.
              </p>
            </div>
            <a
              href="https://aistudio.google.com/"
              target="_blank"
              rel="noreferrer"
              className="text-xs font-semibold bg-amber-600 hover:bg-amber-500 text-white px-3 py-1.5 rounded-lg shrink-0 transition-colors"
            >
              Obter Chave Grátis →
            </a>
          </div>
        )}

        {/* Métricas Principais Compactas */}
        <StatsCards
          totalRaw={totalRaw}
          totalCurated={totalCurated}
          totalApproved={totalApproved}
          avgScore={avgScore}
        />

        {/* Gerenciador de Fontes RSS */}
        <SourceManager sources={sources} />

        {/* Workspace Studio: Feed à Esquerda + Estúdio de Carrossel à Direita */}
        <section className="pt-2">
          <WorkspaceStudio initialNews={rawNewsList} />
        </section>
      </main>

      {/* Rodapé Minimalista */}
      <footer className="border-t border-slate-200 dark:border-zinc-800 py-4 text-center text-xs text-slate-400 dark:text-zinc-600">
        <p>FinPulse AI Studio — Plataforma de Criação de Conteúdo Financeiro</p>
      </footer>
    </div>
  );
}
