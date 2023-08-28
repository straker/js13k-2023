import { on } from './events.js';
import { randInt } from './libs/kontra.js';
import armies, {
  health,
  defense,
  attack,
  advantage
} from './data/armies.js';

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

window.battle = battle;
// export function attack(attackers, defenders) {
//   // defenders archers attack first
//   subAttack(archerMinDmg, archerMaxDmg, defenders[archers], attackers);

//   // attackers archers attack next
//   subAttack(archerMinDmg, archerMaxDmg, attackers[archers], defenders);

//   // soldiers attack each other at the same time
//   const defenderDmg = getDamage(soldierMinDmg, soldierMaxDmg, defenders[soldiers]);
//   const attackerDmg = getDamage(soldierMinDmg, soldierMaxDmg, attackers[soldiers]);

//   applyDamage(defenderDmg, attackers);
//   applyDamage(attackerDmg, defenders);
// }

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

/**
 * @see https://ogame.fandom.com/wiki/Combat
 * @param {number[]} attackers - Amount of each unit type for the attackers
 * @param {number[]} defenders - Amount of each unit type for the defenders.
 */
const unitType = 0;
const hp = 1;
const def = 2;
const atk = 3;
export function battle(attackers, defenders) {
  // turn the amount of each type into a array of each units
  // stats (health, defense, attack)
  attackers = attackers.map((armyAmount, armyIndex) => {
    const stats = [];
    for (let i = 0; i < armyAmount; i++) {
      stats.push([
        // TODO: this works without upgrades, will need to figure
        // out how to handle player / ai upgrades if i add that
        armyIndex,
        armies[armyIndex][health],
        armies[armyIndex][defense],
        armies[armyIndex][attack]
      ]);
    }

    return stats;
  }).flat();
  defenders = defenders.map((armyAmount, armyIndex) => {
    const stats = [];
    for (let i = 0; i < armyAmount; i++) {
      stats.push([
        armyIndex,
        armies[armyIndex][health],
        armies[armyIndex][defense],
        armies[armyIndex][attack]
      ]);
    }

    return stats;
  }).flat();

  for (
    let i = 0;
    // attack in 6 rounds or until one side dies
    i < 6 &&
    attackers.length &&
    defenders.length;
    i++
  ) {
    const style = 'background-color: darkblue; color: white; font-style: italic; border: 5px solid hotpink; font-size: 2em;'
    console.log('%cround %i', style, i+1);

    // In the beginning of each round, every unit starts with
    // its Attack (with value A) and Defense (with value D) at
    // its initial value (specific of each unit plus technology
    // upgrades). The Health (with value H) has the value of
    // previous round (initial value of the unit if it is the
    // first round).
    attackers.map(unit => {
      unit[def] = armies[ unit[unitType] ][defense];
      unit[atk] = armies[ unit[unitType] ][attack];
    });
    defenders.map(unit => {
      unit[def] = armies[ unit[unitType] ][defense];
      unit[atk] = armies[ unit[unitType] ][attack];
    });

    // attackers and defenders attack each other at the same time
    attackers.map((attacker, atkI) => {
      const style = 'font-weight: bold;'
      console.log('%cnext attack', style);
      // each unit picks a random unit to attack
      const defI = randInt(0, defenders.length - 1);
      let defender = defenders[defI];
      attackUnit(attacker, defender, atkI, defI);

      // if the attacking unit has advantage (with value r)
      // against the target unit, it has a chance of (r-1)/r of
      // choosing another target at random, and repeating the
      // above steps for that new target.
      console.log('unit has advantage', armies[ attacker[unitType] ][advantage] == defender[unitType]);
      while (
        armies[ attacker[unitType] ][advantage] == defender[unitType]
      ) {
        // TODO: for simplicity sake all advantage attacks have the same r value of 50%
        const rand = Math.random();
        console.log('chance to attack again. needed 0.5 rolled', rand);
        if (rand >= 0.5) return;

        console.log('advantage attack');
        const defI = randInt(0, defenders.length - 1);
        defender = defenders[defI];
        attackUnit(attacker, defender, atkI, defI);
      }
    });

    const style2 = 'font-size: 1.5rem; background-color: #222; color: #fdfdfd;'
    console.log('%cdefenders turn', style2);

    // attackers and defenders attack each other at the same time
    defenders.map((attacker, atkI) => {
      const style = 'font-weight: bold;'
      console.log('%cnext attack', style);
      // each unit picks a random unit to attack
      const defI = randInt(0, attackers.length - 1);
      let defender = attackers[defI];
      attackUnit(attacker, defender, atkI, defI);

      // if the attacking unit has advantage (with value r)
      // against the target unit, it has a chance of (r-1)/r of
      // choosing another target at random, and repeating the
      // above steps for that new target.
      console.log('unit has advantage', armies[ attacker[unitType] ][advantage] == defender[unitType]);
      while (
        armies[ attacker[unitType] ][advantage] == defender[unitType]
      ) {
        // TODO: for simplicity sake all advantage attacks have the same r value of 50%
        const rand = Math.random();
        console.log('chance to attack again. needed 0.5 rolled', rand);
        if (rand >= 0.5) return;

        console.log('advantage attack');
        const defI = randInt(0, attackers.length - 1);
        defender = attackers[defI];
        attackUnit(attacker, defender, atkI, defI);
      }
    });

    // remove dead units
    attackers = attackers.filter(unit => unit[hp] > 0);
    defenders = defenders.filter(unit => unit[hp] > 0);
  }

  return { attackers, defenders };
}

function attackUnit(attacker, defender, atkI, defI) {
  console.log('\nattacker', atkI, attacker, 'attacking defender', defI, defender);

  // the Attack is lower than the Defense, the armor absorbs the
  // attack, and the unit does not lose any Health: D = D - A.
  if (attacker[atk] <= defender[def]) {
    console.log('absorbed.', defender[def], '-', attacker[atk], ' =', defender[def] - attacker[atk]);
    defender[def] = defender[def] - attacker[atk];
    return;
  }

  // the Attack is sufficiently strong, i.e. A > D. Then the
  // armor only absorbs part of the attack and the rest is dealt
  // to the Health: H = H - (A - D) and D = 0.
  console.log('damaged delt:', attacker[atk] - defender[def], 'hp:', defender[hp] - (attacker[atk] - defender[def]));
  defender[hp] -= attacker[atk] - defender[def];
  defender[def] = 0;

  // if the Health is less than 70% of the initial Health (H_i)
  // of the unit (initial of the combat), then the unit has a
  // probability of 1 - H/H_i of dying instantly. If it
  // does, the Health is set to zero: H = 0. (but it can still
  // be attacked by the other units on this round, because they
  // already target it.)
  const initialHealth = armies[ defender[unitType] ][health];
  if (defender[hp] / initialHealth < 0.7) {
    const target = 1 - defender[hp] / initialHealth;
    const rand = Math.random();
    console.log('chance to die instantly. needed', target, 'rolled', rand);
    if (rand < target) {
      console.log('died instantly');
      defender[hp] = 0;
    }
  }
}