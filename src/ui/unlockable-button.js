import state, { resource } from '../data/state.js';
import resources, {
  name as resourceName,
  icon,
  amount,
  research
} from '../data/resources.js';
import { on } from '../events.js';
import {
  html,
  showWhenPrereqMet,
  displayCost
} from '../utils.js';

export default class UnlockableButton {

  constructor(
    data,
    index,
    stateIndex,
    name,
    description,
    cost,
    effects,
    prereq,
    researchCost,
    unlocked,
    visible,
    disabled
  ) {
    data[cost] ??= [];
    const buttonName = data[name];
    let locked = data[researchCost] && !data[unlocked];

    const button = html(`
      <button class="tipC ${locked ? 'locked' : ''}">
        ${locked
          ? '<span class="lock">🔒</span>' + displayCost(resources[research], data[researchCost])
          : ''
        }
        <span>${buttonName}</span>
        <span class="tip">
          <strong>${buttonName}</strong>
          <span class="cost">
            ${data[cost].map(([resourceIndex, value]) => {
              return displayCost(resources[resourceIndex], value);
            }).join('')}
          </span>
          <p>${data[description]}.</p>
          ${locked
            ? `<em>Requires ${data[researchCost]} Research to unlock.</em>`
            : ''
          }
        </span>
      </button>
    `);
    button.hidden = !data[visible];
    button.setAttribute('aria-disabled', !!data[disabled]);
    showWhenPrereqMet(data, prereq, button, stateIndex, index, visible);

    // bind disabled state to the aria-disabled attribute
    on([stateIndex, index, disabled], (value) => {
      button.setAttribute('aria-disabled', !!value);
    });

    button.addEventListener('click', (e) => {
      // unlock button through research first before allowing
      // player to click it
      if (locked) {
        if (state.get([resource, research, amount], 0) < data[researchCost]) {
          window.alert('Not enough Research to unlock ' + buttonName);
        }
        else if (window.confirm(`Unlock ${buttonName} for ${data[researchCost]} Research?`)) {
          locked = false;
          button.querySelector('.lock').remove();
          button.querySelector('.Research').remove();
          button.classList.remove('locked');

          state.set([resource, research, amount, -data[researchCost]]);
          state.set([stateIndex, index, unlocked, true]);
          state.set([stateIndex, index, disabled, !this.canAfford(data)]);
          this.enableWhenCanAfford(data, index);
        }

        return;
      }

      if (data[disabled]) {
        return e.preventDefault();
      }

      data[cost].map(([resourceIndex, value]) => {
        state.set([resource, resourceIndex, amount, -value]);
      });
      this.whenClicked(data, index);
    });

    if (locked) {
      // player can always click a button that needs research
      state.set([stateIndex, index, disabled, false]);
    }
    else {
      // enable when player has enough resources
      this.enableWhenCanAfford(data, index);
    }

    return button;
  }
}