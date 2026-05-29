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

const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// ─── Canvas Scaling (task 2.2) ───────────────────────────────────────────────
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

// ─── Keyboard Input (task 2.3) ───────────────────────────────────────────────
const keys = {};
window.addEventListener('keydown', e => {
  keys[e.code] = true;
  if (!audioInitialized) initAudio(); // task 7.1
  if (e.code === 'Escape') {
    if (gameState === 'playing') { gameState = 'paused'; }
    else if (gameState === 'paused') { gameState = 'playing'; }
  }
  if (e.code === 'Space') {
    if (gameState === 'start') startGame();
    else if (gameState === 'gameover') startGame();
    else if (gameState === 'win') startGame();
  }
  e.preventDefault();
});
window.addEventListener('keyup', e => { keys[e.code] = false; });

// ─── Game State ──────────────────────────────────────────────────────────────
let gameState = 'start'; // 'start' | 'playing' | 'paused' | 'gameover' | 'win'
let score = 0;
let highScore = parseInt(localStorage.getItem('rotterdam-game-highscore') || '0'); // task 6.2

// ─── Audio (tasks 7.x) ──────────────────────────────────────────────────────
let audioCtx = null;
let audioInitialized = false;
let musicNodes = [];

function initAudio() {
  audioInitialized = true;
  audioCtx = new (window.AudioContext || window.webkitAudioContext)();
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

function playJumpSound() { // task 7.2
  if (!audioCtx) return;
  const t = audioCtx.currentTime;
  playTone(300, 'square', t, 0.05, 0.2);
  playTone(500, 'square', t + 0.05, 0.08, 0.15);
}

function playCollectSound() { // task 7.3
  if (!audioCtx) return;
  const t = audioCtx.currentTime;
  playTone(523, 'square', t, 0.07, 0.2);
  playTone(659, 'square', t + 0.07, 0.07, 0.2);
  playTone(784, 'square', t + 0.14, 0.12, 0.2);
}

function playGameOverSound() { // task 7.4
  if (!audioCtx) return;
  const t = audioCtx.currentTime;
  playTone(400, 'sawtooth', t, 0.15, 0.25);
  playTone(300, 'sawtooth', t + 0.15, 0.15, 0.2);
  playTone(200, 'sawtooth', t + 0.30, 0.15, 0.2);
  playTone(150, 'sawtooth', t + 0.45, 0.3, 0.15);
}

// task 7.5 — looping background chiptune
const MUSIC_NOTES = [262, 294, 330, 349, 392, 440, 494, 523, 392, 330, 294, 262];
let musicInterval = null;

function startMusic() {
  if (musicInterval) return;
  let noteIdx = 0;
  const playNext = () => {
    if (!audioCtx) return;
    playTone(MUSIC_NOTES[noteIdx % MUSIC_NOTES.length], 'square', audioCtx.currentTime, 0.18, 0.08);
    noteIdx++;
  };
  musicInterval = setInterval(playNext, 220);
}

// ─── Level Data (task 4.1) ───────────────────────────────────────────────────
// Format: { x, y, w, h, color, type }
// type: 'ground' | 'platform' | 'landmark-base'

const CANVAS_W = 800;
const CANVAS_H = 450;
const LEVEL_W = CANVAS_W * 3.5; // task: 3x viewport width

// task 4.2 — Level 1 platform layout (Rotterdam skyline tour)
const level1Platforms = [
  // Ground — bridge section platforms aligned to deck top y=370 (task 8.5)
  { x: 0,    y: 370, w: 600,  h: 80,  color: PAL.blue, type: 'ground' },
  { x: 650,  y: 370, w: 400,  h: 80,  color: PAL.blue, type: 'ground' },
  // Non-bridge ground sections remain at y=400
  { x: 1100, y: 400, w: 500,  h: 50,  color: PAL.blue, type: 'ground' },
  { x: 1650, y: 400, w: 300,  h: 50,  color: PAL.blue, type: 'ground' },
  { x: 2000, y: 400, w: 800,  h: 50,  color: PAL.blue, type: 'ground' },

  // Erasmusbrug section — bridge cable platforms (task 1.3 — replaced greys with lightBlue)
  { x: 300,  y: 340, w: 120,  h: 15,  color: PAL.lightBlue, type: 'platform' },
  { x: 450,  y: 280, w: 80,   h: 15,  color: PAL.lightBlue, type: 'platform' },
  { x: 550,  y: 220, w: 80,   h: 15,  color: PAL.lightBlue, type: 'platform' },

  // Euromast section — tall tower steps (task 1.3 — replaced greys with darkBlue)
  { x: 700,  y: 350, w: 100,  h: 15,  color: PAL.darkBlue, type: 'platform' },
  { x: 750,  y: 290, w: 80,   h: 15,  color: PAL.darkBlue, type: 'platform' },
  { x: 780,  y: 230, w: 60,   h: 15,  color: PAL.darkBlue, type: 'platform' },
  { x: 800,  y: 170, w: 40,   h: 15,  color: PAL.darkBlue, type: 'platform' }, // top of tower

  // Markthal section — arch-shaped platforms (task 1.4 — replaced orange with PAL.red)
  { x: 1000, y: 360, w: 120,  h: 15,  color: PAL.red, type: 'platform' },
  { x: 1050, y: 300, w: 150,  h: 15,  color: PAL.red, type: 'platform' },
  { x: 1100, y: 240, w: 120,  h: 15,  color: PAL.red, type: 'platform' },

  // Kubuswoningen — tilted cube platforms (task 1.5 — replaced yellow with lightBlue)
  { x: 1350, y: 370, w: 90,   h: 15,  color: PAL.lightBlue, type: 'platform' },
  { x: 1420, y: 310, w: 90,   h: 15,  color: PAL.lightBlue, type: 'platform' },
  { x: 1490, y: 250, w: 90,   h: 15,  color: PAL.lightBlue, type: 'platform' },

  // De Kuip — stadium bowl terraces
  { x: 1700, y: 360, w: 200,  h: 15,  color: PAL.red, type: 'platform' },
  { x: 1730, y: 300, w: 140,  h: 15,  color: PAL.red, type: 'platform' },
  { x: 1760, y: 240, w: 80,   h: 15,  color: PAL.red, type: 'platform' },

  // Port section — container dock platforms
  { x: 2050, y: 370, w: 120,  h: 15,  color: PAL.blue, type: 'platform' },
  { x: 2200, y: 340, w: 100,  h: 15,  color: PAL.blue, type: 'platform' },
  { x: 2330, y: 300, w: 120,  h: 15,  color: PAL.blue, type: 'platform' },
  { x: 2480, y: 260, w: 100,  h: 15,  color: PAL.blue, type: 'platform' },

  // Approach to finish (task 1.2 — replaced #4a7c59 green)
  { x: 2600, y: 370, w: 150,  h: 15,  color: PAL.darkBlue, type: 'platform' },
  { x: 2780, y: 400, w: 300,  h: 50,  color: PAL.blue, type: 'ground' },
];

// task 4.5 — Finish flag
const finishFlag = { x: 2980, y: 300, w: 20, h: 100 };

// ─── Landmark Collectibles (task 5.1) ────────────────────────────────────────
const LANDMARKS_DATA = [
  { x: 520,  y: 180, name: 'Erasmusbrug',      fact: 'The Erasmus Bridge (1996) is 802 metres long and is also known as "The Swan".' },
  { x: 800,  y: 130, name: 'Euromast',          fact: 'The Euromast (185m) is the tallest building in Rotterdam, built in 1960.' },
  { x: 1100, y: 200, name: 'Markthal',          fact: 'The Market Hall (2014) contains 228 apartments and the largest artwork in the Netherlands on its ceiling.' },
  { x: 1490, y: 210, name: 'Kubuswoningen',     fact: 'The Cube Houses were designed by Piet Blom and are tilted at 45 degrees.' },
  { x: 1780, y: 200, name: 'De Kuip',           fact: 'De Kuip (Stadion Feijenoord) has a capacity of 51,117 spectators.' },
  { x: 2480, y: 220, name: 'Haven Rotterdam',   fact: 'The port of Rotterdam is the largest port in Europe.' },
];

// task 3.2 — 10 empty stars scattered across the level (no fact)
const EMPTY_STARS_DATA = [
  { x: 150,  y: 350 },
  { x: 400,  y: 290 },
  { x: 600,  y: 370 },
  { x: 900,  y: 310 },
  { x: 1200, y: 260 },
  { x: 1600, y: 340 },
  { x: 1900, y: 370 },
  { x: 2100, y: 320 },
  { x: 2300, y: 355 },
  { x: 2700, y: 340 },
];

let landmarks = [];

// task 3.3 — resetLandmarks now includes both fact stars and empty stars
function resetLandmarks() {
  const factStars = LANDMARKS_DATA.map(l => ({ ...l, collected: false, animAngle: Math.random() * Math.PI * 2, isFact: true }));
  const emptyStars = EMPTY_STARS_DATA.map(e => ({ ...e, name: null, fact: null, collected: false, animAngle: Math.random() * Math.PI * 2, isFact: false }));
  landmarks = [...factStars, ...emptyStars];
}

// ─── Player (task 3.1) ───────────────────────────────────────────────────────
const PLAYER_W = 24;
const PLAYER_H = 36;
const GRAVITY = 900;         // px/s²
const JUMP_VEL = -480;
const WALK_SPEED = 220;

let player;

function resetPlayer() {
  player = {
    x: 60,
    y: 360,
    vx: 0,
    vy: 0,
    w: PLAYER_W,
    h: PLAYER_H,
    lives: 3,
    isOnGround: false,
    facingRight: true,
    idleBob: 0,
    idleBobDir: 1,
  };
}

// ─── Camera (task 2.6) ───────────────────────────────────────────────────────
let cameraX = 0;

// ─── Popup state (task 5.4) ──────────────────────────────────────────────────
let popup = null; // { name, fact, timer }

// ─── Enemy System (tasks 5.1, 6.x, 7.x) ─────────────────────────────────────
// Enemy object: { x, y, w, h, vx, type, alive, patrolMin, patrolMax, points }
let enemies = [];

// task 6.1 — draw VW Golf hatchback sprite within 36×20px bounding box
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

// task 6.2 & 6.3 & 7.2 & 7.3 — spawn data + resetEnemies
function resetEnemies() {
  const golfCars = [
    // task 6.2 — Golf cars on ground platforms, vx=300
    { x: 80,   y: 370, w: 36, h: 20, vx: 300, type: 'golf', alive: true, patrolMin: 0,    patrolMax: 580,  points: 50 },
    { x: 1200, y: 370, w: 36, h: 20, vx: 300, type: 'golf', alive: true, patrolMin: 1100, patrolMax: 1570, points: 50 },
    { x: 2100, y: 370, w: 36, h: 20, vx: 300, type: 'golf', alive: true, patrolMin: 2000, patrolMax: 2770, points: 50 },
  ];
  const seagulls = [
    // Seagulls on ground platforms, slow back-and-forth patrol
    { x: 200,  y: 354, w: 24, h: 18, vx: 60,  type: 'seagull', alive: true, patrolMin: 100,  patrolMax: 250,  points: 30 },
    { x: 700,  y: 354, w: 24, h: 18, vx: 60,  type: 'seagull', alive: true, patrolMin: 650,  patrolMax: 1010, points: 30 },
    { x: 1700, y: 384, w: 24, h: 18, vx: 60,  type: 'seagull', alive: true, patrolMin: 1650, patrolMax: 1900, points: 30 },
    { x: 2500, y: 384, w: 24, h: 18, vx: 60,  type: 'seagull', alive: true, patrolMin: 2400, patrolMax: 2750, points: 30 },
  ];
  enemies = [...golfCars, ...seagulls];
}

// ─── Game Init ───────────────────────────────────────────────────────────────
function startGame() {
  score = 0;
  resetPlayer();
  resetLandmarks();
  resetEnemies();
  cameraX = 0;
  popup = null;
  gameState = 'playing';
}

// ─── AABB Collision (task 2.5) ───────────────────────────────────────────────
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

// ─── Update (tasks 2.x, 3.x) ─────────────────────────────────────────────────
function update(dt) {
  if (gameState !== 'playing') return;

  // task 3.2 — horizontal movement
  if (keys['ArrowLeft']) {
    player.vx = -WALK_SPEED;
    player.facingRight = false;
  } else if (keys['ArrowRight']) {
    player.vx = WALK_SPEED;
    player.facingRight = true;
  } else {
    player.vx = 0;
  }

  // task 3.3 & 3.4 — jump
  if ((keys['Space'] || keys['ArrowUp']) && player.isOnGround) {
    player.vy = JUMP_VEL;
    player.isOnGround = false;
    playJumpSound();
  }

  // task 2.4 — gravity
  player.vy += GRAVITY * dt;

  // Move player
  player.x += player.vx * dt;
  player.y += player.vy * dt;

  // Prevent going left of level start
  if (player.x < 0) { player.x = 0; player.vx = 0; }

  // task 2.5 — platform collision
  player.isOnGround = false;
  for (const plat of level1Platforms) {
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

  // task 3.5 — fall below canvas
  if (player.y > CANVAS_H + 50) {
    player.lives--;
    if (player.lives <= 0) {
      // task 3.6 — game over
      playGameOverSound();
      saveHighScore();
      gameState = 'gameover';
      return;
    }
    resetPlayer();
    cameraX = 0;
  }

  // task 2.6 — camera scroll
  const targetCam = player.x - CANVAS_W / 2 + player.w / 2;
  cameraX = Math.max(0, Math.min(targetCam, LEVEL_W - CANVAS_W));

  // task 5.2 — enemy update loop: move enemies, handle patrol direction reversal
  for (const en of enemies) {
    if (!en.alive) continue;
    en.x += en.vx * dt;
    if (en.x < en.patrolMin) { en.x = en.patrolMin; en.vx = Math.abs(en.vx); }
    if (en.x + en.w > en.patrolMax) { en.x = en.patrolMax - en.w; en.vx = -Math.abs(en.vx); }
  }

  // task 5.4 — enemy-player collision
  for (const en of enemies) {
    if (!en.alive) continue;
    if (!rectsOverlap(player.x, player.y, player.w, player.h, en.x, en.y, en.w, en.h)) continue;

    const playerBottom = player.y + player.h;
    const overlapFromTop = playerBottom - en.y;

    if (player.vy > 0 && overlapFromTop <= 12) {
      // Stomp kill — task 6.4 & 7.4 — award points based on enemy type
      en.alive = false;
      score += en.points;
      player.vy = -300; // bounce player up
    } else {
      // Side or bottom hit — lose a life
      player.lives--;
      if (player.lives <= 0) {
        playGameOverSound();
        saveHighScore();
        gameState = 'gameover';
        return;
      }
      resetPlayer();
      cameraX = 0;
      return;
    }
  }

  // task 5.3 — landmark collision (task 3.4 — fact vs empty star logic)
  for (const lm of landmarks) {
    if (lm.collected) continue;
    if (rectsOverlap(player.x, player.y, player.w, player.h, lm.x - 15, lm.y - 15, 30, 30)) {
      lm.collected = true;
      playCollectSound();
      if (lm.isFact) {
        score += 100; // fact star: 100 pts + popup
        popup = { name: lm.name, fact: lm.fact, timer: 4 };
      } else {
        score += 25; // empty star: 25 pts, no popup
      }
    }
    lm.animAngle += dt * 3;
  }

  // task 4.6 — finish flag collision
  if (rectsOverlap(player.x, player.y, player.w, player.h, finishFlag.x, finishFlag.y, finishFlag.w, finishFlag.h)) {
    score += 500; // level complete bonus
    saveHighScore();
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

// task 6.3 — save high score
function saveHighScore() {
  if (score > highScore) {
    highScore = score;
    localStorage.setItem('rotterdam-game-highscore', String(highScore));
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

// ─── Draw Background (task 4.4) ──────────────────────────────────────────────
function drawBackground() {
  // Sky gradient
  const grad = ctx.createLinearGradient(0, 0, 0, CANVAS_H);
  grad.addColorStop(0, '#1d3557');
  grad.addColorStop(0.6, '#457b9d');
  grad.addColorStop(1, '#a8dadc');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, CANVAS_W, CANVAS_H);

  // Simplified Rotterdam skyline silhouettes (draw at fixed scroll fraction)
  const parallax = cameraX * 0.3;
  ctx.fillStyle = '#2d4a6e';

  // Euromast silhouette
  const emX = 600 - parallax % CANVAS_W;
  ctx.fillRect(emX + 10, 150, 8, 200);
  ctx.fillRect(emX, 145, 28, 15);
  ctx.fillRect(emX + 5, 130, 18, 18);

  // Erasmusbrug pylon
  const ebX = 200 - (parallax * 0.8) % CANVAS_W;
  ctx.fillRect(ebX, 160, 10, 190);
  ctx.fillRect(ebX - 20, 160, 50, 10);

  // Cube Houses silhouette
  const cuX = 1000 - parallax % (CANVAS_W * 2);
  for (let i = 0; i < 3; i++) {
    ctx.save();
    ctx.translate(cuX + i * 40, 280);
    ctx.rotate(Math.PI / 4);
    ctx.fillRect(-15, -15, 30, 30);
    ctx.restore();
  }

  // Port cranes
  const portX = 1300 - (parallax * 0.5) % (CANVAS_W * 1.5);
  for (let i = 0; i < 3; i++) {
    const cx = portX + i * 120;
    ctx.fillRect(cx, 220, 8, 180);     // vertical
    ctx.fillRect(cx - 40, 220, 80, 6); // horizontal arm
    ctx.fillRect(cx + 30, 220, 6, 60); // hook
  }
}

// ─── Draw Bridge (tasks 8.1–8.3) ─────────────────────────────────────────────
// Erasmus Bridge drawn in background layer, before platforms
function drawBridge() {
  // Bridge deck visible x range relative to camera
  const deckStartX = 0 - cameraX;
  const deckEndX = 900 - cameraX;
  if (deckEndX < 0 || deckStartX > CANVAS_W) return;

  // task 8.1 — Bridge deck: wide horizontal rect at y=370, spanning x 0–900
  ctx.fillStyle = PAL.lightBlue;
  ctx.fillRect(deckStartX, 370, 900, 12);

  // task 8.2 — A-frame pylon at x≈400
  const pylonX = 400 - cameraX;
  const pylonPeakY = 80;
  const legSpread = 60;
  const deckY = 370;

  ctx.fillStyle = PAL.lightBlue;
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

  // task 8.3 — Stay cables from pylon peak to deck anchors
  ctx.strokeStyle = PAL.white;
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

// ─── Draw Platforms (task 4.3) ───────────────────────────────────────────────
function drawPlatforms() {
  for (const plat of level1Platforms) {
    const sx = plat.x - cameraX;
    if (sx + plat.w < 0 || sx > CANVAS_W) continue;
    drawRect(sx, plat.y, plat.w, plat.h, plat.color);
    // Dark edge
    drawRect(sx, plat.y, plat.w, 3, 'rgba(0,0,0,0.3)');
  }
}

// ─── Draw Finish Flag (task 4.5) ─────────────────────────────────────────────
function drawFinishFlag(time) {
  const sx = finishFlag.x - cameraX;
  if (sx < -30 || sx > CANVAS_W + 30) return;
  // Pole
  drawRect(sx, finishFlag.y, 6, finishFlag.h, '#f1faee');
  // Flag wave
  ctx.fillStyle = '#e63946';
  ctx.beginPath();
  const wave = Math.sin(time * 3) * 5;
  ctx.moveTo(sx + 6, finishFlag.y);
  ctx.lineTo(sx + 6 + 40, finishFlag.y + 10 + wave);
  ctx.lineTo(sx + 6 + 40, finishFlag.y + 30 + wave);
  ctx.lineTo(sx + 6, finishFlag.y + 20);
  ctx.closePath();
  ctx.fill();
}

// ─── Draw Landmarks (task 5.2 / 3.1 proper star polygon) ─────────────────────
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
    ctx.fillStyle = '#ffd700';
    drawStar(sx, lm.y, lm.animAngle);
    ctx.restore();
  }
}

// ─── Draw Enemies (task 5.3) ─────────────────────────────────────────────────
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
    }
  }
}

// ─── Draw Player (task 3.7 / 2.x Feyenoord skin) ─────────────────────────────
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
  // Torso: left panel red, right panel white
  drawRect(-8, 10, 8, 16, PAL.red);   // left torso half
  drawRect( 0, 10, 8, 16, PAL.white); // right torso half
  // Left sleeve (white) — sticks out left side
  drawRect(-11, 10, 4, 8, PAL.white);
  // Right sleeve (red) — sticks out right side
  drawRect(  7, 10, 4, 8, PAL.red);

  // Shorts — black below shirt (task 2.3)
  drawRect(-8, 26, 16, 8, '#212529');

  // Socks — white with red top trim band (task 2.4)
  // Left leg socks
  drawRect(-8, 34, 6, 8, PAL.white);
  drawRect(-8, 34, 6, 3, PAL.red); // red trim band
  // Right leg socks
  const legOff = (player.vx !== 0 && player.isOnGround) ? Math.sin(Date.now() * 0.01) * 4 : 0;
  drawRect(2, 34 + legOff, 6, 8, PAL.white);
  drawRect(2, 34 + legOff, 6, 3, PAL.red); // red trim band

  // Boots — black, sit below socks (task 2.5)
  drawRect(-10, 42, 8, 5, '#212529');
  drawRect(1,   42 + legOff, 8, 5, '#212529');

  ctx.restore();
}

// ─── Draw HUD (task 8.2 / 4.5 — score moved to center-top) ──────────────────
function drawHUD() {
  // Score — center-top to avoid overlay conflict (task 4.5)
  drawText(`SCORE: ${score}`, CANVAS_W / 2, 22, 'bold 18px monospace', '#fff', 'center');
  // High score — right side
  drawText(`BEST: ${highScore}`, CANVAS_W - 10, 22, 'bold 16px monospace', '#ffd700', 'right');
  // Lives (pixel hearts)
  for (let i = 0; i < player.lives; i++) {
    drawHeart(20 + i * 28, 14, PAL.red);
  }
}

function drawHeart(x, y, color) {
  ctx.fillStyle = color;
  // Simple heart using rects
  ctx.fillRect(x - 6, y - 2, 4, 4);
  ctx.fillRect(x + 2, y - 2, 4, 4);
  ctx.fillRect(x - 8, y, 16, 4);
  ctx.fillRect(x - 6, y + 4, 12, 4);
  ctx.fillRect(x - 4, y + 8, 8, 4);
  ctx.fillRect(x - 2, y + 12, 4, 2);
}

// ─── Draw Fact Overlay (tasks 4.1–4.3) — top-left HUD panel ──────────────────
function drawFactOverlay() {
  if (!popup) return;
  const totalTime = 4; // task 4.4 — 4s timer
  const elapsed = totalTime - popup.timer;

  // task 4.2 — alpha fade-in (0–0.3s) and fade-out (last 1s)
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

  // task 4.3 — landmark name in bold small font
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

// ─── Draw Start Screen (task 8.1) ─────────────────────────────────────────────
function drawStartScreen() {
  // Background
  const grad = ctx.createLinearGradient(0, 0, 0, CANVAS_H);
  grad.addColorStop(0, '#1d3557');
  grad.addColorStop(1, '#457b9d');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, CANVAS_W, CANVAS_H);

  // Title
  drawText('ROTTERDAM', CANVAS_W / 2, 130, 'bold 64px monospace', '#ffd700', 'center');
  drawText('RUNNER', CANVAS_W / 2, 200, 'bold 64px monospace', '#e63946', 'center');

  // Subtitle
  drawText('A retro platformer through the city', CANVAS_W / 2, 250, '18px monospace', '#a8dadc', 'center');

  // High score
  drawText(`HIGH SCORE: ${highScore}`, CANVAS_W / 2, 300, 'bold 20px monospace', '#ffd700', 'center');

  // Prompt (blinking)
  if (Math.floor(Date.now() / 500) % 2 === 0) {
    drawText('PRESS SPACE TO START', CANVAS_W / 2, 360, 'bold 22px monospace', '#fff', 'center');
  }

  // Controls
  drawText('← → Move    SPACE Jump    ESC Pause', CANVAS_W / 2, 410, '14px monospace', '#adb5bd', 'center');
}

// ─── Draw Game Over Screen (task 8.3) ─────────────────────────────────────────
function drawGameOverScreen() {
  ctx.fillStyle = 'rgba(0,0,0,0.85)';
  ctx.fillRect(0, 0, CANVAS_W, CANVAS_H);

  drawText('GAME OVER', CANVAS_W / 2, 160, 'bold 60px monospace', '#e63946', 'center');
  drawText(`SCORE: ${score}`, CANVAS_W / 2, 240, 'bold 28px monospace', '#fff', 'center');
  drawText(`HIGH SCORE: ${highScore}`, CANVAS_W / 2, 285, 'bold 22px monospace', '#ffd700', 'center');

  if (Math.floor(Date.now() / 500) % 2 === 0) {
    drawText('PRESS SPACE TO RETRY', CANVAS_W / 2, 350, 'bold 22px monospace', '#a8dadc', 'center');
  }
}

// ─── Draw Win Screen (task 8.4) ───────────────────────────────────────────────
function drawWinScreen() {
  const grad = ctx.createLinearGradient(0, 0, 0, CANVAS_H);
  grad.addColorStop(0, '#1d3557');
  grad.addColorStop(1, '#457b9d');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, CANVAS_W, CANVAS_H);

  drawText('ROTTERDAM EXPLORED!', CANVAS_W / 2, 120, 'bold 38px monospace', '#ffd700', 'center');
  drawText('Congratulations!', CANVAS_W / 2, 180, 'bold 28px monospace', '#fff', 'center');
  drawText(`FINAL SCORE: ${score}`, CANVAS_W / 2, 250, 'bold 28px monospace', '#ffd700', 'center');
  drawText(`HIGH SCORE: ${highScore}`, CANVAS_W / 2, 295, 'bold 22px monospace', '#a8dadc', 'center');
  if (score >= highScore) {
    drawText('NEW HIGH SCORE!', CANVAS_W / 2, 340, 'bold 24px monospace', '#e63946', 'center');
  }
  if (Math.floor(Date.now() / 500) % 2 === 0) {
    drawText('PRESS SPACE TO PLAY AGAIN', CANVAS_W / 2, 400, 'bold 20px monospace', '#fff', 'center');
  }
}

// ─── Draw Pause Overlay (task 8.5) ────────────────────────────────────────────
function drawPause() {
  ctx.fillStyle = 'rgba(0,0,0,0.5)';
  ctx.fillRect(0, 0, CANVAS_W, CANVAS_H);
  drawText('PAUSED', CANVAS_W / 2, CANVAS_H / 2, 'bold 60px monospace', '#fff', 'center');
  drawText('Press ESC to resume', CANVAS_W / 2, CANVAS_H / 2 + 55, '20px monospace', '#adb5bd', 'center');
}

// ─── Render ───────────────────────────────────────────────────────────────────
function render(time) {
  ctx.clearRect(0, 0, CANVAS_W, CANVAS_H);

  if (gameState === 'start') {
    drawStartScreen();
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

  // Playing or paused
  drawBackground();
  drawBridge();
  drawPlatforms();
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

// ─── Game Loop (task 2.1) ──────────────────────────────────────────────────────
let lastTime = null;

function loop(timestamp) {
  if (lastTime === null) lastTime = timestamp;
  let dt = (timestamp - lastTime) / 1000;
  dt = Math.min(dt, 0.1); // task 2.1 — cap at 100ms
  lastTime = timestamp;

  update(dt);
  render(timestamp);

  requestAnimationFrame(loop);
}

// Preload high score and kick off
highScore = parseInt(localStorage.getItem('rotterdam-game-highscore') || '0');
requestAnimationFrame(loop);
