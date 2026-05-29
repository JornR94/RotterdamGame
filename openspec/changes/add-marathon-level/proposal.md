## Why

The game currently has only one level (Landmarks). Adding a second level themed around the Rotterdam Marathon gives players a fresh challenge with a new setting, new enemies, and new obstacles — expanding replayability and celebrating one of Rotterdam's most iconic annual events.

## What Changes

- Add Level 2 "Marathon" to the `LEVELS` array with its own platforms, enemies, fences, collectibles, and finish flag
- Introduce two new enemy types: **bananas** (replace seagulls, same speed `60 px/s`) and **bicycles** (replace VW Golf cars, same speed `300 px/s`)
- Introduce a new obstacle type: **fences** — static barriers the player must jump over, placed at the edges of ground gaps; hitting one stops/bounces the player without costing a life
- Replace star collectibles with **water cups** (25 pts, no popup) and **medal collectibles** (100 pts + fact popup)
- Add 5 marathon-themed fact popups (Dutch language) triggered by collecting medals
- Add procedurally drawn sprites for banana, bicycle, water cup, and medal
- Add level 2 strings to both `STRINGS.NL` and `STRINGS.EN`
- Level 2 unlocks after completing Level 1

## Capabilities

### New Capabilities

- `marathon-level`: The full Level 2 game level — world layout, platforms, enemies, fences, collectibles, facts, and finish flag
- `fence-obstacle`: A new static obstacle type that blocks the player (bounce back) without costing a life; requires new render and collision logic
- `marathon-enemies`: Banana and bicycle enemy sprites and patrol logic mirroring seagull/car behavior from Level 1
- `marathon-collectibles`: Water cup (empty collectible) and medal (fact collectible) sprites replacing stars in Level 2

### Modified Capabilities

- `enemy-system`: `resetEnemies()` must become level-aware to spawn the correct enemies per level

## Impact

- `game.js` — all changes are contained here (single-file game)
- `LEVELS` array — new entry pushed
- `resetEnemies()` — refactored to be level-aware
- `drawEnemies()` — new sprite renderers added
- New functions: `drawFences()`, `updateFences()`
- `drawLandmarks()` and `drawEmptyStars()` — made level-aware to render medals/cups in Level 2
- `STRINGS.NL` / `STRINGS.EN` — two new keys added
- No external dependencies or API changes
