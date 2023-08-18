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
import resources, { name as resourceName, icon, amount } from '../data/resources.js';
import { on } from '../events.js';
import { html, showWhenPrereqMet } from '../utils.js';

/**
 * Display a building the player can build.
 *
 * @param {*[]} data - Building data.
 * @param {Number} index - The current item of the data.
 */
export default function displayBuilding(data, index) {
  const button = html(`
    <button title="${data[description]}">
      <span>${data[name]}</span>
      <span>${data[cost].map(([resourceIndex, value]) => {
        return `<span title="${resources[resourceIndex][resourceName]}">${resources[resourceIndex][icon]}${value}</span>`
      }).join('')}</span>
    </button>
  `);
  button.hidden = data[prereq];
  showWhenPrereqMet(data, prereq, button, building, index, visible);

  // bind disabled state to the aria-disabled attribute
  on([building, index, disabled], (value) => {
    button.setAttribute('aria-disabled', value);
  });

  // subtract resources when built
  button.addEventListener('click', (e) => {
    if (state.get([building, index, disabled])) {
      return e.preventDefault();
    }

    const buildCount = (data[built] ?? 0) + 1;
    state.set([building, index, built, buildCount]);
    state.set(data[effect]);
    data[cost].map(([resourceIndex, value]) => {
      state.set([resource, resourceIndex, amount, -value]);
    });
  });

  // enable building when player has enough resources
  data[cost].map(([resourceIndex]) => {
    on([resource, resourceIndex, amount], () => {
      let isDisabled = true;
      if (
        data[cost].every(([i, value]) => {
          return state.get([resource, i, amount]) >= value
        })
      ) {
        isDisabled = false;
      }

      state.set([building, index, disabled, isDisabled]);
    });
  });

  // `buildingGroup` is a global HTML id from index.html
  buildingGroup.appendChild(button);
}