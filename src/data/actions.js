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
  weapons,
  armor,
  bows,
  militia,
  infantry,
  archers,
  calvary
} from './resources.js';
import { built, rituralCircle, woodcuttersCamp, laboratory } from './buildings.js';
import { assigned, idle } from './tasks.js';

// indices
export const name = 0;
export const description = 1;
export const cooldown = 2;
export const effects = 3;
export const prereq = 4;
export const cost = 5;
export const researchCost = 6;
export const unlocked = 7;
export const visible = 8;
export const clicked = 9;
export const disabled = 10;
export const timer = 11;

export const chopWood = 0;
export const digStone = 1;
export const stealCorpse = 2;
export const reanimateSkeleton = 3;
export const recoverMana = 4;
export const reanimateMilitia = 5;
export const reanimateInfantry = 6;
export const reanimateArchers = 7;
export const reanimateCalvary = 8;

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
        // actions always increase a resource amount so we
        // can skip putting that data here
        [wood, 20]
      ]
    ],

    // 1
    [
      'Gather Stones',
      'Gather stones from the ground',
      MEDIUM_COOLDOWN,
      [
        [stone, 15]
      ],
      [
        [action, chopWood, clicked, 2]
      ]
    ],

    // 2
    [
      'Steal Corpse',
      'Sneak into a graveyard and snatch a corpse for reanimating as a Skeleton',
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
        [skeletons, 1]
      ],
      [
        [building, rituralCircle, built, 1]
      ],
      [
        [mana, 5],
        [corpses, 1],
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
        [action, reanimateSkeleton, clicked, 1]
      ]
    ],

    // 5
    [
      'Reanimate Militia',
      'Reanimate a group of corpses to fight for you as unarmed Militia.<br/><br/>Militia are cheap but weak vs Infantry, Archers, and Calvary',
      LONG_COOLDOWN,
      [
        [militia, 10]
      ],
      [
        [building, laboratory, built, 1]
      ],
      [
        [mana, 50],
        [corpses, 10]
      ],
      70
    ],

    // 6
    [
      'Reanimate Infantry',
      'Reanimate a group of corpses to fight for you as armed Infantry.<br/><br/>Infantry are strong vs Calvary',
      LONG_COOLDOWN,
      [
        [infantry, 8]
      ],
      [
        [building, laboratory, built, 1]
      ],
      [
        [mana, 150],
        [corpses, 8],
        [weapons, 8],
        [armor, 8],
      ],
      700
    ],

    // 7
    [
      'Reanimate Archers',
      'Reanimate a group of corpses to fight for you as Archers.<br/><br/>Archers are strong vs Infantry',
      LONG_COOLDOWN,
      [
        [archers, 6]
      ],
      [
        [building, laboratory, built, 1]
      ],
      [
        [mana, 175],
        [corpses, 6],
        [bows, 6],
        [armor, 6]
      ],
      900
    ],

    // 8
    [
      'Reanimate Calvary',
      'Reanimate a group of corpses to fight for you as Calvary.<br/><br/>Calvary are strong vs Archers',
      LONG_COOLDOWN,
      [
        [calvary, 4]
      ],
      [
        [building, laboratory, built, 1]
      ],
      [
        [mana, 250],
        [corpses, 8],
        [weapons, 4],
        [armor, 8]
      ],
      1100
    ],
  );

  // first action is always visible
  actions[0][visible] = true;
}