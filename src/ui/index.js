import { on } from '../events.js';
import resources, {
  name,
  prereq as resourcePrereq,
  amount,
  max
} from '../data/resources.js';
import buildings, {
  cost,
  state as buildingState,
  prereq as buildingPrereq,
  built
} from '../data/buildings.js';
import actions, {
  clicked,
  state as actionState,
  prereq as actionPrereq
} from '../data/actions.js';
import state, { resource, building, action } from '../data/state.js';

export default function initUI() {
  resources.map((resourceData, index) => {
    const display = document.createElement('div');
    display.textContent = resourceData[name] + ': ' + 0;
    on([resource, index, amount], (value) => {
      display.textContent = resourceData[name] + ': ' + value;
    });
    // if resource has prereqs then we don't show initially
    display.hidden = resourceData[resourcePrereq];

    document.body.appendChild(display);
  });

  actions.map((actionData, index) => {
    const button = document.createElement('button');
    button.textContent = actionData[0];
    button.addEventListener('click', () => {
      const buildCount = (actionData[built] ?? 0) + 1;
      state.set([action, index, built, buildCount]);
      state.set(actionData[actionState]);
    });
    // if action has prereqs then we don't show initially
    button.hidden = actionData[actionPrereq];

    // display if prereq is met
    const prereqs = (actionData[actionPrereq] ?? [])
    prereqs.map(prereq => {
      const p = [...prereq];  // clone
      const value = p.pop();
      on(p, (curValue) => {
        if (curValue >= value) {
          button.hidden = false;
        }
      });
    });

    document.body.appendChild(button);
  });

  buildings.map((buildingData, index) => {
    const button = document.createElement('button');
    button.textContent = buildingData[0];
    button.addEventListener('click', () => {
      const clickCount = (buildingData[clicked] ?? 0) + 1;
      state.set([building, index, clicked, clickCount]);
      state.set(buildingData[buildingState]);
      buildingData[cost].map(([index, value]) => {
        state.set([resource, index, amount, -value]);
      });
    });
    // if action has prereqs then we don't show initially
    button.hidden = buildingData[buildingPrereq];

    // display if prereq is met
    const prereqs = (buildingData[buildingPrereq] ?? [])
    prereqs.map(prereq => {
      const p = [...prereq];  // clone
      const value = p.pop();
      on(p, (curValue) => {
        if (curValue >= value) {
          button.hidden = false;
        }
      });
    });

    document.body.appendChild(button);
  });
}