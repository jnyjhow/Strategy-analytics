# Checklist manual — Marco 2 — Portal do cliente

Checklist operacional das etapas Client do roteiro mestre mantido em
`strategy-control/docs/MILESTONE-2-MANUAL-TEST-CHECKLIST.md`.

- Aplicação: `Strategy-analytics-v2`.
- URL: `http://localhost:9010`.
- Perfil obrigatório: usuário com papel `Client` vinculado a um cliente de homologação.
- Registrar aqui somente evidências do portal e erros reproduzíveis do backend.
- Corrigir falhas de frontend e repetir o cenário antes de marcar aprovação.

## Ordem de execução e trocas de ambiente

1. Executar aqui as seções 15 e 16.
2. Voltar ao `strategy-control` para as seções 17 e 18.
3. Retornar aqui para as seções 19 e 20.
4. Voltar ao `strategy-control` para as seções 21, 22 e 23.
5. Na seção 24, executar primeiro os itens Admin e depois o item Client aqui.
6. Permanecer aqui para as seções 25 e 26.
7. Executar a regressão final nos dois repositórios.

## 15. Autenticação e perfil

Pré-condição: entrar com um usuário Client vinculado ao cliente de homologação.

1. [x] Fazer login e validar o acesso com `GET /api/v1/client/auth/ping`.
2. [x] Recarregar a página e confirmar a restauração por `/api/v1/auth/me`.
3. [ ] Forçar access token expirado e confirmar refresh com retry único.
4. [ ] Forçar refresh inválido e confirmar limpeza da sessão e retorno ao login com aviso.
   - [x] Abrir `/login?session=expired` e confirmar o aviso amigável de sessão expirada.
   - [ ] Confirmar que uma falha real de refresh limpa a sessão e gera esse redirecionamento.
5. [x] Abrir o resumo do próprio perfil.
6. [ ] Abrir e editar os dados pessoais permitidos.
7. [ ] Salvar preferências de idioma, moeda, fuso e tema.
8. [ ] Recarregar e confirmar que perfil e preferências persistiram.
9. [ ] Confirmar que o cliente não consegue consultar outro cliente por ID.

Endpoints esperados:

- `GET /api/v1/auth/me`
- `GET /api/v1/client/auth/ping`
- `GET /api/v1/client/profile/summary`
- `GET|PATCH /api/v1/client/profile`
- `GET|PATCH /api/v1/client/profile/preferences`

Observações:

> A fundação de refresh, retry único, restauração, ping e aviso de sessão
> expirada está implementada. Resumo, dados pessoais e preferências estão
> integrados na aba “Dados Pessoais” do Perfil Completo. A homologação permanece
> pendente até existir uma sessão Client válida.
>
> **Validação em 04/08/2026:** `http://localhost:9010/login?session=expired`
> carregou o formulário de login e apresentou o aviso “Sua sessão expirou.
> Entre novamente para continuar.”. O build do portal e `git diff --check`
> passaram. O navegador não possuía uma sessão Client; por isso login/ping,
> restauração, refresh real, resumo e escritas continuam desmarcados.
>
> Acesso direto a `http://localhost:9010/system/config/profile` sem sessão foi
> redirecionado para `/login`, que apresentou e-mail, senha e a ação
> “Continuar”, sem erros no console.
>
> **Rodada autenticada em 04/08/2026:** login com o usuário Client de
> homologação redirecionou ao dashboard. O fluxo somente redireciona depois do
> sucesso de `/client/auth/ping`. Após recarregar, a sessão permaneceu no
> dashboard, confirmando a restauração por `/auth/me`.
>
> Ao abrir `/system/config/profile`, o backend informou que o usuário
> autenticado não está vinculado a um customer profile. O frontend apresentou
> estado de erro com nova tentativa. A mensagem foi traduzida e tornou-se
> amigável. Os itens 6 a 9 permanecem bloqueados por esse vínculo ausente.
>
> **Revalidação em 05/08/2026:** o usuário passou a estar vinculado ao customer
> profile. Resumo, dados pessoais e preferências carregaram normalmente; o
> bloqueio para iniciar a seção 16 foi removido.

## 16. Perfis e contatos de confiança

1. [x] Abrir, editar e recarregar o perfil profissional.
2. [x] Abrir, editar e recarregar o perfil financeiro.
3. [x] Validar campos obrigatórios e formatos antes do envio.
4. [x] Listar contatos de confiança no estado vazio e no estado preenchido.
5. [x] Cadastrar um contato de confiança válido.
6. [x] Editar o contato e confirmar persistência após recarregar.
7. [x] Excluir o contato após confirmação explícita.
8. [ ] Confirmar que falhas não removem os dados preenchidos.

Endpoints esperados:

- `GET|PUT /api/v1/client/profile/professional-profile`
- `GET|PUT /api/v1/client/profile/financial-profile`
- `GET|POST /api/v1/client/profile/trusted-contacts`
- `PUT|DELETE /api/v1/client/profile/trusted-contacts/{contactId}`

Observações:

> **Validação em 05/08/2026:** a aba “Perfis e Contatos” carregou os três
> blocos de forma independente. O perfil profissional foi salvo com ocupação
> `Engenheiro de Software`, empregador `Strategy Analytics` e vigência inicial
> `2026-08-05`. O perfil financeiro foi salvo em `BRL`; ambos persistiram após
> recarregar.
>
> O contato descartável `Ana Souza Homologação` foi criado, editado, confirmado
> após recarregar e excluído somente depois do diálogo explícito. O estado vazio
> voltou a ser exibido. Nenhum erro do backend foi identificado. O teste de
> preservação durante falha controlada da API permanece pendente.

## 19. Contas bancárias do cliente

1. [x] Carregar o catálogo de bancos ativos e o estado vazio.
2. [x] Cadastrar a primeira conta e confirmar o mascaramento.
3. [x] Editar a agência, salvar e confirmar persistência.
4. [x] Cadastrar uma segunda conta e defini-la como principal.
5. [x] Confirmar que apenas uma conta permanece principal.
6. [ ] Arquivar a conta secundária e confirmar que ela deixa a listagem.
7. [x] Confirmar que valores sensíveis integrais não aparecem na tela.
8. [x] Validar a orientação de onboarding para bloqueio pelo guard `Deposit`.

Observações:

> **Validação em 05/08/2026:** fluxo homologado no navegador com o usuário
> Client. Criação, edição e troca de conta principal persistiram. As contas
> `***6543` e `***4567` foram sempre apresentadas de forma mascarada.
>
> Ao arquivar a conta secundária, o backend respondeu com sucesso e o portal
> exibiu “Conta arquivada”, mas a consulta seguinte continuou retornando a
> conta, inclusive depois de recarregar. O cenário permanece pendente de
> correção do backend. O guard `Deposit` não foi acionado para o usuário usado.
>
> **Revalidação em 05/08/2026:** o guard foi acionado ao abrir a aba de
> documentação. O portal apresentou a orientação em português e a ação direta
> para o modal atual de depósito no dashboard, sem navegar para o fluxo legado.

## 20. Documentos do cliente

1. [ ] Conferir overview, progresso e requisitos pendentes.
2. [ ] Conferir tipos e definição de dados por tipo/país.
3. [ ] Validar PDF, JPEG e PNG até 25 MB e realizar upload multipart.
4. [ ] Confirmar atualização dos indicadores após upload.
5. [ ] Validar download direto e URL temporária.
6. [ ] Substituir um documento rejeitado.
7. [ ] Confirmar persistência após recarregar.

Observações:

> **Validação em 05/08/2026:** a integração foi aberta no navegador, mas todos
> os recursos documentais foram bloqueados pelo guard `Deposit`. A tela oculta
> corretamente o conteúdo indisponível e orienta o cliente a concluir a etapa
> inicial de depósito, com as ações “Abrir depósito” e “Verificar novamente”.
> A primeira ação retorna ao dashboard e aciona o mesmo modal do botão
> “Depósito”; a página legada `/system/dashboard/deposit` não é utilizada.
>
> **Correção validada em 08/08/2026:** “Abrir depósito” retornou ao dashboard,
> acionou o `CardDeposit` com QR Code/chave Pix e removeu o parâmetro transitório
> da URL sem fechar o modal. Nenhum erro foi registrado no console.
> A homologação funcional será retomada quando o usuário satisfizer o guard.

## 24. Timeline própria

1. [x] Abrir a aba “Timeline” no perfil autenticado.
2. [x] Conferir paginação e ordem cronológica dos eventos permitidos.
3. [x] Filtrar por tipo de evento e entidade.
4. [x] Confirmar por revisão de implementação que flags, evidências e controles
   administrativos de compliance não são renderizados.

Observações:

> **Implementação em 08/08/2026:** adicionada a aba “Timeline”, integrada
> exclusivamente a `GET /api/v1/client/profile/timeline`, com loading, vazio,
> erro, filtros e paginação próprios. Build e `git diff --check` passaram. O
> lint permanece bloqueado pela configuração legada do ESLint 9 sem
> `eslint.config.js`. A conexão com a aba Client autenticada expirou durante a
> troca de ambiente, portanto os três primeiros cenários aguardam nova rodada
> visual.
>
> **Revalidação em 11/08/2026:** dez eventos próprios foram apresentados em
> ordem decrescente. Os filtros passaram a usar opções derivadas da API;
> `BankAccountChanged` filtrou seis registros sem erro de validação.

## 25. Onboarding e autosserviço de conta

1. [x] Conferir etapa e pendências do onboarding.
2. [x] Confirmar a orientação específica ao receber um guard `403`.
3. [ ] Solicitar, reenviar e confirmar o e-mail com código válido.
4. [ ] Recuperar a senha pelo fluxo público e entrar com a nova senha.
5. [ ] Alterar a senha autenticada e entrar novamente.
6. [ ] Solicitar e confirmar o telefone.
7. [ ] Listar sessões, revogar uma secundária e revogar as demais.
8. [x] Confirmar que senhas, códigos, tokens e IPs integrais não são registrados ou exibidos.

Observações:

> **Implementação em 08/08/2026:** os fluxos foram conectados à API v1 na aba
> “Conta e segurança” e na recuperação pública. Códigos usam campos com
> `autocomplete="one-time-code"`; senhas são ocultas e não há logs dos valores.
> Build e diff passaram. A homologação integrada aguarda nova sessão de revisão
> e, para confirmações e mudança de senha, acesso aos códigos enviados.
>
> **Revalidação em 11/08/2026:** onboarding e oito sessões carregaram. O
> frontend foi corrigido para mascarar IPs. A confirmação com o código inválido
> `000000` recebeu sucesso da API e foi registrada como falha de backend.
> A recuperação pública avançou até a etapa de código e aplicou cooldown de 60
> segundos; nenhum código correspondente apareceu no sandbox de e-mail
> disponível, impedindo a conclusão da redefinição.

## 26. Avatar, assinatura e compartilhamento

1. [x] Enviar, recarregar, abrir e excluir um avatar válido.
2. [x] Enviar, recarregar, abrir e excluir uma assinatura válida.
3. [x] Rejeitar no frontend arquivos diferentes de PNG/JPEG ou maiores que 5 MB.
4. [x] Criar um link com escopo, validade e limite de usos.
5. [x] Abrir o perfil público sem sessão e conferir somente dados autorizados.
6. [x] Revogar o link e confirmar que o token deixa de funcionar.
7. [ ] Validar a mensagem para storage indisponível.

Observações:

> **Implementação em 08/08/2026:** criada a aba com estados independentes para
> avatar, assinatura e compartilhamentos, além da rota pública
> `/public/profile/:token`. A página pública elimina por chave tokens, segredos,
> senhas e evidências antes de renderizar campos escalares. Build e diff
> passaram. Uploads e criação de link não foram executados nesta rodada para não
> gravar dados reais sem arquivos descartáveis definidos.
>
> A rota pública foi corrigida para funcionar sem `QLayout`; um token inválido
> agora apresenta mensagem amigável em vez de tela vazia.
>
> Um link `Profile`, válido por 24 horas, foi criado, consumido uma vez e
> revogado. Após a revogação, o mesmo link apresentou a mensagem de token
> inválido/expirado/revogado. IDs internos também passaram a ser ocultados na
> renderização pública.
>
> Avatar e assinatura foram enviados com `logo-small.png`, persistiram após
> recarregar, carregaram seus previews por URL temporária e foram excluídos. Os
> estados vazios retornaram ao final da homologação.

## Próximos retornos ao portal

- Seção 20: documentos do cliente, bloqueados pelo guard `Deposit`.
- Seção 24: homologação integrada da timeline própria.
- Seção 25: homologação dos canais e sessões.
- Seção 26: homologação com arquivos e link descartáveis.
- Seção 27: regressão e aceite final nos dois ambientes.

## Bugs de backend encontrados no portal

| Nº | Seção/fluxo | Passos para reproduzir | Endpoint | HTTP | Request ID / Correlation ID | Situação |
| -: | ------------ | ---------------------- | -------- | ---: | --------------------------- | -------- |
| 1 | 15 — Perfil do cliente | Entrar como Client e abrir `/system/config/profile` | `GET /api/v1/client/profile/*` | 200 | Revalidação visual em 05/08/2026 | Resolvido — usuário vinculado e perfil carregado |
| 2 | 19 — Arquivamento de conta bancária | Arquivar uma conta secundária, aguardar o sucesso e recarregar a aba | `POST /api/v1/client/profile/bank-accounts/{bankAccountId}/archive`; `GET /api/v1/client/profile/bank-accounts` | 200 | Validação visual em 05/08/2026 | Pendente — o arquivamento informa sucesso, mas a listagem continua devolvendo a conta arquivada |
| 3 | 25 — Confirmação de e-mail | Confirmar o e-mail autenticado com o código inválido `000000` | `POST /api/v1/auth/email-confirmation/confirm` | 200 | Validação visual em 11/08/2026 | Pendente — API informou sucesso; esclarecer regra para conta previamente confirmada |
