const PaginaEnciclicas = {
  title: 'Encíclicas',
  hasBack: false,
  _data: null,

  async load(){
    if(this._data) return this._data;
    this._data = await fetch('data/enciclicas.json').then(r => r.json());
    return this._data;
  },

  async render(el){
    const data = await this.load();
    let query = '';
    let papaAtivo = 'todos';
    const papas = [...new Set(data.enciclicas.map(e => e.papa))];

    el.innerHTML = `
      <div id="en-search"></div>
      <div class="external-note">${data.aviso}</div>
      <div class="chip-row" id="en-chips">
        <div class="chip active" data-p="todos">Todos</div>
        ${papas.map(p => `<div class="chip" data-p="${p}">${p}</div>`).join('')}
      </div>
      <div class="list-page" id="en-lista"></div>
    `;
    el.querySelector('#en-search').appendChild(SearchBarComponent({
      placeholder: 'Pesquisar encíclicas...',
      onInput: v => { query = v; renderLista(); }
    }));
    el.querySelectorAll('#en-chips .chip').forEach(chip => {
      chip.addEventListener('click', () => {
        el.querySelectorAll('#en-chips .chip').forEach(c => c.classList.remove('active'));
        chip.classList.add('active');
        papaAtivo = chip.dataset.p;
        renderLista();
      });
    });

    const listaEl = el.querySelector('#en-lista');
    renderLista();

    function renderLista(){
      let itens = data.enciclicas;
      if(papaAtivo !== 'todos') itens = itens.filter(e => e.papa === papaAtivo);
      if(query){
        const q = query.toLowerCase();
        itens = itens.filter(e => e.titulo.toLowerCase().includes(q) || e.tema.toLowerCase().includes(q));
      }
      if(!itens.length){
        listaEl.innerHTML = `<div class="empty-state"><span class="material-icons-round">search_off</span><div>Nenhuma encíclica encontrada</div></div>`;
        return;
      }
      listaEl.innerHTML = itens.map(e => `
        <div class="list-item" data-url="${e.url}">
          <div>
            <div class="titulo">${e.titulo} <span style="color:var(--md-on-surface-variant);font-weight:400">(${e.ano})</span></div>
            <div class="meta">${e.papa} · ${e.tema}</div>
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
