## ADDED Requirements

### Requirement: Landmark collectibles
The level SHALL contain collectible star/coin objects placed near landmark representations. Collecting them awards points and displays a landmark fact.

#### Scenario: Player collects landmark item
- **WHEN** the player's bounding box overlaps a landmark collectible
- **THEN** the collectible disappears, points are awarded, and a fact popup appears

### Requirement: Landmark fact popup
A fact popup SHALL display for 3 seconds showing the landmark name and one educational fact (in Dutch or English).

#### Scenario: Fact popup appears and auto-dismisses
- **WHEN** a landmark collectible is collected
- **THEN** a styled popup box appears on screen with the landmark name and fact, then fades after 3 seconds

### Requirement: Rotterdam landmark database
The game SHALL include facts for at least 5 Rotterdam landmarks:
- **Erasmusbrug**: "De Erasmusbrug (1996) is 802 meter lang en wordt ook wel 'De Zwaan' genoemd."
- **Euromast**: "De Euromast (185m) is het hoogste gebouw van Rotterdam, gebouwd in 1960."
- **Markthal**: "De Markthal (2014) bevat 228 woningen en het grootste kunstwerk van Nederland aan het plafond."
- **Kubuswoningen**: "De Kubuswoningen zijn ontworpen door Piet Blom en staan op 45 graden gekanteld."
- **De Kuip**: "De Kuip (Stadion Feijenoord, 1937) heeft een capaciteit van 51.117 toeschouwers."
- **Haven Rotterdam**: "De haven van Rotterdam is de grootste haven van Europa en verwerkt 470 miljoen ton lading per jaar."

#### Scenario: Each landmark has a unique fact
- **WHEN** the player collects any landmark collectible
- **THEN** the displayed fact is unique to that specific landmark
