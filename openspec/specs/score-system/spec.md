## ADDED Requirements

### Requirement: Score tracking
The game SHALL track a numeric score that increases when landmark collectibles are collected and when the level is completed.

#### Scenario: Score increases on collect
- **WHEN** the player collects a landmark item
- **THEN** the score increases by 100 points

#### Scenario: Score increases on level complete
- **WHEN** the player reaches the finish flag
- **THEN** a time bonus (remaining time * 10) is added to the score

### Requirement: High score persistence
The game SHALL store the all-time high score in localStorage and display it on the start and game-over screens.

#### Scenario: New high score saved
- **WHEN** the player's final score exceeds the stored high score
- **THEN** the new score is saved to localStorage under key `rotterdam-game-highscore`

#### Scenario: High score persists across sessions
- **WHEN** the player reopens the game
- **THEN** the previously saved high score is loaded and displayed
