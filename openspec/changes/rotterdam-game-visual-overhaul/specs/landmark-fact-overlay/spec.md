## ADDED Requirements

### Requirement: Fact display is a non-blocking top-left overlay
When a fact star is collected, the landmark fact SHALL be displayed in a small overlay panel in the top-left corner of the screen (not a centered modal). The overlay SHALL NOT prevent the player from continuing to play.

#### Scenario: Overlay position
- **WHEN** a fact popup is active
- **THEN** it SHALL render at screen coordinates (8, 40) with a width of approximately 260px

#### Scenario: Overlay auto-fades after 4 seconds
- **WHEN** a fact popup is displayed
- **THEN** it SHALL fade in over 0.3 seconds, remain opaque for ~3s, then fade out over the final ~1 second, and disappear completely after 4 seconds total

#### Scenario: Overlay does not block player view
- **WHEN** a fact popup is active and the player is on-screen
- **THEN** the player sprite and platform geometry SHALL remain visible and interactable

#### Scenario: Overlay shows landmark name and fact text
- **WHEN** a fact popup is active
- **THEN** the landmark name SHALL appear in bold at the top of the overlay and the fact text SHALL appear below it in a smaller font, word-wrapped within the panel width

#### Scenario: New fact replaces existing overlay
- **WHEN** the player collects a second fact star while a popup is already showing
- **THEN** the existing popup SHALL be immediately replaced by the new one (timer resets to 4 seconds)
