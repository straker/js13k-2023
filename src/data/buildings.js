import { resource, building, task } from './state.js';
import resources, {
  icon,
  amount,
  max,
  wood,
  stone,
  corpses,
  mana,
  skeletons,
  planks,
  research,
  blocks,
  charcoal,
  ironOre,
  iron,
  tools,
  weapons,
  armor,
  bows
} from './resources.js';
import {
  assignable,
  woodcutters,
  carpenters,
  researchers,
  quarriers,
  masons,
  burners,
  miners,
  smelters,
  blacksmiths,
  weaponsmiths,
  armorsmiths,
  bowyers,
  alchemists,
  snatchers,
  channeler
} from './tasks.js';
import { displayIcon } from '../utils.js';

// indices
export const name = 0;
export const description = 1;
export const cost = 2;
export const effects = 3;
export const prereq = 4;
export const researchCost = 5;
export const unlocked = 6;
export const visible = 7;
export const built = 8;
export const disabled = 9;

export const rituralCircle = 0;
export const woodcuttersCamp = 1;
export const lumberMill = 2;
export const laboratory = 3;
export const quarry = 4;
export const masonsWorkshop = 5;
export const burnersCamp = 6;
export const mine = 7;
export const furnace = 8;
export const smithy = 9;
export const bowyersWorkshop = 10;
export const weaponsWorkshop = 11;
export const armorersWorkshop = 12;
export const alchemyLab = 13;
export const outpost = 14;
export const manaPillar = 15;
export const morgue = 16;
export const warehouse = 17;
export const armory = 18;
export const necropolis = 19;

const buildings = [];
export default buildings;

export function initBuildings() {
  buildings.push(
    // 0
    [
      'Ritual Circle',
      `Allows reanimating Skeletons and increases max Skeletons by 4`,
      [
        // costs are always taken from a resource amount so we
        // can skip putting that data here
        [wood, 50],
        [stone, 25]
      ],
      [
        [resource, skeletons, max, 4]
      ],
      [
        [resource, corpses, amount, 1],
      ]
    ],

    // 1
    [
      'Woodcutters Camp',
      `Allows 3 Skeletons to gather ${displayIcon(resources[wood])}`,
      [
        [wood, 25]
      ],
      [
        [task, woodcutters, assignable, 3]
      ],
      [
        [resource, skeletons, amount, 1],
      ]
    ],

    // 2
    [
      'Lumber Mill',
      `Allows 3 Skeletons to craft ${displayIcon(resources[planks])} from ${displayIcon(resources[wood])}`,
      [
        [wood, 100],
        [stone, 10]
      ],
      [
        [task, carpenters, assignable, 3]
      ],
      [
        [building, woodcuttersCamp, built, 1]
      ]
    ],

    // 3
    [
      'Laboratory',
      `Allows 1 Skeleton to generate ${displayIcon(resources[research])}`,
      [
        [stone, 50],
        [planks, 25]
      ],
      [
        [task, researchers, assignable, 1]
      ],
      [
        [building, lumberMill, built, 1]
      ]
    ],

    // 4
    [
      'Quarry',
      `Allows 5 Skeletons to gather ${displayIcon(resources[stone])}`,
      [
        [wood, 50]
      ],
      [
        [task, quarriers, assignable, 5]
      ],
      [
        [building, laboratory, built, 1]
      ],
      25
    ],

    // 5
    [
      'Masons Workshop',
      `Allows 2 Skeletons to craft ${displayIcon(resources[blocks])} from ${displayIcon(resources[stone])}`,
      [
        [wood, 50]
      ],
      [
        [task, masons, assignable, 2]
      ],
      [
        [building, laboratory, built, 1]
      ],
      40
    ],

    // 6
    [
      'Burners Camp',
      `Allows 3 Skeletons to craft ${displayIcon(resources[charcoal])} from ${displayIcon(resources[wood])}`,
      [
        [wood, 25]
      ],
      [
        [task, burners, assignable, 3]
      ],
      [
        [building, laboratory, built, 1]
      ],
      60
    ],

    // 7
    [
      'Mine',
      `Allows 5 Skeletons to gather ${displayIcon(resources[ironOre])}`,
      [
        [stone, 25],
        [planks, 50],
      ],
      [
        [task, miners, assignable, 5]
      ],
      [
        [building, laboratory, built, 1]
      ],
      80
    ],

    // 8
    [
      'Furnace',
      `Allows 2 Skeletons to craft ${displayIcon(resources[iron])} from ${displayIcon(resources[ironOre])} and ${displayIcon(resources[charcoal])}`,
      [
        [wood, 25],
        [blocks, 75]
      ],
      [
        [task, smelters, assignable, 2]
      ],
      [
        [building, laboratory, built, 1]
      ],
      125
    ],

    // 9
    [
      'Smithy',
      `Allows 2 Skeletons to craft ${displayIcon(resources[tools])} from ${displayIcon(resources[iron])} and ${displayIcon(resources[charcoal])}`,
      [
        [planks, 100],
        [blocks, 80]
      ],
      [
        [task, blacksmiths, assignable, 2]
      ],
      [
        [building, laboratory, built, 1]
      ],
      150
    ],

    // 10
    [
      'Bowyers Workshop',
      `Allows 2 Skeletons to craft ${displayIcon(resources[bows])} from ${displayIcon(resources[wood])} and ${displayIcon(resources[planks])}`,
      [
        [planks, 200],
        [tools, 40]
      ],
      [
        [task, bowyers, assignable, 2]
      ],
      [
        [building, laboratory, built, 1]
      ],
      250
    ],

    // 11
    [
      'Weapons Workshop',
      `Allows 2 Skeletons to craft ${displayIcon(resources[weapons])} from ${displayIcon(resources[iron])} and ${displayIcon(resources[charcoal])}`,
      [
        [planks, 120],
        [iron, 50],
        [tools, 20]
      ],
      [
        [task, weaponsmiths, assignable, 2]
      ],
      [
        [building, laboratory, built, 1]
      ],
      300
    ],

    // 12
    [
      'Armorers Workshop',
      `Allows 2 Skeletons to craft ${displayIcon(resources[armor])} from ${displayIcon(resources[iron])} and ${displayIcon(resources[charcoal])}`,
      [
        [planks, 120],
        [iron, 50],
        [tools, 20]
      ],
      [
        [task, armorsmiths, assignable, 2]
      ],
      [
        [building, laboratory, built, 1]
      ],
      300
    ],

    // 13
    [
      'Alchemy Lab',
      `Allows 4 Skeletons to generate greater amounts of ${displayIcon(resources[research])}`,
      [
        [planks, 125],
        [iron, 75],
        [tools, 35]
      ],
      [
        [task, alchemists, assignable, 4]
      ],
      [
        [building, laboratory, built, 1]
      ],
      400
    ],

    // 14
    [
      'Outpost',
      `Allows 2 Skeletons to gather ${displayIcon(resources[corpses])}`,
      [
        [planks, 75],
        [blocks, 100],
      ],
      [
        [task, snatchers, assignable, 2],
      ],
      [
        [building, laboratory, built, 1]
      ],
      100
    ],

    // 15
    [
      'Mana Pillar',
      `Allows 3 Skeletons to gather ${displayIcon(resources[mana])} and increases max ${displayIcon(resources[mana])} by 25`,
      [
        [stone, 100],
        [iron, 25]
      ],
      [
        [resource, mana, max, 25],
        [task, channeler, assignable, 3],
      ],
      [
        [building, laboratory, built, 1]
      ],
      40
    ],

    // 16
    [
      'Morgue',
      `Increases max ${displayIcon(resources[corpses])} by 3`,
      [
        [wood, 150],
        [stone, 150],
      ],
      [
        [resource, corpses, max, 3],
      ],
      [
        [building, laboratory, built, 1]
      ],
      25
    ],

    // 17
    [
      'Warehouse',
      'Increases max Wood, Stone, and Iron products by 50',
      [
        [wood, 60],
        [planks, 25],
        [blocks, 25]
      ],
      [
        [resource, wood, max, 50],
        [resource, planks, max, 50],
        [resource, stone, max, 50],
        [resource, blocks, max, 50],
        [resource, charcoal, max, 50],
        [resource, ironOre, max, 50],
        [resource, iron, max, 50]
      ],
      [
        [building, laboratory, built, 1]
      ],
      30
    ],

    // 18
    [
      'Armory',
      'Increases max Tools, Weapons, and Bows by 10',
      [
        [planks, 25],
        [blocks, 75],
        [iron, 50]
      ],
      [
        [resource, tools, max, 10],
        [resource, weapons, max, 10],
        [resource, bows, max, 10]
      ],
      [
        [building, laboratory, built, 1]
      ],
      50
    ],

    // 19
    [
      'Necropolis',
      'The ultimate Necromancer structure. Build to reign supreme and win the game',
      [
        [planks, 1000],
        [stone, 1500],
        [iron, 500]
      ],
      [
        ['win-game']
      ],
      [
        [building, laboratory, built, 1]
      ],
      2000
    ]
  );
}