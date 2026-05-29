## 1. Strings & Level Registration

- [x] 1.1 Add `level2_name` and `level2_desc` keys to `STRINGS.NL` and `STRINGS.EN` in `game.js`
- [x] 1.2 Push Level 2 object to the `LEVELS` array with `id: 2`, `name`, `width: 3500`, `skyColor: RETRO.olive`, `silhouetteColor: RETRO.orange`, `unlocked: false`, and empty `platforms`, `fences`, `finishFlag`, `landmarks`, `emptyStars` fields

## 2. Level 2 World Layout

- [x] 2.1 Add ground sections (type `'ground'`, y: 400, h: 50, color: `'#666'`) to Level 2 with the same 5-gap structure as Level 1
- [x] 2.2 Add elevated road section platforms (type `'platform'`, y: 355–375, h: 15, color: `'#666'`) spread across the world to bridge the gaps
- [x] 2.3 Add finish flag to Level 2 at `{ x: 2980, y: 300, w: 20, h: 100 }`

## 3. Fence Obstacles

- [x] 3.1 Add `fences` array to Level 2 descriptor with one fence (`w: 8, h: 30`) at the near edge of each of the 5 ground gaps
- [x] 3.2 Implement `drawFences()` function — renders each fence as a brown (`#8B4513`) vertical rectangle with a dark edge (`#5C2E00`); only runs when `currentLevel.fences` is non-empty
- [x] 3.3 Implement `updateFences()` collision — detects horizontal overlap between player AABB and each fence; if player bottom is below fence top, push player back by overlap amount and zero horizontal velocity; no life deducted
- [x] 3.4 Call `drawFences()` and `updateFences()` at the correct points in the render/update loop

## 4. Enemy System — Level-Aware Spawning

- [x] 4.1 Refactor `resetEnemies()` to branch on `currentLevel.id`: Level 1 keeps existing seagull + golf car objects unchanged; Level 2 spawns banana + bicycle objects
- [x] 4.2 Add 4 banana enemy objects for Level 2 mirroring seagull x positions (≈200, 700, 1700, 2500), speed `±60`, size `24×18`, points `30`, deathMsg `"Wie pleurt hier nou een banaan neer man!"`
- [x] 4.3 Add 3 bicycle enemy objects for Level 2 mirroring car x positions (≈300, 1200, 2100), speed `±300`, size `36×20`, points `50`, deathMsg `"Waar heb jij leren fietsen joh?!"`

## 5. Enemy Sprites

- [x] 5.1 Implement banana sprite renderer in `drawEnemies()` for type `'banana'`: yellow (`#FFE135`) crescent using stacked `fillRect` rows, brown tips (`#8B4513`) at each end, within 24×18 bounding box
- [x] 5.2 Implement bicycle sprite renderer in `drawEnemies()` for type `'bicycle'`: two `arc()` wheel circles (r≈7, `#222`), grey triangular frame (`#444`) connecting rear wheel, seat, and front wheel, handlebar nub, within 36×20 bounding box

## 6. Collectibles — Water Cups & Medals

- [x] 6.1 Add 5 medal collectibles to Level 2 `landmarks` array at positions spread across the world (≈x: 300, 800, 1300, 1800, 2480), each with the corresponding Dutch fact text
- [x] 6.2 Add ~8 water cup collectibles to Level 2 `emptyStars` array scattered at safe positions away from gaps
- [x] 6.3 Make `drawLandmarks()` level-aware: for Level 2, call a `drawMedal(x, y)` helper instead of the star renderer
- [x] 6.4 Implement `drawMedal(x, y)`: gold `arc()` circle (r≈8, `#FFD700`) with a red ribbon rectangle (`#CC0000`) below, within ~18×24 px
- [x] 6.5 Make `drawEmptyStars()` level-aware: for Level 2, call a `drawWaterCup(x, y)` helper instead of the star renderer
- [x] 6.6 Implement `drawWaterCup(x, y)`: white trapezoid (wide top ~12, narrow bottom ~8, height ~16) with a blue stripe (`#457b9d`), within ~12×16 px

## 7. Platform Rendering — Lane Markings

- [x] 7.1 In `drawPlatforms()`, after drawing each platform in Level 2, render small white (`#ffffff`) dashed rectangles (≈4×2 px, spaced every 20 px) along the top surface of elevated road sections

## 8. Level Unlock

- [x] 8.1 Verify that the existing win handler correctly sets Level 2 `unlocked: true` when Level 1 is completed (no code change expected — confirm by testing)

## 9. Manual Testing

- [ ] 9.1 Play through Level 2 start-to-finish: verify all platforms, gaps, and fences are reachable and fair
- [ ] 9.2 Verify fence bounce-back works and no life is lost on fence collision
- [ ] 9.3 Verify banana and bicycle patrol and can be stomped / cause death correctly
- [ ] 9.4 Verify all 5 medals trigger correct fact popups
- [ ] 9.5 Verify water cups award 25 pts with no popup
- [ ] 9.6 Verify Level 2 unlocks after completing Level 1
- [ ] 9.7 Verify Level 1 is completely unaffected (seagulls, cars, stars, no fences)
