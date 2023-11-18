import { resource, action, building } from './state.js';
import {
  visible as actionVisible,
  digStone,
  stealCorpse,
  reanimateSkeleton,
  reanimateMilitia,
  reanimateInfantry,
  reanimateArchers,
  reanimateCavalry
} from './actions.js';
import {
  built,
  rituralCircle,
  lumberMill,
  laboratory,
  quarry,
  masonsWorkshop,
  burnersCamp,
  mine,
  furnace,
  smithy,
  weaponsWorkshop,
  armorersWorkshop,
  bowyersWorkshop
} from './buildings.js';

// indices
export const name = 0;
export const icon = 1;
export const max = 2;
export const prereq = 3;
export const visible = 4;
export const amount = 5;
export const change = 6;

export const wood = 0;
export const stone = 1;
export const corpses = 2;
export const mana = 3;
export const skeletons = 4;
export const planks = 5;
export const research = 6;
export const blocks = 7;
export const charcoal = 8;
export const ironOre = 9;
export const iron = 10;
export const tools = 11;
export const bows = 12;
export const weapons = 13;
export const armor = 14;
export const militia = 15;
export const archers = 16;
export const infantry = 17;
export const cavalry = 18;

let resources = [];
export default resources;

export function initResources() {
  resources.push(
    // 0
    [
      'Wood',
      '<span role="img" aria-label="Wood"></span>',
      100,
      ,
      true
    ],

    // 1
    [
      'Stone',
      '<span role="img" aria-label="Stone"></span>',
      100,
      [
        [action, digStone, actionVisible, true]
      ]
    ],

    // 2
    [
      'Corpses',
      '<span role="img" aria-label="Corpses"></span>',
      2,
      [
        [action, stealCorpse, actionVisible, true]
      ]
    ],

    // 3
    [
      'Mana',
      '<span role="img" aria-label="Mana"></span>',
      25,
      [
        [action, reanimateSkeleton, actionVisible, true]
      ],
      false,
      5
    ],

    // 4
    [
      'Skeletons',
      '<span role="img" aria-label="Skeletons"></span>',
      0,
      [
        [building, rituralCircle, built, 1]
      ]
    ],

    // 5
    [
      'Planks',
      '<span role="img" aria-label="Planks"></span>',
      25,
      [
        [building, lumberMill, built, 1]
      ]
    ],

    // 6
    [
      'Research',
      '<span role="img" aria-label="Research"></span>',
      ,  // no limit
      [
        [building, laboratory, built, 1]
      ]
    ],

    // 7
    [
      'Blocks',
      '<span role="img" aria-label="Blocks"></span>',
      25,
      [
        [building, masonsWorkshop, built, 1]
      ]
    ],

    // 8
    [
      'Charcoal',
      '<span role="img" aria-label="Charcoal"></span>',
      50,
      [
        [building, burnersCamp, built, 1]
      ]
    ],

    // 9
    [
      'Iron ore',
      '<span role="img" aria-label="Iron Ore"></span>',
      50,
      [
        [building, mine, built, 1]
      ]
    ],

    // 10
    [
      'Iron',
      '<span role="img" aria-label="Iron"></span>',
      25,
      [
        [building, furnace, built, 1]
      ]
    ],

     // 11
    [
      'Tools',
      '<span role="img" aria-label="Tools"></span>',
      20,
      [
        [building, smithy, built, 1]
      ]
    ],

    // 12
    [
      'Bows',
      '<span role="img" aria-label="Bows"></span>',
      10,
      [
        [building, bowyersWorkshop, built, 1]
      ]
    ],

    // 13
    [
      'Weapons',
      '<span role="img" aria-label="Weapons"></span>',
      10,
      [
        [building, weaponsWorkshop, built, 1]
      ]
    ],

    // 14
    [
      'Armor',
      '<span role="img" aria-label="Armor"></span>',
      10,
      [
        [building, armorersWorkshop, built, 1]
      ]
    ],

    // 15
    [
      'Militia',
      '<span role="img" aria-label="Militia"></span>',
      ,  // no limit
      [
        [action, reanimateMilitia, actionVisible, true]
      ]
    ],

    // 16
    [
      'Archers',
      '<span role="img" aria-label="Archers"></span>',
      ,  // no limit
      [
        [action, reanimateArchers, actionVisible, true]
      ]
    ],

    // 17
    [
      'Infantry',
      '<span role="img" aria-label="Infantry"></span>',
      ,  // no limit
      [
        [action, reanimateInfantry, actionVisible, true]
      ]
    ],

    // 18
    [
      'Cavalry',
      '<span role="img" aria-label="Cavalry"></span>',
      ,  // no limit
      [
        [action, reanimateCavalry, actionVisible, true]
      ]
    ]
  );
}