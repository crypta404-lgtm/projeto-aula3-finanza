# Finanza

Sistema financeiro de uso interno. Esta versão (v1) entrega apenas a tela **Nova Transação**; as demais abas do menu (Dashboard, Contas, Relatórios, Metas) são só visuais.

Especificação completa: [`specs/nova-transacao.md`](specs/nova-transacao.md).

## Estrutura

| Arquivo | Conteúdo |
|---|---|
| `index.html` | Marcação da tela |
| `styles.css` | Estilos (layout responsivo, tema claro) |
| `script.js` | Máscara de moeda, validação, toast e gravação |
| `tests/tests.html` | Testes automatizados, rodam no navegador |

## Como abrir

Basta abrir o `index.html` no navegador. Não há build nem dependências.

## Como rodar os testes

Os testes carregam o site dentro de um `iframe`, e o navegador bloqueia isso quando a página é aberta direto do disco (`file://`). É preciso servir a pasta por HTTP:

- **VS Code:** com a extensão *Live Server*, clique com o botão direito em `tests/tests.html` → *Open with Live Server*.
- **Terminal (Python):** `python -m http.server 8000` na raiz do projeto e acesse `http://localhost:8000/tests/tests.html`.

O resultado aparece no topo da página (ex.: `14/14 testes passaram`).

## Limitações conhecidas

- **Sem back-end:** as transações ficam salvas no `localStorage` do navegador de cada pessoa. Não são compartilhadas entre usuários e somem se os dados do navegador forem limpos.
- Sem login, edição ou exclusão de transações.
