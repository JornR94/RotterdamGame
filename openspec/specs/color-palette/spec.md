## ADDED Requirements

### Requirement: Game uses a defined 5-color Rotterdam palette exclusively
All colors used in the game's rendered output SHALL come from the following palette:
- `#e63946` — Red (Feyenoord, accents, enemies)
- `#457b9d` — Mid blue (sky mid, platforms)
- `#1d3557` — Dark blue (sky top, outlines, shorts)
- `#a8dadc` — Light blue (sky bottom, bridge, platforms)
- `#f1faee` — Off-white (shirt stripes, text, finish flag)

Supplementary neutrals permitted: `#212529` (near-black for boots/outlines), `#ffd700` (star gold — retained for collectible readability), `#f4a261` (skin tone — retained for character readability).

#### Scenario: Ground platforms use palette colors
- **WHEN** ground platforms are drawn
- **THEN** they SHALL use `#457b9d` or `#1d3557`, not the previous `#4a7c59` green

#### Scenario: Section platforms use palette colors
- **WHEN** section platforms (Euromast, Markthal, etc.) are drawn
- **THEN** they SHALL use colors from the approved palette (`#e63946`, `#a8dadc`, `#1d3557`) and NOT `#adb5bd`, `#6c757d`, `#e76f51`, or `#f4d35e`

#### Scenario: No unapproved colors appear in rendering
- **WHEN** any draw call is made during gameplay
- **THEN** no fill or stroke color SHALL be outside the approved palette and supplementary neutrals
