## ADDED Requirements

### Requirement: Volkswagen Golf cars as fast horizontal enemies
The game SHALL spawn Volkswagen Golf car enemies that move horizontally at high speed. Cars SHALL be rendered as recognisable 2D side-view cars using canvas drawing primitives. Cars SHALL be slightly smaller than the player (width ≈ 36px, height ≈ 20px vs player 24×36).

#### Scenario: Cars move fast horizontally
- **WHEN** a Golf car is alive
- **THEN** it SHALL move horizontally at ≥300 px/s, significantly faster than the player walk speed (220 px/s)

#### Scenario: Cars reverse direction at level bounds or platform edges
- **WHEN** a Golf car reaches the edge of a ground platform or the level boundary
- **THEN** it SHALL reverse horizontal direction

#### Scenario: Stomping kills the car
- **WHEN** the player lands on top of a Golf car (player bottom ≤ 12px overlap with car top, player `vy > 0`)
- **THEN** the car SHALL be marked dead, the player SHALL receive an upward velocity bounce of ~200 px/s, and the player SHALL score 50 points

#### Scenario: Side or bottom collision hurts the player
- **WHEN** the player touches a Golf car from the side or from below while the car is alive
- **THEN** the player SHALL lose one life (same effect as falling off the level)

#### Scenario: Dead cars are removed from the scene
- **WHEN** a Golf car has been stomped
- **THEN** it SHALL no longer be rendered or cause collisions

### Requirement: Cars are visually smaller than the player
Golf car sprites SHALL have a bounding box no larger than 36×20px, making them clearly smaller than the player's 24×36px bounding box when viewed side by side.

#### Scenario: Car bounding box
- **WHEN** the car is drawn
- **THEN** it fits within a 36px wide × 20px tall rectangle
