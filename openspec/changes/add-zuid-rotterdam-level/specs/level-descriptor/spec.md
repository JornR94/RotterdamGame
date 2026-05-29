## MODIFIED Requirements

### Requirement: Level data encapsulated in descriptor object
All level-specific data SHALL be contained in a single descriptor object within a `LEVELS` array. The array SHALL support three levels: id 1 (Landmarks), id 2 (Zuid-Rotterdam), id 3 (Marathon). Top-level globals for level data (`level1Platforms`, `LANDMARKS_DATA`, `EMPTY_STARS_DATA`, `finishFlag`, `LEVEL_W`) SHALL be removed.

#### Scenario: Level descriptor shape
- **WHEN** a level descriptor is defined
- **THEN** it SHALL contain: `id` (number), `name` (string), `description` (string), `unlocked` (boolean), `width` (number), `skyColor` (string) or `skyGradient` (array), `silhouetteColor` (string), `platforms` (array), `landmarks` (array), `emptyStars` (array), `finishFlag` (object)

### Requirement: Active level loaded from descriptor
`startGame(levelId)` SHALL look up the matching descriptor in `LEVELS` by id and store it as `currentLevel`. All game systems SHALL read geometry and theme from `currentLevel`.

#### Scenario: Game uses active level geometry
- **WHEN** a level starts with a given `levelId`
- **THEN** collision detection uses `currentLevel.platforms`, the finish flag uses `currentLevel.finishFlag`, and the level boundary uses `currentLevel.width`

### Requirement: Marathon level has id 3
The Marathon level descriptor SHALL use `id: 3`. The `resetEnemies()` branch for Marathon SHALL check `currentLevel.id === 3`. The unlock flow SHALL correctly chain Level 1 → Level 2 → Level 3 using `currentLevel.id + 1`.

#### Scenario: Completing Level 2 unlocks Marathon
- **WHEN** the player reaches the finish flag in Zuid-Rotterdam (id: 2)
- **THEN** the level with id 3 (Marathon) becomes unlocked
