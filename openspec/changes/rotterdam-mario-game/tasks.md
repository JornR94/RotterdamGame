## 1. Browser Baseline (milestone: something visible in the browser)

- [x] 1.1 Create `index.html` with a Canvas element (800x450), basic CSS reset, and a `<script>` tag pointing to `game.js`
- [x] 1.2 Create `game.js` that draws a colored rectangle and a text label on the canvas (no game logic yet)
- [x] 1.3 Verify it loads correctly at `localhost` in the browser
- [x] 1.4 Start a WiFi-accessible server (`npx serve . -l 1010`) and verify it loads from another device on the same network

## 2. Game Engine Core

- [x] 2.1 Implement `requestAnimationFrame` game loop with delta-time and 100ms cap
- [x] 2.2 Implement canvas scaling to fit viewport while preserving 16:9 aspect ratio
- [x] 2.3 Implement keyboard input handler tracking arrow keys, space, and Escape
- [x] 2.4 Implement gravity constant applied to player velocity each frame
- [x] 2.5 Implement AABB collision detection function for player vs platform rectangles
- [x] 2.6 Implement horizontal camera scroll following the player

## 3. Player

- [x] 3.1 Create player object with position, velocity, size, lives, and facing direction
- [x] 3.2 Implement left/right movement with arrow keys updating player velocity
- [x] 3.3 Implement jump: apply upward velocity when space pressed and player is grounded
- [x] 3.4 Prevent double-jump by tracking `isOnGround` boolean
- [x] 3.5 Detect player falling below canvas bottom, deduct life, respawn at level start
- [x] 3.6 Trigger game-over screen when lives reach zero
- [x] 3.7 Draw player as pixel-art humanoid (colored rectangles) with left/right facing

## 4. Level Design

- [x] 4.1 Define level data format: array of `{x, y, w, h, color, type}` objects
- [x] 4.2 Design and implement Level 1 platform layout (Rotterdam skyline tour, 3x viewport width)
- [x] 4.3 Draw ground and platforms from level data each frame (offset by camera)
- [x] 4.4 Draw layered background: sky gradient + simplified Rotterdam skyline shapes
- [x] 4.5 Place finish flag object at the end of the level
- [x] 4.6 Detect player touching finish flag, trigger level-complete flow

## 5. Landmarks & Education

- [x] 5.1 Define landmark collectible data: `{x, y, name, fact}` for each of 6 landmarks
- [x] 5.2 Draw landmark collectibles as spinning stars/coins each frame
- [x] 5.3 Detect player collision with each collectible, mark as collected
- [x] 5.4 Show fact popup overlay on collection (landmark name + fact text, 3s auto-dismiss)
- [x] 5.5 Award 100 points per collectible and update HUD score

## 6. Score System

- [x] 6.1 Implement score counter in game state, updated on collectible pickup and level complete
- [x] 6.2 Load high score from `localStorage` key `rotterdam-game-highscore` on game start
- [x] 6.3 Save new high score to `localStorage` when final score exceeds stored high score

## 7. Audio

- [x] 7.1 Initialize Web Audio API `AudioContext` on first keypress (autoplay policy workaround)
- [x] 7.2 Implement `playJumpSound()` — short ascending oscillator blip
- [x] 7.3 Implement `playCollectSound()` — short ascending arpeggio (3 notes)
- [x] 7.4 Implement `playGameOverSound()` — descending wah-wah effect
- [x] 7.5 Implement looping background chiptune music (simple note sequence via oscillator)

## 8. UI Screens

- [x] 8.1 Implement start screen: title art, high score, "Press SPACE to start" in retro font
- [x] 8.2 Implement HUD: score, lives (pixel hearts), level number drawn on canvas each frame
- [x] 8.3 Implement game-over screen: score, high score, "Press SPACE to retry"
- [x] 8.4 Implement win screen: congratulations message, final score, high score
- [x] 8.5 Implement pause overlay when Escape pressed, resume on Escape again

## 9. Polish & Testing

- [x] 9.1 Test full playthrough: start → collect all landmarks → reach finish → win screen
- [x] 9.2 Test game over flow: lose all lives → game-over screen → retry works
- [x] 9.3 Test high score persists after page refresh
- [x] 9.4 Test game is reachable from another device on WiFi
- [x] 9.5 Tune jump feel, platform layout, and difficulty for fun in 5-minute demo
