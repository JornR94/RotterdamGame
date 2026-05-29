## ADDED Requirements

### Requirement: Fence obstacles exist in Level 2
Level 2 SHALL include fence obstacles stored as a `fences` array in the level descriptor. Each fence SHALL have properties `{ x, y, w: 8, h: 30 }` and be positioned at the near edge of each ground gap.

#### Scenario: Fences are placed before every gap
- **WHEN** Level 2 loads
- **THEN** at least one fence is present at the approach side of each of the 5 ground gaps

### Requirement: Fences are rendered as vertical barriers
The game SHALL render fences as thin vertical rectangles (brown/wooden colour `#8B4513`, with dark edge `#5C2E00`) sitting on the ground or platform surface at their specified position.

#### Scenario: Fence renders on screen
- **WHEN** a fence's world x position is within the camera view
- **THEN** a thin vertical brown rectangle is drawn at that position

### Requirement: Fence collision bounces player back without life loss
When the player's hitbox overlaps a fence horizontally, the game SHALL push the player back by the overlap amount and set horizontal velocity to zero. No life SHALL be deducted.

#### Scenario: Player runs into fence from the left
- **WHEN** the player moves right and overlaps a fence
- **THEN** the player is pushed left to the fence's left edge and stops moving right; no life is lost

#### Scenario: Player jumps over fence
- **WHEN** the player's bottom edge is above the fence's top edge while horizontally overlapping
- **THEN** no collision is detected and the player clears the fence freely

### Requirement: Fences only exist in Level 2
Level 1's level descriptor SHALL NOT include a `fences` array. Fence rendering and collision SHALL only execute when `currentLevel.fences` exists and is non-empty.

#### Scenario: No fences in Level 1
- **WHEN** Level 1 is playing
- **THEN** no fence rectangles are drawn and no fence collision checks run
