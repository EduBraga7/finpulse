"use server";

import { prisma } from "@/lib/prisma";
import { syncAllFeeds } from "@/lib/rss";
import { curateAndGenerateContent, rewriteContentWithTone, CarouselSlide } from "@/lib/gemini";
import { revalidatePath } from "next/cache";

function safeRevalidate(path = "/") {
  try {
    revalidatePath(path);
  } catch {
    // Silencia erro caso chamado fora do contexto de requisição HTTP
  }
}

export async function syncNewsAction() {
  try {
    const result = await syncAllFeeds();
    safeRevalidate("/");
    return { success: true, newCount: result.newItemsCount };
  } catch (error) {
    console.error("Erro ao sincronizar notícias:", error);
    return { success: false, error: (error as Error).message };
  }
}

export async function curateNewsAction(rawNewsId: string) {
  try {
    const news = await prisma.rawNews.findUnique({
      where: { id: rawNewsId },
    });

    if (!news) throw new Error("Notícia não encontrada");

    // Gerar análise e posts com o Gemini
    const aiResult = await curateAndGenerateContent({
      title: news.title,
      summary: news.summary,
      content: news.content,
    });

    // Salvar ou atualizar o post curado
    const existingPost = await prisma.curatedPost.findFirst({
      where: { rawNewsId },
    });

    const slidesJson = JSON.stringify(aiResult.slides || []);

    if (existingPost) {
      await prisma.curatedPost.update({
        where: { id: existingPost.id },
        data: {
          score: aiResult.score,
          reasoning: aiResult.reasoning,
          category: aiResult.category,
          instagramCaption: aiResult.instagramCaption,
          slidesJson,
          linkedinPost: aiResult.linkedinPost,
          twitterPost: aiResult.twitterPost,
          newsletterPost: aiResult.newsletterPost,
          status: "REVIEW",
        },
      });
    } else {
      await prisma.curatedPost.create({
        data: {
          rawNewsId,
          score: aiResult.score,
          reasoning: aiResult.reasoning,
          category: aiResult.category,
          instagramCaption: aiResult.instagramCaption,
          slidesJson,
          linkedinPost: aiResult.linkedinPost,
          twitterPost: aiResult.twitterPost,
          newsletterPost: aiResult.newsletterPost,
          status: "REVIEW",
        },
      });
    }

    safeRevalidate("/");
    return { success: true, aiResult };
  } catch (error) {
    console.error("Erro ao curar notícia:", error);
    return { success: false, error: (error as Error).message };
  }
}

export async function updatePostStatusAction(
  postId: string,
  status: "REVIEW" | "APPROVED" | "PUBLISHED" | "ARCHIVED"
) {
  try {
    await prisma.curatedPost.update({
      where: { id: postId },
      data: { status },
    });
    safeRevalidate("/");
    return { success: true };
  } catch (error) {
    console.error("Erro ao atualizar status:", error);
    return { success: false, error: (error as Error).message };
  }
}

export async function updatePostContentAction(
  postId: string,
  data: {
    linkedinPost?: string;
    twitterPost?: string;
    newsletterPost?: string;
  }
) {
  try {
    await prisma.curatedPost.update({
      where: { id: postId },
      data,
    });
    safeRevalidate("/");
    return { success: true };
  } catch (error) {
    console.error("Erro ao atualizar conteúdo:", error);
    return { success: false, error: (error as Error).message };
  }
}

export async function addSourceAction(name: string, url: string, category: string) {
  try {
    await prisma.source.create({
      data: { name, url, category, active: true },
    });
    safeRevalidate("/");
    return { success: true };
  } catch (error) {
    return { success: false, error: (error as Error).message };
  }
}

export async function curateBatchAction(count: number = 3) {
  try {
    // Buscar notícias que ainda não foram curadas
    const uncurated = await prisma.rawNews.findMany({
      where: {
        posts: {
          none: {},
        },
      },
      take: count,
      orderBy: { pubDate: "desc" },
    });

    let processed = 0;
    for (const news of uncurated) {
      if (processed > 0) {
        // Pausa de 2.5s entre requisições para respeitar o rate limit da conta gratuita
        await new Promise((resolve) => setTimeout(resolve, 2500));
      }
      const res = await curateNewsAction(news.id);
      if (res.success) {
        processed++;
      }
    }

    safeRevalidate("/");
    return { success: true, processedCount: processed };
  } catch (error) {
    console.error("Erro na geração em lote:", error);
    return { success: false, error: (error as Error).message };
  }
}

export async function deleteNewsAction(rawNewsId: string) {
  try {
    await prisma.rawNews.delete({
      where: { id: rawNewsId },
    });
    safeRevalidate("/");
    return { success: true };
  } catch (error) {
    console.error("Erro ao excluir notícia:", error);
    return { success: false, error: (error as Error).message };
  }
}

export async function deleteCuratedPostAction(postId: string) {
  try {
    await prisma.curatedPost.delete({
      where: { id: postId },
    });
    safeRevalidate("/");
    return { success: true };
  } catch (error) {
    console.error("Erro ao excluir post curado:", error);
    return { success: false, error: (error as Error).message };
  }
}

export async function deleteSourceAction(sourceId: string) {
  try {
    await prisma.source.delete({
      where: { id: sourceId },
    });
    safeRevalidate("/");
    return { success: true };
  } catch (error) {
    console.error("Erro ao excluir fonte:", error);
    return { success: false, error: (error as Error).message };
  }
}

export async function createManualNewsAction(data: {
  title: string;
  summary?: string;
  content?: string;
  category?: string;
  curateNow?: boolean;
}) {
  try {
    // Garantir existência de uma fonte para pautas manuais
    let source = await prisma.source.findFirst({
      where: { url: "manual://user-pauta" },
    });

    if (!source) {
      source = await prisma.source.create({
        data: {
          name: "Pauta Manual",
          url: "manual://user-pauta",
          category: data.category || "Mercado",
          active: true,
        },
      });
    }

    const created = await prisma.rawNews.create({
      data: {
        title: data.title.trim(),
        summary: data.summary?.trim() || data.content?.trim() || null,
        content: data.content?.trim() || data.summary?.trim() || null,
        link: `manual://${Date.now()}`,
        pubDate: new Date(),
        sourceId: source.id,
      },
    });

    if (data.curateNow) {
      await curateNewsAction(created.id);
    }

    safeRevalidate("/");
    return { success: true, newsId: created.id };
  } catch (error) {
    console.error("Erro ao criar pauta manual:", error);
    return { success: false, error: (error as Error).message };
  }
}

export async function adjustPostToneAction(
  postId: string,
  tone: "viral" | "technical" | "concise"
) {
  try {
    const post = await prisma.curatedPost.findUnique({
      where: { id: postId },
    });

    if (!post) throw new Error("Post curado não encontrado");

    let slides: CarouselSlide[] = [];
    if (post.slidesJson) {
      try {
        slides = JSON.parse(post.slidesJson);
      } catch {
        slides = [];
      }
    }

    const rewritten = await rewriteContentWithTone(
      slides,
      post.instagramCaption || "",
      tone
    );

    await prisma.curatedPost.update({
      where: { id: postId },
      data: {
        slidesJson: JSON.stringify(rewritten.slides),
        instagramCaption: rewritten.instagramCaption,
      },
    });

    safeRevalidate("/");
    return {
      success: true,
      slides: rewritten.slides,
      instagramCaption: rewritten.instagramCaption,
    };
  } catch (error) {
    console.error("Erro ao ajustar tom do post:", error);
    return { success: false, error: (error as Error).message };
  }
}


