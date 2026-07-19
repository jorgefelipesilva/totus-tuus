const PaginaDireitoCanonico = {
  title: 'Direito Canônico',
  hasBack: false,
  _data: null,

  async load(){
    if(this._data) return this._data;
    this._data = await fetch('data/direitoCanonico.json').then(r => r.json());
    return this._data;
  },

  async render(el){
    const data = await this.load();
    el.innerHTML = `
      <div class="external-note">${data.aviso}</div>
      <div class="list-page">
        ${data.livros.map(l => `
          <div class="list-item">
            <div>
              <div class="titulo">${l.titulo}</div>
              <div class="meta">${l.canones} · ${l.resumo}</div>
            </div>
          </div>
        `).join('')}
        <div class="detail-actions" style="padding:8px 4px;">
          <button class="action-btn" id="dc-abrir"><span class="material-icons-round">picture_as_pdf</span> Abrir Código completo (PDF oficial)</button>
        </div>
      </div>
    `;
    el.querySelector('#dc-abrir').addEventListener('click', () => window.open(data.urlCompleto, '_blank'));
  }
};
