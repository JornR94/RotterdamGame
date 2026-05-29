## 1. Renumber Marathon to Level 3

- [x] 1.1 In the `LEVELS` array, change the Marathon descriptor's `id` from `2` to `3`
- [x] 1.2 In `resetEnemies()`, change the `currentLevel.id === 2` branch condition to `currentLevel.id === 3`
- [x] 1.3 Verify no other hardcoded `=== 2` or `id: 2` references remain that target Marathon

## 2. Add Zuid-Rotterdam Level Descriptor

- [x] 2.1 Insert a new level descriptor object at index 1 of the `LEVELS` array (after Landmarks, before Marathon) with `id: 2`, `name: 'Zuid-Rotterdam'`, `description: 'Try to survive this neighborhood'`, `unlocked: false`, `width: 3500`, `skyColor: '#fb2e01'`, `silhouetteColor: '#666547'`
- [x] 2.2 Add 5 ground platform segments matching Level 1 gap structure, using color `'#444'`
- [x] 2.3 Add elevated platforms representing flat warehouse rooftops and narrow dock walkways, using color `'#444'`
- [x] 2.4 Add `finishFlag: { x: 2980, y: 300, w: 20, h: 100 }`
- [x] 2.5 Add 5 landmark collectibles with Dutch facts (Chaos op straat, Nieuwe Maas, Haven-mentaliteit, Afrikaandermarkt, Rotterdam Ahoy) at appropriate x positions
- [x] 2.6 Add empty star collectibles (aim for ~8, placed away from gaps and enemies)

## 3. Add Knife Enemy Type

- [x] 3.1 In `resetEnemies()`, add an `if (currentLevel.id === 2)` branch that spawns 4 knife enemies (`type: 'knife'`, `w: 24`, `h: 30`, `vx: 60`, `points: 30`, `deathMsg: 'knife'`) at the same patrol zones as Level 1 seagulls
- [x] 3.2 In the same branch, spawn 3 VW Golf enemies (`type: 'golf'`, `w: 36`, `h: 20`, `vx: 300`, `points: 50`, `deathMsg: 'golf_Zuid'`) at the same patrol zones as Level 1 Golf cars
- [x] 3.3 In the enemy draw loop, add a `case 'knife':` branch that renders a recognizable human-shaped figure (head circle, body rect, arm holding a knife)

## 4. Register Death Messages

- [x] 4.1 Add a `'knife'` entry to the death message lookup with text `"Kan er ook nog wel bij vandaag."`
- [x] 4.2 Add a `'golf_Zuid'` entry to the death message lookup with text `"Rustig met dat Golfje van je, gek!"`

## 5. Verify End-to-End

- [x] 5.1 Play through Level 1 and confirm it unlocks Level 2 (Zuid-Rotterdam)
- [x] 5.2 Play through Level 2 and confirm knife guys and VW Golfs appear, patrol correctly, and show correct death messages
- [x] 5.3 Confirm completing Level 2 unlocks Level 3 (Marathon)
- [x] 5.4 Confirm Level 3 (Marathon) plays identically to the old Level 2
