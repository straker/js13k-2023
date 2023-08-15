import { GameLoop, emit } from './libs/kontra.js';
import { RESOURCE_TICK } from './constants.js';

import init from './init.js';
init();

let count = 0;
const loop = GameLoop({
  clearCanvas: false,
  blur: true,
  update() {
    if (++count < RESOURCE_TICK) {
      return;
    }

    count = 0;
    emit('resource-tick');
  },
  render() {}
});
loop.start();