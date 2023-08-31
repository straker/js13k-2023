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
import resources, { icon, amount, max, change, skeletons } from '../data/resources.js';
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
  const taskName = html(`
    <div class="tipC" ${!data[visible] ? 'hidden' : ''}>
      ${data[name]}
      ${index !== idle ? `<span class="tip">${getTip(data, data[assigned] ?? 0)}</span>` : ``}
    </div>
  `);

  // `tskG` is a global HTML id from index.html
  tskG.appendChild(taskName);

  const div = html(`
    <div class="tipC">
      <input type="number" min="0" max="0" value="${data[assigned] ?? 0}">
      <div class="max"></div>
      ${index !== idle ? `<span class="tip">${getTip(data, data[assigned] ?? 0)}</span>` : ``}
    </div>
  `);
  const input = div.querySelector('input');
  const maxDiv = div.querySelector('.max');
  div.hidden = !data[visible];
  showWhenPrereqMet(data, prereq, div, task, index, visible);

  // show tasks heading when first task is shown
  if (index === 0) {
    // tskP`, `tskT`, and `tskInpT` are global HTML ids from index.html
    tskP.hidden = tskT.hidden = tskInpT.hidden = !data[visible]

    on([task, 0, visible], (value) => {
      tskP.hidden = tskT.hidden = tskInpT.hidden = !value;
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
    setMaxAssignable(data, input);
    on([task, idle, assigned], () => {
      setMaxAssignable(data, input);
    });
    on([task, index, assignable], (value) => {
      setMaxAssignable(data, input);
    });

    // bind assignable to max
    maxDiv.textContent = '/ ' + data[assignable];
    on([task, index, assignable], (value) => {
      maxDiv.textContent = '/ ' + value;
    });

    // bind assigned value to the title
    on([task, index, assigned], (value, diff) => {
      if (index !== idle) {
        const tip = getTip(data, value);
        taskName.querySelector('.tip').innerHTML = tip;
        div.querySelector('.tip').innerHTML = tip;
      }

      // keep track of the change in resource state to display
      // either a positive or negative change in the resource
      data[effects].map(([resourceIndex, resourceValue]) => {
        state.set([resource, resourceIndex, change, diff * resourceValue]);
      });
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

      // TODO: figure out way to have a total change from all tasks so if a user
      // is at 300/300 wood, has 10 cutters and 10 carpenters, the end result is
      // 300/300 wood and +10 planks (instead of 290/300 wood)

      // ensure player has all the costs before fulfilling task
      const costs = data[effects].filter(([, value]) => value < 0);
      const gains = data[effects].filter(([, value]) => value > 0);
      // if player can only afford to make less than the
      // assigned number of skeletons then make only as much
      // as they can afford
      let canAfford = data[assigned];
      if (!costs.every(([resourceIndex, value]) => {
        // tasks use resources per assigned skeleton
        const perValue = -value * data[assigned];
        canAfford = (
          Math.min(
            perValue + (state.get([resource, resourceIndex, amount]) - perValue),
            perValue,
            canAfford * -value
          ) / -value
        ) | 0;

        return canAfford > 0;
      })) {
        return;
      }

      // don't spend resources making more than player has room
      // for
      gains.map(([resourceIndex, value]) => {
        const perValue = value * canAfford;
        canAfford = Math.ceil(
          Math.min(
            (state.get([resource, resourceIndex, max]) ?? Infinity) - (state.get([resource, resourceIndex, amount]) ?? 0),
            canAfford
          ) / value
        )
      });

      // console.log({
      //   name: data[name],
      //   assigned: data[assigned],
      //   canAfford
      // })

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

function getTip(data, value) {
  return data[effects].map(([resourceIndex, resourceValue]) => {
    return `
      <div>
        <span>${resources[resourceIndex][icon]}</span>
        <span>
          ${
            resourceValue > 0
              ? '+'
              // show -0
              : value === 0
                ? '-'
                : ''
          }${value * resourceValue} per ${RESOURCE_TICK / 60}s
        </span>
      </div>`;
  }).join('');
}

function setMaxAssignable(data, input) {
  input.setAttribute('max', Math.min(
    state.get([task, idle, assigned], 0) + (data[assigned] ?? 0),
    (data[assignable] ?? 0)
  ));
}

function setResourceChange(data, value) {
  data[effects].map(([resourceIndex, resourceValue]) => {
    state.set([resource, resourceIndex, change, value * resourceValue]);
  });
}