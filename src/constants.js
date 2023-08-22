// resource tick is every 10 seconds (60 fps * 10 seconds)
export const RESOURCE_TICK = 600;
// save tick is every 1 minutes (60 fps * 60 seconds)
export const SAVE_TICK = 3600;
export const LONG_COOLDOWN = 1 /*20*/;
export const MEDIUM_COOLDOWN = LONG_COOLDOWN / 1.5;
export const SHORT_COOLDOWN = LONG_COOLDOWN / 2;
export const SAVE_KEY = 'straker-2023-state';