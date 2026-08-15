# Deploy de produção

O deploy de produção é executado pelo GitHub Actions após cada push na branch
`main`. Também pode ser iniciado manualmente pela aba **Actions**
(`Deploy production` > *Run workflow*).

O workflow gera a SPA e envia os arquivos por SSH para uma pasta identificada
pelo SHA do commit. Ao final, o link simbólico `current` é trocado de forma
atômica para a nova release.

## Configuração no GitHub

O environment `production` já está criado em **Settings > Environments**,
restrito à branch `main`, com os secrets:

- `SSH_HOST`: hostname ou IP do servidor;
- `SSH_USER`: usuário de deploy sem acesso administrativo;
- `SSH_PORT`: porta SSH, normalmente `22`;
- `SSH_DEPLOY_PATH`: diretório absoluto dedicado ao frontend, sem `/` no final;
- `SSH_PRIVATE_KEY`: chave privada exclusiva do GitHub Actions;
- `SSH_KNOWN_HOSTS`: chave pública do host no formato de `known_hosts`.

O build de produção usa os valores fixos de `quasar.config.js` (`build.env`).
A única variável lida do ambiente é `WEB_URL`; se ela for necessária, crie a
variável de environment `WEB_URL` em **Settings > Environments > production >
Variables**.

As credenciais FTP antigas não são utilizadas neste workflow.

## Estrutura no servidor

```
SSH_DEPLOY_PATH/
├── releases/
│   └── <commit-sha>/     # conteúdo de dist/spa
└── current -> releases/<commit-sha>
```

O usuário de deploy precisa de escrita em `SSH_DEPLOY_PATH` (para trocar o
symlink) e em `SSH_DEPLOY_PATH/releases`. O servidor precisa de `rsync`
instalado.

## Configuração do servidor web

Aponte o document root do Nginx para `SSH_DEPLOY_PATH/current`. Como a
aplicação usa Vue Router em modo history, direcione rotas não encontradas para
`index.html`:

```nginx
root /caminho/do/frontend/current;

location / {
    try_files $uri $uri/ /index.html;
}
```

Para obter `SSH_KNOWN_HOSTS`, use a chave pública do próprio host
(`/etc/ssh/ssh_host_ed25519_key.pub`) no formato `IP tipo chave`, ou execute
`ssh-keyscan` a partir de uma máquina confiável conferindo a fingerprint. Não
faça essa descoberta automaticamente durante o deploy, pois isso removeria a
validação da identidade do servidor.

## Rollback

As releases anteriores permanecem em `SSH_DEPLOY_PATH/releases`. Para voltar a
uma delas, atualize o link simbólico no servidor:

```bash
ln -sfn /caminho/do/frontend/releases/COMMIT_SHA /caminho/do/frontend/current.next
mv -Tf /caminho/do/frontend/current.next /caminho/do/frontend/current
```

Depois de confirmar que uma release está estável, releases antigas podem ser
removidas manualmente conforme a política de retenção do servidor.

## Lint

O script `npm run lint` está quebrado neste repositório (ESLint 9 exige
`eslint.config.js`, mas o projeto ainda usa `.eslintrc.cjs`). Por isso o
workflow não executa lint. Depois de migrar a configuração do ESLint, adicione
o passo `npm run lint` antes do build.
