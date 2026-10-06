# Spec — Tela "Nova Transação"

| Item        | Valor                                   |
|-------------|-----------------------------------------|
| Produto     | Finanza — sistema financeiro da empresa |
| Escopo      | Tela de cadastro de nova transação      |
| Tecnologias | HTML5 + CSS3 (JS só para comportamento) |
| Arquivos    | `index.html`, `styles.css`, `script.js` |
| Status      | v1 — apenas front-end, sem back-end     |

---

## 1. Objetivo

Permitir que o usuário registre uma transação financeira (entrada ou saída) informando tipo, valor, descrição, data, categoria e conta. A interface deve ser **bonita, elegante e fácil de preencher**, servindo de base visual para as próximas telas do sistema.

### Fora do escopo (v1)
- Telas de Dashboard, Contas, Relatórios e Metas (aparecem só no menu, sem funcionar).
- Integração com back-end / banco de dados.
- Login e autenticação.
- Edição ou exclusão de transações.

---

## 2. Estrutura da tela

```
┌──────────────────────────────────────────────────────────────┐
│ [F] Finanza   Dashboard  Transações  Contas  Relatórios  Metas   🔔 (AD) │  ← cabeçalho
└──────────────────────────────────────────────────────────────┘

                         TRANSAÇÕES
                      Nova Transação                 ← título centralizado
       Registre uma entrada ou saída para manter suas finanças em dia.

        ┌────────────────────────────────────────────┐
        │ (↗) Tipo        │ [ Selecione o tipo    ▾ ]│
        ├────────────────────────────────────────────┤
        │ ($) Valor       │ [ R$ 0,00               ]│
        ├────────────────────────────────────────────┤
        │ (≡) Descrição   │ [ Ex.: Almoço...   0/80 ]│   ← card em formato lista
        ├────────────────────────────────────────────┤
        │ (▦) Data        │ [ dd/mm/aaaa        📅 ]│
        ├────────────────────────────────────────────┤
        │ (◇) Categoria   │ [ Selecione...        ▾ ]│
        ├────────────────────────────────────────────┤
        │ (▭) Conta       │ [ Selecione...        ▾ ]│
        ├────────────────────────────────────────────┤
        │               [ Cancelar ] [ ✓ Salvar transação ] │
        └────────────────────────────────────────────┘
```

### 2.1 Cabeçalho (`<header class="topbar">`)
- Fixo no topo (`position: sticky`), fundo escuro (`#16181d`) com leve transparência e blur.
- **Esquerda:** logo (quadrado dourado com "F") + nome "Finanza".
- **Centro:** navegação com os links `Dashboard`, `Transações`, `Contas`, `Relatórios`, `Metas`.
  - `Transações` fica ativo (texto branco + sublinhado dourado).
  - Os demais links usam `href="#"` — **não precisam funcionar**, apenas ter hover.
- **Direita:** botão de notificações (sino com ponto dourado) e avatar com iniciais.
- Abaixo de 860px a navegação é ocultada.

### 2.2 Título
- Centralizado na página.
- Sobretítulo (eyebrow) "TRANSAÇÕES" em dourado, caixa alta, espaçamento de letras.
- Título `<h1>` "Nova Transação" em fonte serifada (Playfair Display, 40px).
- Subtítulo em cinza explicando a ação.

### 2.3 Formulário em formato lista
- Um único card branco centralizado (largura máx. 640px), cantos arredondados (20px) e sombra suave.
- Cada campo é uma **linha da lista**: rótulo com ícone à esquerda (170px) e controle à direita, separados por linha fina.
- A linha em foco ganha fundo levemente destacado e o ícone muda de dourado para verde.
- Abaixo de 560px, rótulo e controle ficam empilhados.

---

## 3. Campos

| # | Campo     | `id` / `name` | Elemento              | Obrigatório | Opções / formato |
|---|-----------|---------------|-----------------------|-------------|------------------|
| 1 | Tipo      | `tipo`        | `<select>`            | Sim         | Entrada (`entrada`), Saída (`saida`) |
| 2 | Valor     | `valor`       | `<input type="text">` | Sim         | Moeda BRL, prefixo fixo "R$", formato `1.234,56` |
| 3 | Descrição | `descricao`   | `<input type="text">` | Sim         | Texto livre, mín. 3 e máx. 80 caracteres |
| 4 | Data      | `data`        | `<input type="date">` | Sim         | Calendário selecionável; padrão = hoje |
| 5 | Categoria | `categoria`   | `<select>`            | Sim         | Alimentação, Saúde, Salário, Transporte, Lazer, Moradia |
| 6 | Conta     | `conta`       | `<select>`            | Sim         | Conta corrente, Cartão, Dinheiro |

### Detalhes por campo

**Tipo**
- Começa com o placeholder "Selecione o tipo" (desabilitado).
- Ao escolher, aparece um badge dentro do select: `↑ Receita` (verde) ou `↓ Despesa` (vermelho).
- O valor digitado passa a ficar verde (entrada) ou vermelho (saída).

**Valor**
- Prefixo "R$" fixo dentro do campo.
- Máscara de moeda: o usuário digita só números e o valor é preenchido da direita para a esquerda (`1` → `0,01`, `1500` → `15,00`).
- Teclado numérico no celular (`inputmode="numeric"`).
- Fonte maior, em negrito e com números tabulares.

**Descrição**
- Placeholder: "Ex.: Almoço com cliente".
- Contador `n/80` alinhado à direita, dentro do campo.

**Data**
- Usa o calendário nativo do navegador.
- Botão com ícone de calendário à direita que abre o seletor (`showPicker()`).
- Clicar em qualquer ponto do campo também abre o calendário.

**Categoria e Conta**
- Selects estilizados com seta customizada e placeholder desabilitado.

---

## 4. Botões

| Botão            | Estilo                                 | Comportamento |
|------------------|----------------------------------------|---------------|
| Cancelar         | Secundário (contorno, fundo branco)    | Limpa o formulário e mostra aviso "Transação cancelada." |
| Salvar transação | Primário (verde profundo, ícone ✓)     | Valida; se ok, salva e mostra "Transação salva: + R$ 150,00" |

- Ficam alinhados à direita no rodapé do card.
- No celular, ocupam a largura toda e o "Salvar" fica acima do "Cancelar".

---

## 5. Regras de validação

A validação acontece ao clicar em **Salvar**. Cada campo inválido fica com borda vermelha e uma mensagem abaixo; o foco vai para o primeiro campo com erro. O erro some assim que o usuário corrige o campo.

| Campo     | Regra                    | Mensagem |
|-----------|--------------------------|----------|
| Tipo      | Selecionado              | Selecione se é entrada ou saída. |
| Valor     | Maior que zero           | Informe um valor maior que zero. |
| Descrição | Mín. 3 caracteres (sem espaços nas pontas) | Descreva a transação (mín. 3 caracteres). |
| Data      | Preenchida               | Selecione uma data. |
| Categoria | Selecionada              | Selecione uma categoria. |
| Conta     | Selecionada              | Selecione uma conta. |

---

## 6. Dados gerados

Ao salvar, é montado o objeto abaixo. Enquanto não houver back-end, ele é guardado no `localStorage` na chave `transacoes` (lista).

```json
{
  "id": "uuid",
  "tipo": "entrada | saida",
  "valor": 150.0,
  "descricao": "Almoço com cliente",
  "data": "2026-10-01",
  "categoria": "alimentacao | saude | salario | transporte | lazer | moradia",
  "conta": "conta-corrente | cartao | dinheiro",
  "criadoEm": "2026-10-01T14:30:00.000Z"
}
```

> O valor é salvo como número em reais (convertido de centavos), sem a máscara.

---

## 7. Identidade visual

### 7.1 Cores (tokens em `:root`)

| Token           | Hex       | Uso |
|-----------------|-----------|-----|
| `--bg`          | `#f4f2ee` | Fundo da página (off-white quente) |
| `--surface`     | `#ffffff` | Card e campos |
| `--ink`         | `#16181d` | Texto principal e cabeçalho |
| `--ink-soft`    | `#5b606b` | Texto secundário |
| `--ink-muted`   | `#9196a1` | Placeholders |
| `--line`        | `#e6e3dd` | Divisórias da lista |
| `--primary`     | `#1f3d36` | Verde profundo — botão principal e foco |
| `--accent`      | `#b8955a` | Dourado — logo, ícones, destaques |
| `--success`     | `#2f8a5b` | Entrada |
| `--danger`      | `#c2453d` | Saída e erros |

### 7.2 Tipografia
- **Inter** (400–700): textos, rótulos, campos e botões.
- **Playfair Display** (600): título da página e logo.
- Carregadas via Google Fonts.

### 7.3 Forma e profundidade
- Raio: card 20px, campos e botões 10px.
- Altura padrão de campos e botões: 46px.
- Foco: borda verde + halo `0 0 0 4px rgba(31,61,54,.12)`.
- Transições de 0,2s em cor, borda e sombra.

---

## 8. Responsividade

| Largura    | Comportamento |
|------------|---------------|
| > 860px    | Layout completo, menu visível |
| ≤ 860px    | Menu do cabeçalho oculto; logo e ações nas pontas |
| ≤ 560px    | Título 32px; campos empilhados (rótulo acima do controle); botões em largura total |

---

## 9. Acessibilidade

- Todo campo tem `<label for>` ligado ao seu `id`.
- `<nav aria-label="Navegação principal">` no cabeçalho.
- Botões só com ícone têm `aria-label` (Notificações, Abrir calendário).
- Aviso de sucesso/cancelamento em região `role="status"` com `aria-live="polite"`.
- Foco sempre visível em campos e botões.
- `lang="pt-BR"` no documento.

---

## 10. Critérios de aceite

- [ ] O cabeçalho mostra logo, os 5 links (só "Transações" ativo) e as ações à direita.
- [ ] O título "Nova Transação" aparece centralizado.
- [ ] Os 6 campos aparecem em formato de lista, na ordem: Tipo, Valor, Descrição, Data, Categoria, Conta.
- [ ] Os selects contêm exatamente as opções listadas na seção 3.
- [ ] O valor é formatado como moeda brasileira enquanto o usuário digita.
- [ ] A data abre um calendário e já vem preenchida com o dia de hoje.
- [ ] Salvar com campos vazios mostra as mensagens de erro da seção 5.
- [ ] Salvar com tudo válido grava em `localStorage`, mostra o aviso e limpa o formulário.
- [ ] Cancelar limpa o formulário e mostra "Transação cancelada."
- [ ] A tela funciona sem rolagem horizontal em 375px de largura.
