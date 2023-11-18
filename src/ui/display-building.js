import state, { resource, building, data } from '../data/state.js';
import {
  name,
  description,
  cost,
  effects,
  prereq,
  researchCost,
  unlocked,
  built,
  visible,
  disabled
} from '../data/buildings.js';
import resources, {
  name as resourceName,
  icon,
  amount,
  research
} from '../data/resources.js';
import { buildingVisible } from '../data/game-data.js';
import { on } from '../events.js';
import {
  html,
  showWhenPrereqMet,
  displayCost,
  canAfford
} from '../utils.js';
import UnlockableButton from './unlockable-button.js';

/**
 * Display a building the player can build.
 *
 * @param {*[]} data - Building data.
 * @param {Number} index - The current item of the data.
 */
export default function displayBuilding(data, index) {
  // buildings start disabled
  data[disabled] ??= true;

  const { container, button }  = new BuildingButton(
    data,
    index,
    building,
    name,
    description,
    cost,
    effects,
    prereq,
    researchCost,
    unlocked,
    visible,
    disabled
  );
  const builtDiv = html(`<span class="btn-r"><span class="sr-only">Built:</span><span>${data[built] ?? 0}</span></span>`);

  button.appendChild(builtDiv);

  // show building heading when first building is shown
  if (index === 0) {
    on([building, 0, visible], (value) => {
      state.set([data, 0, buildingVisible, true]);
    });
  }

  // bind built state to built number
  on([building, index, built], (value) => {
    builtDiv.textContent = value;
  });

  // `bldG` is a global HTML id from index.html
  bldG.appendChild(container);
}

class BuildingButton extends UnlockableButton {
  constructor(...args) {
    super(...args);
  }

  whenClicked(data, index) {
    state.add([building, index, built, 1]);
    data[effects].map(effect => state.add(effect));
  }

  canAfford(data) {
    return canAfford(data[cost]);
  }

  enableWhenCanAfford(data, index) {
    data[cost].map(([resourceIndex]) => {
      on([resource, resourceIndex, amount], () => {
        if (!data[visible]) return;

        let isDisabled = true;
        if (canAfford(data[cost])) {
          isDisabled = false;
        }

        state.set([building, index, disabled, isDisabled]);
      });
    });
  }
}