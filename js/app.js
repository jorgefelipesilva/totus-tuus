function showToast(msg){
  const root = document.getElementById('toast-root');
  const el = document.createElement('div');
  el.className = 'toast';
  el.textContent = msg;
  root.appendChild(el);
  requestAnimationFrame(() => el.classList.add('show'));
  setTimeout(() => {
    el.classList.remove('show');
    setTimeout(() => el.remove(), 300);
  }, 1800);
}

function shareText(title, body){
  if(navigator.share){
    navigator.share({ title, text: body }).catch(() => {});
  } else {
    navigator.clipboard.writeText(body).then(() => showToast('Copiado para a área de transferência'));
  }
}

(function init(){
  Theme.init();
  Header.render();
  Sidebar.render();
  BottomNav.render();

  Router.register('inicio', PaginaInicio);
  Router.register('busca', PaginaBusca);
  Router.register('biblia', PaginaBiblia);
  Router.register('oracoes', PaginaOracoes);
  Router.register('novenas', PaginaNovenas);
  Router.register('catecismo', PaginaCatecismo);
  Router.register('enciclicas', PaginaEnciclicas);
  Router.register('direitocanonico', PaginaDireitoCanonico);
  Router.register('santos', PaginaSantos);
  Router.register('liturgia', PaginaLiturgia);
  Router.register('objetos', PaginaObjetos);
  Router.register('confissao', PaginaConfissao);
  Router.register('configuracoes', PaginaConfiguracoes);

  Router.init();

  if('serviceWorker' in navigator){
    navigator.serviceWorker.register('sw.js').catch(() => {});
  }
})();
