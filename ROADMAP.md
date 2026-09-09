# 📸 FinPulse AI — Estúdio de Carrosséis para Instagram (Finanças & Investimentos)

> **Plataforma Full-Stack inteligente para monitorar o mercado financeiro, filtrar notícias de alto impacto e gerar carrosséis visuais com download em PNG/ZIP e legendas prontas para o Instagram.**

---

## 🗺️ Status do Roadmap

| Fase | Descrição | Status |
| :--- | :--- | :--- |
| **Fase 1** | Setup Next.js 16, TypeScript, Tailwind CSS, Prisma e SQLite | 🟢 **100% Concluída** |
| **Fase 2** | Ingestão RSS de Finanças (InfoMoney, Brazil Journal, CNBC, CoinDesk) | 🟢 **100% Concluída** |
| **Fase 3** | Cérebro de IA com Gemini 3.6 Flash & Roteirização de Carrosséis | 🟢 **100% Concluída** |
| **Fase 4** | Dashboard Interativo, Filtros, Preview de Slides e Exportação PNG | 🟢 **100% Concluída** |
| **Fase 5** | Produtividade: Download em ZIP, Editor de Slides e Geração em Lote | 🟢 **Concluída** *(Marca pausada)* |
| **Fase 6** | Automação Matinal (Cron Job) & Notificações (Telegram/Discord) | ⚪ **Pendente / Próximo Passo** |

---

### ✅ Fase 1: Setup da Base do Projeto (Concluída)
- [x] Inicializar Next.js 16 (Turbopack, TypeScript, Tailwind CSS).
- [x] Configurar banco de dados local com SQLite e Prisma ORM (`dev.db`).
- [x] Modelar tabelas: `Source`, `RawNews` e `CuratedPost` (com suporte a slides e legenda do Instagram).
- [x] Configurar variáveis de ambiente com a chave do Google Gemini no `.env`.

### ✅ Fase 2: Ingestão de Notícias Financeiras (Concluída)
- [x] Criar serviço de parse RSS (`rss-parser`) com fontes financeiras padrão.
- [x] Implementar deduplicação para não salvar notícias repetidas.
- [x] Server Action para sincronização sob demanda com feedback visual.

### ✅ Fase 3: IA para Finanças & Carrosséis (Concluída)
- [x] Configurar integração com **Gemini 3.6 Flash** usando o SDK oficial `@google/genai`.
- [x] Engenharia de prompt especializada em criação de carrosséis educativos para Instagram (4 a 5 lâminas).
- [x] Geração de legendas completas com espaçamentos limpos, ganchos magnéticos e bloco de hashtags.

### ✅ Fase 4: Dashboard & Estúdio Visual (Concluída)
- [x] Interface moderna dark mode com paleta esmeralda/zinc.
- [x] Visualizador interativo de carrossel (formato feed 1:1, navegação com setas e bullets).
- [x] Exportação de slides diretamente em imagem `.png` em alta definição (Retina 2x) via `html-to-image`.
- [x] Botão de copiar legenda com 1 clique e botões de aprovação de post.
- [x] Busca instantânea e filtros por status e categoria (Macro, Ações, FIIs, Cripto).

### ✅ Fase 5: Produtividade & Otimização do Estúdio (Concluída)
- [x] **Download em Lote (.ZIP):** Botão para baixar todas as lâminas de uma vez (`slide-1.png`, `slide-2.png`...) com o arquivo `legenda.txt` dentro do pacote.
- [x] **Editor Direto no Slide:** Botão para editar qualquer texto, título ou métrica do slide na tela antes de exportar a imagem.
- [x] **Geração em Lote com IA:** Botão *"Gerar Top 3 (IA)"* no topo para processar as 3 notícias mais relevantes de uma só vez.
- [ ] *(Pausado para o futuro)* **Identidade de Marca Própria:** Definir o `@` e nome da página quando o canal for criado.

---

### 📍 Fase 6: Automação & Notificações (Próximo Passo)
- [ ] **Rotina Matinal Automática:** Script agendado (`node-cron` ou cron local) que acorda todo dia às 07:30h, puxa as notícias da noite/manhã e já deixa os 3 melhores carrosséis prontos.
- [ ] **Bot de Notificação no Telegram:** Enviar um alerta no seu celular quando houver novos carrosséis prontos, com o texto da legenda e as imagens para você só postar.
