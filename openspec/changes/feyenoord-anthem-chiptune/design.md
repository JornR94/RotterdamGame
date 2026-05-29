## Context

The game currently uses a `setInterval`-based music loop (`startMusic()`) that steps through a 12-note C-major scale at a fixed 220ms per note. This produces generic, non-descript background music with no connection to Feyenoord. The Web Audio API is already initialized (`audioCtx`) and all sound effects (`playJumpSound`, `playCollectSound`, `playGameOverSound`) remain correct and untouched. Only the music engine needs replacing.

## Goals / Non-Goals

**Goals:**
- Play the "Hand in Hand, Kameraden" opening hook as a looping NES-style chiptune at ~140 BPM
- Three simultaneous voices: square-wave melody, triangle-wave bass, noise percussion
- Rock-solid timing using the AudioContext clock (no drift)
- Same trigger as today: music starts on first keypress

**Non-Goals:**
- Full anthem arrangement (verse, chorus, bridge) — hook only
- External audio files or libraries
- Changing any other audio (jump, collect, game over)
- Dynamic music (tempo changes, pitch shift on events)

## Decisions

### 1. Scheduler pattern over `setInterval`

**Decision:** Replace `setInterval` with a `setTimeout`-based lookahead scheduler that schedules notes directly onto `audioCtx.currentTime`.

**Why:** `setInterval` timing is tied to the JS event loop, which drifts and cannot express variable note durations. The AudioContext clock runs independently of the JS thread and is immune to tab throttling. The scheduler fires every ~50ms and pre-schedules any notes that fall within a 300ms lookahead window — sufficient even when the tab is backgrounded (Chrome throttles to ~1000ms, so we increase lookahead to 500ms to be safe).

**Alternative considered:** Web Audio `OfflineAudioContext` to pre-render the loop. Rejected — overkill for a simple pattern, and makes runtime changes (tempo, mute) harder.

### 2. Note data as arrays of `[frequency, duration]` tuples

**Decision:** Encode melody, bass, and percussion as flat arrays of `[freq, beats]` pairs. Duration in beats, converted to seconds via `BEAT_DURATION`.

**Why:** Simple, readable, easy to edit by ear. No external format needed.

### 3. Noise percussion via `AudioBufferSourceNode`

**Decision:** Generate a small `Float32Array` of `Math.random()` values as a reusable noise buffer. Shape with `BiquadFilterNode` — lowpass for kick (~100 Hz), bandpass for snare (~250 Hz).

**Why:** Web Audio has no native noise oscillator type. Buffer approach is standard and inexpensive.

### 4. Triangle wave for bass

**Decision:** Use `triangle` oscillator type for the bass voice.

**Why:** Triangle has softer harmonics than square — mimics the NES triangle channel used for bass, avoids muddiness in the low register.

### 5. Loop via beat counter modulo pattern length

**Decision:** Maintain a `currentBeat` counter incremented each scheduler tick. Wrap with `% PATTERN_LENGTH` to loop seamlessly.

**Why:** Simple, deterministic. No need for Web Audio's `loop` property which complicates multi-voice sync.

## Risks / Trade-offs

- **Background tab throttling** → Mitigated by 500ms lookahead window; AudioContext clock is unaffected so audio never glitches, scheduler just fires less frequently
- **Noise buffer allocation** → Created once on `initAudio()`, reused for all percussion hits; no per-note allocation
- **Anthem transcription accuracy** → The hook is transcribed by ear to standard note frequencies; minor pitch deviations are imperceptible in chiptune timbre
- **Browser autoplay policy** → Already handled by existing first-keypress trigger; no change needed

## Open Questions

- None — design is fully determined by the exploration session.
