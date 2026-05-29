## 1. Retro Palette

- [x] 1.1 Add `const RETRO = { olive: '#666547', orange: '#fb2e01', mint: '#6fcb9f', gold: '#ffe28a', cream: '#fffeb3' }` to `game.js` after the existing `PAL` constant

## 2. Unified Ground

- [x] 2.1 Add `const GROUND_Y = 400` before `level1Platforms` in `game.js`
- [x] 2.2 Update all ground-type platform entries in `level1Platforms` to use `y: GROUND_Y` (replacing any hardcoded 370 or 400 values)
- [x] 2.3 Update player spawn in `resetPlayer()` to use `y: GROUND_Y - PLAYER_H`
- [x] 2.4 Update golf car spawn Y values to `GROUND_Y - 20` in `resetEnemies()`
- [x] 2.5 Update seagull spawn Y values to `GROUND_Y - 18` in `resetEnemies()`
- [x] 2.6 Update `drawBridge()` deck and pylon to reference `GROUND_Y` instead of hardcoded 370

## 3. Platform and Ground Colors

- [x] 3.1 Set all `type: 'ground'` platform `color` fields to `RETRO.mint`
- [x] 3.2 Set all `type: 'platform'` platform `color` fields to `RETRO.mint`
- [x] 3.3 Update bridge deck fill in `drawBridge()` to use `RETRO.mint` (deck merged into ground platforms; pylon uses RETRO.mint)
- [x] 3.4 Update bridge pylon fill in `drawBridge()` to use `RETRO.mint`
- [x] 3.5 Update bridge cable stroke in `drawBridge()` to use `RETRO.mint`

## 4. Background Skyline

- [x] 4.1 Replace sky gradient in `drawBackground()` with a flat `RETRO.olive` fill over the full canvas
- [x] 4.2 Replace water strip gradient with a flat `RETRO.mint` fill from `GROUND_Y` to `CANVAS_H`
- [x] 4.3 Set silhouette fill color (`SIL`) to `RETRO.orange` (via `currentLevel.silhouetteColor`)
- [x] 4.4 Set stay cable pixel color (`cableColor`) to `RETRO.orange` (cables use `SIL` which is `RETRO.orange`)
- [x] 4.5 Ensure all building window shading uses a darker variant of orange (not blue/grey)
- [x] 4.6 Verify all shape coordinates are integer-snapped via `Math.floor()`

## 5. Stars

- [x] 5.1 Change star fill color in `drawLandmarks()` from `#ffd700` to `RETRO.gold`
- [x] 5.2 Move `EMPTY_STARS_DATA` entries that are within 100px of gap edges (x≈600, 1100, 1600, 1950) AND above y=280 to safe positions
- [x] 5.3 Move any `LANDMARKS_DATA` entries that are within 100px of gap edges AND above y=280 to safe positions

## 6. Checkered Finish Flag

- [x] 6.1 Replace `drawFinishFlag()` body with a static pole (4px wide, dark `#222222`) plus an 8×5 grid of 8×8px alternating black/white squares
- [x] 6.2 Confirm viewport culling uses `sx < -80 || sx > CANVAS_W + 80` to accommodate the wider flag
