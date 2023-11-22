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
  taskVisible,
  currentView
} from '../data/game-data.js';
import { displayArmy } from '../utils.js';
import { on, emit } from '../events.js';
import initMenu from './menu.js';
import './col-group.js';
import {
  SMALL_MEDIA_QUERY,
  MEDIUM_MEDIA_QUERY,
  LARGE_MEDIA_QUERY
} from '../constants.js';

export default function initUI() {
  state.get([resource]).map(displayResource);
  state.get([action]).map(displayAction);
  state.get([building]).map(displayBuilding);
  state.get([task]).map(displayTask);
  initMenu();

  emit(['ui-init']);

  if (state.get([data, 0, actionVisible])) {
    document.body.classList.add('actV');
  }
  else {
    on([data, 0, actionVisible], value => {
      document.body.classList.add('actV');
    }, { once: true });
  }

  if (state.get([data, 0, buildingVisible])) {
    document.body.classList.add('bldV');
  }
  else {
    on([data, 0, buildingVisible], value => {
      document.body.classList.add('bldV');
    }, { once: true });
  }

  if (state.get([data, 0, taskVisible])) {
    document.body.classList.add('tskV');
  }
  else {
    on([data, 0, taskVisible], value => {
      document.body.classList.add('tskV');
    }, { once: true });
  }

  const curView = state.get([data, 0, currentView]);
  if (curView) {
    document.body.classList.add(curView + 'S');
  }

  // bind the body class to the current visible view
  on([data, 0, currentView], value => {
    document.body.classList.remove('actS', 'bldS', 'tskS');
    document.body.classList.add(value + 'S');
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