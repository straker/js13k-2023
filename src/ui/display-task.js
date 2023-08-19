import state, { resource, task } from '../data/state.js';
import {
  name,
  effect,
  prereq,
  assigned,
  assignable,
  visible,
  idle
} from '../data/tasks.js';
import { amount, max, skeleton } from '../data/resources.js';
import { on } from '../events.js';
import { html, showWhenPrereqMet } from '../utils.js';

/**
 * Display an automated task performed by skeletons.
 *
 * @param {*[]} data - task data.
 * @param {Number} index - The current item of the data.
 */
export default function displayTask(data, index) {
  const taskName = html(`<div hidden>${data[name]}</div>`);

  // `tskG` is a global HTML id from index.html
  tskG.appendChild(taskName);

  const input = html(`<input type="number" min="0" max="0" value="0">`);
  input.hidden = data[prereq];
  showWhenPrereqMet(data, prereq, input, task, index, visible);

  // show tasks heading when first task is shown
  if (index === 0) {
    on([task, 0, visible], (value) => {
      // `tskT` is a global HTML id from index.html
      tskT.hidden = !value;
    });
  }

  // bind hidden state to the task name
  on([task, index, visible], (value) => {
    taskName.hidden = !value;
  });

  // prevent user from typing into the input
  input.addEventListener('keydown', (e) => e.preventDefault());

  // special auto task that user cannot change
  if (index === idle) {
    input.setAttribute('readonly', true);
    input.setAttribute('type', 'text');

    // bind skeleton resource to idle skeleton value
    on([resource, skeleton, amount], (value, diff) => {
      state.set([task, index, assigned, diff])
    });

    // bind the assigned idle value to the input value
    on([task, index, assigned], (value) => {
      input.value = value;
    });
  }
  else {
    // bind the max assignable value to the max attribute
    on([task, idle, assigned], (value) => {
      input.setAttribute('max', Math.min(
        // total assignable includes both idle and already
        // assigned skeletons
        value + (data[assigned] ?? 0),
        (data[assignable] ?? 0)
      ));
    });
    on([task, index, assignable], (value) => {
      input.setAttribute('max', Math.min(
        state.get([task, idle, assigned], 0) + (data[assigned] ?? 0),
        value
      ));
    });

    // add or subtract assigned skeletons
    input.addEventListener('change', (e) => {
      const numAssigned = data[assigned] ?? 0;
      const value = +input.value;
      const diff = value - numAssigned;

      state.set([task, index, assigned, diff])
      state.set([task, idle, assigned, -diff])
    });

    // increase resources every tick
    const path = [...data[effect]];  // clone
    const resourceIndex = path[1];
    const value = path.pop();
    on(['resource-tick'], () => {
      if (
        !data[assigned] ||
        state.get([resource, resourceIndex, amount]) >= state.get([resource, resourceIndex, max])
      ) {
        return;
      }

      state.set(
        // auto tasks gain resources per assigned skeleton
        [...path, value * data[assigned]],
        state.get([resource, resourceIndex, max])
      );
    });
  }

  // `tskInpG` is a global HTML id from index.html
  tskInpG.appendChild(input);
}