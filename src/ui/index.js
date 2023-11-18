import state, { resource, action, building, task, data } from '../data/state.js';
import displayResource from './display-resource.js';
import displayBuilding from './display-building.js';
import displayAction from './display-action.js';
import displayTask from './display-task.js';
import {
  attackTimer,
  attackArmy,
  actionVisible,
  buildingVisible,
  taskVisible
} from '../data/game-data.js';
import { displayArmy } from '../utils.js';
import { on, emit } from '../events.js';
import initMenu from './menu.js';
import './col-group.js';

export default function initUI() {
  state.get([resource]).map(displayResource);
  state.get([action]).map(displayAction);
  state.get([building]).map(displayBuilding);
  state.get([task]).map(displayTask);
  initMenu();

  emit(['ui-init']);

  // bind section visibility to state
  // `act`, 'bld', and 'tsk' are global HTML ids from index.html
  act.hidden = !state.get([data, 0, actionVisible]);
  bld.hidden = !state.get([data, 0, buildingVisible]);
  tsk.hidden = !state.get([data, 0, taskVisible]);

  on([data, 0, actionVisible], value => {
    act.hidden = !value;
  });
  on([data, 0, buildingVisible], value => {
    console.log('bld.hidden =', !value);
    bld.hidden = !value;
  });
  on([data, 0, taskVisible], value => {
    tsk.hidden = !value;
  });

  // NOTE: needs to be kept in-sync with CSS media queries
  const smallscreenMediaQuery = matchMedia('(max-width: 47.375rem)');
  const mediumscreenMediaQuery = matchMedia('(max-width: 71.25rem)');
  const fullscreenMediaQuery = matchMedia('(min-width: 71.26rem)');

  smallscreenMediaQuery.addListener(evt => {
    if (!evt.matches) {
      return;
    }

    state.set([data, 0, actionVisible, true]);
    state.set([data, 0, buildingVisible, false]);
    state.set([data, 0, taskVisible, false]);
  });
  mediumscreenMediaQuery.addListener(evt => {
    if (!evt.matches) {
      return;
    }

    state.set([data, 0, actionVisible, true]);
    state.set([data, 0, buildingVisible, true]);
    state.set([data, 0, taskVisible, false]);
  });
  fullscreenMediaQuery.addListener(evt => {
    if (!evt.matches) {
      return;
    }

    state.set([data, 0, actionVisible, true]);
    state.set([data, 0, buildingVisible, true]);
    state.set([data, 0, taskVisible, true]);
  });

  // display attacking army info
  const attackingArmy = state.get([data, 0, attackArmy]);
  if (attackingArmy?.length) {
    // `atkArmy` is a global HTML id from index.html
    atkArmy.innerHTML = displayArmy(attackingArmy);
  }

  // bind attack timer visibility
  on([data, 0, attackTimer], value => {
    // `atk` is a global HTML id from index.html
    atk.hidden = value < 0;
    if (value < 0) {
      return;
    }

    const mins = value / 60 | 0;
    const secs = value - mins * 60 | 0;
    atkTimer.innerHTML = `${mins}:${(''+secs).padStart(2, 0)}`;
  });

  // bind attack army to tooltip
  on([data, 0, attackArmy], value => {
    atkArmy.innerHTML = displayArmy(value);
  });
}