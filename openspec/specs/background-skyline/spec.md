## ADDED Requirements

### Requirement: Flat sky background
The game SHALL render the sky as a flat, solid fill of `#404040` (RETRO.olive) with no gradient. The fill SHALL cover the entire canvas from (0, 0) to (CANVAS_W, CANVAS_H), including the area below GROUND_Y. Gaps between ground platforms SHALL show this sky color (no separate background fill below ground level).

#### Scenario: Sky is flat dark grey
- **WHEN** the background is drawn
- **THEN** the full canvas is filled with a uniform `#404040` color and no color transitions are present

#### Scenario: Ground gaps show sky color
- **WHEN** the background is drawn and the camera is positioned over a gap between ground platforms
- **THEN** the gap area below GROUND_Y shows `#404040`, not a water or ground color

### Requirement: Pixelated Rotterdam skyline silhouette
The game SHALL render a parallax background skyline representing the Rotterdam skyline, drawn entirely in `#fb2e01` (RETRO.orange). The silhouette SHALL include:
- The Erasmus Bridge with an A-frame pylon (pixel-art tapering legs) and fanning stay cables
- A dense city skyline of varied-height rectangular buildings to the right of the bridge
- All shapes drawn using integer-snapped (pixel-perfect) coordinates
- Parallax scroll at 0.25× camera speed

#### Scenario: Skyline visible at game start
- **WHEN** the game begins and cameraX is 0
- **THEN** the Erasmus Bridge silhouette and city buildings are visible in the background

#### Scenario: Skyline parallax scrolls slower than foreground
- **WHEN** the player moves right and cameraX increases
- **THEN** the background skyline moves left at 0.25× the rate of foreground platforms

#### Scenario: All skyline pixels are orange-red
- **WHEN** the skyline silhouette is drawn
- **THEN** every pixel of the silhouette uses `#fb2e01` (no other colors appear in the silhouette shapes)
