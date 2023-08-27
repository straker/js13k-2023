import { on } from './events.js';
import { randInt } from './libs/kontra.js';

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

const soldiers = 0;
const archers = 1;
const soldierHp = 5;
const soldierMinDmg = 1;
const soldierMaxDmg = 4;
const archerHp = 3;
const archerMinDmg = 1;
const archerMaxDmg = 2;

window.attack = attack;
export function attack(attackers, defenders) {
  // defenders archers attack first
  subAttack(archerMinDmg, archerMaxDmg, defenders[archers], attackers);

  // attackers archers attack next
  subAttack(archerMinDmg, archerMaxDmg, attackers[archers], defenders);

  // soldiers attack each other at the same time
  const defenderDmg = getDamage(soldierMinDmg, soldierMaxDmg, defenders[soldiers]);
  const attackerDmg = getDamage(soldierMinDmg, soldierMaxDmg, attackers[soldiers]);

  applyDamage(defenderDmg, attackers);
  applyDamage(attackerDmg, defenders);
}

function getDamage(min, max, armyAmount) {
  return randInt(min * armyAmount, max * armyAmount);
}

function subAttack(min, max, armyAmount, def) {
  applyDamage(getDamage(min, max, armyAmount), def);
}

function applyDamage(dmg, def) {
  // soldiers always take hits first
  def[soldiers] = Math.ceil((soldierHp * def[soldiers] - dmg) / soldierHp);

  // only rollover damage to archers if there are no more
  // soldiers
  if (def[soldiers] < 0) {
    dmg = Math.abs(def[soldiers]) * soldierHp;
    def[soldiers] = 0;
    def[archers] = Math.ceil((archerHp * def[archers] - dmg) / archerHp);
  }
}