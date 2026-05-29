## 1. Color Palette

- [x] 1.1 Add `PAL` constant object at top of `game.js` with the 5 approved Rotterdam colors
- [x] 1.2 Replace all `#4a7c59` (green) ground platform colors with `#457b9d`
- [x] 1.3 Replace `#adb5bd` and `#6c757d` (greys) platform colors with `#a8dadc` or `#1d3557`
- [x] 1.4 Replace `#e76f51` (orange) Markthal platform color with `#e63946`
- [x] 1.5 Replace `#f4d35e` (yellow) Kubuswoningen platform color with `#a8dadc`

## 2. Player Feyenoord Skin

- [x] 2.1 Remove hat drawing code from `drawPlayer()`
- [x] 2.2 Draw shirt as alternating horizontal red (`#e63946`) and white (`#f1faee`) stripes across the torso area
- [x] 2.3 Draw shorts area in black (`#212529`) below the shirt
- [x] 2.4 Draw socks in white (`#f1faee`) with a red (`#e63946`) top trim band
- [x] 2.5 Confirm boots remain black (`#212529`) — adjust position to sit below socks

## 3. Star Collectibles

- [x] 3.1 Rewrite the star draw function to use a single `beginPath` with alternating outer (r=14) and inner (r=6) vertices for a proper 5-point star polygon
- [x] 3.2 Add 10 empty star objects to the stars array with positions scattered across the level (no `fact` property)
- [x] 3.3 Update `resetLandmarks()` (or create `resetStars()`) to include both fact stars and empty stars in one array
- [x] 3.4 Update star collection logic: fact stars award 100 pts + trigger popup; empty stars award 25 pts with no popup

## 4. Landmark Fact Overlay

- [x] 4.1 Rewrite `drawPopup()` as `drawFactOverlay()` — render at position (8, 40), width 260px, semi-transparent dark background
- [x] 4.2 Implement alpha fade-in (0–0.3s) and fade-out (last 1s of 4s timer)
- [x] 4.3 Render landmark name in bold small font and fact text word-wrapped within the 260px panel
- [x] 4.4 Update popup timer in `update()` from 3s to 4s
- [x] 4.5 Move score display to avoid overlap with overlay (e.g. center-top or right side of HUD)

## 5. Enemy System Foundation

- [x] 5.1 Create `enemies` array and `resetEnemies()` function
- [x] 5.2 Add generic enemy update loop in `update()`: move enemies by `vx * dt`, handle direction reversal at patrol boundaries
- [x] 5.3 Add generic enemy draw loop in `render()` called after platforms, before player
- [x] 5.4 Add generic enemy-player collision check: stomp (player vy > 0, overlap top ≤ 12px) → kill enemy + bounce player; side/bottom → player loses life

## 6. Volkswagen Golf Enemy

- [x] 6.1 Draw Golf car sprite: body rect, roof rect, two wheel circles, windscreen — all within 36×20px bounding box, using palette colors
- [x] 6.2 Define Golf car spawn positions (2–3 cars) on ground platforms with `vx = 300`, patrol boundaries matching their platform extents
- [x] 6.3 Add Golf cars to `enemies` array in `resetEnemies()`
- [x] 6.4 Award 50 points on stomp kill

## 7. Trash Bag Enemy

- [x] 7.1 Draw trash bag sprite: dark rounded bag body, tied-top knot — within 20×22px bounding box using dark palette colors
- [x] 7.2 Define trash bag spawn positions (3–4 bags) on ground platforms with `vx = 60`, patrol boundaries of ~150px each
- [x] 7.3 Add trash bags to `enemies` array in `resetEnemies()`
- [x] 7.4 Award 30 points on stomp kill

## 8. Erasmus Bridge Level Environment

- [x] 8.1 Add `drawBridge()` function that draws the bridge deck (wide horizontal rect at y≈370, x 0–900) in `#a8dadc`
- [x] 8.2 Draw the A-frame pylon: two diagonal leg lines meeting at a peak around y≈80, x≈400, filled polygon in `#a8dadc`
- [x] 8.3 Draw stay cables: diagonal lines from pylon peak to deck anchor points at intervals, stroked in `#f1faee`
- [x] 8.4 Call `drawBridge()` in `render()` after `drawBackground()` and before `drawPlatforms()`
- [x] 8.5 Update the bridge-section platform entries in `level1Platforms` so their y-coordinate aligns with the drawn deck top edge (y≈370)
