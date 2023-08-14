import {
  SHORT_COOLDOWN,
  MEDIUM_COOLDOWN,
  LONG_COOLDOWN
} from '../constants.js';

/*
  0 - name
  1 - cooldown
  2 - action
  3 - prereqs (list of requirements that need to be met in order for the action to show up)
  4 - hidden (0 = false, 1 = true)
  5 - clicked (number times the button has been clicked)
  6 - disabled (0 = false, 1 = true)
*/
const actions = [
  // 0
  [
    'Chop Wood',
    SHORT_COOLDOWN,
    // add 15 to wood resource
    [0,0,3,15]
  ],

  // 1
  [
    'Dig Stone',
    MEDIUM_COOLDOWN,
    // add 10 to stone resource
    [0,1,3,10],
    [
      // require clicking chop wood twice
      [2,0,5,2]
    ]
  ],

  // 2
  [
    'Steal Corpse',
    LONG_COOLDOWN,
    [0,2,3,1],
    [
      // require a Ritual Circle
      [1,0,4,1]
    ]
  ]
];
export default actions;