import { resource, building, task } from './state.js';
import resources, {
  wood,
  stone,
  skeletons,
  amount,
  max
} from './resources.js';
import {
  woodcutters,
  carpenters,
  assignable,
} from './tasks.js';

// indices
export const name = 0;
export const description = 1;
export const cost = 2;
export const effect = 3;
export const prereq = 4;
export const built = 5;
export const visible = 6;
export const disabled = 7;

export const rituralCircle = 0;
export const woodcuttersCamp = 1;
export const lumberMill = 2;

const buildings = [];
export default buildings;

export function initBuildings() {
  buildings.push.call(buildings,
    // 0
    [
      'Ritual Circle',
      `Increases skeletons capacity by 4`,
      [
        // costs are always taken from a resource amount so we
        // can skip putting that data here
        [wood, 50],
        [stone, 25]
      ],
      [resource, skeletons, max, 4],
      [
        [resource, wood, amount, 50],
        [resource, stone, amount, 25]
      ]
    ],

    // 1
    [
      'Woodcutters Camp',
      `Allows up to 3 skeletons to gather Wood`,
      [
        [wood, 50]
      ],
      [task, woodcutters, assignable, 3],
      [
        [building, rituralCircle, built, 1]
      ]
    ],

    // 2
    [
      'Lumber Mill',
      'Allows up to 3 skeletons to cut Wood into Planks',
      [
        [wood, 50],
        [stone, 25]
      ],
      [task, carpenters, assignable, 3],
      [
        [building, woodcuttersCamp, built, 1]
      ]
    ]
  );
}