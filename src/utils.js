import { on } from './events.js';

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
 * @param {Number} itemIndex - The current item of the data.
 * @param {Number} visibleIndex - The visible index of the current item data.
 */
export function showWhenPrereqMet(data, prereqIndex, domElm, stateIndex, itemIndex, visibleIndex) {
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
          state.set([stateIndex, itemIndex, visibleIndex, true]);
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