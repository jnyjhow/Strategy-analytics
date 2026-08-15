---
name: Strategy Analytics Portal
description: Portal patrimonial sofisticado, sóbrio e preciso, com profundidade translúcida sobre o gradiente azul–vermelho da marca.
colors:
  signal-blue: "#00a3ff"
  portal-white: "#ffffff"
  muted-silver: "#dcdcdc"
  secondary-silver: "#696868"
  glass-border: "#efefef14"
  glass-fill-strong: "rgba(0, 0, 0, 0.24)"
  glass-fill-mid: "rgba(0, 0, 0, 0.08)"
  glass-fill-soft: "rgba(0, 0, 0, 0.04)"
  field-white: "#ffffff"
  field-ink: "#1d1d1d"
  success: "#52c41a"
  danger: "#ff4d4f"
  warning: "#ff991f"
typography:
  headline:
    fontFamily: "Roboto, Oxygen, Ubuntu, Cantarell, Open Sans, Helvetica Neue, sans-serif"
    fontSize: "30px"
    fontWeight: 700
    lineHeight: "1.2"
  title:
    fontFamily: "Roboto, Oxygen, Ubuntu, Cantarell, Open Sans, Helvetica Neue, sans-serif"
    fontSize: "16px"
    fontWeight: 700
    lineHeight: "24px"
  body:
    fontFamily: "Roboto, Oxygen, Ubuntu, Cantarell, Open Sans, Helvetica Neue, sans-serif"
    fontSize: "14px"
    fontWeight: 400
    lineHeight: "1.5"
  label:
    fontFamily: "Roboto, Oxygen, Ubuntu, Cantarell, Open Sans, Helvetica Neue, sans-serif"
    fontSize: "14px"
    fontWeight: 400
    lineHeight: "1.4"
rounded:
  control: "4px"
  surface: "8px"
  pill: "20px"
spacing:
  xs: "4px"
  sm: "8px"
  md: "16px"
  lg: "24px"
  xl: "32px"
components:
  profile-card:
    backgroundColor: "{colors.glass-fill-strong}"
    textColor: "{colors.portal-white}"
    rounded: "{rounded.surface}"
    padding: "{spacing.lg}"
  edit-field:
    backgroundColor: "{colors.field-white}"
    textColor: "{colors.field-ink}"
    rounded: "{rounded.control}"
    height: "40px"
  action-link:
    textColor: "{colors.signal-blue}"
    typography: "{typography.label}"
    padding: "{spacing.xs} {spacing.sm}"
---

# Design System: Strategy Analytics Portal

## Overview

**Creative North Star: "Sala de Controle Patrimonial"**

O portal deve parecer uma sala de controle financeira privada: sofisticada, sóbria e precisa. O gradiente azul–vermelho é uma assinatura permanente da área autenticada, enquanto superfícies escuras e translúcidas organizam informações sem esconder essa atmosfera.

A leitura é prioritária e compacta. A edição não cria uma página visualmente diferente: mantém a navegação, o cartão, o título e a posição da seção, substituindo apenas os valores por campos brancos de texto escuro. A página de perfil existente antes da expansão de funcionalidades — reconstruída pelo commit local `55c0eca5a4e97e3c967e475e87053a2edbe0945b` e pelas imagens aprovadas — é a autoridade visual. O SHA informado `d1dcbcc0a5fbaf94a2d3c8ab037b48b73fd697df` não está disponível no histórico local nem no remoto consultado.

**Key Characteristics:**

- Gradiente azul–vermelho sempre visível como ambiente da área autenticada.
- Cartões de vidro escuro com borda e sombra discretas.
- Hierarquia tipográfica curta, clara e orientada a dados.
- Edição local, explícita e independente por seção.
- Campos brancos com texto preto somente durante a edição.
- Uma coluna confortável em telas pequenas, mesmo com maior rolagem vertical.

## Colors

A paleta combina um ambiente escuro e cinematográfico com azul de ação, texto claro e campos brancos de alto contraste durante a edição.

### Primary

- **Azul de Sinal:** reservado para ações, estado ativo, foco e confirmação; deve ser raro o bastante para continuar inequívoco.

### Secondary

- **Prata Secundária:** sustenta textos auxiliares, estados inativos e controles menos importantes.

### Neutral

- **Branco do Portal:** títulos, valores e informação prioritária sobre superfícies escuras.
- **Prata Suave:** rótulos e informação secundária sobre o fundo escuro.
- **Vidro Noturno:** preenchimentos pretos translúcidos em três intensidades para cartões e navegação.
- **Borda Nebulosa:** delimita cartões sem produzir caixas pesadas.
- **Papel de Edição:** superfície branca exclusiva dos campos editáveis, sempre com texto escuro.

**The Permanent Gradient Rule.** O gradiente azul–vermelho permanece presente em todas as telas autenticadas; cartões não podem cobri-lo com superfícies opacas extensas.

**The White Field Rule.** Branco sólido é linguagem de campo editável, não de cartão, painel ou fundo de página.

## Typography

**Display Font:** Roboto, com fallbacks de sistema.
**Body Font:** Roboto, com fallbacks de sistema.

**Character:** Tipografia funcional, direta e legível. Peso e contraste distinguem títulos, rótulos e valores; efeitos decorativos não participam da hierarquia.

### Hierarchy

- **Headline** (700, 30px, 1.2): título principal da página ao lado da ação de voltar.
- **Title** (700, 16px, 24px): nome de seção e informação estrutural.
- **Body** (400, 14px, 1.5): valores, navegação e ações textuais.
- **Label** (400, 14px, 1.4): rótulos externos aos campos e metadados em prata suave.

**The Label-and-Value Rule.** Em leitura, rótulos são discretos e valores são claros e mais fortes; ambos permanecem alinhados pela mesma grade.

## Layout

O perfil usa uma única coluna principal. O cabeçalho contextual vem primeiro, seguido pela barra de abas e pelos cartões empilhados. Cada cartão utiliza preenchimento interno amplo (24px) e separação vertical consistente (24px). Não criar painéis laterais ou cartões concorrentes lado a lado para editar dados de perfil.

Na visualização, dados são distribuídos em uma grade responsiva de colunas para facilitar varredura horizontal. Na edição, a mesma seção e sua ordem são preservadas; os campos podem ocupar larguras diferentes conforme o conteúdo, mas devem formar linhas equilibradas, compactas e alinhadas. Salvar e Descartar ficam junto ao título do bloco. Apenas uma seção precisa mudar de estado por vez.

Em telas pequenas, abas podem rolar horizontalmente e toda grade interna colapsa para uma coluna. Legibilidade e alvos de toque prevalecem sobre a tentativa de reduzir a altura da página.

**The Stable Section Rule.** Entrar em edição não altera a posição, a largura externa, o título nem a identidade do cartão; somente seu conteúdo interno troca valores por controles.

## Elevation & Depth

A profundidade é híbrida: nasce principalmente de transparência tonal e desfoque, complementados por uma sombra ambiente curta. Cartões usam gradiente preto translúcido, borda quase imperceptível e `backdrop-filter` para permitir que o gradiente da página continue participando da composição.

### Shadow Vocabulary

- **Sombra Ambiente de Cartão** (`4px 4px 12px rgba(0, 0, 0, 0.24)`): usada em cartões e superfícies translúcidas, sem simular elevação física exagerada.
- **Desfoque de Vidro** (`backdrop-filter: blur(32px)`): integra cartões e navegação ao ambiente azul–vermelho.

**The Ambient Depth Rule.** Profundidade deve organizar camadas silenciosamente; não usar sombras grandes, claras ou decorativas em formulários comuns.

## Shapes

Superfícies usam cantos suavemente curvos (8px). Campos e itens ativos podem usar raio menor (4px), reforçando que são controles dentro de uma superfície maior. Bordas são finas e translúcidas. Formas de pílula ficam restritas a indicadores realmente compactos, não a botões e campos comuns.

## Components

### Buttons and Inline Actions

- **Shape:** ações textuais são compactas e não competem com o título da seção.
- **Primary:** Salvar usa azul de sinal e ícone de confirmação; permanece próximo ao título do cartão.
- **Secondary:** Descartar usa prata secundária e não recebe preenchimento chamativo.
- **Edit:** Editar combina ícone pequeno e texto claro, ao lado do título da seção.
- **Hover / Focus:** reforçar contraste e foco de modo discreto, preservando a posição do conteúdo.

### Cards / Containers

- **Corner Style:** cantos de superfície (8px).
- **Background:** vidro noturno em gradiente translúcido; nunca branco sólido.
- **Shadow Strategy:** sombra ambiente curta e desfoque do fundo.
- **Border:** traço claro de baixa opacidade.
- **Internal Padding:** 24px no desktop, reduzido de forma consistente em telas pequenas.

### Inputs / Fields

- **Style:** campo branco, texto preto, rótulo externo claro e altura compacta (40px). Placeholders e ícones usam cinza legível.
- **Focus:** borda ou anel em azul de sinal, sem alterar dimensões.
- **Error / Disabled:** erros usam vermelho sem remover o texto explicativo; desabilitados reduzem contraste, mas continuam legíveis.
- **Density:** campos formam uma grade compacta; não devem parecer cartões brancos independentes.

### Navigation

As cinco áreas históricas — Dados Pessoais, Documentação, Contas Bancárias, Registro de Patrimônios e Contratos e Termos — estabelecem o padrão da barra de abas. Texto inativo é prateado; a aba ativa é branca e recebe sublinhado claro/azul. Em telas menores, a barra rola horizontalmente sem quebrar rótulos em várias linhas.

### Profile Section

Cada seção é uma unidade independente de leitura e escrita. O estado de leitura mostra rótulo e valor. O clique em Editar mantém o cartão no lugar, troca o conteúdo por campos brancos e substitui Editar por Salvar e Descartar. Salvar, erro e carregamento pertencem à própria seção e não bloqueiam as demais.

## Do's and Don'ts

### Do:

- **Do** manter o gradiente azul–vermelho visível atrás das superfícies autenticadas.
- **Do** preservar exatamente a estrutura externa do cartão entre leitura e edição.
- **Do** editar uma seção por vez, com Salvar e Descartar próximos ao título.
- **Do** usar campos brancos com texto preto durante a edição.
- **Do** alinhar rótulos, valores e controles em uma grade responsiva e compacta.
- **Do** colapsar a grade para uma coluna legível em telas pequenas.

### Don't:

- **Don't** transformar a edição em uma página ou painel visualmente separado.
- **Don't** usar cartões brancos ou fundos opacos extensos que apaguem o gradiente.
- **Don't** espalhar ações de uma seção no rodapé global ou longe do título correspondente.
- **Don't** exibir todas as seções em modo de edição ao mesmo tempo por padrão.
- **Don't** criar cards lado a lado para o fluxo de edição do perfil.
- **Don't** permitir que novas funcionalidades alterem a hierarquia visual das cinco áreas principais.
