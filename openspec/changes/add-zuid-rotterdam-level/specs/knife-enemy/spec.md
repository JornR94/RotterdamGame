## ADDED Requirements

### Requirement: Knife enemy type
The game SHALL support an enemy of `type: 'knife'`. It SHALL have a hitbox of `24 × 30 px` (taller than the seagull's `24 × 18`), patrol speed `vx: 60 px/s`, and award 30 points when stomped.

#### Scenario: Knife guy hitbox is taller
- **WHEN** a knife enemy is spawned
- **THEN** its height is 30 px (not 18 px like the seagull) making it easier to stomp but harder to dodge

#### Scenario: Knife guy can be stomped
- **WHEN** the player lands on top of a knife enemy with downward velocity
- **THEN** the enemy dies, the player bounces up at -300 px/s, and 30 points are awarded

#### Scenario: Knife guy kills player on side collision
- **WHEN** the player walks into a knife enemy from the side or collides from below
- **THEN** the player loses a life and the death message "Kan er ook nog wel bij vandaag." is shown

### Requirement: Knife enemy rendered visibly
The game draw loop SHALL render knife enemies as a distinct human-shaped figure (distinguishable from other enemy types). It SHALL use the existing enemy `type` switch pattern.

#### Scenario: Knife guy is visible on screen
- **WHEN** a knife enemy is in the camera viewport
- **THEN** it is drawn as a recognizable figure (not invisible or using another enemy's sprite)
