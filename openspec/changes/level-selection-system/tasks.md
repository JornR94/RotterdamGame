## 1. Refactor Level Data into LEVELS Array

- [x] 1.1 Create a `LEVELS` constant as an array with one entry for the existing Rotterdam City level
- [x] 1.2 Move `level1Platforms` into `LEVELS[0].platforms`
- [x] 1.3 Move `LANDMARKS_DATA` into `LEVELS[0].landmarks`
- [x] 1.4 Move `EMPTY_STARS_DATA` into `LEVELS[0].emptyStars`
- [x] 1.5 Move `finishFlag` into `LEVELS[0].finishFlag`
- [x] 1.6 Add `width: CANVAS_W * 3.5` to `LEVELS[0]` and remove the global `LEVEL_W` constant
- [x] 1.7 Add `skyGradient: ['#1d3557', '#457b9d', '#a8dadc']` and `silhouetteColor: '#2d4a6e'` to `LEVELS[0]`
- [x] 1.8 Add `id`, `name`, `description`, and `unlocked: true` fields to `LEVELS[0]`
- [x] 1.9 Remove the now-redundant top-level globals (`level1Platforms`, `LANDMARKS_DATA`, `EMPTY_STARS_DATA`, `finishFlag`)

## 2. Introduce currentLevel and Update Game Systems

- [x] 2.1 Add `let currentLevel = null` to game state vars
- [x] 2.2 Update `startGame()` to accept a `levelId` parameter, look up the matching entry in `LEVELS`, and assign it to `currentLevel`
- [x] 2.3 Update `resetLandmarks()` to read from `currentLevel.landmarks` and `currentLevel.emptyStars`
- [x] 2.4 Update `update()` — replace `level1Platforms` reference with `currentLevel.platforms` and `LEVEL_W` with `currentLevel.width`
- [x] 2.5 Update `update()` — replace `finishFlag` reference with `currentLevel.finishFlag`
- [x] 2.6 Update `drawPlatforms()` to iterate `currentLevel.platforms`
- [x] 2.7 Update `drawFinishFlag()` to use `currentLevel.finishFlag`
- [x] 2.8 Update `drawBackground()` to use `currentLevel.skyGradient` for the 3-stop gradient and `currentLevel.silhouetteColor` for silhouette fills

## 3. Per-Level High Scores

- [x] 3.1 Replace `highScore` variable with `levelHighScores` object (`{}`)
- [x] 3.2 At startup, load all per-level high scores from localStorage (`rotterdam-hs-<id>`) into `levelHighScores`
- [x] 3.3 Update `saveHighScore()` to save to `rotterdam-hs-<currentLevel.id>` and update `levelHighScores[currentLevel.id]`
- [x] 3.4 Update HUD `drawHUD()` to display `levelHighScores[currentLevel.id]` as the best score

## 4. Level Select State and Screen

- [x] 4.1 Add `'level_select'` to the game state comment and add `let selectedLevelIndex = 0` to state vars
- [x] 4.2 Compute `unlockedLevels` as a filtered view of `LEVELS` (where `unlocked === true`) — derive this inside `drawLevelSelectScreen()` and the keydown handler
- [x] 4.3 Implement `drawLevelSelectScreen()` — draw the background gradient, a title, and one card per unlocked level showing its name and best score; highlight the selected card
- [x] 4.4 Update keydown handler: when `gameState === 'level_select'`, handle `ArrowRight`/`ArrowDown` (next, wrap), `ArrowLeft`/`ArrowUp` (previous, wrap), and `Space` (call `startGame` with selected level id)
- [x] 4.5 Update keydown handler: change `Space` on `'start'` state to set `gameState = 'level_select'` instead of calling `startGame()`
- [x] 4.6 Update keydown handler: change `Space` on `'gameover'` and `'win'` states to set `gameState = 'level_select'` instead of calling `startGame()`
- [x] 4.7 Add `level_select` case to `render()` calling `drawLevelSelectScreen()`
