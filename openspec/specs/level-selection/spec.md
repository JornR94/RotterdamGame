## ADDED Requirements

### Requirement: Level select screen is shown after start screen
The game SHALL transition to a `level_select` state when the player presses Space on the start screen, instead of starting a level directly.

#### Scenario: Start screen Space press
- **WHEN** the player presses Space on the start screen
- **THEN** the game transitions to the `level_select` state and the level select screen is rendered

### Requirement: Only unlocked levels are displayed
The level select screen SHALL display only levels with `unlocked: true`. Locked levels SHALL NOT appear.

#### Scenario: Locked level hidden
- **WHEN** a level has `unlocked: false`
- **THEN** that level does not appear on the level select screen

#### Scenario: Unlocked level visible
- **WHEN** a level has `unlocked: true`
- **THEN** that level appears as a card on the level select screen showing its name and per-level best score

### Requirement: Keyboard navigation between levels
The player SHALL navigate the level select screen using keyboard keys. `→` and `↓` move selection to the next level; `←` and `↑` move selection to the previous level. Navigation wraps around.

#### Scenario: Next level selection
- **WHEN** the player presses `→` or `↓` on the level select screen
- **THEN** the selection cursor moves to the next unlocked level (wrapping from last to first)

#### Scenario: Previous level selection
- **WHEN** the player presses `←` or `↑` on the level select screen
- **THEN** the selection cursor moves to the previous unlocked level (wrapping from first to last)

### Requirement: Space starts the selected level
Pressing Space on the level select screen SHALL start the currently selected level.

#### Scenario: Starting a level
- **WHEN** the player presses Space on the level select screen
- **THEN** `startGame()` is called with the selected level's id and the game transitions to `playing`

### Requirement: Win and game over return to level select
After a level ends (win or game over), pressing Space SHALL return to the level select screen rather than restarting the level.

#### Scenario: Return from game over
- **WHEN** the player presses Space on the game over screen
- **THEN** the game transitions to `level_select`

#### Scenario: Return from win
- **WHEN** the player presses Space on the win screen
- **THEN** the game transitions to `level_select`

### Requirement: Per-level high scores
Each level SHALL maintain its own best score stored in localStorage under the key `rotterdam-hs-<id>`. The level select screen SHALL display the best score for each visible level.

#### Scenario: Best score displayed on card
- **WHEN** the player views the level select screen
- **THEN** each level card shows the best score for that level (0 if never played)

#### Scenario: Best score saved on level end
- **WHEN** a level ends with a score higher than the stored best for that level
- **THEN** the new score is saved to `rotterdam-hs-<id>` in localStorage
