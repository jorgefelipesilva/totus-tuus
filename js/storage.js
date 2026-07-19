const Storage = (() => {
  const KEYS = {
    FAV: 'tt_favoritos',
    HIST: 'tt_historico',
    PREFS: 'tt_prefs',
    LEITURA: 'tt_continuar_leitura'
  };

  function read(key, fallback){
    try{
      const raw = localStorage.getItem(key);
      return raw ? JSON.parse(raw) : fallback;
    }catch(e){ return fallback; }
  }
  function write(key, value){
    try{ localStorage.setItem(key, JSON.stringify(value)); }catch(e){}
  }

  return {
    getFavoritos(tipo){
      const all = read(KEYS.FAV, {});
      return all[tipo] || [];
    },
    toggleFavorito(tipo, id, payload){
      const all = read(KEYS.FAV, {});
      all[tipo] = all[tipo] || [];
      const idx = all[tipo].findIndex(i => i.id === id);
      let isFav;
      if(idx >= 0){ all[tipo].splice(idx,1); isFav = false; }
      else { all[tipo].unshift({ id, ...payload, ts: Date.now() }); isFav = true; }
      write(KEYS.FAV, all);
      return isFav;
    },
    isFavorito(tipo, id){
      return this.getFavoritos(tipo).some(i => i.id === id);
    },
    addHistorico(tipo, entrada){
      const all = read(KEYS.HIST, {});
      all[tipo] = all[tipo] || [];
      all[tipo] = all[tipo].filter(i => i.id !== entrada.id);
      all[tipo].unshift({ ...entrada, ts: Date.now() });
      all[tipo] = all[tipo].slice(0, 50);
      write(KEYS.HIST, all);
    },
    getHistorico(tipo){
      const all = read(KEYS.HIST, {});
      return all[tipo] || [];
    },
    getPrefs(){
      return read(KEYS.PREFS, { tema:'auto', fonteBiblia:17, fonteOracoes:16 });
    },
    setPref(key, value){
      const p = this.getPrefs();
      p[key] = value;
      write(KEYS.PREFS, p);
      return p;
    },
    setContinuarLeitura(ref){
      write(KEYS.LEITURA, ref);
    },
    getContinuarLeitura(){
      return read(KEYS.LEITURA, null);
    }
  };
})();
