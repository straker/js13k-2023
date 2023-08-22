import { resource, building, task } from './state.js';
import resources, {
  amount,
  max,
  wood,
  stone,
  skeletons,
  planks,
  research
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
  bowyers,
  soldiers,
  archers
} from './tasks.js';

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
export const lumberMill = 2;
export const laboratory = 3;
export const quarry = 4;
export const masonsWorkshop = 5;
export const burnersCamp = 6;
export const mine = 7;
export const furnace = 8;
export const smithy = 9;
export const weaponsWorkshop = 10;
export const bowyersWorkshop = 11;
export const barrack = 12;
export const archeryRange = 13;

const buildings = [];
export default buildings;

export function initBuildings() {
  buildings.push.call(buildings,
    // 0
    [
      'Ritual Circle',
      `Increases max Skeletons by 4`,
      [
        // costs are always taken from a resource amount so we
        // can skip putting that data here
        [wood, 50],
        [stone, 25]
      ],
      [resource, skeletons, max, 4],
      [
        [resource, wood, amount, 50],
        [resource, stone, amount, 25]
      ]
    ],

    // 1
    [
      'Woodcutters Camp',
      `Allows 3 Skeletons to gather Wood`,
      [
        [wood, 50]
      ],
      [task, woodcutters, assignable, 3],
      [
        [building, rituralCircle, built, 1]
      ]
    ],

    // 2
    [
      'Lumber Mill',
      'Allows 3 Skeletons to craft Planks from Wood',
      [
        [wood, 100],
        [stone, 10]
      ],
      [task, carpenters, assignable, 3],
      [
        [building, woodcuttersCamp, built, 1]
      ]
    ],

    // 3
    [
      'Laboratory',
      'Allows 1 Skeleton to generate Research',
      [
        [stone, 50],
        [planks, 25]
      ],
      [task, researchers, assignable, 1],
      [
        [building, lumberMill, built, 1]
      ]
    ],

    // 4
    [
      'Quarry',
      'Allows 5 Skeletons to gather Stone',
      [
        [wood, 50],
        [research, 50]
      ],
      [task, quarriers, assignable, 5],
      [
        [building, laboratory, built, 1]
      ]
    ],

    // 5
    [
      'Masons Workshop',
      'Allows 2 Skeletons to craft Blocks from Stone',
      [
        [wood, 50],
        [research, 50]
      ],
      [task, masons, assignable, 2],
      [
        [building, laboratory, built, 1]
      ]
    ],

    // 6
    [
      'Burners Camp',
      'Allows 3 Skeletons to craft Coal from Wood',
      [
        [wood, 50],
        [research, 50]
      ],
      [task, burners, assignable, 3],
      [
        [building, laboratory, built, 1]
      ]
    ],

    // 7
    [
      'Mine',
      'Allows 5 Skeletons to gather Iron Ore',
      [
        [wood, 50],
        [research, 50]
      ],
      [task, miners, assignable, 5],
      [
        [building, laboratory, built, 1]
      ]
    ],

    // 8
    [
      'Furnace',
      'Allows 2 Skeletons to craft Iron from Iron Ore and Charcoal',
      [
        [wood, 50],
        [research, 50]
      ],
      [task, smelters, assignable, 2],
      [
        [building, laboratory, built, 1]
      ]
    ],

    // 9
    [
      'Smithy',
      'Allows 2 Skeletons to craft Tools from Iron Ore and Charcoal',
      [
        [wood, 50],
        [research, 50]
      ],
      [task, blacksmiths, assignable, 2],
      [
        [building, laboratory, built, 1]
      ]
    ],

    // 10
    [
      'Weapons Workshop',
      'Allows 2 Skeleton to craft Swords from Iron Ore and Charcoal',
      [
        [wood, 50],
        [research, 50]
      ],
      [task, weaponsmiths, assignable, 2],
      [
        [building, laboratory, built, 1]
      ]
    ],

    // 11
    [
      'Bowyers Workshop',
      'Allows 2 Skeleton to craft Bows from Wood and Planks',
      [
        [wood, 50],
        [research, 50]
      ],
      [task, bowyers, assignable, 2],
      [
        [building, laboratory, built, 1]
      ]
    ],

    // 12
    [
      'Barrack',
      'Allows 8 Skeletons to become Soldiers',
      [
        [wood, 50],
        [research, 50]
      ],
      [task, soldiers, assignable, 8],
      [
        [building, laboratory, built, 1]
      ]
    ],

    // 13
    [
      'Archery Range',
      'Allows 8 Skeletons to become Archers',
      [
        [wood, 50],
        [research, 50]
      ],
      [task, archers, assignable, 8],
      [
        [building, laboratory, built, 1]
      ]
    ]
  );
}