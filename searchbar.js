const Header = (() => {
  let titleEl, backBtn, currentBack = null;

  function render(){
    const root = document.getElementById('header-root');
    const el = document.createElement('div');
    el.className = 'app-header';
    el.innerHTML = `
      <button class="icon-btn" id="btn-back" style="display:none">
        <span class="material-icons-round">arrow_back</span>
      </button>
      <button class="icon-btn" id="btn-menu">
        <span class="material-icons-round">menu</span>
      </button>
      <div class="title" id="header-title">Totus Tuus</div>
      <button class="icon-btn" id="btn-theme">
        <span class="material-icons-round">dark_mode</span>
      </button>
      <button class="icon-btn" id="btn-search">
        <span class="material-icons-round">search</span>
      </button>
    `;
    root.appendChild(el);
    titleEl = el.querySelector('#header-title');
    backBtn = el.querySelector('#btn-back');

    el.querySelector('#btn-menu').addEventListener('click', () => Sidebar.toggle());
    el.querySelector('#btn-search').addEventListener('click', () => Router.navigate('busca'));
    el.querySelector('#btn-theme').addEventListener('click', () => {
      const modes = ['light','dark','auto'];
      const next = modes[(modes.indexOf(Theme.current())+1) % modes.length];
      Theme.set(next);
    });
    backBtn.addEventListener('click', () => {
      if(currentBack) currentBack();
    });
  }

  function setTitle(title, backFn){
    if(titleEl) titleEl.textContent = title;
    currentBack = backFn || null;
    if(backBtn) backBtn.style.display = backFn ? 'flex' : 'none';
  }

  return { render, setTitle };
})();
