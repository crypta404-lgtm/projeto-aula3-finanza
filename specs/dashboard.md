# Spec — Tela "Dashboard"

| Item        | Valor                                                      |
|-------------|------------------------------------------------------------|
| Produto     | Finanza — sistema financeiro da empresa                    |
| Escopo      | Visão geral: saldos por conta, resumo do mês e gráficos    |
| Tecnologias | HTML5 + CSS3 + JS puro (sem biblioteca de gráficos)        |
| Arquivos    | `dashboard.html`, `dashboard.css`, `dashboard.js`, `dados.js` (novo, compartilhado) |
| Fonte dos dados | Transações salvas pela tela "Nova Transação" (`localStorage`, chave `transacoes`) |
| Status      | v1 — apenas front-end, sem back-end                        |

---

## 1. Objetivo

Mostrar, num relance, **quanto há em cada conta** e **como foi o mês**: quanto entrou, quanto saiu, para onde foi o dinheiro e a tendência dos últimos meses. Todos os números vêm das transações registradas em "Nova Transação" — nada é digitado no Dashboard.

### Fora do escopo (v1)
- Editar ou excluir transações a partir do Dashboard.
- Saldo inicial das contas (ver seção 13).
- Abas Contas, Relatórios e Metas (continuam sem funcionar).
- Exportar dados (PDF, Excel).

---

## 2. Estrutura da tela

```
┌──────────────────────────────────────────────────────────────────────────┐
│ [F] Finanza   Dashboard  Transações  Contas  Relatórios  Metas    🔔 (AD) │ ← mesmo cabeçalho, "Dashboard" ativo
└──────────────────────────────────────────────────────────────────────────┘

  DASHBOARD                                       ‹  Outubro de 2026  ›   [ + Nova transação ]
  Visão geral
  Acompanhe saldos e movimentações da empresa.

  ┌─────────────────────┐ ┌─────────────────────┐ ┌─────────────────────┐
  │ (🏦) Conta corrente │ │ (💳) Cartão         │ │ (💵) Dinheiro       │   ← 1. saldos por conta
  │ R$ 12.450,00        │ │ − R$ 1.230,40       │ │ R$ 380,00           │      (todo o período)
  │ 18 transações       │ │ 9 transações        │ │ 4 transações        │
  └─────────────────────┘ └─────────────────────┘ └─────────────────────┘

  RESUMO DE OUTUBRO
  ┌──────────────────────────────────────────────────────────────────────┐
  │ ↑ Entradas do mês      │ ↓ Saídas do mês       │ = Resultado do mês   │   ← 2. resumo do mês
  │ R$ 8.500,00            │ R$ 5.120,40           │ + R$ 3.379,60        │      (mês selecionado)
  │ 3 transações           │ 21 transações         │                      │
  └──────────────────────────────────────────────────────────────────────┘

  ┌──────────────────────────────────┐ ┌──────────────────────────────────┐
  │ Saídas por categoria             │ │ Entradas × saídas — 6 meses      │   ← 3. gráficos
  │ Moradia     ████████████ 2.100  41% │ │  ▇▅  ▇▃  ▆▆  ▇▄  ▇▅  ▇▆           │
  │ Alimentação ███████ 1.240     24% │ │ mai jun jul ago set out           │
  │ Transporte  ████ 780          15% │ │ ■ Entradas  ▨ Saídas              │
  │ ...                              │ │                                  │
  │ ▸ Ver dados em tabela            │ │ ▸ Ver dados em tabela            │
  └──────────────────────────────────┘ └──────────────────────────────────┘

  ┌──────────────────────────────────────────────────────────────────────┐
  │ Últimas transações                                     Ver todas →   │   ← 4. últimas 5
  │ 06/10  Almoço com cliente    Alimentação · Cartão      − R$ 150,00    │
  │ 05/10  Pagamento cliente X   Salário · Conta corrente  + R$ 8.500,00  │
  └──────────────────────────────────────────────────────────────────────┘
```

### 2.1 Cabeçalho
- **O mesmo** `.topbar` do `index.html` (copiar a marcação; não há sistema de templates neste projeto).
- Em `dashboard.html`, o link "Dashboard" fica ativo (`nav__link--active` + `aria-current="page"`).
- Navegação passa a funcionar entre as duas telas prontas:
  - `Dashboard` → `dashboard.html`
  - `Transações` → `index.html`
  - `Contas`, `Relatórios`, `Metas` → continuam `href="#"`.
- **Atualizar também o `index.html`** com esses dois links (e `aria-current="page"` em "Transações").

### 2.2 Título e ações
- Mesmo padrão visual de `.page__heading` (eyebrow dourado "DASHBOARD", `<h1>` "Visão geral" em Playfair Display, subtítulo em `--ink-soft`), mas **alinhado à esquerda**, porque à direita ficam as ações:
  - **Seletor de mês:** botões `‹` e `›` com `aria-label` "Mês anterior" / "Próximo mês" e o nome do mês ("Outubro de 2026") entre eles, em `aria-live="polite"`. Começa no mês atual. O `›` fica desabilitado no mês atual (não há como ver o futuro).
  - **Botão "+ Nova transação"** (estilo primário) → `index.html`.
- Largura máxima do conteúdo: 1200px (igual ao `.topbar__inner`).

---

## 3. Bloco 1 — Saldos por conta (3 cards horizontais)

Três cards lado a lado, nesta ordem: **Conta corrente**, **Cartão**, **Dinheiro** (os mesmos valores do campo "Conta" da Nova Transação).

| Elemento | Conteúdo |
|----------|----------|
| Ícone    | Banco / cartão / cédula, no mesmo quadrado dourado claro (`--accent-soft`) dos ícones do formulário |
| Nome     | Rótulo da conta |
| Valor    | **Saldo** = soma das entradas − soma das saídas daquela conta, em **todo o período** (não depende do mês selecionado) |
| Rodapé   | "N transações" (todo o período); "Nenhuma transação" se zero |

- Valor em Inter 28px, peso 700, números tabulares (`font-variant-numeric: tabular-nums`).
- Saldo negativo: texto em `--danger` e sinal "−" (sinal de menos de verdade, U+2212) antes do "R$". Positivo ou zero: `--ink`.
- O sinal é obrigatório no negativo — cor nunca é o único indicador.

---

## 4. Bloco 2 — Resumo do mês

Um card com três colunas, sob o subtítulo "RESUMO DE {MÊS}" (eyebrow). Considera **só as transações do mês selecionado**, de todas as contas.

| Coluna | Ícone | Valor | Rodapé |
|--------|-------|-------|--------|
| Entradas do mês | ↑ em círculo `--success-soft` | Soma das entradas, em `--success` | "N transações" |
| Saídas do mês   | ↓ em círculo `--danger-soft`  | Soma das saídas, em `--danger`   | "N transações" |
| Resultado do mês | = em círculo `--accent-soft` | Entradas − saídas, com sinal "+" ou "−"; cor do sinal | — |

> "Resultado do mês" não foi pedido explicitamente, mas é a pergunta que as duas primeiras colunas deixam no ar ("sobrou ou faltou?"). Se não quiser, remover é trivial.

- Colunas separadas por linha vertical fina (`--line`); no celular, empilhadas e separadas por linha horizontal.

---

## 5. Bloco 3 — Gráficos

Dois cards lado a lado (≥ 1024px) ou empilhados (< 1024px). **Sem biblioteca**: barras feitas com HTML + CSS (largura/altura em %), o que dispensa dependência externa, funciona offline e herda as fontes e cores do site. Cada gráfico tem título, legenda quando houver mais de uma série, tooltip e versão em tabela.

### 5.1 Saídas por categoria (mês selecionado)

- **Forma:** barras **horizontais**, ordenadas da maior para a menor. (Não usar pizza/rosca: comparar fatias é bem menos preciso que comparar comprimentos de barra.)
- **Dados:** soma das **saídas** do mês por categoria. Categorias com valor zero não aparecem.
- **Cor:** uma única cor para todas as barras — `--accent` (dourado). É uma série só; colorir cada categoria de um jeito não acrescenta informação.
- **Rótulos:** à esquerda o nome da categoria; à direita, dentro da linha, valor em R$ e percentual do total de saídas do mês (texto em `--ink` / `--ink-soft`, **nunca** na cor da barra).
- Barra: altura 10px, ponta direita arredondada (4px), trilho de fundo em `--line` mostrando 100%.
- Hover/foco em uma linha: destaca a linha (fundo `--accent-soft`) e mostra tooltip "Moradia — R$ 2.100,00 · 41% das saídas · 3 transações".

### 5.2 Entradas × saídas — últimos 6 meses

- **Forma:** barras **verticais agrupadas** (entradas e saídas lado a lado em cada mês), terminando no mês selecionado.
- **Um único eixo Y**, começando em zero, com 3–4 linhas de grade tênues (`--line`) e valores abreviados ("R$ 5 mil").
- Eixo X: abreviação do mês ("mai", "jun", ...).
- **Cores (validadas para daltonismo):**

  | Série    | Cor da barra | Textura | Observação |
  |----------|--------------|---------|------------|
  | Entradas | `--success` `#2f8a5b` | Sólida | Mesmo verde já usado no site |
  | Saídas   | **`--danger-chart` `#e8907a`** (token novo) | **Hachurado diagonal** (`repeating-linear-gradient` 45°) | Ver nota abaixo |

  > **Por que um token novo:** o par atual `--success` × `--danger` (`#2f8a5b` × `#c2453d`) **reprova** no teste de daltonismo — para deuteranopia a diferença entre eles é ΔE 5,0 (mínimo aceitável: 8). Com `#e8907a` a diferença sobe para 9,4 e passa. `--danger` continua sendo usado em **textos** e erros; `--danger-chart` é só para preencher barras. Como esse coral tem contraste 2,35:1 com o fundo, a hachura + legenda + tooltip são obrigatórias (não decorativas).

- 2px de espaço entre as duas barras de um mês; topo arredondado (4px); base reta no eixo.
- Legenda acima do gráfico: "■ Entradas  ▨ Saídas" (amostra com a mesma cor e textura da barra).
- Hover/foco em um mês: coluna destacada + tooltip com "Outubro de 2026 / Entradas R$ 8.500,00 / Saídas R$ 5.120,40 / Resultado + R$ 3.379,60". A área de hover é a coluna inteira do mês, não só a barra.
- Mês sem transações aparece com barras de altura zero (o mês não some do eixo).

### 5.3 Versão em tabela (acessibilidade)

Abaixo de cada gráfico, um `<details>` "Ver dados em tabela" com uma `<table>` dos mesmos números (categoria / valor / % ou mês / entradas / saídas / resultado). As barras recebem `aria-hidden="true"`; quem usa leitor de tela lê a tabela.

### 5.4 Estados vazios

| Situação | O que mostrar no lugar do gráfico |
|----------|-----------------------------------|
| Nenhuma transação cadastrada (em lugar nenhum) | Ilustração/ícone discreto + "Nenhuma transação ainda." + botão "Registrar primeira transação" → `index.html` |
| Mês sem saídas (gráfico 5.1) | "Nenhuma saída em outubro de 2026." |
| 6 meses sem nenhuma transação (5.2) | "Sem movimentações entre maio e outubro de 2026." |

Os cards de saldo e o resumo mostram R$ 0,00 normalmente — não somem.

---

## 6. Bloco 4 — Últimas transações

- As **5 transações mais recentes** (todo o período, ordenadas por `data` desc e, no empate, `criadoEm` desc).
- Cada linha: data (`dd/mm`), descrição, "Categoria · Conta" em `--ink-soft`, valor à direita com sinal "+" (`--success-text`) ou "−" (`--danger`).
- Link "Ver todas →" no topo do card, `href="#"` (a listagem completa é tela futura).
- Sem transações: o card mostra o mesmo estado vazio da seção 5.4.

---

## 7. Dados — de onde vêm e como calcular

### 7.1 Módulo compartilhado `dados.js` (novo)

Hoje o nome da chave (`transacoes`) e a leitura/gravação estão só no `script.js`. Com duas telas usando os mesmos dados, isso vira um ponto único em `dados.js`, carregado **antes** do script de cada página:

```js
// dados.js — expõe um único objeto global
window.Finanza = {
  CHAVE: 'transacoes',
  CATEGORIAS: { alimentacao: 'Alimentação', saude: 'Saúde', salario: 'Salário',
                transporte: 'Transporte', lazer: 'Lazer', moradia: 'Moradia' },
  CONTAS:     { 'conta-corrente': 'Conta corrente', cartao: 'Cartão', dinheiro: 'Dinheiro' },
  listar(),            // → array de transações (lista vazia se não houver ou se o JSON estiver corrompido)
  salvar(transacao),   // adiciona uma transação
};
```

- **Usar script clássico com objeto global, não ES modules** (`type="module"`): módulos são bloqueados quando o site é aberto direto do disco (`file://`), que é como o projeto é usado hoje.
- `script.js` (Nova Transação) passa a usar `Finanza.salvar()` no lugar do acesso direto ao `localStorage`. **O comportamento da tela não muda.**
- Os rótulos de `CATEGORIAS` e `CONTAS` precisam bater com as `<option>` do `index.html` (há teste para isso — seção 11).
- As funções de cálculo (saldo por conta, totais do mês, agrupamento por categoria, série de 6 meses) ficam em `dashboard.js` como **funções puras** (recebem a lista, devolvem números), separadas do código que desenha a tela — assim dá para testá-las isoladamente.

### 7.2 Regras de cálculo

| Indicador | Regra |
|-----------|-------|
| Saldo da conta | Σ `valor` das entradas da conta − Σ `valor` das saídas da conta, todas as datas |
| Entradas do mês | Σ `valor` com `tipo = entrada` e `data` no mês selecionado |
| Saídas do mês | Σ `valor` com `tipo = saida` e `data` no mês selecionado |
| Por categoria | Saídas do mês agrupadas por `categoria` |
| 6 meses | Para cada um dos 6 meses até o selecionado: Σ entradas e Σ saídas |

### 7.3 Cuidados técnicos (obrigatórios)

- **Mês da transação: comparar texto, não `Date`.** Fazer `t.data.slice(0, 7) === '2026-10'`. **Não** usar `new Date('2026-10-01')`: essa string é interpretada como UTC e, no fuso do Brasil (UTC−3), vira 30/09 às 21h — a transação cairia no mês errado.
- **Mês atual: usar a data local**, do mesmo jeito que a função `today()` do `script.js` já faz.
- **Somar em centavos inteiros** (`Math.round(valor * 100)`) e só dividir por 100 na exibição, para não acumular erro de ponto flutuante (`0.1 + 0.2`).
- **Formatar moeda** com `Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' })`; meses com `Intl.DateTimeFormat('pt-BR', { month: 'long', year: 'numeric' })` (construindo a data com `new Date(ano, mes - 1, 1)`, que é local).
- **Dados inválidos não podem quebrar a tela:** JSON corrompido → tratar como lista vazia; transação com `conta` ou `categoria` desconhecida → somar em "Outros" e não estourar erro.
- **Atualização entre abas:** ouvir o evento `storage` da janela; se a chave `transacoes` mudar (transação salva em outra aba), redesenhar o Dashboard.

---

## 8. Identidade visual

Reaproveitar os tokens de `:root` em `styles.css`. `dashboard.html` carrega `styles.css` + `dashboard.css` (só o que é específico desta tela).

| Elemento | Valor |
|----------|-------|
| Cards | `--surface`, raio 20px, `--shadow-card`, padding 24px |
| Espaço entre blocos | 24px |
| Eyebrows ("RESUMO DE OUTUBRO") | Mesmo estilo de `.page__eyebrow` |
| Valores | Inter 700, `tabular-nums` |
| Barras de categoria | `--accent` |
| Entradas (gráfico) | `--success` |
| Saídas (gráfico) | `--danger-chart` `#e8907a` + hachura — **adicionar este token em `:root`** |
| Entradas em texto pequeno | `--success-text` `#287d51` — **adicionar este token em `:root`** (ver seção 10) |
| Grade dos gráficos | `--line` |
| Tooltip | Fundo `--ink`, texto branco, raio 8px, sombra suave |

---

## 9. Responsividade

| Largura | Comportamento |
|---------|---------------|
| > 1024px | Cards de conta em 3 colunas; gráficos lado a lado |
| ≤ 1024px | Gráficos empilhados (largura total) |
| ≤ 860px | Menu do cabeçalho oculto (igual à outra tela); título e ações (seletor de mês + botão) empilhados |
| ≤ 640px | Cards de conta em 1 coluna; resumo do mês com colunas empilhadas; "Últimas transações" em duas linhas por item (descrição em cima, categoria e valor embaixo) |

- Sem rolagem horizontal em 375px. O gráfico de 6 meses encolhe as barras, não rola.

---

## 10. Acessibilidade

- `<title>Dashboard — Finanza</title>`, `lang="pt-BR"`, um único `<h1>`.
- Cada bloco é uma `<section>` com `aria-labelledby` apontando para o seu título.
- Seletor de mês: botões com `aria-label`; nome do mês em `aria-live="polite"`.
- Gráficos: barras `aria-hidden="true"` + tabela equivalente (5.3). Linhas/colunas dos gráficos focáveis pelo teclado (`tabindex="0"`) para abrir o tooltip.
- Valores negativos sempre com sinal "−", positivos do resultado com "+": cor nunca é a única pista.
- Contraste de todos os textos ≥ 4,5:1. **Atenção:** `--success` (`#2f8a5b`) tem só 4,28:1 sobre branco — serve para os valores grandes (28px negrito, onde o mínimo é 3:1), mas **não** para texto pequeno. Para valores em tamanho normal (ex.: "Últimas transações"), usar o token novo `--success-text: #287d51` (5,07:1). `--danger` (`#c2453d`, 4,99:1) já passa.

---

## 11. Testes

Criar `tests/dashboard.tests.html` no mesmo padrão de `tests/tests.html`.

- **Não pode apagar os dados reais do usuário:** os testes rodam na mesma origem do site, então devem **guardar** o conteúdo de `localStorage['transacoes']` antes de começar e **restaurar** ao final (inclusive se um teste falhar — usar `try/finally`).
- Usar uma massa de dados fixa (fixture) com transações em pelo menos 3 meses, nas 3 contas e em várias categorias, incluindo uma transação no dia 1º de um mês (pega o bug de fuso da seção 7.3).
- Testar as funções puras de cálculo diretamente **e** a tela renderizada no `iframe`.
- Os testes existentes (`tests/tests.html`) devem continuar passando após a mudança no `script.js`.

---

## 12. Critérios de aceite

- [ ] O link "Dashboard" do cabeçalho abre `dashboard.html`, e "Transações" volta para `index.html`, nas duas telas.
- [ ] Os 3 cards mostram, nesta ordem, Conta corrente, Cartão e Dinheiro, com o saldo correto de todo o período.
- [ ] Saldo negativo aparece com "−" e em vermelho.
- [ ] O resumo mostra entradas, saídas e resultado **do mês selecionado**.
- [ ] Os botões ‹ › trocam o mês e atualizam resumo, gráfico de categorias e gráfico de 6 meses; os saldos das contas não mudam; › fica desabilitado no mês atual.
- [ ] O gráfico de categorias mostra só saídas do mês, ordenado do maior para o menor, com valor e %.
- [ ] O gráfico de 6 meses termina no mês selecionado, tem legenda, saídas hachuradas e tooltip.
- [ ] Cada gráfico tem "Ver dados em tabela" com os mesmos números.
- [ ] "Últimas transações" mostra as 5 mais recentes com sinal e cor corretos.
- [ ] Uma transação com data no dia 1º aparece no mês certo.
- [ ] Salvar uma transação na Nova Transação e voltar ao Dashboard mostra os números atualizados (e com as duas telas abertas em abas, o Dashboard se atualiza sozinho).
- [ ] Sem nenhuma transação, a tela mostra os estados vazios da seção 5.4, sem erros no console.
- [ ] `localStorage` com JSON inválido não quebra a tela.
- [ ] A tela Nova Transação continua funcionando igual e `tests/tests.html` segue passando.
- [ ] Os testes do Dashboard restauram os dados reais do `localStorage` ao final.
- [ ] Sem rolagem horizontal em 375px.

---

## 13. Decisões em aberto

- **Saldo inicial das contas:** hoje o saldo começa em R$ 0,00 e só reflete o que foi lançado no sistema. Se a conta corrente da empresa já tem R$ 50 mil no banco, o Dashboard vai mostrar um número diferente do extrato. Opções: (a) aceitar e deixar claro no card ("saldo dos lançamentos"), ou (b) criar um lançamento de "saldo inicial" por conta (provavelmente na futura aba Contas).
- **Cartão de crédito como "saldo":** cartão de crédito não tem saldo, tem **fatura** — gastos no cartão vão deixar o card sempre negativo. Talvez o card "Cartão" deva mostrar "Fatura do mês" (saídas do cartão no mês) em vez de saldo. Decidir antes de mostrar para o financeiro.
- **Dados só no navegador:** o Dashboard de cada funcionário mostra só o que **ele** lançou naquele navegador. Para um dashboard da empresa de verdade, é necessário um back-end — esta é a limitação mais importante do projeto hoje.
- **Arquivo aberto direto do disco:** o compartilhamento do `localStorage` entre `index.html` e `dashboard.html` funciona no Chrome/Edge com `file://`, mas não é garantido em todos os navegadores. Recomendado usar o Live Server.
