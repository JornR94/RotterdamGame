## ADDED Requirements

### Requirement: Single ground Y constant
The game SHALL define `const GROUND_Y = 400` as a module-scope constant in `game.js`. All ground-type platform entries in `level1Platforms` SHALL use `GROUND_Y` for their `y` property. No ground platform SHALL have a hardcoded `y` value of 370 or 400.

#### Scenario: All ground platforms share the same Y
- **WHEN** level1Platforms is defined
- **THEN** every entry with `type: 'ground'` has `y === GROUND_Y`

### Requirement: Ground and platforms use RETRO.mint
All platform entries in `level1Platforms` (both `type: 'ground'` and `type: 'platform'`) SHALL use `RETRO.mint` (`#6fcb9f`) as their `color` value.

#### Scenario: Ground platforms are mint colored
- **WHEN** the platforms are drawn
- **THEN** all ground segments render in `#6fcb9f`

#### Scenario: Jumpable platforms are mint colored
- **WHEN** the platforms are drawn
- **THEN** all non-ground platforms render in `#6fcb9f`

### Requirement: Enemies positioned on unified ground
Golf cars SHALL spawn at `y = GROUND_Y - 20` (car height = 20). Seagulls SHALL spawn at `y = GROUND_Y - 18` (seagull height = 18). Player SHALL spawn at `y = GROUND_Y - PLAYER_H`.

#### Scenario: Golf car top surface aligns with ground
- **WHEN** a golf car is spawned
- **THEN** its bottom edge (`y + h`) equals `GROUND_Y`

#### Scenario: Player starts on the ground
- **WHEN** the game starts
- **THEN** the player's bottom edge equals `GROUND_Y`
