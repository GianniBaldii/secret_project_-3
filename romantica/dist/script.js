/* PERSONALIZACIÓN: correct es el índice de la respuesta (0 = primera).
   Las fotos y textos de las pantallas están en index.html; colores en style.css. */
const CONFIG = {
  // La épica existente acompaña la trivia; Axel empieza al aceptar la propuesta.
  music: { epic: 'assets/epica.wav', romantic: 'assets/axel-te-voy-a-amar.mp3' },
  questions: [
    { text: '¿En qué fecha empezó oficialmente todo este quilombo? ❤️', options: ['4 de junio de 2026', '4 de julio de 2026', '13 de julio de 2026'], correct: 1, success: 'Bien ahí pulguita 😌❤️. Veo que por ahora conservás la memoria.', error: 'JULI JAJAJA arrancamos como el orto. Probá de nuevo.' },
    { text: 'Un poquito de matemática porque lamentablemente te enamoraste de un nerd:\n\n¿Cuánto es 220000 + 500 + 3?', options: ['220053', '225003', '220503'], correct: 2, success: '220503... 22/05/03 ❤️\n\nEl cumpleaños de una pulguita que quiero una banda.', error: 'Dale científica, vos trabajás en un laboratorio, no me podés fallar esto JAJAJA.' },
    { text: 'Cuando nosotros ponemos una película... ¿qué suele pasar realmente? 🎬', options: ['La vemos completa, concentrados y sin interrupciones.', 'Hacemos un análisis cinematográfico profesional.', 'Terminamos hablando, haciendo boludeces y dándonos demasiados besitos.', 'Gianni explica durante 40 minutos por qué el anime es superior.'], correct: 2, success: 'CORRECTO JAJAJA ❤️\n\nAlgún día vamos a terminar una película como dos personas normales.\n\nHoy probablemente tampoco.', errors: ['Juli... los dos sabemos perfectamente que esto nunca pasó JAJAJA.', 'Sí claro, Scorsese y Coppola somos nosotros.', '', 'Esto tranquilamente podría pasar, pero sorprendentemente no era la respuesta correcta.'], effect: 'kisses' },
    { text: 'Y ahora sí, la pregunta más importante de nuestra relación:\n\n¿Quién perdió al chinchón el domingo pasado? 🃏', options: ['Juli', 'Gianni', 'Empate'], correct: 0, success: 'EXACTAMENTE.\n\nPERDISTE VOS.\n\nQuería aprovechar este momento romántico para dejar constancia histórica de este hecho ❤️😂', errors: ['', 'No, pulguita JAJAJA. No intentes modificar los hechos históricos.', 'No hubo ningún empate. Afrontá las consecuencias de tus actos 😂'], effect: 'champion' }
  ],
  noMessages: ['¿Estás segura? 👀', 'Me parece que te equivocaste de botón...', 'JULIETA ¿CÓMO VAS A CLIQUEAR QUE NO? JAJAJA', 'Mirá que tengo acceso al código fuente, estás jugando de visitante.', 'Pues vendeme y comprate un conejo y un Stitch 😭', 'Has alcanzado el límite permitido de intentos para rechazarme.\n\nLamentablemente el sistema es así.']
};
const $ = id => document.getElementById(id);
let questionIndex = 0, answered = false, noCount = 0;
let track = 'epic', playing = false, muted = false, fadeTimer, effectTimer;
const audio = $('soundtrack');
audio.src = CONFIG.music.epic;
audio.volume = .42;
function musicUI() {
  playing = !audio.paused;
  $('music').setAttribute('aria-pressed', String(playing));
  $('music').setAttribute('aria-label', playing ? 'Pausar música' : 'Activar música');
  $('music').innerHTML = `${playing ? 'Ⅱ' : '♫'} <span>Música</span>`;
}
audio.addEventListener('play', musicUI);
audio.addEventListener('pause', musicUI);
audio.addEventListener('error', () => { audio.pause(); musicUI(); });
function playMusic(kind = track) {
  clearInterval(fadeTimer);
  if (kind !== track) { audio.pause(); audio.src = CONFIG.music[kind]; track = kind; }
  audio.volume = .42;
  if (muted) return;
  // Se llama directamente desde el toque para ser compatible con celulares.
  audio.play().then(musicUI).catch(musicUI);
}
function fadeMusic() {
  clearInterval(fadeTimer);
  fadeTimer = setInterval(() => {
    audio.volume = Math.max(0, audio.volume - .035);
    if (audio.volume <= .001) { clearInterval(fadeTimer); audio.pause(); }
  }, 90);
}
$('music').addEventListener('click', () => {
  if (!audio.paused) { clearInterval(fadeTimer); muted = true; audio.pause(); }
  else { muted = false; playMusic(); }
});
function show(id) {
  clearTimeout(effectTimer);
  $('confetti').replaceChildren();
  document.querySelectorAll('.screen').forEach(screen => { screen.hidden = screen.id !== id; });
  window.scrollTo({ top: 0, behavior: 'instant' });
  $(id).querySelector('h1,h2')?.focus({ preventScroll: true });
}
function celebrate(kisses = false) {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  clearTimeout(effectTimer);
  $('confetti').replaceChildren();
  for (let i = 0; i < (kisses ? 14 : 85); i++) {
    const el = document.createElement('span'); el.className = kisses ? 'piece kiss' : 'piece';
    el.textContent = kisses ? (i % 3 ? '♥' : '💋') : (i % 3 ? '♥' : '✦');
    el.style.left = `${Math.random() * 100}%`;
    el.style.color = ['#782d46','#cf647f','#d39b56','#b8405d'][i % 4];
    el.style.setProperty('--duration', `${(kisses ? 2 : 3) + Math.random() * 3}s`);
    el.style.setProperty('--drift', `${Math.random() * 180 - 90}px`);
    el.style.animationDelay = `${Math.random() * 1.5}s`;
    $('confetti').append(el);
  }
  effectTimer = setTimeout(() => $('confetti').replaceChildren(), 8000);
}
function renderQuestion() {
  answered = false;
  const q = CONFIG.questions[questionIndex];
  $('question').textContent = q.text;
  $('step-label').textContent = `${String(questionIndex + 1).padStart(2, '0')} / ${String(CONFIG.questions.length).padStart(2, '0')}`;
  const progress = document.querySelector('.progress');
  progress.replaceChildren();
  progress.setAttribute('aria-valuemax', CONFIG.questions.length);
  progress.setAttribute('aria-valuenow', questionIndex);
  CONFIG.questions.forEach((_, index) => {
    const segment = document.createElement('span'); segment.classList.toggle('active', index <= questionIndex); progress.append(segment);
  });
  $('feedback').textContent = ''; $('next').hidden = true; $('answers').replaceChildren();
  q.options.forEach((option, index) => {
    const button = document.createElement('button'); button.className = 'answer';
    const letter = document.createElement('span'); letter.textContent = String.fromCharCode(65 + index);
    button.append(letter, document.createTextNode(option));
    button.addEventListener('click', () => {
      if (answered) return;
      $('answers').querySelectorAll('button').forEach(el => el.classList.remove('wrong'));
      if (index !== q.correct) { button.classList.add('wrong'); $('feedback').textContent = q.errors?.[index] || q.error; return; }
      answered = true; button.classList.add('correct'); $('feedback').textContent = q.success;
      progress.setAttribute('aria-valuenow', questionIndex + 1);
      $('answers').querySelectorAll('button').forEach(el => { el.disabled = true; });
      // No mover el scroll a Seguir: primero se lee el feedback completo.
      const revealNext = () => { $('next').hidden = false; $('next').focus({ preventScroll: true }); };
      if (q.effect === 'champion') {
        $('champion').hidden = false;
        setTimeout(() => { $('champion').hidden = true; revealNext(); }, 1800);
      } else { if (q.effect === 'kisses') celebrate(true); revealNext(); }
    });
    $('answers').append(button);
  });
}
$('start').addEventListener('click', () => { playMusic('epic'); renderQuestion(); show('quiz'); });
$('next').addEventListener('click', () => {
  if (!answered) return;
  if (questionIndex < CONFIG.questions.length - 1) { questionIndex++; renderQuestion(); show('quiz'); }
  else { fadeMusic(); show('transition'); }
});
$('continue').addEventListener('click', () => show('romance'));
$('ask').addEventListener('click', () => show('before-proposal'));
$('propose').addEventListener('click', () => show('proposal'));
$('no').addEventListener('click', () => {
  if (noCount >= CONFIG.noMessages.length) return;
  $('no-message').textContent = CONFIG.noMessages[noCount++];
  $('yes').style.transform = `scale(${1 + noCount * .035})`;
  $('no').style.fontSize = `${Math.max(.875, 1 - noCount * .03)}rem`;
  if (noCount >= CONFIG.noMessages.length) { $('no').hidden = true; $('yes').focus({ preventScroll: true }); }
});
$('yes').addEventListener('click', () => { playMusic('romantic'); show('success'); celebrate(); });
