import { resource, building, action } from './state.js';
import {
  wood,
  stone,
  skeleton,
  amount,
  max
} from './resources.js';
import {
  digStone,
  woodcutters,
  assignable,
  clicked as actionClicked
} from './actions.js';

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
  buildings.push.call(buildings,
    // 0
    [
      'Ritual Circle',
      'Increases Skeleton capacity by 4',
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
      'Allows 3 Skeletons to chop down trees into Wood',
      [
        [wood, 50]
      ],
      [action, woodcutters, assignable, 3],
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