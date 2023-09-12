import state, { resource, data } from '../data/state.js';
import {
  amount,
  skeletons,
  militia,
  infantry,
  archers,
  cavalry
} from '../data/resources.js';
import { ATTACK_TICK } from '../constants.js';
import { lastAttackTimer, lastAttackPop } from '../data/game-data.js';

// check for an attack every resource tick.
// an attack will happen every 25 skeleton pop (including army)
// or every 5 minute (which ever occurs first).
export default function shouldAttack(dt) {
  const timer = state.add([data, 0, lastAttackTimer, dt]);

  // keep track of the last population when the attack occurred
  // so if population is lost due to the attack the player can
  // rebuild up to the prior population before another attack
  // based on population occurs
  const lastPop = state.get([data, 0, lastAttackPop], 0);
  const totalPop = [
    skeletons,
    militia,
    infantry,
    archers,
    cavalry
  ].reduce((total, resourceIndex) => {
    return total += state.get([resource, resourceIndex, amount], 0);
  }, 0)

  if (
    // use a maximum attack timer so players cannot just sit on
    // their population and not get attacked
    timer >= ATTACK_TICK ||
    totalPop >= lastPop + 25
  ) {
    state.set([data, 0, lastAttackTimer, 0]);
    state.set([data, 0, lastAttackPop, totalPop]);
    return true;
  }

  return false;
}