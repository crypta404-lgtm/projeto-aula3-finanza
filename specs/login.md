# Spec — Tela "Entrar"

| Item        | Valor                                          |
|-------------|------------------------------------------------|
| Produto     | Finanza — sistema financeiro da empresa        |
| Escopo      | Tela de entrada (login) do sistema             |
| Tecnologias | HTML5 + CSS3 (JS só para comportamento)        |
| Arquivos    | `login.html`, `login.css`, `login.js` (+ reaproveita `styles.css`) |
| Status      | v1 — apenas front-end, **sem autenticação real** |

---

## 1. Objetivo

Ser a porta de entrada do Finanza: o usuário informa e-mail e senha e entra no sistema. A tela deve seguir a mesma identidade visual da tela "Nova Transação" (cores, fontes, campos e botões), com aparência **sóbria, elegante e corporativa**.

### Fora do escopo (v1)
- Autenticação de verdade (não existe back-end; nenhuma senha é conferida).
- Telas de "Criar conta" e "Recuperar conta" (os links existem, mas não abrem nada).
- Bloquear o acesso ao `index.html` para quem não "entrou" — sem back-end isso seria só aparência de segurança (qualquer um contorna pelo DevTools), então **não deve ser feito**.
- Login social (Google, Microsoft etc.).

---

## 2. Estrutura da tela

```
                                                       fundo --bg com o mesmo
                                                       brilho dourado do topo

                         [F] Finanza                   ← marca centralizada

              ┌──────────────────────────────────┐
              │  Entrar                          │     ← h1 serifado
              │  Acesse o painel financeiro      │
              │  da empresa.                     │
              │                                  │
              │  E-mail                          │
              │  [ ✉  nome@empresa.com.br      ] │
              │                                  │
              │  Senha              Recuperar conta │  ← link alinhado à direita
              │  [ 🔒 ••••••••              👁 ] │
              │                                  │
              │  [        →  Entrar            ] │     ← botão primário, largura total
              │                                  │
              │  ─────────────────────────────── │
              │  Não tem conta?  Criar conta     │     ← rodapé do card
              └──────────────────────────────────┘

              © 2026 Finanza · Uso interno
```

### 2.1 Página
- **Sem o cabeçalho escuro** (`.topbar`) da tela de transações: quem ainda não entrou não deve ver a navegação do sistema.
- Conteúdo centralizado vertical e horizontalmente (`min-height: 100vh`).
- Fundo igual ao do `index.html` (`--bg` + gradiente radial dourado no topo).

### 2.2 Marca
- Logo (quadrado dourado com "F") + "Finanza" em Playfair Display, centralizados acima do card.
- Mesmo visual do `.brand` do cabeçalho, mas com texto escuro (`--ink`) por estar sobre fundo claro.

### 2.3 Card
- Branco (`--surface`), largura máx. **420px**, raio 20px, `--shadow-card`, padding interno 40px (24px no celular).
- Título `<h1>` "Entrar" em Playfair Display 32px.
- Subtítulo em `--ink-soft`: "Acesse o painel financeiro da empresa."
- Campos empilhados (rótulo acima do campo) — diferente da lista horizontal da tela de transação, porque aqui são só 2 campos num card estreito.
- Rodapé separado por linha fina (`--line`), com o texto "Não tem conta?" e o link "Criar conta".

### 2.4 Rodapé da página
- Texto pequeno em `--ink-muted`: "© 2026 Finanza · Uso interno".

---

## 3. Campos

| # | Campo  | `id` / `name` | Elemento                  | Obrigatório | Atributos importantes |
|---|--------|---------------|---------------------------|-------------|-----------------------|
| 1 | E-mail | `email`       | `<input type="email">`    | Sim         | `autocomplete="username"`, `inputmode="email"`, `autocapitalize="off"`, `spellcheck="false"`, placeholder `nome@empresa.com.br` |
| 2 | Senha  | `senha`       | `<input type="password">` | Sim         | `autocomplete="current-password"`, placeholder `Sua senha` |

### Detalhes por campo

**E-mail**
- Ícone de envelope à esquerda, dentro do campo (dourado; verde quando em foco, como na outra tela).
- Espaços nas pontas são removidos antes de validar.

**Senha**
- Ícone de cadeado à esquerda, dentro do campo.
- Botão de **mostrar/ocultar senha** (ícone de olho) à direita, dentro do campo:
  - `type="button"`, `aria-label` alterna entre "Mostrar senha" e "Ocultar senha", `aria-pressed` reflete o estado.
  - Alterna o `type` do input entre `password` e `text`.
- O link **"Recuperar conta"** fica na mesma linha do rótulo "Senha", alinhado à direita.
- **Sem regra de tamanho mínimo no login**: regra de força de senha pertence à tela de criar conta. Aqui só se exige que não esteja vazio.

---

## 4. Links e botões

| Elemento        | Tipo     | Estilo                                     | Comportamento (v1) |
|-----------------|----------|--------------------------------------------|--------------------|
| Entrar          | `<button type="submit">` | Primário (`--primary`), largura total, ícone → | Valida; se ok, mostra carregamento e vai para `index.html` |
| Recuperar conta | `<a href="#">` | Link pequeno, cor `--primary`, sublinhado no hover | Não faz nada (sem navegação) |
| Criar conta     | `<a href="#">` | Link em negrito, cor `--primary`, sublinhado no hover | Não faz nada (sem navegação) |

- Os links com `href="#"` não devem pular a página para o topo: usar `preventDefault()` no clique.

### Estado de carregamento (botão Entrar)
1. Após validar com sucesso, o botão fica desabilitado, troca o texto para **"Entrando…"** e mostra um spinner discreto.
2. Após ~800ms, redireciona para `index.html`.
3. Duplo clique não pode disparar dois envios.

---

## 5. Regras de validação

A validação acontece ao clicar em **Entrar** (o formulário usa `novalidate` para não exibir os balões nativos do navegador). Campo inválido fica com borda vermelha e mensagem abaixo; o foco vai para o primeiro campo com erro; o erro some assim que o usuário corrige o campo — **mesmo padrão da tela de transação** (`.field.is-invalid` + `.field__error`).

| Campo  | Regra | Mensagem |
|--------|-------|----------|
| E-mail | Preenchido | Informe seu e-mail. |
| E-mail | Formato válido (`algo@dominio.ext`) | Informe um e-mail válido. |
| Senha  | Preenchida | Informe sua senha. |

- Cada mensagem é ligada ao seu campo por `aria-describedby`, e o campo recebe `aria-invalid="true"` enquanto estiver com erro.

### Mensagem para quando houver back-end (deixar preparado, não usar na v1)
- Erro de credencial deve ser **genérico**, num aviso acima dos campos: "E-mail ou senha incorretos." — nunca dizer qual dos dois está errado (evita descobrir quais e-mails existem no sistema).

---

## 6. Dados e segurança

- **A senha nunca é salva** — nem em `localStorage`, `sessionStorage`, cookie, URL ou `console.log`.
- Nada é gravado no navegador nesta versão.
- O formulário não pode enviar os dados por `GET` (a senha apareceria na URL): o `submit` é sempre interceptado por JS.

---

## 7. Identidade visual

Reaproveitar **os tokens de `:root` em `styles.css`** — não duplicar cores nem criar novas. `login.html` carrega `styles.css` (tokens, reset, campos, botões) e `login.css` só com o que é específico desta tela (layout centralizado, card, marca em fundo claro, botão de olho, spinner).

| Elemento        | Valor |
|-----------------|-------|
| Fundo           | `--bg` + gradiente radial dourado (igual ao `index.html`) |
| Card            | `--surface`, raio 20px, `--shadow-card` |
| Campos e botões | Altura 46px, raio `--radius-sm` (10px), foco com `--focus` |
| Botão primário  | `--primary` / hover `--primary-hover` |
| Ícones          | `--accent`; `--primary` com o campo em foco |
| Erros           | `--danger` / `--danger-soft` |
| Fontes          | Inter (textos) e Playfair Display (marca e título) |

---

## 8. Responsividade

| Largura | Comportamento |
|---------|---------------|
| > 480px | Card de 420px centralizado |
| ≤ 480px | Card ocupa a largura toda com margem lateral de 16px; padding interno 24px; título 28px |

- Sem rolagem horizontal em 375px.
- Em telas baixas (ex.: celular deitado), a página pode rolar na vertical — o card nunca é cortado.

---

## 9. Acessibilidade

- `lang="pt-BR"` e `<title>Entrar — Finanza</title>`.
- `<main>` envolvendo o card; um único `<h1>` ("Entrar").
- Todo campo com `<label for>` ligado ao `id`.
- Botão de olho com `aria-label` e `aria-pressed`.
- Ícones decorativos com `aria-hidden="true"`.
- Erros anunciados via `aria-describedby` + `aria-invalid`.
- Estado "Entrando…" anunciado (`aria-live="polite"` ou `aria-busy` no formulário).
- Ordem do Tab: e-mail → senha → olho → Recuperar conta → Entrar → Criar conta.
  - Para isso, no HTML o link "Recuperar conta" vem **depois** do campo de senha, e é posicionado na linha do rótulo via CSS Grid (`grid-template-areas`) — não com `position: absolute` nem `tabindex`.
- Foco sempre visível.

---

## 10. Testes

Criar `tests/login.tests.html` no **mesmo padrão** de `tests/tests.html` (carrega `../login.html` num `iframe` e mostra `n/n testes passaram`). Cobrir os critérios de aceite abaixo. Adicionar no README como rodar.

---

## 11. Critérios de aceite

- [ ] `login.html` abre sem o cabeçalho de navegação, com marca, card e rodapé centralizados.
- [ ] O card tem o título "Entrar", os campos E-mail e Senha, o botão "Entrar" e os links "Recuperar conta" e "Criar conta".
- [ ] Os campos têm os atributos `type` e `autocomplete` da seção 3 (o gerenciador de senhas do navegador oferece preencher).
- [ ] Entrar com tudo vazio mostra "Informe seu e-mail." e "Informe sua senha." e foca o e-mail.
- [ ] E-mail `abc` mostra "Informe um e-mail válido."
- [ ] Corrigir um campo remove o erro dele na hora.
- [ ] O olho alterna a senha entre visível e oculta e atualiza `aria-label`/`aria-pressed`.
- [ ] Com dados válidos, o botão mostra "Entrando…", fica desabilitado e depois abre `index.html`.
- [ ] Clicar em "Recuperar conta" ou "Criar conta" não navega nem rola a página.
- [ ] Nenhuma senha aparece em `localStorage`, `sessionStorage`, cookies ou na URL.
- [ ] Funciona sem rolagem horizontal em 375px.
- [ ] A tela "Nova Transação" continua igual (os testes de `tests/tests.html` seguem passando).

---

## 12. Decisões em aberto

- **"Criar conta" num sistema interno:** em sistema financeiro de empresa, normalmente quem cria contas é um administrador — cadastro aberto deixa qualquer pessoa com o link entrar. Antes de implementar a tela de cadastro, decidir entre: (a) cadastro livre restrito ao domínio de e-mail da empresa, ou (b) trocar o link por "Solicitar acesso" (pedido aprovado por um admin).
- **Back-end de autenticação:** necessário para o login ter efeito real (e para as transações deixarem de ficar só no navegador de cada pessoa). Escolher antes de construir as próximas telas.
