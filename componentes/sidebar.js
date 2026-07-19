const Sidebar = (() => {
  const ITEMS = [
    { id:'inicio', icon:'home', label:'Início' },
    { id:'biblia', icon:'menu_book', label:'Bíblia' },
    { id:'oracoes', icon:'volunteer_activism', label:'Orações' },
    { id:'novenas', icon:'favorite', label:'Novenas' },
    { id:'catecismo', icon:'auto_stories', label:'Catecismo' },
    { id:'enciclicas', icon:'library_books', label:'Encíclicas' },
    { id:'direitocanonico', icon:'gavel', label:'Direito Canônico' },
    { id:'santos', icon:'star', label:'Santos' },
    { id:'liturgia', icon:'event', label:'Calendário Litúrgico' },
    { id:'objetos', icon:'church', label:'Objetos Sagrados' },
    { id:'confissao', icon:'self_improvement', label:'Exame de Consciência' },
    { id:'configuracoes', icon:'settings', label:'Configurações' }
  ];

  let el;

  function render(){
    const root = document.getElementById('sidebar-root');
    el = document.createElement('div');
    el.className = 'sidebar';
    el.innerHTML = `
      <div class="sidebar-header">
        <div class="logo">T</div>
        <div class="name">Totus Tuus</div>
      </div>
      <div id="sidebar-items"></div>
    `;
    root.appendChild(el);
    const list = el.querySelector('#sidebar-items');
    ITEMS.forEach(item => {
      const row = document.createElement('div');
      row.className = 'sidebar-item';
      row.dataset.route = item.id;
      row.innerHTML = `<span class="material-icons-round">${item.icon}</span><span>${item.label}</span>`;
      row.addEventListener('click', () => {
        Router.navigate(item.id);
        close();
      });
      list.appendChild(row);
    });
    document.getElementById('scrim').addEventListener('click', close);
  }

  function toggle(){
    el.classList.contains('open') ? close() : open();
  }
  function open(){
    el.classList.add('open');
    document.getElementById('scrim').classList.add('show');
  }
  function close(){
    el.classList.remove('open');
    document.getElementById('scrim').classList.remove('show');
  }
  function setActive(route){
    el.querySelectorAll('.sidebar-item').forEach(i => {
      i.classList.toggle('active', i.dataset.route === route);
    });
  }

  return { render, toggle, open, close, setActive };
})();
