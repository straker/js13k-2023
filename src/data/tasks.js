import { resource, building } from './state.js';
import { wood, stone, skeleton, amount } from './resources.js';
import { rituralCircle, woodcuttersCamp, built } from './buildings.js';

// indices
export const name = 0;
export const effect = 1;
export const prereq = 2;
export const assignable = 3;
export const assigned = 4;
export const visible = 5;

export const idle = 0;
export const woodcutters = 1;

const tasks = [];
export default tasks;

export function initTasks() {
  tasks.push.call(tasks,
    // 0
    [
      'Idle',
      [],
      [
        [building, rituralCircle, built, 1]
      ]
    ],

    // 2
    [
      'Woodcutters',
      [resource, wood, amount, 1],
      [
        [building, woodcuttersCamp, built, 1]
      ]
    ]
  );
}