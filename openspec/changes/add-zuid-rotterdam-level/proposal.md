## Why

The game currently has two levels; adding a Zuid-Rotterdam level between Landmarks and Marathon gives the player a harder mid-point with a gritty, neighborhood survival theme before they reach the marathon. It also makes the level progression feel more grounded in different facets of Rotterdam — tourist landmarks → rough neighbourhood → sporting event.

## What Changes

- New Level 2 "Zuid-Rotterdam" inserted between current Level 1 (Landmarks) and current Level 2 (Marathon)
- Existing Level 2 (Marathon) renumbered to Level 3
- New enemies: knife-wielding guy (replaces seagull, same speed) and VW Golf (identical to Level 1 Golf)
- New death messages in Dutch for both enemy types
- Industrial docks / warehouse rooftop platform theme
- Red sky (`#fb2e01`) with muted olive-khaki silhouette (`#666547`)
- 5 Zuid-Rotterdam landmark collectibles with facts in Dutch
- No fences (Level 1 / Level 3 mechanics only — gaps and enemies as obstacles)

## Capabilities

### New Capabilities

- `zuid-rotterdam-level`: The full level descriptor, platform layout, enemy configuration, landmark collectibles, and death messages for the Zuid-Rotterdam level
- `knife-enemy`: New enemy type — a knife-wielding guy with the same patrol speed as the seagull (60 px/s) but a taller hitbox (24 × 30 px)

### Modified Capabilities

- `level-descriptor`: Level IDs must support a 3-level sequence; the existing Marathon level must be renumbered from id 2 → 3 (its `unlocked` logic and `resetEnemies` branch must update accordingly)

## Impact

- `game.js`: LEVELS array (insert new entry at index 1, renumber Marathon to id 3), `resetEnemies()` (add id === 2 branch, update id === 2 → 3 for Marathon), death message rendering (add `'knife'` and `'golf_zuid'` keys), enemy rendering (draw knife guy sprite)
- No new files, no new dependencies, no breaking API changes
