import {
  SHORT_COOLDOWN,
  MEDIUM_COOLDOWN,
  LONG_COOLDOWN,
} from '../constants.js';
import { resource, action, building } from './state.js';
import {
  amount,
  wood,
  stone,
  corpses,
  mana,
  skeletons,
  armaments,
  armor,
  bows,
  militia,
  infantry,
  archers,
  calvary
} from './resources.js';
import { built, rituralCircle, woodcuttersCamp } from './buildings.js';
import { assigned, idle } from './tasks.js';

// indices
export const name = 0;
export const description = 1;
export const cooldown = 2;
export const effects = 3;
export const prereq = 4;
export const visible = 5;
export const clicked = 6;
export const disabled = 7;
export const timer = 8;

export const chopWood = 0;
export const digStone = 1;
export const stealCorpse = 2;
export const raiseSkeleton = 3;
export const recoverMana = 4;
export const raiseMilitia = 5;
export const raiseInfantry = 6;
export const raiseArchers = 7;
export const raiseCalvary = 8;

const actions = [];
export default actions;

export function initActions() {
  actions.push.call(actions,
    // 0
    [
      'Chop Wood',
      'Chop wood from a tree',
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
      'Gather Stones',
      'Gather stones from the ground',
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
      'Sneak into a graveyard and snatch a corpse for raising as a Skeleton',
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
      'Reanimate Skeleton',
      'Reanimate a corpse as a Skeleton to perform various tasks',
      LONG_COOLDOWN,
      [
        [mana, -5],
        [corpses, -1],
        [skeletons, 1]
      ],
      [
        [building, rituralCircle, built, 1]
      ]
    ],

    // 4
    [
      'Recover Mana',
      'Meditate on your evil acts',
      LONG_COOLDOWN,
      [
        [mana, 10]
      ],
      [
        [building, rituralCircle, built, 1]
      ]
    ],

    // 5
    [
      'Reanimate Militia',
      'Reanimate a group of corpses to fight for you as unarmed Militia.<br/><br/>Militia are cheap but weak vs Infantry, Archers, and Calvary',
      LONG_COOLDOWN,
      [
        [mana, -50],
        [corpses, -10],
        [militia, 10]
      ],
      [
        [action, raiseSkeleton, clicked, 2]
      ]
    ],

    // 6
    [
      'Reanimate Infantry',
      'Reanimate a group of corpses to fight for you as armed Infantry.<br/><br/>Infantry are strong vs Calvary',
      LONG_COOLDOWN,
      [
        [mana, -150],
        [corpses, -8],
        [armaments, -8],
        [armor, -8],
        [infantry, 8],
      ],
      [
        [action, raiseSkeleton, clicked, 2]
      ]
    ],

    // 7
    [
      'Reanimate Archers',
      'Reanimate a group of corpses to fight for you as Archers.<br/><br/>Archers are strong vs Infantry',
      LONG_COOLDOWN,
      [
        [mana, -175],
        [corpses, -6],
        [bows, -6],
        [armor, -6],
        [archers, 6]
      ],
      [
        [action, raiseSkeleton, clicked, 2]
      ]
    ],

    // 8
    [
      'Reanimate Calvary',
      'Reanimate a group of corpses to fight for you as Calvary.<br/><br/>Calvary are strong vs Archers',
      LONG_COOLDOWN,
      [
        [mana, -250],
        [corpses, -8],
        [armaments, -4],
        [armor, -8],
        [calvary, 4]
      ],
      [
        [action, raiseSkeleton, clicked, 2]
      ]
    ],
  );
}