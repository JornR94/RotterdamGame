## ADDED Requirements

### Requirement: Level 1 visually represents the Erasmus Bridge
The level 1 environment SHALL be drawn to resemble the Erasmus Bridge — the player walks along the top deck of the bridge. The background and foreground SHALL include a recognisable A-frame pylon and stay cables rendered using canvas primitives.

#### Scenario: Bridge deck is the walkable surface
- **WHEN** the player is in level 1
- **THEN** the primary ground platform (y≈370, spanning the first ~900px) SHALL visually represent the bridge road deck, drawn in a concrete/grey colour from the approved palette (`#a8dadc` or `#1d3557`)

#### Scenario: Pylon is drawn in the scene
- **WHEN** the player is near x≈400 in level 1
- **THEN** a tall A-frame pylon SHALL be visible rising above the deck, drawn using filled polygon or rects in `#a8dadc`

#### Scenario: Stay cables are drawn
- **WHEN** the pylon is on screen
- **THEN** diagonal stay cables SHALL be drawn as lines from the pylon top down to anchor points on the deck, using a contrasting palette colour

#### Scenario: Background sky matches Rotterdam palette
- **WHEN** any part of level 1 is rendered
- **THEN** the sky gradient SHALL use only palette colours `#1d3557` (top) through `#457b9d` to `#a8dadc` (bottom)

### Requirement: Platform collision geometry matches bridge shape
The collision platforms for the bridge section SHALL be updated so that the walkable top deck aligns with the visual bridge deck surface.

#### Scenario: Player lands on bridge deck
- **WHEN** the player falls onto the bridge area
- **THEN** the player SHALL land at the same y-coordinate as the top edge of the drawn bridge deck rectangle
