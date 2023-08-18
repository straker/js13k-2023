import { GameLoop, emit } from './libs/kontra.js';
import { RESOURCE_TICK } from './constants.js';

import init from './init.js';
import { assignable, timer, disabled } from './data/actions.js';
import state, { action } from './data/state.js';
init();

const manualActions = state.get([action])
  .filter(a => {
    return a[assignable] === 1;
  });

let count = 0;
const loop = GameLoop({
  clearCanvas: false,
  blur: true,
  update(dt) {
    manualActions.map((a, index) => {
      if (a[timer] > 0) {
        const t = state.set([action, index, timer, -dt]);
      }
    });

    if (++count < RESOURCE_TICK) {
      return;
    }

    count = 0;
    emit('resource-tick');
  },
  render() {}
});
loop.start();