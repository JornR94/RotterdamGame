## Context

Rotterdam Runner is a single-file vanilla JS platformer (`game.js`, 726 lines). All level data is currently hardcoded as top-level globals (`level1Platforms`, `LANDMARKS_DATA`, `EMPTY_STARS_DATA`, `finishFlag`, `LEVEL_W`). The game state machine has 5 states: `start → playing → paused/gameover/win`. There is one global high score in localStorage. No build step, no bundler — pure browser JS.

## Goals / Non-Goals

**Goals:**
- Introduce a `level_select` state between `start` and `playing`
- Refactor all level-specific data into a `LEVELS` array of descriptor objects
- Make `startGame()` data-driven: pull geometry, collectibles, and sky colors from the selected level descriptor
- Per-level high scores in localStorage
- Win and game over both return to level select
- `←`/`↑` = previous level, `→`/`↓` = next level, `Space` = start; locked levels hidden

**Non-Goals:**
- Adding a second level (just the structure to support it)
- Animated level card transitions or fancy UI
- Background silhouette shapes as level data (sky gradient only)
- Changing gameplay mechanics

## Decisions

**1. Level descriptor as a plain JS object array**

All level data lives in a `LEVELS` constant — an array of objects. Each object holds `id`, `name`, `description`, `unlocked`, `width`, `skyGradient` (3-stop array), `silhouetteColor`, `platforms`, `landmarks`, `emptyStars`, and `finishFlag`. This is a pure data refactor with no new abstractions — consistent with the game's no-framework ethos.

Alternative considered: keeping globals and adding a `loadLevel(id)` function that copies data into them. Rejected because it means two sources of truth and makes adding levels more error-prone.

**2. `currentLevel` as the active level descriptor reference**

`startGame(levelId)` finds the matching level in `LEVELS` and stores the whole object in `currentLevel`. All references in `update()` and draw functions change from named globals to `currentLevel.platforms`, `currentLevel.finishFlag`, etc. `LEVEL_W` becomes `currentLevel.width`.

**3. Sky gradient from descriptor; silhouettes stay hardcoded to level 1**

`drawBackground()` reads `currentLevel.skyGradient` for the 3-stop gradient and `currentLevel.silhouetteColor` for the silhouette fill. The silhouette shapes themselves remain the Rotterdam skyline (hardcoded). This is a deliberate scope boundary — custom silhouette shapes per level is future work.

**4. Per-level localStorage keys**

Keys follow the pattern `rotterdam-hs-<id>` (e.g., `rotterdam-hs-1`). At startup, all level high scores are loaded into a `levelHighScores` object keyed by level id. The old `rotterdam-game-highscore` key is abandoned (no migration needed — it's a game jam, not production data).

**5. Level select navigation with wrapping**

The `selectedLevelIndex` variable tracks the cursor. Only unlocked levels are shown; the `unlockedLevels` derived array is computed from `LEVELS` filtered by `unlocked: true`. Arrow navigation wraps around (last → first, first → last). `Space` in `level_select` state calls `startGame(unlockedLevels[selectedLevelIndex].id)`.

**6. Win and game over return to level select**

`Space` on the win and game over screens sets `gameState = 'level_select'` instead of calling `startGame()`. This keeps the level select as the canonical hub.

## Risks / Trade-offs

- **Old high score lost**: The `rotterdam-game-highscore` localStorage key is abandoned. Players who had a high score before will see 0. → Acceptable for a game jam context; a one-time migration read could be added trivially if needed.
- **Single visible level feels sparse**: With only one unlocked level, the level select screen might feel thin. → Mitigated by showing the level card with its best score, which gives the screen purpose even solo.
- **`Space` dual role**: `Space` is jump in-game and confirm on menus. The state gate (`if gameState !== 'playing' return` in update) prevents accidental jumps, but the keydown handler needs careful ordering. → Already the pattern used for start/gameover/win; no new risk introduced.
