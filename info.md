# Dreame Vacuum Card

A mobile-friendly Lovelace card for the [dreame_vacuum](https://github.com/Tasshack/dreame-vacuum) Home Assistant integration. Designed for the Dreame X40 Ultra but works with any Dreame robot vacuum the integration supports.

## Highlights

- One-tap **Clean all rooms** or pick specific rooms to clean
- **CleanGenius ↔ Custom** slide-toggle for the cleaning approach
- **Cleaning times** pills (1x / 2x / 3x) — sent as `repeats` to the clean service
- Per-room **cycles / suction / wetness** when Customized cleaning is on
- Behavior settings: **DnD with start/end times**, volume, resume after pause, child lock, carpet boost / avoid, auto-mount mop
- Dock settings: auto-empty + frequency, detergent dosing, drying time, "Clean dock" quick action
- Live cleaning overlay with present location, room being cleaned, pause/resume/self-clean/end-job actions
- Theme-aware colors that follow your HA theme
- English + Danish translations (more languages welcomed via PR)

## Minimal configuration

```yaml
type: custom:dreame-vacuum-card
entity: vacuum.dreame_x40_ultra
```

## Optional

```yaml
type: custom:dreame-vacuum-card
entity: vacuum.dreame_x40_ultra
title: Dreame X40 Ultra
image: /local/DreameX40Ultra.png
```
