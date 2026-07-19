function SearchBarComponent({ placeholder, onInput, onSubmit, value }){
  const el = document.createElement('div');
  el.className = 'search-bar';
  el.innerHTML = `
    <span class="material-icons-round">search</span>
    <input type="text" placeholder="${placeholder || 'Pesquisar...'}" value="${value || ''}">
  `;
  const input = el.querySelector('input');
  input.addEventListener('input', e => onInput && onInput(e.target.value));
  input.addEventListener('keydown', e => {
    if(e.key === 'Enter' && onSubmit) onSubmit(e.target.value);
  });
  el.focusInput = () => input.focus();
  return el;
}
