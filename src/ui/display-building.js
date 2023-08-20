import state, { resource, building } from '../data/state.js';
import {
  name,
  description,
  cost,
  effect,
  prereq,
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
  let researchCost = data[cost].find(([resourceIndex]) => resourceIndex === research);

  const button = html(`
    <button class="${researchCost ? 'locked' : ''}" title="${data[description]}">
      ${researchCost
        ? '<span class="lock" title="Building requires Research to unlock">🔒</span>' + displayCost(resources[research], researchCost[1])
        : ''
      }
      <span>${buildingName}</span>
      <span class="cost">${data[cost].map(([resourceIndex, value]) => {
        if (resourceIndex === research) {
          return '';
        }

        return displayCost(resources[resourceIndex], value);
      }).join('')}</span>
    </button>
  `);
  button.hidden = data[prereq];
  showWhenPrereqMet(data, prereq, button, building, index, visible);

  // show building heading when first building is shown
  if (index === 0) {
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
    if (researchCost) {
      if (state.get([resource, research, amount], 0) < researchCost[1]) {
        window.alert('Not enough Research to unlock ' + buildingName);
      }
      else if (window.confirm(`Unlock ${buildingName} for ${researchCost[1]} Research?`)) {
        state.set([resource, research, amount, -researchCost[1]]);
        researchCost = null;
        button.querySelector('.lock').remove();
        button.querySelector('.Research').remove();
        button.classList.remove('locked');

        data[cost].splice(data[cost].indexOf(researchCost));
        state.set([building, index, disabled, !canAfford(data[cost])]);
        enableWhenCanAfford(index, data[cost]);
      }

      return;
    }

    if (data[disabled]) {
      return e.preventDefault();
    }

    const buildCount = (data[built] ?? 0) + 1;
    state.set([building, index, built, buildCount]);
    state.set(data[effect]);
    data[cost].map(([resourceIndex, value]) => {
      state.set([resource, resourceIndex, amount, -value]);
    });
  });

  if (researchCost) {
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