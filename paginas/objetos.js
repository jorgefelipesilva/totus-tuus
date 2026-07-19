const PaginaObjetos = {
  title: 'Objetos Sagrados',
  hasBack: false,

  ITENS: [
    { nome:'Cálice', desc:'Taça sagrada usada para consagrar o vinho, que se torna o Sangue de Cristo na Missa.' },
    { nome:'Cibório', desc:'Recipiente com tampa usado para guardar as hóstias consagradas destinadas à comunhão dos fiéis.' },
    { nome:'Patena', desc:'Pequeno prato, geralmente de metal precioso, sobre o qual se coloca a hóstia durante a Missa.' },
    { nome:'Custódia (Ostensório)', desc:'Peça usada para expor a Hóstia consagrada à adoração dos fiéis, especialmente na Adoração ao Santíssimo.' },
    { nome:'Píxide', desc:'Pequeno recipiente usado para levar a comunhão a doentes ou para guardar hóstias no sacrário.' },
    { nome:'Sacrário', desc:'Local reservado e fechado, geralmente no altar-mor, onde se guardam as hóstias consagradas.' },
    { nome:'Casula', desc:'Veste litúrgica externa usada pelo sacerdote durante a Missa, na cor do tempo litúrgico.' },
    { nome:'Estola', desc:'Faixa de tecido que simboliza a autoridade sacerdotal, usada sobre os ombros pelo padre e ao redor do pescoço pelo diácono.' },
    { nome:'Turíbulo', desc:'Recipiente pendurado por correntes usado para queimar incenso durante celebrações solenes.' },
    { nome:'Naveta', desc:'Pequeno recipiente que guarda o incenso antes de ser colocado no turíbulo.' },
    { nome:'Âmbula', desc:'Vaso usado para guardar o óleo dos catecúmenos, dos enfermos ou o crisma.' },
    { nome:'Galheta', desc:'Pequenas jarras de água e vinho usadas na preparação das oferendas durante a Missa.' },
    { nome:'Missal Romano', desc:'Livro litúrgico que contém as orações e rubricas para a celebração da Missa ao longo do ano.' },
    { nome:'Leccionário', desc:'Livro que reúne as leituras bíblicas proclamadas na Missa, organizadas conforme o calendário litúrgico.' },
    { nome:'Véu de ombros', desc:'Manto usado pelo sacerdote ao carregar a custódia em procissões com o Santíssimo Sacramento.' }
  ],

  render(el){
    el.innerHTML = `
      <div class="list-page">
        ${this.ITENS.map(i => `
          <div class="list-item" style="display:block">
            <div class="titulo">${i.nome}</div>
            <div class="meta" style="margin-top:6px;">${i.desc}</div>
          </div>
        `).join('')}
      </div>
    `;
  }
};
