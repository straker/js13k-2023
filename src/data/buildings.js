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
  woodcutters,
  carpenters,
  researchers,
  quarriers,
  assignable,
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
export const masonWorkshop = 5;
export const burnersCamp = 6;
export const mine = 7;
export const furnace = 8;
export const smithy = 9;
export const bowWorkshop = 10;

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
      `Allows up to 3 Skeletons to gather Wood`,
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
      'Allows up to 3 Skeletons to cut Wood into Planks',
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
      'Allows a single Skeleton to generate Research',
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
      'Allows up to 5 Skeletons to gather Stone',
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
      'Mason Workshop',
      'Allows up to 5 Skeletons to gather Stone',
      [
        [wood, 50],
        [research, 50]
      ],
      [task, quarriers, assignable, 5],
      [
        [building, laboratory, built, 1]
      ]
    ],

    // 6
    [
      'Burners Camp',
      'Allows up to 5 Skeletons to gather Stone',
      [
        [wood, 50],
        [research, 50]
      ],
      [task, quarriers, assignable, 5],
      [
        [building, laboratory, built, 1]
      ]
    ],

    // 7
    [
      'Mine',
      'Allows up to 5 Skeletons to gather Stone',
      [
        [wood, 50],
        [research, 50]
      ],
      [task, quarriers, assignable, 5],
      [
        [building, laboratory, built, 1]
      ]
    ],

    // 8
    [
      'Furnace',
      'Allows up to 5 Skeletons to gather Stone',
      [
        [wood, 50],
        [research, 50]
      ],
      [task, quarriers, assignable, 5],
      [
        [building, laboratory, built, 1]
      ]
    ],

    // 9
    [
      'Smithy',
      'Allows up to 5 Skeletons to gather Stone',
      [
        [wood, 50],
        [research, 50]
      ],
      [task, quarriers, assignable, 5],
      [
        [building, laboratory, built, 1]
      ]
    ],

    // 10
    [
      'Bow Workshop',
      'Allows up to 5 Skeletons to gather Stone',
      [
        [wood, 50],
        [research, 50]
      ],
      [task, quarriers, assignable, 5],
      [
        [building, laboratory, built, 1]
      ]
    ]
  );
}