## Why

The game needs a significant visual and gameplay upgrade to feel polished, thematic, and engaging. Currently the player character has no identity, collectible stars are generic, facts interrupt gameplay, and there are no obstacles or landmark environments — making the game feel like a rough prototype rather than a Rotterdam-themed experience.

## What Changes

- Player character restyled as a Feyenoord footballer (red/white shirt, black shorts)
- Collectible stars replaced with actual star shapes using the defined color palette
- Additional non-fact stars added to create slot-machine randomness (most stars give no fact)
- Landmark facts relocated to a small, dismissing overlay in the top-left corner (fades out after a few seconds)
- Volkswagen Golf cars added as fast-moving enemies (jumpable to kill, Mario-style)
- Trash bags added as slow-moving ground enemies that move back and forth (jumpable to kill)
- Enemies are slightly smaller than the player character
- Erasmus Bridge implemented as a 2D landmark level environment (player walks along the top of the bridge)
- Full color palette updated to the Rotterdam palette: `#e63946`, `#457b9d`, `#1d3557`, `#a8dadc`, `#f1faee`

## Capabilities

### New Capabilities
- `player-feyenoord-skin`: Visual reskin of the main player character as a Feyenoord footballer
- `star-collectibles`: Redesigned star collectibles — real star shapes, mix of fact-bearing and empty stars
- `landmark-fact-overlay`: Non-blocking fact display in top-left corner that auto-fades
- `enemy-vw-golf`: Fast-moving Volkswagen Golf car enemies that can be stomped to kill
- `enemy-trash-bag`: Slow back-and-forth moving trash bag enemies that can be stomped to kill
- `erasmus-bridge-level`: Level 1 environment modelled as a 2D Erasmus Bridge walkway
- `color-palette`: Game-wide color palette update using the Rotterdam color scheme

### Modified Capabilities

(none — this is a new game with no prior specs)

## Impact

- Player sprite and animation code
- Star/collectible spawning logic and collision
- UI/HUD layer (new fact overlay component)
- Enemy spawning, movement AI, and stomp-kill collision
- Level 1 tilemap / environment art and layout
- Global CSS/theme variables or color constants
