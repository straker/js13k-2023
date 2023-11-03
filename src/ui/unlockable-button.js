import state, { resource } from '../data/state.js';
import resources, {
  name as resourceName,
  icon,
  amount,
  research
} from '../data/resources.js';
import { on } from '../events.js';
import {
  html,
  showWhenPrereqMet,
  displayCost
} from '../utils.js';
import Dialog from './dialog.js';

const lockedDialog = new Dialog({
  confirm: 'OK'
});
const unlockDialog = new Dialog({
  confirm: 'OK',
  cancel: 'Cancel'
});

export default class UnlockableButton {
  constructor(
    data,
    index,
    stateIndex,
    name,
    description,
    cost,
    effects,
    prereq,
    researchCost,
    unlocked,
    visible,
    disabled
  ) {
    data[cost] ??= [];
    const buttonName = data[name];
    let locked = data[researchCost] && !data[unlocked];

    const container = html(`
      <div>
        <button class="tipC ${locked ? 'locked' : ''}">
          ${locked
            ? '<span class="lock"><img width=20 height=20 src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAAApgAAAKYB3X3/OAAAABl0RVh0U29mdHdhcmUAd3d3Lmlua3NjYXBlLm9yZ5vuPBoAAAM5SURBVEiJpZVPaBR3FMe/b2bM/nFnM9l1/2m2m4Q0tYSENIKwFQ8x4EWIFg8VpBeRHkorrbmk2iAS257SS2nIoYLgQYpGgv9QL0IU0R4CXrSHbGSpu8kmu9vdZNdxd3bm9bBSstnZ3YF+YWDmvd/7ft68H/MbYmY0ExEp7R3e7yVRGpEkKQAAlUolVdErj/L/ZH5m5lzT+mYAm23nMXd7+6/HPz+92x/YI6ylkgAAf2A31lIJY+6P35Mb+fw3pVJxvqEJM5teTqfz1OBwND05Nctd3X2pDo9vweVyT7pc7skOj2+hq7svNTk1y4PD0bTT6TzVyMc8CAQDwXDi/MUZVpRdMQBDJmuGFGVX7PzFGQ4EwwkAQcsAr9c/Pz4xbXSGe5IAeht2B/R2hnuS4xPThtfrnzdbI5iNTRDFAV3XqLCZn2PmpSbjXSps5ud0XSNBFAdMvbYHiMgty4pjOfaymMtl7jfcvPfK5TL3l2Mvi7KsOIjI3RIAoDsYCksriXgRQKwVAEBsJREvBkNhCUC3FQABTEaL72OrqmuZqrW1kswKmNEGJusEJhtzvXkjgBB//coloER9EflyV6e8qhswGnn7vXY5+fdfMmgHYDKROsDIfv+PJ0Z9wv6PFcBu/xQOu6WXeLqYNn67WvgOwBdNAeo7/eCXRyPVB0UBJNMp1ujhkwR6Iy6BiEZavgHMN76pDkVDAAAC1fm1bu+9nr9Yw7eXFgEAv5wbRvQT/3+5BwuJhnWm3WY3yshulGtiZ6YW4VD2waHsw9mfFmty61kV61nVOuDW41XcerxaEyMSYBg6DEOHJFmfouWVF77uR3ptGZn1ZfzwVX9NzqPY4FFs/w+wJ+CAQBoADSGfoyY3NhrB2GjEtM7yJvd/2AFnWwEVvXpvVXUAXWftow9c1Ra3nEeiSHh240hTM003SttjdSPSdON5Ml1CdMADaJrlTq/fe11S1cqf2+N1P30iahvaq9x1OaQDxw4G7WOHe6i3zwcSas8yZmApnsfNB3H12p1YPpMrPXmzUjjJzOWmgC0g2eu2f9YVdp55+7YS0kGGJAkiM3OpbJQ1zSiLAuKprHpFVfXbzLxp5vMvAzOtdKGXnXcAAAAASUVORK5CYII="/></span>' + displayCost(resources[research], data[researchCost])
            : ''
          }
          <span>${buttonName}</span>
        </button>
        <div class="tip t">
          <b>${buttonName}</b>
          <span class="cost">
            ${data[cost].map(([resourceIndex, value]) => {
              return displayCost(resources[resourceIndex], value);
            }).join('')}
          </span>
          <p>${data[description]}</p>
          ${locked
            ? `<em>Requires ${data[researchCost]} Research to unlock</em>`
            : ''
          }
        </div>
      </div>
    `);
    const button = container.firstElementChild;
    button.hidden = !data[visible];
    button.setAttribute('aria-disabled', !!data[disabled]);
    showWhenPrereqMet(data, prereq, button, stateIndex, index, visible, () => {
      // player can always click a button that needs research
      if (!locked) {
        state.set([stateIndex, index, disabled, !this.canAfford(data)]);
      }
    });

    // bind disabled state to the aria-disabled attribute
    on([stateIndex, index, disabled], (value) => {
      button.setAttribute('aria-disabled', !!value);
    });

    button.addEventListener('click', (e) => {
      // unlock button through research first before allowing
      // player to click it
      if (locked) {
        if (state.get([resource, research, amount], 0) < data[researchCost]) {
          lockedDialog.open(`Not enough <span class="cost-icon">${resources[research][icon]}</span> to unlock ${buttonName}`);
          return;
        }

        unlockDialog.open(
          `Unlock ${buttonName} for ${displayCost(resources[research], data[researchCost])}?`,
          () => {
            locked = false;
            button.querySelector('.lock').remove();
            button.querySelector('.Research').remove();
            button.classList.remove('locked');

            state.add([resource, research, amount, -data[researchCost]]);
            state.set([stateIndex, index, unlocked, true]);
            state.add([stateIndex, index, disabled, !this.canAfford(data)]);
            this.enableWhenCanAfford(data, index);
          }
        );
        return;
      }

      if (data[disabled]) {
        return e.preventDefault();
      }

      data[cost].map(([resourceIndex, value]) => {
        state.add([resource, resourceIndex, amount, -value]);
      });
      this.whenClicked(data, index);
    });

    if (locked) {
      // player can always click a button that needs research
      state.set([stateIndex, index, disabled, false]);
    }
    else {
      // enable when player has enough resources
      this.enableWhenCanAfford(data, index);
    }

    return { container, button };
  }
}