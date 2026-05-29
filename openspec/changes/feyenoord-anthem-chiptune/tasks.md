## 1. Remove old music engine

- [x] 1.1 Delete the `MUSIC_NOTES` array and `musicInterval` variable
- [x] 1.2 Remove the `setInterval`-based `startMusic()` body (keep the function signature for now)

## 2. Noise buffer infrastructure

- [x] 2.1 Add a `noiseBuffer` variable initialized to `null`
- [x] 2.2 Implement `createNoiseBuffer()` — allocates a 1-second `AudioBuffer` filled with `Math.random() * 2 - 1` values
- [x] 2.3 Call `createNoiseBuffer()` inside `initAudio()` after creating `audioCtx`

## 3. Scheduler constants and note data

- [x] 3.1 Define `BEAT_DURATION` constant: `60 / 140` seconds (~0.4286s at 140 BPM)
- [x] 3.2 Define `MELODY_PATTERN` — array of `[frequency, durationInBeats]` tuples encoding the "Hand in Hand, Kameraden" hook (G4, G4, E4, D4, C4, D4, E4, G4 phrase + second phrase)
- [x] 3.3 Define `BASS_PATTERN` — root notes on beats 1 & 3 (one octave below melody roots, triangle voice)
- [x] 3.4 Define `PERC_PATTERN` — array of `{ type: 'kick'|'snare', beat: number }` entries for the full pattern length

## 4. Voice scheduling functions

- [x] 4.1 Implement `scheduleMelodyNote(freq, duration, startTime)` — square oscillator, gain envelope, connects to destination
- [x] 4.2 Implement `scheduleBassNote(freq, duration, startTime)` — triangle oscillator, slightly lower gain
- [x] 4.3 Implement `scheduleKick(startTime)` — `AudioBufferSourceNode` from `noiseBuffer`, lowpass filter @ 100 Hz, short gain envelope (~80ms)
- [x] 4.4 Implement `scheduleSnare(startTime)` — `AudioBufferSourceNode` from `noiseBuffer`, bandpass filter @ 250 Hz, short gain envelope (~120ms)

## 5. Scheduler loop

- [x] 5.1 Add `schedulerNextTime`, `schedulerMelodyIdx`, `schedulerBassIdx`, `schedulerPercIdx` state variables
- [x] 5.2 Implement `musicScheduler()` — loops while `schedulerNextTime < audioCtx.currentTime + 0.5`, schedules all three voices, advances indices modulo pattern length, calls `setTimeout(musicScheduler, 50)`
- [x] 5.3 Rewrite `startMusic()` to initialize scheduler state and call `musicScheduler()` (guard against double-start remains)

## 6. Verify

- [x] 6.1 Open game in browser, press a key — confirm anthem hook is audible and loops
- [x] 6.2 Confirm melody is recognizable as "Hand in Hand, Kameraden"
- [x] 6.3 Confirm bass and percussion are audible alongside melody
- [x] 6.4 Confirm jump, collect, and game-over sounds still work correctly
- [x] 6.5 Let music play for 60+ seconds — confirm no drift, no glitches

