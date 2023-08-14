import { emit } from './libs/kontra.js';
import actions from './data/actions.js';
import buildings from './data/buildings.js';
import resources from './data/resources.js';

// 0 = resource
// 1 = building
// 2 = action
const state = {
  _state: [
    resources,
    buildings,
    actions
  ],
  get(path) {
    let curr = this._state;
    path.map(index => {
      curr = curr[index]
    });
    return curr;
  },
  set(path) {
    const p = [...path];  // clone
    const value = p.pop();
    const index = p.pop();
    const obj = this.get(p);
    obj[index] = (obj[index] ?? 0) + value;
    emit([...p, index].join(','), obj[index]);
  }
};
export default state;
window.state = state;