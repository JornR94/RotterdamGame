## ADDED Requirements

### Requirement: RETRO palette constant defined
The game SHALL define a `RETRO` constant object containing exactly five named color entries: `olive` (`#404040`), `orange` (`#fb2e01`), `mint` (`#6fcb9f`), `gold` (`#ffe28a`), and `cream` (`#fffeb3`). This constant SHALL be declared at module scope in `game.js`, alongside the existing `PAL` constant.

#### Scenario: RETRO constant exists at runtime
- **WHEN** the game script is loaded
- **THEN** `RETRO.olive` equals `#404040`, `RETRO.orange` equals `#fb2e01`, `RETRO.mint` equals `#6fcb9f`, `RETRO.gold` equals `#ffe28a`, and `RETRO.cream` equals `#fffeb3`

#### Scenario: PAL constant is not removed
- **WHEN** the game script is loaded
- **THEN** `PAL.red`, `PAL.blue`, `PAL.darkBlue`, `PAL.lightBlue`, and `PAL.white` remain defined and unchanged
