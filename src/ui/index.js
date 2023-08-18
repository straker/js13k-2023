import { on } from '../events.js';
import resources, {
  name as resourceName,
  prereq as resourcePrereq,
  amount,
  max,
  visible as resourceVisible,
  skeleton
} from '../data/resources.js';
import buildings, {
  name as buildingName,
  description,
  cost,
  effect as buildingEffect,
  prereq as buildingPrereq,
  built,
  visible as buildingVisible
} from '../data/buildings.js';
import actions, {
  name as actionName,
  clicked,
  effect as actionEffect,
  prereq as actionPrereq,
  assignable,
  assigned,
  visible as actionVisible,
  disabled,
  cooldown,
  timer,
  idle
} from '../data/actions.js';
import state, { resource, building, action } from '../data/state.js';

export default function initUI() {
  resources.map((resourceData, index) => {
    const display = document.createElement('div');
    display.textContent = resourceData[resourceName] + ': ' + 0;
    on([resource, index, amount], (value) => {
      display.textContent = resourceData[resourceName] + ': ' + value;
    });
    // if resource has prereqs then we don't show initially
    display.hidden = resourceData[resourcePrereq];

    // display if prereq is met
    const prereqs = (resourceData[resourcePrereq] ?? [])
    prereqs.map(prereq => {
      const p = [...prereq];  // clone
      const value = p.pop();
      on(p, (curValue) => {
        if (curValue >= value) {
          display.hidden = false;
          state.set([resource, index, resourceVisible, true]);
        }
      });
    });

    resourceGroup.appendChild(display);
  });

  actions.map((actionData, index) => {
    let button;
    let div;

    // manual click action
    if (actionData[assignable] === 1) {
      button = document.createElement('button');
      button.textContent = actionData[actionName];
      button.addEventListener('click', (e) => {
        if (button.getAttribute('aria-disabled') === 'true') {
          return e.preventDefault();
        }

        const clickCount = (actionData[clicked] ?? 0) + 1;
        state.set([action, index, clicked, clickCount]);
        state.set(actionData[actionEffect]);
        state.set([action, index, disabled, true]);
        state.set([action, index, timer, actionData[cooldown]]);
      });

      on([action, index, disabled], (value) => {
        button.setAttribute('aria-disabled', value);
      });

      const cooldownDiv = document.createElement('div');
      cooldownDiv.classList.add('cooldown');
      button.appendChild(cooldownDiv);

      on([action, index, timer], (value) => {
        cooldownDiv.style.width = value / actionData[cooldown] * 100 + '%';
      });

      actionGroup.appendChild(button);
    }
    // auto action
    else {
      div = document.createElement('div');
      div.textContent = actionData[actionName];
      div.hidden = true;
      autoActionNameGroup.appendChild(div);

      button = document.createElement('input');
      button.setAttribute('type', 'number');
      button.setAttribute('min', 0);
      button.setAttribute('max', 0);
      button.setAttribute('value', 0);
      button.addEventListener('keydown', (e) => e.preventDefault());
      on([action, idle, assigned], (value) => {
        button.setAttribute('max', Math.min(
          value,
          state.get([action, index, max], 0)
        ));
      });
      on([action, index, assignable], (value) => {
        button.setAttribute('max', Math.min(
          value,
          state.get([action, idle, assigned], 0)
        ));
      });

      // special action
      if (index === idle) {
        button.setAttribute('readonly', true);
        on([resource, skeleton, amount], (curValue, diff) => {
          state.set([action, index, assigned, diff])
        });
        on([action, index, assigned], (curValue) => {
          button.value = curValue;
        });
      }
      else {
        button.addEventListener('change', (e) => {
          const numAssigned = state.get([action, index, assigned]) ?? 0;
          const value = +button.value;
          const diff = value - numAssigned;

          // decremented value and increase idle skeletons
          if (diff < 0) {
            state.set([action, idle, assigned, -diff])
          }
          // incremented value and decrease idle skeletons
          else if (diff > 0) {
            state.set([action, idle, assigned, -diff])
          }

          state.set([action, index, assigned, diff])
        });
      }

      autoActionInputGroup.appendChild(button);
    }

    // if action has prereqs then we don't show initially
    button.hidden = actionData[actionPrereq];

    // display if prereq is met
    const prereqs = (actionData[actionPrereq] ?? [])
    const prereqsMet = prereqs.map(() => 0);
    prereqs.map((prereq, i) => {
      const p = [...prereq];  // clone
      const value = p.pop();
      on(p, (curValue) => {
        if (curValue >= value) {
          prereqsMet[i] = 1;
          if (prereqsMet.every(v => v === 1)) {
            button.hidden = false;
            if (div) div.hidden = false;
            state.set([action, index, actionVisible, true]);
          }
        }
      });
    });
  });

  buildings.map((buildingData, index) => {
    const button = document.createElement('button');
    button.textContent = buildingData[buildingName];
    button.setAttribute('title', buildingData[description]);
    button.addEventListener('click', (e) => {
      if (button.getAttribute('aria-disabled') === 'true') {
        return e.preventDefault();
      }

      const buildCount = (buildingData[clicked] ?? 0) + 1;
      state.set([building, index, built, buildCount]);
      state.set(buildingData[buildingEffect]);
      buildingData[cost].map(([index, value]) => {
        state.set([resource, index, amount, -value]);
      });
    });
    buildingData[cost].map(([index]) => {
      on([resource, index, amount], () => {
        let disabled = true;
        if (
          buildingData[cost].every(([i, value]) => {
            return state.get([resource, i, amount]) > value
          })
        ) {
          disabled = false;
        }

        button.setAttribute('aria-disabled', disabled);
      });
    });

    // if action has prereqs then we don't show initially
    button.hidden = buildingData[buildingPrereq];

    // display if prereq is met
    const prereqs = (buildingData[buildingPrereq] ?? [])
    const prereqsMet = prereqs.map(() => 0);
    prereqs.map((prereq, i) => {
      const p = [...prereq];  // clone
      const value = p.pop();
      on(p, (curValue) => {
        if (curValue >= value) {
          prereqsMet[i] = 1;
          if (prereqsMet.every(v => v === 1)) {
            button.hidden = false;
            state.set([building, index, buildingVisible, true]);
          }
        }
      });
    });

    buildingGroup.appendChild(button);
  });
}