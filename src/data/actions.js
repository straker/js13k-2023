import {
  SHORT_COOLDOWN,
  MEDIUM_COOLDOWN,
  LONG_COOLDOWN,
} from '../constants.js';
import { resource, action, building } from './state.js';
import { amount, wood, stone, corpses, skeletons } from './resources.js';
import { built, rituralCircle, woodcuttersCamp } from './buildings.js';
import { assigned, idle } from './tasks.js';

// indices
export const name = 0;
export const cooldown = 1;
export const effects = 2;
export const prereq = 3;
export const visible = 4;
export const clicked = 5;
export const disabled = 6;
export const timer = 7;

export const chopWood = 0;
export const digStone = 1;
export const stealCorpse = 2;
export const raiseSkeleton = 3;

const actions = [];
export default actions;

export function initActions() {
  actions.push.call(actions,
    // 0
    [
      'Chop Wood',
      SHORT_COOLDOWN,
      [
        // tasks always take from a resource amount so we
        // can skip putting that data here
        [wood, 15]
      ],
      [],
      true
    ],

    // 1
    [
      'Dig Stone',
      MEDIUM_COOLDOWN,
      [
        [stone, 10]
      ],
      [
        [action, chopWood, clicked, 2]
      ]
    ],

    // 2
    [
      'Steal Corpse',
      LONG_COOLDOWN,
      [
        [corpses, 1]
      ],
      [
        [action, digStone, clicked, 2]
      ]
    ],

    // 3
    [
      'Raise Skeleton',
      LONG_COOLDOWN,
      [
        [corpses, -1],
        [skeletons, 1]
      ],
      [
        [building, rituralCircle, built, 1]
      ]
    ]
  );
}