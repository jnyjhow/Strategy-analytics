# Arquitetura visual do portal do cliente

## Identidade

O portal autenticado usa fundo temático escuro, conteúdo branco, cards `.tool`,
tipografia e cores configuradas pelo tema atual. As telas novas devem parecer
parte desse ambiente e não uma reprodução do painel administrativo.

## Estrutura de página

- Usar `src/system/layouts/MainLayout.vue` como estrutura autenticada.
- Usar `TitlePage` para título, contexto e retorno.
- Organizar configurações em uma coluna principal; abas são adequadas quando os
  grupos já fazem parte da navegação existente.
- Usar cards `.tool` para separar grupos, com títulos e ações discretas.
- Em telas pequenas, campos e colunas devem ocupar toda a largura.

## Formulários e ações

- Reutilizar componentes de `src/system/components/form` quando aplicável.
- Preservar rótulos externos, inputs densos e os estilos globais do portal.
- Edição deve ser explícita, com salvar e descartar próximos ao título do bloco.
- Desabilitar ações durante a escrita e preservar os dados após falha.
- Mensagens devem explicar a ação possível sem expor detalhes técnicos.

## Integração

- Usar somente `src/services/clientApi.js` para endpoints `/api/v1/client/*` e
  autenticação do portal.
- Restauração da sessão usa `/api/v1/auth/me`; autorização de cliente usa
  `/api/v1/client/auth/ping`.
- Refresh possui retry único e requisições concorrentes compartilham uma única
  tentativa de renovação.
- Dados fictícios existentes não devem ser transportados para novos fluxos.
- Respostas sensíveis podem ser usadas para envio, mas nunca renderizadas ou
  registradas integralmente.

## Critérios de aceite

Comparar visualmente com Configurações e Perfil, testar desktop/mobile, loading,
vazio, sucesso e falha, e executar lint, build e `git diff --check`.
