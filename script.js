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

// Background music: gapless Web Audio loop, with a plain <audio> fallback
const MUSIC_ON = true;                    // set to false to switch the music off for everyone
const VOLUME = 0.4;                       // 0 (silent) to 1 (full). Ignored on iPhone/iPad.
const MUSIC_SRC = 'Assets/audio/churchill.mp3';

if (MUSIC_ON) {
  const events = ['click', 'touchend', 'pointerup', 'keydown'];
  const audioEl = document.getElementById('bgm');
  let mode = null, started = false, ctx = null, gain = null, buffer = null;

  const unlisten = () => events.forEach(e => removeEventListener(e, tryStart));

  const startWebAudio = () => ctx.resume().then(() => {
    if (ctx.state !== 'running' || started) return;
    const src = ctx.createBufferSource();
    src.buffer = buffer;
    src.loop = true;                      // sample-accurate loop, no gap
    src.connect(gain);
    src.start(0);
    started = true;
    unlisten();
  }).catch(() => {});

  const startElement = () => audioEl.play().then(() => {
    started = true;
    unlisten();
  }).catch(() => {});

  function tryStart() {
    if (started) return;
    if (mode === 'webaudio' && buffer) startWebAudio();
    else if (mode === 'element' && audioEl) startElement();
  }

  // Used when Web Audio can't load the file (e.g. page opened from disk)
  function useElement(reason) {
    console.warn('Music: using the <audio> fallback.', reason);
    mode = 'element';
    if (audioEl) { audioEl.volume = VOLUME; audioEl.loop = true; }
    tryStart();
  }

  // If the browser blocks autoplay, the first tap/click/key starts the music
  events.forEach(e => addEventListener(e, tryStart));

  const AC = window.AudioContext || window.webkitAudioContext;
  if (!AC || location.protocol === 'file:') {
    useElement('no Web Audio or opened from file://');
  } else {
    ctx = new AC();
    gain = ctx.createGain();
    gain.gain.value = VOLUME;
    gain.connect(ctx.destination);
    mode = 'webaudio';
    fetch(MUSIC_SRC)
      .then(r => { if (!r.ok) throw new Error('HTTP ' + r.status + ' for ' + MUSIC_SRC); return r.arrayBuffer(); })
      .then(data => new Promise((ok, fail) => ctx.decodeAudioData(data, ok, fail)))
      .then(buf => { buffer = buf; tryStart(); })
      .catch(err => useElement(err));
  }
}