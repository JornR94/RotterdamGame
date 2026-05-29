## ADDED Requirements

### Requirement: Jump sound effect
The game SHALL play a short ascending blip sound when the player jumps, generated via Web Audio API.

#### Scenario: Jump sound plays on jump
- **WHEN** the player presses jump and leaves the ground
- **THEN** a short synthesized blip sound plays immediately

### Requirement: Collect sound effect
The game SHALL play a cheerful chime sound when the player collects a landmark item.

#### Scenario: Collect sound plays on pickup
- **WHEN** the player collects a landmark collectible
- **THEN** a short ascending arpeggio sound plays

### Requirement: Background music
The game SHALL play a looping chiptune background track during gameplay, generated via Web Audio API.

#### Scenario: Music starts on first input
- **WHEN** the player presses any key for the first time
- **THEN** background music begins playing in a loop (workaround for browser autoplay policy)

#### Scenario: Music loops seamlessly
- **WHEN** the background music track ends
- **THEN** it restarts immediately without a gap

### Requirement: Game over sound
The game SHALL play a descending "wah-wah" sound on game over.

#### Scenario: Game over sound plays
- **WHEN** the player loses their last life
- **THEN** a descending sound effect plays before showing the game-over screen
