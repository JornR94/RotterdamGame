## Why

The current background music is a generic C-major scale loop that has no connection to Feyenoord or Rotterdam. Replacing it with the recognizable hook of "Hand in Hand, Kameraden" — arranged as a full NES-style chiptune — makes the game feel authentically Feyenoord and significantly more memorable for demo audiences.

## What Changes

- Remove the generic scale-based background music (`MUSIC_NOTES` array + `setInterval` loop)
- Replace with a scheduler-based chiptune engine that plays the "Hand in Hand, Kameraden" hook
- Add three simultaneous voices: lead melody (square), bass line (triangle), percussion (noise)
- Tempo set to ~140 BPM for an energetic platformer feel
- All existing audio triggers (first keypress, game over, jump, collect) remain unchanged

## Capabilities

### New Capabilities
- `anthem-chiptune`: NES-style three-voice chiptune arrangement of the Feyenoord anthem hook, driven by a Web Audio API scheduler with rock-solid timing

### Modified Capabilities
- `background-music`: The looping background music requirement changes from "a chiptune note sequence" to "the Feyenoord anthem hook in NES arrangement"

## Impact

- `game.js`: Audio section (~lines 55–117) rewritten; no other sections touched
- No new dependencies — Web Audio API only (already in use)
- No breaking changes to game state, scoring, or UI
