## Context

Rotterdam Runner is a single-file vanilla JS canvas platformer (`game.js`, ~689 lines). It renders to a fixed 800×450 canvas using `requestAnimationFrame`. All game objects are drawn with the Canvas 2D API — no sprites or image files are used; everything is procedural pixel-art using `fillRect`, `beginPath`, and basic geometry.

The current state:
- Player character is a generic red-hatted figure with no Feyenoord identity
- Collectible landmarks are rendered as spinning 5-point stars (already star-shaped) but all carry a fact and there are only 6 of them
- Facts are shown in a large centered overlay box that blocks the entire playing area
- No enemies exist
- Level 1 has abstract platforms tagged as "Erasmusbrug section" but the environment is not visually a bridge — it's flat colored rectangles
- Color palette is mostly correct already (`#e63946`, `#457b9d`, `#1d3557`, `#a8dadc`, `#f1faee`) but some stray colors remain (`#4a7c59`, `#adb5bd`, `#6c757d`, `#e76f51`, `#f4d35e`)

## Goals / Non-Goals

**Goals:**
- Restyle player as a Feyenoord footballer (red/white shirt, black shorts)
- Replace centered fact popup with a small top-left overlay that fades out after ~4 seconds
- Add non-fact "empty" stars so collecting a star is a slot-machine — only some carry facts
- Make star shapes visually distinct (proper 5-point star, golden)
- Add Volkswagen Golf car enemies: fast, horizontal, stomp-killable
- Add trash bag enemies: slow, back-and-forth on ground platforms, stomp-killable
- Implement Erasmus Bridge as a visible 2D environment for level 1 (walk along top deck, pylon visible)
- Purge stray colors and enforce the 5-color Rotterdam palette throughout

**Non-Goals:**
- Adding image/sprite assets (stay procedural canvas drawing)
- Implementing levels 2+ (Euromast, Markthal, etc.)
- Changing core physics, camera, audio, or game-state machine
- Mobile/touch controls

## Decisions

### 1. Enemy system: new array + update loop, not inline
Add `enemies` array containing objects `{ x, y, w, h, vx, type, alive, dir, platform }`. Update all enemies each frame before player collision. This keeps the pattern consistent with `landmarks[]`.

**Stomping detection**: if player lands on top of enemy (player bottom overlaps enemy top by ≤ 12px and player `vy > 0`), mark `alive = false` and bounce player upward (+200 px/s). If player touches side or comes from below, deduct a life (same as falling).

Rationale: mirrors existing AABB collision code, minimal new surface area.

### 2. Star mix: ratio of fact vs empty
Spawn 6 fact-stars (existing landmarks) + 10 empty stars at hand-picked positions scattered across the level. Empty stars award 25 points (vs 100 for fact stars) and display no popup. Star draw code is shared between both types.

Rationale: slot-machine feel without changing data model significantly — empty stars are just `{ x, y, collected, animAngle, fact: null }`.

### 3. Erasmus Bridge level environment
Replace the current abstract platform set for the Erasmusbrug section with a proper drawn bridge:
- A wide low horizontal deck at y≈370 spanning x 0–900 (the walkable surface)
- A tall A-frame pylon at x≈400, drawn with `lineTo` and filled in `#a8dadc`
- Stay cables drawn as diagonal lines from pylon top down to deck anchors
- The deck is the platform the player walks on — collision geometry stays as `level1Platforms` entries but gets visually overdrawn by `drawBridge()`

Only the visual layer changes; the collision rectangles are updated to match the bridge shape.

### 4. Fact overlay: top-left HUD panel
Replace `drawPopup()` centered box with a small `drawFactOverlay()` that renders at `(8, 40)` with a semi-transparent dark background, width ~260px. Alpha fades in for 0.3s and out during the last 1s of the 4s timer. The overlay sits above the play area without covering the player.

### 5. Player Feyenoord skin: procedural only
Update `drawPlayer()` geometry:
- Head: skin tone (`#f4a261`)
- Shirt: red/white horizontal stripes (alternate `fillRect` bands of `#e63946` and `#f1faee`)
- Shorts: black (`#212529`)
- Socks: white (`#f1faee`) with red top trim
- Boots: black (`#212529`)
- No hat (footballers don't wear hats)

### 6. Color palette enforcement
Define palette constants at top of file:
```js
const PAL = { red: '#e63946', blue: '#457b9d', darkBlue: '#1d3557', lightBlue: '#a8dadc', white: '#f1faee' };
```
Replace all `#4a7c59` (green), `#adb5bd` (grey), `#6c757d` (grey), `#e76f51` (orange), `#f4d35e` (yellow) with nearest palette equivalents. Ground → `#457b9d`; platforms → `#1d3557`, `#a8dadc`, or `#e63946` by section.

## Risks / Trade-offs

- [Enemy collision false positives on fast Golf cars] → Cap `vx` and use sub-step collision if dt spikes (already capped at 100ms)
- [Bridge visual covering collision rects] → Draw bridge in background layer before platforms; platforms remain invisible collision geometry on top
- [Top-left overlay overlapping score text] → Score moves to `y: 28`, overlay starts at `y: 40` — they occupy the same x region but different y; adjust score to center-top or right-align to avoid conflict
- [Empty stars making game too easy to finish] → Empty stars still award 25 pts; only fact stars count toward "collected all" logic (if such a win condition is added later)
