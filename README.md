# RotterdamGame

A browser-based 2D platformer about Rotterdam — educational, retro, and built with vanilla JavaScript and the HTML5 Canvas API. No dependencies, no build step.

## About

Players explore Rotterdam through a Mario-style platformer across three levels. Collecting landmark stars triggers bilingual (Dutch/English) fact popups about Rotterdam's landmarks and culture. The game features Rotterdam-themed enemies (seagulls, VW Golfs, cyclists, knife guys, bananas) and a player character in a Feyenoord kit.

**Levels:**
- **Landmarks** — Rotterdam's iconic structures (Erasmus Bridge, Markthal, etc.)
- **Zuid-Rotterdam** — The southern neighbourhoods
- **Marathon** — Rotterdam Marathon themed level (unlocked progressively)

**Features:**
- Chiptune NES-style audio (Feyenoord anthem "Hand in Hand, Kameraden")
- Dutch / English language toggle
- Per-level high scores saved in `localStorage`
- Progressive level unlocking
- Bilingual educational fact popups on landmark collectibles

## Running the game

```bash
npx serve . -l 1010
```

Then open `http://localhost:1010` in your browser, or connect from another device on the same WiFi using your machine's IP address on port `1010`.

## Controls

| Key | Action |
|-----|--------|
| Arrow Left / Right | Move |
| Arrow Up / Space | Jump |
| P | Pause |
| L | Toggle language (NL/EN) |

## Project structure

```
RotterdamGame/
├── index.html    # HTML shell with 800×450 canvas
├── game.js       # Entire game (~2000 lines, vanilla JS)
└── openspec/     # Feature specs and change proposals (AI workflow)
```

## Tech

- Vanilla JavaScript (ES6+), HTML5 Canvas API, Web Audio API
- Zero runtime dependencies
- Runs in any modern browser
