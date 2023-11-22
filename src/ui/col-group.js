import { clamp } from '../libs/kontra.js';
import { on } from '../events.js';
import state, { data } from '../data/state.js';
import { actionVisible, buildingVisible, taskVisible, currentView } from '../data/game-data.js';

let groupId = 0;
const idMap = {
  act: actionVisible,
  bld: buildingVisible,
  tsk: taskVisible
};

export class ColGroup extends HTMLElement {
  connectedCallback() {
    this.setAttribute('role', 'group');
    this.groupId = groupId++;
    this.countId = 0;

    this.head = this.querySelector('h2');
    const headId = this.head.id ?? `head-${groupId}`;
    this.head.setAttribute('id', this.head.id);
    this.setAttribute('aria-labelledby', headId);

    // get all buttons / inputs for roving tabindex
    on(['ui-init'], () => {
      this.elms = Array.from(this.querySelectorAll('section :is(button, input)'));
      this.elms.forEach((child, index) => {
        const childId = `child-${this.groupId}-${index}`;
        child.setAttribute('id', childId);
        child.setAttribute('tabindex', index === 0 ? 0 : -1);

        if (index === 0) {
          this.curIndex = 0;
          this.curElm = child;
          this.setAttribute('aria-activedescendant', childId);
        }
      });
    });

    // hide this group and show another
    this.addEventListener('click', evt => {
      const target = evt.target.getAttribute('data-t');
      if (!target) {
        return;
      }

      state.set([data, 0, currentView, target]);
      document
        .querySelectorAll(`[data-t=${target}]`)
        .forEach(elm => elm.classList.remove('new'));
    });

    // handle moving roving tabindex
    this.addEventListener('keydown', (evt) => {
      if (!['ArrowUp', 'ArrowDown'].includes(evt.code)) {
        return;
      }

      evt.preventDefault();
      this.curElm.setAttribute('tabindex', -1);

      if (evt.code === 'ArrowUp') {
        this.curIndex--;
      }
      else if (evt.code === 'ArrowDown') {
        this.curIndex++;
      }

      this.curIndex = clamp(0, this.elms.length - 1, this.curIndex);
      this.curElm = this.elms[this.curIndex];
      this.curElm.setAttribute('tabindex', 0);
      this.setAttribute('aria-activedescendant', this.curElm.id);
      this.curElm.focus();
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