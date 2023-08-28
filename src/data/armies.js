import { resource } from './state.js';
import {
  amount,
  skeletons,
  swords,
  bows,
  armor
} from './resources.js';

// indices
export const name = 0;
export const description = 1;
export const cost = 2;
export const health = 3;
export const defense = 4;
export const attack = 5;
export const advantage = 6;
export const prereq = 7;
export const trained = 8;
export const visible = 9;

export const militia = 0;
export const infantry = 1;
export const archers = 2;
export const calvary = 3;

const armies = [];
export default armies;

export function initArmies() {
  armies.push.call(armies,
    // 0
    [
      'Militia',
      'Unarmed and unarmored Skeletons. Weak vs everything.',
      [
        [resource, skeletons, amount, -1]
      ],
      40,
      0,
      5,
      []
    ],

    // 1
    [
      'Infantry',
      'Armed and armored Skeletons. Good vs Calvary.',
      [
        [resource, skeletons, amount, -1],
        [resource, swords, amount, -1],
        [resource, armor, amount, -1]
      ],
      100,
      25,
      15,
      calvary
    ],

    // 2
    [
      'Archers',
      'Skeletons with Bows. Good vs Infantry.',
      [
        [resource, skeletons, amount, -1],
        [resource, bows, amount, -1],
        [resource, armor, amount, -1]
      ],
      75,
      14,
      9,
      infantry
    ],

    // 3
    [
      'Calvary',
      'Skeletons on horses. Good vs Archers.',
      [
        [resource, skeletons, amount, -1],
        [resource, swords, amount, -1],
        [resource, armor, amount, -1],
        // [resource, horses, amount, -1],
      ],
      150,
      40,
      25,
      archers
    ]
  )
}