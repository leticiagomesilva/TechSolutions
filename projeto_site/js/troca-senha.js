// ============================================================
// REGRAS DE SENHA
// ============================================================
const CHARS_PERMITIDOS_ESPECIAIS = '@#$%&*!?/\\|-_+.=';
const CHARS_PROIBIDOS = '¨{}[]´`~^:;<>,"\'';

function emailValido(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email.trim());
}

function validarSenha(senha) {
  const erros = [];
  if (senha.length < 6)
    erros.push('A senha deve ter pelo menos 6 caracteres.');

  if (!/[A-Z]/.test(senha))
    erros.push('A senha deve conter pelo menos uma letra maiúscula.');

  if (!/[0-9]/.test(senha))
    erros.push('A senha deve conter pelo menos um número.');

  const temEspecialPermitido = [...CHARS_PERMITIDOS_ESPECIAIS].some(c => senha.includes(c));
  if (!temEspecialPermitido)
    erros.push('A senha deve conter pelo menos um caractere especial permitido (@#$%&*!?/\\|-_+.=).');

  const temProibido = [...CHARS_PROIBIDOS].some(c => senha.includes(c));
  if (temProibido)
    erros.push('A senha contém caracteres não permitidos (¨{}[]´`~^:;<>,"\'  ).');

  return erros;
}

function calcularForca(senha) {
  if (!senha) return 0;
  let pontos = 0;
  if (senha.length >= 6) pontos++;
  if (senha.length >= 10) pontos++;
  if (/[A-Z]/.test(senha)) pontos++;
  if (/[0-9]/.test(senha)) pontos++;
  if ([...CHARS_PERMITIDOS_ESPECIAIS].some(c => senha.includes(c))) pontos++;
  if (pontos <= 2) return 1;
  if (pontos <= 3) return 2;
  return 3;
}

// Elementos
const campoLogin        = document.getElementById('campo-login');
const campoSenha        = document.getElementById('campo-senha');
const campoConfirmacao  = document.getElementById('campo-confirmacao');
const btnTrocar         = document.getElementById('btn-trocar');
const btnLimpar         = document.getElementById('btn-limpar');
const msgFeedback       = document.getElementById('msg-feedback');

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
}

// Indicador de força em tempo real
campoSenha.addEventListener('input', function () {
  const forca = calcularForca(this.value);
  const barras = ['barra1','barra2','barra3'];
  const classes = ['ativa-fraca','ativa-media','ativa-forte'];
  const textos  = ['','Fraca','Média','Forte'];

  barras.forEach(function(id, i) {
    const el = document.getElementById(id);
    el.className = 'forca-barra';
    if (forca > i) el.classList.add(classes[forca - 1]);
  });

  document.getElementById('forca-texto').textContent =
    this.value.length > 0 ? 'Força: ' + textos[forca] : '';
});

// Botão Trocar Senha
btnTrocar.addEventListener('click', function () {
  let valido = true;
  limparErroCampo(campoLogin,        'erro-login');
  limparErroCampo(campoSenha,        'erro-senha');
  limparErroCampo(campoConfirmacao,  'erro-confirmacao');
  msgFeedback.style.display = 'none';

  // Validar e-mail
  if (campoLogin.value.trim() === '') {
    mostrarErroCampo(campoLogin, 'erro-login', 'O e-mail é obrigatório.');
    valido = false;
  } else if (!emailValido(campoLogin.value)) {
    mostrarErroCampo(campoLogin, 'erro-login', 'Informe um e-mail válido.');
    valido = false;
  }

  // Validar nova senha
  if (campoSenha.value === '') {
    mostrarErroCampo(campoSenha, 'erro-senha', 'A senha é obrigatória.');
    valido = false;
  } else {
    const errosSenha = validarSenha(campoSenha.value);
    if (errosSenha.length > 0) {
      mostrarErroCampo(campoSenha, 'erro-senha', errosSenha[0]);
      valido = false;
    }
  }

  // Validar confirmação
  if (campoConfirmacao.value === '') {
    mostrarErroCampo(campoConfirmacao, 'erro-confirmacao', 'Confirme a senha.');
    valido = false;
  } else if (campoSenha.value !== campoConfirmacao.value) {
    mostrarErroCampo(campoConfirmacao, 'erro-confirmacao', 'As senhas não coincidem.');
    valido = false;
  }

  if (!valido) {
    mostrarMensagem('erro', '⚠️ Corrija os erros acima para continuar.');
    return;
  }

  mostrarMensagem('sucesso', '✅ Validação realizada com sucesso! Redirecionando...');
  setTimeout(function () { history.back(); }, 1400);
});

// Botão Limpar
btnLimpar.addEventListener('click', function () {
  campoLogin.value       = '';
  campoSenha.value       = '';
  campoConfirmacao.value = '';
  ['erro-login','erro-senha','erro-confirmacao'].forEach(function(id) {
    document.getElementById(id).style.display = 'none';
  });
  [campoLogin, campoSenha, campoConfirmacao].forEach(function(c) {
    c.classList.remove('campo-invalido');
  });
  ['barra1','barra2','barra3'].forEach(function(id) {
    document.getElementById(id).className = 'forca-barra';
  });
  document.getElementById('forca-texto').textContent = '';
  msgFeedback.style.display = 'none';
  campoLogin.focus();
});

// Ver/ocultar senhas
document.getElementById('btn-ver1').addEventListener('click', function() {
  campoSenha.type = campoSenha.type === 'password' ? 'text' : 'password';
  this.textContent = campoSenha.type === 'password' ? '👁' : '🙈';
});

document.getElementById('btn-ver2').addEventListener('click', function() {
  campoConfirmacao.type = campoConfirmacao.type === 'password' ? 'text' : 'password';
  this.textContent = campoConfirmacao.type === 'password' ? '👁' : '🙈';
});