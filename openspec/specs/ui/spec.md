## ADDED Requirements

### Requirement: Start screen
The game SHALL display a start screen with the game title, high score, a "Press SPACE to start" prompt in retro pixel font style, and a language toggle (see `i18n` spec).

#### Scenario: Start screen shown on load
- **WHEN** the page loads
- **THEN** the start screen is displayed with title art, high score, and instructions

#### Scenario: Game starts on space press
- **WHEN** the player presses SPACE on the start screen
- **THEN** level 1 begins

### Requirement: HUD (heads-up display)
During gameplay, the game SHALL display score, lives remaining, and current level number overlaid on the canvas in retro style.

#### Scenario: HUD updates in real time
- **WHEN** the player collects an item or loses a life
- **THEN** the HUD immediately reflects the new score/lives

### Requirement: Game-over screen
The game SHALL show a game-over screen when all lives are lost, displaying the final score, high score, and a "Press SPACE to retry" prompt.

#### Scenario: Game-over screen on zero lives
- **WHEN** the player loses their last life
- **THEN** the game-over screen appears with score summary

#### Scenario: Retry restarts the game
- **WHEN** the player presses SPACE on the game-over screen
- **THEN** the game resets to level 1 with full lives and zero score

### Requirement: Win screen
The game SHALL show a win screen when all levels are completed, celebrating the player with score and high score.

#### Scenario: Win screen on level completion
- **WHEN** the player completes the final level
- **THEN** a congratulations screen is shown with final score and new high score if applicable

### Requirement: Pause functionality
The game SHALL pause when Escape is pressed during gameplay and resume when Escape is pressed again.

#### Scenario: Escape pauses game
- **WHEN** the player presses Escape during gameplay
- **THEN** the game loop pauses and a "PAUSED" overlay is shown
