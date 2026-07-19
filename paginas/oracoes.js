const PaginaOracoes = {
  title: 'Orações',
  hasBack: false,
  _data: null,

  async load(){
    if(this._data) return this._data;
    this._data = await fetch('data/oracoes.json').then(r => r.json());
    return this._data;
  },

  async render(el, param){
    const data = await this.load();
    if(param){
      this.renderDetalhe(el, data, param);
      return;
    }

    let categoriaAtiva = 'todas';
    let query = '';

    el.innerHTML = `
      <div id="or-search"></div>
      <div class="chip-row" id="or-chips">
        <div class="chip active" data-cat="todas">Todas</div>
        <div class="chip" data-cat="favoritos">Favoritas</div>
        ${data.categorias.map(c => `<div class="chip" data-cat="${c.id}">${c.nome}</div>`).join('')}
      </div>
      <div class="list-page" id="or-lista"></div>
    `;

    const searchHost = el.querySelector('#or-search');
    searchHost.appendChild(SearchBarComponent({
      placeholder: 'Pesquisar orações...',
      onInput: v => { query = v; renderLista(); }
    }));

    el.querySelectorAll('#or-chips .chip').forEach(chip => {
      chip.addEventListener('click', () => {
        el.querySelectorAll('#or-chips .chip').forEach(c => c.classList.remove('active'));
        chip.classList.add('active');
        categoriaAtiva = chip.dataset.cat;
        renderLista();
      });
    });

    const listaEl = el.querySelector('#or-lista');
    renderLista();

    function renderLista(){
      let itens = data.oracoes;
      if(categoriaAtiva === 'favoritos'){
        const favIds = Storage.getFavoritos('oracao').map(f => f.id);
        itens = itens.filter(o => favIds.includes(o.id));
      } else if(categoriaAtiva !== 'todas'){
        itens = itens.filter(o => o.categorias.includes(categoriaAtiva));
      }
      if(query){
        const q = query.toLowerCase();
        itens = itens.filter(o => o.titulo.toLowerCase().includes(q) || o.texto.toLowerCase().includes(q));
      }
      if(!itens.length){
        listaEl.innerHTML = `<div class="empty-state"><span class="material-icons-round">volunteer_activism</span><div>Nenhuma oração encontrada</div></div>`;
        return;
      }
      listaEl.innerHTML = itens.map(o => `
        <div class="list-item" data-id="${o.id}">
          <div><div class="titulo">${o.titulo}</div><div class="meta">${o.texto.slice(0,60)}...</div></div>
          <span class="material-icons-round">chevron_right</span>
        </div>
      `).join('');
      listaEl.querySelectorAll('.list-item').forEach(item => {
        item.addEventListener('click', () => Router.navigate('oracoes', item.dataset.id));
      });
    }
  },

  renderDetalhe(el, data, id){
    const oracao = data.oracoes.find(o => o.id === id);
    if(!oracao){
      el.innerHTML = `<div class="empty-state"><span class="material-icons-round">error_outline</span><div>Oração não encontrada</div></div>`;
      return;
    }
    Header.setTitle(oracao.titulo, () => Router.navigate('oracoes'));
    const prefs = Storage.getPrefs();
    let fonte = prefs.fonteOracoes || 16;
    const isFav = Storage.isFavorito('oracao', oracao.id);

    el.innerHTML = `
      <div class="font-slider">
        <span class="material-icons-round">text_decrease</span>
        <input type="range" min="13" max="24" value="${fonte}" id="or-fonte">
        <span class="material-icons-round">text_increase</span>
      </div>
      <div class="detail-panel">
        <div class="titulo">${oracao.titulo}</div>
        <div class="corpo" id="or-corpo" style="font-size:${fonte}px">${oracao.texto}</div>
        <div class="detail-actions">
          <button class="action-btn ${isFav ? 'active' : ''}" id="or-fav">
            <span class="material-icons-round">${isFav ? 'favorite' : 'favorite_border'}</span> Favoritar
          </button>
          <button class="action-btn" id="or-share">
            <span class="material-icons-round">share</span> Compartilhar
          </button>
        </div>
      </div>
    `;

    el.querySelector('#or-fonte').addEventListener('input', e => {
      const v = Number(e.target.value);
      el.querySelector('#or-corpo').style.fontSize = v + 'px';
      Storage.setPref('fonteOracoes', v);
    });
    el.querySelector('#or-fav').addEventListener('click', (e) => {
      const nowFav = Storage.toggleFavorito('oracao', oracao.id, { titulo: oracao.titulo });
      e.currentTarget.classList.toggle('active', nowFav);
      e.currentTarget.querySelector('.material-icons-round').textContent = nowFav ? 'favorite' : 'favorite_border';
      showToast(nowFav ? 'Adicionada aos favoritos' : 'Removida dos favoritos');
    });
    el.querySelector('#or-share').addEventListener('click', () => {
      shareText(oracao.titulo, oracao.titulo + '\n\n' + oracao.texto);
    });
  }
};
