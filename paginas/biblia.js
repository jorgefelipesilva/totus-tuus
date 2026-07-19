const PaginaBiblia = {
  title: 'Bíblia',
  hasBack: false,
  _dados: null,

  SLUGS: {
    'Gênesis':'genesis','Êxodo':'exodus','Levítico':'leviticus','Números':'numbers','Deuteronômio':'deuteronomy',
    'Josué':'joshua','Juízes':'judges','Rute':'ruth','1 Samuel':'1samuel','2 Samuel':'2samuel',
    '1 Reis':'1kings','2 Reis':'2kings','1 Crônicas':'1chronicles','2 Crônicas':'2chronicles',
    'Esdras':'ezra','Neemias':'nehemiah','Ester':'esther','Jó':'job','Salmos':'psalms','Provérbios':'proverbs',
    'Eclesiastes':'ecclesiastes','Cântico dos Cânticos':'songofsolomon','Isaías':'isaiah','Jeremias':'jeremiah',
    'Lamentações':'lamentations','Ezequiel':'ezekiel','Daniel':'daniel','Oseias':'hosea','Joel':'joel',
    'Amós':'amos','Abdias':'obadiah','Jonas':'jonah','Miqueias':'micah','Naum':'nahum','Habacuc':'habakkuk',
    'Sofonias':'zephaniah','Ageu':'haggai','Zacarias':'zechariah','Malaquias':'malachi',
    'Mateus':'matthew','Marcos':'mark','Lucas':'luke','João':'john','Atos dos Apóstolos':'acts',
    'Romanos':'romans','1 Coríntios':'1corinthians','2 Coríntios':'2corinthians','Gálatas':'galatians',
    'Efésios':'ephesians','Filipenses':'philippians','Colossenses':'colossians',
    '1 Tessalonicenses':'1thessalonians','2 Tessalonicenses':'2thessalonians',
    '1 Timóteo':'1timothy','2 Timóteo':'2timothy','Tito':'titus','Filêmon':'philemon','Hebreus':'hebrews',
    'Tiago':'james','1 Pedro':'1peter','2 Pedro':'2peter','1 João':'1john','2 João':'2john','3 João':'3john',
    'Judas':'jude','Apocalipse':'revelation'
  },

  async load(){
    if(this._dados) return this._dados;
    this._dados = await fetch('data/bibliaAveMaria.json').then(r => r.json());
    return this._dados;
  },

  async render(el, param){
    const dados = await this.load();
    if(param){
      const [livro, cap] = param.split('::');
      this.renderLeitura(el, dados, livro, Number(cap) || 1);
      return;
    }
    this.renderLista(el, dados);
  },

  renderLista(el, dados){
    let query = '';
    const continuar = Storage.getContinuarLeitura();
    const historico = Storage.getHistorico('biblia').slice(0,5);

    el.innerHTML = `
      <div id="bi-search"></div>
      ${continuar ? `
        <div class="detail-panel" id="bi-continuar" style="cursor:pointer;">
          <div class="meta">Continuar leitura</div>
          <div class="titulo" style="font-size:16px;">${continuar.livro} ${continuar.capitulo}</div>
        </div>` : ''}
      <div class="chip-row">
        <div class="chip active" data-t="antigoTestamento">Antigo Testamento</div>
        <div class="chip" data-t="novoTestamento">Novo Testamento</div>
        <div class="chip" data-t="favoritos">Favoritos</div>
      </div>
      <div class="list-page" id="bi-lista"></div>
    `;
    el.querySelector('#bi-search').appendChild(SearchBarComponent({
      placeholder: 'Buscar livro ou palavra (favoritos/histórico)...',
      onInput: v => { query = v; renderLista(); }
    }));
    if(continuar){
      el.querySelector('#bi-continuar').addEventListener('click', () => {
        Router.navigate('biblia', `${continuar.livro}::${continuar.capitulo}`);
      });
    }

    let testamento = 'antigoTestamento';
    el.querySelectorAll('.chip[data-t]').forEach(chip => {
      chip.addEventListener('click', () => {
        el.querySelectorAll('.chip[data-t]').forEach(c => c.classList.remove('active'));
        chip.classList.add('active');
        testamento = chip.dataset.t;
        renderLista();
      });
    });

    const listaEl = el.querySelector('#bi-lista');
    renderLista();

    const self = this;
    function renderLista(){
      if(testamento === 'favoritos'){
        const favs = Storage.getFavoritos('versiculo');
        if(!favs.length){
          listaEl.innerHTML = `<div class="empty-state"><span class="material-icons-round">favorite_border</span><div>Nenhum versículo favoritado</div></div>`;
          return;
        }
        listaEl.innerHTML = favs.map(f => `
          <div class="list-item" data-livro="${f.livro}" data-cap="${f.capitulo}">
            <div><div class="titulo">${f.titulo}</div><div class="meta">${(f.texto||'').slice(0,60)}...</div></div>
            <span class="material-icons-round">chevron_right</span>
          </div>
        `).join('');
        listaEl.querySelectorAll('.list-item').forEach(item => {
          item.addEventListener('click', () => Router.navigate('biblia', `${item.dataset.livro}::${item.dataset.cap}`));
        });
        return;
      }

      let livros = dados.livros[testamento];
      if(query){
        const q = query.toLowerCase();
        const matchLivros = livros.filter(l => l.toLowerCase().includes(q));
        const matchHist = historico.filter(h => (h.texto||'').toLowerCase().includes(q) || h.titulo.toLowerCase().includes(q));
        listaEl.innerHTML = `
          ${matchLivros.map(l => `<div class="list-item" data-livro="${l}"><div class="titulo">${l}</div><span class="material-icons-round">chevron_right</span></div>`).join('')}
          ${matchHist.map(h => `<div class="list-item" data-livro="${h.livro}" data-cap="${h.capitulo}"><div><div class="titulo">${h.titulo}</div><div class="meta">do histórico</div></div><span class="material-icons-round">chevron_right</span></div>`).join('')}
        `;
        listaEl.querySelectorAll('.list-item').forEach(item => {
          item.addEventListener('click', () => Router.navigate('biblia', `${item.dataset.livro}::${item.dataset.cap||1}`));
        });
        return;
      }

      listaEl.innerHTML = livros.map(l => `
        <div class="list-item" data-livro="${l}">
          <div class="titulo">${l}</div>
          <span class="material-icons-round">chevron_right</span>
        </div>
      `).join('');
      listaEl.querySelectorAll('.list-item').forEach(item => {
        item.addEventListener('click', () => Router.navigate('biblia', `${item.dataset.livro}::1`));
      });
    }
  },

  async buscarCapitulo(livro, capitulo){
    const dados = await this.load();
    const amostraKey = livro.replace(/\s+/g,'_') + '_' + capitulo;
    if(dados.amostra[amostraKey]){
      return { versiculos: dados.amostra[amostraKey].versiculos, fonte:'amostra' };
    }
    const slug = this.SLUGS[livro];
    if(!slug) return { erro:'sem-slug' };
    try{
      const res = await fetch(`https://bible-api.com/${slug}+${capitulo}?translation=almeida`);
      if(!res.ok) throw new Error();
      const json = await res.json();
      if(!json.verses || !json.verses.length) throw new Error();
      return { versiculos: json.verses.map(v => v.text.trim()), fonte:'api' };
    }catch(e){
      return { erro:'falha-rede' };
    }
  },

  async renderLeitura(el, dados, livro, capitulo){
    Header.setTitle(`${livro} ${capitulo}`, () => Router.navigate('biblia'));
    const prefs = Storage.getPrefs();
    let fonte = prefs.fonteBiblia || 17;

    el.innerHTML = `
      <div class="font-slider">
        <span class="material-icons-round">text_decrease</span>
        <input type="range" min="14" max="26" value="${fonte}" id="bi-fonte">
        <span class="material-icons-round">text_increase</span>
      </div>
      <div id="bi-capitulos"></div>
      <div id="bi-loadmore" style="text-align:center; padding:20px;"></div>
    `;
    const capsEl = el.querySelector('#bi-capitulos');
    const loadMoreEl = el.querySelector('#bi-loadmore');

    el.querySelector('#bi-fonte').addEventListener('input', e => {
      const v = Number(e.target.value);
      capsEl.querySelectorAll('.corpo').forEach(c => c.style.fontSize = v+'px');
      Storage.setPref('fonteBiblia', v);
    });

    let capAtual = capitulo;
    let carregando = false;

    const carregarCapitulo = async (cap) => {
      if(carregando) return;
      carregando = true;
      const bloco = document.createElement('div');
      bloco.className = 'detail-panel';
      bloco.innerHTML = `<div class="titulo">${livro} ${cap}</div><div class="corpo" style="font-size:${fonte}px">Carregando...</div>`;
      capsEl.appendChild(bloco);

      const resultado = await this.buscarCapitulo(livro, cap);
      if(resultado.erro){
        bloco.querySelector('.corpo').innerHTML = resultado.erro === 'sem-slug'
          ? 'Este livro não está disponível para leitura automática nesta versão do app.'
          : 'Não foi possível carregar. Verifique sua conexão.';
        loadMoreEl.innerHTML = '';
        carregando = false;
        return;
      }
      const texto = resultado.versiculos.map((v,i) => `<span data-v="${i+1}">${i+1}. ${v}</span>`).join(' ');
      bloco.querySelector('.corpo').innerHTML = texto;

      const actions = document.createElement('div');
      actions.className = 'detail-actions';
      actions.innerHTML = `
        <button class="action-btn" data-fav><span class="material-icons-round">favorite_border</span> Favoritar capítulo</button>
        <button class="action-btn" data-share><span class="material-icons-round">share</span> Compartilhar</button>
      `;
      bloco.appendChild(actions);
      const fullText = resultado.versiculos.join(' ');
      actions.querySelector('[data-fav]').addEventListener('click', e => {
        const nowFav = Storage.toggleFavorito('versiculo', `${livro}_${cap}`, { titulo: `${livro} ${cap}`, livro, capitulo: cap, texto: fullText });
        e.currentTarget.querySelector('.material-icons-round').textContent = nowFav ? 'favorite' : 'favorite_border';
        showToast(nowFav ? 'Capítulo favoritado' : 'Removido dos favoritos');
      });
      actions.querySelector('[data-share]').addEventListener('click', () => {
        shareText(`${livro} ${cap}`, `${livro} ${cap}\n\n${fullText}`);
      });

      Storage.addHistorico('biblia', { id:`${livro}_${cap}`, titulo:`${livro} ${cap}`, livro, capitulo:cap, texto: fullText.slice(0,120) });
      Storage.setContinuarLeitura({ livro, capitulo: cap });

      carregando = false;
      loadMoreEl.innerHTML = `<button class="action-btn" id="bi-proximo"><span class="material-icons-round">expand_more</span> Próximo capítulo</button>`;
      loadMoreEl.querySelector('#bi-proximo').addEventListener('click', () => {
        capAtual += 1;
        carregarCapitulo(capAtual);
      });
    };

    carregarCapitulo(capAtual);

    let scrollTimeout;
    document.getElementById('view-root').addEventListener('scroll', function onScroll(e){
      if(Router.current !== 'biblia') { e.currentTarget.removeEventListener('scroll', onScroll); return; }
      clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(() => {
        const root = document.getElementById('view-root');
        if(root.scrollTop + root.clientHeight > root.scrollHeight - 300 && !carregando){
          capAtual += 1;
          carregarCapitulo(capAtual);
        }
      }, 150);
    });
  }
};
