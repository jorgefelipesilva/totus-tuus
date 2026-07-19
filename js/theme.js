const Theme = (() => {
  function apply(mode){
    const media = window.matchMedia('(prefers-color-scheme: dark)');
    const resolved = mode === 'auto' ? (media.matches ? 'dark' : 'light') : mode;
    document.documentElement.setAttribute('data-theme', resolved);
  }
  function init(){
    const prefs = Storage.getPrefs();
    apply(prefs.tema || 'auto');
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
      if(Storage.getPrefs().tema === 'auto') apply('auto');
    });
  }
  function set(mode){
    Storage.setPref('tema', mode);
    apply(mode);
  }
  function current(){
    return Storage.getPrefs().tema || 'auto';
  }
  return { init, set, current };
})();
