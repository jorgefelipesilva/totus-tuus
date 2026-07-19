const BottomNav = (() => {
  const ITEMS = [
    { id:'inicio', icon:'home', label:'Início' },
    { id:'biblia', icon:'menu_book', label:'Bíblia' },
    { id:'oracoes', icon:'volunteer_activism', label:'Orações' },
    { id:'busca', icon:'search', label:'Buscar' },
    { id:'configuracoes', icon:'settings', label:'Ajustes' }
  ];
  let el;

  function render(){
    const root = document.getElementById('bottomnav-root');
    el = document.createElement('nav');
    el.className = 'bottom-nav';
    ITEMS.forEach(item => {
      const btn = document.createElement('button');
      btn.className = 'nav-item';
      btn.dataset.route = item.id;
      btn.innerHTML = `
        <span class="pill"><span class="material-icons-round">${item.icon}</span></span>
        <span class="label">${item.label}</span>
      `;
      btn.addEventListener('click', () => Router.navigate(item.id));
      el.appendChild(btn);
    });
    root.appendChild(el);
  }

  function setActive(route){
    el.querySelectorAll('.nav-item').forEach(i => {
      i.classList.toggle('active', i.dataset.route === route);
    });
  }

  return { render, setActive };
})();
