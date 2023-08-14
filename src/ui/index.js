import { on } from '../libs/kontra.js';

import actions from '../data/actions.js';
import resources from '../data/resources.js';
import state from '../state.js';

resources.map((resource, index) => {
  const display = document.createElement('div');
  display.textContent = resource[0] + ': ' + 0;
  on(`0,${index},3`, value => {
    display.textContent = resource[0] + ': ' + value;
  });
  // if resource has prereqs then we don't show initially
  display.hidden = resource[2];

  document.body.appendChild(display);
});

actions.map((action,index) => {
  const button = document.createElement('button');
  button.textContent = action[0];
  button.addEventListener('click', () => {
    const clickCount = (action[5] ?? 0) + 1;
    state.set([2,index,5,clickCount]);
    state.set(action[2]);
  });
  // if action has prereqs then we don't show initially
  button.hidden = action[3];

  // display if prereq is met
  const prereqs = (action[3] ?? [])
  prereqs.map(prereq => {
    const p = [...prereq];  // clone
    const value = p.pop();
    on(p, (curValue) => {
      if (curValue >= value) {
        button.hidden = false;
      }
    });
  });

  document.body.appendChild(button);
});

// actions.map(action => {
//   const button = document.createElement('button');
//   button.textContent = action[0];
//   button.addEventListener('click', () => {
//     // action[5] = (action[5] ?? 0) + 1;
//     state.set(action[2]);
//   });
//   // if action has prereqs then we don't show initially
//   button.hidden = action[3]

//   // display if prereq is met
//   const prereqs = (action[3] ?? [])
//   prereqs.map(prereq => {
//     const p = [...prereq];  // clone
//     const value = p.pop();
//     on(p, (curValue) => {
//       if (curValue >= value) {
//         button.hidden = false;
//       }
//     });
//   });

//   document.body.appendChild(button);
// });