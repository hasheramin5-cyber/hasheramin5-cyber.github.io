// Page switching: one view at a time, no scrolling between sections
const views=[...document.querySelectorAll('.view')];
function show(id){if(!views.some(v=>v.id===id))id='home';views.forEach(v=>v.classList.toggle('active',v.id===id));scrollTo(0,0)}
document.addEventListener('click',e=>{const b=e.target.closest('[data-go]');if(b)location.hash=b.dataset.go==='home'?'':b.dataset.go});
addEventListener('hashchange',()=>show(location.hash.slice(1)));show(location.hash.slice(1));

// Gallery (photo list lives in config.js)
const grid=document.getElementById('grid'),lb=document.getElementById('lb');
GALLERY.forEach((src,n)=>{
  const b=document.createElement('button');b.className='g';
  b.innerHTML='<img src="'+src+'" alt="Gallery image '+(n+1)+'" loading="lazy"><div class="ph">'+src+'</div>';
  const im=b.querySelector('img');
  im.onerror=()=>{im.remove();b.classList.add('empty')};
  b.onclick=()=>{if(im.isConnected){lb.firstElementChild.src=im.src;lb.classList.add('on')}};
  grid.appendChild(b);
});
lb.onclick=()=>lb.classList.remove('on');
addEventListener('keydown',e=>{if(e.key==='Escape')lb.classList.remove('on')});

// Background music, controlled from code only (no visitor controls)
const MUSIC_ON = true;   // set to false to switch the music off for everyone
const VOLUME = 0.4;      // 0 (silent) to 1 (full)

const bgm = document.getElementById('bgm');
bgm.volume = VOLUME;

if (MUSIC_ON) {
  // Try to autoplay on load. If the browser blocks it,
  // start on the visitor's first click, tap or key press.
  bgm.play().catch(() => {
    const events = ['pointerdown', 'keydown', 'touchstart'];
    const start = () => {
      bgm.play().catch(() => {});
      events.forEach(e => removeEventListener(e, start));
    };
    events.forEach(e => addEventListener(e, start));
  });
} else {
  bgm.pause();
}