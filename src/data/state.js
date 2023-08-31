import { setStoreItem, getStoreItem } from '../libs/kontra.js';
import { traversePath } from '../utils.js';
import { emit } from '../events.js';
import { SAVE_KEY } from '../constants.js';
import resources, {
  max,
  visible as resourceVisible,
  amount,
  change
} from './resources.js';
import actions, {
  unlocked as actionUnlocked,
  visible as actionVisible,
  clicked,
  disabled as actionDisabled,
  timer
} from './actions.js';
import buildings, {
  unlocked as buildingUnlocked,
  built,
  visible as buildingVisible,
  disabled as buildingDisabled
} from './buildings.js';
import tasks, {
  assignable,
  assigned,
  visible as taskVisible
} from './tasks.js';
import armies, {
  trained
} from './armies.js';

// indices
export const resource = 0;
export const action = 1;
export const building = 2;
export const task = 3;
export const army = 4;

const state = {
  get(path, defaultValue) {
    const p = [...path];
    const index = p.pop();
    const obj = traversePath(this._state, p);
    return obj[index] ?? defaultValue;
  },
  set(path, max) {
    const p = [...path];  // clone
    const value = p.pop();
    const index = p.pop();
    const obj = this.get(p);
    if (typeof value === 'number') {
      obj[index] = Math.min((obj[index] ?? 0) + value, max ?? Infinity);
    }
    else if (typeof value === 'boolean') {
      obj[index] = value;
    }
    emit([...p, index], obj[index], value);
    return obj[index];
  },
  save() {
    // limit what props are saved to those only changed by the
    // user
    const saveState = [
      getSaveState(resources, [max, resourceVisible, amount, change]),
      getSaveState(actions, [actionUnlocked, actionVisible, clicked, actionDisabled, timer]),
      getSaveState(buildings, [buildingUnlocked, built, buildingVisible, buildingDisabled]),
      getSaveState(tasks, [assignable, assigned, taskVisible]),
      // TODO: may need to save upgrades
      getSaveState(armies, [trained])
    ];

    setStoreItem(SAVE_KEY, saveState);
  },
  load(initialState) {
    const saveState = getStoreItem(SAVE_KEY);
    if (!saveState) {
      return initialState;
    }

    saveState.map((stateItem, stateIndex) => {
      stateItem.map((obj, objIndex) => {
        Object.entries(obj).map(([key, value]) => {
          initialState[stateIndex][objIndex][key] = value;
        });
      });
    });

    return initialState;
  }
};
export default state;
window.state = state;

export function initState() {
  const initialState = [
    resources,
    actions,
    buildings,
    tasks,
    armies
  ];

  state._state = state.load(initialState);
}

function getSaveState(data, filterIndices) {
  return data.map(item => {
    return item.reduce((obj, value, index) => {
      if (filterIndices.includes(index)) {
        obj[index] = value;
      }

      return obj;
    }, {})
  });
}