import { on } from './events.js';
import state, { resource } from './data/state.js';
import {
  name as resourceName,
  icon,
  amount
} from './data/resources.js';

/**
 * Traverse a nested array and return the value at the desired path. Each index of the `path` is the index of the array to traverse down at each level.
 *
 * @example
 * const array = [ [1], [ [2] ] ]
 * traversePath(array, [0, 0]) // 1
 * traversePath(array, [1, 0, 0]) // 2
 *
 * @param {*[]} array - Array to traverse.
 * @param {Number[]} path - Array of indices.
 * @return {*}
 */
export function traversePath(array, path) {
  let curr = array;
  path.map(index => {
    curr[index] = curr[index] ?? [];
    curr = curr[index];
  });
  return curr;
}

/**
 * Show the HTML element when the prerequisites of the element are met.
 *
 * @param {*[]} data - Resource, Building, or Action data.
 * @param {Number} prereqIndex - Prereq index of the data array.
 * @param {HTMLElement} domElm - HTML Element to show.
 * @param {Number} stateIndex - Data index of the state array.
 * @param {Number} index - The current item of the data.
 * @param {Number} visible - The visible index of the current item data.
 */
export function showWhenPrereqMet(data, prereqIndex, domElm, stateIndex, index, visible, callback) {
  const prereqs = (data[prereqIndex] ?? [])
  const prereqsMet = prereqs.map(() => 0);

  prereqs.map((prereq, i) => {
    const path = [...prereq];  // clone
    const neededValue = path.pop();

    on(path, (curValue) => {
      if (curValue >= neededValue) {
        prereqsMet[i] = 1;
        if (prereqsMet.every(value => value)) {
          domElm.hidden = false;
          state.set([stateIndex, index, visible, true]);
          callback && callback();
        }
      }
    });
  });
}

/**
 * Transform a string of HTML into an HTML element.
 *
 * @param {String} str - String of HTML.
 * @return {HTMLElement}
 */
export function html(str) {
  const div = document.createElement('div');
  div.innerHTML = str;
  return div.children[0];
}

/**
 * Truncate a number to show 1K when over 1000 and 1M when over 1_000_000.
 * @param {Number} value - Value to truncate.
 * @return {Number|String}
 */
export function trucnateNumber(value) {
  return value < 1e3
    ? value | 0
    : value < 1e6
    ? (value / 1e3).toFixed(1) + 'K'
    : (value / 1e6).toFixed(1) + 'M'
}

/**
 * Get the HTML to display a resource cost of icon and value.
 * @param {Number[]} resourceData - Resource data array
 * @param {Number} value - Cost value.
 * @param {String} [prefix=''] - Cost prefix string.
 * @return {String}
 */
export function displayCost(resourceData, value, prefix = '') {
  return `<span class="${resourceData[resourceName]}"><span class="cost-icon">${resourceData[icon]}</span> ${prefix}${trucnateNumber(value)}</span>`;
}

/**
 * Determine if the costs have been met for either an Action or Building.
 * @param {Number[]} - Cost data array.
 * @return {Boolean}
 */
export function canAfford(costs) {
  return costs.every(([resourceIndex, value]) => {
    return state.get([resource, resourceIndex, amount]) >= value
  });
}