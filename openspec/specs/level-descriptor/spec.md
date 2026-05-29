## ADDED Requirements

### Requirement: Level data encapsulated in descriptor object
All level-specific data SHALL be contained in a single descriptor object within a `LEVELS` array. Top-level globals for level data (`level1Platforms`, `LANDMARKS_DATA`, `EMPTY_STARS_DATA`, `finishFlag`, `LEVEL_W`) SHALL be removed.

#### Scenario: Level descriptor shape
- **WHEN** a level descriptor is defined
- **THEN** it SHALL contain: `id` (number), `name` (string), `description` (string), `unlocked` (boolean), `width` (number), `skyGradient` (array of 3 color strings), `silhouetteColor` (string), `platforms` (array), `landmarks` (array), `emptyStars` (array), `finishFlag` (object)

### Requirement: Active level loaded from descriptor
`startGame(levelId)` SHALL look up the matching descriptor in `LEVELS` by id and store it as `currentLevel`. All game systems SHALL read geometry and theme from `currentLevel`.

#### Scenario: Game uses active level geometry
- **WHEN** a level starts with a given `levelId`
- **THEN** collision detection uses `currentLevel.platforms`, the finish flag uses `currentLevel.finishFlag`, and the level boundary uses `currentLevel.width`

### Requirement: Sky gradient read from descriptor
`drawBackground()` SHALL use the `skyGradient` array from `currentLevel` to define the 3-stop linear gradient (top, middle, bottom). It SHALL use `silhouetteColor` for background silhouette fills.

#### Scenario: Custom sky gradient applied
- **WHEN** a level defines `skyGradient: ['#111', '#555', '#aaa']`
- **THEN** `drawBackground()` renders that gradient from top to bottom of the canvas
