const PaginaConfiguracoes = {
  title: 'Configurações',
  hasBack: false,

  render(el){
    const tema = Theme.current();
    el.innerHTML = `
      <div class="list-page">
        <div class="list-item" style="display:block">
          <div class="titulo">Tema</div>
          <div class="chip-row" style="padding:10px 0 0;">
            <div class="chip ${tema==='light'?'active':''}" data-t="light">Claro</div>
            <div class="chip ${tema==='dark'?'active':''}" data-t="dark">Escuro</div>
            <div class="chip ${tema==='auto'?'active':''}" data-t="auto">Automático</div>
          </div>
        </div>
        <div class="list-item" data-action="limpar-favoritos">
          <div><div class="titulo">Limpar favoritos e histórico</div><div class="meta">Remove dados salvos neste dispositivo</div></div>
          <span class="material-icons-round">delete_outline</span>
        </div>
        <div class="list-item" style="display:block">
          <div class="titulo">Sobre o Totus Tuus</div>
          <div class="meta" style="margin-top:6px;">Aplicativo católico com Bíblia, orações, catecismo, encíclicas, direito canônico, santos, novenas e liturgia. Funciona offline como PWA.</div>
        </div>
      </div>
    `;
    el.querySelectorAll('.chip[data-t]').forEach(chip => {
      chip.addEventListener('click', () => {
        Theme.set(chip.dataset.t);
        el.querySelectorAll('.chip[data-t]').forEach(c => c.classList.remove('active'));
        chip.classList.add('active');
      });
    });
    el.querySelector('[data-action="limpar-favoritos"]').addEventListener('click', () => {
      localStorage.removeItem('tt_favoritos');
      localStorage.removeItem('tt_historico');
      showToast('Dados limpos');
    });
  }
};
