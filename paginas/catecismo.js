const PaginaCatecismo = {
  title: 'Catecismo',
  hasBack: false,
  _data: null,

  async load(){
    if(this._data) return this._data;
    this._data = await fetch('data/catecismo.json').then(r => r.json());
    return this._data;
  },

  async render(el){
    const data = await this.load();
    let query = '';

    el.innerHTML = `
      <div id="cat-search"></div>
      <div class="external-note">${data.aviso}</div>
      <div class="list-page" id="cat-lista"></div>
    `;
    el.querySelector('#cat-search').appendChild(SearchBarComponent({
      placeholder: 'O que você quer saber? Ex: aborto, confissão, matrimônio...',
      onInput: v => { query = v; renderLista(); }
    }));

    const listaEl = el.querySelector('#cat-lista');
    renderLista();

    function renderLista(){
      let itens = data.topicos;
      if(query){
        const q = query.toLowerCase();
        itens = itens.filter(t => t.titulo.toLowerCase().includes(q) || t.resumo.toLowerCase().includes(q));
      }
      if(!itens.length){
        listaEl.innerHTML = `<div class="empty-state"><span class="material-icons-round">search_off</span><div>Nenhum tópico encontrado</div></div>`;
        return;
      }
      listaEl.innerHTML = itens.map(t => `
        <div class="list-item" data-url="${t.url}">
          <div>
            <div class="titulo">${t.titulo}</div>
            <div class="meta">CIC ${t.paragrafos} · ${t.resumo}</div>
          </div>
          <span class="material-icons-round">open_in_new</span>
        </div>
      `).join('');
      listaEl.querySelectorAll('.list-item').forEach(item => {
        item.addEventListener('click', () => window.open(item.dataset.url, '_blank'));
      });
    }
  }
};
