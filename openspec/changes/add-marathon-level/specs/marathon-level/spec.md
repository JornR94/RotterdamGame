## ADDED Requirements

### Requirement: Level 2 Marathon world exists
The game SHALL include a second playable level with id `2`, name `"Marathon"`, description `"Run the 42km Rotterdam Marathon"`, and world width `3500` px matching Level 1.

#### Scenario: Level 2 appears in level select
- **WHEN** the player opens the level select screen after completing Level 1
- **THEN** Level 2 "Marathon" is shown as unlocked and selectable

#### Scenario: Level 2 starts locked
- **WHEN** the player opens the level select screen without having completed Level 1
- **THEN** Level 2 "Marathon" is shown as locked and not selectable

### Requirement: Marathon uses same background as Level 1
The marathon level SHALL reuse the same sky, silhouette, and bridge background rendering as Level 1 (`skyColor: RETRO.olive`, `silhouetteColor: RETRO.orange`).

#### Scenario: Background renders in Level 2
- **WHEN** Level 2 is playing
- **THEN** the sky, city silhouette, and Erasmus Bridge foreground are visible, identical to Level 1

### Requirement: Road sections are asphalt-coloured platforms close to ground
Elevated platforms in Level 2 SHALL be coloured asphalt grey (`#666`) and positioned at y values between `355` and `375` (close to `GROUND_Y = 400`), with white dashed lane markings rendered on their surface.

#### Scenario: Road section renders with lane markings
- **WHEN** Level 2 is playing and an elevated road section is on screen
- **THEN** the platform is drawn in `#666` with small white dashed rectangles along its top surface

### Requirement: Ground sections use asphalt colour
Ground-level sections in Level 2 SHALL use `#666` fill instead of `RETRO.mint`, with the same gap structure (5 gaps) as Level 1.

#### Scenario: Ground renders in asphalt colour
- **WHEN** Level 2 is playing
- **THEN** all ground platforms are drawn in `#666` (not green)

### Requirement: Finish flag is present
Level 2 SHALL include a finish flag at `x: 2980`, `y: 300` — identical position to Level 1 — drawn as a checkered flag.

#### Scenario: Finish flag triggers level complete
- **WHEN** the player reaches the finish flag in Level 2
- **THEN** the win state is triggered and Level 2 high score is saved
