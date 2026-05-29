## Why

The game currently skips straight from the start screen into the single level, with no way to support multiple levels. Adding a level selection screen now — while the codebase is small — creates the extensible foundation needed to add future levels without structural rework.

## What Changes

- A new `'level_select'` game state is introduced between `'start'` and `'playing'`
- All level-specific data (platforms, landmarks, stars, finish flag, level width, sky gradient) is refactored into a `LEVELS` array of level descriptor objects
- `startGame()` becomes parameterized, accepting a level id and pulling data from the matching descriptor
- `drawBackground()` reads sky gradient colors from the active level descriptor instead of hardcoded values
- Per-level high scores replace the single global high score (`rotterdam-hs-<id>` localStorage keys)
- Win and game over screens return to level select instead of restarting the same level
- Locked levels are hidden from the level select screen entirely
- `←`/`↑` navigate to the previous level; `→`/`↓` navigate to the next level; `Space` starts the selected level

## Capabilities

### New Capabilities

- `level-selection`: A level select screen that displays all unlocked levels, shows per-level best scores, and allows keyboard navigation before starting a level
- `level-descriptor`: A data structure that encapsulates all level-specific configuration (geometry, collectibles, visual theme) in one place, enabling new levels to be added purely as data

### Modified Capabilities

- (none — no existing specs are affected)

## Impact

- `game.js`: Level data section refactored; `startGame()`, `update()`, `drawBackground()`, `drawPlatforms()`, `drawFinishFlag()`, `saveHighScore()`, `render()`, and keydown handler all updated
- `localStorage`: Key schema changes from single `rotterdam-game-highscore` to per-level `rotterdam-hs-<id>`
- No new files; no external dependencies
