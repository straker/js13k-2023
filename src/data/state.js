import { setStoreItem, getStoreItem } from '../libs/kontra.js';
import { traversePath } from '../utils.js';
import { emit } from '../events.js';
import { SAVE_KEY } from '../constants.js';
import actions from './actions.js';
import buildings from './buildings.js';
import resources from './resources.js';
import tasks from './tasks.js';

// indices
export const resource = 0;
export const building = 1;
export const action = 2;
export const task = 3;

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
    setStoreItem(SAVE_KEY, this._state);
  }
};
export default state;
window.state = state;

export function initState() {
  let initialState = getStoreItem(SAVE_KEY) ?? [
    resources,
    buildings,
    actions,
    tasks
  ];

  state._state = initialState;
}