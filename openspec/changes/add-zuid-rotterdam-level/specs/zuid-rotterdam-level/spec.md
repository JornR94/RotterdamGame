## ADDED Requirements

### Requirement: Zuid-Rotterdam level descriptor exists
The LEVELS array SHALL contain a descriptor with `id: 2`, `name: 'Zuid-Rotterdam'`, and `description: 'Try to survive this neighborhood'`. It SHALL be positioned after Level 1 (Landmarks) and before Level 3 (Marathon) in the array.

#### Scenario: Level appears in level select
- **WHEN** the player opens the level select screen
- **THEN** a card for Zuid-Rotterdam is shown between Landmarks and Marathon, locked until Level 1 is completed

### Requirement: Zuid-Rotterdam visual theme
The level SHALL use `skyColor: '#fb2e01'` and `silhouetteColor: '#666547'`. Ground and platform colors SHALL be `'#444'` (dark concrete).

#### Scenario: Red sky renders
- **WHEN** Zuid-Rotterdam is the active level
- **THEN** the sky fills with `#fb2e01` and the skyline silhouette renders in `#666547`

### Requirement: Zuid-Rotterdam platform layout — industrial docks
The level SHALL have `width: 3500`. Ground SHALL be split into 5 segments with 4 gaps (matching Level 1 gap positions). Elevated platforms SHALL represent flat warehouse rooftops and narrow dock walkways. No fences.

#### Scenario: Ground gaps force jumps
- **WHEN** the player walks forward at ground level
- **THEN** they encounter gaps at approximately x:600, x:1050, x:1600, x:1950 requiring jumps to cross

#### Scenario: Elevated platforms reachable by jump
- **WHEN** the player jumps toward a warehouse rooftop platform
- **THEN** they can land on it and use it to traverse the gap or collect stars above

### Requirement: Zuid-Rotterdam landmarks (5 collectibles)
The level SHALL have exactly 5 landmark collectibles worth 100 pts each, each triggering a fact popup with a Dutch fact. The facts SHALL be:

1. x≈300 — "Chaos op straat": "Scooters en auto's bepalen hier hun eigen verkeersregels."
2. x≈800 — "Nieuwe Maas": "Rotterdam Zuid ligt ten zuiden van de Nieuwe Maas."
3. x≈1300 — "Haven-mentaliteit": "Het gebied is sterk gevormd door de haven en industrie, met een echte 'niet lullen maar poetsen'-mentaliteit."
4. x≈1800 — "Afrikaandermarkt": "De Afrikaandermarkt is super bekend en trekt bezoekers uit heel Rotterdam (en daarbuiten)."
5. x≈2480 — "Rotterdam Ahoy": "Grote evenementen, concerten en beurzen vinden plaats in Rotterdam Ahoy."

#### Scenario: Player collects landmark star
- **WHEN** the player touches a landmark collectible
- **THEN** 100 points are awarded and the Dutch fact popup appears

### Requirement: Zuid-Rotterdam enemies — knife guy and VW Golf
The level SHALL spawn 4 knife-guy enemies and 3 VW Golf enemies at the same patrol zones as their Level 1 counterparts (seagull zones and Golf zones respectively).

#### Scenario: Knife guy patrols at seagull speed
- **WHEN** Zuid-Rotterdam starts
- **THEN** 4 knife guys patrol with `vx: 60` within the same `patrolMin`/`patrolMax` ranges as Level 1 seagulls

#### Scenario: VW Golf patrols at car speed
- **WHEN** Zuid-Rotterdam starts
- **THEN** 3 VW Golfs patrol with `vx: 300` within the same `patrolMin`/`patrolMax` ranges as Level 1 Golf cars

### Requirement: Zuid-Rotterdam death messages
When the player is killed by a knife guy the death message SHALL be "Kan er ook nog wel bij vandaag." When killed by a Golf in Zuid-Rotterdam the message SHALL be "Rustig met dat Golfje van je, gek!"

#### Scenario: Knife guy kills player
- **WHEN** the player collides with a knife guy from the side or below
- **THEN** the death screen shows "Kan er ook nog wel bij vandaag."

#### Scenario: Golf kills player in Level 2
- **WHEN** the player collides with a VW Golf in Zuid-Rotterdam from the side or below
- **THEN** the death screen shows "Rustig met dat Golfje van je, gek!"
