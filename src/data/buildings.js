import { resource, action } from './state.js';
import { wood, stone, skeleton, max } from './resources.js';
import { digStone, clicked as actionClicked } from './actions.js';

// indices
export const name = 0;
export const description = 1;
export const cost = 2;
export const state = 3;
export const prereq = 4;
export const built = 5;
export const hidden = 6;
export const disabled = 7;

export const rituralCircle = 0;

const buildings = [];
export default buildings;

export function initBuildings() {
  buildings.push.apply(buildings, [
    // 0
    [
      'Ritual Circle',
      'Increases skeleton capacity by 4',
      [
        [wood, 50],
        [stone, 25]
      ],
      [resource, skeleton, max, 4],
      [
        [action, digStone, actionClicked, 3]
      ]
    ]
  ]);
}