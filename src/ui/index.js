import resources from '../data/resources.js';
import buildings from '../data/buildings.js';
import actions, { assignable} from '../data/actions.js';
import displayResource from './display-resource.js';
import displayBuilding from './display-building.js';
import displayManualAction from './display-manual-action.js';
import displayAutoAction from './display-auto-action.js';

export default function initUI() {
  resources.map(displayResource);
  buildings.map(displayBuilding);

  actions.map((actionData, index) => {
    if (actionData[assignable] === 1) {
      displayManualAction(actionData, index);
    }
    else {
      displayAutoAction(actionData, index);
    }
  });
}