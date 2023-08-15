import {
  SHORT_COOLDOWN,
  MEDIUM_COOLDOWN,
  LONG_COOLDOWN,
} from '../constants.js';
import { resource, action, building } from './state.js';
import { wood, stone, skeleton, amount } from './resources.js';
import { rituralCircle, built } from './buildings.js';

// indices
export const name = 0;
export const colldown = 1;
export const state = 2;
export const prereq = 3;
export const hidden = 4;
export const clicked = 5;
export const disabled = 6;

export const chopWood = 0;
export const digStone = 1;
export const stealCorpose = 2;

const actions = [];
export default actions;

export function initActions() {
  actions.push.apply(actions, [
    // 0
    [
      'Chop Wood',
      SHORT_COOLDOWN,
      [resource, wood, amount, 15]
    ],

    // 1
    [
      'Dig Stone',
      MEDIUM_COOLDOWN,
      [resource, stone, amount, 10],
      [
        [action, chopWood, clicked, 2]
      ]
    ],

    // 2
    [
      'Steal Corpse',
      LONG_COOLDOWN,
      [resource, skeleton, amount, 1],
      [
        [building, rituralCircle, built, 1]
      ]
    ]
  ]);
}