// ============================================================
// DADOS DOS SERVIÇOS (preço e prazo fixos por serviço)
// ============================================================
const select = document.getElementById('sel-servico');
const labelPreco    = document.getElementById('label-preco');
const labelPrazo    = document.getElementById('label-prazo');
const labelDataPrev = document.getElementById('label-data-prev');
const btnAddSol     = document.getElementById('btn-add-sol');
const solMsg        = document.getElementById('sol-msg');

// Formatar moeda BRL
function formatarMoeda(valor) {
  return 'R$ ' + parseFloat(valor).toLocaleString('pt-BR', {
    minimumFractionDigits: 2, maximumFractionDigits: 2
  });
}

// Adicionar dias a uma data
function adicionarDias(data, dias) {
  const d = new Date(data);
  d.setDate(d.getDate() + dias);
  return d;
}

// Formatar data BR
function formatarData(d) {
  return d.toLocaleDateString('pt-BR', { day:'2-digit', month:'2-digit', year:'numeric' });
}

// Atualizar campos ao trocar serviço
select.addEventListener('change', function () {
  const opt = this.options[this.selectedIndex];
  const preco = opt.dataset.preco;
  const prazo = opt.dataset.prazo;

  if (preco && prazo) {
    labelPreco.textContent = formatarMoeda(preco);
    labelPreco.className = 'campo-saida com-valor';

    labelPrazo.textContent = prazo + ' dias úteis';
    labelPrazo.className = 'campo-saida com-valor';

    const dataAtend = adicionarDias(new Date(), parseInt(prazo));
    labelDataPrev.textContent = formatarData(dataAtend);
    labelDataPrev.className = 'campo-saida com-valor';
  } else {
    labelPreco.textContent = '—';
    labelPreco.className = 'campo-saida';
    labelPrazo.textContent = '—';
    labelPrazo.className = 'campo-saida';
    labelDataPrev.textContent = '—';
    labelDataPrev.className = 'campo-saida';
  }
  solMsg.style.display = 'none';
});

// ============================================================
// CONTADOR DE SOLICITAÇÕES
// ============================================================
let contadorSol = 4;
let totalValor  = 5100.00;
let numSolAtual = 5; // próximo número de solicitação

function atualizarContador() {
  document.getElementById('contador-badge').textContent = contadorSol + ' solicitaç' + (contadorSol === 1 ? 'ão' : 'ões');
  document.getElementById('total-geral').textContent = formatarMoeda(totalValor);
}

// ============================================================
// EXCLUIR LINHA
// ============================================================
function excluirLinha(btn) {
  const linha = btn.closest('tr');
  const precoCell = linha.cells[4].textContent.replace(/[R$\s.]/g, '').replace(',', '.');
  const preco = parseFloat(precoCell) || 0;

  linha.classList.add('linha-removida');
  setTimeout(function () {
    linha.remove();
    contadorSol--;
    totalValor -= preco;
    if (totalValor < 0) totalValor = 0;
    atualizarContador();

    // Se tabela ficou vazia
    const tbody = document.getElementById('corpo-tabela');
    if (tbody.rows.length === 0) {
      tbody.innerHTML = '<tr><td class="tabela-vazia" colspan="7">Nenhuma solicitação encontrada.</td></tr>';
    }
  }, 300);
}

// ============================================================
// INCLUIR NOVA SOLICITAÇÃO NA TABELA
// ============================================================
btnAddSol.addEventListener('click', function () {
  solMsg.style.display = 'none';

  if (!select.value) {
    solMsg.className = 'msg-erro';
    solMsg.textContent = '⚠️ Selecione um serviço antes de incluir.';
    solMsg.style.display = 'block';
    return;
  }

  const opt      = select.options[select.selectedIndex];
  const servico  = opt.text;
  const preco    = parseFloat(opt.dataset.preco);
  const prazo    = parseInt(opt.dataset.prazo);
  const hoje     = new Date();
  const dataAtend = adicionarDias(hoje, prazo);
  const numSol   = 'SOL-' + String(numSolAtual).padStart(3, '0');

  const tbody = document.getElementById('corpo-tabela');

  // Remove linha "vazia" se existir
  const linhaVazia = tbody.querySelector('.tabela-vazia');
  if (linhaVazia) linhaVazia.parentElement.remove();

  const tr = document.createElement('tr');
  tr.dataset.id = numSol;
  tr.style.animation = 'fadeInUp 0.4s ease both';
  tr.innerHTML =
    '<td>' + formatarData(hoje) + '</td>' +
    '<td><strong>' + numSol + '</strong></td>' +
    '<td>' + servico + '</td>' +
    '<td><span class="badge badge-info">EM ELABORAÇÃO</span></td>' +
    '<td>' + formatarMoeda(preco) + '</td>' +
    '<td>' + formatarData(dataAtend) + '</td>' +
    '<td><button class="btn-excluir" onclick="excluirLinha(this)">🗑 Excluir</button></td>';

  tbody.appendChild(tr);

  contadorSol++;
  totalValor += preco;
  numSolAtual++;
  atualizarContador();

  // Limpar seleção
  select.value = '';
  labelPreco.textContent    = '—';
  labelPreco.className      = 'campo-saida';
  labelPrazo.textContent    = '—';
  labelPrazo.className      = 'campo-saida';
  labelDataPrev.textContent = '—';
  labelDataPrev.className   = 'campo-saida';

  solMsg.className = 'msg-sucesso';
  solMsg.textContent = '✅ Solicitação ' + numSol + ' incluída com sucesso!';
  solMsg.style.display = 'block';
  setTimeout(() => { solMsg.style.display = 'none'; }, 3000);
});

// ============================================================
// CARREGAR DADOS DO USUÁRIO LOGADO (sessionStorage ou fixo)
// ============================================================
(function carregarUsuario() {
  const email = sessionStorage.getItem('techsolutions_usuario') || 'joao.silva@empresa.com.br';
  const nome  = 'João da Silva'; // Fixo nesta versão
  document.getElementById('label-nome').textContent  = nome;
  document.getElementById('label-login').textContent = email;

  // Iniciais do avatar
  const iniciais = nome.split(' ').slice(0, 2).map(p => p[0]).join('').toUpperCase();
  document.getElementById('avatar-iniciais').textContent = iniciais;
})();