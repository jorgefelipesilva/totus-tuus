const PaginaLiturgia = {
  title: 'Calendário Litúrgico',
  hasBack: false,

  MS_DAY: 86400000,

  d(y,m,day){ return new Date(Date.UTC(y,m,day)); },
  addDays(date,n){ return new Date(date.getTime() + n*this.MS_DAY); },
  dow(date){ return date.getUTCDay(); },
  same(a,b){ return a.getUTCFullYear()===b.getUTCFullYear() && a.getUTCMonth()===b.getUTCMonth() && a.getUTCDate()===b.getUTCDate(); },

  easter(year){
    const a=year%19,b=Math.floor(year/100),c=year%100,e=Math.floor(b/4),f=b%4,
      g=Math.floor((b+8)/25),h=(19*a+b-e-Math.floor((b-g+1)/3)+15)%30,i=Math.floor(c/4),k=c%4,
      l=(32+2*f+2*i-h-k)%7,m=Math.floor((a+11*h+22*l)/451),
      month=Math.floor((h+l-7*m+114)/31), day=((h+l-7*m+114)%31)+1;
    return this.d(year, month-1, day);
  },
  epiphany(year){
    for(let day=2; day<=8; day++){ const dt=this.d(year,0,day); if(this.dow(dt)===0) return dt; }
  },
  baptism(epi){ return epi.getUTCDate() >= 7 ? this.addDays(epi,1) : this.addDays(epi,7); },
  advent1(year){
    const xmas=this.d(year,11,25), xd=this.dow(xmas), back = xd===0?7:xd;
    return this.addDays(this.addDays(xmas,-back), -21);
  },
  markers(year){
    const easter=this.easter(year);
    return {
      easter, ash:this.addDays(easter,-46), palm:this.addDays(easter,-7),
      holyThu:this.addDays(easter,-3), goodFri:this.addDays(easter,-2),
      pentecost:this.addDays(easter,49), trinity:this.addDays(easter,56),
      corpus:this.addDays(easter,63), sacredHeart:this.addDays(easter,68),
      ascension:this.addDays(easter,42),
      epiphany:this.epiphany(year), baptism:this.baptism(this.epiphany(year)),
      advent1:this.advent1(year)
    };
  },
  ordinalWeeks(M){
    const lastSun = this.addDays(M.advent1,-7);
    const firstMon = this.addDays(M.pentecost,1);
    const firstSun = this.addDays(firstMon, (7 - this.dow(firstMon)) % 7);
    const n = Math.round((lastSun - firstSun)/(7*this.MS_DAY)) + 1;
    return { firstSun, firstWeek: 34 - n + 1 };
  },
  info(date){
    const year = date.getUTCFullYear();
    const M = this.markers(year);
    const belongsNext = date.getTime() >= M.advent1.getTime();
    const lyLabel = belongsNext ? year+1 : year;
    const sundayCycle = ['A','B','C'][(lyLabel-1)%3];
    const weekdayCycle = year % 2 === 0 ? 'II' : 'I';

    const FIXAS = [[0,1,'Solenidade de Maria, Mãe de Deus','Branco'],[1,2,'Apresentação do Senhor','Branco'],
      [5,24,'Natividade de São João Batista','Branco'],[5,29,'São Pedro e São Paulo','Vermelho'],
      [7,15,'Assunção de Nossa Senhora','Branco'],[10,1,'Todos os Santos','Branco'],
      [10,2,'Finados','Roxo'],[11,8,'Imaculada Conceição','Branco'],[11,25,'Natal do Senhor','Branco']];

    let color='Verde', rank='Féria do Tempo Comum', special=null;
    for(const [mo,da,name,col] of FIXAS){ if(date.getUTCMonth()===mo && date.getUTCDate()===da){ special=name; color=col; rank='Solenidade'; } }
    const check = (d2,name,col,r) => { if(this.same(date,d2)){ special=name; color=col; rank=r; } };
    check(M.epiphany,'Epifania do Senhor','Branco','Solenidade');
    check(M.baptism,'Batismo do Senhor','Branco','Festa');
    check(M.ash,'Quarta-feira de Cinzas','Roxo','Início da Quaresma');
    check(M.palm,'Domingo de Ramos','Vermelho','Solenidade');
    check(M.holyThu,'Quinta-feira Santa','Branco','Tríduo Pascal');
    check(M.goodFri,'Sexta-feira Santa','Vermelho','Tríduo Pascal');
    check(M.easter,'Domingo de Páscoa','Branco','Solenidade');
    check(M.ascension,'Ascensão do Senhor','Branco','Solenidade');
    check(M.pentecost,'Pentecostes','Vermelho','Solenidade');
    check(M.trinity,'Santíssima Trindade','Branco','Solenidade');
    check(M.corpus,'Corpo e Sangue de Cristo','Branco','Solenidade');
    check(M.sacredHeart,'Sagrado Coração de Jesus','Vermelho','Solenidade');
    check(this.addDays(M.advent1,-7),'Cristo Rei do Universo','Branco','Solenidade');

    let season='Tempo Comum';
    if(date>=M.advent1 && date<this.d(year,11,25)){
      season='Advento'; if(!special) color='Roxo';
      const wn=Math.floor((date-M.advent1)/(7*this.MS_DAY))+1;
      if(!special) rank = this.dow(date)===0 ? wn+'º Domingo do Advento' : wn+'ª Semana do Advento';
      if(wn===3 && this.dow(date)===0 && !special){ color='Rosa'; rank='3º Domingo do Advento (Gaudete)'; }
    } else if(date>=this.d(year,11,25) || date<M.epiphany || (date>=M.epiphany && date<M.baptism)){
      season='Natal'; if(!special) color='Branco', rank='Tempo do Natal';
    } else if(date>=M.ash && date<M.holyThu){
      season='Quaresma'; if(!special) color='Roxo';
      const firstSun=this.addDays(M.ash, 7-this.dow(M.ash));
      const wn = date<firstSun ? 0 : Math.floor((date-firstSun)/(7*this.MS_DAY))+1;
      if(!special) rank = wn===0 ? 'Semana depois das Cinzas' : (this.dow(date)===0 ? wn+'º Domingo da Quaresma' : wn+'ª Semana da Quaresma');
      if(wn===4 && this.dow(date)===0 && !special){ color='Rosa'; rank='4º Domingo da Quaresma (Laetare)'; }
    } else if(date>=M.holyThu && date<M.easter){
      season='Tríduo Pascal'; if(!special) color='Roxo';
    } else if(date>=M.easter && date<=M.pentecost){
      season='Páscoa'; if(!special) color='Branco';
      const wn=Math.floor((date-M.easter)/(7*this.MS_DAY))+1;
      if(!special) rank = this.dow(date)===0 ? wn+'º Domingo da Páscoa' : wn+'ª Semana da Páscoa';
    } else {
      season='Tempo Comum'; if(!special) color='Verde';
      const ord=this.ordinalWeeks(M);
      let wn;
      if(date<M.ash) wn=Math.floor((date-M.baptism)/(7*this.MS_DAY))+1;
      else if(date<ord.firstSun) wn=ord.firstWeek;
      else wn=ord.firstWeek + Math.floor((date-ord.firstSun)/(7*this.MS_DAY));
      if(!special) rank = this.dow(date)===0 ? wn+'º Domingo do Tempo Comum' : wn+'ª Semana do Tempo Comum';
    }
    return { season, color, rank: special || rank, sundayCycle, weekdayCycle };
  },

  COLOR_HEX: { Verde:'#3E7D4F', Roxo:'#5B3A73', Branco:'#8A8578', Vermelho:'#B3261E', Rosa:'#D98BA6' },
  WD: ['Domingo','Segunda-feira','Terça-feira','Quarta-feira','Quinta-feira','Sexta-feira','Sábado'],
  MO: ['janeiro','fevereiro','março','abril','maio','junho','julho','agosto','setembro','outubro','novembro','dezembro'],

  render(el){
    const hoje = new Date();
    const today = this.d(hoje.getFullYear(), hoje.getMonth(), hoje.getDate());

    el.innerHTML = `
      <div class="external-note">Tempo litúrgico calculado localmente; leituras completas buscadas de uma fonte pública ao vivo.</div>
      <div style="padding:0 16px;">
        <input type="date" id="lt-date" style="width:100%;padding:14px;border-radius:14px;border:1px solid var(--md-outline-variant);background:var(--md-surface-container);color:var(--md-on-surface);font-size:15px;">
      </div>
      <div id="lt-result"></div>
      <div id="lt-readings"></div>
    `;
    const input = el.querySelector('#lt-date');
    const resultEl = el.querySelector('#lt-result');
    const readingsEl = el.querySelector('#lt-readings');

    const fmtKey = date => date.getUTCFullYear()+'-'+String(date.getUTCMonth()+1).padStart(2,'0')+'-'+String(date.getUTCDate()).padStart(2,'0');
    input.value = fmtKey(today);

    const draw = (date) => {
      const info = this.info(date);
      const hex = this.COLOR_HEX[info.color] || '#3E7D4F';
      resultEl.innerHTML = `
        <div class="detail-panel" style="text-align:center;">
          <div class="meta">${this.WD[this.dow(date)]}, ${date.getUTCDate()} de ${this.MO[date.getUTCMonth()]} de ${date.getUTCFullYear()}</div>
          <div class="titulo" style="margin:8px 0 2px;">${info.season}</div>
          <div class="meta" style="margin-bottom:14px;">${info.rank}</div>
          <div class="chip-row" style="justify-content:center; padding:0;">
            <span class="chip active"><span style="display:inline-block;width:10px;height:10px;border-radius:50%;background:${hex};margin-right:6px;"></span>${info.color}</span>
            <span class="chip">Ciclo ${info.sundayCycle}</span>
            <span class="chip">Ciclo ${info.weekdayCycle}</span>
          </div>
          <div class="detail-actions" style="justify-content:center;">
            <button class="action-btn" id="lt-btn-leituras"><span class="material-icons-round">menu_book</span> Ver leituras e orações</button>
          </div>
        </div>
      `;
      readingsEl.innerHTML = '';
      resultEl.querySelector('#lt-btn-leituras').addEventListener('click', () => fetchReadings(date));
    };

    const fetchReadings = async (date) => {
      const dd=String(date.getUTCDate()).padStart(2,'0'), mm=String(date.getUTCMonth()+1).padStart(2,'0'), yyyy=date.getUTCFullYear();
      readingsEl.innerHTML = `<div class="empty-state"><span class="material-icons-round">hourglass_empty</span><div>Buscando...</div></div>`;
      try{
        const res = await fetch(`https://liturgia.up.railway.app/v2/?dia=${dd}&mes=${mm}&ano=${yyyy}`);
        if(!res.ok) throw new Error();
        const data = await res.json();
        const blocks = [];
        const l = data.leituras || {};
        ['primeiraLeitura','salmo','segundaLeitura','evangelho'].forEach(key => {
          (l[key]||[]).forEach(item => {
            blocks.push(`<div class="list-item" style="display:block">
              <div class="titulo">${item.referencia || ''}</div>
              ${item.titulo ? `<div class="meta" style="margin:4px 0;">${item.titulo}</div>` : ''}
              <div style="margin-top:8px; line-height:1.6; white-space:pre-line;">${(item.texto||'').replace(/</g,'&lt;')}</div>
            </div>`);
          });
        });
        readingsEl.innerHTML = `<div class="list-page">${blocks.join('') || '<div class="empty-state">Sem leituras disponíveis.</div>'}</div>`;
      }catch(e){
        readingsEl.innerHTML = `<div class="empty-state"><span class="material-icons-round">wifi_off</span><div>Não foi possível buscar agora. Verifique sua conexão.</div></div>`;
      }
    };

    input.addEventListener('change', () => {
      const [y,m,dday] = input.value.split('-').map(Number);
      draw(this.d(y,m-1,dday));
    });
    draw(today);
  }
};
