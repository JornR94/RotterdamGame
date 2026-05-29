## ADDED Requirements

### Requirement: Trash bags as slow ground enemies
The game SHALL spawn trash bag enemies on ground platforms. Trash bags SHALL move slowly back and forth on the ground. They SHALL be rendered as simple black/dark garbage bag shapes using canvas primitives. Size SHALL be slightly smaller than the player (≈20×22px vs player 24×36).

#### Scenario: Trash bags move slowly back and forth
- **WHEN** a trash bag is alive
- **THEN** it SHALL oscillate horizontally at ≤80 px/s, reversing direction when it reaches a platform edge or defined patrol boundary

#### Scenario: Stomping kills the trash bag
- **WHEN** the player lands on top of a trash bag (player bottom ≤ 12px overlap with bag top, player `vy > 0`)
- **THEN** the bag SHALL be marked dead, the player SHALL receive an upward velocity bounce of ~200 px/s, and the player SHALL score 30 points

#### Scenario: Side collision hurts the player
- **WHEN** the player touches a trash bag from the side while it is alive
- **THEN** the player SHALL lose one life

#### Scenario: Dead trash bags are removed from the scene
- **WHEN** a trash bag has been stomped
- **THEN** it SHALL no longer be rendered or cause collisions

### Requirement: Trash bags are visually smaller than the player
Trash bag sprites SHALL have a bounding box of approximately 20×22px, clearly smaller than the player's 24×36px bounding box.

#### Scenario: Trash bag bounding box
- **WHEN** the trash bag is drawn
- **THEN** it fits within a 20px wide × 22px tall rectangle
