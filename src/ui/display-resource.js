import { resource } from '../data/state.js';
import {
  name,
  icon,
  prereq,
  amount,
  max,
  visible,
  change,
  wood,
  stone,
  skeletons,
  planks,
  research,
  blocks,
  charcoal,
  ironOre,
  iron,
  tools,
  swords,
  bows
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
  const div = html(`<div class="res" title="${data[name]}"></div>`);
  setText(div, data, index);
  div.hidden = !data[visible];
  showWhenPrereqMet(data, prereq, div, resource, index, visible);

  // bind resource state to the display value
  on([resource, index, amount], () => {
    setText(div, data, index);
  });
  on([resource, index, max], () => {
    setText(div, data, index);
  });
  on([resource, index, change], () => {
    setText(div, data, index);
  });

  // `wG`, `sG`, `iG`, `tG`, `pop`, and `mG` are global HTML
  // ids from index.html
  (
    [wood, planks].includes(index)
      ? wG
      : [stone, blocks].includes(index)
      ? sG
      : [charcoal, ironOre, iron].includes(index)
      ? iG
      : [tools, swords, bows].includes(index)
      ? tG
      : index == skeletons
      ? pop
      : mG
  ).appendChild(div);
}

function setText(div, data, index) {
  let text = `<span class="icon">${data[icon]}</span><span class="amount">${getTextNumber(data[amount] ?? 0)}${!data[max] ? '' : `/${getTextNumber(data[max])}`}</span>`;

  // research can only ever increase
  if (index !== research) {
    const trend = data[change] ?? 0;
    text += `<span class="trend ${trend > 0
      ? 'up'
      : trend < 0
      ? 'down'
      : ''
    }">${trend > 0 ? '&#9650;' : '&#9660;'}</span>`;
  }

  div.innerHTML = text;
}

function getTextNumber(value) {
  return value < 1e3
    ? value
    : value < 1e6
    ? (value / 1e3).toFixed(1) + 'K'
    : (value / 1e6).toFixed(1) + 'M'
}