# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] — Initial public release

### Added
- Mobile-friendly Lovelace card for the Dreame Vacuum Home Assistant integration.
- Three-tab Advanced settings menu: Cleaning (CleanGenius / Custom slide-toggle), Behavior, Dock.
- Per-room cleaning settings (cycles, suction, wetness) when Customized cleaning is enabled.
- Global Cleaning times pills (1x / 2x / 3x) passed as `repeats` to the clean service.
- CleanGenius mode and behavior selectors.
- Suction Power circles + Max+ toggle.
- Mop Humidity slider over the `wetness_level` number entity (1–32 with Lightly damp / Damp / Wet labels), with fallback to the legacy `mop_pad_humidity` presets.
- Mop Washing frequency selector with area / time sliders.
- Cleaning Route circles.
- DnD toggle with start / end time pickers when active.
- Volume slider, Resume after pause, Child lock, Carpet boost, Carpet avoidance, Auto-mount mop toggles.
- Auto Empty toggle with frequency pills, Auto-detergent toggle, Drying time slider.
- Quick Action: "Clean dock" button (`button.<prefix>_base_station_cleaning`).
- Cleaning overlay with live status, present location, room being cleaned, pause/resume, self-clean and end-job actions.
- Alert banner row with white background and red warning triangle for any active warnings (low water, dirty water full, mop pad missing, brush replacement due, …).
- Battery, area, time and mode summary tiles with progress rings.
- Theme-aware colors via HA theme variables (`--primary-color`, `--primary-text-color`, `--card-background-color`, `--primary-background-color`, `--divider-color`).
- Localized UI: English (default) and Danish. Stubs ready for ca, cs, de, el, es, fr, hu, it, ko, nl, pl, pt, ro, ru, sl, sv, uk, zh.
- Translated Dreame state labels, status labels, error labels and option values (suction, cleaning mode, route, …) in Danish.
- Sort rooms by their per-room `Order` select entity (`select.<prefix>_room_<id>_order`).
- Column-major room grid layout (matches the Dreame app: items run top-to-bottom in each column).
- Defensive entity discovery — sections hide automatically when their entities are not enabled in Home Assistant.
