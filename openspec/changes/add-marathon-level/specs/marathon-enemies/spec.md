## ADDED Requirements

### Requirement: Banana enemies patrol Level 2 at seagull speed
Level 2 SHALL include banana enemies with speed `±60 px/s`, size `24×18`, worth `30` points on stomp, and death message `"Wie pleurt hier nou een banaan neer man!"`. Spawn positions and patrol ranges SHALL mirror the seagull positions from Level 1.

#### Scenario: Banana spawns at expected positions
- **WHEN** Level 2 starts
- **THEN** bananas appear at approximately x: 200, 700, 1700, and 2500 with the same patrol ranges as Level 1 seagulls

#### Scenario: Stomping a banana awards 30 points
- **WHEN** the player lands on top of a banana (overlap ≤ 12 px, falling velocity > 0)
- **THEN** the banana is removed, the player bounces at -300 px/s, and 30 points are awarded

#### Scenario: Running into a banana costs a life
- **WHEN** the player collides with a banana from the side or below
- **THEN** the player loses a life and the death message "Wie pleurt hier nou een banaan neer man!" is displayed

### Requirement: Banana sprite is a yellow crescent shape
The banana sprite SHALL be drawn procedurally as a pixelated yellow crescent (`#FFE135`) with brown tips (`#8B4513`) within a `24×18` bounding box using stacked `fillRect` calls.

#### Scenario: Banana renders as crescent
- **WHEN** a banana is on screen in Level 2
- **THEN** a yellow crescent shape with brown tips is drawn at the banana's position

### Requirement: Bicycle enemies patrol Level 2 at car speed
Level 2 SHALL include bicycle enemies with speed `±300 px/s`, size `36×20`, worth `50` points on stomp, and death message `"Waar heb jij leren fietsen joh?!"`. Spawn positions and patrol ranges SHALL mirror the VW Golf positions from Level 1.

#### Scenario: Bicycle spawns at expected positions
- **WHEN** Level 2 starts
- **THEN** bicycles appear at approximately x: 300, 1200, and 2100 with the same patrol ranges as Level 1 cars

#### Scenario: Stomping a bicycle awards 50 points
- **WHEN** the player lands on top of a bicycle (overlap ≤ 12 px, falling velocity > 0)
- **THEN** the bicycle is removed, the player bounces at -300 px/s, and 50 points are awarded

#### Scenario: Running into a bicycle costs a life
- **WHEN** the player collides with a bicycle from the side or below
- **THEN** the player loses a life and the death message "Waar heb jij leren fietsen joh?!" is displayed

### Requirement: Bicycle sprite shows two wheels and a frame
The bicycle sprite SHALL be drawn procedurally with two `arc()` wheel circles (radius ~7, colour `#222`), a grey triangular frame (`#444`), and a handlebar nub, within a `36×20` bounding box.

#### Scenario: Bicycle renders with recognisable shape
- **WHEN** a bicycle is on screen in Level 2
- **THEN** two wheel circles connected by a frame are drawn at the bicycle's position
