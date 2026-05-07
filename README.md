# Dreame Vacuum Card

A mobile-friendly Lovelace card for the [dreame_vacuum](https://github.com/Tasshack/dreame-vacuum) Home Assistant integration. Designed for the Dreame X40 Ultra but works with any Dreame robot vacuum the integration supports.

> **Status:** v1.0.0 — initial public release.
> Built around the Dreame Vacuum integration; the card auto-discovers all related select / number / switch / sensor / time / button entities from the entity prefix, so no extra wiring is required.

---

## Features

### Main card
- **One-tap actions** — *Clean all rooms* by default, *Clean selected room(s)* the moment you pick rooms, *Clear all selection(s)*.
- **Per-room buttons** sorted by your Dreame *Order* selects (`select.<prefix>_room_<id>_order`), laid out top-to-bottom column-major to match the Dreame app.
- **Live cleaning overlay** while the robot is active: present location, room being cleaned, pause/resume, self-clean, end-job — with a slow rotation + accent-colored pulse on the robot image.
- **Alert banner** (white card + red warning triangle) for any active warnings: low water, dirty water full, mop pad missing, brush due for replacement, sensor cleaning, dust bag full, etc.
- **Battery / area / time / mode** summary tiles with progress rings.

### Advanced settings — three tabs
- **Cleaning** — CleanGenius ↔ Custom slide-toggle, cleaning mode, cleaning times (1x / 2x / 3x), suction power + Max+, mop humidity (slider over `wetness_level` 1–32 with *Lightly damp / Damp / Wet* labels — falls back to the legacy `mop_pad_humidity` circles), mop washing, route, per-room settings when *Customized cleaning* is enabled.
- **Behavior** — DnD with start/end times when active, volume, resume after pause, child lock, carpet boost, carpet avoidance, auto-mount mop.
- **Dock** — Auto empty + frequency pills, detergent dosing, drying time, *Clean dock* quick action.

### Theme & language
- **Theme-aware colors** — follows your HA theme variables (`--primary-color`, `--primary-text-color`, `--card-background-color`, `--primary-background-color`, `--divider-color`). The card adopts your accent color automatically.
- **Localized UI** — English (default) and Danish are fully translated. Stubs are ready for: `ca`, `cs`, `de`, `el`, `es`, `fr`, `hu`, `it`, `ko`, `nl`, `pl`, `pt`, `ro`, `ru`, `sl`, `sv`, `uk`, `zh`. PRs welcome.

### Defensive
- Sections hide automatically when their underlying entities aren't enabled in Home Assistant — no broken UI, no missing-entity errors. Open the Dreame Vacuum integration's "+x disabled entities" to enable any feature you want to surface.

---

## Installation

### Via HACS (recommended)

1. In Home Assistant, open **HACS → Frontend**.
2. Click the three-dot menu in the top right → **Custom repositories**.
3. Add this repository:
   - **Repository:** `https://github.com/hedegaard1/dreame-vacuum-card`
   - **Type:** `Lovelace`
4. Find **Dreame Vacuum Card** in HACS, click *Download*, and select the latest version.
5. Refresh your browser (hard refresh: Ctrl+F5 or Cmd+Shift+R) so HA picks up the new resource.

### Manual install

1. Download `dreame-vacuum-card.js` from the [latest release](https://github.com/hedegaard1/dreame-vacuum-card/releases).
2. Copy it to `/config/www/dreame-vacuum-card/` on your HA host.
3. In Home Assistant, go to **Settings → Dashboards → Resources** and add:
   - **URL:** `/local/dreame-vacuum-card/dreame-vacuum-card.js`
   - **Resource type:** JavaScript Module
4. Hard-refresh your browser.

---

## Configuration

### Minimal

```yaml
type: custom:dreame-vacuum-card
entity: vacuum.dreame_x40_ultra
```

### All options

```yaml
type: custom:dreame-vacuum-card
entity: vacuum.dreame_x40_ultra        # required — your Dreame vacuum entity
title: Dreame X40 Ultra                # optional — header title (defaults to friendly_name)
image: /local/DreameX40Ultra.png       # optional — path to a robot image (falls back to mdi:robot-vacuum icon)
```

> The card auto-discovers everything else (suction level, mop humidity, CleanGenius mode, DnD, room settings, …) from the entity prefix. No extra wiring required.

---

## Required / recommended Dreame entities

The card hides any section whose entity is disabled in HA. To get the full experience, enable these in **Settings → Devices & Services → Dreame Vacuum → click your robot → "+x disabled entities"**:

**Per-room (one set per room):**
- `select.<prefix>_room_<id>_order` — used for room ordering on the front page
- `select.<prefix>_room_<id>_cleaning_times`, `select.<prefix>_room_<id>_suction_level`, `number.<prefix>_room_<id>_wetness_level` — used in the per-room accordion when Customized cleaning is on

**Global:**
- `switch.<prefix>_customized_cleaning` — toggle per-room overrides
- `switch.<prefix>_max_suction_power` — Max+ toggle
- `switch.<prefix>_dnd` + `time.<prefix>_dnd_start` + `time.<prefix>_dnd_end`
- `number.<prefix>_volume`, `number.<prefix>_drying_time`, `number.<prefix>_wetness_level`
- `switch.<prefix>_resume_cleaning`, `switch.<prefix>_child_lock`, `switch.<prefix>_carpet_boost`, `switch.<prefix>_carpet_avoidance`, `switch.<prefix>_auto_mount_mop`
- `switch.<prefix>_auto_dust_collecting`, `select.<prefix>_auto_empty_frequency`, `switch.<prefix>_auto_add_detergent`
- `button.<prefix>_base_station_cleaning`, `button.<prefix>_self_clean`, `button.<prefix>_water_tank_draining`

---

## Screenshots

> Add screenshots under `images/` and update the paths below.

![Dreame Vacuum Card — main view](images/card-preview.png)
![Advanced settings — Cleaning tab](images/advanced-cleaning.png)
![Advanced settings — Dock tab](images/advanced-dock.png)

---

## Contributing translations

The card ships with English (default) and Danish. To add another language:

1. Open `dreame-vacuum-card.js` and find the `TRANSLATIONS` object near the top.
2. Locate your language stub (e.g. `de: {}`). Replace it with the same keys as the `da` block above and translate each value.
3. Find `LOCALIZED_LABELS` (the next big object). Mirror the structure of `da` for your language — only fill in the keys you can confidently translate; missing keys fall back to English automatically.
4. Open a Pull Request titled `Add <Language> translation` and link to any sources you used.

> The card uses `hass.locale.language` sliced to 2 characters, so `pt-BR` → `pt` and `zh-Hans` → `zh`. If you need locale-specific variants (e.g. distinct pt-BR), open an issue first so we can plan a small change to the language detection.

## Contributing code

- Fork the repo, work on a feature branch, open a PR against `main`.
- Keep the file as a single `dreame-vacuum-card.js` (HACS expects this).
- Don't break existing config keys; add new optional ones with sensible defaults.
- Test on at least one mobile and one desktop dashboard layout if your change touches CSS.

---

## Acknowledgements

Built on top of the excellent [dreame-vacuum](https://github.com/Tasshack/dreame-vacuum) integration by [@Tasshack](https://github.com/Tasshack), without which this card would have nothing to display.

## License

[MIT](LICENSE) — © Martin Fiil
