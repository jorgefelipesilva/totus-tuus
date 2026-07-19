const CACHE = 'totus-tuus-v1';
const ASSETS = [
  './',
  'index.html',
  'manifest.json',
  'css/style.css',
  'js/app.js',
  'js/router.js',
  'js/search.js',
  'js/storage.js',
  'js/theme.js',
  'componentes/header.js',
  'componentes/sidebar.js',
  'componentes/bottomnav.js',
  'componentes/card.js',
  'componentes/searchbar.js',
  'paginas/inicio.js',
  'paginas/biblia.js',
  'paginas/oracoes.js',
  'paginas/catecismo.js',
  'paginas/enciclicas.js',
  'paginas/direitocanonico.js',
  'paginas/santos.js',
  'paginas/novenas.js',
  'paginas/liturgia.js',
  'paginas/objetos.js',
  'paginas/confissao.js',
  'paginas/configuracoes.js',
  'data/oracoes.json',
  'data/santos.json',
  'data/novenas.json',
  'data/catecismo.json',
  'data/enciclicas.json',
  'data/direitoCanonico.json',
  'data/bibliaAveMaria.json'
];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(ASSETS)));
  self.skipWaiting();
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k))))
  );
  self.clients.claim();
});

self.addEventListener('fetch', e => {
  const url = new URL(e.request.url);
  if(url.origin !== location.origin){
    e.respondWith(
      fetch(e.request).catch(() => caches.match(e.request))
    );
    return;
  }
  e.respondWith(
    caches.match(e.request).then(cached => {
      const network = fetch(e.request).then(res => {
        caches.open(CACHE).then(c => c.put(e.request, res.clone()));
        return res;
      }).catch(() => cached);
      return cached || network;
    })
  );
});
