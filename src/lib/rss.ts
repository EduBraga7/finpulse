import Parser from "rss-parser";
import { prisma } from "./prisma";

const parser = new Parser({
  timeout: 10000,
  headers: {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
  },
});

export const DEFAULT_FINANCE_SOURCES = [
  {
    name: "InfoMoney Mercados",
    url: "https://www.infomoney.com.br/mercados/feed/",
    category: "acoes",
  },
  {
    name: "InfoMoney Economia",
    url: "https://www.infomoney.com.br/economia/feed/",
    category: "macro",
  },
  {
    name: "Brazil Journal",
    url: "https://braziljournal.com/feed/",
    category: "acoes",
  },
  {
    name: "Money Times",
    url: "https://www.moneytimes.com.br/feed/",
    category: "acoes",
  },
  {
    name: "Seu Dinheiro",
    url: "https://www.seudinheiro.com/feed/",
    category: "macro",
  },
];

export async function ensureDefaultSources() {
  try {
    const count = await prisma.source.count();
    if (count >= DEFAULT_FINANCE_SOURCES.length) {
      return;
    }

    for (const src of DEFAULT_FINANCE_SOURCES) {
      await prisma.source.upsert({
        where: { url: src.url },
        update: { name: src.name, category: src.category },
        create: {
          name: src.name,
          url: src.url,
          category: src.category,
          active: true,
        },
      });
    }
  } catch (error) {
    console.warn("[FinPulse] Conexão com banco em inicialização:", (error as Error).message);
  }
}

export async function syncAllFeeds() {
  await ensureDefaultSources();

  const activeSources = await prisma.source.findMany({
    where: { active: true },
  });

  let newItemsCount = 0;

  for (const source of activeSources) {
    try {
      const feed = await parser.parseURL(source.url);

      for (const item of feed.items.slice(0, 10)) {
        if (!item.title || !item.link) continue;

        // Limpar HTML tags simples do snippet/resumo
        const cleanSummary = (item.contentSnippet || item.summary || item.content || "")
          .replace(/<[^>]*>?/gm, "")
          .trim()
          .slice(0, 500);

        const pubDate = item.pubDate ? new Date(item.pubDate) : new Date();

        const existing = await prisma.rawNews.findUnique({
          where: { link: item.link },
        });

        if (!existing) {
          await prisma.rawNews.create({
            data: {
              title: item.title.trim(),
              link: item.link,
              summary: cleanSummary,
              content: item.content ? item.content.slice(0, 2000) : null,
              pubDate,
              sourceId: source.id,
            },
          });
          newItemsCount++;
        }
      }
    } catch (err) {
      console.error(`Erro ao sincronizar fonte ${source.name} (${source.url}):`, err);
    }
  }

  // Limpeza automática de notícias brutas que passaram de 14 dias e não foram curadas
  const cleanedCount = await cleanupOldUncuratedNews(14);

  return { newItemsCount, cleanedCount };
}

/**
 * Remove notícias brutas do RSS com mais de X dias que NUNCA foram transformadas em post.
 * Matérias que você analisou, curou ou aprovou são mantidas permanentemente.
 */
export async function cleanupOldUncuratedNews(retentionDays = 14) {
  try {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - retentionDays);

    const result = await prisma.rawNews.deleteMany({
      where: {
        createdAt: { lt: cutoffDate },
        posts: { none: {} },
      },
    });

    if (result.count > 0) {
      console.log(`[Auto-cleanup] ${result.count} notícias brutas com mais de ${retentionDays} dias foram limpas.`);
    }

    return result.count;
  } catch (error) {
    console.error("[Auto-cleanup] Erro ao limpar notícias antigas:", error);
    return 0;
  }
}
