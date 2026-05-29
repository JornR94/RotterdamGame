## MODIFIED Requirements

### Requirement: Enemy spawning is level-aware
`resetEnemies()` SHALL spawn the correct set of enemies based on `currentLevel.id`. For Level 1 it SHALL spawn seagulls and VW Golf cars (existing behaviour). For Level 2 it SHALL spawn bananas and bicycles with identical patrol structures.

#### Scenario: Level 1 spawns seagulls and cars
- **WHEN** Level 1 starts or resets
- **THEN** `enemies` array contains seagull and golf-car objects at their original positions

#### Scenario: Level 2 spawns bananas and bicycles
- **WHEN** Level 2 starts or resets
- **THEN** `enemies` array contains banana and bicycle objects at the mirrored positions

#### Scenario: No cross-level enemy bleed
- **WHEN** the player switches from Level 1 to Level 2 (or vice versa)
- **THEN** `resetEnemies()` is called and only enemies for the current level are present
