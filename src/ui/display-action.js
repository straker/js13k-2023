import state, { resource, action } from '../data/state.js';
import {
  name,
  effects,
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
  button.hidden = !data[visible];
  button.setAttribute('aria-disabled', !!data[disabled]);
  showWhenPrereqMet(data, prereq, button, action, index, visible);

  // bind disabled state to the aria-disabled attribute
  on([action, index, disabled], (value) => {
    button.setAttribute('aria-disabled', !!value);
  });

  // perform action
  button.addEventListener('click', (e) => {
    if (data[disabled]) {
      return e.preventDefault();
    }

    state.set([action, index, clicked, 1]);
    data[effects].map(([resourceIndex, value]) => {
      state.set(
        [resource, resourceIndex, amount, value],
        state.get([resource, resourceIndex, max])
      );
    });
    state.set([action, index, disabled, true]);
    state.set([action, index, timer, data[cooldown]]);
  });

  // update action cooldown timer
  setCooldown(data, cooldownDiv);
  on(['timer-tick'], (dt) => {
    if (data[timer] <= 0) {
      return;
    }

    const value = state.set([action, index, timer, -dt]);
    setCooldown(data, cooldownDiv);

    // re-enable action if timer expires and player can perform action
    if (
      value <= 0 &&
      canPeform(data[effects])
    ) {
      state.set([action, index, disabled, false]);
    }
  });

  // re-enable action if resource amount or max changes (but only if timer isn't going)
  data[effects].map(([resourceIndex]) => {
    on([resource, resourceIndex, amount], () => {
      if (data[timer] <= 0 && canPeform(data[effects])) {
        state.set([action, index, disabled, false]);
      }
    });

    on([resource, resourceIndex, max], () => {
      if (data[timer] <= 0 && canPeform(data[effects])) {
        state.set([action, index, disabled, false]);
      }
    });
  });

  // `actG` is a global HTML id from index.html
  actG.appendChild(button);
}

function setCooldown(data, cooldownDiv) {
  const width = data[timer] <= 0
    ? 0
    : data[timer] / data[cooldown] * 100 + '%';
  cooldownDiv.style.width = width;
}

function canPeform(effects) {
  return effects.every(([resourceIndex, value]) => {
    const curAmount = state.get([resource, resourceIndex, amount]);

    if (value > 0) {
      return curAmount < state.get([resource, resourceIndex, max])
    }

    return curAmount > 0;
  });
}