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
  snatchers
} from './tasks.js';

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
export const weaponsWorkshop = 10;
export const armorersWorkshop = 11;
export const bowyersWorkshop = 12;
export const alchemyLab = 13;
export const outpost = 14;
export const morgue = 15;
export const manaPillar = 16;
export const warehouse = 17;
export const armory = 18;
export const necropolis = 19;

const buildings = [];
export default buildings;

export function initBuildings() {
  buildings.push.call(buildings,
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
      `Allows 3 Skeletons to gather <span>${resources[wood][icon]}</span>`,
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
      `Allows 3 Skeletons to craft <span>${resources[planks][icon]}</span> from <span>${resources[wood][icon]}</span>`,
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
      `Allows 1 Skeleton to generate <span>${resources[research][icon]}</span>`,
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
      `Allows 5 Skeletons to gather <span>${resources[stone][icon]}</span>`,
      [
        [wood, 50]
      ],
      [
        [task, quarriers, assignable, 5]
      ],
      [
        [building, laboratory, built, 1]
      ],
      60
    ],

    // 5
    [
      'Masons Workshop',
      `Allows 2 Skeletons to craft <span>${resources[blocks][icon]}</span> from <span>${resources[stone][icon]}</span>`,
      [
        [wood, 50]
      ],
      [
        [task, masons, assignable, 2]
      ],
      [
        [building, laboratory, built, 1]
      ],
      100
    ],

    // 6
    [
      'Burners Camp',
      `Allows 3 Skeletons to craft <span>${resources[charcoal][icon]}</span> from <span>${resources[wood][icon]}</span>`,
      [
        [wood, 25]
      ],
      [
        [task, burners, assignable, 3]
      ],
      [
        [building, laboratory, built, 1]
      ],
      150
    ],

    // 7
    [
      'Mine',
      `Allows 5 Skeletons to gather <span>${resources[ironOre][icon]}</span>`,
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
      200
    ],

    // 8
    [
      'Furnace',
      `Allows 2 Skeletons to craft <span>${resources[iron][icon]}</span> from <span>${resources[ironOre][icon]}</span> and <span>${resources[charcoal][icon]}</span>`,
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
      300
    ],

    // 9
    [
      'Smithy',
      `Allows 2 Skeletons to craft <span>${resources[tools][icon]}</span> from <span>${resources[iron][icon]}</span> and <span>${resources[charcoal][icon]}</span>`,
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
      450
    ],

    // 10
    [
      'Weapons Workshop',
      `Allows 2 Skeletons to craft <span>${resources[weapons][icon]}</span> from <span>${resources[iron][icon]}</span> and <span>${resources[charcoal][icon]}</span>`,
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
      600
    ],

    // 11
    [
      'Armorers Workshop',
      `Allows 2 Skeletons to craft <span>${resources[armor][icon]}</span> from <span>${resources[iron][icon]}</span> and <span>${resources[charcoal][icon]}</span>`,
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
      600
    ],

    // 12
    [
      'Bowyers Workshop',
      `Allows 2 Skeletons to craft <span>${resources[bows][icon]}</span> from <span>${resources[wood][icon]}</span> and <span>${resources[planks][icon]}</span>`,
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
      800
    ],

    // 13
    [
      'Alchemy Lab',
      `Allows 4 Skeletons to generate greater amounts of <span>${resources[research][icon]}</span>`,
      [
        [planks, 80],
        [iron, 30],
        [tools, 10]
      ],
      [
        [task, alchemists, assignable, 4]
      ],
      [
        [building, laboratory, built, 1]
      ],
      1000
    ],

    // 14
    [
      'Outpost',
      `Allows 2 Skeletons to gather <span>${resources[corpses][icon]}</span>`,
      [
        [wood, 50]
      ],
      [
        [task, snatchers, assignable, 2],
      ],
      [
        [building, laboratory, built, 1]
      ],
      250
    ],

    // 15
    [
      'Morgue',
      `Increases max <span>${resources[corpses][icon]}</span> by 3`,
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
      60
    ],

    // 16
    [
      'Mana Pillar',
      `Increases max <span>${resources[mana][icon]}</span> by 10`,
      [
        [stone, 100],
        [iron, 25]
      ],
      [
        [resource, mana, max, 10],
      ],
      [
        [building, laboratory, built, 1]
      ],
      100
    ],

    // 17
    [
      'Warehouse',
      'Increases max Wood, Stone, and Iron products by 25',
      [
        [wood, 60],
        [planks, 25],
        [blocks, 25]
      ],
      [
        [resource, wood, max, 25],
        [resource, planks, max, 25],
        [resource, stone, max, 25],
        [resource, blocks, max, 25],
        [resource, charcoal, max, 25],
        [resource, ironOre, max, 25],
        [resource, iron, max, 25]
      ],
      [
        [building, laboratory, built, 1]
      ],
      80
    ],

    // 18
    [
      'Armory',
      'Increases max Tools, Weapons, and Bows by 10',
      [
        [wood, 50]
      ],
      [
        [resource, tools, max, 10],
        [resource, weapons, max, 10],
        [resource, bows, max, 10]
      ],
      [
        [building, laboratory, built, 1]
      ],
      120
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
      5000
    ]
  );
}