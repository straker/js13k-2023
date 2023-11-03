import state from '../data/state.js';
import initCredits from './credits.js';
import Dialog from './dialog.js';
import { saveGame } from '../utils.js';

export default function initMenu() {
  // all global variables are from the menu
  const menuDialog = new Dialog({
    id: 'menu',
    cancel: 'Close',
    head: 'Menu',
    body: `
      <button id="save">Save Game</button>
      <button id="reset">Reset Game</button>
      <button id="importS">Import Save</button>
      <button id="exportS">Export Save</button>
      <button id="sound">Sound</button>
      <button id="credits">Credits</button>
    `
  });

  menu.addEventListener('click', () => {
    menuDialog.open();
  })

  // save game
  const saveDialog = new Dialog({
    cancel: 'Close',
    head: 'Game saved successfully'
  });
  save.addEventListener('click', () => {
    saveGame();
    saveDialog.open();
  });

  // reset game
  const resetDialog = new Dialog({
    confirm: 'Reset',
    cancel: 'Cancel',
    head: 'Reset',
    body: '<p>Are you sure you want to reset the game? All saved data will be lost.</p> '
  });
  reset.addEventListener('click', () => {
    resetDialog.open(() => {
      state.reset();
      window.location.reload();
    });
  });

  // import save
  const importDialog = new Dialog({
    confirm: 'Import',
    cancel: 'Cancel',
    head: 'Import Save',
    body: `
      <p>Are you sure you want to import a save? If the save data is invalid all save data will be lost.</p>
      <p><textarea type="text" rows="10"></textarea></p>
    `
  });
  importS.addEventListener('click', () => {
    const button = importDialog.foot.querySelector('button.ok');
    button.setAttribute('aria-disabled', true);

    const textArea = importDialog.body.querySelector('textarea');
    textArea.value = '';
    textArea.addEventListener('input', () => {
      if (textArea.value) {
        button.removeAttribute('aria-disabled');
      }
    });

    importDialog.open(() => {
      state.import(textArea.value);
      window.location.reload();
    });
  });

  // export save
  const exportDialog = new Dialog({
    cancel: 'Close',
    head: 'Export Save',
    body: '<textarea type="text" onclick="this.focus();this.select()" readonly rows="10"></textarea>'
  });
  exportS.addEventListener('click', () => {
    const textArea = exportDialog.body.querySelector('textarea');
    textArea.value = state.export();
    exportDialog.open();
    textArea.focus();
    textArea.select();
  });

  // show credits
  initCredits();
}