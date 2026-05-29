## ADDED Requirements

### Requirement: Stars rendered as proper 5-point star shapes
All collectible stars SHALL be drawn as proper 5-point star polygon shapes (not approximations). Stars SHALL be golden (`#ffd700`) and spin slowly using `animAngle`.

#### Scenario: Star is a 5-point polygon
- **WHEN** a star is rendered
- **THEN** it SHALL be drawn using a single `beginPath` with alternating outer (radius 14) and inner (radius 6) vertices at the correct angles, not by repeating rotated triangles

### Requirement: Mix of fact-bearing and empty stars
The game SHALL spawn both fact-bearing stars (6, one per landmark) and empty decorative stars (10, scattered across the level). The total star count SHALL be 16. The player SHALL NOT be able to predict which stars carry facts before collecting them.

#### Scenario: Collecting a fact star shows a popup
- **WHEN** the player collides with a star that has a `fact` property
- **THEN** a fact overlay SHALL appear and the player SHALL score 100 points

#### Scenario: Collecting an empty star gives points only
- **WHEN** the player collides with a star that has no `fact` property
- **THEN** NO popup SHALL appear and the player SHALL score 25 points

#### Scenario: Empty stars visually identical to fact stars
- **WHEN** the game renders uncollected stars
- **THEN** empty stars SHALL look identical to fact stars (same shape, color, size, spin)

### Requirement: Stars are smaller than enemies
All star collectibles SHALL have a hit radius of 14px, which is smaller than the player character width (24px).

#### Scenario: Star collision box
- **WHEN** checking star collection collision
- **THEN** the collision region SHALL be a 28×28px box centered on the star position
