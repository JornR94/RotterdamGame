## ADDED Requirements

### Requirement: Checkered race finish flag
The game SHALL render the finish flag as a black-and-white checkered pattern (8 columns × 5 rows of 8×8px squares) attached to a thin dark pole. The flag SHALL be static (no animation). The pole SHALL extend from the flag's top Y to below the flag bottom.

#### Scenario: Flag displays checkered pattern
- **WHEN** the finish flag is drawn
- **THEN** a grid of alternating black (`#000000`) and white (`#ffffff`) squares is rendered where `(row + col) % 2 === 0` squares are black

#### Scenario: Flag is on a pole
- **WHEN** the finish flag is drawn
- **THEN** a vertical dark rectangle (pole) is drawn at the left edge of the flag, extending the full pole height

#### Scenario: Flag is only drawn when near the viewport
- **WHEN** the finish flag's screen X is less than -80 or greater than CANVAS_W + 80
- **THEN** the flag is not drawn
