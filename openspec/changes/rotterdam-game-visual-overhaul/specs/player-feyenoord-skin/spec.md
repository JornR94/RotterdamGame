## ADDED Requirements

### Requirement: Player rendered as Feyenoord footballer
The player character SHALL be drawn as a 2D pixel-art footballer wearing a Feyenoord kit: red-and-white horizontally striped shirt, black shorts, white socks with a red top trim, and black boots. The player SHALL NOT wear a hat.

#### Scenario: Player has striped shirt
- **WHEN** the game renders the player
- **THEN** the shirt area SHALL alternate horizontal bands of `#e63946` (red) and `#f1faee` (white)

#### Scenario: Player has black shorts
- **WHEN** the game renders the player
- **THEN** the shorts area below the shirt SHALL be filled with `#212529`

#### Scenario: Player has boots
- **WHEN** the game renders the player
- **THEN** the boot/foot area at the bottom of each leg SHALL be filled with `#212529`

#### Scenario: Player facing direction is mirrored
- **WHEN** the player moves left
- **THEN** the entire sprite SHALL be horizontally mirrored (existing behaviour preserved)
