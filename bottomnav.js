function CardComponent({ icon, title, sub, onClick }){
  const el = document.createElement('div');
  el.className = 'md-card';
  el.innerHTML = `
    <div class="card-icon"><span class="material-icons-round">${icon}</span></div>
    <div class="card-title">${title}</div>
    <div class="card-sub">${sub || ''}</div>
  `;
  el.addEventListener('click', onClick);
  return el;
}
