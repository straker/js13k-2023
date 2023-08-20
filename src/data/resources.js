import { resource, action, building } from './state.js';
import {
  visible as actionVisible,
  digStone,
  stealCorpse
} from './actions.js';
import {
  built,
  lumberMill,
  laboratory
} from './buildings.js';

// indices
export const name = 0;
export const icon = 1;
export const max = 2;
export const prereq = 3;
export const amount = 4;
export const visible = 5;

export const wood = 0;
export const stone = 1;
export const skeletons = 2;
export const planks = 3;
export const research = 4;

// export const bricks = 4;
// export const coal = 5;
// export const ironOre = 6;
// export const iron = 7;
// export const steel = 8;
// export const beams = 9;
// export const tools = 10;
// export const swords = 12;
// export const bows = 13;
// export const magicCrystal = 14;

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
      'skeletons',
      '💀',
      0,
      [
        [action, stealCorpse, actionVisible, true]
      ]
    ],

    // 3
    [
      'Planks',
      '<img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAUCAMAAAC6V+0/AAAA1VBMVEUAAABfRC9mSTN6WD53VjxvUThMNyZnSzVGMyN4VjxhRjFQOiddQy5NNyZNNyVQOShpTDVINSRZQCxGMyNkSTRbQS11VDpqTjZxUjiBXUFUPClUPClZQCxsTzZfRDBMNyVzUzloTDZxUjl5Vz6DX0FYPytwUThGMyNlSTRKNiV1VDpqTjZ7WT55Vz6LZUZxUjhmSjVdQy92VTuDYENhRzJfRDFbQS1pTTZnSzVXPipjSDNdQy9ZQCxlSTRSOihzUzlwUThrTzZOOCZVPCluUDdMNiVINSQdqybDAAAANHRSTlMABhgQ/vvz4NfWv6x9Y0o0KyIL+vn59vLo5ubl187GwLesqZ6WlpKQhXh0aGRZUE1COTYjpoa/KQAAAMhJREFUGNNdkFcWgjAQRVHsghR7770rPZEu+1+SCXgYdP5yz7vJmzCZydVqnJBjfmenqBoe1Hkpw24tBWmm7UcVYPmypSJs2u9mA+D8RWwz8KMtsKNOIQlW5JSJXcNSEA78kpAyeawbFg36e5A3HrERuXEKPa/Fb7AkQZteSIK0Dw/rzVyPBnFQB/nguEmfYT5ljw4NEhvDKmzVCfXYXkObpeN6sT1iU3YuEGiQt9t3CPYLiY04Boa9rKpFQ1En/1/+PC3KYub8AcxzI3LKXt/zAAAAAElFTkSuQmCC"/>',
      200,
      [
        [building, lumberMill, built, 1]
      ]
    ],

    // 4
    [
      'Research',
      '📜',
      Infinity,
      [
        [building, laboratory, built, 1]
      ]
    ],

    // // 4
    // [
    //   'Stone Bricks',
    //   '🧱',
    //   200,
    //   []
    // ],

    // 5
    // [
    //   'Coal',
    //   '',
    //   200,
    //   []
    // ],

    // // 6
    // [
    //   'Iron ore',
    //   '',
    //   200,
    //   []
    // ],

    // // 7
    // [
    //   'Iron',
    //   '',
    //   200,
    //   []
    // ],

    // // 8
    // [
    //   'Steel',
    //   '',
    //   200,
    //   []
    // ],

    // // 9
    // [
    //   'Beams',
    //   '',
    //   200,
    //   []
    // ],

    // // 10
    // [
    //   'Tools',
    //   '🔨',
    //   100,
    //   []
    // ],

    // // 11
    // [
    //   'Research',
    //   '📜',
    //   Infinity,
    //   []
    // ],

    // // 12
    // [
    //   'Swords',
    //   '⚔️',
    //   50,
    //   []
    // ],

    // // 13
    // [
    //   'Bows',
    //   '🏹',
    //   50,
    //   []
    // ],

    // // 14
    // [
    //   'Magic Crystal',
    //   '💎',
    //   25,
    //   []
    // ]
  );
}