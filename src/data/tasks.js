import { building } from './state.js';
import {
  wood,
  stone,
  skeletons,
  planks,
  research,
  blocks,
  charcoal,
  ironOre,
  iron,
  tools,
  swords,
  bows
} from './resources.js';
import {
  built,
  rituralCircle,
  woodcuttersCamp,
  lumberMill,
  laboratory,
  quarry,
  masonWorkshop,
  burnersCamp,
  mine,
  furnace,
  smithy,
  bowWorkshop
} from './buildings.js';

// indices
export const name = 0;
export const effects = 1;
export const prereq = 2;
export const assignable = 3;
export const assigned = 4;
export const visible = 5;

export const idle = 0;
export const woodcutters = 1;
export const carpenters = 2;
export const researchers = 3;
export const quarriers = 4;
export const masons = 5;
export const charcoalBurners = 6;
export const miners = 7;
export const smelters = 8;
export const toolmakers = 9;
export const blacksmiths = 10;
export const bowyers = 11;

const tasks = [];
export default tasks;

export function initTasks() {
  tasks.push.call(tasks,
    // 0
    [
      'Idle',
      [],
      [
        [building, rituralCircle, built, 1]
      ]
    ],

    // 1
    [
      'Woodcutters',
      [
        // tasks always take from a resource amount so we
        // can skip putting that data here
        [wood, 1]
      ],
      [
        [building, woodcuttersCamp, built, 1]
      ]
    ],

    // 2
    [
      'Carpenters',
      [
        [wood, -1],
        [planks, 1]
      ],
      [
        [building, lumberMill, built, 1]
      ]
    ],

    // 3
    [
      'Researchers',
      [
        [research, 1]
      ],
      [
        [building, laboratory, built, 1]
      ]
    ],

    // 4
    [
      'Quarriers',
      [
        [stone, 1]
      ],
      [
        [building, quarry, built, 1]
      ]
    ],

    // 5
    [
      'Masons',
      [
        [blocks, 1]
      ],
      [
        [building, masonWorkshop, built, 1]
      ]
    ],

    // 6
    [
      'Burners',
      [
        [charcoal, 1]
      ],
      [
        [building, burnersCamp, built, 1]
      ]
    ],

    // 7
    [
      'Miners',
      [
        [ironOre, 1]
      ],
      [
        [building, mine, built, 1]
      ]
    ],

    // 8
    [
      'Smelters',
      [
        [iron, 1]
      ],
      [
        [building, furnace, built, 1]
      ]
    ],

    // 9
    [
      'Toolmakers',
      [
        [tools, 1]
      ],
      [
        [building, smithy, built, 1]
      ]
    ],

    // 10
    [
      'Blacksmiths',
      [
        [swords, 1]
      ],
      [
        [building, smithy, built, 1]
      ]
    ],

    // 11
    [
      'Bowyers',
      [
        [bows, 1]
      ],
      [
        [building, bowWorkshop, built, 1]
      ]
    ]
  );
}