import { resource, action, building } from './state.js';
import {
  visible as actionVisible,
  digStone,
  stealCorpse
} from './actions.js';

// indices
export const name = 0;
export const prereq = 1;
export const icon = 2;
export const amount = 3;
export const max = 4;
export const visible = 5;

export const wood = 0;
export const stone = 1;
export const skeleton = 2;
export const woodPlanks = 3;
export const stoneBricks = 4;
export const coal = 5;
export const ironOre = 6;
export const iron = 7;
export const steel = 8;
export const woodBeams = 9;
export const tools = 10;
export const research = 11;
export const swords = 12;
export const bows = 13;
export const magicCrystal = 14;

let resources = [];
export default resources;

export function initResources() {
  resources.push.call(resources,
    // 0
    ['Wood'],

    // 1
    [
      'Stone',
      [
        [action, digStone, actionVisible, true]
      ]
    ],

    // 2
    [
      'Skeletons',
      [
        [action, stealCorpse, actionVisible, true]
      ]
    ],

    // 3
    [
      'Wood Planks',
      []
    ],

    // 4
    [
      'Stone Bricks',
      []
    ],

    // 5
    [
      'Coal',
      []
    ],

    // 6
    [
      'Iron ore',
      []
    ],

    // 7
    [
      'Iron',
      []
    ],

    // 8
    [
      'Steel',
      []
    ],

    // 9
    [
      'Wood Beam',
      []
    ],

    // 10
    [
      'Tools',
      []
    ],

    // 11
    [
      'Research',
      []
    ],

    // 12
    [
      'Swords',
      []
    ],

    // 13
    [
      'Bows',
      []
    ],

    // 14
    [
      'Magic Crystal',
      []
    ]
  );
}