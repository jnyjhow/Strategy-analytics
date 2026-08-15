# Orientações para agentes e colaboradores

## Escopo

Este repositório contém o site público e o portal de autosserviço do cliente.
O contrato HTTP define dados e operações; ele não redefine a navegação nem a
identidade visual existente do portal.

## Antes de implementar

1. Leia `docs/PORTAL-UI-ARCHITECTURE.md`.
2. Consulte os checklists do Marco 2 no repositório `strategy-control`.
3. Compare a alteração com as telas em `src/system/pages` e os componentes em
   `src/system/components` antes de criar uma nova composição.
4. Preserve o site público quando a tarefa estiver limitada ao portal.

## Regras do portal

- Reutilize `TitlePage`, cards `.tool`, componentes de formulário e tokens de
  tema existentes.
- Mantenha estados de loading, vazio, erro e retry por bloco assíncrono.
- Não use dados fake em fluxos integrados à API do Marco 2.
- Não adapte a interface ao formato dos endpoints quando isso quebrar o padrão
  visual do portal.
- Nunca mostre tokens, códigos, senhas ou dados bancários integrais.
- Escritas devem passar pela instância `clientApi`, com autenticação,
  idempotência e retry controlados centralmente.
- Um erro de backend deve ser registrado no checklist manual; erros de frontend
  devem ser corrigidos antes da homologação.

## Qualidade

Antes de concluir uma alteração, execute `npm run lint`, `npm run build` e
`git diff --check`, além de revisar visualmente o fluxo afetado.
