const form = document.getElementById('transactionForm');
const tipo = document.getElementById('tipo');
const valor = document.getElementById('valor');
const descricao = document.getElementById('descricao');
const data = document.getElementById('data');
const typeBadge = document.getElementById('typeBadge');
const charCount = document.getElementById('charCount');
const toast = document.getElementById('toast');

const brl = new Intl.NumberFormat('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

/* ---------- Data padrão: hoje ---------- */
function today() {
  const d = new Date();
  d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
  return d.toISOString().slice(0, 10);
}
data.value = today();

document.getElementById('openCalendar').addEventListener('click', () => {
  if (typeof data.showPicker === 'function') data.showPicker();
  else data.focus();
});

/* ---------- Máscara de moeda (digita da direita para a esquerda) ---------- */
function parseCents(text) {
  const digits = text.replace(/\D/g, '').slice(0, 13);
  return digits ? parseInt(digits, 10) : 0;
}

valor.addEventListener('input', () => {
  const cents = parseCents(valor.value);
  valor.value = cents ? brl.format(cents / 100) : '';
});

/* ---------- Tipo: badge e cor do valor ---------- */
tipo.addEventListener('change', () => {
  const isEntrada = tipo.value === 'entrada';
  typeBadge.hidden = false;
  typeBadge.textContent = isEntrada ? '↑ Receita' : '↓ Despesa';
  typeBadge.className = `type-badge type-badge--${tipo.value}`;

  const wrap = valor.parentElement;
  wrap.classList.toggle('is-entrada', isEntrada);
  wrap.classList.toggle('is-saida', !isEntrada);
});

/* ---------- Contador de caracteres ---------- */
descricao.addEventListener('input', () => {
  charCount.textContent = `${descricao.value.length}/${descricao.maxLength}`;
});

/* ---------- Validação ---------- */
const rules = {
  tipo: () => tipo.value ? '' : 'Selecione se é entrada ou saída.',
  valor: () => parseCents(valor.value) > 0 ? '' : 'Informe um valor maior que zero.',
  descricao: () => descricao.value.trim().length >= 3 ? '' : 'Descreva a transação (mín. 3 caracteres).',
  data: () => data.value ? '' : 'Selecione uma data.',
  categoria: () => form.categoria.value ? '' : 'Selecione uma categoria.',
  conta: () => form.conta.value ? '' : 'Selecione uma conta.',
};

function setError(name, message) {
  const field = form.elements[name].closest('.field');
  field.classList.toggle('is-invalid', Boolean(message));
  field.querySelector('.field__error').textContent = message;
}

function validate() {
  let firstInvalid = null;
  for (const [name, rule] of Object.entries(rules)) {
    const message = rule();
    setError(name, message);
    if (message && !firstInvalid) firstInvalid = form.elements[name];
  }
  if (firstInvalid) firstInvalid.focus();
  return !firstInvalid;
}

// Limpa o erro assim que o usuário corrige o campo
Object.keys(rules).forEach((name) => {
  const el = form.elements[name];
  ['input', 'change'].forEach((evt) =>
    el.addEventListener(evt, () => {
      if (el.closest('.field').classList.contains('is-invalid')) setError(name, rules[name]());
    })
  );
});

/* ---------- Reset ---------- */
function resetForm() {
  form.reset();
  data.value = today();
  typeBadge.hidden = true;
  valor.parentElement.classList.remove('is-entrada', 'is-saida');
  charCount.textContent = `0/${descricao.maxLength}`;
  Object.keys(rules).forEach((name) => setError(name, ''));
}

/* ---------- Toast ---------- */
let toastTimer;
function showToast(message, variant = 'success') {
  toast.textContent = message;
  toast.className = `toast toast--${variant} is-visible`;
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove('is-visible'), 3000);
}

/* ---------- Ações ---------- */
form.addEventListener('submit', (e) => {
  e.preventDefault();
  if (!validate()) return;

  const transacao = {
    id: crypto.randomUUID ? crypto.randomUUID() : String(Date.now()),
    tipo: tipo.value,
    valor: parseCents(valor.value) / 100,
    descricao: descricao.value.trim(),
    data: data.value,
    categoria: form.categoria.value,
    conta: form.conta.value,
    criadoEm: new Date().toISOString(),
  };

  // Persistência local até existir um back-end
  try {
    const lista = JSON.parse(localStorage.getItem('transacoes') || '[]');
    lista.push(transacao);
    localStorage.setItem('transacoes', JSON.stringify(lista));
  } catch { /* armazenamento indisponível: segue sem persistir */ }

  const sinal = transacao.tipo === 'entrada' ? '+' : '−';
  showToast(`Transação salva: ${sinal} R$ ${brl.format(transacao.valor)}`);
  resetForm();
});

document.getElementById('cancelBtn').addEventListener('click', () => {
  resetForm();
  showToast('Transação cancelada.', 'info');
});
