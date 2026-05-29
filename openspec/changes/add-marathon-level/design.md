## Context

The game is a single-file (`game.js`, ~1500 lines) Canvas 2D platformer. All graphics are procedurally drawn — no external assets. The existing level system is an array (`LEVELS`) of plain objects; the engine already iterates over this array for rendering platforms, collectibles, and the finish flag. However, enemy spawning (`resetEnemies()`) and some rendering functions are currently hardcoded for Level 1 only.

## Goals / Non-Goals

**Goals:**
- Add a fully playable Level 2 with distinct enemies, obstacles, and collectibles
- Reuse all existing engine code (physics, scrolling, HUD, state machine) unchanged
- Keep all changes within `game.js` — no new files, no build tooling changes
- Fence obstacles stop the player without costing a life (bounce-back only)

**Non-Goals:**
- Reworking the rendering pipeline or game architecture
- Adding external sprite/audio assets
- Multiplayer, save-state migration, or difficulty settings

## Decisions

### D1: Level data structure — extend existing `LEVELS` array

Add Level 2 as a new object pushed to `LEVELS`. Add a `fences` array field to the level descriptor (new optional field, ignored by Level 1 which has none).

**Alternative considered:** Separate `LEVEL2` constant. Rejected — `LEVELS` array is already iterated by the level-select screen and high-score system; extending it keeps all level logic consistent.

### D2: Enemy system — make `resetEnemies()` level-aware via `currentLevel.id`

Switch inside `resetEnemies()` on `currentLevel.id` to push the correct enemy set. Enemy objects are identical in shape (`type`, `x`, `y`, `w`, `h`, `vx`, `patrolMin`, `patrolMax`, `points`, `deathMsg`); only `type` and sprite values differ.

**Alternative considered:** Store enemy descriptors inside the level object. Viable but requires restructuring `resetEnemies()` more deeply and moving patrol logic into the level data. The switch approach is the minimum-invasive change.

### D3: Fence collision — bounce-back, no life loss

On horizontal overlap with a fence, set `player.vx = 0` and push player back by the overlap amount (same technique used for platform edge clamping). No life deducted. This is purely a timing obstacle.

**Alternative considered:** Lethal fences (cost a life). Rejected by design decision — fences are jump-timing challenges only.

### D4: Collectible rendering — level-aware draw functions

`drawLandmarks()` and `drawEmptyStars()` check `currentLevel.id`; for Level 2 they call `drawMedal()` / `drawWaterCup()` helper functions instead of the star renderer. Data shape (x, y, collected, text, points) is unchanged.

**Alternative considered:** Separate draw functions per level called from the main loop. More explicit but requires duplicating the iteration logic. Level-aware branching inside existing functions is cleaner.

### D5: Sprite style — procedural, pixelated-realistic

- **Banana:** Yellow crescent using stacked `fillRect` rows approximating a curve. Yellow `#FFE135`, brown tips `#8B4513`.
- **Bicycle:** Two `arc()` wheel circles (r=7), grey frame lines (`#444`), handlebar nub. 36×20 bounding box.
- **Water cup:** White trapezoid (wide top, narrow bottom) with a blue stripe. ~12×16 px.
- **Medal:** Gold `arc()` circle (r=8) with a red ribbon rectangle below. ~18×24 px.

### D6: Road platform color — asphalt grey `#666`

Elevated road sections use `#666` fill instead of `RETRO.mint`. White dashed lane markings (small `fillRect` dashes) drawn on top of each platform in `drawPlatforms()` when `currentLevel.id === 2`.

### D7: Level unlock — set `unlocked: true` on level 2 after level 1 win

The existing win handler already iterates `LEVELS` to find the next level and unlock it. Level 2 starts with `unlocked: false`; the engine handles the rest automatically.

## Risks / Trade-offs

- **`resetEnemies()` switch grows with each level** → Acceptable for a small game; if a Level 3+ is added, consider moving enemy data into the level descriptor at that point.
- **Fence collision AABB is simple** → If a fence is placed at the edge of a platform, edge-case pixel overlaps could feel imprecise. Mitigate by ensuring fence x positions have 8+ px clearance from platform edges.
- **Procedural sprites are not pixel-perfect curves** → Banana crescent approximated with rects will look blocky. This is intentional (pixelated-realistic style) and consistent with all other sprites in the game.

## Open Questions

- None — all design decisions resolved during exploration.
