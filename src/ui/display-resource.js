import { resource } from '../data/state.js';
import {
  name,
  icon,
  prereq,
  amount,
  max,
  visible,
  skeletons
} from '../data/resources.js';
import { on } from '../events.js';
import { html, showWhenPrereqMet } from '../utils.js';

/**
 * Display the amount of a resource the player has.
 *
 * @param {*[]} data - Resource data.
 * @param {Number} index - The current item of the data.
 */
export default function displayResource(data, index) {
  const div = html(`<div title="${data[name]}"></div>`);
  setText(div, data);
  div.hidden = !data[visible];
  showWhenPrereqMet(data, prereq, div, resource, index, visible);

  // bind resource state to the display value
  on([resource, index, amount], () => {
    setText(div, data);
  });
  on([resource, index, max], () => {
    setText(div, data);
  });

  // `pop` and `resG` are global HTML ids from index.html
  (index === skeletons ? pop : resG).appendChild(div);
}

function setText(div, data) {
  div.innerHTML = `<span class="icon">${data[icon]}</span>${data[amount] ?? 0}${!data[max] ? '' : `/${data[max]}`}`;
}