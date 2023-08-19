import resources from '../data/resources.js';
import buildings from '../data/buildings.js';
import actions from '../data/actions.js';
import tasks from '../data/tasks.js';
import displayResource from './display-resource.js';
import displayBuilding from './display-building.js';
import displayAction from './display-action.js';
import displayTask from './display-task.js';

export default function initUI() {
  resources.map(displayResource);
  buildings.map(displayBuilding);
  actions.map(displayAction);
  tasks.map(displayTask);
}