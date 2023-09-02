// tick timers are in milliseconds
export const RESOURCE_TICK = 600;  // 10s
export const SAVE_TICK = 3600;  // 1min
export const ATTACK_TICK = 18e3; // 5min

// cooldown timers are in seconds
export const LONG_COOLDOWN = 10;
export const XLONG_COOLDOWN = LONG_COOLDOWN * 2;
export const MEDIUM_COOLDOWN = LONG_COOLDOWN / 1.5;
export const SHORT_COOLDOWN = LONG_COOLDOWN / 2;
export const SAVE_KEY = 'straker-2023-state';