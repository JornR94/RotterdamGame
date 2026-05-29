## ADDED Requirements

### Requirement: Game loop runs at 60fps
The game engine SHALL use `requestAnimationFrame` to drive a game loop targeting 60fps with delta-time based updates.

#### Scenario: Loop runs continuously
- **WHEN** the game is started
- **THEN** the game loop runs every frame via requestAnimationFrame until the game ends

#### Scenario: Delta time limits large jumps
- **WHEN** a frame takes longer than expected (tab was hidden)
- **THEN** delta time is capped at 100ms to prevent physics tunneling

### Requirement: Canvas rendering
The game SHALL render all game elements to an HTML5 Canvas element sized to 800x450 (16:9) with pixelated rendering.

#### Scenario: Canvas is fullscreen-friendly
- **WHEN** the game loads
- **THEN** the canvas is centered in the viewport and scales to fit while preserving aspect ratio

### Requirement: Keyboard input handling
The engine SHALL track pressed keys for left arrow, right arrow, space/up arrow for jump, and Escape for pause.

#### Scenario: Key held down moves player continuously
- **WHEN** the player holds the right arrow key
- **THEN** the player moves right every frame until the key is released

### Requirement: Collision detection
The engine SHALL provide AABB (axis-aligned bounding box) collision detection between the player and platforms.

#### Scenario: Player lands on platform
- **WHEN** the player falls onto the top surface of a platform
- **THEN** the player stops falling and stands on the platform

#### Scenario: Player hits platform from below
- **WHEN** the player jumps into the bottom of a platform
- **THEN** the player bounces back down

### Requirement: Gravity
The engine SHALL apply constant downward gravity to the player each frame.

#### Scenario: Player falls off platform edge
- **WHEN** the player walks off the edge of a platform
- **THEN** the player accelerates downward due to gravity

### Requirement: Camera follows player
The engine SHALL scroll the level horizontally to keep the player centered when the level is wider than the viewport.

#### Scenario: Level scrolls with player
- **WHEN** the player moves right past the center of the screen
- **THEN** the camera scrolls right to keep the player in view
