import state, { resource, data } from './data/state.js';
import { on } from './events.js';
import {
  amount,
  skeletons,
  militia,
  infantry,
  archers,
  cavalry
} from './data/resources.js';
import { ATTACK_TICK } from './constants.js';
import {
  lastAttackTimer,
  lastAttackPop,
  attackTimer
} from './data/game-data.js';
import Dialog from './ui/dialog.js';

let attackDialog;

// bind attack timer visibility
on([data, 0, attackTimer], value => {
  atk.hidden = value < 0;
  if (value < 0) {
    return;
  }

  const mins = value / 60 | 0;
  const secs = value - mins * 60 | 0;
  atkTimer.innerHTML = `${mins}:${(''+secs).padStart(2, 0)}`;
});

// countdown attack timer
on(['timer-tick'], dt => {
  state.add([data, 0, attackTimer, -dt]);
});

/**
 * Check for an attack every resource tick. An attack will happen every 25 skeleton pop (including army) or every 5 minute (which ever occurs first).
 */
export default function attackTick(dt) {
  // workaround for circular import of Dialog > loop >
  // attack-tick > Dialog
  attackDialog = attackDialog ?? new Dialog({
    confirm: 'OK'
  });
  attackDialog.onClose = function(how) {
    attackDialog.dialog.classList.add('to-tr');
    attackDialog.dialog.addEventListener('animationend', (e) => {
      if (e.animationName == 'to-tr') {
        return state.set([data, 0, attackTimer, 60]);
      }

      attackDialog.dialog.classList.remove('to-tr');
      attackDialog.close();
    });
  }

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
    timer < ATTACK_TICK &&
    totalPop < lastPop + 25
  ) {
    return
  }

  state.set([data, 0, lastAttackTimer, 0]);
  state.set([data, 0, lastAttackPop, totalPop]);

  attackDialog.head.innerHTML = '<b>🎯 Attack Incoming</b>';
  attackDialog.body.innerHTML = 'The local population does not like you taking the bodies of their loved ones. They are gathering an army to attack you.';
  attackDialog.open();
}