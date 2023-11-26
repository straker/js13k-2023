import { on, off } from './events.js';
import state, {
  resource,
  action,
  building,
  task,
  army,
  data as gameData
} from './data/state.js';
import resources, {
  name as resourceName,
  icon,
  amount,
  militia,
  infantry,
  archers,
  cavalry
} from './data/resources.js';
import {
  militia as militiaIndex,
  infantry as infantryIndex,
  archers as archersIndex,
  cavalry as cavalryIndex
} from './data/armies.js';
import { upk } from './data/armies.js';
import { randSeed, currentView } from './data/game-data.js';
import { clamp } from './libs/kontra.js';

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

    function fn(curValue) {
      if (curValue >= neededValue) {
        prereqsMet[i] = 1;

        if (prereqsMet.every(value => value)) {
          off(path, fn);
          domElm.hidden = false;
          state.set([stateIndex, index, visible, true]);
          callback?.();

          const indexMap = {
            [action]: 'act',
            [building]: 'bld',
            [task]: 'tsk'
          };

          if (indexMap[stateIndex]) {
            const curView = state.get([gameData, 0, currentView]);
            // show new notification for buttons that aren't
            // the current view
            document
              .querySelectorAll(`.navB:not(.${curView}B) [data-t=${indexMap[stateIndex]}]`)
              .forEach(button => button.classList.add('new'));
          }
        }
      }
    }

    on(path, fn);
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

export function displayIcon(resourceData) {
  return `<span class="icon ${resourceData[resourceName]}">${resourceData[icon]}</span>`
}

/**
 * Get the HTML to display a resource cost of icon and value.
 * @param {Number[]} resourceData - Resource data array.
 * @param {Number} value - Cost value.
 * @param {String} [prefix=''] - Cost prefix string.
 * @return {String}
 */
export function displayCost(resourceData, value, prefix = '') {
  return `<span class="${resourceData[resourceName]}"><span class="cost-icon icon ${resourceData[resourceName]}">${resourceData[icon]}</span> ${prefix}${trucnateNumber(value)}</span>`;
}

/**
 * Get the HTML to display an army icon and value.
 * @param {Number[]} armyList - Army array.
 * @return {String}
 */
export function displayArmy(armyList) {
  const armyMap = {
    [militiaIndex]: resources[militia],
    [infantryIndex]: resources[infantry],
    [archersIndex]: resources[archers],
    [cavalryIndex]: resources[cavalry],
  };

  return `
    <div class="cost">
      ${
        armyList.map((value, index) => {
          const resourceData = armyMap[index];
          return `<span class="${resourceData[resourceName]}"><span class="icon cost-icon">${resourceData[icon]}</span> ${trucnateNumber(value)}</span>`;
        }).join('')
      }
    </div>
  `
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

/**
 * Random number generator based on splitmix32
 * @see https://github.com/bryc/code/blob/master/jshash/PRNGs.md#splitmix32
 */
let seed;
export const random = {
  rand() {
    seed |= 0; seed = seed + 0x9e3779b9 | 0;
    state.set([gameData, 0, randSeed, seed]);

    let t = seed ^ seed >>> 16; t = Math.imul(t, 0x21f0aaad);
        t = t ^ t >>> 15; t = Math.imul(t, 0x735a2d97);
    return ((t = t ^ t >>> 15) >>> 0) / 4294967296;
  },
  randInt(min, max, randFn = this.rand) {
    return ((randFn() * (max - min + 1)) | 0) + min;
  },
  getSeed() {
    return seed;
  },
  seed(t = Date.now()) {
    seed = t;
    state.set([gameData, 0, randSeed, seed]);
  }
};

/**
 *
 */
export function generateArmy(strength, availableUnits) {
  const armyList = [0,0,0,0];
  while (strength > 0) {
    const unitIndex = availableUnits[
      random.randInt(0, availableUnits.length - 1)
    ];
    const unitUpk = state.get([army, unitIndex, upk]);
    const unitStrength = Math.ceil(strength * unitUpk);

    // use a quadratic curve to generate a random number
    // whose result is more likely to be close to 0.
    // this helps give a more interesting distribution to
    // the armies rather than allowing one high roll to
    // dominate the army composition
    // @see https://gamedev.stackexchange.com/a/116875
    const amount = random.randInt(0, unitStrength, () => random.rand() ** 2);

    armyList[unitIndex] += amount;
    strength -= amount / unitUpk;
  }

  return armyList;
}

export function saveGame() {
  state.save();
  console.log('saved');
  // `saved` is a global HTML id from index.html
  saved.classList.remove('hide');
  setTimeout(() => saved.classList.add('hide'));
}

/**
 *
 */
window.isHidden = isHidden;
function isHidden(elm) {
  if (!elm || elm.nodeName === 'COL-GROUP') {
    return false;
  }

  if (
    elm.hidden ||
    window.getComputedStyle(elm).getPropertyValue('display') === 'none'
  ) {
    return true;
  }

  return isHidden(elm.parentNode);
}

/**
 * Enable and handle roving tabindex on an element.
 */
let rovingId = 0;
export function rovingTabindex(elm, selector, {
  dir,
  selectCallback,
  focus,
  dynamic,
  mutationCallback
} = {}) {
  const id = rovingId++;
  const children = Array.from(elm.querySelectorAll(selector));
  let curIndex = 0;
  let curChild;

  // select a child from the list
  elm.selectChild = function(index, {
    callback = true,
    focusElm = focus
  }) {
    const prevChild = curChild;

    if (!children[index]) {
      return;
    }
    if (isHidden(children[index])) {
      return elm.selectChild(index + 1, callback);
    }

    curIndex = clamp(0, children.length - 1, index);
    curChild = children[curIndex];

    prevChild.setAttribute('tabindex', -1);
    curChild.setAttribute('tabindex', 0);

    if (focusElm) {
      curChild.focus();
    }

    // selectCallback should handle focus
    if (callback && selectCallback) {
      selectCallback(index, curChild, prevChild);
    }
  }

  children.forEach((child, index) => {
    const childId = `child-${id}-${index}`;
    child.setAttribute('id', childId);
    child.setAttribute('tabindex', index === 0 ? 0 : -1);

    if (index === 0) {
      curChild = child;
    }

    // handle pointer moving roving tabindex
    child.addEventListener('click', (evt) => {
      elm.selectChild(index, true);
    });
  });

  // handle keyboard moving roving tabindex
  const keys = ['Home', 'End'];
  if (dir === 'horizontal') {
    keys.push('ArrowLeft', 'ArrowRight');
  }
  else {
    keys.push('ArrowUp', 'ArrowDown');
  }
  elm.addEventListener('keydown', (evt) => {
    if (!keys.includes(evt.code)) {
      return;
    }

    evt.preventDefault();
    let index = curIndex;

    switch(evt.code) {
    case 'ArrowUp':
    case 'ArrowLeft':
      index--;
      break;
    case 'ArrowDown':
    case 'ArrowRight':
      index++;
      break;
    case 'Home':
      index = 0;
      break;
    case 'End':
      index = children.length - 1;
      break;
    }

    elm.selectChild(index, true);
  });

  if (dynamic) {
    const observer = new MutationObserver((mutationList, observer) => {
      for (const mutation of mutationList) {
        if (
          mutation.type === 'attributes' &&
          mutation.attributeName === 'hidden' &&
          !mutation.target.hidden &&
          mutationCallback
        ) {
          mutationCallback(mutation.target);
        }
      }
    });

    observer.observe(elm, { attributes: true, subtree: true });
  }
}