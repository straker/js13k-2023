import state, { resource, building } from '../data/state.js';
import {
  name,
  description,
  cost,
  effects,
  prereq,
  researchCost,
  unlocked,
  built,
  visible,
  disabled
} from '../data/buildings.js';
import resources, { research, name as resourceName, icon, amount } from '../data/resources.js';
import { on } from '../events.js';
import { html, showWhenPrereqMet } from '../utils.js';

/**
 * Display a building the player can build.
 *
 * @param {*[]} data - Building data.
 * @param {Number} index - The current item of the data.
 */
export default function displayBuilding(data, index) {
  const buildingName = data[name];
  let locked = data[researchCost] && !data[unlocked];

  const button = html(`
    <button class="${locked ? 'locked' : ''}" title="${data[description]}">
      ${locked
        ? '<span class="lock" title="Building requires Research to unlock">🔒</span>' + displayCost(resources[research], data[researchCost])
        : ''
      }
      <span>${buildingName}</span>
      <span class="cost">${data[cost].map(([resourceIndex, value]) => {
        return displayCost(resources[resourceIndex], value);
      }).join('')}</span>
    </button>
  `);
  button.hidden = !data[visible];
  button.setAttribute('aria-disabled', !!data[disabled]);
  showWhenPrereqMet(data, prereq, button, building, index, visible);

  // show building heading when first building is shown
  if (index === 0) {
    bldT.hidden = !data[visible];
    on([building, 0, visible], (value) => {
      // `bldT` is a global HTML id from index.html
      bldT.hidden = !value;
    });
  }

  // bind disabled state to the aria-disabled attribute
  on([building, index, disabled], (value) => {
    button.setAttribute('aria-disabled', !!value);
  });

  // subtract resources when built
  button.addEventListener('click', (e) => {
    // unlock building through research first before allowing
    // player to build it
    if (locked) {
      if (state.get([resource, research, amount], 0) < data[researchCost]) {
        window.alert('Not enough Research to unlock ' + buildingName);
      }
      else if (window.confirm(`Unlock ${buildingName} for ${data[researchCost]} Research?`)) {
        locked = false;
        button.querySelector('.lock').remove();
        button.querySelector('.Research').remove();
        button.classList.remove('locked');

        state.set([resource, research, amount, -data[researchCost]]);
        state.set([building, index, unlocked, true]);
        state.set([building, index, disabled, !canAfford(data[cost])]);
        enableWhenCanAfford(index, data[cost]);
      }

      return;
    }

    if (data[disabled]) {
      return e.preventDefault();
    }

    state.set([building, index, built, 1]);
    data[effects].map(effect => state.set(effect));
    data[cost].map(([resourceIndex, value]) => {
      state.set([resource, resourceIndex, amount, -value]);
    });
  });

  if (locked) {
    // player can always click a building that needs research
    state.set([building, index, disabled, false]);
  }
  else {
    // enable building when player has enough resources
    enableWhenCanAfford(index, data[cost]);
  }

  // `bldG` is a global HTML id from index.html
  bldG.appendChild(button);
}

function enableWhenCanAfford(index, costs) {
  costs.map(([resourceIndex]) => {
    on([resource, resourceIndex, amount], () => {
      let isDisabled = true;
      if (canAfford(costs)) {
        isDisabled = false;
      }

      state.set([building, index, disabled, isDisabled]);
    });
  });
}

function canAfford(costs) {
  return costs.every(([i, value]) => {
    return state.get([resource, i, amount]) >= value
  });
}

function displayCost(resourceData, value) {
  return `<span class="${resourceData[resourceName]}" title="${resourceData[resourceName]}">${resourceData[icon]}${value}</span>`;
}