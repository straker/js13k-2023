import { resource, action, building } from './state.js';
import {
  visible as actionVisible,
  digStone,
  stealCorpse
} from './actions.js';

// indices
export const name = 0;
export const icon = 1;
export const max = 2;
export const prereq = 3;
export const amount = 4;
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
    [
      'Wood',
      '🪵',
      200
    ],

    // 1
    [
      'Stone',
      '🪨',
      200,
      [
        [action, digStone, actionVisible, true]
      ]
    ],

    // 2
    [
      'Skeletons',
      '💀',
      0,
      [
        [action, stealCorpse, actionVisible, true]
      ]
    ],

    // 3
    [
      'Wood Planks',
      '',
      200,
      []
    ],

    // 4
    [
      'Stone Bricks',
      '🧱',
      200,
      []
    ],

    // 5
    [
      'Coal',
      '',
      200,
      []
    ],

    // 6
    [
      'Iron ore',
      '',
      200,
      []
    ],

    // 7
    [
      'Iron',
      '',
      200,
      []
    ],

    // 8
    [
      'Steel',
      '',
      200,
      []
    ],

    // 9
    [
      'Wood Beam',
      '',
      200,
      []
    ],

    // 10
    [
      'Tools',
      '🔨',
      100,
      []
    ],

    // 11
    [
      'Research',
      '📜',
      Infinity,
      []
    ],

    // 12
    [
      'Swords',
      '⚔️',
      50,
      []
    ],

    // 13
    [
      'Bows',
      '🏹',
      50,
      []
    ],

    // 14
    [
      'Magic Crystal',
      '💎',
      25,
      []
    ]
  );
}