## Why

The game's visuals lacked a coherent color identity, with mismatched platform colors, a plain background, and inconsistent ground levels creating a pseudo-3D feel. A unified retro color palette and polished background skyline are needed to give Rotterdam Runner a distinctive, consistent look.

## What Changes

- Introduce a `RETRO` color palette constant (`#666547`, `#fb2e01`, `#6fcb9f`, `#ffe28a`, `#fffeb3`) alongside the existing `PAL`
- Sky background changed to flat `#666547` (no gradient)
- Background skyline silhouette rendered in `#fb2e01` (orange-red), pixel-art style with Rotterdam landmarks (Erasmus Bridge, dense city towers)
- All jumpable platforms unified to a single color: `#6fcb9f` (mint)
- Ground segments unified to a single Y coordinate (`GROUND_Y = 400`) and color `#6fcb9f`
- Stars (collectibles) colored `#ffe28a` (golden yellow)
- Finish flag replaced with a black-and-white checkered race flag on a pole
- Stars repositioned to never appear within 100px of a ground gap edge
- Enemies (golf car, seagull) and player sprite left unchanged

## Capabilities

### New Capabilities
- `retro-palette`: A named RETRO color constant object used across all visual elements for consistent styling
- `background-skyline`: Pixelated parallax Rotterdam skyline silhouette drawn in the background layer
- `unified-ground`: Single ground Y level across all ground segments; all ground and platform coloring unified
- `checkered-finish-flag`: Black-and-white checkered race flag on a pole replacing the old red wavy flag
- `star-gap-safety`: Stars placed with minimum clearance from ground gaps

### Modified Capabilities

## Impact

- `game.js`: All visual constants and drawing functions affected
- No gameplay logic changes — collision, scoring, and enemy behavior unchanged
- No external dependencies added
