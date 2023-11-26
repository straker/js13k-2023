import { clamp } from '../libs/kontra.js';
import { on } from '../events.js';
import state, { data } from '../data/state.js';
import { actionVisible, buildingVisible, taskVisible, currentView } from '../data/game-data.js';
import { html, rovingTabindex } from '../utils.js';

let groupId = 0;
const idMap = {
  act: actionVisible,
  bld: buildingVisible,
  tsk: taskVisible
};

/**
 * A responsive and accessible column group with a a heading and section of buttons/inputs. When there isn't enough room the heading turns into a tabpanel. The section is a grid in order to support a counted list of roving tabindex elements.
 * @see https://www.w3.org/WAI/ARIA/apg/patterns/grid/examples/layout-grids/
 */
export class ColGroup extends HTMLElement {
  connectedCallback() {
    const name = this.getAttribute('name');
    const grid = this.querySelector('section');

    // create the responsive tabpanel
    const tabGroup = html(`
      <div class="hG">
        <h2 class="h" id="${this.id}T">${name}</h2>
        <div class="h" role="tablist">
          <div class="navB actB">
            <button role="tab" aria-selected="false" aria-controls="act" tabindex="-1">Actions</button>
          </div>
          <div class="navB bldB">
            <span aria-hidden="true">|</span>
            <button role="tab" aria-selected="false" aria-controls="bld" tabindex="-1">Buildings</button>
          </div>
          <div class="navB tskB">
            <span aria-hidden="true">|</span>
            <button role="tab" aria-selected="false" aria-controls="tsk" tabindex="-1">Tasks</button>
          </div>
        </div>
      </div>
    `);
    const tablist = tabGroup.querySelector('[role="tablist"]');
    this.insertBefore(tabGroup, grid);

    rovingTabindex(
      tabGroup.querySelector('[role="tablist"]'),
      '[role="tab"]',
      {
        dir: 'horizontal',
        dynamic: true,
        selectCallback(index, curElm, prevElm) {
          // automatic tab selection with handling multiple
          // tablists as a single tablist
          const target = curElm.getAttribute('aria-controls');
          const tablists = document.querySelectorAll('[role="tablist"]');
          tablists.forEach(elm => {
            elm.selectChild(index, false);
          });

          document
            .querySelectorAll('.h [role="tab"][aria-selected="true"]')
            .forEach(elm => {
              elm.setAttribute('aria-selected', false);
            });

          const curTab = document.querySelector(`#${target} .h [role="tab"][aria-controls="${target}"]`);
          curTab.setAttribute('aria-selected', true);

          state.set([data, 0, currentView, target]);
          document
            .querySelectorAll(`[role="tab"][aria-controls=${target}]`)
            .forEach(elm => elm.classList.remove('new'));
          setTimeout(() => curTab.focus(), 10);
        }
      }
    );

    on(['ui-init'], () => {
      // select current view
      const tabs = Array.from(tablist.querySelectorAll('[role="tab"]'));
      tablist.selectChild(
        // TODO: this focuses the element due to the callback from above, which we want to select the correct tab from all tablists but not focus the current element
        tabs.findIndex(elm => elm.getAttribute('aria-controls') === state.get([data, 0, currentView]))
      );

      // create the grid
      const children = Array.from(grid.children);
      grid.setAttribute('role', 'grid');
      grid.setAttribute('aria-labelledby', `${this.id}T`);

      if (this.id !== 'tsk') {
        children.forEach(child => {
          const row = html(`
            <div role="row">
              <div role="gridcell" aria-colindex="1"></div>
            </div>
          `);

          row.querySelector('[role="gridcell"]').appendChild(child);
          grid.appendChild(row);
        });
      }

      // update the aria-rowcount and aria-rowindex of the dynamic grid
      function updateGrid() {
        const visibleChildren = children.filter(child => !child.querySelector('button, input')?.hidden);
        grid.setAttribute('aria-rowcount', visibleChildren.length);
        visibleChildren.forEach((child, index) => {
          child.closest('[role="row"]').setAttribute('aria-rowindex', index + 1);
        });
      }
      updateGrid();

      rovingTabindex(
        grid,
        'button, input',
        {
          focus: true,
          dynamic: true,
          mutationCallback(elm) {
            updateGrid();
          }
        }
      )
    });
  }

  focus() {
    this.curElm.focus();
  }

  // hide(cb) {
  //   if (this.hidden) return;

  //   this.addEventListener(
  //     'transitionend',
  //     evt => {
  //       state.set([data, 0, idMap[this.id], false]);
  //       this.classList.remove('hidden');
  //       cb?.();
  //     },
  //     { once: true }
  //   );
  //   this.classList.add('hidden');
  // }

  // show() {
  //   this.classList.add('hidden');
  //   state.set([data, 0, idMap[this.id], true]);
  //   setTimeout(() => {
  //     this.curElm.focus();
  //     this.classList.remove('hidden')
  //   }, 100);
  // }
}

customElements.define('col-group', ColGroup);