/**
 * Dreame Vacuum Card
 * A custom Lovelace card for Home Assistant — built around the official
 * dreame_vacuum integration. Designed for the Dreame X40 Ultra but works
 * with any Dreame robot vacuum that the integration supports.
 *
 * Repository : https://github.com/hedegaard1/dreame-vacuum-card
 * Author     : Martin Fiil
 * License    : MIT
 * Version    : 1.0.1
 *
 * Configuration example (Lovelace YAML):
 *
 *   type: custom:dreame-vacuum-card
 *   entity: vacuum.dreame_x40_ultra      # required — your Dreame vacuum
 *   title: Dreame X40 Ultra              # optional — header title (defaults to friendly_name)
 *   image: /local/my-robot.png           # optional — path to a robot image
 *
 * The card auto-discovers all related select / number / switch / sensor
 * entities (suction level, mop humidity, CleanGenius, room settings, …)
 * from the entity prefix, so no extra wiring is required when the
 * dreame_vacuum integration is set up.
 *
 * Theming: the card respects HA theme variables (--primary-color,
 * --primary-text-color, --card-background-color, --primary-background-color
 * and --divider-color). Override them in your theme to recolor the card.
 */

// =============================================================================
// Dreame integration translation tables — extracted from the official
// dreame_vacuum HA integration's strings.json. These map raw sensor values
// (snake_case keys) to human-friendly labels exactly like the Dreame app uses.
// =============================================================================

// vacuum.<entity>.state values
const VACUUM_STATE_LABELS = {
  unknown: "Unknown",
  sweeping: "Sweeping",
  charging: "Charging",
  error: "Error",
  idle: "Idle",
  paused: "Paused",
  returning: "Returning to dock",
  mopping: "Mopping",
  drying: "Drying",
  washing: "Washing",
  returning_to_wash: "Returning to wash",
  building: "Building",
  sweeping_and_mopping: "Sweeping and mopping",
  charging_completed: "Charging completed",
  upgrading: "Upgrading",
  clean_summon: "Summon to clean",
  station_reset: "Station reset",
  returning_install_mop: "Returning to install mop",
  returning_remove_mop: "Returning to remove mop",
  water_check: "Water checking",
  clean_add_water: "Cleaning and adding water",
  washing_paused: "Washing paused",
  auto_emptying: "Auto-emptying",
  remote_control: "Remote controlling",
  smart_charging: "Smart charging",
  second_cleaning: "Second time cleaning",
  human_following: "Human following",
  spot_cleaning: "Spot cleaning",
  returning_auto_empty: "Returning to auto-empty",
  waiting_for_task: "Waiting for task",
  station_cleaning: "Station cleaning",
  returning_to_drain: "Returning to drain",
  draining: "Draining",
  auto_water_draining: "Auto water draining",
  emptying: "Emptying",
  dust_bag_drying: "Dust bag drying",
  dust_bag_drying_paused: "Dust bag drying paused",
  heading_to_extra_cleaning: "Heading to extra cleaning",
  extra_cleaning: "Extra cleaning",
  finding_pet_paused: "Finding pet paused",
  finding_pet: "Finding pet",
  shortcut: "Shortcut",
  monitoring: "Monitoring",
  monitoring_paused: "Monitoring paused",
  initial_deep_cleaning: "Initial deep cleaning",
  initial_deep_cleaning_paused: "Initial deep cleaning paused",
  sanitizing: "Sanitizing",
  sanitizing_with_dry: "Sanitizing with dry",
  changing_mop: "Changing mop",
  changing_mop_paused: "Changing mop paused",
  floor_maintaining: "Floor maintaining",
  floor_maintaining_paused: "Floor maintaining paused",
  docked: "Docked",
  sleeping: "Sleeping",
  standby: "Standby",
};

// attributes.status values
const VACUUM_STATUS_LABELS = {
  unknown: "Unknown",
  idle: "Idle",
  paused: "Paused",
  cleaning: "Cleaning",
  returning: "Returning to dock",
  spot_cleaning: "Spot cleaning",
  follow_wall_cleaning: "Follow wall cleaning",
  charging: "Charging",
  ota: "OTA update",
  fct: "FCT",
  wifi_set: "WiFi setup",
  power_off: "Power off",
  factory: "Factory",
  error: "Error",
  remote_control: "Remote control",
  sleeping: "Sleeping",
  self_repair: "Self repair",
  factory_test: "Factory test",
  standby: "Standby",
  room_cleaning: "Room cleaning",
  zone_cleaning: "Zone cleaning",
  fast_mapping: "Fast mapping",
  cruising_path: "Cruising on path",
  cruising_point: "Cruising to a point",
  summon_clean: "Summon to clean",
  shortcut: "Shortcut",
  person_follow: "Person follow",
  water_check: "Water checking",
  docked: "Docked",
};

// sensor.<...>_task_status values
const TASK_STATUS_LABELS = {
  unknown: "Unknown",
  completed: "Completed",
  cleaning: "Cleaning",
  zone_cleaning: "Zone cleaning",
  room_cleaning: "Room cleaning",
  spot_cleaning: "Spot cleaning",
  fast_mapping: "Fast mapping",
  cleaning_paused: "Cleaning paused",
  room_cleaning_paused: "Room cleaning paused",
  zone_cleaning_paused: "Zone cleaning paused",
  spot_cleaning_paused: "Spot cleaning paused",
  map_cleaning_paused: "Map cleaning paused",
  docking_paused: "Docking paused",
  mopping_paused: "Mopping paused",
  cruising_path: "Cruising on path",
  cruising_point: "Cruising to a point",
  station_cleaning: "Station cleaning",
};

// sensor.<...>_self_wash_base_status values
const WASH_BASE_LABELS = {
  unknown: null,
  idle: null,
  washing: "Mop washing",
  drying: "Mop drying",
  paused: "Mop wash paused",
  returning: "Returning to wash",
  clean_add_water: "Add water for self-clean",
  adding_water: "Adding water",
};

// sensor.<...>_charging_status values
const CHARGING_STATUS_LABELS = {
  unknown: null,
  charging: "Charging",
  not_charging: null,
  return_to_charge: "Returning to charge",
  charging_completed: "Charging completed",
};

// sensor.<...>_low_water_warning values (when not "no_warning", show as alert)
const LOW_WATER_LABELS = {
  no_warning: null,
  no_water_left_dismiss: "Check the clean water tank",
  no_water_left: "Clean water tank empty",
  no_water_left_after_clean: "Refill water + empty dirty water",
  no_water_for_clean: "Low water — switched to vacuum-only",
  low_water: "Water level low — refill soon",
  tank_not_installed: "Clean water tank not installed",
};

// sensor.<...>_clean_water_tank_status values
const CLEAN_WATER_TANK_LABELS = {
  unknown: null, not_available: null, installed: null,
  not_installed: "Clean water tank missing",
  low_water: "Refill clean water",
};

// sensor.<...>_dirty_water_tank_status values
const DIRTY_WATER_TANK_LABELS = {
  unknown: null, installed: null,
  not_installed_or_full: "Empty dirty water tank",
};

// sensor.<...>_dust_bag_status values
const DUST_BAG_LABELS = {
  unknown: null, installed: null,
  not_installed: "Dust bag missing",
  check: "Check dust bag",
};

// sensor.<...>_detergent_status values
const DETERGENT_LABELS = {
  unknown: null, installed: null, disabled: null,
  low_detergent: "Refill detergent",
};

// sensor.<...>_dust_collection values
const DUST_COLLECTION_LABELS = {
  unknown: null, available: null, not_available: null, never: null,
  over_use: "Empty dust bin (overused)",
};

// sensor.<...>_drainage_status values
const DRAINAGE_LABELS = {
  unknown: null, idle: null,
  draining: "Station draining",
  draining_successful: null,
  draining_failed: "Drain failed",
};

// sensor.<...>_mop values
const MOP_STATUS_LABELS = {
  unknown: null, installed: null, mop_installed: null, in_station: null,
  not_installed: "Mop pad not installed",
};

// sensor.<...>_error values — most are already user-friendly
const ERROR_LABELS = {
  no_error: null,
  unknown: null,
  // Movement / sensors
  drop: "Wheels are suspended",
  cliff: "Cliff sensor error",
  bumper: "Collision sensor stuck",
  gesture: "Robot is tilted",
  bumper_repeat: "Collision sensor stuck",
  drop_repeat: "Wheels are suspended",
  optical_flow: "Optical flow sensor error",
  // Hardware / installation
  no_box: "Dust bin not installed",
  no_tank_box: "Water tank not installed",
  water_box_empty: "Water tank is empty",
  box_full: "Filter blocked or wet",
  brush: "Main brush wrapped",
  side_brush: "Side brush wrapped",
  fan: "Filter blocked or wet",
  left_wheel_motor: "Left wheel blocked",
  right_wheel_motor: "Right wheel blocked",
  turn_suffocate: "Robot is stuck",
  forward_suffocate: "Robot can't go forward",
  charger_get: "Cannot find dock",
  battery_low: "Low battery",
  charge_fault: "Charging error",
  battery_percentage: "Battery level error",
  heart: "Internal error",
  camera_occlusion: "Camera blocked",
  // Mop & water
  remove_mop: "Mopping done — please remove and clean mop pad",
  mop_removed: "Mop pad came off",
  mop_pad_stop_rotate: "Mop pad stopped rotating",
  bin_full: "Dust collection bag full",
  bin_open: "Auto-empty cover open",
  water_tank: "Clean water tank not installed",
  dirty_water_tank: "Dirty water tank full or missing",
  water_tank_dry: "Refill clean water tank",
  dirty_water_tank_blocked: "Dirty water tank blocked",
  dirty_water_tank_pump: "Dirty water tank pump error",
  mop_pad: "Washboard not installed properly",
  wet_mop_pad: "Clean the washboard",
  clean_mop_pad: "Cleaning task done — clean the washboard",
  clean_tank_level: "Check and fill clean water tank",
  station_disconnected: "Base station not powered on",
  dirty_tank_level: "Dirty water tank too full",
  washboard_level: "Washboard water too high",
  no_mop_in_station: "Mop pad not in station",
  dust_bag_full: "Dust bag full",
  mop_install_failed: "Mop pad installation failed",
  low_battery_turn_off: "Low battery — shutting down",
  dirty_tank_not_installed: "Dirty water tank not installed",
  // Robot stuck variants
  robot_in_hidden_room: "Hidden area — move the robot",
  robot_stuck: "Robot is stuck",
  robot_stuck_repeat: "Robot stuck — move to open area",
  robot_stuck_on_tables: "Robot stuck among tables/chairs",
  robot_stuck_on_passage: "Robot stuck in narrow passage",
  robot_stuck_on_threshold: "Robot stuck at step/threshold",
  robot_stuck_on_low_lying_area: "Robot stuck under low furniture",
  robot_stuck_on_ramp: "Robot detected dangerous ramp",
  robot_stuck_on_obstacle: "Robot blocked by obstacle",
  robot_stuck_on_pet: "Robot detected pet/person",
  robot_stuck_on_slippery_surface: "Robot slipping",
  robot_stuck_on_carpet: "Robot slipping on carpet",
  robot_stuck_on_curtain: "Robot slipping in curtain",
  // Misc
  blocked: "Cleanup route blocked — returning to dock",
  carpet: "Start the robot off the carpet",
  laser: "3D obstacle sensor error",
  ultrasonic: "Ultrasonic sensor error",
  no_go_zone: "No-Go zone detected",
  route: "Cleanup route blocked",
  restricted: "Robot in restricted area",
  drainage_failed: "Water drainage failed",
  mop_not_detected: "Mop not detected",
  mop_holder_error: "Mop holder error in dock",
  dock_error: "Dock error",
  wash_failed: "Failed to wash mop",
  edge_mop_stop_rotate: "Edge mop stopped rotating",
  edge_mop_detached: "Edge mop detached",
  chassis_lift_malfunction: "Chassis lift malfunction",
  mop_cover_error: "Check debris near roller mop",
  roller_mop_error: "Check debris near roller mop",
  onboard_water_tank_empty: "Robot's water box low",
  onboard_dirty_water_tank_full: "Robot's used water box full",
  mop_not_installed: "Mop not installed",
  fluffing_roller_error: "Fluffing roller error",
  blocked_by_obstacle: "Blocked by obstacle",
  internal_error: "Internal error — try restarting",
  // Catch-all for new errors
};

// Icon mapping for alerts/notifications
const ALERT_ICONS = {
  // water
  water: "mdi:water-off-outline",
  clean_water: "mdi:water-off-outline",
  dirty_water: "mdi:water-pump-off",
  add_water: "mdi:water-plus-outline",
  // dust / bin
  dust: "mdi:delete-empty-outline",
  bin: "mdi:delete-empty-outline",
  // mop
  mop: "mdi:water-outline",
  remove_mop: "mdi:water-pump-off",
  // brush
  brush: "mdi:broom",
  // detergent
  detergent: "mdi:bottle-tonic-outline",
  // generic
  alert: "mdi:alert-circle-outline",
  drying: "mdi:weather-sunny",
  charging: "mdi:battery-charging",
  default: "mdi:information-outline",
};


// =============================================================================
// UI translations. Card text follows the Home Assistant user's language
// (`hass.locale.language`) and falls back to English when a key is missing.
// To add a language, copy the `en` block, change the values, and submit a PR.
// =============================================================================
const TRANSLATIONS = {
  en: {
    // Hero
    robot_vacuum: "Robot vacuum",
    fallback_title: "Dreame Vacuum",
    // Status pill states
    state_idle: "Idle",
    // Stats
    stat_battery: "Battery",
    stat_area: "Area",
    stat_time: "Time",
    stat_mode: "Mode",
    // Rooms
    section_rooms: "Rooms",
    rooms_selected: "{count} selected",
    room_state_selected: "Selected",
    // Main buttons
    btn_clean_selected: "Clean selected room/s",
    btn_clean_all: "Clean all rooms",
    btn_clear: "Clear all selection/s",
    // Alert pill
    alert_action_needed: "Action needed",
    alert_more: "+{n} more",
    // Cleaning overlay
    overlay_paused: "PAUSED",
    overlay_cleaning: "CLEANING",
    overlay_label_present_location: "Present location:",
    overlay_label_room_cleaning: "Room cleaning:",
    overlay_pause: "Pause",
    overlay_resume: "Resume",
    overlay_self_clean: "Self-clean",
    overlay_end_job: "End job",
    job_badge_one_room: "{n} room",
    job_badge_rooms: "{n} rooms",
    job_badge_selected: "Selected",
    job_badge_all_rooms: "All rooms",
    fallback_task_cleaning: "Cleaning",
    // Modal — header
    modal_title: "ADVANCED",
    modal_subtitle: "Cleaning profile and behaviour",
    modal_close: "Close",
    modal_locate: "Locate robot",
    // Modal — tabs
    tab_cleaning: "Cleaning",
    tab_cleangenius: "CleanGenius",
    tab_custom: "Custom",
    tab_behavior: "Behavior",
    tab_dock: "Dock",
    // Behavior tab
    section_schedule_audio: "SCHEDULE & AUDIO",
    section_preferences: "PREFERENCES",
    section_carpets: "CARPETS",
    toggle_dnd_title: "Do Not Disturb",
    toggle_dnd_sub: "Robot stays quiet during set hours",
    label_dnd_start: "Start time",
    label_dnd_end: "End time",
    label_volume: "Volume",
    toggle_resume_title: "Resume after pause",
    toggle_resume_sub: "Continue cleaning after power loss",
    toggle_child_lock_title: "Child lock",
    toggle_child_lock_sub: "Lock controls on the dock",
    toggle_carpet_boost_title: "Carpet boost",
    toggle_carpet_boost_sub: "More suction on carpets",
    toggle_carpet_avoid_title: "Avoid carpets when mopping",
    toggle_carpet_avoid_sub: "Skip carpeted areas during mop tasks",
    toggle_auto_mount_mop_title: "Auto-mount mop",
    toggle_auto_mount_mop_sub: "Robot fits/removes mop pad automatically",
    // Dock tab
    section_auto_empty: "AUTO EMPTY",
    section_mop_care: "MOP CARE",
    toggle_auto_empty_title: "Auto empty",
    toggle_auto_empty_sub: "Empty dust bin into dock automatically",
    label_auto_empty_freq: "Empty frequency",
    toggle_auto_detergent_title: "Auto-add detergent",
    toggle_auto_detergent_sub: "Dispense detergent into mop water",
    label_drying_time: "Drying time",
    section_quick_actions: "QUICK ACTIONS",
    action_base_station_cleaning: "Clean dock",
    no_settings: "No matching entities are enabled in Home Assistant.",
    // Modal — CleanGenius tab
    section_cleangenius_mode: "MODE",
    section_cleangenius_mode_info: "Pick how thorough CleanGenius should be",
    section_cleangenius_behaviour: "CLEANGENIUS BEHAVIOUR",
    // Modal — Custom tab
    section_cleaning_mode: "CLEANING MODE",
    section_cleaning_times: "CLEANING TIMES",
    toggle_customized_title: "Customized cleaning",
    toggle_customized_sub: "Use per-room settings instead of global ones",
    section_per_room: "PER ROOM",
    section_per_room_info: "Each room uses its own settings below",
    section_suction: "SUCTION POWER",
    toggle_maxplus_title: "Max+",
    toggle_maxplus_sub: "Boost suction beyond turbo",
    section_mop_humidity: "MOP HUMIDITY",
    wetness_label_dry: "Lightly damp",
    wetness_label_damp: "Damp",
    wetness_label_wet: "Wet",
    section_mop_washing: "MOP WASHING",
    label_wash_every: "Wash every",
    section_route: "ROUTE",
    // Per-room accordion
    sub_cleaning_times: "CLEANING TIMES",
    sub_cleaning_times_disabled: "CLEANING TIMES — entity not enabled",
    sub_suction: "SUCTION",
    sub_wetness: "WETNESS LEVEL",
    sub_wetness_disabled: "WETNESS — entity not enabled",
    // Confirmations / alerts
    confirm_warnings_one: "The robot has the following warning:\n\n{messages}\n\nStart cleaning anyway?",
    confirm_warnings_many: "The robot has the following warnings:\n\n{messages}\n\nStart cleaning anyway?",
    alert_select_room_first: "Select at least one room first.",
    alert_missing_select: "Could not find \"{label}\" as a select entity.\n\nEnable it in Home Assistant:\nSettings → Devices & Services → Dreame Vacuum → click your robot → \"+x disabled entities\" → find and enable \"{label}\".",
    alert_missing_entity: "Could not find \"{label}\".\n\nEnable it under Dreame Vacuum → click the robot → \"+x disabled entities\".",
    alert_missing_self_clean_btn: "Could not find the \"Self Clean\" button. Enable \"{id}\" under the Dreame Vacuum integration.",
    alert_missing_self_clean_freq: "Could not find \"Self Clean Frequency\". Enable it under Dreame Vacuum → \"+x disabled entities\".",
  },
  da: {
    robot_vacuum: "Robotstøvsuger",
    fallback_title: "Dreame Robotstøvsuger",
    state_idle: "Inaktiv",
    stat_battery: "Batteri",
    stat_area: "Areal",
    stat_time: "Tid",
    stat_mode: "Tilstand",
    section_rooms: "Rum",
    rooms_selected: "{count} valgt",
    room_state_selected: "Valgt",
    btn_clean_selected: "Rengør valgte rum",
    btn_clean_all: "Rengør alle rum",
    btn_clear: "Ryd alle valg",
    alert_action_needed: "Handling kræves",
    alert_more: "+{n} flere",
    overlay_paused: "PAUSE",
    overlay_cleaning: "RENSER",
    overlay_label_present_location: "Befinder sig i:",
    overlay_label_room_cleaning: "Renser rum:",
    overlay_pause: "Pause",
    overlay_resume: "Fortsæt",
    overlay_self_clean: "Selvrens",
    overlay_end_job: "Afslut",
    job_badge_one_room: "{n} rum",
    job_badge_rooms: "{n} rum",
    job_badge_selected: "Valgte",
    job_badge_all_rooms: "Alle rum",
    fallback_task_cleaning: "Renser",
    modal_title: "AVANCERET",
    modal_subtitle: "Rengøringsprofil og adfærd",
    modal_close: "Luk",
    modal_locate: "Find robotten",
    tab_cleaning: "Rengøring",
    tab_cleangenius: "CleanGenius",
    tab_custom: "Brugerdefineret",
    tab_behavior: "Adfærd",
    tab_dock: "Dock",
    section_schedule_audio: "TIDSPLAN & LYD",
    section_preferences: "PRÆFERENCER",
    section_carpets: "TÆPPER",
    toggle_dnd_title: "Forstyr ikke",
    toggle_dnd_sub: "Robotten er stille i indstillede timer",
    label_dnd_start: "Starttid",
    label_dnd_end: "Sluttid",
    label_volume: "Lydstyrke",
    toggle_resume_title: "Genoptag efter pause",
    toggle_resume_sub: "Fortsæt rengøring efter strømafbrydelse",
    toggle_child_lock_title: "Børnesikring",
    toggle_child_lock_sub: "Lås kontroller på dock'en",
    toggle_carpet_boost_title: "Tæppe-boost",
    toggle_carpet_boost_sub: "Mere sug på tæpper",
    toggle_carpet_avoid_title: "Undgå tæpper ved mop",
    toggle_carpet_avoid_sub: "Spring tæpper over under mop-opgaver",
    toggle_auto_mount_mop_title: "Auto-monter mop",
    toggle_auto_mount_mop_sub: "Robotten på/afmonterer selv moppen",
    section_auto_empty: "AUTO-TØMNING",
    section_mop_care: "MOP-PLEJE",
    toggle_auto_empty_title: "Auto-tømning",
    toggle_auto_empty_sub: "Tøm støvbeholder ind i dock'en automatisk",
    label_auto_empty_freq: "Tøm-hyppighed",
    toggle_auto_detergent_title: "Auto-tilsæt sæbe",
    toggle_auto_detergent_sub: "Tilsæt sæbe til mop-vand automatisk",
    label_drying_time: "Tørretid",
    section_quick_actions: "HURTIGE HANDLINGER",
    action_base_station_cleaning: "Rens dock",
    no_settings: "Ingen relevante entiteter er aktiveret i Home Assistant.",
    section_cleangenius_mode: "TILSTAND",
    section_cleangenius_mode_info: "Vælg hvor grundigt CleanGenius skal arbejde",
    section_cleangenius_behaviour: "CLEANGENIUS ADFÆRD",
    section_cleaning_mode: "RENGØRINGSTILSTAND",
    section_cleaning_times: "ANTAL GANGE",
    toggle_customized_title: "Tilpasset rengøring",
    toggle_customized_sub: "Brug indstillinger pr. rum i stedet for globale",
    section_per_room: "PR. RUM",
    section_per_room_info: "Hvert rum bruger sine egne indstillinger nedenfor",
    section_suction: "SUGEEFFEKT",
    toggle_maxplus_title: "Max+",
    toggle_maxplus_sub: "Boost sugeeffekten ud over turbo",
    section_mop_humidity: "MOP-FUGT",
    wetness_label_dry: "Let tør",
    wetness_label_damp: "Fugtig",
    wetness_label_wet: "Våd",
    section_mop_washing: "MOP-VASK",
    label_wash_every: "Vask hver",
    section_route: "RUTE",
    sub_cleaning_times: "ANTAL GANGE",
    sub_cleaning_times_disabled: "ANTAL GANGE — entitet ikke aktiveret",
    sub_suction: "SUGEEFFEKT",
    sub_wetness: "FUGTNIVEAU",
    sub_wetness_disabled: "FUGT — entitet ikke aktiveret",
    confirm_warnings_one: "Robotten har følgende advarsel:\n\n{messages}\n\nVil du starte rengøring alligevel?",
    confirm_warnings_many: "Robotten har følgende advarsler:\n\n{messages}\n\nVil du starte rengøring alligevel?",
    alert_select_room_first: "Vælg mindst ét rum først.",
    alert_missing_select: "Kunne ikke finde \"{label}\" som select-entitet.\n\nAktiver den i Home Assistant:\nIndstillinger → Enheder og tjenester → Dreame Vacuum → klik på din robot → \"+x deaktiverede enheder\" → find og aktivér \"{label}\".",
    alert_missing_entity: "Kunne ikke finde \"{label}\".\n\nAktiver den under Dreame Vacuum → klik på robotten → \"+x deaktiverede enheder\".",
    alert_missing_self_clean_btn: "Kunne ikke finde \"Self Clean\"-knappen. Aktivér \"{id}\" under Dreame Vacuum-integrationen.",
    alert_missing_self_clean_freq: "Kunne ikke finde \"Self Clean Frequency\". Aktivér den under Dreame Vacuum → \"+x deaktiverede enheder\".",
  },
  // -------------------------------------------------------------------------
  // Stubs for the remaining languages that the dreame_vacuum integration
  // ships translations for. Empty objects fall through to English at runtime.
  // Contributors: copy any key from TRANSLATIONS.en or TRANSLATIONS.da, paste
  // it into the language you want to fill in, and translate the value.
  // (pt covers pt-BR; zh covers both zh-Hans and zh-Hant, since `hass.locale`
  // is sliced to 2 chars in `_t()`.)
  // -------------------------------------------------------------------------
  ca: {}, cs: {}, de: {}, el: {}, es: {}, fr: {}, hu: {}, it: {},
  ko: {}, nl: {}, pl: {}, pt: {}, ro: {}, ru: {}, sl: {}, sv: {},
  uk: {}, zh: {},
};

// =============================================================================
// Localized Dreame labels — Danish translations of the English dictionaries
// above. Looked up by name (so the original English consts don't need to be
// modified). Add new languages by mirroring the structure here.
// =============================================================================
const LABEL_NAMES = new Map();

const LOCALIZED_LABELS = {
  da: {
    vacuum_state: {
      unknown: "Ukendt", sweeping: "Støvsuger", charging: "Oplader", error: "Fejl",
      idle: "Inaktiv", paused: "Pause", returning: "Tilbage til dock", mopping: "Mopper",
      drying: "Tørrer", washing: "Vasker", returning_to_wash: "Tilbage til vask",
      building: "Kortlægger", sweeping_and_mopping: "Støvsuger og mopper",
      charging_completed: "Opladet", upgrading: "Opdaterer", clean_summon: "Tilkaldt rengøring",
      station_reset: "Station nulstilles", returning_install_mop: "Tilbage for at montere mop",
      returning_remove_mop: "Tilbage for at afmontere mop", water_check: "Vandkontrol",
      clean_add_water: "Renser og tilsætter vand", washing_paused: "Vask pauseret",
      auto_emptying: "Auto-tømmer", remote_control: "Fjernstyret", smart_charging: "Smart-oplader",
      second_cleaning: "Anden rengøring", human_following: "Følger person",
      spot_cleaning: "Pletrengøring", returning_auto_empty: "Tilbage til auto-tømning",
      waiting_for_task: "Venter på opgave", station_cleaning: "Station-rengøring",
      returning_to_drain: "Tilbage for at tømme", draining: "Tømmer",
      auto_water_draining: "Auto-vandtømning", emptying: "Tømmer",
      dust_bag_drying: "Støvpose tørrer", dust_bag_drying_paused: "Støvpose-tørring pauseret",
      heading_to_extra_cleaning: "På vej til ekstra rengøring", extra_cleaning: "Ekstra rengøring",
      finding_pet_paused: "Finder kæledyr pauseret", finding_pet: "Finder kæledyr",
      shortcut: "Genvej", monitoring: "Overvåger", monitoring_paused: "Overvågning pauseret",
      initial_deep_cleaning: "Første dyb rengøring",
      initial_deep_cleaning_paused: "Første dyb rengøring pauseret",
      sanitizing: "Desinficerer", sanitizing_with_dry: "Desinficerer med tørring",
      changing_mop: "Skifter mop", changing_mop_paused: "Mopskifte pauseret",
      floor_maintaining: "Vedligeholder gulv", floor_maintaining_paused: "Gulvvedligehold pauseret",
      docked: "I dock", sleeping: "Sover", standby: "Standby",
    },
    vacuum_status: {
      unknown: "Ukendt", idle: "Inaktiv", paused: "Pause", cleaning: "Rengør",
      returning: "Tilbage til dock", spot_cleaning: "Pletrengøring",
      follow_wall_cleaning: "Følger væg", charging: "Oplader", ota: "OTA-opdatering",
      fct: "FCT", wifi_set: "WiFi-opsætning", power_off: "Slukket", factory: "Fabrik",
      error: "Fejl", remote_control: "Fjernstyret", sleeping: "Sover",
      self_repair: "Selvreparation", factory_test: "Fabrikstest", standby: "Standby",
      room_cleaning: "Rum-rengøring", zone_cleaning: "Zone-rengøring",
      fast_mapping: "Hurtig kortlægning", cruising_path: "Patruljerer rute",
      cruising_point: "Patruljerer punkt", summon_clean: "Tilkaldt rengøring",
      shortcut: "Genvej", person_follow: "Følger person", water_check: "Vandkontrol",
      docked: "I dock",
    },
    task_status: {
      unknown: "Ukendt", completed: "Færdig", cleaning: "Rengør",
      zone_cleaning: "Zone-rengøring", room_cleaning: "Rum-rengøring",
      spot_cleaning: "Pletrengøring", fast_mapping: "Hurtig kortlægning",
      cleaning_paused: "Rengøring pauseret", room_cleaning_paused: "Rum-rengøring pauseret",
      zone_cleaning_paused: "Zone-rengøring pauseret",
      spot_cleaning_paused: "Pletrengøring pauseret",
      map_cleaning_paused: "Kort-rengøring pauseret", docking_paused: "Dock pauseret",
      mopping_paused: "Mop pauseret", cruising_path: "Patruljerer rute",
      cruising_point: "Patruljerer punkt", station_cleaning: "Station-rengøring",
    },
    wash_base: {
      washing: "Mop vaskes", drying: "Mop tørres", paused: "Mop-vask pauseret",
      returning: "Tilbage til vask", clean_add_water: "Tilsæt vand til selvrens",
      adding_water: "Tilsætter vand",
    },
    charging_status: {
      charging: "Oplader", return_to_charge: "Tilbage til opladning",
      charging_completed: "Opladet",
    },
    low_water: {
      no_water_left_dismiss: "Tjek rentvandstanken", no_water_left: "Rentvandstank tom",
      no_water_left_after_clean: "Fyld vand + tøm beskidt vand",
      no_water_for_clean: "Lavt vand — skiftet til kun støvsugning",
      low_water: "Vandniveau lavt — fyld snart",
      tank_not_installed: "Rentvandstank ikke installeret",
    },
    clean_water_tank: {
      not_installed: "Rentvandstank mangler", low_water: "Genopfyld rent vand",
    },
    dirty_water_tank: {
      not_installed_or_full: "Tøm beskidt vandtank",
    },
    dust_bag: {
      not_installed: "Støvpose mangler", check: "Tjek støvpose",
    },
    detergent: {
      low_detergent: "Genopfyld sæbe",
    },
    dust_collection: {
      over_use: "Tøm støvbeholder (overbrugt)",
    },
    drainage: {
      draining: "Station tømmer", draining_failed: "Tømning fejlede",
    },
    mop_status: {
      not_installed: "Moppude ikke installeret",
    },
    // ---- Display-only translations of option values served by HA's Dreame
    // integration. The `data-...` attributes keep the original English value
    // (used in service calls); only the on-screen label is replaced. ----
    suction_level_opt: {
      quiet: "Stille", silent: "Stille",
      standard: "Standard", normal: "Standard",
      strong: "Stærk", turbo: "Turbo", max: "Maks",
    },
    cleaning_mode_opt: {
      sweeping: "Støvsugning", mopping: "Mop",
      sweeping_and_mopping: "Støvsug og mop",
      mopping_after_sweeping: "Mop efter støvsug",
      custom: "Brugerdefineret",
    },
    cleaning_route_opt: {
      quick: "Hurtig", fast: "Hurtig",
      standard: "Standard",
      deep: "Grundig", thorough: "Grundig",
    },
    cleangenius_opt: {
      off: "Fra", on: "Til",
      routine: "Rutine", daily: "Daglig",
      deep: "Grundig",
    },
    cleangenius_mode_opt: {
      standard: "Standard", daily: "Daglig",
      quick: "Hurtig", deep: "Grundig",
    },
    mop_pad_humidity_opt: {
      low: "Lav", medium: "Mellem", high: "Høj",
      max: "Maks", dry: "Tør", wet: "Våd",
    },
    self_clean_frequency_opt: {
      by_area: "Pr. areal", by_time: "Pr. tid", by_room: "Pr. rum",
      off: "Fra",
    },
    auto_empty_freq_opt: {
      smart: "Smart", auto: "Auto",
      always: "Altid", never: "Aldrig", off: "Fra", on: "Til",
      low: "Lav", high: "Høj",
    },
    error: {
      drop: "Hjul hænger", cliff: "Klippesensor-fejl", bumper: "Stødsensor sidder fast",
      gesture: "Robotten er skæv", bumper_repeat: "Stødsensor sidder fast",
      drop_repeat: "Hjul hænger", optical_flow: "Optisk flow-sensor fejl",
      no_box: "Støvbeholder ikke installeret", no_tank_box: "Vandtank ikke installeret",
      water_box_empty: "Vandtank er tom", box_full: "Filter blokeret eller vådt",
      brush: "Hovedbørste viklet", side_brush: "Sidebørste viklet",
      fan: "Filter blokeret eller vådt", left_wheel_motor: "Venstre hjul blokeret",
      right_wheel_motor: "Højre hjul blokeret", turn_suffocate: "Robotten sidder fast",
      forward_suffocate: "Robotten kan ikke køre frem", charger_get: "Kan ikke finde dock",
      battery_low: "Lavt batteri", charge_fault: "Opladningsfejl",
      battery_percentage: "Batteri-niveau-fejl", heart: "Intern fejl",
      camera_occlusion: "Kamera blokeret", remove_mop: "Mop færdig — fjern og rengør moppude",
      mop_removed: "Moppude faldt af", mop_pad_stop_rotate: "Moppude stoppede med at rotere",
      bin_full: "Støvopsamlings-pose fuld", bin_open: "Auto-tømnings-låg åbent",
      water_tank: "Rentvandstank ikke installeret",
      dirty_water_tank: "Beskidt vandtank fuld eller mangler",
      water_tank_dry: "Genopfyld rentvandstank",
      dirty_water_tank_blocked: "Beskidt vandtank blokeret",
      dirty_water_tank_pump: "Beskidt vandtank pumpefejl",
      mop_pad: "Vaskebræt ikke installeret korrekt", wet_mop_pad: "Rens vaskebrættet",
      clean_mop_pad: "Rengøring færdig — rens vaskebrættet",
      clean_tank_level: "Tjek og fyld rentvandstank",
      station_disconnected: "Basestation ikke tændt",
      dirty_tank_level: "Beskidt vandtank for fuld",
      washboard_level: "Vaskebræt-vand for højt", no_mop_in_station: "Moppude ikke i station",
      dust_bag_full: "Støvpose fuld", mop_install_failed: "Moppude-installation mislykkedes",
      low_battery_turn_off: "Lavt batteri — slukker",
      dirty_tank_not_installed: "Beskidt vandtank ikke installeret",
      robot_in_hidden_room: "Skjult område — flyt robotten",
      robot_stuck: "Robotten sidder fast",
      robot_stuck_repeat: "Robot fast — flyt til åbent område",
      robot_stuck_on_tables: "Robot fast blandt borde/stole",
      robot_stuck_on_passage: "Robot fast i smal passage",
      robot_stuck_on_threshold: "Robot fast ved tærskel/trin",
      robot_stuck_on_low_lying_area: "Robot fast under lavt møbel",
      robot_stuck_on_ramp: "Robot fandt farlig rampe",
      robot_stuck_on_obstacle: "Robot blokeret af forhindring",
      robot_stuck_on_pet: "Robot opdagede kæledyr/person",
      robot_stuck_on_slippery_surface: "Robot glider",
      robot_stuck_on_carpet: "Robot glider på tæppe",
      robot_stuck_on_curtain: "Robot glider i gardiner",
      blocked: "Rute blokeret — tilbage til dock",
      carpet: "Start robotten uden for tæppet",
      laser: "3D-forhindringssensor-fejl", ultrasonic: "Ultralyd-sensor-fejl",
      no_go_zone: "No-Go-zone fundet", route: "Rute blokeret",
      restricted: "Robot i begrænset område", drainage_failed: "Vandtømning fejlede",
      mop_not_detected: "Mop ikke fundet", mop_holder_error: "Mopholder-fejl i dock",
      dock_error: "Dock-fejl", wash_failed: "Mop-vask fejlede",
      edge_mop_stop_rotate: "Kantmop stoppede med at rotere",
      edge_mop_detached: "Kantmop faldt af", chassis_lift_malfunction: "Chassis-løft fejler",
      mop_cover_error: "Tjek aflejringer ved rulle-mop",
      roller_mop_error: "Tjek aflejringer ved rulle-mop",
      onboard_water_tank_empty: "Robotens vandbeholder lavt",
      onboard_dirty_water_tank_full: "Robotens brugte vandbeholder fuld",
      mop_not_installed: "Mop ikke installeret", fluffing_roller_error: "Fluff-rulle-fejl",
      blocked_by_obstacle: "Blokeret af forhindring",
      internal_error: "Intern fejl — prøv at genstarte",
    },
  },
  // -------------------------------------------------------------------------
  // Stubs for the remaining languages that the dreame_vacuum integration
  // supports. Empty objects fall through to the English source dicts.
  // Contributors: mirror the structure of `da` above to add a translation.
  // -------------------------------------------------------------------------
  ca: {}, cs: {}, de: {}, el: {}, es: {}, fr: {}, hu: {}, it: {},
  ko: {}, nl: {}, pl: {}, pt: {}, ro: {}, ru: {}, sl: {}, sv: {},
  uk: {}, zh: {},
};
LABEL_NAMES.set(VACUUM_STATE_LABELS,    "vacuum_state");
LABEL_NAMES.set(VACUUM_STATUS_LABELS,   "vacuum_status");
LABEL_NAMES.set(TASK_STATUS_LABELS,     "task_status");
LABEL_NAMES.set(WASH_BASE_LABELS,       "wash_base");
LABEL_NAMES.set(CHARGING_STATUS_LABELS, "charging_status");
LABEL_NAMES.set(LOW_WATER_LABELS,       "low_water");
LABEL_NAMES.set(CLEAN_WATER_TANK_LABELS,"clean_water_tank");
LABEL_NAMES.set(DIRTY_WATER_TANK_LABELS,"dirty_water_tank");
LABEL_NAMES.set(DUST_BAG_LABELS,        "dust_bag");
LABEL_NAMES.set(DETERGENT_LABELS,       "detergent");
LABEL_NAMES.set(DUST_COLLECTION_LABELS, "dust_collection");
LABEL_NAMES.set(DRAINAGE_LABELS,        "drainage");
LABEL_NAMES.set(MOP_STATUS_LABELS,      "mop_status");
LABEL_NAMES.set(ERROR_LABELS,           "error");

class DreameVacuumCard extends HTMLElement {
  setConfig(config) {
    if (!config.entity) throw new Error("You must define an entity");

    this.config = {
      // title: defaults to the entity's friendly_name at render-time
      // image: optional path to a robot image (e.g. "/local/my-robot.png").
      //        Falls back to a built-in icon when not set.
      ...config,
    };

    this.selectedRooms = new Set();
    this.advancedOpen = false;
    this.activeAdvancedTab = "cleaning"; // default: Cleaning (CleanGenius/Custom)
    this.expandedRooms = new Set(); // tracks which rooms are expanded in the per-room accordion
    this._globalCleaningTimes = this._loadCleaningTimes(); // 1, 2 or 3 — passed as `repeats` to the clean service
  }

  // Persist the user's "Cleaning times" choice (1x / 2x / 3x) per entity.
  _cleaningTimesKey() {
    return `dreamecard:${this.config?.entity || "default"}:cleaning-times`;
  }
  _loadCleaningTimes() {
    try {
      const v = parseInt(localStorage.getItem(this._cleaningTimesKey()), 10);
      return v >= 1 && v <= 3 ? v : 1;
    } catch (e) { return 1; }
  }
  _saveCleaningTimes(v) {
    try { localStorage.setItem(this._cleaningTimesKey(), String(v)); } catch (e) {}
  }
  // Look up a translation by key. Substitutes `{name}` placeholders from `vars`.
  // Falls back to English when the active language is missing a key, and to
  // the key itself if even English has no entry.
  _t(key, vars) {
    const lang = String(
      this._hass?.locale?.language || this._hass?.language || "en"
    ).slice(0, 2);
    const dict = TRANSLATIONS[lang] || TRANSLATIONS.en;
    let str = dict[key] != null ? dict[key] : (TRANSLATIONS.en[key] != null ? TRANSLATIONS.en[key] : key);
    if (vars) {
      for (const k in vars) {
        str = str.split("{" + k + "}").join(String(vars[k]));
      }
    }
    return str;
  }


  // Persistent storage for the last selected CleanGenius mode (per-entity).
  // Stored in localStorage so it survives page reloads within the same browser.
  get _lastCleanGeniusMode() {
    if (this._memLastCG !== undefined) return this._memLastCG;
    try {
      const key = `dreamecard:${this.config?.entity || "default"}:last-cleangenius`;
      const stored = localStorage.getItem(key);
      this._memLastCG = stored || null;
      return this._memLastCG;
    } catch (e) {
      return null;
    }
  }
  set _lastCleanGeniusMode(value) {
    this._memLastCG = value || null;
    try {
      const key = `dreamecard:${this.config?.entity || "default"}:last-cleangenius`;
      if (value) localStorage.setItem(key, value);
    } catch (e) {}
  }

  // Track which button started the currently-running job ("selected" / "all")
  _activeJobKey() {
    return `dreamecard:${this.config?.entity || "default"}:active-job`;
  }
  _setActiveJob(type) {
    try { localStorage.setItem(this._activeJobKey(), type); } catch (e) {}
  }
  _getActiveJob() {
    try { return localStorage.getItem(this._activeJobKey()) || null; } catch (e) { return null; }
  }
  _clearActiveJob() {
    try { localStorage.removeItem(this._activeJobKey()); } catch (e) {}
  }

  // Helpers for persisting the active job's selected rooms across navigation/reload
  _segmentsKey() {
    return `dreamecard:${this.config?.entity || "default"}:active-segments`;
  }
  _saveSelectedRooms() {
    try {
      const arr = Array.from(this.selectedRooms);
      if (arr.length) localStorage.setItem(this._segmentsKey(), JSON.stringify(arr));
    } catch (e) {}
  }
  _loadSelectedRooms() {
    try {
      // Only restore stored selection if there's a known active job. Otherwise the data
      // is stale from a previous session — wipe it so we don't show ghost checkmarks.
      if (!this._getActiveJob()) {
        this._clearSavedSelection();
        return;
      }
      const stored = localStorage.getItem(this._segmentsKey());
      if (!stored) return;
      const arr = JSON.parse(stored);
      if (Array.isArray(arr)) arr.forEach(s => this.selectedRooms.add(Number(s)));
    } catch (e) {}
  }
  _clearSavedSelection() {
    try { localStorage.removeItem(this._segmentsKey()); } catch (e) {}
  }
  // Wipe both the active-job tracker AND any room selection. Called when a job
  // transitions to "fully done" so the front-page room checkmarks reset.
  _clearJobAndSelection() {
    this._clearActiveJob();
    this.selectedRooms.clear();
    this._clearSavedSelection();
  }
  // Classify the robot's current overall situation. Used both for the overlay
  // visibility and for selection/active-job persistence.
  _getRobotStatus() {
    const e = this._hass?.states[this.config?.entity];
    if (!e) return "truly_idle";
    const stateStr = String(e.state).toLowerCase();
    const statusStr = String(e.attributes?.status || "").toLowerCase().trim();
    const inactiveStates = new Set(["docked", "idle", "charging", "error", "unavailable", "unknown", "sleeping", "standby", "off", ""]);

    // Use Dreame's task_status sensor as the most authoritative signal of whether
    // the cleaning task is still running. This survives state transitions to
    // "docked" mid-job (e.g. during a mid-cleaning mop wash) so we don't close
    // the overlay prematurely.
    const prefix = this.getEntityPrefix();
    const taskStatusEntity = prefix ? this._hass.states[`sensor.${prefix}_task_status`] : null;
    const taskStatusValue = String(taskStatusEntity?.state || "").toLowerCase().trim();
    const isTaskCompleted = /^(completed|finished|done|stopped|terminated|idle)$/.test(taskStatusValue);
    const isTaskInProgress = /^(in[\s_-]?progress|cleaning|running|active|paused)$/.test(taskStatusValue);

    // Patterns that mean "the dock is actively doing something for the robot right now"
    const isActiveDockWork = /^(washing|drying|self.?clean(ing)?|mop[\s_-]?(wash|dry)(ing)?)$/i.test(statusStr);
    const hasActiveJob = !!this._getActiveJob();

    // ===== State is an ACTIVE value (cleaning/mopping/returning/sweeping/paused) =====
    if (!inactiveStates.has(stateStr)) {
      const isDockMaint = /charg|self.?clean|self.?wash|wash|dry/.test(statusStr);
      if (!isDockMaint) return "in_room_cleaning";
      if (hasActiveJob || isTaskInProgress) return "mid_job_dock";
      return "dock_idle_maintenance";
    }

    // ===== State is INACTIVE (docked/idle/charging/sleeping/etc.) =====
    // Dreame says task is fully completed → close overlay
    if (isTaskCompleted) return "truly_idle";

    // task_status sensor says the task is still in progress — likely a mid-job
    // dock visit (mop wash / drying). Keep overlay open if the dock is actively
    // doing work; otherwise treat as idle.
    if (isTaskInProgress) {
      if (isActiveDockWork) return "mid_job_dock";
      return "truly_idle";
    }

    // No task_status sensor available — fall back to local active-job tracker
    // combined with status text. Only keep overlay if the dock is clearly working.
    if (hasActiveJob && isActiveDockWork) return "mid_job_dock";

    return "truly_idle";
  }

  _isVacuumActive() {
    const s = this._getRobotStatus();
    return s === "in_room_cleaning" || s === "mid_job_dock";
  }

  set hass(hass) {
    const isFirstHass = !this._hass;
    this._hass = hass;

    const currentRobotStatus = this._getRobotStatus();

    if (isFirstHass) {
      this._loadSelectedRooms();
      // If we were navigated away during a job and the robot has finished while we were
      // gone, clean up the leftover selection now.
      if (currentRobotStatus === "truly_idle" && this._getActiveJob()) {
        this._clearJobAndSelection();
      }
    } else {
      // Detect transition from active → truly_idle = the job just ended.
      // Clear room selection + active-job tracker so the front-page checkmarks disappear.
      const wasActive = this._lastRobotStatus && this._lastRobotStatus !== "truly_idle";
      if (currentRobotStatus === "truly_idle") {
        if (wasActive) {
          this._clearJobAndSelection();
        } else {
          // Robot has been idle the whole time — just make sure tracker is clear
          this._clearActiveJob();
        }
      }
    }

    this._lastRobotStatus = currentRobotStatus;

    // Skip the render entirely while a CSS animation (e.g. the CleanGenius
    // slide toggle) is in progress — replacing innerHTML would interrupt it.
    // The pending state will be picked up when the timer fires render() again.
    if (this._suspendRender) return;

    // Only re-render when something we actually display has changed.
    // Without this, HA fires hass updates many times per second for unrelated
    // entities, and re-rendering the whole DOM every time resets modal scroll
    // position, breaks animations, etc.
    const fp = this.computeFingerprint();
    if (fp === this._lastFingerprint) return;
    this._lastFingerprint = fp;
    this.render();
  }

  // Build a string fingerprint of state we actually show. Re-render only when it changes.
  computeFingerprint() {
    if (!this._hass) return "";
    const e = this._hass.states[this.config.entity];
    if (!e) return "no-entity";

    const parts = [e.state];
    const a = e.attributes || {};
    parts.push(
      a.battery, a.cleaned_area, a.cleaning_time, a.cleaning_mode, a.status, a.error,
      a.error_description, a.suction_level, a.fan_speed, a.cleangenius, a.cleangenius_mode,
      a.cleaning_route, a.mop_pad_humidity, a.selected_map,
      a.current_segment, a.cleaning_segment, a.task_type, a.task_status,
      JSON.stringify(a.rooms || null),
      JSON.stringify(a.cleaning_rooms || a.segments || null)
    );

    // All related dreame_vacuum entities (selects, numbers, switches, binary_sensors)
    const prefix = this.getEntityPrefix();
    if (prefix) {
      const states = this._hass.states;
      for (const id in states) {
        if (!id.includes(prefix)) continue;
        parts.push(id, states[id].state);
      }
    }

    // Also UI state that affects what we render
    parts.push(this.advancedOpen ? "1" : "0", this.activeAdvancedTab,
      Array.from(this.selectedRooms).sort().join(","),
      Array.from(this.expandedRooms).sort().join(","),
      this._getActiveJob() || "",
      String(this._globalCleaningTimes));

    return parts.join("|");
  }

  call(domain, service, data = {}) {
    this._hass.callService(domain, service, data);
  }

  getEntity() {
    return this._hass.states[this.config.entity];
  }

  getRooms(entity) {
    const selectedMap = entity.attributes.selected_map;
    const rooms = entity.attributes.rooms?.[selectedMap] || [];
    if (!this._hass) return rooms;
    const prefix = this.getEntityPrefix();
    if (!prefix) return rooms;

    // Sort by the per-room `Order` entity (select.<prefix>_room_<id>_order).
    // Rooms without a valid Order value keep Dreame's default placement at
    // the end of the list — that way the card stays useful for users who
    // haven't enabled the Order entities.
    return rooms.slice().sort((a, b) => {
      const orderA = parseInt(this._hass.states[`select.${prefix}_room_${a.id}_order`]?.state, 10);
      const orderB = parseInt(this._hass.states[`select.${prefix}_room_${b.id}_order`]?.state, 10);
      const validA = !isNaN(orderA);
      const validB = !isNaN(orderB);
      if (validA && validB) return orderA - orderB;
      if (validA) return -1;
      if (validB) return 1;
      return 0;
    });
  }

  // ----- generic helpers -----
  // Read a sensor state, returning null when missing/unknown/unavailable
  _sensorValue(key) {
    const prefix = this.getEntityPrefix();
    if (!prefix || !this._hass) return null;
    const s = this._hass.states[`sensor.${prefix}_${key}`];
    if (!s) return null;
    const v = String(s.state ?? "").toLowerCase().trim();
    if (!v || v === "unknown" || v === "unavailable" || v === "none") return null;
    return v;
  }

  // Translate a raw value through a label dictionary. Returns null if the
  // dictionary entry is null (i.e. should not be displayed) and falls back to
  // the original value if no entry exists.
  // When the active language has a localized version of the dict, that is
  // checked first; the English dict serves as the fallback.
  _label(value, dict) {
    if (value == null) return null;
    const key = String(value).toLowerCase().trim();
    const lang = String(this._hass?.locale?.language || this._hass?.language || "en").slice(0, 2);
    if (lang !== "en") {
      const name = LABEL_NAMES.get(dict);
      const localized = name && LOCALIZED_LABELS[lang] ? LOCALIZED_LABELS[lang][name] : null;
      if (localized && key in localized) return localized[key];
    }
    if (key in dict) return dict[key]; // explicit null is meaningful
    return value;
  }

  // Translate a Dreame option value (suction, cleaning_mode, route, etc.) for
  // display only. The original value is preserved for service calls. Falls
  // back to the original string when no translation exists.
  _optLabel(value, dictName) {
    if (value == null) return value;
    const lang = String(this._hass?.locale?.language || this._hass?.language || "en").slice(0, 2);
    if (lang === "en") return value;
    const dict = LOCALIZED_LABELS[lang] && LOCALIZED_LABELS[lang][dictName];
    if (!dict) return value;
    const key = String(value).toLowerCase().trim().replace(/\s+/g, "_");
    return dict[key] != null ? dict[key] : value;
  }

  // ----- warnings / alerts -----
  getWarnings() {
    const warnings = [];
    const prefix = this.getEntityPrefix();
    if (!prefix || !this._hass) return warnings;

    const seen = new Set();
    const push = (label, icon) => {
      if (!label || seen.has(label)) return;
      warnings.push({ label, icon: icon || ALERT_ICONS.default });
      seen.add(label);
    };

    // 1. Vacuum entity's "error" attribute (real fault state).
    // Normalize spaces to underscores so "no error" matches "no_error" etc.
    const vacuum = this.getEntity();
    const err = String(vacuum?.attributes?.error ?? "").toLowerCase().trim().replace(/\s+/g, "_");
    const errDesc = vacuum?.attributes?.error_description;
    const noErrorValues = new Set(["no_error", "none", "null", "0", "ok", "unknown"]);
    if (err && !noErrorValues.has(err)) {
      const friendly = this._label(err, ERROR_LABELS) || errDesc || `Error: ${err}`;
      if (friendly) push(friendly, ALERT_ICONS.alert);
    }

    // 2. error sensor (often holds notifications too: remove_mop, clean_add_water etc.)
    const errSensorRaw = this._sensorValue("error");
    const errSensor = errSensorRaw ? errSensorRaw.replace(/\s+/g, "_") : null;
    if (errSensor && !noErrorValues.has(errSensor)) {
      const friendly = this._label(errSensor, ERROR_LABELS);
      if (friendly) {
        const icon = /water/.test(errSensor) ? ALERT_ICONS.water
          : /mop/.test(errSensor) ? ALERT_ICONS.mop
          : /dust|bin/.test(errSensor) ? ALERT_ICONS.dust
          : /brush/.test(errSensor) ? ALERT_ICONS.brush
          : ALERT_ICONS.alert;
        push(friendly, icon);
      }
    }

    // 3. low_water_warning sensor
    const lowWater = this._sensorValue("low_water_warning");
    if (lowWater) {
      const label = this._label(lowWater, LOW_WATER_LABELS);
      if (label) push(label, ALERT_ICONS.water);
    }

    // 4. self_wash_base_status — only the action-prompt values become alerts
    //    (washing/drying are status info shown elsewhere, not alerts)
    const wash = this._sensorValue("self_wash_base_status");
    if (wash === "clean_add_water" || wash === "adding_water") {
      push(this._label(wash, WASH_BASE_LABELS) || "Add water for self-clean", ALERT_ICONS.add_water);
    }

    // 5. Tank/bag/detergent statuses
    const tankChecks = [
      ["clean_water_tank_status", CLEAN_WATER_TANK_LABELS, ALERT_ICONS.clean_water],
      ["dirty_water_tank_status", DIRTY_WATER_TANK_LABELS, ALERT_ICONS.dirty_water],
      ["dust_bag_status",         DUST_BAG_LABELS,         ALERT_ICONS.dust],
      ["detergent_status",        DETERGENT_LABELS,        ALERT_ICONS.detergent],
      ["dust_collection",         DUST_COLLECTION_LABELS,  ALERT_ICONS.dust],
      ["mop",                     MOP_STATUS_LABELS,       ALERT_ICONS.mop],
      ["drainage_status",         DRAINAGE_LABELS,         ALERT_ICONS.dirty_water],
    ];
    for (const [sensorKey, dict, icon] of tankChecks) {
      const val = this._sensorValue(sensorKey);
      if (!val) continue;
      const label = dict[val];
      if (label) push(label, icon);
    }

    // 6. Maintenance-related binary sensors with state "on" = needs attention
    const maintBinarySensors = [
      { keys: ["water_tank", "low_water"], label: "Refill clean water", icon: ALERT_ICONS.clean_water },
      { keys: ["dirty_water_tank", "dirty_water"], label: "Empty dirty water", icon: ALERT_ICONS.dirty_water },
      { keys: ["dust_collection", "dust_bag", "dust_box"], label: "Empty dust bin", icon: ALERT_ICONS.dust },
      { keys: ["detergent"], label: "Refill detergent", icon: ALERT_ICONS.detergent },
      { keys: ["main_brush"], label: "Replace main brush", icon: ALERT_ICONS.brush },
      { keys: ["side_brush"], label: "Replace side brush", icon: ALERT_ICONS.brush },
      { keys: ["filter"], label: "Replace filter", icon: "mdi:air-filter" },
      { keys: ["mop_pad", "mop"], label: "Replace mop pad", icon: ALERT_ICONS.mop },
      { keys: ["sensor_dirty"], label: "Clean sensors", icon: "mdi:radar" },
    ];
    for (const m of maintBinarySensors) {
      for (const key of m.keys) {
        const id = `binary_sensor.${prefix}_${key}`;
        const state = this._hass.states[id];
        if (state && (state.state === "on" || state.state === "true")) {
          push(m.label, m.icon);
          break;
        }
      }
    }

    // 7. Informational: mop drying progress (not a warning, but useful at a glance)
    const dryingProgress = this._hass.states[`sensor.${prefix}_drying_progress`];
    if (dryingProgress) {
      const pct = Number(dryingProgress.state);
      if (!isNaN(pct) && pct > 0 && pct < 100) {
        push(`Mop drying ${pct}%`, ALERT_ICONS.drying);
      }
    }

    return warnings;
  }

  // ----- stat ring renderer (same look for all 4 cells) -----
  renderStatRing(icon, percent, isActive) {
    const r = 26;
    const c = 2 * Math.PI * r;
    const p = Math.max(0, Math.min(100, Number(percent) || 0));
    const offset = c - (p / 100) * c;
    return `
      <div class="stat-circle ${isActive ? "active" : ""}">
        <svg class="stat-ring" viewBox="0 0 60 60" aria-hidden="true">
          <circle class="ring-bg" cx="30" cy="30" r="${r}" fill="none" stroke-width="4"/>
          <circle class="ring-fg" cx="30" cy="30" r="${r}" fill="none" stroke-width="4"
            stroke-dasharray="${c}" stroke-dashoffset="${offset}"
            stroke-linecap="round" transform="rotate(-90 30 30)"/>
        </svg>
        <ha-icon icon="${icon}"></ha-icon>
      </div>
    `;
  }

  // ----- icon helpers -----
  getRoomIcon(name) {
    const n = (name || "").toLowerCase();
    if (n.includes("kitchen")) return "mdi:countertop";
    if (n.includes("dining")) return "mdi:silverware";
    if (n.includes("small bath")) return "mdi:shower-head";
    if (n.includes("large bath")) return "mdi:shower";
    if (n.includes("bath")) return "mdi:shower-head";
    if (n.includes("bedroom")) return "mdi:bed-double";
    if (n.includes("living")) return "mdi:sofa";
    if (n.includes("laundry")) return "mdi:washing-machine";
    if (n.includes("office")) return "mdi:chair-rolling";
    if (n.includes("hall")) return "mdi:walk";
    if (n.includes("entry")) return "mdi:coat-rack";
    if (n.includes("outdoor") || n.includes("garden") || n.includes("yard")) return "mdi:clouds";
    if (n.includes("reading")) return "mdi:book-open-page-variant";
    if (n.includes("shed")) return "mdi:greenhouse";
    if (n.includes("training") || n.includes("gym")) return "mdi:run";
    if (n.includes("walk-in") || n.includes("walkin") || n.includes("closet") || n.includes("wardrobe")) return "mdi:hanger";
    return "mdi:home-outline";
  }

  getSuctionIcon(name) {
    const n = (name || "").toLowerCase();
    if (n.includes("quiet") || n.includes("silent")) return "mdi:volume-low";
    if (n.includes("standard") || n.includes("normal")) return "mdi:fan";
    if (n.includes("strong")) return "mdi:fan-speed-2";
    if (n.includes("turbo") || n.includes("max")) return "mdi:fan-speed-3";
    return "mdi:fan";
  }

  getModeIcon(name) {
    const n = (name || "").toLowerCase();
    if (n.includes("custom")) return "mdi:tune-vertical";
    if (n.includes("after")) return "mdi:autorenew";
    if ((n.includes("sweep") || n.includes("vac")) && n.includes("mop")) return "mdi:vacuum";
    if (n.includes("mop")) return "mdi:water-outline";
    if (n.includes("sweep") || n.includes("vacuum") || n.includes("vac")) return "mdi:broom";
    return "mdi:robot-vacuum";
  }

  getRouteIcon(name) {
    const n = (name || "").toLowerCase();
    if (n.includes("quick") || n.includes("fast")) return "mdi:flash-outline";
    if (n.includes("deep") || n.includes("thorough")) return "mdi:vector-line";
    return "mdi:routes";
  }

  getHumidityIcon(name) {
    const n = (name || "").toLowerCase();
    if (n.includes("low") || n.includes("dry")) return "mdi:water-percent";
    if (n.includes("medium") || n.includes("med")) return "mdi:water";
    if (n.includes("high")) return "mdi:water-plus";
    if (n.includes("max") || n.includes("wet")) return "mdi:waves";
    return "mdi:water-percent";
  }

  getCleanGeniusIcon(name) {
    const n = (name || "").toLowerCase();
    if (n.includes("off")) return "mdi:auto-fix-off";
    if (n.includes("on")) return "mdi:auto-fix";
    if (n.includes("auto")) return "mdi:robot-happy-outline";
    return "mdi:auto-fix";
  }

  getCleanGeniusModeIcon(name) {
    const n = (name || "").toLowerCase();
    if (n.includes("daily")) return "mdi:calendar-today";
    if (n.includes("deep")) return "mdi:water-pump";
    if (n.includes("quick")) return "mdi:flash-outline";
    return "mdi:robot-vacuum-variant";
  }

  getSelfCleanFreqIcon(name) {
    const n = (name || "").toLowerCase();
    if (n.includes("area")) return "mdi:floor-plan";
    if (n.includes("time")) return "mdi:timer-outline";
    if (n.includes("room")) return "mdi:home-group";
    return "mdi:auto-mode";
  }

  // ----- entity resolution (selects) -----
  normalize(value) {
    return String(value || "").trim().toLowerCase();
  }

  getEntityPrefix() {
    return (this.config.entity || "").split(".")[1] || "";
  }

  findSelectEntityByOptions(options, currentValue) {
    if (!options || !options.length) return null;
    const wantedOptions = options.map((x) => this.normalize(x));
    const current = this.normalize(currentValue);
    const candidates = Object.values(this._hass.states).filter((state) => {
      if (!state.entity_id.startsWith("select.")) return false;
      const entityOptions = state.attributes.options || [];
      const normalizedOptions = entityOptions.map((x) => this.normalize(x));
      const hasAllOptions = wantedOptions.every((option) => normalizedOptions.includes(option));
      const currentMatches = !current || this.normalize(state.state) === current;
      return hasAllOptions && currentMatches;
    });
    return candidates[0]?.entity_id || null;
  }

  findSettingSelect(configKey, suffixCandidates, options, currentValue) {
    const configured = this.config.entities?.[configKey];
    if (configured && this._hass.states[configured]) return configured;
    const prefix = this.getEntityPrefix();
    if (prefix) {
      for (const suffix of suffixCandidates) {
        const id = `select.${prefix}_${suffix}`;
        if (this._hass.states[id]) return id;
      }
    }
    return this.findSelectEntityByOptions(options, currentValue);
  }

  setSelectSetting(configKey, suffixCandidates, options, currentValue, option, label) {
    const entityId = this.findSettingSelect(configKey, suffixCandidates, options, currentValue);
    if (!entityId) {
      alert(this._t("alert_missing_select", { label }));
      return;
    }
    // The vacuum entity's *_list attributes give us localised/title-cased
    // labels like "Sweeping and mopping" or "Quiet", but the select entity
    // expects raw lowercase_underscored values like "sweeping_and_mopping".
    // Look up the matching raw option from the entity's actual options list.
    const entityState = this._hass.states[entityId];
    const entityOptions = entityState?.attributes?.options || [];
    const norm = (v) => String(v ?? "").toLowerCase().replace(/\s+/g, "_");
    const target = norm(option);
    const matched = entityOptions.find((o) => norm(o) === target) || option;
    this.call("select", "select_option", { entity_id: entityId, option: matched });
  }

  // ----- switch entity helpers -----
  findSwitchEntity(configKey, suffixCandidates) {
    const configured = this.config.entities?.[configKey];
    if (configured && this._hass.states[configured]) return configured;
    const prefix = this.getEntityPrefix();
    if (prefix) {
      for (const suffix of suffixCandidates) {
        const id = `switch.${prefix}_${suffix}`;
        if (this._hass.states[id]) return id;
      }
    }
    return null;
  }

  getSwitchState(configKey, suffixCandidates) {
    const id = this.findSwitchEntity(configKey, suffixCandidates);
    if (!id) return null;
    return this._hass.states[id]?.state === "on";
  }

  toggleSwitch(configKey, suffixCandidates, label) {
    const id = this.findSwitchEntity(configKey, suffixCandidates);
    if (!id) {
      alert(this._t("alert_missing_entity", { label }));
      return;
    }
    this.call("switch", "toggle", { entity_id: id });
  }

  // ----- button entity helpers -----
  findButtonEntity(configKey, suffixCandidates) {
    const configured = this.config.entities?.[configKey];
    if (configured && this._hass.states[configured]) return configured;
    const prefix = this.getEntityPrefix();
    if (prefix) {
      for (const suffix of suffixCandidates) {
        const id = `button.${prefix}_${suffix}`;
        if (this._hass.states[id]) return id;
      }
    }
    return null;
  }

  pressButton(configKey, suffixCandidates) {
    const id = this.findButtonEntity(configKey, suffixCandidates);
    if (id) this.call("button", "press", { entity_id: id });
  }

  // ----- time entity helpers -----
  findTimeEntity(configKey, suffixCandidates) {
    const configured = this.config.entities?.[configKey];
    if (configured && this._hass.states[configured]) return configured;
    const prefix = this.getEntityPrefix();
    if (prefix) {
      for (const suffix of suffixCandidates) {
        const id = `time.${prefix}_${suffix}`;
        if (this._hass.states[id]) return id;
      }
    }
    return null;
  }

  setTimeValue(configKey, suffixCandidates, value) {
    const id = this.findTimeEntity(configKey, suffixCandidates);
    if (!id) return;
    // HA's time.set_value expects a "HH:MM:SS" string
    const v = value.length === 5 ? value + ":00" : value;
    this.call("time", "set_value", { entity_id: id, time: v });
  }

  // ----- number entity helpers -----
  findNumberEntity(configKey, suffixCandidates) {
    const configured = this.config.entities?.[configKey];
    if (configured && this._hass.states[configured]) return configured;
    const prefix = this.getEntityPrefix();
    if (prefix) {
      for (const suffix of suffixCandidates) {
        const id = `number.${prefix}_${suffix}`;
        if (this._hass.states[id]) return id;
      }
    }
    return null;
  }

  getNumberState(configKey, suffixCandidates) {
    const id = this.findNumberEntity(configKey, suffixCandidates);
    if (!id) return null;
    const s = this._hass.states[id];
    if (!s) return null;
    return {
      entityId: id,
      value: parseFloat(s.state) || 0,
      min: parseFloat(s.attributes.min ?? 0),
      max: parseFloat(s.attributes.max ?? 100),
      step: parseFloat(s.attributes.step ?? 1),
      unit: s.attributes.unit_of_measurement || ""
    };
  }

  setNumberValue(configKey, suffixCandidates, value, label) {
    const id = this.findNumberEntity(configKey, suffixCandidates);
    if (!id) {
      alert(this._t("alert_missing_entity", { label }));
      return;
    }
    this.call("number", "set_value", { entity_id: id, value: Number(value) });
  }

  // ----- per-room entity helpers -----
  findRoomEntity(platform, roomId, key) {
    const prefix = this.getEntityPrefix();
    if (!prefix) return null;
    const id = `${platform}.${prefix}_room_${roomId}_${key}`;
    return this._hass.states[id] ? id : null;
  }

  getRoomEntityState(platform, roomId, key) {
    const id = this.findRoomEntity(platform, roomId, key);
    if (!id) return null;
    const s = this._hass.states[id];
    if (!s) return null;
    if (platform === "number") {
      return {
        entityId: id,
        value: parseFloat(s.state) || 0,
        min: parseFloat(s.attributes.min ?? 1),
        max: parseFloat(s.attributes.max ?? 30),
        step: parseFloat(s.attributes.step ?? 1)
      };
    }
    return {
      entityId: id,
      state: s.state,
      options: s.attributes.options || []
    };
  }

  setRoomSelect(roomId, key, value) {
    const id = this.findRoomEntity("select", roomId, key);
    if (!id) return;
    this.call("select", "select_option", { entity_id: id, option: value });
  }

  setRoomNumber(roomId, key, value) {
    const id = this.findRoomEntity("number", roomId, key);
    if (!id) return;
    this.call("number", "set_value", { entity_id: id, value: Number(value) });
  }

  // ----- room actions -----
  toggleRoom(id) {
    this.selectedRooms.has(id) ? this.selectedRooms.delete(id) : this.selectedRooms.add(id);
    this.render();
  }

  toggleRoomExpand(id) {
    if (this.expandedRooms.has(id)) this.expandedRooms.delete(id);
    else this.expandedRooms.add(id);
    this.render();
  }

  selectAll(rooms) {
    rooms.forEach((room) => this.selectedRooms.add(room.id));
    this.render();
  }

  clearSelection() {
    this.selectedRooms.clear();
    this._clearSavedSelection();
    this.render();
  }

  // Show the user any active warnings before starting a clean. Returns true if user
  // confirmed to proceed (or there were no warnings), false if they cancelled.
  _confirmStartIfWarnings() {
    const warnings = this.getWarnings();
    if (!warnings.length) return true;
    const messages = warnings.map(w => `• ${w.label}`).join("\n");
    return confirm(
      this._t(warnings.length > 1 ? "confirm_warnings_many" : "confirm_warnings_one", { messages })
    );
  }

  // ----- vacuum actions -----
  cleanSelected() {
    const segments = Array.from(this.selectedRooms);
    if (!segments.length) {
      alert(this._t("alert_select_room_first"));
      return;
    }
    if (!this._confirmStartIfWarnings()) return;
    const data = { entity_id: this.config.entity, segments };
    // Pass the global cleaning_times as `repeats` (only when not 1, since 1 is default)
    if (this._globalCleaningTimes && this._globalCleaningTimes > 1) {
      data.repeats = this._globalCleaningTimes;
    }
    this.call("dreame_vacuum", "vacuum_clean_segment", data);
    // Persist the selection + which button started the job
    this._saveSelectedRooms();
    this._setActiveJob("selected");
  }

  cleanAll() {
    if (!this._confirmStartIfWarnings()) return;
    // If the user picked 2x/3x, route through vacuum_clean_segment with all
    // rooms so the `repeats` parameter is honoured. Otherwise use plain
    // vacuum.start which is simpler and triggers Dreame's default flow.
    if (this._globalCleaningTimes && this._globalCleaningTimes > 1) {
      const allRooms = this.getRooms(this.getEntity()).map(r => r.id);
      if (allRooms.length) {
        this.call("dreame_vacuum", "vacuum_clean_segment", {
          entity_id: this.config.entity,
          segments: allRooms,
          repeats: this._globalCleaningTimes,
        });
        this._setActiveJob("all");
        return;
      }
    }
    this.call("vacuum", "start", { entity_id: this.config.entity });
    this._setActiveJob("all");
  }
  dock() { this.call("vacuum", "return_to_base", { entity_id: this.config.entity }); }
  pause() { this.call("vacuum", "pause", { entity_id: this.config.entity }); }
  stop() { this.call("vacuum", "stop", { entity_id: this.config.entity }); }
  locate() { this.call("vacuum", "locate", { entity_id: this.config.entity }); }

  pauseOrResume() {
    const state = String(this.getEntity()?.state || "").toLowerCase();
    if (state === "paused") {
      this.call("vacuum", "start", { entity_id: this.config.entity });
    } else {
      this.call("vacuum", "pause", { entity_id: this.config.entity });
    }
  }

  selfClean() {
    const id = `button.${this.getEntityPrefix()}_self_clean`;
    if (this._hass.states[id]) {
      this.call("button", "press", { entity_id: id });
    } else {
      alert(this._t("alert_missing_self_clean_btn", { id }));
    }
  }

  setFanSpeed(speed, attr) {
    // The vacuum.set_fan_speed service uses internal english names ("Silent")
    // while the displayed list uses localised names ("Quiet"). Use the select
    // entity directly so the labels match what's accepted.
    this.setSelectSetting(
      "suction_level",
      ["suction_level"],
      attr?.suction_level_list || attr?.fan_speed_list || [],
      attr?.suction_level || attr?.fan_speed,
      speed,
      "Suction Power"
    );
  }

  setCleaningMode(mode, attr) {
    this.setSelectSetting("cleaning_mode", ["cleaning_mode"],
      attr.cleaning_mode_list || [], attr.cleaning_mode, mode, "Cleaning Mode");
  }
  setCleanGenius(mode, attr) {
    this.setSelectSetting("cleangenius", ["cleangenius", "clean_genius"],
      attr.cleangenius_list || [], attr.cleangenius, mode, "CleanGenius");
  }
  setCleanGeniusMode(mode, attr) {
    this.setSelectSetting("cleangenius_mode", ["cleangenius_mode", "clean_genius_mode"],
      attr.cleangenius_mode_list || [], attr.cleangenius_mode, mode, "CleanGenius Mode");
  }
  setRoute(route, attr) {
    this.setSelectSetting("cleaning_route", ["cleaning_route", "route"],
      attr.cleaning_route_list || [], attr.cleaning_route, route, "Cleaning Route");
  }
  setMopHumidity(mode, attr) {
    this.setSelectSetting("mop_pad_humidity", ["mop_pad_humidity", "water_volume"],
      attr.mop_pad_humidity_list || [], attr.mop_pad_humidity, mode, "Mop Humidity");
  }
  setSelfCleanFrequency(value) {
    const id = this.findSettingSelect("self_clean_frequency", ["self_clean_frequency"], [], "");
    if (!id) {
      alert(this._t("alert_missing_self_clean_freq"));
      return;
    }
    this.call("select", "select_option", { entity_id: id, option: value });
  }

  // Format raw option value ("by_area" → "By Area")
  formatLabel(value) {
    if (!value) return "";
    return String(value)
      .replace(/[_-]+/g, " ")
      .split(" ")
      .filter(Boolean)
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
      .join(" ");
  }

  // ----- advanced popup -----
  renderAdvancedPopup(attr) {
    if (!this.advancedOpen) return "";

    const suctionList = attr.suction_level_list || attr.fan_speed_list || [];
    const cleangeniusList = attr.cleangenius_list || [];
    const cleangeniusModeList = attr.cleangenius_mode_list || [];
    const routeList = attr.cleaning_route_list || [];
    const cleaningModeList = attr.cleaning_mode_list || [];
    const mopHumidityList = attr.mop_pad_humidity_list || [];
    const currentSuction = attr.suction_level || attr.fan_speed;

    // Self-clean entities
    const selfCleanFreqId = this.findSettingSelect("self_clean_frequency", ["self_clean_frequency"], [], "");
    const selfCleanFreq = selfCleanFreqId ? this._hass.states[selfCleanFreqId] : null;
    const selfCleanFreqOptions = selfCleanFreq?.attributes.options || [];
    const selfCleanFreqValue = selfCleanFreq?.state;
    const selfCleanArea = this.getNumberState("self_clean_area", ["self_clean_area"]);
    const selfCleanTime = this.getNumberState("self_clean_time", ["self_clean_time"]);
    // Force time slider to 10-20 min with 1 min steps (user-requested range)
    if (selfCleanTime) {
      selfCleanTime.min = 10;
      selfCleanTime.max = 20;
      selfCleanTime.step = 1;
      // Clamp current value to the new range
      if (selfCleanTime.value < 10) selfCleanTime.value = 10;
      if (selfCleanTime.value > 20) selfCleanTime.value = 20;
    }

    // Switches
    const maxPowerOn = this.getSwitchState("max_suction_power", ["max_suction_power"]);
    const maxPowerExists = this.findSwitchEntity("max_suction_power", ["max_suction_power"]) !== null;

    const rooms = this.getRooms(this.getEntity());

    return `
      <div class="modal-backdrop" id="modalBackdrop">
        <div class="modal" id="advancedModal">
          <div class="modal-header">
            <div>
              <div class="modal-title">${this._t("modal_title")}</div>
              <div class="modal-subtitle">${this._t("modal_subtitle")}</div>
            </div>
            <button class="round-btn" id="closeAdvanced" aria-label="${this._t("modal_close")}" type="button">
              <ha-icon icon="mdi:close"></ha-icon>
            </button>
          </div>

          <button class="modal-quick-action" id="locateInModal" type="button">
            <ha-icon icon="mdi:crosshairs-gps"></ha-icon>
            <span>${this._t("modal_locate")}</span>
          </button>

          <div class="tabs three">
            <button class="tab ${this.activeAdvancedTab === "cleaning" ? "active" : ""}" data-tab="cleaning" type="button">
              <ha-icon icon="mdi:broom"></ha-icon>
              <span>${this._t("tab_cleaning")}</span>
            </button>
            <button class="tab ${this.activeAdvancedTab === "behavior" ? "active" : ""}" data-tab="behavior" type="button">
              <ha-icon icon="mdi:robot-vacuum-variant"></ha-icon>
              <span>${this._t("tab_behavior")}</span>
            </button>
            <button class="tab ${this.activeAdvancedTab === "dock" ? "active" : ""}" data-tab="dock" type="button">
              <ha-icon icon="mdi:home-import-outline"></ha-icon>
              <span>${this._t("tab_dock")}</span>
            </button>
          </div>

          ${this.activeAdvancedTab === "cleaning" ? this.renderCleaningTab(attr, cleaningModeList, suctionList, currentSuction, mopHumidityList, routeList, maxPowerExists, maxPowerOn, selfCleanFreqOptions, selfCleanFreqValue, selfCleanArea, selfCleanTime, rooms, cleangeniusList, cleangeniusModeList) : ""}
          ${this.activeAdvancedTab === "behavior" ? this.renderBehaviorTab() : ""}
          ${this.activeAdvancedTab === "dock" ? this.renderDockTab() : ""}
        </div>
      </div>
    `;
  }

  // Determine which features apply for a given cleaning mode
  // isCustomize is now driven by the switch.customized_cleaning entity, not by cleaning_mode
  getModeContext(modeName) {
    const m = (modeName || "").toLowerCase();
    const customizedOn = this.getSwitchState("customized_cleaning", ["customized_cleaning"]) === true;
    return {
      isCustomize: customizedOn,
      hasSweep: /sweep|vac/.test(m) || m === "" || customizedOn,
      hasMop: /mop/.test(m) || customizedOn,
    };
  }

  renderCleanGeniusTab(attr, cleangeniusList, cleangeniusModeList) {
    // CleanGenius tab is "always on" by definition — picking the tab IS picking CleanGenius.
    // Hide the "Off" option and let users only choose between Routine / Deep.
    const cleangeniusValue = attr.cleangenius || "";
    const modeOptions = cleangeniusList.filter(o => !/off/i.test(o));
    // Remember last non-Off mode so we can restore it when re-entering this tab
    if (cleangeniusValue && !/off/i.test(cleangeniusValue)) {
      this._lastCleanGeniusMode = cleangeniusValue;
    }

    return `
      <div class="modal-content">
        ${modeOptions.length ? `
          <div class="soft-section">
            <div class="section-heading">${this._t("section_cleangenius_mode")}</div>
            <div class="section-info">${this._t("section_cleangenius_mode_info")}</div>
            <div class="circle-row">
              ${modeOptions.map(mode => `
                <button class="circle-option ${mode === cleangeniusValue ? "selected" : ""}" data-cleangenius="${mode}" type="button">
                  <span class="circle-icon"><ha-icon icon="${this.getCleanGeniusIcon(mode)}"></ha-icon></span>
                  <span class="circle-label">${this._optLabel(mode, "cleangenius_opt")}</span>
                </button>
              `).join("")}
            </div>
          </div>
        ` : ""}

        ${cleangeniusModeList.length ? `
          <div class="soft-section">
            <div class="section-heading">${this._t("section_cleangenius_behaviour")}</div>
            <div class="circle-row">
              ${cleangeniusModeList.map(mode => `
                <button class="circle-option ${mode === attr.cleangenius_mode ? "selected" : ""}" data-cleangenius-mode="${mode}" type="button">
                  <span class="circle-icon"><ha-icon icon="${this.getCleanGeniusModeIcon(mode)}"></ha-icon></span>
                  <span class="circle-label">${this._optLabel(mode, "cleangenius_mode_opt")}</span>
                </button>
              `).join("")}
            </div>
          </div>
        ` : ""}
      </div>
    `;
  }

  renderCustomTab(attr, cleaningModeList, suctionList, currentSuction, mopHumidityList, routeList, maxPowerExists, maxPowerOn, selfCleanFreqOptions, selfCleanFreqValue, selfCleanArea, selfCleanTime, rooms) {
    const ctx = this.getModeContext(attr.cleaning_mode);
    const customizedExists = this.findSwitchEntity("customized_cleaning", ["customized_cleaning"]) !== null;
    // If no cleaning mode is selected yet, show everything (cant determine context)
    const showAll = !attr.cleaning_mode || !cleaningModeList.length;

    return `
      <div class="modal-content">
        ${cleaningModeList.length ? `
          <div class="soft-section">
            <div class="section-heading">${this._t("section_cleaning_mode")}</div>
            <div class="circle-row">
              ${cleaningModeList.map(mode => `
                <button class="circle-option ${mode === attr.cleaning_mode ? "selected" : ""}" data-cleaning-mode="${mode}" type="button">
                  <span class="circle-icon"><ha-icon icon="${this.getModeIcon(mode)}"></ha-icon></span>
                  <span class="circle-label">${this._optLabel(mode, "cleaning_mode_opt")}</span>
                </button>
              `).join("")}
            </div>

            ${customizedExists ? `
              <div class="toggle-row">
                <div class="toggle-info">
                  <ha-icon icon="mdi:home-search"></ha-icon>
                  <div>
                    <div class="toggle-title">${this._t("toggle_customized_title")}</div>
                    <div class="toggle-sub">${this._t("toggle_customized_sub")}</div>
                  </div>
                </div>
                <button class="switch ${ctx.isCustomize ? "on" : ""}" id="toggleCustomized" type="button">
                  <span class="knob"></span>
                </button>
              </div>
            ` : ""}
          </div>
        ` : ""}

        ${!ctx.isCustomize ? `
          <div class="soft-section">
            <div class="section-heading">${this._t("section_cleaning_times")}</div>
            <div class="pill-row" style="justify-content: center;">
              ${[1, 2, 3].map(n => `
                <button class="pill ${this._globalCleaningTimes === n ? "active" : ""}" data-cleaning-times="${n}" type="button">${n}x</button>
              `).join("")}
            </div>
          </div>
        ` : ""}

        ${ctx.isCustomize && rooms.length ? `
          <div class="soft-section">
            <div class="section-heading">${this._t("section_per_room")}</div>
            <div class="section-info">${this._t("section_per_room_info")}</div>
            <div class="room-accordion-list">
              ${rooms.map(room => this.renderRoomAccordion(room, ctx)).join("")}
            </div>
          </div>
        ` : ""}

        ${(showAll || (ctx.hasSweep && !ctx.isCustomize)) && (suctionList.length || maxPowerExists) ? `
          <div class="soft-section">
            <div class="section-heading">${this._t("section_suction")}</div>
            ${suctionList.length ? `
              <div class="circle-row">
                ${suctionList.map(speed => `
                  <button class="circle-option ${speed === currentSuction ? "selected" : ""}" data-fan="${speed}" type="button">
                    <span class="circle-icon"><ha-icon icon="${this.getSuctionIcon(speed)}"></ha-icon></span>
                    <span class="circle-label">${this._optLabel(speed, "suction_level_opt")}</span>
                  </button>
                `).join("")}
              </div>
            ` : ""}
            ${maxPowerExists ? `
              <div class="toggle-row">
                <div class="toggle-info">
                  <ha-icon icon="mdi:rocket-launch-outline"></ha-icon>
                  <div>
                    <div class="toggle-title">${this._t("toggle_maxplus_title")}</div>
                    <div class="toggle-sub">${this._t("toggle_maxplus_sub")}</div>
                  </div>
                </div>
                <button class="switch ${maxPowerOn ? "on" : ""}" id="toggleMaxPower" type="button">
                  <span class="knob"></span>
                </button>
              </div>
            ` : ""}
          </div>
        ` : ""}

        ${(() => {
          // Prefer the granular `wetness_level` slider (matches Dreame app: 1-32
          // with Lightly damp / Damp / Wet labels). Fall back to the legacy
          // `mop_pad_humidity` preset circles when wetness_level isn't enabled.
          if (!(showAll || (ctx.hasMop && !ctx.isCustomize))) return "";
          const wetness = this.getNumberState("wetness_level", ["wetness_level"]);
          if (wetness) {
            return `
              <div class="soft-section">
                <div class="section-heading">${this._t("section_mop_humidity")}</div>
                <div class="wetness-slider">
                  <div class="wetness-row">
                    <input type="range" class="range" data-wetness="1"
                      min="${wetness.min}" max="${wetness.max}" step="${wetness.step}" value="${wetness.value}">
                    <span class="wetness-value">${wetness.value}</span>
                  </div>
                  <div class="wetness-labels">
                    <span>${this._t("wetness_label_dry")}</span>
                    <span>${this._t("wetness_label_damp")}</span>
                    <span>${this._t("wetness_label_wet")}</span>
                  </div>
                </div>
              </div>
            `;
          }
          if (mopHumidityList.length) {
            return `
              <div class="soft-section">
                <div class="section-heading">${this._t("section_mop_humidity")}</div>
                <div class="circle-row">
                  ${mopHumidityList.map(mode => `
                    <button class="circle-option ${mode === attr.mop_pad_humidity ? "selected" : ""}" data-mop-humidity="${mode}" type="button">
                      <span class="circle-icon"><ha-icon icon="${this.getHumidityIcon(mode)}"></ha-icon></span>
                      <span class="circle-label">${this._optLabel(mode, "mop_pad_humidity_opt")}</span>
                    </button>
                  `).join("")}
                </div>
              </div>
            `;
          }
          return "";
        })()}

        ${(showAll || ctx.hasMop) && selfCleanFreqOptions.length ? `
          <div class="soft-section">
            <div class="section-heading">${this._t("section_mop_washing")}</div>
            <div class="circle-row">
              ${selfCleanFreqOptions.map(opt => `
                <button class="circle-option ${opt === selfCleanFreqValue ? "selected" : ""}" data-selfclean-freq="${opt}" type="button">
                  <span class="circle-icon"><ha-icon icon="${this.getSelfCleanFreqIcon(opt)}"></ha-icon></span>
                  <span class="circle-label">${this._optLabel(opt, "self_clean_frequency_opt") || this.formatLabel(opt)}</span>
                </button>
              `).join("")}
            </div>

            ${selfCleanArea && /area/i.test(selfCleanFreqValue || "") ? `
              <div class="slider-row">
                <div class="slider-label">
                  <span>${this._t("label_wash_every")}</span>
                  <span class="slider-value">${selfCleanArea.value} ${selfCleanArea.unit || "m²"}</span>
                </div>
                <input type="range" class="range" id="selfCleanArea"
                  min="${selfCleanArea.min}" max="${selfCleanArea.max}" step="${selfCleanArea.step}" value="${selfCleanArea.value}">
              </div>
            ` : ""}

            ${selfCleanTime && /time/i.test(selfCleanFreqValue || "") ? `
              <div class="slider-row">
                <div class="slider-label">
                  <span>Wash every</span>
                  <span class="slider-value">${selfCleanTime.value} ${selfCleanTime.unit || "min"}</span>
                </div>
                <input type="range" class="range" id="selfCleanTime"
                  min="${selfCleanTime.min}" max="${selfCleanTime.max}" step="${selfCleanTime.step}" value="${selfCleanTime.value}">
              </div>
            ` : ""}
          </div>
        ` : ""}

        ${routeList.length ? `
          <div class="soft-section">
            <div class="section-heading">${this._t("section_route")}</div>
            <div class="circle-row">
              ${routeList.map(route => `
                <button class="circle-option ${route === attr.cleaning_route ? "selected" : ""}" data-route="${route}" type="button">
                  <span class="circle-icon"><ha-icon icon="${this.getRouteIcon(route)}"></ha-icon></span>
                  <span class="circle-label">${this._optLabel(route, "cleaning_route_opt")}</span>
                </button>
              `).join("")}
            </div>
          </div>
        ` : ""}
      </div>
    `;
  }

  // ----- Cleaning tab (slide-toggle between CleanGenius and Custom) -----
  renderCleaningTab(attr, cleaningModeList, suctionList, currentSuction, mopHumidityList, routeList, maxPowerExists, maxPowerOn, selfCleanFreqOptions, selfCleanFreqValue, selfCleanArea, selfCleanTime, rooms, cleangeniusList, cleangeniusModeList) {
    const cgValue = attr.cleangenius || "";
    const cgActive = !!cgValue && !/off/i.test(cgValue);
    return `
      <div class="cg-toggle ${cgActive ? "left" : "right"}">
        <div class="cg-toggle-thumb"></div>
        <button class="cg-toggle-option ${cgActive ? "active" : ""}" data-cg-slider="cleangenius" type="button">
          <ha-icon icon="mdi:auto-fix"></ha-icon>
          <span>${this._t("tab_cleangenius")}</span>
        </button>
        <button class="cg-toggle-option ${!cgActive ? "active" : ""}" data-cg-slider="custom" type="button">
          <ha-icon icon="mdi:tune-vertical"></ha-icon>
          <span>${this._t("tab_custom")}</span>
        </button>
      </div>
      ${cgActive
        ? this.renderCleanGeniusTab(attr, cleangeniusList, cleangeniusModeList)
        : this.renderCustomTab(attr, cleaningModeList, suctionList, currentSuction, mopHumidityList, routeList, maxPowerExists, maxPowerOn, selfCleanFreqOptions, selfCleanFreqValue, selfCleanArea, selfCleanTime, rooms)}
    `;
  }

  // ----- shared helper for the new Behavior + Dock tabs -----
  // Renders one toggle-row given the entity discovery candidates. Returns "" if
  // the switch entity is not enabled in HA, so empty sections never appear.
  _renderToggleRow(configKey, suffixCandidates, titleKey, subKey, icon, dataAttr) {
    const id = this.findSwitchEntity(configKey, suffixCandidates);
    if (!id) return "";
    const on = this._hass.states[id]?.state === "on";
    return `
      <div class="toggle-row">
        <div class="toggle-info">
          <ha-icon icon="${icon}"></ha-icon>
          <div>
            <div class="toggle-title">${this._t(titleKey)}</div>
            <div class="toggle-sub">${this._t(subKey)}</div>
          </div>
        </div>
        <button class="switch ${on ? "on" : ""}" ${dataAttr}="1" type="button">
          <span class="knob"></span>
        </button>
      </div>
    `;
  }

  // Renders a wide action button for a button entity. Returns "" if missing.
  _renderActionButton(configKey, suffixCandidates, labelKey, icon, dataAttr) {
    const id = this.findButtonEntity(configKey, suffixCandidates);
    if (!id) return "";
    return `
      <button class="modal-quick-action" ${dataAttr}="1" type="button">
        <ha-icon icon="${icon}"></ha-icon>
        <span>${this._t(labelKey)}</span>
      </button>
    `;
  }

  // Renders a labelled slider for a number entity. Returns "" if missing.
  _renderNumberSlider(configKey, suffixCandidates, labelKey, dataAttr) {
    const num = this.getNumberState(configKey, suffixCandidates);
    if (!num) return "";
    return `
      <div class="slider-row">
        <div class="slider-label">
          <span>${this._t(labelKey)}</span>
          <span class="slider-value">${num.value}${num.unit ? " " + num.unit : ""}</span>
        </div>
        <input type="range" class="range" ${dataAttr}="1"
          min="${num.min}" max="${num.max}" step="${num.step}" value="${num.value}">
      </div>
    `;
  }

  // ----- new Behavior tab (DnD + Volume, Preferences, Carpets) -----
  renderBehaviorTab() {
    const dnd = this._renderToggleRow("dnd", ["dnd"], "toggle_dnd_title", "toggle_dnd_sub", "mdi:moon-waning-crescent", "data-toggle-dnd");

    // DnD time pickers — only shown when DnD is currently on
    const dndId = this.findSwitchEntity("dnd", ["dnd"]);
    const dndOn = dndId && this._hass.states[dndId]?.state === "on";
    const dndStartId = this.findTimeEntity("dnd_start", ["dnd_start"]);
    const dndEndId   = this.findTimeEntity("dnd_end", ["dnd_end"]);
    const dndStartVal = dndStartId ? (this._hass.states[dndStartId]?.state || "").substring(0, 5) : "";
    const dndEndVal   = dndEndId   ? (this._hass.states[dndEndId]?.state   || "").substring(0, 5) : "";
    const dndTimes = (dndOn && (dndStartId || dndEndId)) ? `
      <div class="time-row-group">
        ${dndStartId ? `
          <div class="time-row">
            <span class="time-label">${this._t("label_dnd_start")}</span>
            <input type="time" data-dnd-start="1" value="${dndStartVal}">
          </div>
        ` : ""}
        ${dndEndId ? `
          <div class="time-row">
            <span class="time-label">${this._t("label_dnd_end")}</span>
            <input type="time" data-dnd-end="1" value="${dndEndVal}">
          </div>
        ` : ""}
      </div>
    ` : "";

    const volume  = this._renderNumberSlider("volume", ["volume"], "label_volume", "data-volume");
    const resume  = this._renderToggleRow("resume", ["resume_cleaning"], "toggle_resume_title", "toggle_resume_sub", "mdi:play-pause", "data-toggle-resume");
    const child   = this._renderToggleRow("child_lock", ["child_lock"], "toggle_child_lock_title", "toggle_child_lock_sub", "mdi:lock-outline", "data-toggle-childlock");
    const cBoost  = this._renderToggleRow("carpet_boost", ["carpet_boost"], "toggle_carpet_boost_title", "toggle_carpet_boost_sub", "mdi:rug", "data-toggle-carpetboost");
    const cAvoid  = this._renderToggleRow("carpet_avoid", ["carpet_avoidance"], "toggle_carpet_avoid_title", "toggle_carpet_avoid_sub", "mdi:rug", "data-toggle-carpetavoid");
    const autoMop = this._renderToggleRow("auto_mount_mop", ["auto_mount_mop"], "toggle_auto_mount_mop_title", "toggle_auto_mount_mop_sub", "mdi:autorenew", "data-toggle-automountmop");

    const scheduleAudio = (dnd + dndTimes + volume).trim();
    const preferences   = (resume + child).trim();
    const carpets       = (cBoost + cAvoid + autoMop).trim();
    const anyContent    = scheduleAudio || preferences || carpets;

    return `
      <div class="modal-content">
        ${scheduleAudio ? `
          <div class="soft-section">
            <div class="section-heading">${this._t("section_schedule_audio")}</div>
            ${dnd}
            ${dndTimes}
            ${volume}
          </div>
        ` : ""}
        ${preferences ? `
          <div class="soft-section">
            <div class="section-heading">${this._t("section_preferences")}</div>
            ${resume}
            ${child}
          </div>
        ` : ""}
        ${carpets ? `
          <div class="soft-section">
            <div class="section-heading">${this._t("section_carpets")}</div>
            ${cBoost}
            ${cAvoid}
            ${autoMop}
          </div>
        ` : ""}
        ${!anyContent ? `<div class="empty">${this._t("no_settings")}</div>` : ""}
      </div>
    `;
  }

  // ----- new Dock tab (Auto-empty + frequency, Detergent, Drying time) -----
  renderDockTab() {
    const autoEmpty  = this._renderToggleRow("auto_empty", ["auto_dust_collecting"], "toggle_auto_empty_title", "toggle_auto_empty_sub", "mdi:delete-empty-outline", "data-toggle-autoempty");
    const autoDeterg = this._renderToggleRow("auto_detergent", ["auto_add_detergent"], "toggle_auto_detergent_title", "toggle_auto_detergent_sub", "mdi:bottle-tonic-outline", "data-toggle-autodetergent");

    // Auto-empty frequency — select.<prefix>_auto_empty_frequency
    const aeFreqId = this.findSettingSelect("auto_empty_freq", ["auto_empty_frequency"], [], "");
    const aeFreq = aeFreqId ? this._hass.states[aeFreqId] : null;
    const aeFreqOptions = aeFreq?.attributes?.options || [];
    const aeFreqValue   = aeFreq?.state;
    const aeFreqRow = (autoEmpty && aeFreqOptions.length) ? `
      <div class="slider-row" style="margin-top:10px;">
        <div class="slider-label">
          <span>${this._t("label_auto_empty_freq")}</span>
        </div>
        <div class="pill-row">
          ${aeFreqOptions.map(opt => `
            <button class="pill ${opt === aeFreqValue ? "active" : ""}" data-auto-empty-freq="${opt}" type="button">${this._optLabel(opt, "auto_empty_freq_opt") || this.formatLabel(opt)}</button>
          `).join("")}
        </div>
      </div>
    ` : "";

    const dryTime = this._renderNumberSlider("drying_time", ["drying_time"], "label_drying_time", "data-dryingtime");

    // Quick action buttons that trigger something on the dock right now
    const baseStationClean = this._renderActionButton("base_station_cleaning", ["base_station_cleaning"], "action_base_station_cleaning", "mdi:water-pump", "data-action-stationclean");

    const autoEmptySection   = (autoEmpty + aeFreqRow).trim();
    const mopCareSection     = (autoDeterg + dryTime).trim();
    const quickActionsSection = baseStationClean.trim();
    const anyContent         = autoEmptySection || mopCareSection || quickActionsSection;

    return `
      <div class="modal-content">
        ${autoEmptySection ? `
          <div class="soft-section">
            <div class="section-heading">${this._t("section_auto_empty")}</div>
            ${autoEmpty}
            ${aeFreqRow}
          </div>
        ` : ""}
        ${mopCareSection ? `
          <div class="soft-section">
            <div class="section-heading">${this._t("section_mop_care")}</div>
            ${autoDeterg}
            ${dryTime}
          </div>
        ` : ""}
        ${quickActionsSection ? `
          <div class="soft-section">
            <div class="section-heading">${this._t("section_quick_actions")}</div>
            ${baseStationClean}
          </div>
        ` : ""}
        ${!anyContent ? `<div class="empty">${this._t("no_settings")}</div>` : ""}
      </div>
    `;
  }

  renderRoomAccordion(room, ctx) {
    const roomId = room.id;
    const expanded = this.expandedRooms.has(roomId);
    const cycles = this.getRoomEntityState("select", roomId, "cleaning_times");
    const wetness = this.getRoomEntityState("number", roomId, "wetness_level");
    const suction = this.getRoomEntityState("select", roomId, "suction_level");

    // Build a small status preview for the collapsed state (e.g. "2x · Strong · 15")
    const previewParts = [];
    if (cycles?.state) previewParts.push(cycles.state);
    if (ctx.hasSweep && suction?.state) previewParts.push(suction.state);
    if (ctx.hasMop && wetness && wetness.value != null) previewParts.push(`💧${wetness.value}`);
    const preview = previewParts.join(" · ");

    return `
      <div class="room-accordion ${expanded ? "open" : ""}">
        <button class="room-accordion-header" data-room-toggle="${roomId}" type="button">
          <div class="room-icon"><ha-icon icon="${this.getRoomIcon(room.name)}"></ha-icon></div>
          <div class="room-accordion-title">
            <div class="room-name-big">${room.name}</div>
            ${!expanded && preview ? `<div class="room-preview">${preview}</div>` : ""}
          </div>
          <ha-icon class="chevron" icon="mdi:chevron-${expanded ? "down" : "right"}"></ha-icon>
        </button>
        ${expanded ? `
          <div class="room-accordion-body">
            ${cycles ? `
              <div class="sub-heading">${this._t("sub_cleaning_times")}</div>
              <div class="pill-row">
                ${cycles.options.map(opt => `
                  <button class="pill ${opt === cycles.state ? "active" : ""}" data-room-cycles="${roomId}" data-value="${opt}" type="button">${opt}</button>
                `).join("")}
              </div>
            ` : `<div class="sub-heading muted">${this._t("sub_cleaning_times_disabled")}</div>`}

            ${ctx.hasSweep && suction ? `
              <div class="sub-heading">${this._t("sub_suction")}</div>
              <div class="pill-row">
                ${suction.options.map(opt => `
                  <button class="pill ${opt === suction.state ? "active" : ""}" data-room-suction="${roomId}" data-value="${opt}" type="button">${opt}</button>
                `).join("")}
              </div>
            ` : ""}

            ${ctx.hasMop && wetness ? `
              <div class="sub-heading">${this._t("sub_wetness")}</div>
              <div class="slider-row inline">
                <input type="range" class="range" data-room-wetness="${roomId}"
                  min="${wetness.min}" max="${wetness.max}" step="${wetness.step}" value="${wetness.value}">
                <span class="slider-value">${wetness.value}</span>
              </div>
            ` : ctx.hasMop ? `<div class="sub-heading muted">${this._t("sub_wetness_disabled")}</div>` : ""}
          </div>
        ` : ""}
      </div>
    `;
  }

  // ----- cleaning overlay (shown over rooms+buttons while robot is active) -----
  renderCleaningOverlay(attr, entity, battery, status, rooms, activeJob) {
    const stateStr = String(entity.state).toLowerCase();
    const isPaused = stateStr === "paused";
    const robotStatus = this._getRobotStatus();

    // Helper: read a Dreame sensor entity's state, returning null when missing/unknown
    const sensorState = (key) => {
      const prefix = this.getEntityPrefix();
      if (!prefix) return null;
      const s = this._hass.states[`sensor.${prefix}_${key}`];
      if (!s) return null;
      const v = s.state;
      if (v == null || v === "" || v === "unknown" || v === "unavailable") return null;
      return v;
    };

    // Pull all the rich live info Dreame exposes as sensors
    const error = sensorState("error");
    const selfWashBase = sensorState("self_wash_base_status");
    const chargingStatus = sensorState("charging_status");
    const currentRoomSensor = sensorState("current_room");
    const cleaningProgress = sensorState("cleaning_progress");
    const dryingProgress = sensorState("drying_progress");

    // Two distinct concepts:
    //  - presentLocation = where the robot physically is right now (e.g. "Laundry room"
    //    when on dock, even if the dock happens to live in that room)
    //  - cleaningRoom = the room being cleaned / about to be cleaned (the actual task target)
    const presentLocation = currentRoomSensor;

    // Try to identify which room is the active cleaning target
    let cleaningRoom = null;
    const segArr = attr.cleaning_segments || attr.segments || null;
    if (Array.isArray(segArr) && segArr.length > 0) {
      const segId = attr.cleaning_segment ?? attr.current_segment ?? segArr[0];
      cleaningRoom = rooms.find(r => r.id === segId)?.name || null;
    } else if (attr.cleaning_segment != null || attr.current_segment != null) {
      const segId = attr.cleaning_segment ?? attr.current_segment;
      cleaningRoom = rooms.find(r => r.id === segId)?.name || null;
    } else if (this.selectedRooms.size > 0) {
      // Fallback: user-selected rooms when integration doesn't expose segment info
      const ids = Array.from(this.selectedRooms);
      cleaningRoom = rooms.find(r => r.id === ids[0])?.name || null;
    }
    // Avoid showing "Room cleaning: <same as present>" — looks redundant
    if (cleaningRoom && cleaningRoom === presentLocation) cleaningRoom = null;

    // Used by the existing where-line logic
    const currentRoom = presentLocation || cleaningRoom;

    // Smart task line — picks the most relevant live info based on what's happening NOW.
    // Uses the translated label dictionaries so strings always look like the Dreame app.
    const taskLine = (() => {
      if (isPaused) return "Paused";
      // Active self-wash base activity (translated)
      if (selfWashBase) {
        const friendly = this._label(selfWashBase, WASH_BASE_LABELS);
        if (friendly) return friendly; // null entries (idle/unknown) fall through
      }
      // Translated vacuum.state — covers Returning to dock, Sweeping and mopping, etc.
      const stateFriendly = this._label(stateStr, VACUUM_STATE_LABELS);
      if (stateFriendly && stateStr !== "idle" && stateStr !== "docked" && stateStr !== "charging" && stateStr !== "sleeping") {
        return stateFriendly;
      }
      // Translated status attribute — Room cleaning, Zone cleaning, etc.
      if (status) {
        const statusFriendly = this._label(status, VACUUM_STATUS_LABELS) || status;
        if (statusFriendly && !/idle|sleeping|standby/i.test(statusFriendly)) return statusFriendly;
      }
      // Fallbacks
      if (attr.task_status) {
        const ts = this._label(attr.task_status, TASK_STATUS_LABELS) || attr.task_status;
        if (ts) return ts;
      }
      if (attr.cleaning_mode) return attr.cleaning_mode;
      return this._t("fallback_task_cleaning");
    })();

    // Smart where/sub line — adds context appropriate to what's happening
    const whereParts = [];
    if (robotStatus === "in_room_cleaning" && currentRoom) {
      whereParts.push(currentRoom);
      if (attr.cleaning_mode && !taskLine.includes(attr.cleaning_mode)) whereParts.push(attr.cleaning_mode);
      if (cleaningProgress && Number(cleaningProgress) > 0 && Number(cleaningProgress) < 100) {
        whereParts.push(`${cleaningProgress}%`);
      }
    } else if (selfWashBase && /drying/i.test(selfWashBase) && dryingProgress && Number(dryingProgress) > 0) {
      whereParts.push(`${dryingProgress}%`);
    } else if (currentRoom && robotStatus !== "mid_job_dock" && robotStatus !== "dock_idle_maintenance") {
      whereParts.push(currentRoom);
    }
    const whereLine = whereParts.join(" · ") || null;

    // Job-type badge
    const cleaningRooms = attr.cleaning_rooms || attr.segments || null;
    const segmentCount = Array.isArray(cleaningRooms) ? cleaningRooms.length : (this.selectedRooms.size || 0);
    let jobBadge = null;
    if (activeJob === "selected") {
      jobBadge = segmentCount > 0 ? this._t(segmentCount === 1 ? "job_badge_one_room" : "job_badge_rooms", { n: segmentCount }) : this._t("job_badge_selected");
    } else if (activeJob === "all") {
      jobBadge = this._t("job_badge_all_rooms");
    }

    const selfCleanExists = this._hass.states[`button.${this.getEntityPrefix()}_self_clean`] != null;

    return `
      <div class="cleaning-overlay">
        <div class="cleaning-content">
          <div class="cleaning-tag">
            <span class="cleaning-tag-dot"></span>
            <span>${isPaused ? this._t("overlay_paused") : this._t("overlay_cleaning")}</span>
            ${jobBadge ? `<span class="cleaning-tag-badge">${jobBadge}</span>` : ""}
          </div>

          <div class="cleaning-task-line">${taskLine}</div>
          <div class="cleaning-info-block">
            ${presentLocation ? `
              <div class="cleaning-info-line">
                <span class="cleaning-info-label">${this._t("overlay_label_present_location")}</span>
                <span class="cleaning-info-value">${presentLocation}</span>
              </div>
            ` : ""}
            ${cleaningRoom ? `
              <div class="cleaning-info-line">
                <span class="cleaning-info-label">${this._t("overlay_label_room_cleaning")}</span>
                <span class="cleaning-info-value">${cleaningRoom}</span>
              </div>
            ` : ""}
            ${(!presentLocation && !cleaningRoom && whereLine) ? `<div class="cleaning-where-line">${whereLine}</div>` : ""}
          </div>

          <div class="cleaning-action-row">
            <div class="action-item">
              <button class="cleaning-action-btn" id="overlayPauseResume" type="button" aria-label="${isPaused ? this._t("overlay_resume") : this._t("overlay_pause")}">
                <ha-icon icon="${isPaused ? "mdi:play" : "mdi:pause"}"></ha-icon>
              </button>
              <div class="action-label">${isPaused ? this._t("overlay_resume") : this._t("overlay_pause")}</div>
            </div>
            ${selfCleanExists ? `
              <div class="action-item">
                <button class="cleaning-action-btn" id="overlaySelfClean" type="button" aria-label="${this._t("overlay_self_clean")}">
                  <ha-icon icon="mdi:water-pump"></ha-icon>
                </button>
                <div class="action-label">${this._t("overlay_self_clean")}</div>
              </div>
            ` : ""}
            <div class="action-item">
              <button class="cleaning-action-btn danger" id="overlayStop" type="button" aria-label="${this._t("overlay_end_job")}">
                <ha-icon icon="mdi:stop"></ha-icon>
              </button>
              <div class="action-label">${this._t("overlay_end_job")}</div>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  // ----- main render -----
  render() {
    const entity = this.getEntity();

    if (!entity) {
      this.innerHTML = `
        <ha-card>
          <div style="padding:20px;color:red;">Entity not found: ${this.config.entity}</div>
        </ha-card>
      `;
      return;
    }

    const attr = entity.attributes;
    const rooms = this.getRooms(entity);
    const selectedCount = this.selectedRooms.size;
    const battery = attr.battery ?? 0;
    const status = attr.status || entity.state;
    const mode = attr.cleaning_mode || "-";
    const stateStr = String(entity.state).toLowerCase();
    const robotStatus = this._getRobotStatus();
    // Show overlay when the robot is doing in-room cleaning OR a user-started job
    // is in progress (including mid-job dock maintenance like mop washing).
    const isActive = robotStatus === "in_room_cleaning" || robotStatus === "mid_job_dock";
    const isCharging = stateStr === "docked" && battery < 100;
    const warnings = this.getWarnings();
    const activeJob = isActive ? this._getActiveJob() : null;

    this.innerHTML = `
      <ha-card>
        <style>
          ha-card {
            /* === Theme-aware design tokens — override via HA theme variables.
               Each token falls back to the card's original colors so the look
               is unchanged for users without a theme. === */
            --dvc-accent: var(--primary-color, #ED8936);
            --dvc-accent-rgb: var(--rgb-primary-color, 237, 137, 54);
            --dvc-accent-hover: var(--accent-color, #DD7724);
            --dvc-accent-soft: rgba(var(--rgb-primary-color, 237, 137, 54), 0.18);
            --dvc-text: var(--primary-text-color, #1a1a2e);
            --dvc-text-secondary: var(--secondary-text-color, #737373);
            --dvc-tile: var(--card-background-color, #FFFFFF);
            --dvc-surface: var(--primary-background-color, #F5F5F7);
            --dvc-divider: var(--divider-color, #ECECEF);
            /* Semantic colors stay constant (red = bad, green = good, etc.) */
            --dvc-button-dark: #3a4452;
            --dvc-button-dark-hover: #4a5462;
            --dvc-success: #10B981;
            --dvc-success-light: #34D399;

            position: relative;
            overflow: hidden;
            border-radius: 28px;
            /* Transparent so the dashboard page background shows through
               between the inner tiles (hero, summary, rooms). */
            background: transparent;
            border: none;
            box-shadow: none;
            container-type: inline-size;
            container-name: dreamecard;
            width: 100%;
            max-width: 100%;
            box-sizing: border-box;
          }
          ha-card * { box-sizing: border-box; }

          /* Stat ring — colors set via CSS so theme variables apply */
          .stat-ring .ring-bg { stroke: var(--dvc-accent-soft); }
          .stat-ring .ring-fg { stroke: var(--dvc-accent); }

          .wrap {
            padding: 20px;
            font-family: "Inter", "Segoe UI", Roboto, Arial, sans-serif;
            color: var(--dvc-text);
            box-sizing: border-box;
          }

          /* HERO */
          .hero {
            display: flex;
            justify-content: space-between;
            align-items: center;
            flex-wrap: wrap;
            gap: 10px;
            margin-bottom: 12px;
          }

          .hero-icon {
            width: 84px;
            height: 84px;
            min-width: 84px;
            display: flex;
            align-items: center;
            justify-content: center;
            flex-shrink: 0;
          }
          .hero-icon img {
            width: 100%;
            height: 100%;
            object-fit: contain;
            /* Soft drop shadow so the vacuum image stands out against light/grey
               dashboards. Drop-shadow follows the image's transparent edges. */
            filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.18))
                    drop-shadow(0 1px 3px rgba(0, 0, 0, 0.12));
            transition: transform .3s ease, opacity .3s ease, filter .3s ease;
          }
          .hero-icon ha-icon {
            --mdc-icon-size: 40px;
            color: var(--dvc-accent);
            transition: transform .3s ease, opacity .3s ease;
          }
          .hero-icon.active img {
            animation: slow-rotate 6s linear infinite, pulse-shadow 2.4s ease-in-out infinite;
            transform-origin: center;
          }
          .hero-icon.active ha-icon {
            animation: slow-rotate 6s linear infinite;
            transform-origin: center;
          }
          @keyframes slow-rotate {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
          /* Soft drop shadow that breathes from neutral grey → orange → grey,
             so the robot looks "alive" while it's running. */
          @keyframes pulse-shadow {
            0%, 100% {
              filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.18))
                      drop-shadow(0 1px 3px rgba(0, 0, 0, 0.12));
            }
            50% {
              filter: drop-shadow(0 4px 12px rgba(var(--dvc-accent-rgb), 0.55))
                      drop-shadow(0 1px 4px rgba(var(--dvc-accent-rgb), 0.40));
            }
          }
          @keyframes pulse-icon {
            0%, 100% { opacity: 1; transform: scale(1); }
            50% { opacity: 0.7; transform: scale(1.06); }
          }

          .hero-text { flex: 1; min-width: 0; }
          .hero-title {
            font-size: 17px;
            font-weight: 700;
            letter-spacing: 0.04em;
            color: var(--dvc-text);
            text-transform: uppercase;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
          }

          .status-pill {
            display: inline-flex;
            align-items: center;
            gap: 8px;
            padding: 6px 12px;
            background: var(--dvc-tile);
            border-radius: 999px;
            box-shadow: 0 1px 3px rgba(0,0,0,0.04);
          }

          .status-dot-wrap {
            width: 18px;
            height: 18px;
            border-radius: 50%;
            background: var(--dvc-accent-soft);
            display: flex;
            align-items: center;
            justify-content: center;
          }

          .status-dot-wrap.idle { background: var(--dvc-divider); }
          .status-dot-wrap.idle .dot { background: var(--dvc-text-secondary); }

          .dot {
            width: 8px;
            height: 8px;
            border-radius: 50%;
            background: var(--dvc-accent);
          }

          .status-text { font-size: 11px; line-height: 1.2; }
          .status-text .label {
            font-weight: 600;
            color: var(--dvc-text);
            text-transform: capitalize;
          }
          .status-text .sub { color: var(--dvc-text-secondary); font-size: 10px; }

          .hero-gear {
            width: 36px;
            height: 36px;
            min-width: 36px;
            min-height: 36px;
            border-radius: 50%;
            padding: 0;
            background: var(--dvc-tile);
            box-shadow: 0 1px 3px rgba(0,0,0,0.04);
            flex-shrink: 0;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            border: none;
            -webkit-tap-highlight-color: transparent;
            touch-action: manipulation;
          }
          .hero-gear ha-icon {
            --mdc-icon-size: 18px;
            color: var(--dvc-text);
          }
          .hero-gear:hover { box-shadow: 0 2px 6px rgba(0,0,0,0.08); }
          .hero-gear:active { transform: scale(0.95); }
          .hero-gear > * { pointer-events: none; }

          /* ALERT BANNER (own row below hero — white card, red triangle icon) */
          .alert-banner {
            display: flex;
            align-items: center;
            gap: 10px;
            background: var(--dvc-tile);
            border-radius: 14px;
            padding: 10px 14px;
            margin-bottom: 12px;
            box-shadow: 0 1px 3px rgba(0,0,0,0.04);
            min-width: 0;
          }
          .alert-banner-icon {
            --mdc-icon-size: 22px;
            color: #DC2626;
            flex-shrink: 0;
          }
          .alert-banner-text {
            flex: 1;
            min-width: 0;
            overflow: hidden;
          }
          .alert-banner-label {
            font-size: 13px;
            font-weight: 600;
            color: var(--dvc-text);
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
          }
          .alert-banner-sub {
            font-size: 11px;
            color: var(--dvc-text-secondary);
            margin-top: 1px;
          }

          /* SUMMARY CARD (Battery + Area + Time + Mode) */
          .summary-card {
            background: var(--dvc-tile);
            border-radius: 18px;
            padding: 12px 8px;
            margin-bottom: 12px;
            box-shadow: 0 1px 3px rgba(0,0,0,0.04);
            display: grid;
            grid-template-columns: 1fr 1fr 1fr 1fr;
            gap: 4px;
          }

          .stat-item {
            display: flex;
            flex-direction: column;
            align-items: center;
            text-align: center;
            gap: 5px;
            min-width: 0;
            padding: 2px;
          }

          .stat-circle {
            width: 44px;
            height: 44px;
            min-width: 44px;
            border-radius: 50%;
            background: transparent;
            display: flex;
            align-items: center;
            justify-content: center;
            position: relative;
            flex-shrink: 0;
          }
          .stat-circle ha-icon {
            --mdc-icon-size: 18px;
            color: var(--dvc-accent);
            position: relative;
            z-index: 1;
            transition: transform .3s ease;
          }
          .stat-ring {
            position: absolute;
            inset: 0;
            width: 100%;
            height: 100%;
            transition: stroke-dashoffset .4s ease;
          }
          .stat-circle.active ha-icon {
            animation: pulse-icon 1.6s ease-in-out infinite;
          }
          .stat-circle.active .stat-ring {
            animation: pulse-ring 1.6s ease-in-out infinite;
          }
          @keyframes pulse-ring {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.55; }
          }

          .stat-big {
            font-size: 13px;
            font-weight: 700;
            color: var(--dvc-text);
            line-height: 1.15;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
            max-width: 100%;
          }
          .stat-big.mode {
            font-size: 10px;
            white-space: normal;
            line-height: 1.15;
          }
          .stat-small {
            font-size: 9px;
            color: var(--dvc-text-secondary);
            text-transform: uppercase;
            letter-spacing: 0.05em;
            font-weight: 600;
          }

          /* CLEANING OVERLAY (shown over rooms+buttons while robot is active) */
          .content-area {
            position: relative;
          }
          .cleaning-overlay {
            position: absolute;
            inset: 0;
            background: rgba(26, 26, 46, 0.62);
            backdrop-filter: blur(6px);
            -webkit-backdrop-filter: blur(6px);
            border-radius: 18px;
            z-index: 5;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 16px;
          }
          .cleaning-content {
            display: flex;
            flex-direction: column;
            align-items: center;
            text-align: center;
            gap: 18px;
            width: 100%;
            max-width: 540px;
          }
          .cleaning-tag {
            display: inline-flex;
            align-items: center;
            gap: 10px;
            padding: 8px 16px;
            background: rgba(255,255,255,0.12);
            border: 1px solid rgba(255,255,255,0.22);
            border-radius: 999px;
            font-size: 12px;
            font-weight: 700;
            letter-spacing: 0.1em;
            color: #FFFFFF;
          }
          .cleaning-tag-dot {
            width: 9px;
            height: 9px;
            border-radius: 50%;
            background: var(--dvc-accent);
            box-shadow: 0 0 0 0 rgba(var(--dvc-accent-rgb), 0.7);
            animation: live-pulse 1.6s ease-out infinite;
            flex-shrink: 0;
          }
          @keyframes live-pulse {
            0% { box-shadow: 0 0 0 0 rgba(var(--dvc-accent-rgb), 0.7); }
            70% { box-shadow: 0 0 0 9px rgba(var(--dvc-accent-rgb), 0); }
            100% { box-shadow: 0 0 0 0 rgba(var(--dvc-accent-rgb), 0); }
          }
          .cleaning-tag-badge {
            color: rgba(255,255,255,0.7);
            font-size: 11px;
            font-weight: 500;
            letter-spacing: 0.04em;
            text-transform: none;
            margin-left: 2px;
          }
          .cleaning-task-line {
            font-size: 28px;
            font-weight: 700;
            color: #FFFFFF;
            letter-spacing: 0.01em;
            line-height: 1.2;
            text-shadow: 0 2px 10px rgba(0,0,0,0.35);
          }
          .cleaning-where-line {
            font-size: 17px;
            color: rgba(255,255,255,0.88);
            font-weight: 500;
            margin-top: -8px;
          }
          .cleaning-info-block {
            display: flex;
            flex-direction: column;
            gap: 4px;
            margin-top: -4px;
          }
          .cleaning-info-line {
            font-size: 14px;
            color: rgba(255,255,255,0.85);
            display: flex;
            align-items: baseline;
            justify-content: center;
            gap: 6px;
            flex-wrap: wrap;
          }
          .cleaning-info-label {
            color: rgba(255,255,255,0.6);
            font-weight: 500;
          }
          .cleaning-info-value {
            color: #FFFFFF;
            font-weight: 600;
          }
          .cleaning-action-row {
            display: flex;
            justify-content: center;
            gap: 18px;
            margin-top: 8px;
            flex-wrap: wrap;
          }
          .action-item {
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 8px;
          }
          .cleaning-action-btn {
            width: 64px;
            height: 64px;
            min-width: 64px;
            min-height: 64px;
            border-radius: 50%;
            background: rgba(255,255,255,0.95);
            border: none;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 0;
            box-shadow: 0 6px 16px rgba(0,0,0,0.28);
            transition: transform .15s ease, box-shadow .15s ease;
            -webkit-tap-highlight-color: transparent;
            touch-action: manipulation;
          }
          .cleaning-action-btn ha-icon {
            --mdc-icon-size: 30px;
            color: var(--dvc-accent);
          }
          .cleaning-action-btn:hover { transform: translateY(-2px); box-shadow: 0 8px 20px rgba(0,0,0,0.35); }
          .cleaning-action-btn:active { transform: scale(0.95); }
          .cleaning-action-btn > * { pointer-events: none; }
          .cleaning-action-btn.danger {
            background: var(--dvc-button-dark);
          }
          .cleaning-action-btn.danger ha-icon { color: #FFFFFF; }
          .action-label {
            color: #FFFFFF;
            font-size: 13px;
            font-weight: 500;
            letter-spacing: 0.02em;
          }

          /* ROOMS HEAD */
          .rooms-head {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 6px;
          }

          .section-label {
            font-size: 13px;
            font-weight: 700;
            letter-spacing: 0.04em;
            color: var(--dvc-text);
            text-transform: uppercase;
          }

          .selected-count {
            font-size: 11px;
            color: var(--dvc-text-secondary);
          }

          /* ROOM LIST — column-major fill (matches Dreame app: items run top
             to bottom within each column, then continue in the next column).
             Row count is provided per breakpoint via the --rows-N CSS vars
             that are set inline on the element from JS. */
          .room-list {
            display: grid;
            grid-auto-flow: column;
            grid-template-columns: 1fr 1fr 1fr;
            grid-template-rows: repeat(var(--rows-3, 4), auto);
            gap: 8px;
            margin-bottom: 12px;
            /* Defensive: prevent grid from spilling out of its parent on
               narrow viewports (iOS Safari rounds fractional widths up). */
            width: 100%;
            box-sizing: border-box;
            min-width: 0;
          }

          .room {
            /* Half-transparent tile — text and icons stay at full opacity
               since opacity is applied to the background only, not the
               element itself. */
            background: rgba(255, 255, 255, 0.5);
            border-radius: 18px;
            padding: 5px 14px;
            box-shadow: 0 1px 3px rgba(0,0,0,0.04);
            display: flex;
            align-items: center;
            gap: 12px;
            cursor: pointer;
            user-select: none;
            box-sizing: border-box;
            min-width: 0;          /* allow flex children to shrink past content size */
            -webkit-tap-highlight-color: transparent;
            touch-action: manipulation;
            transition: box-shadow .15s ease, outline-color .15s ease;
            /* Reserve space for the inset selection ring so size doesn't shift
               between selected and unselected states. */
            outline: 2px solid transparent;
            outline-offset: -4px;
          }
          .room:active { transform: scale(0.98); }
          .room.selected { outline-color: var(--dvc-accent); }
          .room > * { pointer-events: none; }

          .room-icon {
            width: 52px;
            height: 52px;
            min-width: 52px;
            border-radius: 50%;
            background: var(--dvc-divider);
            display: flex;
            align-items: center;
            justify-content: center;
            pointer-events: none;
          }
          .room-icon ha-icon {
            --mdc-icon-size: 30px;
            color: var(--dvc-text-secondary);
          }
          .room.selected .room-icon { background: var(--dvc-accent-soft); }
          .room.selected .room-icon ha-icon { color: var(--dvc-accent); }

          .room-info { flex: 1; min-width: 0; pointer-events: none; }
          .room-name {
            font-size: 14px;
            font-weight: 600;
            color: var(--dvc-text);
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
          }
          .room-state {
            font-size: 10px;
            color: var(--dvc-accent);
            font-weight: 500;
            margin-top: 1px;
          }

          .check-circle {
            width: 18px;
            height: 18px;
            min-width: 18px;
            border-radius: 50%;
            background: var(--dvc-divider);
            display: flex;
            align-items: center;
            justify-content: center;
            pointer-events: none;
          }
          .room.selected .check-circle { background: var(--dvc-accent); }
          .check-circle ha-icon {
            --mdc-icon-size: 12px;
            color: transparent;
          }
          .room.selected .check-circle ha-icon { color: #FFFFFF; }

          /* BUTTONS */
          .btn-row {
            display: grid;
            gap: 6px;
            margin-bottom: 6px;
          }
          .btn-row.three { grid-template-columns: 1fr 1fr 1fr; }
          .btn-row.two { grid-template-columns: 1fr 1fr; }
          .btn-row.main { grid-template-columns: 2fr 1fr 1fr; }

          button {
            width: 100%;
            min-height: 28px;
            border: none;
            border-radius: 999px;
            padding: 4px 12px;
            font-size: 11px;
            font-weight: 500;
            cursor: pointer;
            background: var(--dvc-tile);
            color: var(--dvc-text);
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 5px;
            box-sizing: border-box;
            box-shadow: 0 1px 3px rgba(0,0,0,0.04);
            font-family: inherit;
            transition: box-shadow .15s ease;
            -webkit-tap-highlight-color: transparent;
            touch-action: manipulation;
            position: relative;
            line-height: 1;
          }
          button > * {
            pointer-events: none;
          }
          button ha-icon {
            --mdc-icon-size: 16px;
          }
          button:hover { box-shadow: 0 2px 6px rgba(0,0,0,0.08); }
          button:active { transform: scale(0.97); }

          button.primary {
            background: var(--dvc-accent);
            color: #FFFFFF;
            min-height: 32px;
            font-size: 12px;
            font-weight: 600;
            box-shadow: 0 2px 8px rgba(var(--dvc-accent-rgb), 0.25);
          }
          button.primary:hover { background: var(--dvc-accent-hover); }

          button.dark {
            background: var(--dvc-button-dark);
            color: #FFFFFF;
            min-height: 32px;
          }
          button.dark:hover { background: var(--dvc-button-dark-hover); }

          button.dock { min-height: 32px; }

          button.danger-text { color: #C2410C; }

          button:disabled {
            opacity: 0.4;
            cursor: not-allowed;
            filter: saturate(0.5);
            pointer-events: none;
          }

          /* Active running-job button — green and pulsing */
          button.active-job {
            background: var(--dvc-success) !important;
            color: #FFFFFF !important;
            box-shadow: 0 2px 10px rgba(16, 185, 129, 0.45) !important;
            animation: button-pulse-green 1.8s ease-in-out infinite;
          }
          button.active-job ha-icon { color: #FFFFFF; }
          @keyframes button-pulse-green {
            0%, 100% {
              background: var(--dvc-success);
              box-shadow: 0 2px 10px rgba(16, 185, 129, 0.45);
            }
            50% {
              background: var(--dvc-success-light);
              box-shadow: 0 4px 18px rgba(16, 185, 129, 0.75);
            }
          }

          /* MODAL */
          .modal-backdrop {
            position: fixed;
            inset: 0;
            z-index: 9999;
            background: rgba(26,26,46,0.40);
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 20px;
            backdrop-filter: blur(4px);
            -webkit-backdrop-filter: blur(4px);
          }

          .modal {
            width: min(720px, 96vw);
            max-height: 88vh;
            overflow-y: auto;
            -webkit-overflow-scrolling: touch;
            border-radius: 28px;
            background: var(--dvc-surface);
            padding: 20px;
            box-shadow: 0 20px 60px rgba(0,0,0,0.25);
          }

          .modal-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 16px;
          }

          .modal-title {
            font-size: 16px;
            font-weight: 700;
            letter-spacing: 0.04em;
            color: var(--dvc-text);
            text-transform: uppercase;
          }
          .modal-subtitle { font-size: 11px; color: var(--dvc-text-secondary); margin-top: 2px; }

          .round-btn {
            width: 40px;
            min-height: 40px;
            min-width: 40px;
            border-radius: 50%;
            padding: 0;
            background: var(--dvc-tile);
          }
          .round-btn ha-icon { --mdc-icon-size: 18px; }

          .modal-quick-action {
            width: 100%;
            min-height: 40px;
            border-radius: 14px;
            padding: 8px 14px;
            background: var(--dvc-tile);
            color: var(--dvc-text);
            border: none;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 8px;
            font-size: 13px;
            font-weight: 600;
            cursor: pointer;
            box-shadow: 0 1px 3px rgba(0,0,0,0.04);
            margin-bottom: 12px;
            font-family: inherit;
            -webkit-tap-highlight-color: transparent;
            touch-action: manipulation;
          }
          .modal-quick-action ha-icon {
            --mdc-icon-size: 18px;
            color: var(--dvc-accent);
          }
          .modal-quick-action:hover { box-shadow: 0 2px 6px rgba(0,0,0,0.08); }
          .modal-quick-action:active { transform: scale(0.98); }
          .modal-quick-action > * { pointer-events: none; }

          .tabs {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 4px;
            background: var(--dvc-tile);
            border-radius: 999px;
            padding: 4px;
            margin-bottom: 14px;
            box-shadow: 0 1px 3px rgba(0,0,0,0.04);
          }
          .tabs.three { grid-template-columns: 1fr 1fr 1fr; }
          .tabs.two { grid-template-columns: 1fr 1fr; }

          /* Time-row group for DnD start/end pickers */
          .time-row-group {
            display: flex;
            flex-direction: column;
            gap: 6px;
            margin-top: 10px;
          }
          .time-row {
            display: flex;
            justify-content: space-between;
            align-items: center;
            background: var(--dvc-surface);
            border-radius: 14px;
            padding: 10px 14px;
          }
          .time-row .time-label {
            font-size: 13px;
            font-weight: 600;
            color: var(--dvc-text);
          }
          .time-row input[type="time"] {
            background: var(--dvc-tile);
            border: none;
            border-radius: 10px;
            padding: 6px 10px;
            font-size: 14px;
            font-weight: 500;
            color: var(--dvc-text);
            font-family: inherit;
            cursor: pointer;
            min-width: 90px;
          }

          /* CleanGenius ↔ Custom slide toggle (used inside the Cleaning tab).
             Visually a wide pill with a sliding orange thumb behind the labels. */
          .cg-toggle {
            position: relative;
            display: grid;
            grid-template-columns: 1fr 1fr;
            background: var(--dvc-tile);
            border-radius: 18px;
            padding: 6px;
            margin-bottom: 14px;
            box-shadow: 0 1px 3px rgba(0,0,0,0.04);
            overflow: hidden;
          }
          .cg-toggle-thumb {
            position: absolute;
            top: 6px;
            left: 6px;
            width: calc(50% - 6px);
            height: calc(100% - 12px);
            background: var(--dvc-accent);
            border-radius: 14px;
            box-shadow: 0 2px 10px rgba(var(--dvc-accent-rgb), 0.35);
            transition: transform .25s cubic-bezier(.4, 0, .2, 1);
            z-index: 0;
            pointer-events: none;
          }
          .cg-toggle.right .cg-toggle-thumb { transform: translateX(100%); }
          .cg-toggle-option {
            position: relative;
            z-index: 1;
            background: transparent;
            border: none;
            padding: 14px 8px;
            min-height: 48px;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 8px;
            font-size: 14px;
            font-weight: 500;
            color: var(--dvc-text-secondary);
            cursor: pointer;
            font-family: inherit;
            box-shadow: none;
            border-radius: 14px;
            -webkit-tap-highlight-color: transparent;
            touch-action: manipulation;
            transition: color .2s ease;
          }
          .cg-toggle-option ha-icon { --mdc-icon-size: 18px; }
          .cg-toggle-option.active { color: #FFFFFF; font-weight: 600; }
          .cg-toggle-option > * { pointer-events: none; }

          .tab {
            min-height: 44px;
            border-radius: 999px;
            background: transparent;
            color: var(--dvc-text-secondary);
            font-size: 13px;
            font-weight: 500;
            box-shadow: none;
            border: none;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 6px;
            cursor: pointer;
            font-family: inherit;
            -webkit-tap-highlight-color: transparent;
            touch-action: manipulation;
          }
          .tab ha-icon { --mdc-icon-size: 16px; }
          .tab.active {
            background: var(--dvc-accent);
            color: #FFFFFF;
            font-weight: 600;
            box-shadow: 0 2px 6px rgba(var(--dvc-accent-rgb), 0.25);
          }

          .modal-content {
            display: flex;
            flex-direction: column;
            gap: 10px;
          }

          .soft-section {
            background: var(--dvc-tile);
            border-radius: 18px;
            padding: 14px;
            box-shadow: 0 1px 3px rgba(0,0,0,0.04);
          }

          .section-heading {
            font-size: 11px;
            font-weight: 700;
            letter-spacing: 0.04em;
            color: var(--dvc-text);
            text-transform: uppercase;
            margin-bottom: 14px;
          }

          /* CIRCLE OPTIONS */
          .circle-row {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(72px, 1fr));
            gap: 8px;
          }

          .circle-option {
            background: transparent;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: flex-start;
            gap: 6px;
            color: var(--dvc-text);
            font-weight: 500;
            font-size: 11px;
            cursor: pointer;
            border: none;
            box-shadow: none;
            padding: 6px 4px;
            font-family: inherit;
            min-height: 80px;
            width: 100%;
            -webkit-tap-highlight-color: transparent;
            touch-action: manipulation;
            border-radius: 12px;
          }
          .circle-option:hover { box-shadow: none; background: rgba(0,0,0,0.02); }
          .circle-option:active { transform: scale(0.95); }
          .circle-option > * { pointer-events: none; }

          .circle-icon {
            width: 50px;
            height: 50px;
            border-radius: 50%;
            background: var(--dvc-divider);
            display: flex;
            align-items: center;
            justify-content: center;
            flex-shrink: 0;
          }
          .circle-icon ha-icon {
            --mdc-icon-size: 22px;
            color: var(--dvc-text);
          }
          .circle-option.selected .circle-icon {
            background: var(--dvc-accent);
            box-shadow: 0 2px 6px rgba(var(--dvc-accent-rgb), 0.25);
          }
          .circle-option.selected .circle-icon ha-icon { color: #FFFFFF; }
          .circle-option.selected { color: var(--dvc-accent); font-weight: 600; }

          .circle-label {
            text-align: center;
            line-height: 1.2;
            word-break: break-word;
            hyphens: auto;
          }

          /* TOGGLE SWITCH */
          .toggle-row {
            display: flex;
            justify-content: space-between;
            align-items: center;
            background: var(--dvc-surface);
            border-radius: 14px;
            padding: 10px 14px;
            margin-top: 10px;
          }
          .toggle-info {
            display: flex;
            align-items: center;
            gap: 10px;
            min-width: 0;
          }
          .toggle-info ha-icon {
            --mdc-icon-size: 20px;
            color: var(--dvc-accent);
            flex-shrink: 0;
          }
          .toggle-title { font-size: 13px; font-weight: 600; color: var(--dvc-text); }
          .toggle-sub { font-size: 11px; color: var(--dvc-text-secondary); }

          .switch {
            width: 46px;
            min-width: 46px;
            min-height: 26px;
            height: 26px;
            border-radius: 999px;
            background: #D1D5DB;
            position: relative;
            border: none;
            padding: 0;
            cursor: pointer;
            transition: background .2s ease;
            box-shadow: none;
            display: block;
            -webkit-tap-highlight-color: transparent;
            touch-action: manipulation;
          }
          .switch > * { pointer-events: none; }
          .switch .knob {
            position: absolute;
            top: 3px; left: 3px;
            width: 20px; height: 20px;
            background: var(--dvc-tile);
            border-radius: 50%;
            box-shadow: 0 1px 3px rgba(0,0,0,0.2);
            transition: left .2s ease;
          }
          .switch.on { background: var(--dvc-accent); }
          .switch.on .knob { left: 23px; }

          /* SLIDER */
          .slider-row {
            margin-top: 12px;
            display: flex;
            flex-direction: column;
            gap: 6px;
          }
          /* Wetness slider with three labels under (Dreame-app-style) */
          .wetness-slider {
            padding: 4px 4px 0;
          }
          .wetness-row {
            display: flex;
            align-items: center;
            gap: 12px;
          }
          .wetness-row .range {
            flex: 1;
          }
          .wetness-value {
            min-width: 28px;
            text-align: right;
            font-size: 14px;
            font-weight: 700;
            color: var(--dvc-accent);
          }
          .wetness-labels {
            display: flex;
            justify-content: space-between;
            font-size: 11px;
            color: var(--dvc-text-secondary);
            padding: 0 4px;
            margin-top: 4px;
          }
          .wetness-labels span:nth-child(1) { text-align: left; }
          .wetness-labels span:nth-child(2) { text-align: center; }
          .wetness-labels span:nth-child(3) { text-align: right; }

          .slider-row.inline {
            flex-direction: row;
            align-items: center;
            gap: 12px;
          }
          .slider-label {
            display: flex;
            justify-content: space-between;
            font-size: 12px;
            color: var(--dvc-text);
            font-weight: 500;
          }
          .slider-value { color: var(--dvc-accent); font-weight: 600; }

          .range {
            -webkit-appearance: none;
            appearance: none;
            width: 100%;
            height: 6px;
            background: var(--dvc-accent-soft);
            border-radius: 999px;
            outline: none;
            padding: 0;
            margin: 8px 0;
            box-shadow: none;
            min-height: 0;
          }
          .range::-webkit-slider-thumb {
            -webkit-appearance: none;
            appearance: none;
            width: 22px; height: 22px;
            border-radius: 50%;
            background: var(--dvc-accent);
            cursor: pointer;
            box-shadow: 0 2px 6px rgba(var(--dvc-accent-rgb), 0.35);
            border: 2px solid #FFFFFF;
          }
          .range::-moz-range-thumb {
            width: 22px; height: 22px;
            border-radius: 50%;
            background: var(--dvc-accent);
            cursor: pointer;
            border: 2px solid #FFFFFF;
            box-shadow: 0 2px 6px rgba(var(--dvc-accent-rgb), 0.35);
          }

          /* PER-ROOM SECTION */
          .room-header {
            display: flex;
            align-items: center;
            gap: 10px;
            margin-bottom: 12px;
          }
          .room-name-big {
            font-size: 14px;
            font-weight: 700;
            color: var(--dvc-text);
          }

          .section-info {
            font-size: 11px;
            color: var(--dvc-text-secondary);
            margin-top: -8px;
            margin-bottom: 12px;
          }

          /* ROOM ACCORDION */
          .room-accordion-list {
            display: flex;
            flex-direction: column;
            gap: 6px;
          }
          .room-accordion {
            background: var(--dvc-surface);
            border-radius: 14px;
            overflow: hidden;
            transition: background .15s ease;
          }
          .room-accordion.open { background: var(--dvc-tile); box-shadow: inset 0 0 0 2px var(--dvc-accent-soft); }

          .room-accordion-header {
            width: 100%;
            display: flex;
            align-items: center;
            gap: 10px;
            padding: 10px 12px;
            background: transparent;
            border: none;
            cursor: pointer;
            font-family: inherit;
            box-shadow: none;
            min-height: 44px;
            text-align: left;
            -webkit-tap-highlight-color: transparent;
            touch-action: manipulation;
          }
          .room-accordion-header:hover { box-shadow: none; }
          .room-accordion-header > * { pointer-events: none; }

          .room-accordion-title {
            flex: 1;
            min-width: 0;
            display: flex;
            flex-direction: column;
            gap: 1px;
          }
          .room-preview {
            font-size: 10px;
            color: var(--dvc-accent);
            font-weight: 500;
            letter-spacing: 0.02em;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
          }

          .chevron {
            --mdc-icon-size: 18px;
            color: var(--dvc-text-secondary);
            transition: transform .2s ease;
            flex-shrink: 0;
          }
          .room-accordion.open .chevron { color: var(--dvc-accent); }

          .room-accordion-body {
            padding: 0 14px 14px;
            animation: accordion-expand .2s ease-out;
          }
          @keyframes accordion-expand {
            from { opacity: 0; transform: translateY(-4px); }
            to { opacity: 1; transform: translateY(0); }
          }
          .sub-heading {
            font-size: 10px;
            font-weight: 700;
            letter-spacing: 0.04em;
            color: var(--dvc-text-secondary);
            text-transform: uppercase;
            margin: 10px 0 6px;
          }
          .sub-heading.muted { color: #B5B5BD; font-style: italic; font-weight: 500; }

          .pill-row {
            display: flex;
            flex-wrap: wrap;
            gap: 6px;
          }
          .pill {
            background: var(--dvc-surface);
            color: var(--dvc-text);
            border-radius: 999px;
            padding: 6px 14px;
            min-height: 36px;
            font-size: 12px;
            font-weight: 500;
            border: none;
            cursor: pointer;
            box-shadow: none;
            width: auto;
            -webkit-tap-highlight-color: transparent;
            touch-action: manipulation;
          }
          .pill > * { pointer-events: none; }
          .pill.active {
            background: var(--dvc-accent);
            color: #FFFFFF;
            font-weight: 600;
            box-shadow: 0 2px 6px rgba(var(--dvc-accent-rgb), 0.25);
          }

          .empty {
            text-align: center;
            color: var(--dvc-text-secondary);
            font-size: 13px;
            padding: 14px;
          }

          /* RESPONSIVE — based on the card's own width, not the viewport,
             because HA dashboards put cards in narrow columns even on desktop. */

          /* Medium narrow: ≤ 700px (typical HA single-column / split-view) */
          @container dreamecard (max-width: 700px) {
            .hero-title { font-size: 15px; }
            .btn-row.main { grid-template-columns: 1.5fr 1fr 1fr; }
            .room-list { grid-template-columns: 1fr 1fr; grid-template-rows: repeat(var(--rows-2, 6), auto); }
          }

          /* Narrow: ≤ 520px (mobile phones in portrait, narrow side panels) */
          @container dreamecard (max-width: 520px) {
            .wrap { padding: 14px 12px; }
            .hero { gap: 8px; }
            .hero-icon { width: 64px; height: 64px; min-width: 64px; }
            .hero-icon ha-icon { --mdc-icon-size: 60px; }
            .hero-title { font-size: 14px; letter-spacing: 0.03em; }
            .status-pill { padding: 4px 10px; }
            .status-text { font-size: 10px; }
            .status-text .sub { font-size: 9px; }
            .hero-gear { width: 32px; height: 32px; min-width: 32px; min-height: 32px; }
            .hero-gear ha-icon { --mdc-icon-size: 16px; }

            .summary-card { grid-template-columns: 1fr 1fr; gap: 12px; padding: 14px 8px; }
            .stat-circle { width: 44px; height: 44px; min-width: 44px; }
            .stat-big { font-size: 12px; }
            .stat-big.mode { font-size: 10px; }

            .room-list { grid-template-columns: 1fr 1fr; grid-template-rows: repeat(var(--rows-2, 6), auto); gap: 4px; }
            .room { padding: 5px 10px; gap: 8px; }
            .room-icon { width: 44px; height: 44px; min-width: 44px; }
            .room-icon ha-icon { --mdc-icon-size: 26px; }
            .room-name { font-size: 13px; }
            .check-circle { width: 14px; height: 14px; min-width: 14px; }

            .btn-row.main { grid-template-columns: 1fr 1fr; }
            .btn-row.main button.primary { grid-column: 1 / -1; }
            button { font-size: 10px; padding: 4px 8px; gap: 4px; }
            button ha-icon { --mdc-icon-size: 14px; }

            .modal { padding: 14px; max-height: 92vh; }
            .modal-backdrop { padding: 0; align-items: flex-end; }
            .modal { border-radius: 28px 28px 0 0; width: 100%; max-width: 100%; }
            .circle-row { grid-template-columns: repeat(auto-fill, minmax(64px, 1fr)); gap: 6px; }
            .circle-icon { width: 44px; height: 44px; }
            .circle-icon ha-icon { --mdc-icon-size: 20px; }
            .circle-option { min-height: 72px; font-size: 10px; }
            .tabs.three .tab span { display: none; }
          }

          /* Very narrow: ≤ 380px — squeeze further */
          @container dreamecard (max-width: 380px) {
            .room-list { grid-template-columns: 1fr; grid-template-rows: repeat(var(--rows-1, 12), auto); }
            .stat-big { font-size: 11px; }
            button span { font-size: 10px; }
          }

          /* Fallback for browsers that don't support container queries.
             Also applies as a viewport-based safety net for actual mobile devices,
             since some HA mobile WebViews don't fully support container queries. */
          @media (max-width: 700px) {
            .summary-card { grid-template-columns: 1fr 1fr; gap: 10px; padding: 12px 8px; }
            .room-list { grid-template-columns: 1fr 1fr; grid-template-rows: repeat(var(--rows-2, 6), auto); gap: 6px; }
            .btn-row.main { grid-template-columns: 1fr 1fr; }
            .btn-row.main button.primary { grid-column: 1 / -1; }
            .hero-title { font-size: 15px; }
          }

          @media (max-width: 480px) {
            .wrap { padding: 14px 12px; }
            .hero { gap: 8px; }
            .hero-icon { width: 56px; height: 56px; min-width: 56px; }
            .hero-icon img { width: 100%; height: 100%; }
            .hero-title { font-size: 14px; letter-spacing: 0.03em; }
            .status-pill { padding: 4px 10px; }
            .status-text { font-size: 10px; }
            .status-text .sub { font-size: 9px; }
            .hero-gear { width: 32px; height: 32px; min-width: 32px; min-height: 32px; }
            .hero-gear ha-icon { --mdc-icon-size: 16px; }

            .summary-card { padding: 12px 6px; gap: 8px; }
            .stat-circle { width: 38px; height: 38px; min-width: 38px; }
            .stat-circle ha-icon { --mdc-icon-size: 18px; }
            .stat-big { font-size: 12px; }
            .stat-big.mode { font-size: 10px; }
            .stat-small { font-size: 9px; }

            .room-list { gap: 4px; }
            .room { padding: 5px 10px; gap: 8px; }
            .room-icon { width: 44px; height: 44px; min-width: 44px; }
            .room-icon ha-icon { --mdc-icon-size: 26px; }
            .room-name { font-size: 13px; }
            .check-circle { width: 14px; height: 14px; min-width: 14px; }

            button { font-size: 11px; padding: 4px 10px; gap: 4px; }
            button ha-icon { --mdc-icon-size: 14px; }

            .cleaning-task-line { font-size: 22px; }
            .cleaning-where-line { font-size: 14px; }
            .cleaning-action-btn { width: 56px; height: 56px; min-width: 56px; min-height: 56px; }
            .cleaning-action-btn ha-icon { --mdc-icon-size: 26px; }
            .action-label { font-size: 11px; }

            .modal { padding: 14px; max-height: 92vh; border-radius: 28px 28px 0 0; width: 100%; max-width: 100%; }
            .modal-backdrop { padding: 0; align-items: flex-end; }
            .circle-row { grid-template-columns: repeat(auto-fill, minmax(64px, 1fr)); gap: 6px; }
            .circle-icon { width: 44px; height: 44px; }
            .circle-icon ha-icon { --mdc-icon-size: 20px; }
            .circle-option { min-height: 72px; font-size: 10px; }
            .tabs.three .tab span, .tabs.two .tab span { display: none; }
          }

          @media (max-width: 360px) {
            .stat-big { font-size: 11px; }
            .room-list { grid-template-columns: 1fr; grid-template-rows: repeat(var(--rows-1, 12), auto); }
            button span { font-size: 10px; }
          }
        </style>

        <div class="wrap">
          <!-- HERO -->
          <div class="hero">
            <div class="hero-icon ${isActive ? "active" : ""}">
              ${this.config.image ? `
                <img src="${this.config.image}" alt="${this.config.title || this._t("robot_vacuum")}"
                  style="${isActive ? `animation-delay: -${(Date.now() / 1000) % 6}s;` : ""}" />
              ` : `
                <ha-icon icon="mdi:robot-vacuum"
                  style="${isActive ? `animation-delay: -${(Date.now() / 1000) % 6}s;` : ""}"></ha-icon>
              `}
            </div>
            <div class="hero-text">
              <div class="hero-title">${this.config.title || entity.attributes.friendly_name || this._t("fallback_title")}</div>
            </div>
            <div class="status-pill">
              <div class="status-dot-wrap ${isActive ? "" : "idle"}">
                <div class="dot"></div>
              </div>
              <div class="status-text">
                <div class="label">${this._label(entity.state, VACUUM_STATE_LABELS) || entity.state}</div>
                <div class="sub">${this._label(status, VACUUM_STATUS_LABELS) || status || ""}</div>
              </div>
            </div>
            <button class="hero-gear" id="advancedToggle" aria-label="Advanced settings" type="button">
              <ha-icon icon="mdi:cog-outline"></ha-icon>
            </button>
          </div>

          <!-- ALERT BANNER (own row, only when there are warnings) -->
          ${warnings.length ? `
            <div class="alert-banner" title="${warnings.map(w => w.label).join(", ")}">
              <ha-icon class="alert-banner-icon" icon="mdi:alert"></ha-icon>
              <div class="alert-banner-text">
                <div class="alert-banner-label">${warnings[0].label}</div>
                ${warnings.length > 1 ? `<div class="alert-banner-sub">${this._t("alert_more", { n: warnings.length - 1 })}</div>` : ""}
              </div>
            </div>
          ` : ""}

          <!-- SUMMARY -->
          <div class="summary-card">
            <div class="stat-item">
              ${this.renderStatRing("mdi:lightning-bolt", battery, isCharging)}
              <div class="stat-big">${battery}%</div>
              <div class="stat-small">${this._t("stat_battery")}</div>
            </div>
            <div class="stat-item">
              ${this.renderStatRing("mdi:floor-plan", 100, isActive)}
              <div class="stat-big">${attr.cleaned_area ?? 0} m²</div>
              <div class="stat-small">${this._t("stat_area")}</div>
            </div>
            <div class="stat-item">
              ${this.renderStatRing("mdi:timer-outline", 100, isActive)}
              <div class="stat-big">${attr.cleaning_time ?? 0} min</div>
              <div class="stat-small">${this._t("stat_time")}</div>
            </div>
            <div class="stat-item">
              ${this.renderStatRing(this.getModeIcon(mode), 100, isActive)}
              <div class="stat-big mode">${mode}</div>
              <div class="stat-small">${this._t("stat_mode")}</div>
            </div>
          </div>

          <div class="content-area">
            <!-- ROOMS HEAD -->
            <div class="rooms-head">
              <div class="section-label">${this._t("section_rooms")}</div>
              <div class="selected-count">${this._t("rooms_selected", { count: selectedCount })}</div>
            </div>

            <!-- ROOMS -->
            <div class="room-list" style="--rows-3: ${Math.max(1, Math.ceil(rooms.length / 3))}; --rows-2: ${Math.max(1, Math.ceil(rooms.length / 2))}; --rows-1: ${Math.max(1, rooms.length)};">
              ${rooms.map(room => `
                <div class="room ${this.selectedRooms.has(room.id) ? "selected" : ""}" data-room="${room.id}">
                  <div class="room-icon"><ha-icon icon="${this.getRoomIcon(room.name)}"></ha-icon></div>
                  <div class="room-info">
                    <div class="room-name">${room.name}</div>
                  </div>
                  <div class="check-circle"><ha-icon icon="mdi:check-bold"></ha-icon></div>
                </div>
              `).join("")}
            </div>

            <!-- MAIN ACTIONS — Clean Selected is primary when rooms picked,
                 Clean All is primary when none. The non-primary one falls back
                 to the default button style and disabled fade. -->
            <div class="btn-row main" style="margin-bottom:0;">
              <button class="${selectedCount > 0 ? "primary" : ""}" id="cleanSelected" type="button" ${selectedCount === 0 ? "disabled" : ""}>
                <ha-icon icon="mdi:play"></ha-icon>
                <span>${this._t("btn_clean_selected")}</span>
              </button>
              <button class="${selectedCount === 0 ? "primary" : ""}" id="cleanAll" type="button" ${selectedCount > 0 ? "disabled" : ""}>
                <ha-icon icon="mdi:home-variant"></ha-icon>
                <span>${this._t("btn_clean_all")}</span>
              </button>
              <button id="clear" type="button" ${selectedCount === 0 ? "disabled" : ""}>
                <ha-icon icon="mdi:eraser"></ha-icon>
                <span>${this._t("btn_clear")}</span>
              </button>
            </div>

            ${isActive ? this.renderCleaningOverlay(attr, entity, battery, status, rooms, activeJob) : ""}
          </div>
        </div>

        ${this.renderAdvancedPopup(attr)}
      </ha-card>
    `;

    this.attachEventListeners(rooms, attr);

    // Robust modal scroll preservation (iOS Safari has timing quirks with scrollTop
    // restoration after innerHTML replacement, so we restore at multiple points)
    if (this.advancedOpen) {
      const newModal = this.querySelector("#advancedModal");
      if (newModal) {
        const target = this._modalScrollTop || 0;
        if (target) {
          newModal.scrollTop = target;
          requestAnimationFrame(() => {
            const m = this.querySelector("#advancedModal");
            if (m) m.scrollTop = target;
          });
          // Extra fallback for iOS Safari momentum-scroll oddities
          setTimeout(() => {
            const m = this.querySelector("#advancedModal");
            if (m && Math.abs(m.scrollTop - target) > 4) m.scrollTop = target;
          }, 30);
        }
        // Track scroll continuously so we have the latest position for the next render.
        // We bind the handler instance once per render but it's harmless — each modal
        // element only lives until the next innerHTML replacement.
        newModal.addEventListener("scroll", () => {
          this._modalScrollTop = newModal.scrollTop;
        }, { passive: true });
      }
    } else {
      this._modalScrollTop = 0;
    }
  }

  attachEventListeners(rooms, attr) {
    this.querySelectorAll(".room").forEach((el) => {
      el.addEventListener("click", () => this.toggleRoom(Number(el.dataset.room)));
    });

    this.querySelector("#clear")?.addEventListener("click", () => this.clearSelection());
    this.querySelector("#cleanSelected")?.addEventListener("click", () => this.cleanSelected());
    this.querySelector("#cleanAll")?.addEventListener("click", () => this.cleanAll());

    // Cleaning overlay actions
    this.querySelector("#overlayPauseResume")?.addEventListener("click", () => this.pauseOrResume());
    // End job = abort + return to dock. Clear the active-job tracker immediately so
    // the overlay disappears once the robot reaches dock (instead of hanging around
    // for post-job self-clean/wash/dry which the user already chose to skip).
    this.querySelector("#overlayStop")?.addEventListener("click", () => {
      this._clearJobAndSelection();
      this.dock();
    });
    this.querySelector("#overlaySelfClean")?.addEventListener("click", () => this.selfClean());

    this.querySelector("#advancedToggle")?.addEventListener("click", () => {
      this.advancedOpen = true;
      this._modalScrollTop = 0; // start at top when opening
      this.render();
    });

    this.querySelector("#locateInModal")?.addEventListener("click", () => this.locate());

    this.querySelector("#closeAdvanced")?.addEventListener("click", () => {
      this.advancedOpen = false;
      this.expandedRooms.clear();
      this.render();
    });

    this.querySelector("#modalBackdrop")?.addEventListener("click", (event) => {
      if (event.target.id === "modalBackdrop") {
        this.advancedOpen = false;
        this.expandedRooms.clear();
        this.render();
      }
    });

    // Tab navigation — just switch which tab content is visible.
    // The CleanGenius/Custom toggle is now a separate slider INSIDE the
    // Cleaning tab (see [data-cg-slider] below), not a tab switch itself.
    this.querySelectorAll(".tab").forEach((tab) => {
      tab.addEventListener("click", () => {
        this.activeAdvancedTab = tab.dataset.tab;
        this.expandedRooms.clear();
        this._modalScrollTop = 0;
        this.render();
      });
    });

    // CleanGenius ↔ Custom slide toggle (inside Cleaning tab).
    // Trick: we update the class on the EXISTING DOM element so CSS transitions
    // can run, and suspend the auto re-render briefly so HA's incoming state
    // update doesn't replace innerHTML mid-animation.
    this.querySelectorAll("[data-cg-slider]").forEach((btn) => {
      btn.addEventListener("click", () => {
        const target = btn.dataset.cgSlider;

        const toggle = this.querySelector(".cg-toggle");
        if (toggle) {
          toggle.classList.toggle("right", target === "custom");
          toggle.classList.toggle("left", target === "cleangenius");
          // Also flip the active class on the inner buttons so text colours animate
          this.querySelectorAll(".cg-toggle-option").forEach((b) => {
            b.classList.toggle("active", b.dataset.cgSlider === target);
          });
        }

        // Pause renders for the duration of the slide so the animation completes
        this._suspendRender = true;
        clearTimeout(this._suspendRenderTimer);
        this._suspendRenderTimer = setTimeout(() => {
          this._suspendRender = false;
          this.render();
        }, 320);

        const cleangeniusList = attr.cleangenius_list || [];
        const cur = attr.cleangenius || "";
        const isOn = !!cur && !/off/i.test(cur);
        if (target === "cleangenius" && !isOn && cleangeniusList.length) {
          const targetMode = (this._lastCleanGeniusMode && cleangeniusList.includes(this._lastCleanGeniusMode))
            ? this._lastCleanGeniusMode
            : cleangeniusList.find(o => !/off/i.test(o));
          if (targetMode) this.setCleanGenius(targetMode, attr);
        } else if (target === "custom" && isOn && cleangeniusList.length) {
          const offOption = cleangeniusList.find(o => /off/i.test(o)) || "Off";
          this.setCleanGenius(offOption, attr);
        }
      });
    });

    this.querySelectorAll("[data-fan]").forEach((btn) => {
      btn.addEventListener("click", () => this.setFanSpeed(btn.dataset.fan, attr));
    });

    this.querySelectorAll("[data-cleaning-mode]").forEach((btn) => {
      btn.addEventListener("click", () => {
        // Reset scroll & collapse all rooms when switching mode — content layout shifts a lot
        this._modalScrollTop = 0;
        this.expandedRooms.clear();
        this.setCleaningMode(btn.dataset.cleaningMode, attr);
      });
    });

    this.querySelectorAll("[data-cleangenius]").forEach((btn) => {
      btn.addEventListener("click", () => this.setCleanGenius(btn.dataset.cleangenius, attr));
    });

    this.querySelectorAll("[data-cleangenius-mode]").forEach((btn) => {
      btn.addEventListener("click", () => this.setCleanGeniusMode(btn.dataset.cleangeniusMode, attr));
    });

    this.querySelectorAll("[data-route]").forEach((btn) => {
      btn.addEventListener("click", () => this.setRoute(btn.dataset.route, attr));
    });

    this.querySelectorAll("[data-mop-humidity]").forEach((btn) => {
      btn.addEventListener("click", () => this.setMopHumidity(btn.dataset.mopHumidity, attr));
    });

    // Global wetness slider in Custom tab (replaces the legacy mop_pad_humidity circles)
    this.querySelector("[data-wetness]")?.addEventListener("change", (e) => {
      this.setNumberValue("wetness_level", ["wetness_level"], e.target.value, "Wetness level");
    });

    // Global cleaning_times pills (1x / 2x / 3x) — passed as `repeats` to the clean service
    this.querySelectorAll("[data-cleaning-times]").forEach((btn) => {
      btn.addEventListener("click", () => {
        const n = Number(btn.dataset.cleaningTimes);
        if (n >= 1 && n <= 3) {
          this._globalCleaningTimes = n;
          this._saveCleaningTimes(n);
          this.render();
        }
      });
    });

    // ----- New listeners -----
    this.querySelector("#toggleMaxPower")?.addEventListener("click", () => {
      this.toggleSwitch("max_suction_power", ["max_suction_power"], "Max+ Suction Power");
    });

    this.querySelector("#toggleCustomized")?.addEventListener("click", () => {
      this._modalScrollTop = 0; // layout changes drastically when toggling
      this.expandedRooms.clear();
      this.toggleSwitch("customized_cleaning", ["customized_cleaning"], "Customized cleaning");
    });


    this.querySelectorAll("[data-selfclean-freq]").forEach((btn) => {
      btn.addEventListener("click", () => this.setSelfCleanFrequency(btn.dataset.selfcleanFreq));
    });

    this.querySelector("#selfCleanArea")?.addEventListener("change", (e) => {
      this.setNumberValue("self_clean_area", ["self_clean_area"], e.target.value, "Self Clean Area");
    });

    this.querySelector("#selfCleanTime")?.addEventListener("change", (e) => {
      this.setNumberValue("self_clean_time", ["self_clean_time"], e.target.value, "Self Clean Time");
    });

    // Per-room accordion toggle
    this.querySelectorAll("[data-room-toggle]").forEach((btn) => {
      btn.addEventListener("click", () => this.toggleRoomExpand(Number(btn.dataset.roomToggle)));
    });

    // Per-room settings
    this.querySelectorAll("[data-room-cycles]").forEach((btn) => {
      btn.addEventListener("click", () => {
        this.setRoomSelect(Number(btn.dataset.roomCycles), "cleaning_times", btn.dataset.value);
      });
    });

    this.querySelectorAll("[data-room-suction]").forEach((btn) => {
      btn.addEventListener("click", () => {
        this.setRoomSelect(Number(btn.dataset.roomSuction), "suction_level", btn.dataset.value);
      });
    });

    this.querySelectorAll("[data-room-wetness]").forEach((slider) => {
      slider.addEventListener("change", (e) => {
        this.setRoomNumber(Number(slider.dataset.roomWetness), "wetness_level", e.target.value);
      });
    });

    // ----- Behavior tab listeners -----
    this.querySelector("[data-toggle-dnd]")?.addEventListener("click", () => {
      this.toggleSwitch("dnd", ["dnd"], "Do Not Disturb");
    });
    this.querySelector("[data-dnd-start]")?.addEventListener("change", (e) => {
      this.setTimeValue("dnd_start", ["dnd_start"], e.target.value);
    });
    this.querySelector("[data-dnd-end]")?.addEventListener("change", (e) => {
      this.setTimeValue("dnd_end", ["dnd_end"], e.target.value);
    });
    this.querySelector("[data-volume]")?.addEventListener("change", (e) => {
      this.setNumberValue("volume", ["volume"], e.target.value, "Volume");
    });
    this.querySelector("[data-toggle-resume]")?.addEventListener("click", () => {
      this.toggleSwitch("resume", ["resume_cleaning"], "Resume after pause");
    });
    this.querySelector("[data-toggle-childlock]")?.addEventListener("click", () => {
      this.toggleSwitch("child_lock", ["child_lock"], "Child lock");
    });
    this.querySelector("[data-toggle-carpetboost]")?.addEventListener("click", () => {
      this.toggleSwitch("carpet_boost", ["carpet_boost"], "Carpet boost");
    });
    this.querySelector("[data-toggle-carpetavoid]")?.addEventListener("click", () => {
      this.toggleSwitch("carpet_avoid", ["carpet_avoidance"], "Carpet avoidance");
    });
    this.querySelector("[data-toggle-automountmop]")?.addEventListener("click", () => {
      this.toggleSwitch("auto_mount_mop", ["auto_mount_mop"], "Auto-mount mop");
    });

    // ----- Dock tab listeners -----
    this.querySelector("[data-toggle-autoempty]")?.addEventListener("click", () => {
      this.toggleSwitch("auto_empty", ["auto_dust_collecting"], "Auto empty");
    });
    this.querySelectorAll("[data-auto-empty-freq]").forEach((btn) => {
      btn.addEventListener("click", () => {
        const id = this.findSettingSelect("auto_empty_freq", ["auto_empty_frequency"], [], "");
        if (id) this.call("select", "select_option", { entity_id: id, option: btn.dataset.autoEmptyFreq });
      });
    });
    this.querySelector("[data-toggle-autodetergent]")?.addEventListener("click", () => {
      this.toggleSwitch("auto_detergent", ["auto_add_detergent"], "Auto-add detergent");
    });
    this.querySelector("[data-dryingtime]")?.addEventListener("change", (e) => {
      this.setNumberValue("drying_time", ["drying_time"], e.target.value, "Drying time");
    });

    // Quick action buttons
    this.querySelector("[data-action-stationclean]")?.addEventListener("click", () => {
      this.pressButton("base_station_cleaning", ["base_station_cleaning"]);
    });
  }

  getCardSize() {
    return 8;
  }
}

customElements.define("dreame-vacuum-card", DreameVacuumCard);

window.customCards = window.customCards || [];
window.customCards.push({
  type: "dreame-vacuum-card",
  name: "Dreame Vacuum Card",
  description: "Responsive Lovelace card for the Dreame Vacuum Home Assistant integration — works on desktop and mobile.",
  preview: true,
  documentationURL: "https://github.com/hedegaard1/dreame-vacuum-card",
});
