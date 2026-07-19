const Router = (() => {
  const pages = {};
  const viewRoot = () => document.getElementById('view-root');
  let currentRoute = null;

  function register(name, pageModule){
    pages[name] = pageModule;
  }

  function parseHash(){
    const hash = location.hash.replace('#/', '') || 'inicio';
    const [route, ...rest] = hash.split('/');
    const param = rest.join('/');
    return { route, param: param ? decodeURIComponent(param) : null };
  }

  function navigate(route, param){
    location.hash = '#/' + route + (param ? '/' + encodeURIComponent(param) : '');
  }

  function render(){
    const { route, param } = parseHash();
    const page = pages[route] || pages['inicio'];
    currentRoute = route in pages ? route : 'inicio';

    viewRoot().scrollTop = 0;
    viewRoot().innerHTML = '';
    const el = document.createElement('div');
    el.className = 'page';
    viewRoot().appendChild(el);

    page.render(el, param);
    Header.setTitle(page.title || 'Totus Tuus', page.hasBack ? () => history.back() : null);
    Sidebar.setActive(currentRoute);
    BottomNav.setActive(currentRoute);
  }

  function init(){
    window.addEventListener('hashchange', render);
    render();
  }

  return { register, navigate, init, get current(){ return currentRoute; } };
})();
