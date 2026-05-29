## ADDED Requirements

### Requirement: Level 1 - Rotterdam skyline tour
The game SHALL include at least one complete level featuring platforms and backdrops themed around Rotterdam landmarks: Erasmusbrug, Markthal, Euromast, De Kuip, Cube Houses (Kubuswoningen), and the Port of Rotterdam.

#### Scenario: Level has a start and finish
- **WHEN** the player starts level 1
- **THEN** the player spawns on the left and must reach a finish flag on the right

#### Scenario: Level is wider than the viewport
- **WHEN** the level loads
- **THEN** the total level width is at least 3x the canvas width, requiring horizontal scrolling

### Requirement: Platform variety
Levels SHALL include ground-level platforms, elevated platforms, and landmark-shaped platforms (e.g., a bridge cable, a market hall arch).

#### Scenario: Platforms at varying heights
- **WHEN** the player progresses through the level
- **THEN** they encounter platforms at different heights requiring jumping

### Requirement: Background art
Each level SHALL have a layered background depicting the Rotterdam skyline in retro pixel art style.

#### Scenario: Background is visible behind platforms
- **WHEN** the game renders a frame
- **THEN** the background layer renders behind all platforms and the player

### Requirement: Finish condition
Reaching the end flag of a level SHALL trigger a level-complete screen and advance to the next level (or win screen if it's the last level).

#### Scenario: Player reaches end flag
- **WHEN** the player touches the finish flag object
- **THEN** the level-complete animation plays and progress is saved to localStorage
