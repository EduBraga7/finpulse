# 📈 FinPulse AI — Autonomous Financial Content & Carousel Studio

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
  <b>Plataforma inteligente de curadoria editorial e geração automatizada de carrosséis financeiros de alto impacto para redes sociais (Instagram, LinkedIn e newsletters).</b>
</p>

---

## 💡 O Problema & O Valor de Negócio (Business Case)

Criadores de conteúdo financeiro, analistas de RI e gestoras de investimentos enfrentam um gargalo crítico de produção:
1. **Sobrecarga de Informação:** Centenas de fatos relevantes e notícias são publicadas diariamente em dezenas de veículos (InfoMoney, Brazil Journal, Money Times, etc.).
2. **Tempo Excessivo em Design:** Diagramar carrosséis informativos no Canva ou Figma consome em média **1 a 2 horas por post**.
3. **Inconsistência Visual e Editorial:** Dificuldade em manter linguagem persuasiva com fontes confiáveis e design padronizado.

### 🚀 A Solução FinPulse AI
O **FinPulse AI** automatiza o ciclo completo de produção de conteúdo:
- 📡 **Ingestão Contínua:** Coleta notícias em tempo real via feeds RSS do mercado financeiro brasileiro.
- 🧠 **Curadoria Analítica com IA:** Avalia o impacto de mercado (score 1 a 10), filtra ruídos e categoriza a pauta.
- ✍️ **Storytelling Estruturado:** Transforma notícias complexas em uma narrativa didática de 4 a 6 lâminas (*Radar → O Fato → Impacto nos Mercados → Conclusão/Call to Action*).
- 🎨 **Estúdio Visual de Exportação:** Renderiza carrosséis em resolução nativa (1080x1350 ou 1080x1080) e gera um pacote `.ZIP` com as imagens e a `legenda.txt` pronta para copiar e postar.

---

## 🏗️ Arquitetura do Sistema

```mermaid
flowchart TD
    A[Fontes de Notícias RSS\nInfoMoney, Brazil Journal, Money Times] -->|Ingestão & Parsing| B[Next.js Server Actions & API]
    B -->|Pipeline de Curadoria| C[Google Gemini 2.5 Flash\nScore + Síntese + Storyline]
    C -->|Persistência com Pooled Connection| D[(Neon Serverless Postgres\nAWS São Paulo)]
    D -->|Hydration em Tempo Real| E[FinPulse Studio UI\nNext.js 16 + Tailwind CSS 4]
    E -->|Customização em Tela| F[Brand Kit & Editor Inline de Lâminas]
    F -->|Simulador Mobile| G[Instagram Feed Mockup]
    F -->|Renderização Client-Side\nhtml-to-image + JSZip| H[Download Instantâneo\nPNG 1080px & ZIP com legenda.txt]
```

---

## 🌟 Principais Funcionalidades

### 1. 🧠 Motor de Curadoria & IA Generativa
- **Pipeline Editorial Inteligente:** Análise de relevância baseada em métricas financeiras reais (inflação, juros, balanços trimestrais, M&A).
- **Prompt Engineering Estruturado:** Saída estritamente tipada em JSON, garantindo títulos chamativos, dados destacados e takeaways consistentes sem alucinações.
- **Ajuste de Tom em 1 Clique:** Reescreva legendas e lâminas alternando entre *Formal/Analítico*, *Didático/Iniciante* ou *Urgência de Mercado*.

### 2. 🎨 Estúdio Visual & Design System
- **4 Temas Profissionais Pré-configurados:**
  - 🟢 **Terminal Bloomberg:** Fundo escuro com acentos em verde esmeralda financeiro.
  - ⚪ **Editorial Moderno:** Fundo claro refinado de alta legibilidade.
  - 🟣 **Clean Minimalist:** Estilo minimalista contemporâneo focado em tipografia.
  - 🟡 **Ouro & Safira:** Visual premium voltado a private banking e fundos.
- **Brand Kit Customizável:** Configure o nome da sua marca, @handle do Instagram e monograma com persistência em `localStorage`.
- **Modo Edição Inline:** Altere qualquer título, número ou badge diretamente sobre o slide antes de baixar.
- **Zero Poluição Visual:** Remove marcadores redundantes para garantir compatibilidade estética perfeita com os overlays nativos do Instagram.

### 3. 📱 Simulador "Instagram Feed Mockup"
- Visualize exatamente como o carrossel se comportará na linha do tempo do usuário no smartphone, incluindo avatar, nome de usuário, proporção 4:5 e legenda expandida.

### 4. 📦 Pipeline de Exportação de Alta Fidelidade
- **Exportação 100% Client-Side:** Gera arquivos PNG em resolução oficial de 1080x1350 (4:5) ou 1080x1080 (1:1) utilizando `html-to-image`.
- **Pacote ZIP Automatizado:** Compacta todas as lâminas e inclui o arquivo `legenda.txt` com ganchos, corpo formatado e hashtags estratégicas.

### 5. 🌗 Experiência de Uso (UX)
- **Tema Dark / Light Completo:** Alternância suave de modo escuro e claro em toda a aplicação.
- **CRUD Editorial:** Adicione pautas manuais, exclua postagens descartadas e gerencie fontes ativas.

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
