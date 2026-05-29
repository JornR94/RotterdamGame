## Context

Rotterdam Runner is a single-file canvas game (`game.js`, ~1100 lines). All rendering is immediate-mode 2D canvas. Prior to this change, the game used an ad-hoc color set (`PAL`) with mismatched platform colors (blue, red, lightBlue, darkBlue per section), two different ground Y levels (370 and 400), a gradient sky, and a simple animated red flag at the finish. Collectible stars were gold (`#ffd700`) and some were placed near ground gap edges where they were hard or impossible to reach.

## Goals / Non-Goals

**Goals:**
- Introduce a named `RETRO` palette constant matching color-hex.com/color-palette/165
- Flat `#666547` sky (no gradient)
- Pixelated parallax Rotterdam skyline silhouette in `#fb2e01`
- All ground segments at a single `GROUND_Y = 400` constant
- All ground and platform surfaces colored `#6fcb9f` (mint)
- Stars colored `#ffe28a` (gold)
- Checkered black-and-white finish flag on a pole
- Stars kept ≥100px from any ground gap edge horizontally

**Non-Goals:**
- Changing gameplay mechanics, collision, physics, or scoring
- Modifying the golf car, seagull, or player sprite colors
- Adding new levels or platforms

## Decisions

### Single GROUND_Y constant
**Decision**: Introduce `const GROUND_Y = 400` before `level1Platforms`, and reference it everywhere instead of hardcoding 370/400.  
**Rationale**: The bridge section previously used y=370 for its ground platforms, creating a subtle height mismatch. A single constant eliminates that and prevents drift.  
**Alternative**: Keep two levels and clamp enemies — rejected because it's the root cause of the "pseudo-3D" complaint.

### RETRO palette as separate constant object
**Decision**: Add `const RETRO = { olive, orange, mint, gold, cream }` alongside existing `PAL`.  
**Rationale**: `PAL` colors are still used by the player sprite, car, and seagull (intentionally unchanged). Keeping them separate avoids regressions and makes the new palette explicit.  
**Alternative**: Replace `PAL` entirely — rejected because enemy/player visuals must stay as-is.

### Flat sky color
**Decision**: Single `ctx.fillStyle = RETRO.olive; ctx.fillRect(...)` — no gradient.  
**Rationale**: User explicitly requested no gradient. Flat color also reads better against the `#fb2e01` silhouette.

### Pixelated skyline via integer-snapped rects
**Decision**: Skyline is drawn using `Math.floor()` pixel offsets and axis-aligned rectangles only.  
**Rationale**: Matches the game's existing `image-rendering: pixelated` CSS and the retro aesthetic. No canvas transforms or anti-aliased paths.

### Checkered flag as static pixel grid
**Decision**: 8×5 grid of 8×8px alternating black/white squares. No animation.  
**Rationale**: The pattern is immediately readable as a race finish flag. Static rendering keeps it simple and pixel-consistent.

### Star gap safety via manual repositioning
**Decision**: `EMPTY_STARS_DATA` and `LANDMARKS_DATA` coordinates hand-tuned to be ≥100px from gap edges.  
**Rationale**: The level layout is fixed and small enough that a lookup table is simpler than a runtime validation pass.

## Risks / Trade-offs

- [Risk] Future platform additions could reintroduce stars near gaps → Mitigation: the `GROUND_Y` constant and gap positions are documented in code comments; a future runtime check could be added.
- [Risk] `#fb2e01` silhouette against `#666547` sky may have low contrast for some users → Mitigation: accepted by design; it is a deliberate retro aesthetic choice.
- [Trade-off] All platforms are the same color (`#6fcb9f`), removing the per-section color theming — this is intentional per the user requirement.
