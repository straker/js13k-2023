import state, { resource, action } from '../data/state.js';
import {
  name,
  effect,
  prereq,
  assigned,
  assignable,
  visible,
  idle
} from '../data/actions.js';
import { amount, max, skeleton } from '../data/resources.js';
import { on } from '../events.js';
import { html, showWhenPrereqMet } from '../utils.js';

/**
 * Display an automated action performed by skeletons.
 *
 * @param {*[]} data - Action data.
 * @param {Number} index - The current item of the data.
 */
export default function displayAutoAction(data, index) {
  const actionName = html(`<div hidden>${data[name]}</div>`);

  // `autoActG` is a global HTML id from index.html
  autoActG.appendChild(actionName);

  const input = html(`<input type="number" min="0" max="0" value="0">`);
  input.hidden = data[prereq];
  showWhenPrereqMet(data, prereq, input, action, index, visible);

  // bind hidden state to the action name
  on([action, index, visible], (value) => {
    actionName.hidden = !value;
  });

  // prevent user from typing into the input
  input.addEventListener('keydown', (e) => e.preventDefault());

  // special auto action that user cannot change
  if (index === idle) {
    input.setAttribute('readonly', true);
    input.setAttribute('type', 'text');

    // bind skeleton resource to idle skeleton value
    on([resource, skeleton, amount], (value, diff) => {
      state.set([action, index, assigned, diff])
    });

    // bind the assigned idle value to the input value
    on([action, index, assigned], (value) => {
      input.value = value;
    });
  }
  else {
    // bind the max assignable value to the max attribute
    on([action, idle, assigned], (value) => {
      input.setAttribute('max', Math.min(
        // total assignable includes both idle and already
        // assigned skeletons
        value + (data[assigned] ?? 0),
        (data[assignable] ?? 0)
      ));
    });
    on([action, index, assignable], (value) => {
      input.setAttribute('max', Math.min(
        state.get([action, idle, assigned], 0) + (data[assigned] ?? 0),
        value
      ));
    });

    // add or subtract assigned skeletons
    input.addEventListener('change', (e) => {
      const numAssigned = data[assigned] ?? 0;
      const value = +input.value;
      const diff = value - numAssigned;

      state.set([action, index, assigned, diff])
      state.set([action, idle, assigned, -diff])
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
        // auto actions gain resources per assigned skeleton
        [...path, value * data[assigned]],
        state.get([resource, resourceIndex, max])
      );
    });
  }

  // `autoInpG` is a global HTML id from index.html
  autoInpG.appendChild(input);
}