import { html } from '../utils.js';
import loop from '../loop.js';

export default class Dialog {
  constructor({
    id,
    head = '',
    body = '',
    confirm,
    cancel
  } = {}) {
    const dialog = this.dialog = html(`
      <dialog ${id ? `id="${id}"` : ''} aria-label="${head}">
        <div class="head"><h2>${head}</h2></div>
        <div class="body">${body}</div>
        <div class="foot"></div>
      </dialog>
    `);
    this.foot = dialog.querySelector('.foot');
    this.head = dialog.querySelector('.head');
    this.body = dialog.querySelector('.body');

    if (cancel) {
      const cancelButton = html(`<button>${cancel}</button>`);
      cancelButton.addEventListener('click', () => this.onClose(0));
      this.foot.appendChild(cancelButton);
    }

    if (confirm) {
      const confirmButton = html(`<button class="ok">${confirm}</button>`);
      confirmButton.addEventListener('click', (e) => this.onClose(1, e));
      this.foot.appendChild(confirmButton);
    }

    document.body.appendChild(dialog);
  }

  open(text, callback) {
    loop.stop();
    this.prevElm = document.activeElement;

    if (typeof text === 'function') {
      callback = text;
      text = null;
    }

    if (text) {
      this.body.innerHTML = `<p>${text}</p>`;
    }

    this.dialog.showModal();
    this._callback = callback;
  }

  close(how, event) {
    if (event?.target.hasAttribute('aria-disabled')) {
      return;
    }


    this.dialog.close();
    this.prevElm.focus();

    // only start the loop if all dialogs are closed
    if(!document.querySelector('dialog[open]')) {
      loop.start();
    }

    if (how) {
      this._callback?.();
    }
  }

  onClose(how, event) {
    this.close(how, event);
  }
}