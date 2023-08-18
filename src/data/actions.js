import {
  SHORT_COOLDOWN,
  MEDIUM_COOLDOWN,
  LONG_COOLDOWN,
} from '../constants.js';
import { resource, action, building } from './state.js';
import { wood, stone, skeleton, amount } from './resources.js';
import { rituralCircle, woodcuttersCamp, built } from './buildings.js';

// indices
export const name = 0;
export const cooldown = 1;
export const effect = 2;
export const prereq = 3;
export const assignable = 4;
export const assigned = 5;
export const visible = 6;
export const clicked = 7;
export const disabled = 8;
export const timer = 9;

export const chopWood = 0;
export const digStone = 1;
export const stealCorpse = 2;
export const idle = 3;
export const woodcutters = 4;

const actions = [];
export default actions;

export function initActions() {
  actions.push.call(actions,
    // 0
    [
      'Chop Wood',
      SHORT_COOLDOWN,
      [resource, wood, amount, 15],
      ,
      1
    ],

    // 1
    [
      'Dig Stone',
      MEDIUM_COOLDOWN,
      [resource, stone, amount, 10],
      [
        [action, chopWood, clicked, 2]
      ],
      1
    ],

    // 2
    [
      'Steal Corpse',
      LONG_COOLDOWN,
      [resource, skeleton, amount, 1],
      [
        [building, rituralCircle, built, 1]
      ],
      1
    ],

    // 3
    [
      'Idle',
      Infinity,
      [],
      [
        [building, rituralCircle, built, 1]
      ]
    ],

    // 4
    [
      'Woodcutters',
      SHORT_COOLDOWN,
      [resource, wood, amount, 1],
      [
        [building, woodcuttersCamp, built, 1]
      ]
    ]
  );
}