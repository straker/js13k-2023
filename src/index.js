import { GameLoop } from './libs/kontra.js';
import { RESOURCE_TICK, SAVE_TICK } from './constants.js';
import { on, emit } from './events.js';
import state from './data/state.js';
import { shouldAttack } from './attacks.js';

import init from './init.js';
init();

let resourceTimer = 0;
let saveTimer = 0;
const loop = GameLoop({
  clearCanvas: false,
  blur: true,
  update(dt) {
    emit(['timer-tick'], dt);

    if (++resourceTimer >= RESOURCE_TICK) {
      resourceTimer = 0;
      emit(['resource-tick']);

      if (shouldAttack(dt)) {
        console.log('attack incoming!');
      }
    }

    if (++saveTimer >= SAVE_TICK) {
      saveTimer = 0;
      state.save();
      console.log('saved');
      // `saved` is a global HTML id from index.html
      saved.classList.remove('hide');
      setTimeout(() => saved.classList.add('hide'));
    }
  },
  render() {}
});
loop.start();