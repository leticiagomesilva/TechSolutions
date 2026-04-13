// Verifica se há login salvo na sessionStorage para exibir link de serviços
(function verificarLogin() {
  if (sessionStorage.getItem('techsolutions_logado') === '1') {
    document.body.classList.add('logado');
  }
})();