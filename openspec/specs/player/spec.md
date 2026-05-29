## ADDED Requirements

### Requirement: Player movement
The player SHALL move left and right using arrow keys at a fixed speed, with smooth acceleration/deceleration.

#### Scenario: Player moves right
- **WHEN** the right arrow key is held
- **THEN** the player moves to the right at walk speed

#### Scenario: Player stops at level start boundary
- **WHEN** the player reaches x=0
- **THEN** the player cannot move further left

### Requirement: Player jump
The player SHALL jump when the space bar or up arrow is pressed, but only when standing on a surface.

#### Scenario: Player jumps from ground
- **WHEN** the player is on a platform and presses space
- **THEN** the player launches upward with an initial velocity

#### Scenario: Player cannot double-jump
- **WHEN** the player is mid-air and presses space again
- **THEN** nothing happens

### Requirement: Player lives
The player SHALL start with 3 lives. Falling below the bottom of the screen costs one life and respawns the player at the level start.

#### Scenario: Player falls off screen
- **WHEN** the player's y position exceeds the canvas height
- **THEN** one life is deducted and the player is repositioned at the start

#### Scenario: Game over on zero lives
- **WHEN** the player loses their last life
- **THEN** the game-over screen is shown

### Requirement: Player visual representation
The player SHALL be rendered as a pixel-art character (simple colored rectangles forming a humanoid shape in retro style).

#### Scenario: Player faces direction of movement
- **WHEN** the player moves right
- **THEN** the player sprite faces right

#### Scenario: Player has idle animation
- **WHEN** the player is standing still
- **THEN** a simple idle animation plays (e.g., bobbing)
