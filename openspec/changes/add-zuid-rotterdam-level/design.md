## Context

The game is a single-file vanilla JS platformer (`game.js`, ~1900 lines). All levels live in a global `LEVELS` array as plain object literals. Enemies are spawned in `resetEnemies()` via `if/else` branches on `currentLevel.id`. Death messages are rendered by looking up a string key. There are no modules, no build step, no external dependencies.

Currently there are two levels:
- `id: 1` — Landmarks (seagull + Golf enemies)
- `id: 2` — Marathon (banana + bicycle enemies)

We are inserting a new level at position 2 and shifting Marathon to position 3.

## Goals / Non-Goals

**Goals:**
- Insert Zuid-Rotterdam as `id: 2` in the LEVELS array
- Renumber Marathon from `id: 2` → `id: 3` everywhere it appears
- Add a `knife` enemy type rendered and behaving like a human figure
- Reuse VW Golf enemy from Level 1 with a new death message key (`golf_zuid`)
- Register Dutch death messages for both new enemy types
- Keep platform gap structure consistent with Level 1 (no fences)

**Non-Goals:**
- Changing any Level 1 or Level 3 gameplay
- Persisting level unlock state to localStorage (already not done for any level)
- Adding vertical enemy movement or new physics
- Any UI changes beyond the level select card text

## Decisions

### D1: Level ID renumbering is in-place (no slug/name-based lookup)
The game finds levels by numeric `id`. The simplest path is: change `id: 2` → `id: 3` on the Marathon object, update the `resetEnemies` branch from `=== 2` to `=== 3`, and insert the new level with `id: 2`. No other system needs changing.

*Alternative considered*: Reorder by array index instead of id — rejected because the level-unlock logic uses `currentLevel.id + 1` to find the next level, so IDs must be sequential and correct.

### D2: Knife enemy reuses the existing patrol/stomp system
All enemies share the same movement loop (`en.x += en.vx * dt`, patrol bounce) and collision detection (stomp vs. side hit). The knife guy is just a new `type: 'knife'` with a taller hitbox (`24 × 30`) and `vx: 60`. No new physics needed.

*Alternative considered*: Give the knife guy a lunge/charge behaviour — rejected as out of scope; keep L2 mechanics familiar so difficulty comes from layout, not new systems.

### D3: Golf in Zuid-Rotterdam uses a distinct death message key (`golf_Zuid`)
The Golf car object is identical to Level 1 in speed and size. To show a different death message ("Rustig met dat Golfje van je, gek!") without touching Level 1, the Zuid-Rotterdam Golf is given `deathMsg: 'golf_zuid'` and a separate entry is added to the death message lookup.

### D4: Platform theme — flat wide warehouse rooftops + narrow dock walkways
To evoke industrial docks without introducing new platform mechanics, platforms use wider, lower shapes (rooftop feel) and a few narrow elevated ones (crane walkway feel). Platform color: `'#444'` (darker than Marathon's `'#666'`). Ground color: `'#444'` as well — continuous dark concrete look.

### D5: Sky and silhouette colors as specified
`skyColor: '#fb2e01'` (bold red-orange), `silhouetteColor: '#666547'` (muted olive-khaki). These are hardcoded strings, not references to the `RETRO` palette object — consistent with how other custom colors are used in the codebase.

## Risks / Trade-offs

- **Marathon level losing its `id: 2` references** → Any future code that hardcodes `id === 2` to mean Marathon will break. Mitigation: grep for all `=== 2` and `=== '2'` occurrences before shipping and update them.
- **Knife enemy rendering** — the game currently renders enemies by `type` switch. A new `'knife'` case must be added to the draw loop or the enemy will be invisible. Mitigation: add the draw case as part of the same task as the enemy definition.
- **Level select card count** — cards are rendered dynamically from `LEVELS.length`, so a third card appears automatically. No additional UI work needed, but the card for Level 3 will show `unlocked: false` until Level 2 is completed. This is correct behaviour.
