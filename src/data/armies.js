// indices
export const name = 0;
export const description = 1;
export const health = 2;
export const defense = 3;
export const attack = 4;
export const advantage = 5;
export const prereq = 6;
export const trained = 7;
export const visible = 8;

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
      40,
      0,
      5
    ],

    // 1
    [
      'Infantry',
      'Armed and armored Skeletons. Good vs Calvary.',
      100,
      25,
      15,
      calvary
    ],

    // 2
    [
      'Archers',
      'Skeletons with Bows. Good vs Infantry.',
      75,
      14,
      9,
      infantry
    ],

    // 3
    [
      'Calvary',
      'Skeletons on horses. Good vs Archers.',
      150,
      40,
      25,
      archers
    ]
  )
}