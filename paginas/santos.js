const PaginaSantos = {
  title: 'Santos',
  hasBack: false,
  _data: null,

  async load(){
    if(this._data) return this._data;
    this._data = await fetch('data/santos.json').then(r => r.json());
    return this._data;
  },

  async render(el, param){
    const data = await this.load();
    if(param){ this.renderDetalhe(el, data, param); return; }

    let query = '';
    el.innerHTML = `<div id="st-search"></div><div class="list-page" id="st-lista"></div>`;
    el.querySelector('#st-search').appendChild(SearchBarComponent({
      placeholder: 'Pesquisar santos...',
      onInput: v => { query = v; renderLista(); }
    }));
    const listaEl = el.querySelector('#st-lista');
    renderLista();

    function renderLista(){
      let itens = data.santos;
      if(query){
        const q = query.toLowerCase();
        itens = itens.filter(s => s.nome.toLowerCase().includes(q) || s.resumo.toLowerCase().includes(q));
      }
      listaEl.innerHTML = itens.map(s => `
        <div class="list-item" data-id="${s.id}">
          <div>
            <div class="titulo">${s.nome}</div>
            <div class="meta">Festa: ${s.festa} · ${s.padroeiro}</div>
          </div>
          <span class="material-icons-round">chevron_right</span>
        </div>
      `).join('');
      listaEl.querySelectorAll('.list-item').forEach(item => {
        item.addEventListener('click', () => Router.navigate('santos', item.dataset.id));
      });
    }
  },

  renderDetalhe(el, data, id){
    const santo = data.santos.find(s => s.id === id);
    if(!santo){ el.innerHTML = `<div class="empty-state">Santo não encontrado</div>`; return; }
    Header.setTitle(santo.nome, () => Router.navigate('santos'));
    const isFav = Storage.isFavorito('santo', santo.id);

    el.innerHTML = `
      <div class="detail-panel">
        <div class="titulo">${santo.nome}</div>
        <div class="meta" style="margin-bottom:10px;">Festa: ${santo.festa} · Padroeiro: ${santo.padroeiro}</div>
        <div class="corpo">${santo.resumo}</div>
        <div class="detail-actions">
          <button class="action-btn ${isFav ? 'active' : ''}" id="st-fav">
            <span class="material-icons-round">${isFav ? 'favorite' : 'favorite_border'}</span> Favoritar
          </button>
          <button class="action-btn" id="st-share">
            <span class="material-icons-round">share</span> Compartilhar
          </button>
        </div>
      </div>
    `;
    el.querySelector('#st-fav').addEventListener('click', e => {
      const nowFav = Storage.toggleFavorito('santo', santo.id, { titulo: santo.nome });
      e.currentTarget.classList.toggle('active', nowFav);
      e.currentTarget.querySelector('.material-icons-round').textContent = nowFav ? 'favorite' : 'favorite_border';
      showToast(nowFav ? 'Adicionado aos favoritos' : 'Removido dos favoritos');
    });
    el.querySelector('#st-share').addEventListener('click', () => {
      shareText(santo.nome, `${santo.nome} — Festa: ${santo.festa}\n\n${santo.resumo}`);
    });
  }
};
