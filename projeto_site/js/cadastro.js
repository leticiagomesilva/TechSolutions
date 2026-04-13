// ============================================================
// REGRAS DE SENHA (mesmas da troca-senha)
// ============================================================
const CHARS_PERMITIDOS_ESPECIAIS = '@#$%&*!?/\\|-_+.=';
const CHARS_PROIBIDOS = '¨{}[]´`~^:;<>,"\'';
const CHARS_ESPECIAIS_TODOS = CHARS_PERMITIDOS_ESPECIAIS + CHARS_PROIBIDOS;

function emailValido(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email.trim());
}

function validarSenha(senha) {
  const erros = [];
  if (senha.length < 6) erros.push('Mínimo de 6 caracteres.');
  if (!/[A-Z]/.test(senha)) erros.push('Deve conter pelo menos uma maiúscula.');
  if (!/[0-9]/.test(senha)) erros.push('Deve conter pelo menos um número.');
  if (![...CHARS_PERMITIDOS_ESPECIAIS].some(c => senha.includes(c)))
    erros.push('Deve conter pelo menos um caractere especial permitido.');
  if ([...CHARS_PROIBIDOS].some(c => senha.includes(c)))
    erros.push('Contém caracteres não permitidos.');
  return erros;
}

function calcularForca(senha) {
  if (!senha) return 0;
  let p = 0;
  if (senha.length >= 6) p++;
  if (senha.length >= 10) p++;
  if (/[A-Z]/.test(senha)) p++;
  if (/[0-9]/.test(senha)) p++;
  if ([...CHARS_PERMITIDOS_ESPECIAIS].some(c => senha.includes(c))) p++;
  return p <= 2 ? 1 : p <= 3 ? 2 : 3;
}

// ============================================================
// ALGORITMO DE VALIDAÇÃO DE CPF
// ============================================================
function cpfValido(cpf) {
  const nums = cpf.replace(/\D/g, '');
  if (nums.length !== 11) return false;
  if (/^(\d)\1{10}$/.test(nums)) return false;

  let soma = 0;
  for (let i = 0; i < 9; i++) soma += parseInt(nums[i]) * (10 - i);
  let dig1 = (soma * 10) % 11;
  if (dig1 === 10 || dig1 === 11) dig1 = 0;
  if (dig1 !== parseInt(nums[9])) return false;

  soma = 0;
  for (let i = 0; i < 10; i++) soma += parseInt(nums[i]) * (11 - i);
  let dig2 = (soma * 10) % 11;
  if (dig2 === 10 || dig2 === 11) dig2 = 0;
  return dig2 === parseInt(nums[10]);
}

// ============================================================
// MÁSCARA DE CPF
// ============================================================
const campoCPF = document.getElementById('campo-cpf');
campoCPF.addEventListener('input', function () {
  // Permite apenas dígitos
  let val = this.value.replace(/\D/g, '').slice(0, 11);
  if (val.length > 9)
    val = val.slice(0,3) + '.' + val.slice(3,6) + '.' + val.slice(6,9) + '-' + val.slice(9);
  else if (val.length > 6)
    val = val.slice(0,3) + '.' + val.slice(3,6) + '.' + val.slice(6);
  else if (val.length > 3)
    val = val.slice(0,3) + '.' + val.slice(3);
  this.value = val;
});

campoCPF.addEventListener('keypress', function (e) {
  if (!/[0-9]/.test(e.key)) e.preventDefault();
});

// ============================================================
// MÁSCARA DE TELEFONE
// ============================================================
const campoTelefone = document.getElementById('campo-telefone');
campoTelefone.addEventListener('input', function () {
  let val = this.value.replace(/\D/g, '').slice(0, 11);
  if (val.length > 10)
    val = '(' + val.slice(0,2) + ') ' + val.slice(2,7) + '-' + val.slice(7);
  else if (val.length > 6)
    val = '(' + val.slice(0,2) + ') ' + val.slice(2,6) + '-' + val.slice(6);
  else if (val.length > 2)
    val = '(' + val.slice(0,2) + ') ' + val.slice(2);
  this.value = val;
});

// ============================================================
// ELEMENTOS
// ============================================================
const campoEmail       = document.getElementById('campo-email');
const campoSenha       = document.getElementById('campo-senha');
const campoConfirmacao = document.getElementById('campo-confirmacao');
const campoNome        = document.getElementById('campo-nome');
const campoNascimento  = document.getElementById('campo-nascimento');
const btnIncluir       = document.getElementById('btn-incluir');
const btnLimpar        = document.getElementById('btn-limpar');
const btnVoltar        = document.getElementById('btn-voltar');
const msgFeedback      = document.getElementById('msg-feedback');

function mostrarErroCampo(campo, spanId, mensagem) {
  document.getElementById(spanId).textContent = mensagem;
  document.getElementById(spanId).style.display = 'block';
  campo.classList.add('campo-invalido');
}

function limparErroCampo(campo, spanId) {
  document.getElementById(spanId).textContent = '';
  document.getElementById(spanId).style.display = 'none';
  campo.classList.remove('campo-invalido');
}

function mostrarMensagem(tipo, texto) {
  msgFeedback.className = tipo === 'erro' ? 'msg-erro' : 'msg-sucesso';
  msgFeedback.textContent = texto;
  msgFeedback.style.display = 'block';
  msgFeedback.scrollIntoView({ behavior: 'smooth', block: 'center' });
}

// Força da senha em tempo real
campoSenha.addEventListener('input', function () {
  const f = calcularForca(this.value);
  const cls = ['ativa-fraca','ativa-media','ativa-forte'];
  ['barra1','barra2','barra3'].forEach((id, i) => {
    const el = document.getElementById(id);
    el.className = 'forca-barra';
    if (f > i) el.classList.add(cls[f - 1]);
  });
  document.getElementById('forca-texto').textContent =
    this.value ? 'Força: ' + ['','Fraca','Média','Forte'][f] : '';
});

// ============================================================
// BOTÃO INCLUIR – Validações
// ============================================================
btnIncluir.addEventListener('click', function () {
  let valido = true;
  const campos = ['email','senha','confirmacao','nome','cpf','nascimento','telefone'];
  campos.forEach(id => {
    const campo = document.getElementById('campo-' + id);
    if (campo) limparErroCampo(campo, 'erro-' + id);
  });
  msgFeedback.style.display = 'none';

  // E-mail
  if (!campoEmail.value.trim()) {
    mostrarErroCampo(campoEmail, 'erro-email', 'O e-mail é obrigatório.'); valido = false;
  } else if (!emailValido(campoEmail.value)) {
    mostrarErroCampo(campoEmail, 'erro-email', 'Informe um e-mail válido.'); valido = false;
  }

  // Senha
  if (!campoSenha.value) {
    mostrarErroCampo(campoSenha, 'erro-senha', 'A senha é obrigatória.'); valido = false;
  } else {
    const erros = validarSenha(campoSenha.value);
    if (erros.length) { mostrarErroCampo(campoSenha, 'erro-senha', erros[0]); valido = false; }
  }

  // Confirmação
  if (!campoConfirmacao.value) {
    mostrarErroCampo(campoConfirmacao, 'erro-confirmacao', 'Confirme a senha.'); valido = false;
  } else if (campoSenha.value !== campoConfirmacao.value) {
    mostrarErroCampo(campoConfirmacao, 'erro-confirmacao', 'As senhas não coincidem.'); valido = false;
  }

  // Nome
  const nomeVal = campoNome.value.trim();
  if (!nomeVal) {
    mostrarErroCampo(campoNome, 'erro-nome', 'O nome é obrigatório.'); valido = false;
  } else {
    const palavras = nomeVal.split(/\s+/).filter(Boolean);
    if (palavras.length < 2) {
      mostrarErroCampo(campoNome, 'erro-nome', 'Informe nome e sobrenome (mínimo duas palavras).'); valido = false;
    } else if (palavras[0].length < 2) {
      mostrarErroCampo(campoNome, 'erro-nome', 'O primeiro nome deve ter pelo menos 2 caracteres.'); valido = false;
    } else if ([...CHARS_ESPECIAIS_TODOS].some(c => nomeVal.includes(c))) {
      mostrarErroCampo(campoNome, 'erro-nome', 'O nome não pode conter caracteres especiais.'); valido = false;
    }
  }

  // CPF
  const cpfVal = campoCPF.value.trim();
  if (!cpfVal) {
    mostrarErroCampo(campoCPF, 'erro-cpf', 'O CPF é obrigatório.'); valido = false;
  } else if (!cpfValido(cpfVal)) {
    mostrarErroCampo(campoCPF, 'erro-cpf', 'CPF inválido. Verifique os dígitos.'); valido = false;
  }

  // Data de nascimento
  const nasc = campoNascimento.value;
  if (!nasc) {
    mostrarErroCampo(campoNascimento, 'erro-nascimento', 'A data de nascimento é obrigatória.'); valido = false;
  } else {
    const hoje = new Date();
    const nascDate = new Date(nasc + 'T00:00:00');
    let idade = hoje.getFullYear() - nascDate.getFullYear();
    const m = hoje.getMonth() - nascDate.getMonth();
    if (m < 0 || (m === 0 && hoje.getDate() < nascDate.getDate())) idade--;
    if (idade < 18) {
      mostrarErroCampo(campoNascimento, 'erro-nascimento', 'O cliente deve ter 18 anos ou mais.'); valido = false;
    }
  }

  // Telefone (opcional, mas se preenchido valida formato)
  const telVal = campoTelefone.value.trim();
  if (telVal) {
    const telNumeros = telVal.replace(/\D/g, '');
    if (telNumeros.length < 10 || telNumeros.length > 11) {
      mostrarErroCampo(campoTelefone, 'erro-telefone', 'Formato inválido. Use (DDD) 99999-9999.'); valido = false;
    }
  }

  if (!valido) {
    mostrarMensagem('erro', '⚠️ Corrija os erros para concluir o cadastro.');
    return;
  }

  mostrarMensagem('sucesso', '✅ Validação realizada com sucesso! Cadastro concluído.');
});

// ============================================================
// BOTÃO LIMPAR
// ============================================================
btnLimpar.addEventListener('click', function () {
  // Limpa campos de texto e data
  ['email','senha','confirmacao','nome','cpf','nascimento','telefone'].forEach(id => {
    const campo = document.getElementById('campo-' + id);
    if (campo) {
      campo.value = '';
      campo.classList.remove('campo-invalido');
      const erro = document.getElementById('erro-' + id);
      if (erro) { erro.textContent = ''; erro.style.display = 'none'; }
    }
  });

  // Volta radio para solteiro
  document.querySelector('input[name="estado-civil"][value="solteiro"]').checked = true;

  // Volta select para "2º grau completo"
  document.getElementById('campo-escolaridade').value = '2gc';

  // Reseta indicador de força
  ['barra1','barra2','barra3'].forEach(id => {
    document.getElementById(id).className = 'forca-barra';
  });
  document.getElementById('forca-texto').textContent = '';

  msgFeedback.style.display = 'none';
  campoEmail.focus();
});

// ============================================================
// BOTÃO VOLTAR
// ============================================================
btnVoltar.addEventListener('click', function () { history.back(); });

// Ver/ocultar senhas
document.getElementById('btn-ver1').addEventListener('click', function() {
  campoSenha.type = campoSenha.type === 'password' ? 'text' : 'password';
  this.textContent = campoSenha.type === 'password' ? '👁' : '🙈';
});
document.getElementById('btn-ver2').addEventListener('click', function() {
  campoConfirmacao.type = campoConfirmacao.type === 'password' ? 'text' : 'password';
  this.textContent = campoConfirmacao.type === 'password' ? '👁' : '🙈';
});