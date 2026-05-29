## Context

A one-day game jam building a retro Rotterdam platformer. The game is entirely client-side, runs in any modern browser, and must be accessible on the office WiFi. No frameworks, no build tools — pure HTML5 Canvas + vanilla JS to keep iteration fast and deployment trivial. The subject matter (Rotterdam landmarks) adds educational value and personal connection to the city.

## Goals / Non-Goals

**Goals:**
- Playable Mario-style 2D platformer in the browser within one day
- At least one full level featuring recognizable Rotterdam landmarks as platforms
- Educational landmark facts displayed in-game
- Retro pixel art visual style (8-bit/16-bit era palette, chunky sprites)
- Chiptune/retro audio (Web Audio API for procedural sound or small audio files)
- Persistent high score via localStorage
- Accessible via WiFi (served with `npx serve` or equivalent)

**Non-Goals:**
- Multiplayer
- Mobile/touch support (keyboard-only is fine for office demo)
- Backend, authentication, or any server-side logic
- Procedural level generation (hand-crafted levels only)

## Decisions

### Single HTML file with vanilla JS and Canvas
**Decision**: Use a single `index.html` + vanilla JS, no bundler, no framework.  
**Rationale**: Zero setup, instant serve, easy to demo. The game is small enough that complexity of a build system is not justified. Canvas 2D gives direct control for a retro feel.  
**Alternatives considered**: Phaser.js (too heavy for time box, learning curve), React (overkill).

### Pixel art drawn programmatically or with small PNG sprites
**Decision**: Start with programmatically-drawn pixel art (colored rectangles, simple shapes) and upgrade to sprite PNGs if time allows.  
**Rationale**: No asset pipeline needed. Retro look is achievable with colored blocks and CSS `image-rendering: pixelated`.  
**Alternatives considered**: Sprite sheets (requires external tool and time).

### Web Audio API for sound
**Decision**: Generate chiptune-style sound effects procedurally via Web Audio API oscillators. Background music via a simple looping tone sequence.  
**Rationale**: No audio files to host, no CORS issues, fully self-contained. Classic chiptune sounds fit retro aesthetic perfectly.  
**Alternatives considered**: MP3/OGG files (requires hosting and MIME type config).

### Level format: JavaScript object arrays
**Decision**: Levels defined as JS arrays of platform/landmark objects with x, y, width, height properties.  
**Rationale**: Simple to author by hand, easy to extend. No file parsing needed.

### localStorage for persistence
**Decision**: High score and level completion stored in `localStorage` keyed by game name.  
**Rationale**: Only available persistence mechanism per requirements.

## Risks / Trade-offs

- [Risk] Canvas performance on low-end laptops → Mitigation: cap at 60fps with `requestAnimationFrame`, keep entity count low
- [Risk] Pixel art looks rough without real sprites → Mitigation: use bright, high-contrast retro color palette; simple shapes can look intentionally retro
- [Risk] Web Audio API blocked by browser autoplay policy → Mitigation: trigger audio context on first user keypress (standard workaround)
- [Risk] Time pressure means incomplete levels → Mitigation: ship one complete level first, add more landmarks iteratively
