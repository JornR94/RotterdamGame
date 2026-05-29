## MODIFIED Requirements

### Requirement: Background music
The game SHALL play a looping NES-style chiptune arrangement of the "Hand in Hand, Kameraden" opening hook during gameplay, generated via Web Audio API at ~140 BPM.

#### Scenario: Music starts on first input
- **WHEN** the player presses any key for the first time
- **THEN** background music begins playing in a loop (workaround for browser autoplay policy)

#### Scenario: Music loops seamlessly
- **WHEN** the background music pattern reaches its end
- **THEN** it restarts immediately without a gap

#### Scenario: Music is the Feyenoord anthem hook
- **WHEN** background music is playing
- **THEN** the melody is recognizable as "Hand in Hand, Kameraden" and not a generic scale
