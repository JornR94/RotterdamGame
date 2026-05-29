## ADDED Requirements

### Requirement: Language selection
The game SHALL support two display languages: Dutch (NL, default) and English (EN). The selected language SHALL persist across sessions via localStorage.

#### Scenario: Default language is Dutch
- **WHEN** the game is loaded for the first time (no localStorage value present)
- **THEN** the language is set to NL

#### Scenario: Language persists across sessions
- **WHEN** the player has previously selected a language
- **THEN** that language is restored on next load

---

### Requirement: Language toggle on start screen
The start screen SHALL display a language toggle navigable with Arrow Left / Arrow Right keys, showing the current language (e.g., `← TAAL: NL →` / `← LANGUAGE: EN →`).

#### Scenario: Toggle cycles between NL and EN
- **WHEN** the player presses ArrowLeft or ArrowRight on the start screen
- **THEN** the language switches between NL and EN and all visible text updates immediately

#### Scenario: Selection is saved on game start
- **WHEN** the player presses SPACE to start after choosing a language
- **THEN** the chosen language is saved to localStorage

---

### Requirement: Translated UI strings
All user-visible UI text SHALL be available in both NL and EN. NL is the default.

| Key | EN | NL |
|-----|----|----|
| `subtitle` | A retro run through the city | Een retro ren door de stad |
| `press_start` | PRESS SPACE TO START | DRUK SPATIE OM TE STARTEN |
| `controls_start` | ← → Move    SPACE Jump    ESC Pause | ← → Bewegen    SPATIE Springen    ESC Pauze |
| `select_level` | SELECT LEVEL | KIES LEVEL |
| `controls_select` | ← → Select    SPACE Start | ← → Kiezen    SPATIE Starten |
| `game_over` | GAME OVER | GAME OVER |
| `press_return` | PRESS SPACE TO RETURN | DRUK SPATIE OM TERUG TE GAAN |
| `win_message` | WELL DONE! | LEKKER BEZIG, GAP! |
| `new_high_score` | NEW HIGH SCORE! | NIEUW RECORD! |
| `paused` | PAUSED | GEPAUZEERD |
| `resume` | Press ESC to resume | Druk ESC om verder te spelen |
| `score_label` | Score | Score |
| `best_label` | Best | Beste |
| `lang_toggle` | ← LANGUAGE: EN → | ← TAAL: NL → |

#### Scenario: Language switch updates all UI text
- **WHEN** the player changes the language on the start screen
- **THEN** all text on screen immediately reflects the new language

---

### Requirement: Translated landmark facts
Each landmark SHALL have a fact in both NL and EN. The correct fact is shown based on the active language.

| Landmark | EN | NL |
|----------|----|----|
| Erasmusbrug | "The Erasmus Bridge (1996) is 802 metres long and is also known as 'The Swan'." | "De Erasmusbrug (1996) is 802 meter lang en staat ook wel bekend als 'De Zwaan'." |
| Euromast | "The Euromast (185m) is the tallest building in Rotterdam, built in 1960." | "De Euromast (185m) is het hoogste gebouw van Rotterdam, gebouwd in 1960." |
| Markthal | "The Market Hall (2014) contains 228 apartments and the largest artwork in the Netherlands on its ceiling." | "De Markthal (2014) bevat 228 appartementen en heeft het grootste kunstwerk van Nederland op het plafond." |
| Kubuswoningen | "The Cube Houses were designed by Piet Blom and are tilted at 45 degrees." | "De Kubuswoningen zijn ontworpen door Piet Blom en staan 45 graden gekanteld." |
| De Kuip | "De Kuip (Stadion Feijenoord) has a capacity of 51,117 spectators." | "De Kuip (Stadion Feijenoord) heeft een capaciteit van 51.117 toeschouwers." |
| Haven Rotterdam | "The port of Rotterdam is the largest port in Europe." | "De haven van Rotterdam is de grootste haven van Europa." |

#### Scenario: Landmark fact shown in active language
- **WHEN** the player collects a landmark collectible
- **THEN** the fact popup displays the fact in the currently active language
