# 📈 FinPulse AI — Autonomous Financial Intelligence & Content Studio

<p align="center">
  <img src="https://img.shields.io/badge/Next.js%2016-black?style=for-the-badge&logo=next.js&logoColor=white" alt="Next.js" />
  <img src="https://img.shields.io/badge/React%2019-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" alt="React" />
  <img src="https://img.shields.io/badge/TypeScript%205-007ACC?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Tailwind%20CSS%204-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="Tailwind CSS" />
  <img src="https://img.shields.io/badge/Prisma%20ORM-2D3748?style=for-the-badge&logo=prisma&logoColor=white" alt="Prisma" />
  <img src="https://img.shields.io/badge/Neon%20Postgres-00E599?style=for-the-badge&logo=postgresql&logoColor=black" alt="Neon Postgres" />
  <img src="https://img.shields.io/badge/Google%20Gemini%202.5%20Flash-4285F4?style=for-the-badge&logo=google&logoColor=white" alt="Gemini AI" />
  <img src="https://img.shields.io/badge/Vercel-black?style=for-the-badge&logo=vercel&logoColor=white" alt="Vercel" />
</p>

<p align="center">
  <b>Hub inteligente de inteligência de mercado e estúdio automatizado de conteúdo financeiro: leitura limpa de notícias com diagnóstico de impacto macroeconômico (Score 1 a 10) e geração de carrosséis visuais de alto impacto para redes sociais.</b>
</p>

---

## 💡 O Problema & O Valor de Negócio (Business Case)

Investidores, analistas de RI e criadores de conteúdo financeiro enfrentam dois gargalos diários:
1. **Sobrecarga de Informação & Ruído:** Centenas de matérias são publicadas todo dia em veículos como InfoMoney, Brazil Journal e Money Times. Distinguir o que é oscilação irrelevante do que realmente impacta fundamentos exige tempo.
2. **Gargalo de Produção Visual:** Diagramar carrosséis informativos no Canva ou Figma consome em média **1 a 2 horas por post**.

### 🚀 A Solução FinPulse AI: Uma Plataforma de Duplo Propósito

O **FinPulse AI** une consumo inteligente de mercado e automação de conteúdo em um único workspace:
- 📡 **Ingestão Contínua:** Coleta notícias em tempo real via feeds RSS dos maiores veículos de finanças do Brasil.
- 🧠 **Diagnóstico Macroeconômico com IA:** Avalia o impacto real da notícia (score 1 a 10), separando fatos críticos de ruídos diários.
- 📰 **Modo Leitura & Briefing Executivo:** Permite consumir a síntese da notícia, tese de mercado e impactos em juros, bolsa e fundos em segundos.
- 🎨 **Estúdio Autônomo de Carrosséis:** Transforma qualquer pauta em um carrossel didático de 4 a 5 lâminas com design profissional, edição inline e exportação em alta resolução (PNG e ZIP com legenda.txt).

---

## 🏗️ Arquitetura do Sistema

```mermaid
flowchart TD
    A[Fontes RSS do Mercado\nInfoMoney, Brazil Journal, Money Times, Seu Dinheiro] -->|Ingestão & Deduplicação| B[Next.js Server Actions & API]
    B -->|Pipeline Analítico| C[Google Gemini 2.5 Flash\nScore 1-10 + Diagnóstico + Storyline]
    C -->|Persistência com Connection Pooling| D[(Neon Serverless Postgres\nAWS São Paulo)]
    D -->|Hydration em Tempo Real| E[FinPulse Workspace UI\nNext.js 16 + Tailwind CSS 4]
    
    E -->|Visão 1: Consumo Diário| F[Modo Leitura & Briefing Executivo\nSíntese de Mercado + Impactos]
    E -->|Visão 2: Criação de Conteúdo| G[Estúdio de Carrosséis\nBrand Kit + Temas + Editor Inline]
    
    G -->|Renderização Client-Side GPU| H[html-to-image + JSZip\nDownload PNG 1080px & ZIP com legenda.txt]
```

---

## 🌟 Principais Funcionalidades

### 1. 📰 Modo Leitura & Briefing Executivo
- **Leitura Despoluída de Mercado:** Acompanhe as principais notícias do dia agregadas de veículos confiáveis (InfoMoney, Brazil Journal, Money Times, Seu Dinheiro) sem banners ou anúncios intrusivos.
- **Diagnóstico de Impacto Macroeconômico:** A IA resume o fato em tópicos diretos e contextualiza o impacto no mercado (B3, juros, câmbio e carteiras de investimento).
- **Classificação Visual de Score:** Identificação instantânea entre pautas de *Impacto Crítico* (≥ 8.5), *Alto Impacto* (7.0 - 8.4), *Moderado* (5.0 - 6.9) e *Ruído de Mercado* (< 5.0).
- **Transição Fluida em 1 Clique:** Alterne instantaneamente entre o briefing e o estúdio de carrossel.

### 2. 🧠 Motor de Curadoria & IA Generativa
- **Pipeline Editorial Inteligente:** Análise de relevância baseada em métricas financeiras reais (inflação, juros, balanços trimestrais, M&A).
- **Prompt Engineering Estruturado:** Saída estritamente tipada em JSON, garantindo títulos chamativos, dados destacados e takeaways consistentes sem alucinações.
- **Ajuste de Tom em 1 Clique:** Reescreva legendas e lâminas alternando entre *Formal/Analítico*, *Didático/Iniciante* ou *Urgência de Mercado*.

### 3. 🎨 Estúdio Visual & Design System
- **5 Temas Profissionais Pré-configurados:**
  - 🟢 **B3 Emerald:** Visual inspirado no terminal financeiro com fundo escuro e verde esmeralda.
  - 🔵 **Deep Navy:** Tons azul-marinho profundos voltados a macroeconomia, títulos públicos e juros.
  - 🟡 **Gold Wealth:** Visual sofisticado em âmbar/dourado ideal para fundos imobiliários e dividendos.
  - ⚪ **Clean Minimalist:** Estilo contemporâneo minimalista de alta legibilidade.
  - 🔴 **Ruby Urgency:** Destaque em rubi vibrante para notícias de urgência e reviravoltas de mercado.
- **Brand Kit Customizável:** Configure o nome da sua marca, @handle do Instagram e monograma com persistência em `localStorage`.
- **Modo Edição Inline:** Altere qualquer título, número ou badge diretamente sobre o slide antes de baixar.
- **Controle de Proporção:** Alterne dinamicamente entre formato quadrado `1:1` (1080x1080) e retrato `4:5` (1080x1350).

### 4. 📱 Simulador "Instagram Feed Mockup"
- Visualize exatamente como o carrossel se comportará na linha do tempo do smartphone, incluindo avatar, nome de usuário, proporção 4:5 e legenda expandida.

### 5. 📦 Pipeline de Exportação de Alta Fidelidade
- **Exportação 100% Client-Side:** Gera arquivos PNG em resolução oficial de 1080px utilizando `html-to-image`.
- **Pacote ZIP Automatizado:** Compacta todas as lâminas e inclui o arquivo `legenda.txt` com ganchos, corpo formatado e hashtags estratégicas.

### 6. 🌗 Produtividade & UX Completa
- **Tema Dark / Light Completo:** Alternância suave de modo escuro e claro em toda a interface.
- **Geração em Lote ("Top 3"):** Curadoria e roteirização das notícias mais recentes em fila com respeito a rate limits.
- **CRUD Editorial & Pautas Manuais:** Adicione links ou pautas personalizadas, descarte matérias irrelevantes e gerencie fontes ativas.

---

## 🛠️ Stack Tecnológica & Decisões de Engenharia

| Camada | Tecnologia | Motivação & Decisão de Engenharia |
| :--- | :--- | :--- |
| **Framework** | Next.js 16 (App Router + Turbopack) | Server Components para performance e Server Actions para mutações de dados limpas e seguras. |
| **Linguagem** | TypeScript 5 | Tipagem estrita de ponta a ponta (contratos de dados de RSS, payloads de IA e modelos Prisma). |
| **Interface** | Tailwind CSS 4 + Lucide Icons | Estilização utility-first rápida com design system moderno e responsivo. |
| **ORM** | Prisma 6 | Modelagem relacional intuitiva, migrations seguras e client auto-gerado com zero overhead. |
| **Banco de Dados** | Neon PostgreSQL Serverless | Hospedagem em nuvem na **AWS São Paulo (`sa-east-1`)** com conexão via *Connection Pooling* para ambientes serverless. |
| **Inteligência Artificial** | Google Gemini 2.5 Flash via `@google/genai` | Modelo com excelente capacidade analítica em português, latência abaixo de 2s e custo-benefício superior. |
| **Processamento Visual** | `html-to-image` + `jszip` | **Trade-off arquitetural:** Processar a imagem no navegador do cliente elimina a necessidade de contêineres pesados com Puppeteer no backend, reduzindo os custos de infraestrutura a quase zero. |

---

## 📐 Destaques de Engenharia & Trade-offs

> ### 📌 Por que Client-Side Rendering para Imagens em vez de Puppeteer no Servidor?
> Rodar um navegador headless (Chromium/Puppeteer) no backend em arquiteturas Serverless (como Vercel ou AWS Lambda) introduz restrições severas de limite de memória (bundle > 50MB), tempos de inicialização fria (*cold starts*) elevados e timeouts de execução.
> 
> **A abordagem adotada:** A engine do FinPulse monta uma árvore DOM invisível de alta resolução (1080px) e realiza a rasterização vetorial diretamente na GPU do navegador do cliente usando Canvas/SVG. O resultado é download instantâneo, custo zero de infraestrutura e escalabilidade horizontal ilimitada.

> ### 📌 Persistência & Resiliência Serverless (Neon + Prisma)
> Para evitar esgotamento de conexões (*connection exhaustion*) típico de funções serverless do Next.js, configuramos uma arquitetura dual de URLs:
> - `DATABASE_URL`: Conexão intermediada por *PgBouncer / Neon Pooling* para lidar com picos de acessos simultâneos sem sobrecarregar o Postgres.
> - `DIRECT_URL`: Conexão direta utilizada exclusivamente para comandos de migração estrutural (`prisma db push`).

---

## 🚀 Como Executar Localmente

### Pré-requisitos
- **Node.js** v20+ instalado
- **Git**
- Uma chave gratuita da API do **Google Gemini** ([Google AI Studio](https://aistudio.google.com/))
- Uma instância gratuita do **Neon Postgres** ([neon.tech](https://neon.tech))

### 1. Clonar o Repositório
```bash
git clone https://github.com/EduBraga7/finpulse.git
cd finpulse
```

### 2. Instalar Dependências
```bash
npm install
```

### 3. Configurar Variáveis de Ambiente
Crie um arquivo `.env` na raiz do projeto com base no modelo:
```env
# Conexão com o Neon PostgreSQL
DATABASE_URL="postgresql://usuario:senha@ep-xyz-pooler.sa-east-1.aws.neon.tech/neondb?sslmode=require"
DIRECT_URL="postgresql://usuario:senha@ep-xyz.sa-east-1.aws.neon.tech/neondb?sslmode=require"

# Chave da API do Google Gemini
GEMINI_API_KEY="sua_chave_gemini_aqui"
```

### 4. Sincronizar o Banco de Dados
```bash
npx prisma db push
```

### 5. Iniciar o Ambiente de Desenvolvimento
```bash
npm run dev
```
Abra [http://localhost:3000](http://localhost:3000) no seu navegador para acessar a aplicação.

---

## 📦 Deploy em Produção (Vercel)

O projeto está otimizado para deploy em 1 clique na Vercel:

1. Importe o repositório na **Vercel**.
2. Adicione as variáveis de ambiente:
   - `DATABASE_URL`
   - `DIRECT_URL`
   - `GEMINI_API_KEY`
3. O build (`prisma generate && next build`) rodará automaticamente e publicará a aplicação com certificado SSL e CDN global.

---

## 👨‍💻 Autor

Desenvolvido por **Eduardo Braga**.

- **GitHub:** [@EduBraga7](https://github.com/EduBraga7)
- **LinkedIn:** [Eduardo Braga](https://www.linkedin.com/in/edubraga7/)

---

## 📄 Licença

Este projeto está sob a licença [MIT](./LICENSE).
