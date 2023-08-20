import state, { resource, action } from '../data/state.js';
import {
  name,
  effect,
  prereq,
  timer,
  cooldown,
  visible,
  disabled,
  clicked
} from '../data/actions.js';
import { amount, max } from '../data/resources.js';
import { on } from '../events.js';
import { html, showWhenPrereqMet } from '../utils.js';

/**
 * Display a manual action the player can perform.
 *
 * @param {*[]} data - Action data.
 * @param {Number} index - The current item of the data.
 */
export default function displayAction(data, index) {
  const button = html(`
    <button>
      ${data[name]}
      <span class="cooldown"></span>
    </button>
  `);
  const cooldownDiv = button.querySelector('span');
  button.hidden = data[prereq];
  showWhenPrereqMet(data, prereq, button, action, index, visible);

  // manual actions will always increase a resource property
  const resourceIndex = data[effect][1];

  // bind disabled state to the aria-disabled attribute
  on([action, index, disabled], (value) => {
    button.setAttribute('aria-disabled', !!value);
  });

  // perform action
  button.addEventListener('click', (e) => {
    if (data[disabled]) {
      return e.preventDefault();
    }

    const clickCount = (data[clicked] ?? 0) + 1;
    state.set([action, index, clicked, clickCount]);
    state.set(data[effect], state.get([resource, resourceIndex, max]));
    state.set([action, index, disabled, true]);
    state.set([action, index, timer, data[cooldown]]);
  });

  // update action cooldown timer
  on(['timer-tick'], (dt) => {
    if (data[timer] <= 0) {
      return;
    }

    const value = state.set([action, index, timer, -dt]);
    const width = value <= 0
      ? 0
      : value / data[cooldown] * 100 + '%';
    cooldownDiv.style.width = width;

    // re-enable action if timer expires and the resources is not
    // at max
    if (
      value <= 0 &&
      state.get([resource, resourceIndex, amount]) < state.get([resource, resourceIndex, max])
    ) {
      state.set([action, index, disabled, false]);
    }
  });

  // re-enable action if max resource increases (but only if
  // timer isn't going)
  on([resource, resourceIndex, max], (value) => {
    if (data[timer] <= 0) {
      state.set([action, index, disabled, false]);
    }
  });

  // re-enable action if resources are below max (but only if timer isn't going)
  on([resource, resourceIndex, amount], (value) => {
    if (data[timer] <= 0 && amount < state.get([resource, resourceIndex, max])) {
      state.set([action, index, disabled, false]);
    }
  });

  // `actG` is a global HTML id from index.html
  actG.appendChild(button);
}