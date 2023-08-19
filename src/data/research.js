import { resource, building } from './state.js';
import { wood, stone, skeleton, amount } from './resources.js';
import { rituralCircle, woodcuttersCamp, built } from './buildings.js';

// indices
export const name = 0;
export const effect = 1;
export const prereq = 2;
export const visible = 5;

export const idle = 0;
export const woodcutters = 1;

const research = [];
export default research;

export function initResearch() {
  research.push.call(research,
    // 0
    [
      'Idle',
      [building, coalMakers, visible, true],
      [
        [building, rituralCircle, built, 1]
      ]
    ]
  );
}