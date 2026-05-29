## ADDED Requirements

### Requirement: Landmark collectibles
The level SHALL contain collectible star/coin objects placed near landmark representations. Collecting them awards points and displays a landmark fact.

#### Scenario: Player collects landmark item
- **WHEN** the player's bounding box overlaps a landmark collectible
- **THEN** the collectible disappears, points are awarded, and a fact popup appears

### Requirement: Landmark fact popup
A fact popup SHALL display for 3 seconds showing the landmark name and one educational fact (English).

#### Scenario: Fact popup appears and auto-dismisses
- **WHEN** a landmark collectible is collected
- **THEN** a styled popup box appears on screen with the landmark name and fact, then fades after 3 seconds

### Requirement: Rotterdam landmark database
The game SHALL include facts for at least 5 Rotterdam landmarks:
- **Erasmusbrug**: "The Erasmus Bridge (1996) is 802 metres long and is also known as 'The Swan'."
- **Euromast**: "The Euromast (185m) is the tallest building in Rotterdam, built in 1960."
- **Markthal**: "The Market Hall (2014) contains 228 apartments and the largest artwork in the Netherlands on its ceiling."
- **Kubuswoningen**: "The Cube Houses were designed by Piet Blom and are tilted at 45 degrees."
- **De Kuip**: "De Kuip (Stadion Feijenoord) has a capacity of 51,117 spectators."
- **Haven Rotterdam**: "The port of Rotterdam is the largest port in Europe."

#### Scenario: Each landmark has a unique fact
- **WHEN** the player collects any landmark collectible
- **THEN** the displayed fact is unique to that specific landmark
