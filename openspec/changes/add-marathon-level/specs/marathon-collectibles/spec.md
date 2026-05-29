## ADDED Requirements

### Requirement: Water cups replace empty stars in Level 2
In Level 2, bonus collectibles (no popup) SHALL be rendered as water cups instead of spinning gold stars. Each awards `25` points on collection. The data shape is identical to empty stars (`x`, `y`, `collected`).

#### Scenario: Water cup renders in Level 2
- **WHEN** a bonus collectible is on screen in Level 2
- **THEN** a white trapezoid cup shape with a blue stripe is drawn (not a spinning star)

#### Scenario: Collecting a water cup awards 25 points
- **WHEN** the player's hitbox overlaps a water cup
- **THEN** the cup disappears and 25 points are added to the score

### Requirement: Medal collectibles replace fact stars in Level 2
In Level 2, fact collectibles (with popup) SHALL be rendered as medals instead of spinning gold stars. Each awards `100` points and triggers a fact popup. The data shape is identical to fact stars (`x`, `y`, `collected`, `text`).

#### Scenario: Medal renders in Level 2
- **WHEN** a fact collectible is on screen in Level 2
- **THEN** a gold circle with a red ribbon below is drawn (not a spinning star)

#### Scenario: Collecting a medal awards 100 points and shows a fact
- **WHEN** the player's hitbox overlaps a medal
- **THEN** the medal disappears, 100 points are added, and the associated marathon fact is displayed as a popup overlay

### Requirement: 5 marathon facts are defined
Level 2 SHALL include exactly 5 medal collectibles, each with the following Dutch-language facts in order:
1. `"De marathon werd voor het eerst georganiseerd in Rotterdam in 1981."`
2. `"Het parcours is vlak en snel, waardoor veel lopers hier hun persoonlijk record lopen."`
3. `"Rick Slot liep de Rotterdam marathon in 2:49:29 (lekker gap!)"`
4. `"De race begint bij de iconische Erasmusbrug."`
5. `"Het is qua omvang en publiek één van de grootste sportevents van het land."`

#### Scenario: All 5 facts are collectable
- **WHEN** the player collects each of the 5 medals in Level 2
- **THEN** each corresponding fact text is shown in the popup overlay

### Requirement: Star rendering is unchanged in Level 1
In Level 1, fact stars and empty stars SHALL continue to render as spinning gold stars — no change to existing behaviour.

#### Scenario: Stars render normally in Level 1
- **WHEN** Level 1 is playing
- **THEN** collectibles are drawn as spinning gold star shapes, not as medals or cups
