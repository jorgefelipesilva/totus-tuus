const PaginaNovenas = {
  title: 'Novenas',
  hasBack: false,
  _data: null,

  async load(){
    if(this._data) return this._data;
    this._data = await fetch('data/novenas.json').then(r => r.json());
    return this._data;
  },

  async render(el, param){
    const data = await this.load();
    if(param){ this.renderDetalhe(el, data, param); return; }

    el.innerHTML = `<div class="list-page" id="nv-lista"></div>`;
    const listaEl = el.querySelector('#nv-lista');
    listaEl.innerHTML = data.novenas.map(n => `
      <div class="list-item" data-id="${n.id}">
        <div>
          <div class="titulo">${n.titulo}</div>
          <div class="meta">${n.descricao}${n.disponivel ? '' : ' · em breve'}</div>
        </div>
        <span class="material-icons-round">chevron_right</span>
      </div>
    `).join('');
    listaEl.querySelectorAll('.list-item').forEach(item => {
      item.addEventListener('click', () => Router.navigate('novenas', item.dataset.id));
    });
  },

  renderDetalhe(el, data, id){
    const novena = data.novenas.find(n => n.id === id);
    if(!novena){ el.innerHTML = `<div class="empty-state">Novena não encontrada</div>`; return; }
    Header.setTitle(novena.titulo, () => Router.navigate('novenas'));

    if(!novena.disponivel){
      el.innerHTML = `
        <div class="empty-state">
          <span class="material-icons-round">hourglass_empty</span>
          <div>Esta novena ainda será adicionada.</div>
        </div>
      `;
      return;
    }

    el.innerHTML = `
      <div class="detail-panel">
        <div class="titulo">${novena.titulo}</div>
        <div class="corpo">${novena.descricao}</div>
      </div>
      <div class="list-page">
        ${novena.dias.map((texto, i) => `
          <div class="list-item" style="display:block">
            <div class="titulo">Dia ${i+1}</div>
            <div class="meta" style="margin-top:6px; line-height:1.6;">${texto.replace(/^Dia \d+: /,'')}</div>
          </div>
        `).join('')}
      </div>
    `;
  }
};
