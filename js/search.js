const GlobalSearch = (() => {
  let index = [];
  let ready = false;

  function normalize(s){
    return (s || '').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase();
  }

  async function build(){
    if(ready) return;
    const [oracoes, santos, novenas] = await Promise.all([
      fetch('data/oracoes.json').then(r => r.json()).catch(() => ({ oracoes: [] })),
      fetch('data/santos.json').then(r => r.json()).catch(() => ({ santos: [] })),
      fetch('data/novenas.json').then(r => r.json()).catch(() => ({ novenas: [] }))
    ]);

    oracoes.oracoes.forEach(o => index.push({
      tipo:'oracao', tipoLabel:'Oração', id:o.id, titulo:o.titulo,
      texto:o.texto, rota:'oracoes', busca: normalize(o.titulo + ' ' + o.texto)
    }));
    santos.santos.forEach(s => index.push({
      tipo:'santo', tipoLabel:'Santo', id:s.id, titulo:s.nome,
      texto:s.resumo, rota:'santos', busca: normalize(s.nome + ' ' + s.resumo)
    }));
    novenas.novenas.forEach(n => index.push({
      tipo:'novena', tipoLabel:'Novena', id:n.id, titulo:n.titulo,
      texto:n.descricao, rota:'novenas', busca: normalize(n.titulo + ' ' + n.descricao)
    }));

    ready = true;
  }

  function search(query){
    const q = normalize(query);
    if(!q || q.length < 2) return [];
    return index.filter(item => item.busca.includes(q)).slice(0, 40);
  }

  return { build, search };
})();

const PaginaBusca = {
  title: 'Pesquisar',
  hasBack: true,
  async render(el){
    el.innerHTML = `
      <div id="sb-root"></div>
      <div class="chip-row" id="sb-filtros">
        <div class="chip active" data-f="todos">Todos</div>
        <div class="chip" data-f="oracao">Orações</div>
        <div class="chip" data-f="santo">Santos</div>
        <div class="chip" data-f="novena">Novenas</div>
      </div>
      <div id="sb-resultados" class="list-page"></div>
    `;
    const sbRoot = el.querySelector('#sb-root');
    const resultsEl = el.querySelector('#sb-resultados');
    let filtro = 'todos';
    let query = '';

    const bar = SearchBarComponent({
      placeholder: 'Pesquisar orações, santos, novenas...',
      onInput: v => { query = v; renderResults(); }
    });
    sbRoot.appendChild(bar);
    setTimeout(() => bar.focusInput(), 150);

    el.querySelectorAll('#sb-filtros .chip').forEach(chip => {
      chip.addEventListener('click', () => {
        el.querySelectorAll('#sb-filtros .chip').forEach(c => c.classList.remove('active'));
        chip.classList.add('active');
        filtro = chip.dataset.f;
        renderResults();
      });
    });

    await GlobalSearch.build();
    renderResults();

    function renderResults(){
      if(!query || query.length < 2){
        resultsEl.innerHTML = `<div class="empty-state"><span class="material-icons-round">search</span><div>Digite ao menos 2 letras para buscar</div></div>`;
        return;
      }
      let results = GlobalSearch.search(query);
      if(filtro !== 'todos') results = results.filter(r => r.tipo === filtro);
      if(!results.length){
        resultsEl.innerHTML = `<div class="empty-state"><span class="material-icons-round">search_off</span><div>Nada encontrado para "${query}"</div></div>`;
        return;
      }
      resultsEl.innerHTML = results.map(r => `
        <div class="list-item" data-rota="${r.rota}" data-id="${r.id}">
          <div>
            <div class="titulo">${r.titulo}</div>
            <div class="meta">${r.tipoLabel} · ${(r.texto||'').slice(0,70)}...</div>
          </div>
          <span class="material-icons-round">chevron_right</span>
        </div>
      `).join('');
      resultsEl.querySelectorAll('.list-item').forEach(item => {
        item.addEventListener('click', () => Router.navigate(item.dataset.rota, item.dataset.id));
      });
    }
  }
};
