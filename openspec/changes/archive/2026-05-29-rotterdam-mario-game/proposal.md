## Why

Rotterdam is a world-class city with iconic landmarks that deserve to be celebrated in a fun, educational way. This game lets players explore Rotterdam's highlights through a retro Mario-style platformer — combining nostalgia, local pride, and learning.

## What Changes

- New browser-based 2D platformer game built with HTML5 Canvas
- Players control a character walking/jumping through levels themed around Rotterdam landmarks
- Each landmark teaches the player something (history, facts, trivia) upon visit or collection
- Retro 80s/90s pixel art aesthetic with chiptune music and sound effects
- Fully self-contained: no backend, uses localStorage for high scores / progress
- Served via a local web server accessible on the office WiFi network

## Capabilities

### New Capabilities

- `game-engine`: Core game loop, canvas rendering, keyboard input, physics (gravity, jumping, collision)
- `player`: Player character with movement, animation states (walk, jump, idle)
- `levels`: Level design featuring Rotterdam landmark-themed platforms and backgrounds
- `landmarks`: Educational landmark collectibles/encounters — facts pop up when player reaches a landmark
- `score-system`: Score tracking, lives, high score persistence via localStorage
- `audio`: Background chiptune music and sound effects (jump, collect, win)
- `ui`: Start screen, HUD (score/lives), game-over screen, win screen

### Modified Capabilities

## Impact

- New project: all files are new
- No backend dependencies — fully static HTML/CSS/JS
- Requires a simple local HTTP server (e.g., `npx serve` or Python) for WiFi access
- Uses browser localStorage API for persistence
