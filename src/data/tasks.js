import { building } from './state.js';
import {
  wood,
  stone,
  skeletons,
  planks
} from './resources.js';
import {
  rituralCircle,
  woodcuttersCamp,
  lumberMill,
  built
} from './buildings.js';

// indices
export const name = 0;
export const effects = 1;
export const prereq = 2;
export const assignable = 3;
export const assigned = 4;
export const visible = 5;

export const idle = 0;
export const woodcutters = 1;
export const carpenters = 2;

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

    // 1
    [
      'Woodcutters',
      [
        // tasks always take from a resource amount so we
        // can skip putting that data here
        [wood, 1]
      ],
      [
        [building, woodcuttersCamp, built, 1]
      ]
    ],

    // 2
    [
      'Carpenters',
      [
        [wood, -1],
        [planks, 1]
      ],
      [
        [building, lumberMill, built, 1]
      ]
    ]
  );
}