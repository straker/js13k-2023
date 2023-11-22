// tick timers are in fps
export const RESOURCE_TICK = 600;  // 10s
export const SAVE_TICK = 3600;     // 1min
export const ATTACK_TICK = 36e3;   // 10min

// cooldown timers are in seconds
export const LONG_COOLDOWN = 10;
export const XLONG_COOLDOWN = LONG_COOLDOWN * 2;
export const MEDIUM_COOLDOWN = LONG_COOLDOWN / 1.5;
export const SHORT_COOLDOWN = LONG_COOLDOWN / 2;
export const LONG_ATTACK_COOLDOWN = 20;
export const XLONG_ATTACK_COOLDOWN = LONG_ATTACK_COOLDOWN * 2;
export const MEDIUM_ATTACK_COOLDOWN = LONG_ATTACK_COOLDOWN / 1.5;
export const SHORT_ATTACK_COOLDOWN = LONG_ATTACK_COOLDOWN / 2;

export const SAVE_KEY = 'straker-2023-state';

export const SMALL_MEDIA_QUERY = matchMedia('(max-width: 47.375rem)');
export const MEDIUM_MEDIA_QUERY = matchMedia('(min-width: 47.376rem) and (max-width: 71.25rem)');
export const LARGE_MEDIA_QUERY = matchMedia('(min-width: 71.26rem)');
