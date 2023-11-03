import Dialog from './dialog.js';

const creditList = [
  // 0 = creator, 1 = url, 2 = images, 3 = ccby, 4 = changes
  [
    'Freepik',
    'https://www.flaticon.com/authors/freepik',
    [
      // 0 = name, 2 = url
      ['Wood Icon', 'https://www.flaticon.com/free-icon/wood_3275748'],
      ['Tools Icon', 'https://www.flaticon.com/free-icon/hammer_595737'],
      ['Bows Icon', 'https://www.flaticon.com/free-icon/courage_8235296'],
      ['Weapons Icon', 'https://www.flaticon.com/free-icon/swords_3763558'],
      ['Mana Icon', 'https://www.flaticon.com/free-icon/magic_867926'],
      ['Research Icon', 'https://www.flaticon.com/free-icon/ancient-scroll_1183815'],
      ['Archers Icon', 'https://www.flaticon.com/free-icon/archer_6081840', 'Freepik'],
      ['Lock Icon', 'https://www.flaticon.com/free-icon/padlock_473622']
    ]
  ],
  [
    'Good Ware',
    'https://www.flaticon.com/authors/good-ware',
    [
      ['Stone Icon', 'https://www.flaticon.com/free-icon/stone_4746320'],
      ['Skeletons Icon', 'https://www.flaticon.com/free-icon/skeleton_5980902']
    ]
  ],
  [
    'Lorc',
    'https://lorcblog.blogspot.com/',
    [
      ['Blocks Icon', 'https://game-icons.net/1x1/lorc/stone-block.html'],
      ['Iron Icon', 'https://game-icons.net/1x1/lorc/metal-bar.html']
    ],
    true,
    'added foreground gradient'
  ],
  [
    'Delapouite',
    'https://delapouite.com/',
    [
      ['Charcoal Icon', 'https://game-icons.net/1x1/delapouite/coal-pile.html']
    ],
    true,
    'added foreground gradient, removed shovel paths'
  ],
  [
    'Faithtoken',
    'http://www.faithtoken.com/',
    [
      ['Iron Ore Icon', 'https://game-icons.net/1x1/faithtoken/ore.html']
    ],
    true,
    'added foreground gradient, removed star paths'
  ],
  [
    'dDara',
    'https://www.flaticon.com/authors/ddara',
    [
      ['Armor Icon', 'https://www.flaticon.com/free-icon/armor_1907813']
    ]
  ],
  [
    'Umeicon',
    'https://www.flaticon.com/authors/umeicon',
    [
      ['Corpses Icon', 'https://www.flaticon.com/free-icon/coffin_3384843']
    ]
  ],
  [
    'max.icons',
    'https://www.flaticon.com/authors/maxicons',
    [
      ['Militia Icon', 'https://www.flaticon.com/free-icon/soldier_3943844'],
      ['Infantry Icon', 'https://www.flaticon.com/free-icon/knight_3943840'],
      ['Cavalry Icon', 'https://www.flaticon.com/free-icon/knight_3943592']
    ]
  ],
  [
    'H P Barmario (Morfina)',
    '',
    [
      ['Wizard ASCII Art', 'https://www.asciiart.eu/people/occupations/wizards']
    ]
  ],
  [
    'unknown',
    '',
    [
      ['House ASCII Art', 'https://www.asciiart.eu/buildings-and-places/houses']
    ]
  ],
  [
    'Veronica Karlsson',
    'https://www.ludd.ltu.se/~vk/pics/ascii/ascii.shtml',
    [
      ['Sword with Skull ASCII Art', 'https://asciiart.website/index.php?art=objects/swords']
    ]
  ]
]

export default function initCredits() {
  const creditDialog = new Dialog({
    cancel: 'Close'
  });
  creditDialog.head.innerHTML = 'Credits';
  const listItems = creditList
    .map(([creator, creatorLink, images, ccby, changes]) => {
      let host;
      let imageList = images
        .map(([name, url, changes], index) => {
          if (!host) {
            host = url.match(/(https:\/\/(www\.)?.*?\/)/)[0];
          }

          return `${index !== 0 && index == images.length - 1 ? 'and ' : ''}<a href="${url}">${name}</a>`
        })
        .join(images.length > 2 ? ', ' : ' ');

      return `
        <li>
          ${imageList} made by ${creatorLink ? `<a href="${creatorLink}">${creator}</a>` : creator} from <a href="${host}">${host}</a> ${ccby ? CCBy(changes) : ''}
        </li>
      `;
    })
    .join('');
  creditDialog.body.innerHTML = `<ul>${listItems}</ul>`;

  // `credits` is a global HTML id from index.html
  credits.addEventListener('click', () => {
    creditDialog.open();
  });
}

function CCBy(changes) {
   let text = 'under <a href="https://creativecommons.org/licenses/by/3.0/">CC BY 3.0</a>'
   if (changes) {
    text += '. Changes made: ' + changes
   }

   return text;
}