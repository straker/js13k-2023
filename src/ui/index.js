import state, { resource, action, building, task } from '../data/state.js';
import displayResource from './display-resource.js';
import displayBuilding from './display-building.js';
import displayAction from './display-action.js';
import displayTask from './display-task.js';

export default function initUI() {
  state.get([resource]).map(displayResource);
  state.get([action]).map(displayAction);
  state.get([building]).map(displayBuilding);
  state.get([task]).map(displayTask);
}