import state, { resource, task } from '../data/state.js';
import {
  name,
  effects,
  prereq,
  assigned,
  assignable,
  visible,
  idle
} from '../data/tasks.js';
import resources, { amount, max, skeletons } from '../data/resources.js';
import { on } from '../events.js';
import { RESOURCE_TICK } from '../constants.js';
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

  const div = html(`
    <div>
      <input type="number" min="0" max="0" value="0">
      <div class="max"></div>
    </div>
  `);
  const input = div.querySelector('input');
  const maxDiv = div.querySelector('.max');
  div.hidden = data[prereq];
  showWhenPrereqMet(data, prereq, div, task, index, visible);
  generateTitle(data, 0, taskName, div);

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

  // bind assignable to max
  on([task, index, assignable], (value) => {
    maxDiv.textContent = '/ ' + value;
  });

  // prevent user from typing into the input
  input.addEventListener('keydown', (e) => e.preventDefault());

  // special auto task that user cannot change
  if (index === idle) {
    input.setAttribute('readonly', true);
    input.setAttribute('type', 'text');

    // bind skeletons resource to idle skeletons value
    on([resource, skeletons, amount], (value, diff) => {
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

    // bind assigned value to the title
    on([task, index, assigned], (value) => {
      generateTitle(data, value, taskName, div);
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
    on(['resource-tick'], () => {
      if (!data[assigned]) {
        return;
      }

      // ensure player has all the costs before fulfilling task
      const costs = data[effects].filter(([, value]) => value < 0);
      // if player can only afford to make less than the
      // assigned number of skeletons then make only as much
      // as they can afford
      let canAfford = data[assigned];
      if (!costs.every(([resourceIndex, value]) => {
        // tasks use resources per assigned skeleton
        const perValue = -value * data[assigned];
        canAfford = Math.min(
          perValue + (state.get([resource, resourceIndex, amount]) - perValue),
          perValue,
          canAfford
        ) / -value;

        return canAfford > 0;
      })) {
        return;
      }

      data[effects].map(([resourceIndex, value]) => {
        const resourceMax = state.get([resource, resourceIndex, max]);

        // don't set resource if at max already
        if (
          value > 0 &&
          state.get([resource, resourceIndex, amount]) >= resourceMax
        ) {
          return;
        }

        state.set(
          [resource, resourceIndex, amount, value * canAfford],
          resourceMax
        );
      });
    });
  }

  // `tskInpG` is a global HTML id from index.html
  tskInpG.appendChild(div);
}

function generateTitle(data, value, taskName, div) {
  const title = data[effects].map(([resourceIndex, resourceValue]) => {
    const padName = resources[resourceIndex][name].padEnd(15, ' ');
    return `${padName}${resourceValue > 0 ? '+' : ''}${value * resourceValue} per ${RESOURCE_TICK / 60}s`;
  }).join('\n');

  taskName.setAttribute('title', title);
  div.setAttribute('title', title);
}