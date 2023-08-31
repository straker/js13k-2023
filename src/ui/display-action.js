import state, { resource, action } from '../data/state.js';
import {
  name,
  description,
  cooldown,
  effects,
  prereq,
  cost,
  researchCost,
  unlocked,
  visible,
  clicked,
  disabled,
  timer
} from '../data/actions.js';
import resources, {
  max,
  amount
} from '../data/resources.js';
import { on } from '../events.js';
import {
  html,
  displayCost,
  canAfford
} from '../utils.js';
import UnlockableButton from './unlockable-button.js';

/**
 * Display a manual action the player can perform.
 *
 * @param {*[]} data - Action data.
 * @param {Number} index - The current item of the data.
 */
export default function displayAction(data, index) {
  const button = new ActionButton(
    data,
    index,
    action,
    name,
    description,
    cost,
    effects,
    prereq,
    researchCost,
    unlocked,
    visible,
    disabled
  );
  const cooldownSpan = html('<span class="cooldown"></span>');
  const benefitSpan = html(`
    <span class="res">
      ${
        data[effects].map(([resourceIndex, value]) => {
          return displayCost(resources[resourceIndex], value, '+');
        }).join('')
      }
    </span>
  `);

  button.appendChild(cooldownSpan);
  button.appendChild(benefitSpan);

  // update action cooldown timer
  setCooldown(data, cooldownSpan);
  on(['timer-tick'], (dt) => {
    if (data[timer] <= 0) {
      return;
    }

    const value = state.set([action, index, timer, -dt]);
    setCooldown(data, cooldownSpan);

    // re-enable action if timer expires and player can perform action
    if (canPerform(data)) {
      state.set([action, index, disabled, false]);
    }
  });

  // `actG` is a global HTML id from index.html
  actG.appendChild(button);
}

class ActionButton extends UnlockableButton {
  constructor(...args) {
    super(...args);
  }

  whenClicked(data, index) {
    state.set([action, index, clicked, 1]);
    data[effects].map(([resourceIndex, value]) => {
      state.set(
        [resource, resourceIndex, amount, value],
        state.get([resource, resourceIndex, max])
      );
    });
    state.set([action, index, disabled, true]);
    state.set([action, index, timer, data[cooldown]]);
  }

  canAfford(data) {
    return canPerform(data);
  }

  // re-enable action if resource amount or max changes (but
  // only if timer isn't going)
  enableWhenCanAfford(data, index) {
    data[effects].map(([resourceIndex]) => {
      on([resource, resourceIndex, amount], () => {
        if (!data[visible]) return;

        if (canPerform(data)) {
          state.set([action, index, disabled, false]);
        }
      });

      on([resource, resourceIndex, max], () => {
        if (!data[visible]) return;

        if (canPerform(data)) {
          state.set([action, index, disabled, false]);
        }
      });
    });

    data[cost].map(([resourceIndex]) => {
      on([resource, resourceIndex, amount], () => {
        if (!data[visible]) return;

        let isDisabled = true;
        if (canPerform(data)) {
          isDisabled = false;
        }

        state.set([action, index, disabled, isDisabled]);
      });
    });
  }
}

function setCooldown(data, cooldownSpan) {
  const width = data[timer] <= 0
    ? 0
    : data[timer] / data[cooldown] * 100 + '%';
  cooldownSpan.style.width = width;
}

function canPerform(data) {
  return (
    data[timer] <= 0 &&
    canAfford(data[cost]) &&
    data[effects].some(([resourceIndex]) => {
      return state.get([resource, resourceIndex, amount]) < state.get([resource, resourceIndex, max]);
    })
  );
}