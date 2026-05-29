## 1. Remove old music engine

- [ ] 1.1 Delete the `MUSIC_NOTES` array and `musicInterval` variable
- [ ] 1.2 Remove the `setInterval`-based `startMusic()` body (keep the function signature for now)

## 2. Noise buffer infrastructure

- [ ] 2.1 Add a `noiseBuffer` variable initialized to `null`
- [ ] 2.2 Implement `createNoiseBuffer()` — allocates a 1-second `AudioBuffer` filled with `Math.random() * 2 - 1` values
- [ ] 2.3 Call `createNoiseBuffer()` inside `initAudio()` after creating `audioCtx`

## 3. Scheduler constants and note data

- [ ] 3.1 Define `BEAT_DURATION` constant: `60 / 140` seconds (~0.4286s at 140 BPM)
- [ ] 3.2 Define `MELODY_PATTERN` — array of `[frequency, durationInBeats]` tuples encoding the "Hand in Hand, Kameraden" hook (G4, G4, E4, D4, C4, D4, E4, G4 phrase + second phrase)
- [ ] 3.3 Define `BASS_PATTERN` — root notes on beats 1 & 3 (one octave below melody roots, triangle voice)
- [ ] 3.4 Define `PERC_PATTERN` — array of `{ type: 'kick'|'snare', beat: number }` entries for the full pattern length

## 4. Voice scheduling functions

- [ ] 4.1 Implement `scheduleMelodyNote(freq, duration, startTime)` — square oscillator, gain envelope, connects to destination
- [ ] 4.2 Implement `scheduleBassNote(freq, duration, startTime)` — triangle oscillator, slightly lower gain
- [ ] 4.3 Implement `scheduleKick(startTime)` — `AudioBufferSourceNode` from `noiseBuffer`, lowpass filter @ 100 Hz, short gain envelope (~80ms)
- [ ] 4.4 Implement `scheduleSnare(startTime)` — `AudioBufferSourceNode` from `noiseBuffer`, bandpass filter @ 250 Hz, short gain envelope (~120ms)

## 5. Scheduler loop

- [ ] 5.1 Add `schedulerNextTime`, `schedulerMelodyIdx`, `schedulerBassIdx`, `schedulerPercIdx` state variables
- [ ] 5.2 Implement `musicScheduler()` — loops while `schedulerNextTime < audioCtx.currentTime + 0.5`, schedules all three voices, advances indices modulo pattern length, calls `setTimeout(musicScheduler, 50)`
- [ ] 5.3 Rewrite `startMusic()` to initialize scheduler state and call `musicScheduler()` (guard against double-start remains)

## 6. Verify

- [ ] 6.1 Open game in browser, press a key — confirm anthem hook is audible and loops
- [ ] 6.2 Confirm melody is recognizable as "Hand in Hand, Kameraden"
- [ ] 6.3 Confirm bass and percussion are audible alongside melody
- [ ] 6.4 Confirm jump, collect, and game-over sounds still work correctly
- [ ] 6.5 Let music play for 60+ seconds — confirm no drift, no glitches
