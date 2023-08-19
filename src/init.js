import { initActions } from './data/actions.js';
import { initBuildings } from './data/buildings.js';
import { initResources } from './data/resources.js';
import { initTasks } from './data/tasks.js';
import { initState } from './data/state.js';
import initUI from './ui/index.js';

export default function init() {
  initResources();
  initActions();
  initBuildings();
  initTasks();
  initState();

  initUI();
}