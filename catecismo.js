const PaginaInicio = {
  title: 'Totus Tuus',
  hasBack: false,

  VERSICULOS: [
    { texto:"Tudo posso naquele que me fortalece.", ref:"Filipenses 4,13" },
    { texto:"O Senhor é o meu pastor, nada me faltará.", ref:"Salmo 23,1" },
    { texto:"Vinde a mim, todos os que estais cansados e oprimidos, e eu vos aliviarei.", ref:"Mateus 11,28" },
    { texto:"Tudo o que pedirdes ao Pai em meu nome, ele vo-lo concederá.", ref:"João 16,23" },
    { texto:"O amor é paciente, o amor é bondoso.", ref:"1 Coríntios 13,4" },
    { texto:"Não temas, porque eu sou contigo.", ref:"Isaías 41,10" },
    { texto:"Buscai primeiro o Reino de Deus e a sua justiça.", ref:"Mateus 6,33" }
  ],

  render(el){
    const dia = new Date().getDate();
    const versiculo = this.VERSICULOS[dia % this.VERSICULOS.length];

    el.innerHTML = `
      <div class="home-hero">
        <div class="brand">
          <div class="logo">T</div>
          <div class="app-name">Totus Tuus</div>
        </div>
        <div class="verse-card">
          <div class="label">Versículo do Dia</div>
          <div class="text">"${versiculo.texto}"</div>
          <div class="ref">${versiculo.ref}</div>
        </div>
        <div id="home-search"></div>
      </div>
      <div class="section-title">Explorar</div>
      <div class="card-grid" id="home-cards"></div>
    `;

    const searchHost = el.querySelector('#home-search');
    const bar = SearchBarComponent({
      placeholder: 'Pesquisar no app...',
      onSubmit: () => Router.navigate('busca')
    });
    bar.style.cursor = 'pointer';
    bar.addEventListener('click', () => Router.navigate('busca'));
    searchHost.appendChild(bar);

    const cards = [
      { icon:'menu_book', title:'Bíblia', sub:'Leitura e busca', rota:'biblia' },
      { icon:'volunteer_activism', title:'Orações', sub:'Diárias e tradicionais', rota:'oracoes' },
      { icon:'auto_stories', title:'Catecismo', sub:'Doutrina da Igreja', rota:'catecismo' },
      { icon:'library_books', title:'Encíclicas', sub:'Documentos papais', rota:'enciclicas' },
      { icon:'gavel', title:'Direito Canônico', sub:'Código de cânones', rota:'direitocanonico' },
      { icon:'event', title:'Liturgia', sub:'Calendário do dia', rota:'liturgia' },
      { icon:'star', title:'Santos', sub:'Vidas e exemplos', rota:'santos' },
      { icon:'favorite', title:'Novenas', sub:'Nove dias de oração', rota:'novenas' },
      { icon:'church', title:'Objetos Sagrados', sub:'Guia do altar', rota:'objetos' },
      { icon:'self_improvement', title:'Exame de Consciência', sub:'Antes da confissão', rota:'confissao' }
    ];
    const grid = el.querySelector('#home-cards');
    cards.forEach(c => grid.appendChild(CardComponent({
      icon:c.icon, title:c.title, sub:c.sub, onClick:() => Router.navigate(c.rota)
    })));
  }
};
