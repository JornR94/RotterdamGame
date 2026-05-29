## ADDED Requirements

### Requirement: Stars use RETRO.gold color
All collectible stars (both fact stars in LANDMARKS_DATA and empty stars in EMPTY_STARS_DATA) SHALL be drawn using `RETRO.gold` (`#ffe28a`).

#### Scenario: Fact stars are gold
- **WHEN** a fact star is rendered
- **THEN** the star polygon fill color is `#ffe28a`

#### Scenario: Empty stars are gold
- **WHEN** an empty star is rendered
- **THEN** the star polygon fill color is `#ffe28a`

### Requirement: Stars maintain minimum clearance from ground gaps
No star (fact or empty) SHALL be positioned within 100px horizontally of any ground gap edge AND within 120px vertically of GROUND_Y simultaneously.

Ground gaps in level 1 exist at these X ranges: 600–650, 1050–1100, 1600–1650, 1950–2000.

#### Scenario: No star sits near a gap at ground level
- **WHEN** the level is initialized
- **THEN** no star has an X coordinate within 100px of a gap edge AND a Y coordinate greater than GROUND_Y - 120

#### Scenario: Stars above the danger zone are unaffected
- **WHEN** a star is positioned more than 120px above GROUND_Y
- **THEN** its horizontal position relative to gaps is unconstrained
