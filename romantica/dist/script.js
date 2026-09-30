/* PERSONALIZACIÓN: editá textos, opciones y correct (índice desde 0).
   Las fotos se cambian en index.html y los colores en style.css.
   Podés reemplazar estos WAV por MP3 propios, actualizando las rutas. */
const CONFIG = {
  // Canción elegida: Axel — Te Voy a Amar. Cambiá esta ruta para reemplazarla.
  // Acompaña todo el recorrido sin reiniciarse entre pantallas.
  // Usá null para volver a las dos instrumentales por etapa.
  backgroundMusic: 'assets/axel-te-voy-a-amar.mp3',
  music: { epic: 'assets/epica.wav', romantic: 'assets/romantica.wav' },
  questions: [
    { text: '¿Qué día nos conocimos? ❤️', options: ['4 de junio de 2026', '4 de julio de 2026', '13 de julio de 2026'], correct: 1, success: 'Bien ahí 😌 esa fecha no se olvida.', error: 'Mmm… arrancamos flojito jajaja. Probá de nuevo.' },
    // 220000 + 500 + 3 = 220503 → 22/05/03, su cumpleaños.
    { text: 'Un poquito de matemática… ¿cuánto es 220000 + 500 + 3? 🧮', options: ['220053', '225003', '220503'], correct: 2, success: '¡Exacto! 220503… 22/05/03. ¿Te suena esa fecha? Tu cumpleaños ❤️🎂', error: 'Casi, Juli… sumá de nuevo, que este número es especial 😌' },
    { text: 'Pregunta importantísima: ¿quién perdió el domingo pasado al chinchón? 🃏', options: ['Empate', 'Gianni', 'Juli'], correct: 2, success: 'EXACTAMENTE, PULGUITA. PERDISTE VOS. ACEPTALO Y VIVÍ CON ESO ❤️😂', errors: ['No no no… no intentes reescribir la historia 😂', 'No, salame JAJAJA.'] }
  ],
  noMessages: ['¿Estás segura? 👀', 'Me parece que te equivocaste de botón…', 'JULIETA, ¿CÓMO VAS A CLIQUEAR QUE NO? JAJAJA', 'Pues vendeme y comprate un conejo y un Stitch 😭', 'Has alcanzado el límite de intentos de negarte. Ahora solo te queda decir que sí. ❤️']
};
const $ = id => document.getElementById(id);
let questionIndex = 0, answered = false, noCount = 0;
let track = 'epic', playing = false, muted = false, fadeTimer;
const audio = new Audio(CONFIG.backgroundMusic || CONFIG.music.epic);
audio.preload = 'none'; // No descargar música hasta el primer toque en el celular.
audio.loop = true; audio.volume = .42;
function musicUI() { $('music').setAttribute('aria-pressed', String(playing)); $('music').setAttribute('aria-label', playing ? 'Pausar música' : 'Activar música'); $('music').innerHTML = `${playing ? 'Ⅱ' : '♫'} <span>Música</span>`; }
function playMusic(kind = track) {
  clearInterval(fadeTimer);
  if (kind !== track) {
    if (!CONFIG.backgroundMusic) { audio.pause(); audio.src = CONFIG.music[kind]; }
    track = kind;
  }
  audio.volume = .42;
  if (muted) return;
  audio.play().then(() => { playing = true; musicUI(); }).catch(() => { playing = false; musicUI(); });
}
function fadeMusic() {
  if (CONFIG.backgroundMusic) return;
  clearInterval(fadeTimer);
  fadeTimer = setInterval(() => { audio.volume = Math.max(0, audio.volume - .035); if (audio.volume <= .001) { clearInterval(fadeTimer); audio.pause(); playing = false; musicUI(); } }, 90);
}
$('music').addEventListener('click', () => { if (playing) { clearInterval(fadeTimer); audio.pause(); playing = false; muted = true; musicUI(); } else { muted = false; playMusic(); } });
function show(id) {
  document.querySelectorAll('.screen').forEach(screen => { screen.hidden = screen.id !== id; });
  window.scrollTo({ top: 0, behavior: 'instant' });
  const heading = $(id).querySelector('h1,h2'); heading?.focus({ preventScroll: true });
}
function renderQuestion() {
  answered = false;
  const q = CONFIG.questions[questionIndex];
  $('question').textContent = q.text;
  $('step-label').textContent = `0${questionIndex + 1} / 03`;
  document.querySelectorAll('.progress span').forEach((el, index) => el.classList.toggle('active', index <= questionIndex));
  $('feedback').textContent = ''; $('next').hidden = true; $('answers').replaceChildren();
  q.options.forEach((option, index) => {
    const button = document.createElement('button'); button.className = 'answer';
    const letter = document.createElement('span'); letter.textContent = 'ABC'[index]; button.append(letter, document.createTextNode(option));
    button.addEventListener('click', () => {
      if (answered) return;
      $('answers').querySelectorAll('button').forEach(el => el.classList.remove('wrong'));
      if (index !== q.correct) { button.classList.add('wrong'); $('feedback').textContent = q.errors?.[index] || q.error; return; }
      answered = true; button.classList.add('correct'); $('feedback').textContent = q.success;
      $('answers').querySelectorAll('button').forEach(el => { el.disabled = true; });
      if (questionIndex === 2) {
        $('champion').hidden = false;
        setTimeout(() => { $('champion').hidden = true; $('next').hidden = false; $('next').focus(); }, 1800);
      } else { $('next').hidden = false; $('next').focus(); }
    });
    $('answers').append(button);
  });
}
$('start').addEventListener('click', () => { playMusic('epic'); renderQuestion(); show('quiz'); });
$('next').addEventListener('click', () => {
  if (!answered) return;
  if (questionIndex < 2) { questionIndex++; renderQuestion(); $('question').focus(); }
  else { fadeMusic(); show('transition'); }
});
$('continue').addEventListener('click', () => { playMusic('romantic'); show('romance'); });
$('ask').addEventListener('click', () => show('proposal'));
$('no').addEventListener('click', () => {
  $('no-message').textContent = CONFIG.noMessages[noCount]; noCount++;
  $('yes').style.transform = `scale(${1 + noCount * .045})`;
  // La letra se achica, pero el área táctil conserva al menos 54px de alto.
  $('no').style.fontSize = `${Math.max(.875, 1 - noCount * .03)}rem`;
  if (noCount >= CONFIG.noMessages.length) { $('no').hidden = true; $('yes').focus(); }
});
$('yes').addEventListener('click', () => {
  show('success');
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  for (let i = 0; i < 85; i++) {
    const el = document.createElement('span'); el.className = 'piece'; el.textContent = i % 3 ? '♥' : '✦';
    el.style.left = `${Math.random() * 100}%`; el.style.color = ['#782d46','#cf647f','#d39b56','#b8405d'][i % 4];
    el.style.setProperty('--duration', `${3 + Math.random() * 3}s`); el.style.setProperty('--drift', `${Math.random() * 180 - 90}px`); el.style.animationDelay = `${Math.random() * 1.5}s`;
    $('confetti').append(el);
  }
  setTimeout(() => $('confetti').replaceChildren(), 8000);
});
