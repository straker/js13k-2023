import { clamp } from '../libs/kontra.js';
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
import resources, {
  name as resourceName,
  icon, amount,
  max,
  change,
  skeletons
} from '../data/resources.js';
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
  const row = html(`
    <div class="row tipC" ${!data[visible] ? 'hidden' : ''}>
    </div>
  `);
  const taskName = html(`
    <div class="col">
      ${data[name]}
    </div>
  `);

  const div = html(`
    <div class="col">
      <input type="number" aria-label="${data[name]}" min="0" max="0" value="${data[assigned] ?? 0}">
      ${index !== idle ? `<span class="tip">${getTip(data, data[assigned] ?? 0)}</span>` : ``}
    </div>
  `);
  const maxDiv = html(`<div class="col max"></div>`)
  const input = div.querySelector('input');
  row.hidden = !data[visible];
  showWhenPrereqMet(data, prereq, div, task, index, visible);

  // show tasks heading when first task is shown
  if (index === 0) {
    // `tsk` is a global HTML id from index.html
    tsk.hidden = !data[visible]

    on([task, 0, visible], (value) => {
      tsk.hidden = !value;
    });
  }

  // bind hidden state to the task name
  on([task, index, visible], (value) => {
    row.hidden = !value;
  });

  function onChange() {
    const numAssigned = data[assigned] ?? 0;
    const value = +input.value;
    const diff = value - numAssigned;

    state.add([task, index, assigned, diff])
    state.add([task, idle, assigned, -diff])
  }

  // special auto task that user cannot change
  if (index === idle) {
    input.setAttribute('readonly', true);
    input.setAttribute('type', 'text');

    // bind skeletons resource to idle skeletons value
    on([resource, skeletons, amount], (value, diff) => {
      state.add([task, index, assigned, diff])
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
        div.querySelector('.tip').innerHTML = tip;
      }

      // keep track of the change in resource state to display
      // either a positive or negative change in the resource
      data[effects].map(([resourceIndex, resourceValue]) => {
        state.add([resource, resourceIndex, change, diff * resourceValue]);
      });
    });

    input.addEventListener('keydown', (evt) => {
      // allow only tab key or any key that uses ctrl/alt/meta
      if (
        !(
          evt.code === 'Tab' ||
          evt.metaKey ||
          evt.altKey ||
          evt.ctrlKey
        )
      ){
        evt.preventDefault();
      }

      const max = data[assignable]
      if (evt.code == 'ArrowRight') {
        input.value = clamp(0, max, +input.value + 1);
        onChange();
      }
      if (evt.code == 'ArrowLeft') {
        input.value = clamp(0, max, +input.value - 1);
        onChange();
      }
    });

    // add or subtract assigned skeletons
    input.addEventListener('change', onChange);
  }

  // `tskG` is a global HTML id from index.html
  row.appendChild(taskName);
  row.appendChild(div);
  row.appendChild(maxDiv);
  tskG.appendChild(row);
}

function getTip(data, value) {
  return data[effects].map(([resourceIndex, resourceValue]) => {
    return `
      <div class="task-tip">
        <span class="icon ${resources[resourceIndex][resourceName]}">${resources[resourceIndex][icon]}</span>
        <span>
          <span class="num">${
            resourceValue > 0
              ? '+'
              : '-'
          }</span>${value * Math.abs(resourceValue)} per ${RESOURCE_TICK / 60}s
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

// function setResourceChange(data, value) {
//   data[effects].map(([resourceIndex, resourceValue]) => {
//     state.add([resource, resourceIndex, change, value * resourceValue]);
//   });
// }