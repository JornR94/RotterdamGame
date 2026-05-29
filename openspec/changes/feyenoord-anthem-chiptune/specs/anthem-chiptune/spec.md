## ADDED Requirements

### Requirement: Three-voice NES chiptune engine
The game SHALL implement a scheduler-based Web Audio engine that plays three simultaneous voices (melody, bass, percussion) using the AudioContext clock for timing, with a lookahead buffer of at least 300ms to prevent audio gaps.

#### Scenario: Voices play simultaneously
- **WHEN** the chiptune engine is started
- **THEN** melody, bass, and percussion are audible at the same time without one blocking another

#### Scenario: Timing does not drift
- **WHEN** the music plays for 60 seconds
- **THEN** the tempo remains consistent with no perceivable drift or stutter

### Requirement: Melody voice — square wave
The game SHALL play the "Hand in Hand, Kameraden" opening hook as the lead melody using a square-wave oscillator at ~140 BPM.

#### Scenario: Anthem hook is recognizable
- **WHEN** background music is playing
- **THEN** the melody matches the opening phrase of "Hand in Hand, Kameraden"

#### Scenario: Melody loops seamlessly
- **WHEN** the melody pattern reaches its end
- **THEN** it restarts immediately without a gap or click

### Requirement: Bass voice — triangle wave
The game SHALL play root-note bass hits on beats 1 and 3 of each bar using a triangle-wave oscillator, one octave below the melody.

#### Scenario: Bass hits on downbeats
- **WHEN** the chiptune is playing
- **THEN** a low triangle-wave note is audible on beats 1 and 3

### Requirement: Percussion voice — noise bursts
The game SHALL simulate a kick drum and snare drum using shaped white-noise bursts generated from an AudioBufferSourceNode.

#### Scenario: Kick on beats 1 and 3
- **WHEN** the chiptune is playing
- **THEN** a low-frequency noise burst (kick) is audible on beats 1 and 3

#### Scenario: Snare on beats 2 and 4
- **WHEN** the chiptune is playing
- **THEN** a mid-frequency noise burst (snare) is audible on beats 2 and 4

### Requirement: Reusable noise buffer
The game SHALL generate the noise buffer once on audio initialization and reuse it for all percussion hits to avoid per-note allocation.

#### Scenario: No allocation per percussion hit
- **WHEN** a percussion note is scheduled
- **THEN** no new Float32Array is allocated; the pre-existing buffer is reused
