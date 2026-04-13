// ============================================================
// VALIDAÇÕES – Página de Login
// ============================================================

const campoLogin  = document.getElementById('campo-login');
const campoSenha  = document.getElementById('campo-senha');
const btnLogin    = document.getElementById('btn-login');
const btnLimpar   = document.getElementById('btn-limpar');
const btnVerSenha = document.getElementById('btn-ver-senha');
const msgFeedback = document.getElementById('msg-feedback');

// Utilitário: validar formato de e-mail
function emailValido(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email.trim());
}

// Exibir/ocultar erro de campo
function mostrarErroCampo(campo, spanId, mensagem) {
  const span = document.getElementById(spanId);
  campo.classList.add('campo-invalido');
  span.textContent = mensagem;
  span.style.display = 'block';
}

function limparErroCampo(campo, spanId) {
  const span = document.getElementById(spanId);
  campo.classList.remove('campo-invalido');
  span.textContent = '';
  span.style.display = 'none';
}

function mostrarMensagem(tipo, texto) {
  msgFeedback.className = tipo === 'erro' ? 'msg-erro' : 'msg-sucesso';
  msgFeedback.textContent = texto;
  msgFeedback.style.display = 'block';
}

// ---- Botão Realizar Login ----
btnLogin.addEventListener('click', function () {
  let valido = true;

  // Resetar erros
  limparErroCampo(campoLogin, 'erro-login');
  limparErroCampo(campoSenha, 'erro-senha');
  msgFeedback.style.display = 'none';

  // Validação do login (e-mail)
  if (campoLogin.value.trim() === '') {
    mostrarErroCampo(campoLogin, 'erro-login', 'O campo de login é obrigatório.');
    valido = false;
  } else if (!emailValido(campoLogin.value)) {
    mostrarErroCampo(campoLogin, 'erro-login', 'Informe um e-mail válido (ex: nome@dominio.com).');
    valido = false;
  }

  // Validação da senha
  if (campoSenha.value === '') {
    mostrarErroCampo(campoSenha, 'erro-senha', 'A senha é obrigatória.');
    valido = false;
  }

  if (!valido) {
    mostrarMensagem('erro', '⚠️ Corrija os erros acima para continuar.');
    return;
  }

  // Sucesso — salva estado de login e navega para a página principal
  mostrarMensagem('sucesso', '✅ Validação realizada com sucesso! Redirecionando...');
  sessionStorage.setItem('techsolutions_logado', '1');
  sessionStorage.setItem('techsolutions_usuario', campoLogin.value.trim());

  setTimeout(function () {
    window.location.href = 'index.html';
  }, 1400);
});

// ---- Botão Limpar ----
btnLimpar.addEventListener('click', function () {
  campoLogin.value  = '';
  campoSenha.value  = '';
  limparErroCampo(campoLogin, 'erro-login');
  limparErroCampo(campoSenha, 'erro-senha');
  msgFeedback.style.display = 'none';
  campoLogin.focus();
});

// ---- Botão ver/ocultar senha ----
btnVerSenha.addEventListener('click', function () {
  const tipo = campoSenha.type === 'password' ? 'text' : 'password';
  campoSenha.type = tipo;
  this.textContent = tipo === 'password' ? '👁' : '🙈';
});

// ---- Validação em tempo real (campo perde foco) ----
campoLogin.addEventListener('blur', function () {
  if (this.value.trim() !== '' && !emailValido(this.value)) {
    mostrarErroCampo(this, 'erro-login', 'E-mail inválido.');
  } else {
    limparErroCampo(this, 'erro-login');
  }
});

campoLogin.addEventListener('focus', function () {
  limparErroCampo(this, 'erro-login');
});

campoSenha.addEventListener('focus', function () {
  limparErroCampo(this, 'erro-senha');
});