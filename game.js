// Rotterdam Runner - game.js
// A retro Mario-style platformer celebrating Rotterdam's landmarks

// ─── Rotterdam Color Palette ─────────────────────────────────────────────────
const PAL = {
  red:       '#e63946',
  blue:      '#457b9d',
  darkBlue:  '#1d3557',
  lightBlue: '#a8dadc',
  white:     '#f1faee',
};

// ─── Retro Color Palette (color-hex.com/color-palette/165) ───────────────────
const RETRO = {
  olive:    '#404040', // dark grey — sky
  orange:   '#fb2e01', // orange-red — skyline silhouette
  mint:     '#6fcb9f', // mint green — ground
  gold:     '#ffe28a', // golden yellow — jumpable platforms & stars
  cream:    '#fffeb3', // pale cream — star accent / sky horizon
};

// ─── Internationalisation ─────────────────────────────────────────────────────
const STRINGS = {
  NL: {
    subtitle:        'Een retro run door de stad',
    press_start:     'DRUK SPATIE OM TE STARTEN',
    controls_start:  '← → Bewegen    SPATIE Springen    ESC Pauze',
    select_level:    'KIES LEVEL',
    controls_select: '← → Kiezen    SPATIE Starten',
    game_over:       'GAME OVER',
    press_return:    'DRUK SPATIE OM TERUG TE GAAN',
    win_message:     'LEKKER BEZIG, GAP!',
    new_high_score:  'NIEUW RECORD!',
    paused:          'GEPAUZEERD',
    resume:          'Druk ESC om verder te spelen',
    score_label:     'SCORE',
    best_label:      'BESTE',
    final_score:     'SCORE',
    high_score:      'HIGH SCORE',
    lang_toggle:     '← TAAL: NL →',
    press_continue:  'Druk SPATIE om door te gaan',
    death_seagull:   'Kijk uit joh, teringmeeuw!',
    death_golf:      'Bro, die Golf denkt dat dit Zandvoort is!',
    death_banana:    'Wie pleurt hier nou een banaan neer man!',
    death_bicycle:   'Waar heb jij leren fietsen joh?!',
    death_fall:      'Je ken ook nergens normaal lopen hier\u2026',
    level1_name:     'Trekpleisters',
    level1_desc:     'Een tour langs de iconen van Rotterdam.',
    level2_name:     'Marathon',
    level2_desc:     'Loop de 42km Rotterdam Marathon.',
  },
  EN: {
    subtitle:        'A retro run through the city',
    press_start:     'PRESS SPACE TO START',
    controls_start:  '← → Move    SPACE Jump    ESC Pause',
    select_level:    'SELECT LEVEL',
    controls_select: '← → Select    SPACE Start',
    game_over:       'GAME OVER',
    press_return:    'PRESS SPACE TO RETURN',
    win_message:     'WELL DONE!',
    new_high_score:  'NEW HIGH SCORE!',
    paused:          'PAUSED',
    resume:          'Press ESC to resume',
    score_label:     'SCORE',
    best_label:      'BEST',
    final_score:     'FINAL SCORE',
    high_score:      'HIGH SCORE',
    lang_toggle:     '← LANGUAGE: EN →',
    press_continue:  'Press SPACE to continue',
    death_seagull:   'Watch out, bloody seagull!',
    death_golf:      'Bro, that Golf thinks this is Zandvoort!',
    death_banana:    'Who throws a banana on the course?!',
    death_bicycle:   'Where did you learn to ride a bike?!',
    death_fall:      'You really can\'t walk anywhere normal here\u2026',
    level1_name:     'Landmarks',
    level1_desc:     'A tour past the icons of Rotterdam.',
    level2_name:     'Marathon',
    level2_desc:     'Run the 42km Rotterdam Marathon.',
  },
};

let currentLang = localStorage.getItem('rotterdam-game-lang') || 'NL';

function t(key) {
  return (STRINGS[currentLang] && STRINGS[currentLang][key]) || STRINGS['EN'][key] || key;
}

const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// ─── Canvas Scaling ──────────────────────────────────────────────────────────
function resizeCanvas() {
  const aspect = 16 / 9;
  let w = window.innerWidth;
  let h = window.innerHeight;
  if (w / h > aspect) {
    w = h * aspect;
  } else {
    h = w / aspect;
  }
  canvas.style.width = w + 'px';
  canvas.style.height = h + 'px';
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

// ─── Keyboard Input ──────────────────────────────────────────────────────────
const keys = {};
window.addEventListener('keydown', e => {
  keys[e.code] = true;
  if (!audioInitialized) initAudio();
  if (e.code === 'Escape') {
    if (gameState === 'playing') { gameState = 'paused'; }
    else if (gameState === 'paused') { gameState = 'playing'; }
  }
  if (e.code === 'Space') {
    if (gameState === 'start') { gameState = 'level_select'; localStorage.setItem('rotterdam-game-lang', currentLang); }
    else if (gameState === 'gameover') { gameState = 'level_select'; }
    else if (gameState === 'win') { gameState = 'level_select'; }
    else if (gameState === 'death_message') {
      deathCause = null;
      if (deathIsGameOver) {
        gameState = 'level_select';
      } else {
        gameState = 'playing';
      }
    }
    else if (gameState === 'level_select') {
      const level = LEVELS[selectedLevelIndex];
      if (level && level.unlocked) {
        startGame(level.id);
      }
    }
  }
  if (gameState === 'start') {
    if (e.code === 'ArrowLeft' || e.code === 'ArrowRight') {
      currentLang = currentLang === 'NL' ? 'EN' : 'NL';
    }
  }
  if (gameState === 'level_select') {
    if (e.code === 'ArrowRight' || e.code === 'ArrowDown') {
      selectedLevelIndex = (selectedLevelIndex + 1) % LEVELS.length;
    } else if (e.code === 'ArrowLeft' || e.code === 'ArrowUp') {
      selectedLevelIndex = (selectedLevelIndex - 1 + LEVELS.length) % LEVELS.length;
    }
  }
  e.preventDefault();
});
window.addEventListener('keyup', e => { keys[e.code] = false; });

// ─── Game State ──────────────────────────────────────────────────────────────
// 'start' | 'level_select' | 'playing' | 'paused' | 'gameover' | 'win'
let gameState = 'start';
let score = 0;
let currentLevel = null;
let selectedLevelIndex = 0;

// ─── Per-Level High Scores ───────────────────────────────────────────────────
let levelHighScores = {};

// ─── Audio ───────────────────────────────────────────────────────────────────
let audioCtx = null;
let audioInitialized = false;
let noiseBuffer = null;  // task 2.1

function createNoiseBuffer() {  // task 2.2
  const sampleRate = audioCtx.sampleRate;
  const buf = audioCtx.createBuffer(1, sampleRate, sampleRate); // 1 second
  const data = buf.getChannelData(0);
  for (let i = 0; i < data.length; i++) data[i] = Math.random() * 2 - 1;
  noiseBuffer = buf;
}

function initAudio() {
  audioInitialized = true;
  audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  createNoiseBuffer();  // task 2.3
  startMusic();
}

function playTone(freq, type, start, duration, gainVal) {
  if (!audioCtx) return;
  const osc = audioCtx.createOscillator();
  const gain = audioCtx.createGain();
  osc.connect(gain);
  gain.connect(audioCtx.destination);
  osc.type = type || 'square';
  osc.frequency.setValueAtTime(freq, start);
  gain.gain.setValueAtTime(gainVal || 0.15, start);
  gain.gain.exponentialRampToValueAtTime(0.001, start + duration);
  osc.start(start);
  osc.stop(start + duration + 0.01);
}

function playJumpSound() {
  if (!audioCtx) return;
  const t = audioCtx.currentTime;
  playTone(300, 'square', t, 0.05, 0.2);
  playTone(500, 'square', t + 0.05, 0.08, 0.15);
}

function playCollectSound() {
  if (!audioCtx) return;
  const t = audioCtx.currentTime;
  playTone(523, 'square', t, 0.07, 0.2);
  playTone(659, 'square', t + 0.07, 0.07, 0.2);
  playTone(784, 'square', t + 0.14, 0.12, 0.2);
}

function playGameOverSound() {
  if (!audioCtx) return;
  const t = audioCtx.currentTime;
  playTone(400, 'sawtooth', t, 0.15, 0.25);
  playTone(300, 'sawtooth', t + 0.15, 0.15, 0.2);
  playTone(200, 'sawtooth', t + 0.30, 0.15, 0.2);
  playTone(150, 'sawtooth', t + 0.45, 0.3, 0.15);
}

// ─── NES Chiptune Engine — "Hand in Hand, Kameraden" hook ────────────────────

// task 3.1 — 140 BPM
const BEAT_DURATION = 60 / 140; // ~0.4286s per beat

// task 3.2 — melody: [frequency Hz, duration in beats]
// Phrase 1: "Hand in Hand, Ka-me-ra-den"  G4 G4 E4 D4 C4 D4 E4 G4
// Phrase 2: "zo marcheren wij door Rotterdam" G4 A4 G4 E4 D4 C4 D4 C4
const G4 = 392, A4 = 440, E4 = 330, D4 = 294, C4 = 262;
const MELODY_PATTERN = [
  [G4, 1], [G4, 1], [E4, 1], [D4, 1],
  [C4, 1], [D4, 1], [E4, 1], [G4, 2],
  [G4, 1], [A4, 1], [G4, 1], [E4, 1],
  [D4, 1], [C4, 1], [D4, 1], [C4, 2],
];

// task 3.3 — bass: triangle, root notes on beats 1 & 3 (one octave below)
// Pattern length = 16 beats (same as melody). Bass hits every 2 beats.
const G3 = 196, C3 = 131, D3 = 147;
const BASS_PATTERN = [
  [G3, 2], [G3, 2],
  [C3, 2], [G3, 2],
  [G3, 2], [A4 / 2, 2],
  [G3, 2], [C3, 2],
];

// task 3.4 — percussion pattern over 16 beats (4 bars of 4/4)
// kick on beats 1,3 / snare on beats 2,4 of each bar
const PERC_PATTERN = [];
for (let bar = 0; bar < 4; bar++) {
  const base = bar * 4;
  PERC_PATTERN.push({ type: 'kick',  beat: base + 0 });
  PERC_PATTERN.push({ type: 'snare', beat: base + 1 });
  PERC_PATTERN.push({ type: 'kick',  beat: base + 2 });
  PERC_PATTERN.push({ type: 'snare', beat: base + 3 });
}
const PATTERN_BEATS = 16;

// task 4.1 — melody voice
function scheduleMelodyNote(freq, durationBeats, startTime) {
  if (!audioCtx) return;
  const dur = durationBeats * BEAT_DURATION * 0.85; // slight gap between notes
  const osc = audioCtx.createOscillator();
  const gain = audioCtx.createGain();
  osc.connect(gain);
  gain.connect(audioCtx.destination);
  osc.type = 'square';
  osc.frequency.setValueAtTime(freq, startTime);
  gain.gain.setValueAtTime(0.12, startTime);
  gain.gain.exponentialRampToValueAtTime(0.001, startTime + dur);
  osc.start(startTime);
  osc.stop(startTime + dur + 0.01);
}

// task 4.2 — bass voice
function scheduleBassNote(freq, durationBeats, startTime) {
  if (!audioCtx) return;
  const dur = durationBeats * BEAT_DURATION * 0.7;
  const osc = audioCtx.createOscillator();
  const gain = audioCtx.createGain();
  osc.connect(gain);
  gain.connect(audioCtx.destination);
  osc.type = 'triangle';
  osc.frequency.setValueAtTime(freq, startTime);
  gain.gain.setValueAtTime(0.18, startTime);
  gain.gain.exponentialRampToValueAtTime(0.001, startTime + dur);
  osc.start(startTime);
  osc.stop(startTime + dur + 0.01);
}

// task 4.3 — kick drum
function scheduleKick(startTime) {
  if (!audioCtx || !noiseBuffer) return;
  const src = audioCtx.createBufferSource();
  src.buffer = noiseBuffer;
  const filter = audioCtx.createBiquadFilter();
  filter.type = 'lowpass';
  filter.frequency.setValueAtTime(100, startTime);
  const gain = audioCtx.createGain();
  gain.gain.setValueAtTime(1.2, startTime);
  gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.08);
  src.connect(filter);
  filter.connect(gain);
  gain.connect(audioCtx.destination);
  src.start(startTime);
  src.stop(startTime + 0.09);
}

// task 4.4 — snare drum
function scheduleSnare(startTime) {
  if (!audioCtx || !noiseBuffer) return;
  const src = audioCtx.createBufferSource();
  src.buffer = noiseBuffer;
  const filter = audioCtx.createBiquadFilter();
  filter.type = 'bandpass';
  filter.frequency.setValueAtTime(250, startTime);
  filter.Q.value = 0.5;
  const gain = audioCtx.createGain();
  gain.gain.setValueAtTime(0.8, startTime);
  gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.12);
  src.connect(filter);
  filter.connect(gain);
  gain.connect(audioCtx.destination);
  src.start(startTime);
  src.stop(startTime + 0.13);
}

// task 5.1 — scheduler state
let schedulerNextTime = 0;
let schedulerMelodyIdx = 0;
let schedulerBassIdx = 0;
let schedulerPercIdx = 0;
let schedulerRunning = false;

// task 5.2 — lookahead scheduler
function musicScheduler() {
  if (!audioCtx) return;
  const LOOKAHEAD = 0.5; // 500ms — safe even in backgrounded tabs

  // Advance melody
  let melodyTime = schedulerNextTime;
  let mi = schedulerMelodyIdx;
  while (melodyTime < audioCtx.currentTime + LOOKAHEAD) {
    const [freq, beats] = MELODY_PATTERN[mi % MELODY_PATTERN.length];
    scheduleMelodyNote(freq, beats, melodyTime);
    melodyTime += beats * BEAT_DURATION;
    mi++;
  }
  schedulerMelodyIdx = mi;

  // Advance bass
  let bassTime = schedulerNextTime;
  let bi = schedulerBassIdx;
  while (bassTime < audioCtx.currentTime + LOOKAHEAD) {
    const [freq, beats] = BASS_PATTERN[bi % BASS_PATTERN.length];
    scheduleBassNote(freq, beats, bassTime);
    bassTime += beats * BEAT_DURATION;
    bi++;
  }
  schedulerBassIdx = bi;

  // Advance percussion — schedule by beat number
  const currentBeatStart = schedulerNextTime;
  const lookaheadBeats = Math.ceil(LOOKAHEAD / BEAT_DURATION) + 1;
  const startBeat = Math.round((schedulerNextTime - (audioCtx.currentTime)) / BEAT_DURATION);
  // Simple approach: track perc by absolute beat counter
  let pi = schedulerPercIdx;
  let percBeatTime = schedulerNextTime;
  while (percBeatTime < audioCtx.currentTime + LOOKAHEAD) {
    const hit = PERC_PATTERN[pi % PERC_PATTERN.length];
    if (hit.type === 'kick') scheduleKick(percBeatTime);
    else scheduleSnare(percBeatTime);
    percBeatTime += BEAT_DURATION;
    pi++;
  }
  schedulerPercIdx = pi;

  // Advance the global next time to wherever melody got to
  schedulerNextTime = melodyTime;

  setTimeout(musicScheduler, 50);
}

// task 5.3 — rewritten startMusic
function startMusic() {
  if (schedulerRunning) return;
  schedulerRunning = true;
  schedulerNextTime = audioCtx.currentTime + 0.05;
  schedulerMelodyIdx = 0;
  schedulerBassIdx = 0;
  schedulerPercIdx = 0;
  musicScheduler();
}

// ─── Canvas / Level Constants ─────────────────────────────────────────────────
const CANVAS_W = 800;
const CANVAS_H = 450;
const GROUND_Y = 400; // single ground level — all ground platforms share this Y

// ─── LEVELS — array of level descriptor objects ───────────────────────────────
const LEVELS = [
  {
    id: 1,
    name: 'Landmarks',
    description: 'Tour the iconic landmarks of Rotterdam.',
    unlocked: true,
    width: 3500,
    skyColor: RETRO.olive,
    silhouetteColor: RETRO.orange,
    platforms: [
      // Ground — unified at GROUND_Y=400 across all sections
      { x: 0,    y: GROUND_Y, w: 600,  h: 50,  color: RETRO.mint, type: 'ground' },
      { x: 650,  y: GROUND_Y, w: 400,  h: 50,  color: RETRO.mint, type: 'ground' },
      { x: 1100, y: GROUND_Y, w: 500,  h: 50,  color: RETRO.mint, type: 'ground' },
      { x: 1650, y: GROUND_Y, w: 300,  h: 50,  color: RETRO.mint, type: 'ground' },
      { x: 2000, y: GROUND_Y, w: 800,  h: 50,  color: RETRO.mint, type: 'ground' },

      // Erasmusbrug section — bridge cable platforms
      { x: 300,  y: 340, w: 120,  h: 15,  color: RETRO.mint, type: 'platform' },
      { x: 450,  y: 280, w: 80,   h: 15,  color: RETRO.mint, type: 'platform' },
      { x: 550,  y: 220, w: 80,   h: 15,  color: RETRO.mint, type: 'platform' },

      // Euromast section — tall tower steps
      { x: 700,  y: 350, w: 100,  h: 15,  color: RETRO.mint, type: 'platform' },
      { x: 750,  y: 290, w: 80,   h: 15,  color: RETRO.mint, type: 'platform' },
      { x: 780,  y: 230, w: 60,   h: 15,  color: RETRO.mint, type: 'platform' },
      { x: 800,  y: 170, w: 40,   h: 15,  color: RETRO.mint, type: 'platform' }, // top of tower

      // Markthal section — arch-shaped platforms
      { x: 1000, y: 360, w: 120,  h: 15,  color: RETRO.mint, type: 'platform' },
      { x: 1050, y: 300, w: 150,  h: 15,  color: RETRO.mint, type: 'platform' },
      { x: 1100, y: 240, w: 120,  h: 15,  color: RETRO.mint, type: 'platform' },

      // Kubuswoningen — tilted cube platforms
      { x: 1350, y: 370, w: 90,   h: 15,  color: RETRO.mint, type: 'platform' },
      { x: 1420, y: 310, w: 90,   h: 15,  color: RETRO.mint, type: 'platform' },
      { x: 1490, y: 250, w: 90,   h: 15,  color: RETRO.mint, type: 'platform' },

      // De Kuip — stadium bowl terraces
      { x: 1700, y: 360, w: 200,  h: 15,  color: RETRO.mint, type: 'platform' },
      { x: 1730, y: 300, w: 140,  h: 15,  color: RETRO.mint, type: 'platform' },
      { x: 1760, y: 240, w: 80,   h: 15,  color: RETRO.mint, type: 'platform' },

      // Port section — container dock platforms
      { x: 2050, y: 370, w: 120,  h: 15,  color: RETRO.mint, type: 'platform' },
      { x: 2200, y: 340, w: 100,  h: 15,  color: RETRO.mint, type: 'platform' },
      { x: 2330, y: 300, w: 120,  h: 15,  color: RETRO.mint, type: 'platform' },
      { x: 2480, y: 260, w: 100,  h: 15,  color: RETRO.mint, type: 'platform' },

      // Approach to finish
      { x: 2600, y: 370, w: 150,  h: 15,  color: RETRO.mint, type: 'platform' },
      { x: 2780, y: GROUND_Y, w: 300,  h: 50,  color: RETRO.mint, type: 'ground' },
    ],
    finishFlag: { x: 2980, y: 300, w: 20, h: 100 },
    landmarks: [
      { x: 520,  y: 180, name: 'Erasmusbrug',    fact: 'The Erasmus Bridge (1996) is 802 metres long and is also known as "The Swan".',                                                            factNL: 'De Erasmusbrug (1996) is 802 meter lang en staat ook wel bekend als "De Zwaan".' },
      { x: 800,  y: 130, name: 'Euromast',        fact: 'The Euromast (185m) is the tallest building in Rotterdam, built in 1960.',                                                                factNL: 'De Euromast (185m) is het hoogste gebouw van Rotterdam, gebouwd in 1960.' },
      { x: 1200, y: 200, name: 'Markthal',        fact: 'The Market Hall (2014) contains 228 apartments and the largest artwork in the Netherlands on its ceiling.',                               factNL: 'De Markthal (2014) bevat 228 appartementen en heeft het grootste kunstwerk van Nederland op het plafond.' },
      { x: 1490, y: 210, name: 'Kubuswoningen',   fact: 'The Cube Houses were designed by Piet Blom and are tilted at 45 degrees.',                                                               factNL: 'De Kubuswoningen zijn ontworpen door Piet Blom en staan 45 graden gekanteld.' },
      { x: 1780, y: 200, name: 'De Kuip',         fact: 'De Kuip (Stadion Feijenoord) has a capacity of 51,117 spectators.',                                                                      factNL: 'De Kuip (Stadion Feijenoord) heeft een capaciteit van 51.117 toeschouwers.' },
      { x: 2480, y: 220, name: 'Haven Rotterdam', fact: 'The port of Rotterdam is the largest port in Europe.',                                                                                    factNL: 'De haven van Rotterdam is de grootste haven van Europa.' },
    ],
    // Stars are kept away from ground gaps (gaps at x≈600-650, 1050-1100, 1600-1650, 1950-2000)
    emptyStars: [
      { x: 150,  y: 350 },
      { x: 400,  y: 290 },
      { x: 500,  y: 230 },
      { x: 900,  y: 310 },
      { x: 1250, y: 330 },  // moved from x:1200 y:260 (was just below platform x:1100 y:240 w:120)
      { x: 1450, y: 200 },
      { x: 2050, y: 300 },
      { x: 2100, y: 320 },
      { x: 2340, y: 370 },  // moved from x:2300 y:355 (was at bottom edge of platform x:2200 y:340 w:100)
      { x: 2700, y: 340 },
    ],
  },
  {
    id: 2,
    name: 'Marathon',
    description: 'Run the 42km Rotterdam Marathon',
    unlocked: false,
    width: 3500,
    skyColor: RETRO.cream,
    silhouetteColor: RETRO.olive,
    platforms: [
      // Ground sections — asphalt grey, same 5-gap structure as Level 1
      { x: 0,    y: GROUND_Y, w: 600,  h: 50, color: '#666', type: 'ground' },
      { x: 650,  y: GROUND_Y, w: 400,  h: 50, color: '#666', type: 'ground' },
      { x: 1100, y: GROUND_Y, w: 500,  h: 50, color: '#666', type: 'ground' },
      { x: 1650, y: GROUND_Y, w: 300,  h: 50, color: '#666', type: 'ground' },
      { x: 2000, y: GROUND_Y, w: 800,  h: 50, color: '#666', type: 'ground' },
      { x: 2780, y: GROUND_Y, w: 300,  h: 50, color: '#666', type: 'ground' },

      // Elevated road sections — raised higher for a real jump challenge
      // Section 1: bridge the gap at x 600-650
      { x: 310,  y: 300, w: 120, h: 15, color: '#666', type: 'platform' },
      { x: 460,  y: 290, w: 100, h: 15, color: '#666', type: 'platform' },
      { x: 570,  y: 290, w: 90,  h: 15, color: '#666', type: 'platform' },

      // Section 2: bridge the gap at x 1050-1100
      { x: 700,  y: 300, w: 120, h: 15, color: '#666', type: 'platform' },
      { x: 840,  y: 290, w: 120, h: 15, color: '#666', type: 'platform' },
      { x: 970,  y: 290, w: 100, h: 15, color: '#666', type: 'platform' },

      // Section 3: bridge the gap at x 1600-1650
      { x: 1180, y: 300, w: 130, h: 15, color: '#666', type: 'platform' },
      { x: 1330, y: 290, w: 130, h: 15, color: '#666', type: 'platform' },
      { x: 1480, y: 290, w: 100, h: 15, color: '#666', type: 'platform' },

      // Section 4: bridge the gap at x 1950-2000
      { x: 1700, y: 300, w: 120, h: 15, color: '#666', type: 'platform' },
      { x: 1840, y: 290, w: 120, h: 15, color: '#666', type: 'platform' },

      // Section 5: approach to finish (after x 2780 ground section)
      { x: 2620, y: 300, w: 120, h: 15, color: '#666', type: 'platform' },
    ],
    fences: [
      // One fence on top of the last platform before each gap — player must jump over
      { x: 648,  y: 290 - 30, w: 8, h: 30 }, // top of section 1 last platform (x:570+w:90)
      { x: 1062, y: 290 - 30, w: 8, h: 30 }, // top of section 2 last platform (x:970+w:100)
      { x: 1562, y: 290 - 30, w: 8, h: 30 }, // top of section 3 last platform (x:1480+w:100)
      { x: 1952, y: 290 - 30, w: 8, h: 30 }, // top of section 4 last platform (x:1840+w:120)
      { x: 2732, y: 300 - 30, w: 8, h: 30 }, // top of section 5 last platform (x:2620+w:120)
    ],
    finishFlag: { x: 2980, y: 300, w: 20, h: 100 },
    landmarks: [
      // Medal collectibles — 100 pts + fact popup
      { x: 300,  y: 270, name: 'Marathon', fact: 'The Rotterdam Marathon was first organised in 1981.',                                                                                  factNL: 'De marathon werd voor het eerst georganiseerd in Rotterdam in 1981.' },
      { x: 800,  y: 260, name: 'Marathon', fact: 'The flat and fast course means many runners achieve a personal record here.',                                                          factNL: 'Het parcours is vlak en snel, waardoor veel lopers hier hun persoonlijk record lopen.' },
      { x: 1300, y: 260, name: 'Marathon', fact: 'Rick Slot ran the Rotterdam Marathon in 2:49:29 — not bad!',                                                                          factNL: 'Rick Slot liep de Rotterdam marathon in 2:49:29 (lekker gap!)' },
      { x: 1800, y: 270, name: 'Marathon', fact: 'The race starts at the iconic Erasmus Bridge.',                                                                                       factNL: 'De race begint bij de iconische Erasmusbrug.' },
      { x: 2480, y: 270, name: 'Marathon', fact: 'In terms of size and audience it is one of the biggest sporting events in the country.',                                              factNL: 'Het is qua omvang en publiek één van de grootste sportevents van het land.' },
    ],
    // Water cup collectibles — 25 pts, no popup
    emptyStars: [
      { x: 150,  y: 290 },
      { x: 420,  y: 270 },
      { x: 750,  y: 280 },
      { x: 900,  y: 270 },
      { x: 1200, y: 280 },
      { x: 1430, y: 270 },
      { x: 1750, y: 280 },
      { x: 2100, y: 290 },
    ],
  },
];

// Load per-level high scores from localStorage at startup
for (const level of LEVELS) {
  levelHighScores[level.id] = parseInt(localStorage.getItem(`rotterdam-hs-${level.id}`) || '0');
}

let landmarks = [];

// resetLandmarks reads from currentLevel
function resetLandmarks() {
  const factStars = currentLevel.landmarks.map(l => ({ ...l, collected: false, animAngle: Math.random() * Math.PI * 2, isFact: true }));
  const emptyStars = currentLevel.emptyStars.map(e => ({ ...e, name: null, fact: null, collected: false, animAngle: Math.random() * Math.PI * 2, isFact: false }));
  landmarks = [...factStars, ...emptyStars];
}

// ─── Player ───────────────────────────────────────────────────────────────────
const PLAYER_W = 24;
const PLAYER_H = 36;
const GRAVITY = 900;         // px/s²
const JUMP_VEL = -480;
const WALK_SPEED = 220;

let player;

function resetPlayer(keepLives) {
  const lives = keepLives ? player.lives : 3;
  player = {
    x: 60,
    y: GROUND_Y - PLAYER_H,
    vx: 0,
    vy: 0,
    w: PLAYER_W,
    h: PLAYER_H,
    lives,
    isOnGround: false,
    facingRight: true,
    idleBob: 0,
    idleBobDir: 1,
  };
}

// ─── Camera ───────────────────────────────────────────────────────────────────
let cameraX = 0;

// ─── Popup state ─────────────────────────────────────────────────────────────
let popup = null; // { name, fact, timer }

// ─── Death message state ──────────────────────────────────────────────────────
let deathCause = null;   // 'seagull' | 'golf' | 'fall'
let deathIsGameOver = false;
const DEATH_MESSAGE_KEYS = {
  seagull: 'death_seagull',
  golf:    'death_golf',
  fall:    'death_fall',
  banana:  'death_banana',
  bicycle: 'death_bicycle',
};

// ─── Enemy System ─────────────────────────────────────────────────────────────
// Enemy object: { x, y, w, h, vx, type, alive, patrolMin, patrolMax, points }
let enemies = [];

// Draw VW Golf hatchback sprite within 36×20px bounding box
function drawGolfCar(ex, ey, dir) {
  ctx.save();
  ctx.translate(ex + 18, ey + 18);
  ctx.scale(dir, 1);

  // Body — lower sill in dark grey
  ctx.fillStyle = '#3a3f47';
  ctx.fillRect(-18, 4, 36, 8);

  // Main body panel — VW Golf red
  ctx.fillStyle = PAL.red;
  ctx.fillRect(-18, -2, 36, 8);

  // Roof — tapered hatchback shape (trapezoid via path)
  ctx.fillStyle = PAL.red;
  ctx.beginPath();
  ctx.moveTo(-10, -2);  // front roofline base
  ctx.lineTo(-8,  -10); // front A-pillar top
  ctx.lineTo( 8,  -10); // rear C-pillar top (hatch)
  ctx.lineTo( 13, -2);  // rear roofline base
  ctx.closePath();
  ctx.fill();

  // Windscreen (front) — slightly angled
  ctx.fillStyle = 'rgba(160,210,240,0.75)';
  ctx.beginPath();
  ctx.moveTo(-9,  -2);
  ctx.lineTo(-7,  -9);
  ctx.lineTo( 1,  -9);
  ctx.lineTo( 1,  -2);
  ctx.closePath();
  ctx.fill();

  // Rear hatch glass
  ctx.beginPath();
  ctx.moveTo( 2,  -2);
  ctx.lineTo( 2,  -9);
  ctx.lineTo( 7,  -9);
  ctx.lineTo(12,  -2);
  ctx.closePath();
  ctx.fill();

  // Front bumper / grille
  ctx.fillStyle = '#212529';
  ctx.fillRect(-18, 2, 5, 3);   // grille bar
  ctx.fillStyle = '#ffd700';
  ctx.fillRect(-18, 0, 3, 2);   // headlight

  // Rear light
  ctx.fillStyle = '#e63946';
  ctx.fillRect(15, 0, 3, 2);

  // Door line
  ctx.strokeStyle = '#222';
  ctx.lineWidth = 0.8;
  ctx.beginPath();
  ctx.moveTo(1, -2); ctx.lineTo(1, 4);
  ctx.stroke();

  // Wheels
  ctx.fillStyle = '#1a1a1a';
  ctx.beginPath(); ctx.arc(-10, 10, 6, 0, Math.PI * 2); ctx.fill();
  ctx.beginPath(); ctx.arc( 10, 10, 6, 0, Math.PI * 2); ctx.fill();
  // Tyre tread ring
  ctx.strokeStyle = '#333';
  ctx.lineWidth = 1.5;
  ctx.beginPath(); ctx.arc(-10, 10, 4.5, 0, Math.PI * 2); ctx.stroke();
  ctx.beginPath(); ctx.arc( 10, 10, 4.5, 0, Math.PI * 2); ctx.stroke();
  // Wheel rim
  ctx.fillStyle = '#bbb';
  ctx.beginPath(); ctx.arc(-10, 10, 2.5, 0, Math.PI * 2); ctx.fill();
  ctx.beginPath(); ctx.arc( 10, 10, 2.5, 0, Math.PI * 2); ctx.fill();

  ctx.restore();
}

// Banana enemy sprite — within ~36x28px bounding box (enlarged for clarity)
function drawBanana(ex, ey, dir) {
  ctx.save();
  ctx.translate(ex + 18, ey + 14);
  ctx.scale(dir, 1);

  // Dark brown outline — drawn slightly larger underneath the yellow body
  const outlineRows = [
    [-4, 8,  -13, 4],
    [-7, 14, -10, 4],
    [-9, 18,  -7, 4],
    [-9, 18,  -3, 4],
    [-7, 14,   1, 4],
    [-4, 10,   5, 4],
    [-1,  6,   8, 4],
  ];
  ctx.fillStyle = '#5C2E00';
  for (const [dx, w, dy, h] of outlineRows) {
    ctx.fillRect(dx, dy, w, h);
  }

  // Main banana body — bright yellow, crescent shape
  const rows = [
    [-3, 6,  -12, 3],
    [-6, 12,  -9, 3],
    [-8, 16,  -6, 3],
    [-8, 16,  -3, 3],
    [-6, 12,   0, 3],
    [-3, 8,    3, 3],
    [ 0, 4,    6, 3],
  ];
  ctx.fillStyle = '#FFE135'; // bright banana yellow
  for (const [dx, w, dy, h] of rows) {
    ctx.fillRect(dx, dy, w, h);
  }

  // Brown tips — top and bottom
  ctx.fillStyle = '#5C2E00';
  ctx.fillRect(-3, -14, 6, 3); // top tip
  ctx.fillRect( 1,   8, 4, 3); // bottom tip

  // Inner curve shadow stripe (gives 3D / curved feel)
  ctx.fillStyle = '#D4A000';
  ctx.fillRect(-2, -8, 3, 15);

  // Highlight stripe for extra pop
  ctx.fillStyle = '#FFF176';
  ctx.fillRect(-5, -9, 2, 12);

  ctx.restore();
}

// Bicycle enemy sprite — within ~36x20px bounding box
function drawBicycle(ex, ey, dir) {
  ctx.save();
  ctx.translate(ex + 18, ey + 10);
  ctx.scale(dir, 1);

  const wheelY = 6; // wheel centre Y relative to translate origin
  const rearX  = -11;
  const frontX =  11;

  // Wheels
  ctx.strokeStyle = '#222';
  ctx.lineWidth = 2;
  ctx.beginPath(); ctx.arc(rearX,  wheelY, 7, 0, Math.PI * 2); ctx.stroke();
  ctx.beginPath(); ctx.arc(frontX, wheelY, 7, 0, Math.PI * 2); ctx.stroke();
  // Wheel hubs
  ctx.fillStyle = '#555';
  ctx.beginPath(); ctx.arc(rearX,  wheelY, 2, 0, Math.PI * 2); ctx.fill();
  ctx.beginPath(); ctx.arc(frontX, wheelY, 2, 0, Math.PI * 2); ctx.fill();

  // Frame — triangle: rear-axle → seat post → front-fork
  const seatX = -2, seatY = -5;
  ctx.strokeStyle = '#444';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(rearX,  wheelY);  // rear axle
  ctx.lineTo(seatX,  seatY);   // seat tube top
  ctx.lineTo(frontX, wheelY);  // front axle
  ctx.stroke();
  // Seat stay (rear axle → seat)
  ctx.beginPath();
  ctx.moveTo(rearX, wheelY);
  ctx.lineTo(seatX, seatY);
  ctx.stroke();
  // Top tube (seat → handlebar)
  const handleX = 8, handleY = -4;
  ctx.beginPath();
  ctx.moveTo(seatX, seatY);
  ctx.lineTo(handleX, handleY);
  ctx.stroke();
  // Front fork
  ctx.beginPath();
  ctx.moveTo(handleX, handleY);
  ctx.lineTo(frontX, wheelY);
  ctx.stroke();

  // Handlebar — small horizontal nub
  ctx.strokeStyle = '#333';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(handleX - 2, handleY - 3);
  ctx.lineTo(handleX + 3, handleY - 3);
  ctx.stroke();

  // Seat — short horizontal bar
  ctx.beginPath();
  ctx.moveTo(seatX - 3, seatY - 1);
  ctx.lineTo(seatX + 3, seatY - 1);
  ctx.stroke();

  ctx.restore();
}

// Seagull enemy sprite — within ~24×18px bounding box
function drawSeagull(ex, ey, dir) {
  ctx.save();
  ctx.translate(ex + 12, ey + 9);
  ctx.scale(dir, 1);

  // Body — white oval
  ctx.fillStyle = PAL.white;
  ctx.beginPath();
  ctx.ellipse(0, 2, 8, 5, 0, 0, Math.PI * 2);
  ctx.fill();

  // Head — white circle
  ctx.beginPath();
  ctx.arc(8, -2, 4, 0, Math.PI * 2);
  ctx.fill();

  // Eye
  ctx.fillStyle = '#212529';
  ctx.beginPath();
  ctx.arc(10, -3, 1, 0, Math.PI * 2);
  ctx.fill();

  // Beak — orange-yellow
  ctx.fillStyle = '#f4a261';
  ctx.beginPath();
  ctx.moveTo(12, -2);
  ctx.lineTo(17, -1);
  ctx.lineTo(12,  0);
  ctx.closePath();
  ctx.fill();
  // Beak spot (red dot — classic herring gull)
  ctx.fillStyle = PAL.red;
  ctx.fillRect(14, -1, 2, 1);

  // Wings — dark grey, swept up (M shape)
  ctx.strokeStyle = '#555';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(-8, -1);   // left wing tip
  ctx.lineTo(-2, -6);   // left inner
  ctx.lineTo( 0, -4);   // body join
  ctx.lineTo( 2, -6);   // right inner
  ctx.lineTo( 8, -1);   // right wing tip
  ctx.stroke();

  // Tail feathers
  ctx.fillStyle = '#ddd';
  ctx.beginPath();
  ctx.moveTo(-8, 3);
  ctx.lineTo(-14, 2);
  ctx.lineTo(-14, 5);
  ctx.lineTo(-8, 5);
  ctx.closePath();
  ctx.fill();

  // Legs — thin orange lines
  ctx.strokeStyle = '#f4a261';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(-1, 7); ctx.lineTo(-1, 13);
  ctx.moveTo( 3, 7); ctx.lineTo( 3, 13);
  ctx.stroke();
  // Feet
  ctx.beginPath();
  ctx.moveTo(-3, 13); ctx.lineTo(1, 13);
  ctx.moveTo( 1, 13); ctx.lineTo(5, 13);
  ctx.stroke();

  ctx.restore();
}

// Spawn data + resetEnemies — level-aware
function resetEnemies() {
  if (currentLevel.id === 2) {
    // Level 2: bananas (mirror seagull positions) + bicycles (mirror car positions)
    const bananas = [
      { x: 200,  y: GROUND_Y - 28, w: 36, h: 28, vx: 60,  type: 'banana',  alive: true, patrolMin: 100,  patrolMax: 250,  points: 30, deathMsg: 'banana' },
      { x: 700,  y: GROUND_Y - 28, w: 36, h: 28, vx: 60,  type: 'banana',  alive: true, patrolMin: 650,  patrolMax: 1010, points: 30, deathMsg: 'banana' },
      { x: 1700, y: GROUND_Y - 28, w: 36, h: 28, vx: 60,  type: 'banana',  alive: true, patrolMin: 1650, patrolMax: 1900, points: 30, deathMsg: 'banana' },
      { x: 2500, y: GROUND_Y - 28, w: 36, h: 28, vx: 60,  type: 'banana',  alive: true, patrolMin: 2400, patrolMax: 2750, points: 30, deathMsg: 'banana' },
    ];
    const bicycles = [
      { x: 300,  y: GROUND_Y - 20, w: 36, h: 20, vx: 300, type: 'bicycle', alive: true, patrolMin: 200,  patrolMax: 580,  points: 50, deathMsg: 'bicycle' },
      { x: 1200, y: GROUND_Y - 20, w: 36, h: 20, vx: 300, type: 'bicycle', alive: true, patrolMin: 1100, patrolMax: 1570, points: 50, deathMsg: 'bicycle' },
      { x: 2100, y: GROUND_Y - 20, w: 36, h: 20, vx: 300, type: 'bicycle', alive: true, patrolMin: 2000, patrolMax: 2770, points: 50, deathMsg: 'bicycle' },
    ];
    enemies = [...bananas, ...bicycles];
  } else {
    // Level 1: seagulls + VW Golf cars (original behaviour)
    const golfCars = [
      { x: 300,  y: GROUND_Y - 20, w: 36, h: 20, vx: 300, type: 'golf', alive: true, patrolMin: 200,  patrolMax: 580,  points: 50 },
      { x: 1200, y: GROUND_Y - 20, w: 36, h: 20, vx: 300, type: 'golf', alive: true, patrolMin: 1100, patrolMax: 1570, points: 50 },
      { x: 2100, y: GROUND_Y - 20, w: 36, h: 20, vx: 300, type: 'golf', alive: true, patrolMin: 2000, patrolMax: 2770, points: 50 },
    ];
    const seagulls = [
      { x: 200,  y: GROUND_Y - 18, w: 24, h: 18, vx: 60,  type: 'seagull', alive: true, patrolMin: 100,  patrolMax: 250,  points: 30 },
      { x: 700,  y: GROUND_Y - 18, w: 24, h: 18, vx: 60,  type: 'seagull', alive: true, patrolMin: 650,  patrolMax: 1010, points: 30 },
      { x: 1700, y: GROUND_Y - 18, w: 24, h: 18, vx: 60,  type: 'seagull', alive: true, patrolMin: 1650, patrolMax: 1900, points: 30 },
      { x: 2500, y: GROUND_Y - 18, w: 24, h: 18, vx: 60,  type: 'seagull', alive: true, patrolMin: 2400, patrolMax: 2750, points: 30 },
    ];
    enemies = [...golfCars, ...seagulls];
  }
}

// ─── Game Init ────────────────────────────────────────────────────────────────
function startGame(levelId) {
  currentLevel = LEVELS.find(l => l.id === levelId);
  score = 0;
  resetPlayer();
  resetLandmarks();
  resetEnemies();
  cameraX = 0;
  popup = null;
  deathCause = null;
  deathIsGameOver = false;
  gameState = 'playing';
}

// ─── AABB Collision ───────────────────────────────────────────────────────────
function rectsOverlap(ax, ay, aw, ah, bx, by, bw, bh) {
  return ax < bx + bw && ax + aw > bx && ay < by + bh && ay + ah > by;
}

// Returns overlap depth on each axis
function aabbCollide(player, plat) {
  const px = player.x, py = player.y, pw = player.w, ph = player.h;
  const qx = plat.x, qy = plat.y, qw = plat.w, qh = plat.h;
  if (!rectsOverlap(px, py, pw, ph, qx, qy, qw, qh)) return null;
  const overlapLeft  = (px + pw) - qx;
  const overlapRight = (qx + qw) - px;
  const overlapTop   = (py + ph) - qy;
  const overlapBot   = (qy + qh) - py;
  return { overlapLeft, overlapRight, overlapTop, overlapBot };
}

// ─── Update ───────────────────────────────────────────────────────────────────
function update(dt) {
  if (gameState === 'death_message') {
    return;
  }
  if (gameState !== 'playing') return;

  // Horizontal movement
  if (keys['ArrowLeft']) {
    player.vx = -WALK_SPEED;
    player.facingRight = false;
  } else if (keys['ArrowRight']) {
    player.vx = WALK_SPEED;
    player.facingRight = true;
  } else {
    player.vx = 0;
  }

  // Jump
  if ((keys['Space'] || keys['ArrowUp']) && player.isOnGround) {
    player.vy = JUMP_VEL;
    player.isOnGround = false;
    playJumpSound();
  }

  // Gravity
  player.vy += GRAVITY * dt;

  // Move player
  player.x += player.vx * dt;
  player.y += player.vy * dt;

  // Prevent going left of level start
  if (player.x < 0) { player.x = 0; player.vx = 0; }

  // Platform collision
  player.isOnGround = false;
  for (const plat of currentLevel.platforms) {
    const col = aabbCollide(player, plat);
    if (!col) continue;

    const minOverlap = Math.min(col.overlapLeft, col.overlapRight, col.overlapTop, col.overlapBot);

    if (minOverlap === col.overlapTop && player.vy >= 0) {
      // Landing on top
      player.y = plat.y - player.h;
      player.vy = 0;
      player.isOnGround = true;
    } else if (minOverlap === col.overlapBot && player.vy < 0) {
      // Hitting underside
      player.y = plat.y + plat.h;
      player.vy = 0;
    } else if (minOverlap === col.overlapLeft) {
      player.x = plat.x - player.w;
      player.vx = 0;
    } else if (minOverlap === col.overlapRight) {
      player.x = plat.x + plat.w;
      player.vx = 0;
    }
  }

  // Fence collision
  updateFences();

  // Fall below canvas
  if (player.y > CANVAS_H + 50) {
    player.lives--;
    deathCause = 'fall';
    if (player.lives <= 0) {
      playGameOverSound();
      saveHighScore();
      deathIsGameOver = true;
    } else {
      deathIsGameOver = false;
      resetPlayer(true);
      cameraX = 0;
    }
    gameState = 'death_message';
    return;
  }

  // Camera scroll
  const targetCam = player.x - CANVAS_W / 2 + player.w / 2;
  cameraX = Math.max(0, Math.min(targetCam, currentLevel.width - CANVAS_W));

  // Enemy update loop
  for (const en of enemies) {
    if (!en.alive) continue;
    en.x += en.vx * dt;
    if (en.x < en.patrolMin) { en.x = en.patrolMin; en.vx = Math.abs(en.vx); }
    if (en.x + en.w > en.patrolMax) { en.x = en.patrolMax - en.w; en.vx = -Math.abs(en.vx); }
  }

  // Enemy-player collision
  for (const en of enemies) {
    if (!en.alive) continue;
    if (!rectsOverlap(player.x, player.y, player.w, player.h, en.x, en.y, en.w, en.h)) continue;

    const playerBottom = player.y + player.h;
    const overlapFromTop = playerBottom - en.y;

    if (player.vy > 0 && overlapFromTop <= 12) {
      // Stomp kill — award points based on enemy type
      en.alive = false;
      score += en.points;
      player.vy = -300; // bounce player up
    } else {
      // Side or bottom hit — lose a life
      player.lives--;
      deathCause = en.type;
      if (player.lives <= 0) {
        playGameOverSound();
        saveHighScore();
        deathIsGameOver = true;
      } else {
        deathIsGameOver = false;
        resetPlayer(true);
        cameraX = 0;
      }
      gameState = 'death_message';
      return;
    }
  }

  // Landmark collision
  for (const lm of landmarks) {
    if (lm.collected) continue;
    if (rectsOverlap(player.x, player.y, player.w, player.h, lm.x - 15, lm.y - 15, 30, 30)) {
      lm.collected = true;
      playCollectSound();
      if (lm.isFact) {
        score += 100; // fact star: 100 pts + popup
        popup = { name: lm.name, fact: currentLang === 'NL' ? lm.factNL : lm.fact, timer: 4 };
      } else {
        score += 25; // empty star: 25 pts, no popup
      }
    }
    lm.animAngle += dt * 3;
  }

  // Finish flag collision
  const ff = currentLevel.finishFlag;
  if (rectsOverlap(player.x, player.y, player.w, player.h, ff.x, ff.y, ff.w, ff.h)) {
    score += 500; // level complete bonus
    saveHighScore();
    // Unlock next level
    const nextLevel = LEVELS.find(l => l.id === currentLevel.id + 1);
    if (nextLevel && !nextLevel.unlocked) {
      nextLevel.unlocked = true;
    }
    gameState = 'win';
    return;
  }

  // Popup timer
  if (popup) {
    popup.timer -= dt;
    if (popup.timer <= 0) popup = null;
  }

  // Idle bob
  player.idleBob += player.idleBobDir * dt * 80;
  if (Math.abs(player.idleBob) > 2) player.idleBobDir *= -1;
}

// ─── Save High Score ──────────────────────────────────────────────────────────
function saveHighScore() {
  const id = currentLevel.id;
  if (score > (levelHighScores[id] || 0)) {
    levelHighScores[id] = score;
    localStorage.setItem(`rotterdam-hs-${id}`, String(score));
  }
}

// ─── Draw Helpers ─────────────────────────────────────────────────────────────
function drawRect(x, y, w, h, color) {
  ctx.fillStyle = color;
  ctx.fillRect(x, y, w, h);
}

function drawText(text, x, y, font, color, align) {
  ctx.font = font;
  ctx.fillStyle = color;
  ctx.textAlign = align || 'left';
  ctx.fillText(text, x, y);
}

// ─── Draw Background ──────────────────────────────────────────────────────────
function drawBackground() {
  // Sky — flat colour from currentLevel, covers the full canvas including below ground
  // Gaps in ground platforms show this colour (no separate water strip)
  ctx.fillStyle = currentLevel.skyColor;
  ctx.fillRect(0, 0, CANVAS_W, CANVAS_H);

  // Pixelated Rotterdam skyline silhouette — parallax at 0.25x camera speed
  const px = Math.floor(cameraX * 0.25); // integer pixel offset for pixelated feel
  const SIL = currentLevel.silhouetteColor;
  const groundLine = GROUND_Y; // silhouettes sit on this baseline

  ctx.fillStyle = SIL;

  // Helper: draw a pixel-snapped rect in world-parallax space
  function bgRect(wx, wy, w, h) {
    const sx = Math.floor(wx - px);
    if (sx + w < 0 || sx > CANVAS_W) return;
    ctx.fillRect(sx, wy, w, h);
  }

  // ── Erasmus Bridge (left side of panorama) ───────────────────────────────
  // Bridge deck — long horizontal slab
  bgRect(-40, groundLine - 8, 700, 8);

  // A-frame pylon — pixel art version
  const pylBase = 340;  // world x of pylon base
  const pylPeak = 40;   // screen y of peak
  const deckScreenY = groundLine - 8;
  // We draw the pylon as a series of stacked horizontal rectangles tapering upward
  for (let row = 0; row < 12; row++) {
    const t = row / 12;
    const y = deckScreenY - row * 22;
    const spread = Math.round(48 * (1 - t)); // legs spread wide at bottom
    const thickness = 6;
    bgRect(pylBase - spread - thickness, y, thickness, 22); // left leg
    bgRect(pylBase + spread,             y, thickness, 22); // right leg
  }
  // Pylon cap (top block)
  bgRect(pylBase - 4, pylPeak, 8, 22);

  // Stay cables — drawn as thin pixel lines fanning from peak to deck
  ctx.fillStyle = SIL;
  const cableAnchors = [-260, -200, -150, -100, -60, -20, 20, 60, 100, 150, 200, 260];
  for (const offset of cableAnchors) {
    const anchorWX = pylBase + offset;
    const anchorSX = Math.floor(anchorWX - px);
    if (anchorSX < -10 || anchorSX > CANVAS_W + 10) continue;
    const peakSX = Math.floor(pylBase - px);
    const peakSY = pylPeak + 4;
    const anchorSY = deckScreenY;
    // Draw cable as a 1-pixel wide line using fillRect pixel-by-pixel (pixelated)
    const dx = anchorSX - peakSX;
    const dy = anchorSY - peakSY;
    const steps = Math.max(Math.abs(dx), Math.abs(dy));
    for (let i = 0; i < steps; i += 2) {
      const t = i / steps;
      const cx2 = Math.floor(peakSX + dx * t);
      const cy2 = Math.floor(peakSY + dy * t);
      ctx.fillRect(cx2, cy2, 1, 1);
    }
  }

  ctx.fillStyle = SIL;

  // ── City skyline — dense block buildings (right of bridge) ──────────────
  const buildings = [
    // [worldX, height, width] — pixel-snapped, blocky shapes
    // De Rotterdam (tall twin towers)
    [650,  180, 24], [676, 160, 24],
    // Smaller mid-rise cluster
    [710,  100, 16], [728, 120, 20], [750, 90, 14],
    // Tall block
    [770,  200, 28],
    // Mid cluster
    [800,  110, 18], [820, 140, 22], [844, 80, 12],
    // Pencil tower
    [860,  220, 16],
    // Low-rises
    [878,  70,  20], [900, 90, 16], [918, 60, 12],
    // Another tall pair
    [934,  170, 22], [958, 150, 18],
    // Dense right cluster
    [980,  100, 14], [996, 130, 18], [1016, 80, 12],
    [1030, 110, 16], [1048, 90, 14], [1064, 120, 20],
    [1086, 160, 22], [1110, 80,  14], [1126, 100, 16],
    // Far right — cranes / port silhouette
    [1160, 60,  10], [1172, 120, 8], [1182, 60, 10],
    [1210, 60,  10], [1222, 130, 8], [1232, 60, 10],
    [1260, 60,  10], [1272, 110, 8], [1282, 60, 10],
  ];

  for (const [wx, bh, bw] of buildings) {
    bgRect(wx, groundLine - bh, bw, bh);
    // Windows — darker orange shade for detail
    const winColor = '#b82200';
    ctx.fillStyle = winColor;
    for (let wy = groundLine - bh + 8; wy < groundLine - 8; wy += 10) {
      const sx = Math.floor(wx - px);
      if (sx + bw < 0 || sx > CANVAS_W) continue;
      for (let wx2 = sx + 4; wx2 < sx + bw - 4; wx2 += 6) {
        ctx.fillRect(wx2, wy, 3, 5);
      }
    }
    ctx.fillStyle = SIL;
  }

  // Ground baseline strip (quay / embankment)
  bgRect(-100, groundLine - 14, 1400, 6);
  bgRect(-100, groundLine - 20, 1400, 4); // second stripe for pixel depth
}

// ─── Draw Bridge ──────────────────────────────────────────────────────────────
// Erasmus Bridge drawn in background layer, before platforms
function drawBridge() {
  // Bridge deck visible x range relative to camera
  const deckStartX = 0 - cameraX;
  const deckEndX = 900 - cameraX;
  if (deckEndX < 0 || deckStartX > CANVAS_W) return;

  // A-frame pylon at x≈400
  const pylonX = 400 - cameraX;
  const pylonPeakY = 80;
  const legSpread = 60;
  const deckY = GROUND_Y;

  ctx.fillStyle = RETRO.mint;
  ctx.beginPath();
  ctx.moveTo(pylonX, pylonPeakY);
  ctx.lineTo(pylonX - legSpread, deckY);
  ctx.lineTo(pylonX - legSpread - 12, deckY);
  ctx.lineTo(pylonX - 8, pylonPeakY);
  ctx.closePath();
  ctx.fill();

  ctx.beginPath();
  ctx.moveTo(pylonX, pylonPeakY);
  ctx.lineTo(pylonX + legSpread, deckY);
  ctx.lineTo(pylonX + legSpread + 12, deckY);
  ctx.lineTo(pylonX + 8, pylonPeakY);
  ctx.closePath();
  ctx.fill();

  // Stay cables from pylon peak to deck anchors
  ctx.strokeStyle = RETRO.mint;
  ctx.lineWidth = 1.5;
  const cableAnchors = [-200, -140, -80, -30, 30, 80, 140, 200];
  for (const offset of cableAnchors) {
    const anchorX = pylonX + offset;
    if (anchorX < -20 || anchorX > CANVAS_W + 20) continue;
    ctx.beginPath();
    ctx.moveTo(pylonX, pylonPeakY);
    ctx.lineTo(anchorX, deckY);
    ctx.stroke();
  }
  ctx.lineWidth = 1;
}

// ─── Draw Platforms ───────────────────────────────────────────────────────────
function drawPlatforms() {
  for (const plat of currentLevel.platforms) {
    const sx = plat.x - cameraX;
    if (sx + plat.w < 0 || sx > CANVAS_W) continue;
    drawRect(sx, plat.y, plat.w, plat.h, plat.color);
    // Dark edge
    drawRect(sx, plat.y, plat.w, 3, 'rgba(0,0,0,0.3)');
    // Lane markings on Level 2 elevated road sections
    if (currentLevel.id === 2 && plat.type === 'platform') {
      ctx.fillStyle = '#ffffff';
      const dashW = 4, dashH = 2, dashSpacing = 20;
      const markY = plat.y + 5; // a few pixels below the top edge
      for (let dx = 10; dx < plat.w - 10; dx += dashSpacing) {
        ctx.fillRect(sx + dx, markY, dashW, dashH);
      }
    }
  }
}


// ─── Draw Fences ──────────────────────────────────────────────────────────────
function drawFences() {
  if (!currentLevel.fences || currentLevel.fences.length === 0) return;
  for (const fence of currentLevel.fences) {
    const sx = fence.x - cameraX;
    if (sx + fence.w < 0 || sx > CANVAS_W) continue;
    // Main fence body — brown wood
    ctx.fillStyle = '#8B4513';
    ctx.fillRect(sx, fence.y, fence.w, fence.h);
    // Dark left edge for depth
    ctx.fillStyle = '#5C2E00';
    ctx.fillRect(sx, fence.y, 2, fence.h);
    // Light right edge highlight
    ctx.fillStyle = '#A0522D';
    ctx.fillRect(sx + fence.w - 2, fence.y, 2, fence.h);
    // Horizontal planks
    ctx.fillStyle = '#5C2E00';
    ctx.fillRect(sx, fence.y + Math.floor(fence.h * 0.33), fence.w, 2);
    ctx.fillRect(sx, fence.y + Math.floor(fence.h * 0.66), fence.w, 2);
  }
}

// ─── Update Fences (collision — bounce back, no life loss) ────────────────────
function updateFences() {
  if (!currentLevel.fences || currentLevel.fences.length === 0) return;
  for (const fence of currentLevel.fences) {
    if (!rectsOverlap(player.x, player.y, player.w, player.h, fence.x, fence.y, fence.w, fence.h)) continue;
    // Only collide if player bottom is below fence top (i.e. not jumping cleanly over)
    const playerBottom = player.y + player.h;
    if (playerBottom <= fence.y) continue;
    // Determine horizontal overlap direction and push back
    const overlapFromLeft  = (player.x + player.w) - fence.x;
    const overlapFromRight = (fence.x + fence.w) - player.x;
    if (overlapFromLeft < overlapFromRight) {
      // Player came from left — push back left
      player.x = fence.x - player.w;
    } else {
      // Player came from right — push back right
      player.x = fence.x + fence.w;
    }
    player.vx = 0;
  }
}

// ─── Draw Finish Flag ─────────────────────────────────────────────────────────
function drawFinishFlag(time) {
  const ff = currentLevel.finishFlag;
  const sx = ff.x - cameraX;
  if (sx < -80 || sx > CANVAS_W + 80) return;

  const poleX = Math.floor(sx);
  const poleTopY = ff.y;
  const poleH = ff.h;

  // Pole — thin dark post
  drawRect(poleX, poleTopY, 4, poleH, '#222222');

  // Checkered flag — 8×5 grid of 8×8px squares
  const flagW = 64;
  const flagH = 40;
  const cols = 8;
  const rows = 5;
  const cellW = flagW / cols; // 8px
  const cellH = flagH / rows; // 8px
  const flagX = poleX + 4;
  const flagY = poleTopY;

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const isBlack = (r + c) % 2 === 0;
      ctx.fillStyle = isBlack ? '#000000' : '#ffffff';
      ctx.fillRect(Math.floor(flagX + c * cellW), Math.floor(flagY + r * cellH), Math.ceil(cellW), Math.ceil(cellH));
    }
  }
  // Thin border around flag
  ctx.strokeStyle = '#000000';
  ctx.lineWidth = 1;
  ctx.strokeRect(flagX + 0.5, flagY + 0.5, flagW - 1, flagH - 1);
}

// ─── Medal and Water Cup Draw Helpers (Level 2 collectibles) ─────────────────
function drawMedal(cx, cy) {
  // Gold circle
  ctx.fillStyle = '#FFD700';
  ctx.beginPath();
  ctx.arc(cx, cy, 8, 0, Math.PI * 2);
  ctx.fill();
  // Dark outline
  ctx.strokeStyle = '#B8860B';
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.arc(cx, cy, 8, 0, Math.PI * 2);
  ctx.stroke();
  // Inner highlight ring
  ctx.strokeStyle = '#FFEC6E';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.arc(cx, cy, 5, 0, Math.PI * 2);
  ctx.stroke();
  // Star detail inside medal
  ctx.fillStyle = '#B8860B';
  ctx.beginPath();
  for (let i = 0; i < 10; i++) {
    const r = i % 2 === 0 ? 4 : 2;
    const a = (i * Math.PI) / 5 - Math.PI / 2;
    const mx = cx + Math.cos(a) * r;
    const my = cy + Math.sin(a) * r;
    if (i === 0) ctx.moveTo(mx, my);
    else ctx.lineTo(mx, my);
  }
  ctx.closePath();
  ctx.fill();
  // Ribbon below medal
  ctx.fillStyle = '#CC0000';
  ctx.fillRect(cx - 4, cy + 9, 8, 10);
  // Ribbon knot
  ctx.fillStyle = '#AA0000';
  ctx.fillRect(cx - 2, cy + 9, 4, 3);
}

function drawWaterCup(cx, cy) {
  // Trapezoid cup — wider at top, narrower at bottom
  ctx.fillStyle = '#f1faee'; // white cup body
  ctx.beginPath();
  ctx.moveTo(cx - 6, cy - 7); // top-left
  ctx.lineTo(cx + 6, cy - 7); // top-right
  ctx.lineTo(cx + 4, cy + 7); // bottom-right
  ctx.lineTo(cx - 4, cy + 7); // bottom-left
  ctx.closePath();
  ctx.fill();
  // Blue stripe near top
  ctx.fillStyle = '#457b9d';
  ctx.beginPath();
  ctx.moveTo(cx - 6,   cy - 7); // top-left
  ctx.lineTo(cx + 6,   cy - 7); // top-right
  ctx.lineTo(cx + 5.5, cy - 4); // stripe bottom-right
  ctx.lineTo(cx - 5.5, cy - 4); // stripe bottom-left
  ctx.closePath();
  ctx.fill();
  // Thin dark outline
  ctx.strokeStyle = '#aaa';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(cx - 6, cy - 7);
  ctx.lineTo(cx + 6, cy - 7);
  ctx.lineTo(cx + 4, cy + 7);
  ctx.lineTo(cx - 4, cy + 7);
  ctx.closePath();
  ctx.stroke();
}

// ─── Draw Landmarks ───────────────────────────────────────────────────────────
function drawStar(cx, cy, angle) {
  const outerR = 14;
  const innerR = 6;
  const points = 5;
  ctx.beginPath();
  for (let i = 0; i < points * 2; i++) {
    const r = i % 2 === 0 ? outerR : innerR;
    const a = angle + (i * Math.PI) / points - Math.PI / 2;
    const x = cx + Math.cos(a) * r;
    const y = cy + Math.sin(a) * r;
    if (i === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  }
  ctx.closePath();
  ctx.fill();
}

function drawLandmarks() {
  for (const lm of landmarks) {
    if (lm.collected) continue;
    const sx = lm.x - cameraX;
    if (sx < -40 || sx > CANVAS_W + 40) continue;
    ctx.save();
    if (lm.isFact) {
      if (currentLevel.id === 2) {
        // Level 2: draw medal for fact collectibles
        drawMedal(sx, lm.y);
      } else {
        // Level 1: draw spinning gold star
        ctx.fillStyle = RETRO.gold;
        drawStar(sx, lm.y, lm.animAngle);
      }
    } else {
      if (currentLevel.id === 2) {
        // Level 2: draw water cup for bonus collectibles
        drawWaterCup(sx, lm.y);
      } else {
        // Level 1: draw spinning gold star
        ctx.fillStyle = RETRO.gold;
        drawStar(sx, lm.y, lm.animAngle);
      }
    }
    ctx.restore();
  }
}

// ─── Draw Enemies ─────────────────────────────────────────────────────────────
function drawEnemies() {
  for (const en of enemies) {
    if (!en.alive) continue;
    const sx = en.x - cameraX;
    if (sx + en.w < 0 || sx > CANVAS_W) continue;
    const dir = en.vx >= 0 ? 1 : -1;
    if (en.type === 'golf') {
      drawGolfCar(sx, en.y, dir);
    } else if (en.type === 'seagull') {
      drawSeagull(sx, en.y, dir);
    } else if (en.type === 'banana') {
      drawBanana(sx, en.y, dir);
    } else if (en.type === 'bicycle') {
      drawBicycle(sx, en.y, dir);
    }
  }
}

// ─── Draw Player ─────────────────────────────────────────────────────────────
function drawPlayer() {
  const sx = player.x - cameraX;
  const sy = player.y + (player.isOnGround ? player.idleBob : 0);
  const dir = player.facingRight ? 1 : -1;

  ctx.save();
  ctx.translate(sx + player.w / 2, sy);
  ctx.scale(dir, 1);

  // Head
  drawRect(-7, -4, 14, 14, '#f4a261');

  // Eyes
  ctx.fillStyle = '#fff';
  ctx.fillRect(1, -2, 4, 4);
  ctx.fillStyle = '#000';
  ctx.fillRect(2, -1, 2, 2);

  // Shirt — Feyenoord split: left half red, right half white; sleeves opposite
  drawRect(-8, 10, 8, 16, PAL.red);   // left torso half
  drawRect( 0, 10, 8, 16, PAL.white); // right torso half
  // Left sleeve (white) — sticks out left side
  drawRect(-11, 10, 4, 8, PAL.white);
  // Right sleeve (red) — sticks out right side
  drawRect(  7, 10, 4, 8, PAL.red);

  // Shorts — black below shirt
  drawRect(-8, 26, 16, 8, '#212529');

  // Socks — white with red top trim band
  drawRect(-8, 34, 6, 8, PAL.white);
  drawRect(-8, 34, 6, 3, PAL.red); // red trim band
  const legOff = (player.vx !== 0 && player.isOnGround) ? Math.sin(Date.now() * 0.01) * 4 : 0;
  drawRect(2, 34 + legOff, 6, 8, PAL.white);
  drawRect(2, 34 + legOff, 6, 3, PAL.red); // red trim band

  // Boots — black, sit below socks
  drawRect(-10, 42, 8, 5, '#212529');
  drawRect(1,   42 + legOff, 8, 5, '#212529');

  ctx.restore();
}

// ─── Draw HUD ─────────────────────────────────────────────────────────────────
function drawHUD() {
  // Score — center-top
  drawText(`${t('score_label')}: ${score}`, CANVAS_W / 2, 22, 'bold 18px monospace', '#fff', 'center');
  // Per-level best score — right side
  const best = levelHighScores[currentLevel.id] || 0;
  drawText(`${t('best_label')}: ${best}`, CANVAS_W - 10, 22, 'bold 16px monospace', '#ffd700', 'right');
  // Lives (pixel hearts)
  for (let i = 0; i < player.lives; i++) {
    drawHeart(20 + i * 28, 14, PAL.red);
  }
}

function drawHeart(x, y, color) {
  ctx.fillStyle = color;
  ctx.fillRect(x - 6, y - 2, 4, 4);
  ctx.fillRect(x + 2, y - 2, 4, 4);
  ctx.fillRect(x - 8, y, 16, 4);
  ctx.fillRect(x - 6, y + 4, 12, 4);
  ctx.fillRect(x - 4, y + 8, 8, 4);
  ctx.fillRect(x - 2, y + 12, 4, 2);
}

// ─── Draw Fact Overlay ────────────────────────────────────────────────────────
function drawFactOverlay() {
  if (!popup) return;
  const totalTime = 4;
  const elapsed = totalTime - popup.timer;

  // Alpha fade-in (0–0.3s) and fade-out (last 1s)
  let alpha;
  if (elapsed < 0.3) {
    alpha = elapsed / 0.3;
  } else if (popup.timer < 1) {
    alpha = popup.timer / 1;
  } else {
    alpha = 1;
  }
  alpha = Math.max(0, Math.min(1, alpha));

  const ox = 8, oy = 40, ow = 260;

  ctx.save();
  ctx.globalAlpha = alpha;

  // Semi-transparent dark background
  ctx.fillStyle = 'rgba(10, 20, 40, 0.82)';
  ctx.beginPath();
  ctx.roundRect(ox, oy, ow, 90, 6);
  ctx.fill();

  // Landmark name in bold small font
  ctx.globalAlpha = alpha;
  ctx.font = 'bold 12px monospace';
  ctx.fillStyle = '#ffd700';
  ctx.textAlign = 'left';
  ctx.fillText(popup.name, ox + 10, oy + 18);

  // Fact text word-wrapped within 260px panel
  ctx.font = '11px monospace';
  ctx.fillStyle = PAL.white;
  wrapText(popup.fact, ox + 10, oy + 35, ow - 20, 14);

  ctx.restore();
}

function wrapText(text, x, y, maxWidth, lineHeight) {
  const words = text.split(' ');
  let line = '';
  for (const word of words) {
    const testLine = line + word + ' ';
    const metrics = ctx.measureText(testLine);
    if (metrics.width > maxWidth && line !== '') {
      ctx.fillText(line, x, y);
      line = word + ' ';
      y += lineHeight;
    } else {
      line = testLine;
    }
  }
  ctx.fillText(line, x, y);
}

// ─── Draw Level Select Screen ─────────────────────────────────────────────────
function drawLevelSelectScreen() {
  // Background — RETRO palette
  ctx.fillStyle = RETRO.olive;
  ctx.fillRect(0, 0, CANVAS_W, CANVAS_H);

  // Title
  drawText(t('select_level'), CANVAS_W / 2, 80, 'bold 40px monospace', RETRO.orange, 'center');

  // Level cards — show ALL levels, locked ones dimmed
  const cardW = 200;
  const cardH = 120;
  const cardSpacing = 40;
  const totalW = LEVELS.length * cardW + (LEVELS.length - 1) * cardSpacing;
  const startX = (CANVAS_W - totalW) / 2;
  const cardY = CANVAS_H / 2 - cardH / 2;

  for (let i = 0; i < LEVELS.length; i++) {
    const level = LEVELS[i];
    const cx = startX + i * (cardW + cardSpacing);
    const isSelected = i === selectedLevelIndex;
    const isLocked = !level.unlocked;

    // Card background
    if (isLocked) {
      ctx.fillStyle = 'rgba(0,0,0,0.6)';
      ctx.strokeStyle = '#555';
    } else {
      ctx.fillStyle = isSelected ? 'rgba(251,46,1,0.25)' : 'rgba(0,0,0,0.45)';
      ctx.strokeStyle = isSelected ? RETRO.orange : RETRO.mint;
    }
    ctx.lineWidth = isSelected ? 3 : 1;
    ctx.beginPath();
    ctx.roundRect(cx, cardY, cardW, cardH, 8);
    ctx.fill();
    ctx.stroke();

    if (isLocked) {
      // Dim overlay
      ctx.fillStyle = 'rgba(0,0,0,0.4)';
      ctx.beginPath();
      ctx.roundRect(cx, cardY, cardW, cardH, 8);
      ctx.fill();

      // Level name (greyed)
      drawText(t(`level${level.id}_name`), cx + cardW / 2, cardY + 36, 'bold 16px monospace', '#666', 'center');

      // Lock icon (pixel art padlock)
      const lx = cx + cardW / 2, ly = cardY + cardH / 2 + 10;
      ctx.fillStyle = '#888';
      ctx.fillRect(lx - 8, ly - 2, 16, 12);   // body
      ctx.strokeStyle = '#888';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.arc(lx, ly - 2, 7, Math.PI, 0);     // shackle arc
      ctx.stroke();
      ctx.fillStyle = RETRO.olive;
      ctx.fillRect(lx - 2, ly + 2, 4, 4);     // keyhole
    } else {
      // Level name
      drawText(t(`level${level.id}_name`), cx + cardW / 2, cardY + 36, 'bold 16px monospace', isSelected ? RETRO.orange : '#fff', 'center');

      // Level description (wrapped, centered)
      ctx.font = '11px monospace';
      ctx.fillStyle = RETRO.gold;
      ctx.textAlign = 'center';
      wrapText(t(`level${level.id}_desc`), cx + cardW / 2, cardY + 58, cardW - 20, 14);

      // Best score
      const best = levelHighScores[level.id] || 0;
      drawText(`${t('best_label')}: ${best}`, cx + cardW / 2, cardY + cardH - 14, '13px monospace', RETRO.gold, 'center');
    }
  }

  // Controls hint
  drawText(t('controls_select'), CANVAS_W / 2, CANVAS_H - 30, '14px monospace', '#adb5bd', 'center');

  // Blinking prompt — only if selected level is unlocked
  const selectedLevel = LEVELS[selectedLevelIndex];
  if (selectedLevel && selectedLevel.unlocked && Math.floor(Date.now() / 500) % 2 === 0) {
    drawText(t('press_start'), CANVAS_W / 2, CANVAS_H - 60, 'bold 18px monospace', '#fff', 'center');
  }
}

// ─── Draw Start Screen ────────────────────────────────────────────────────────
function drawStartScreen() {
  // Background — RETRO palette
  ctx.fillStyle = RETRO.olive;
  ctx.fillRect(0, 0, CANVAS_W, CANVAS_H);

  // Title — single RETRO color
  drawText('ROTTERDAM', CANVAS_W / 2, 130, 'bold 64px monospace', RETRO.orange, 'center');
  drawText('RUNNER', CANVAS_W / 2, 200, 'bold 64px monospace', RETRO.orange, 'center');

  // Subtitle
  drawText(t('subtitle'), CANVAS_W / 2, 250, '18px monospace', RETRO.gold, 'center');

  // Language toggle
  drawText(t('lang_toggle'), CANVAS_W / 2, 310, '16px monospace', RETRO.gold, 'center');

  // Prompt (blinking)
  if (Math.floor(Date.now() / 500) % 2 === 0) {
    drawText(t('press_start'), CANVAS_W / 2, 370, 'bold 22px monospace', '#fff', 'center');
  }

  // Controls
  drawText(t('controls_start'), CANVAS_W / 2, 420, '14px monospace', '#adb5bd', 'center');
}

// ─── Draw Game Over Screen ────────────────────────────────────────────────────
function drawGameOverScreen() {
  ctx.fillStyle = RETRO.olive;
  ctx.fillRect(0, 0, CANVAS_W, CANVAS_H);

  drawText(t('game_over'), CANVAS_W / 2, 160, 'bold 60px monospace', RETRO.orange, 'center');
  drawText(`${t('score_label')}: ${score}`, CANVAS_W / 2, 240, 'bold 28px monospace', '#fff', 'center');
  const best = currentLevel ? (levelHighScores[currentLevel.id] || 0) : 0;
  drawText(`${t('high_score')}: ${best}`, CANVAS_W / 2, 285, 'bold 22px monospace', RETRO.gold, 'center');

  if (Math.floor(Date.now() / 500) % 2 === 0) {
    drawText(t('press_return'), CANVAS_W / 2, 350, 'bold 22px monospace', '#fff', 'center');
  }
}

// ─── Draw Win Screen ──────────────────────────────────────────────────────────
function drawWinScreen() {
  ctx.fillStyle = RETRO.olive;
  ctx.fillRect(0, 0, CANVAS_W, CANVAS_H);

  drawText(t('win_message'), CANVAS_W / 2, 150, 'bold 38px monospace', RETRO.gold, 'center');
  drawText(`${t('final_score')}: ${score}`, CANVAS_W / 2, 240, 'bold 28px monospace', RETRO.gold, 'center');
  const best = currentLevel ? (levelHighScores[currentLevel.id] || 0) : 0;
  drawText(`${t('high_score')}: ${best}`, CANVAS_W / 2, 290, 'bold 22px monospace', RETRO.mint, 'center');
  if (score >= best && score > 0) {
    drawText(t('new_high_score'), CANVAS_W / 2, 340, 'bold 24px monospace', RETRO.orange, 'center');
  }
  if (Math.floor(Date.now() / 500) % 2 === 0) {
    drawText(t('press_return'), CANVAS_W / 2, 400, 'bold 20px monospace', '#fff', 'center');
  }
}

// ─── Draw Pause Overlay ───────────────────────────────────────────────────────
function drawPause() {
  ctx.fillStyle = 'rgba(0,0,0,0.5)';
  ctx.fillRect(0, 0, CANVAS_W, CANVAS_H);
  drawText(t('paused'), CANVAS_W / 2, CANVAS_H / 2, 'bold 60px monospace', '#fff', 'center');
  drawText(t('resume'), CANVAS_W / 2, CANVAS_H / 2 + 55, '20px monospace', '#adb5bd', 'center');
}

function drawDeathMessage() {
  ctx.fillStyle = '#111';
  ctx.fillRect(0, 0, CANVAS_W, CANVAS_H);

  const msg = t(DEATH_MESSAGE_KEYS[deathCause]) || '';

  // Word-wrap message within ~700px
  ctx.font = 'bold 28px monospace';
  ctx.fillStyle = '#ffe28a';
  ctx.textAlign = 'center';
  const maxW = 700;
  const words = msg.split(' ');
  const lines = [];
  let current = '';
  for (const word of words) {
    const test = current ? current + ' ' + word : word;
    if (ctx.measureText(test).width > maxW && current) {
      lines.push(current);
      current = word;
    } else {
      current = test;
    }
  }
  if (current) lines.push(current);

  const lineH = 40;
  const totalH = lines.length * lineH;
  let startY = CANVAS_H / 2 - totalH / 2 - (deathIsGameOver ? 40 : 20);
  for (const line of lines) {
    ctx.fillText(line, CANVAS_W / 2, startY);
    startY += lineH;
  }

  if (deathIsGameOver) {
    drawText(t('game_over'), CANVAS_W / 2, startY + 20, 'bold 42px monospace', '#e63946', 'center');
    startY += 72;
  }

  if (Math.floor(Date.now() / 500) % 2 === 0) {
    drawText(t('press_continue'), CANVAS_W / 2, startY + 24, 'bold 20px monospace', '#adb5bd', 'center');
  }
}

// ─── Render ───────────────────────────────────────────────────────────────────
function render(time) {
  ctx.clearRect(0, 0, CANVAS_W, CANVAS_H);

  if (gameState === 'start') {
    drawStartScreen();
    return;
  }
  if (gameState === 'level_select') {
    drawLevelSelectScreen();
    return;
  }
  if (gameState === 'gameover') {
    drawGameOverScreen();
    return;
  }
  if (gameState === 'win') {
    drawWinScreen();
    return;
  }
  if (gameState === 'death_message') {
    drawDeathMessage();
    return;
  }

  // Playing or paused
  drawBackground();
  drawBridge();
  drawPlatforms();
  drawFences();
  drawFinishFlag(time / 1000);
  drawLandmarks();
  drawEnemies();
  drawPlayer();
  drawHUD();
  drawFactOverlay();

  if (gameState === 'paused') {
    drawPause();
  }
}

// ─── Game Loop ────────────────────────────────────────────────────────────────
let lastTime = null;

function loop(timestamp) {
  if (lastTime === null) lastTime = timestamp;
  let dt = (timestamp - lastTime) / 1000;
  dt = Math.min(dt, 0.1); // cap at 100ms
  lastTime = timestamp;

  update(dt);
  render(timestamp);

  requestAnimationFrame(loop);
}

requestAnimationFrame(loop);
