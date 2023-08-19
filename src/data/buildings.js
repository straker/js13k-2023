import { resource, building, task } from './state.js';
import resources, {
  wood,
  stone,
  skeleton,
  icon,
  amount,
  max
} from './resources.js';
import {
  woodcutters,
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


const buildings = [];
export default buildings;

export function initBuildings() {
  const woodIcon = resources[wood][icon];
  const skeletonIcon = resources[skeleton][icon];

  buildings.push.call(buildings,
    // 0
    [
      'Ritual Circle',
      `Increases ${skeletonIcon} capacity by 4`,
      [
        [wood, 50],
        [stone, 25]
      ],
      [resource, skeleton, max, 4],
      [
        [resource, wood, amount, 50],
        [resource, stone, amount, 25]
      ]
    ],

    // 1
    [
      'Woodcutters Camp',
      `Allows up to 3 ${skeletonIcon} to chop down trees into ${woodIcon}`,
      [
        [wood, 50]
      ],
      [task, woodcutters, assignable, 3],
      [
        [building, rituralCircle, built, 1]
      ]
    ]

    // 2
    // [
    //   'Lumber Mill',
    //   'Allows 3 Skeletons to cut Wood into Planks',
    //   [
    //     [wood, 50],
    //     [stone, 25]
    //   ],
    //   [],
    //   [
    //     [action, digStone, actionClicked, 3]
    //   ]
    // ]
  );
}