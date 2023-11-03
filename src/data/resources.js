import { resource, action, building } from './state.js';
import {
  visible as actionVisible,
  digStone,
  stealCorpse,
  reanimateSkeleton,
  reanimateMilitia,
  reanimateInfantry,
  reanimateArchers,
  reanimateCavalry
} from './actions.js';
import {
  built,
  rituralCircle,
  lumberMill,
  laboratory,
  quarry,
  masonsWorkshop,
  burnersCamp,
  mine,
  furnace,
  smithy,
  weaponsWorkshop,
  armorersWorkshop,
  bowyersWorkshop
} from './buildings.js';

// indices
export const name = 0;
export const icon = 1;
export const max = 2;
export const prereq = 3;
export const visible = 4;
export const amount = 5;
export const change = 6;

export const wood = 0;
export const stone = 1;
export const corpses = 2;
export const mana = 3;
export const skeletons = 4;
export const planks = 5;
export const research = 6;
export const blocks = 7;
export const charcoal = 8;
export const ironOre = 9;
export const iron = 10;
export const tools = 11;
export const bows = 12;
export const weapons = 13;
export const armor = 14;
export const militia = 15;
export const archers = 16;
export const infantry = 17;
export const cavalry = 18;

let resources = [];
export default resources;

export function initResources() {
  resources.push(
    // 0
    [
      'Wood',
      '<img width=24 height=24 src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAAAsQAAALEBxi1JjQAAABl0RVh0U29mdHdhcmUAd3d3Lmlua3NjYXBlLm9yZ5vuPBoAAAPfSURBVEiJ7ZPbb5N1HMY/76Ht2/ftYe3mWEa7Ad3i5sZwc4aIwEQCOokSgwhEcSRcDGe4UDMuQEk8XGCMIdEYvODCGSKgi7hlTAJOBYQ5YJi5E3N0G9350J3YaLuevKgzZRH+AMKT/C5++R6eJ0+eLzzEAw9hwV+ymbVynSTsiEYFXXzBoire/dueP3Ggoro0HInIAIhgMipGSSeN+wNzNX1D44cA3z0JkhJMxzavzNuyoSBLkUTxvsoutrnpmZ6i9LUirBaVnv7J4AeHKz2dPcMrgNn/FMfNqAJ8G4mEdfVtXVxqdXOp1Y2qGCAa5UjNefrHJslZkkogGKKyoYkdLxXwfc1lCle4eHZVnuRyJlncPYPpAyNTp+aXynEEznyXY3L3c6vs8Uo1xYAgCJS9+AwGOdbeM+xl7cpsKmuv8N2RfUiyxC3PIMl2k4zAuvj5eIK50akZ9feWm/9ryeMuJ5rdytnGNoYnprGn2nCk2JDkmAlfHfuJDU/n4g+EA/ci6PHevhNItGiKLMU7969/Bj0CkGKz8IjVxJmmDr75/C2On6rjZE0DT+Uvo+6PjrlZf+iT+Ln5TSpQHIlE9b1jExlmRa8Lh0L4/AFMBhmbptDc3U/XwAizPj8+fwBFEnn/i1M4UpIoyFkS/qX+b//p35p7h8emThMLzyiArIfsJLv1zAtP5iyyaEbDQuVmk5kEi4Y25aO9d4jWviFKtqwlXdHR6Z3icn0nBS6H9Gdrr/pK8crMvOy049eau0dKS9a/sfblD+skR3JifWGGY6li0MlJFhNPZKah6GW6B0cJzAXxTs/QNzqBPzBHl3eC85UHcaXb+bLiNLu3r6arf5wOzzCfHnydcHCWsl2bxN6+PvMy5+KtFxralorhSDgpLdmOSTFgNMRuSy/LaIrhrucZm2TXq0WUf3QU5+IUfji6n8raq+zZuQ7ZIHP9r3ayMhwAWEwq9VebjKqiL5b1kjS7ZnlmQrwtVs3ImuWZd1nlD0ewJZgY8c4AIIoCqYusRCIhEqwqvQNetm5aDUBWhpPauquoik6R/aGQ7WBFNYIYO2qdJLFv20b0UixgX5+9TPewl2gUxkN+CnLT+bH2IpIs4h2foanlFs03+th7qISy945ScXgvJ6ousHljIXUN7kHBbtbeLchY/PH2NfmKXpa5H6obW0ldksibO9cTDYWp+vkKZ3+9QVGWi3NtnZTvKSb/sXTab3o48FnVdGOLJ18glu0yRS+9E4mgAqx6NN1tN6u+mmvtuQtJJFEULVZFFQSE29OBO8FQODxfM2kGxajpg9Eo5663ed6ej+pDPOD4B7v+Z5WKRSMJAAAAAElFTkSuQmCC"/>',
      100,
      ,
      true
    ],

    // 1
    [
      'Stone',
      '<img width=24 height=24 src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAAAsQAAALEBxi1JjQAAABl0RVh0U29mdHdhcmUAd3d3Lmlua3NjYXBlLm9yZ5vuPBoAAAPkSURBVEiJtVRJbBtlFP5mxjPjcWc8M44dL0lTO7ESZ6MGkqY0akOx2kCjpqVIRQhBQULiBjduHIAT4sABiSMUiQMHboCoWlKEkJIuCiGhtErSZilJ23jL2I49Hs9iDtBgO5u68En/5f3v/xa9NwP8z6B2auA4ro8gbVN2lkvpemnicRvw1nsDc8dPndE5zqGJovQLAM+DEGyXgJZc7ovDL73R4W9oIuP3ljMdXdG2XC7zGkUSyVKpNPlIAqIofzQQG37RH2iiACCwO8RdGf05dfTYSa+m67GiWohpRfV7AOpDCTh2Od/q3T8QZVg7AIBhWBRV1cpm0np7517eH2hsTiXjrxMUuaJr2tRWPOTW2mUbQRBVlWhPPz87fb2ol0qQ5DocGz7tD4fbP4907v3ggQUsy3JlM6tVNYIgcOi54/L41dEUAJAkiad6nhFCza3ve30NtwCwtTy2zchpmt7n9vi6pn6/hHQqjs4netfv6n0NpI1mqWQibhTya7aZ6WuQZZkINOxuXLm3zADQdkrA8oJ49ujQae/g0MtYmJuGaRpVDf0Dz0sXL3xXVlYT6O3rR1t7N4ItYQqAUUu2YchOUf7s8JETMbfHRwGAVlShaUVIct16z/zN6yWOs9PN4VaCJP/xuLy0SN69szRRLpdvbJmApuleX6DpZLA5wtyvhVoiuDlzrcrE5G9jpaZgqGoDWNYOQZA7aw1XzoDhBfFsbPCUv7KBF0RIshvzt24g1NIOy7KQSq6w41fGYLPREGUZoijDZrOBZZn2LQUoijrRFe0Lsv/ufSWe3nfov8gkCbcnkDl8ZMht6DrS6QRSiThSyTg0TWupfbs+g3K5PKfm1850R/vk2v2vhbKa0CiK5HjBCZ53wuP1Y08ojGxGseeyyphhGLfXDVW8KxZV9UMlnVS2ZQcQCnfIS38t5GrrT/bsr2Ptjk8ra1XfQS6nfJXJrnYITuk9G01DVfO4PT+Lto5oFZHX14iRc99is5w0w3RTFPWCaZo/1iYAAFz44ZuRS2M/KQBwZ2kBhqFvICEIAnaOY7w+PyqPWiyULdNYME1zdNMEAJDP58/Pzfw5W1hb66VpGgcODm4QyOUUCIJI7eIFAIBlmZicuGooyuqX6VTybQDl+72b/k1VtXDO0EsRhuOcgYY9vN3uqLq/u7xYLml5UpJcRCG/hstjvxaymewr6VTikw1pNxOoQNDl8nwsyq4DB58danS5vQCAy6MjOQfHCKZp4I/J8eVUMtEPYHEHrm3RKEl1XwdDbQuvvvmO1RrpVlojnZan3nseAP0oxLWol6S6LxwOPu3xeN59nMQPjb8ByhldJwA+hz0AAAAASUVORK5CYII="/>',
      100,
      [
        [action, digStone, actionVisible, true]
      ]
    ],

    // 2
    [
      'Corpses',
      '<img width=24 height=24 src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAAAsQAAALEBxi1JjQAAABl0RVh0U29mdHdhcmUAd3d3Lmlua3NjYXBlLm9yZ5vuPBoAAAPoSURBVEiJnZbLbxtVFMa/Ow/PjMdjhwaTxs7DNqV5kCJUYEECDYglLYssUaCiQizhX6jo38CKLRIskBBLJCQiAgjUEihxYoe2SRya+hE88bw8M56Ze9mV1vGQhLM839H3Ozr36p5L8B9xYW72M1EQXgfAYkpIEIbfrZc3l+M8SJxQKBTOZs9kfpt7emz4b8N2B9U8mUkp63f+0i3Xv7i1tfVgUI0QB9BU9ePpyVy2vFMPL77wUpqQx3thjGHt15v+TCmfvb21dx3ABycGlEqljCiQy70wpIViSSwWixBFERzHAQCiKEIQBNDbbbHnG5Eg8m9OTEw8sbe3d9jvxQ8C5HKj12eL+Td26m338pW3FE3TUKlseqsr3zjVyrovJhQUi0VhNJcjqz/93D2Xz2bMbo9vHRx82+/F9ScKhYIs8vw7AscLk4UikWUZAGCZZu/GEsvcWGIZyzR7AKAoCiYmi+B5nuN5sjw2NqYcC1ASiWulfHb43n7LfHl+Ia3rOmq1GjqG8XCcHcMQarUadF3H/MKCtr1/YJXyTw1ryeR7/X5HzoAQQgWeFyMGT1VVfP3Vl+aLOQtTScbODiVvA8BUcrfg36uZPz7Q8Pby1XTEAIHnRcax6FhAyFjZcByD50CCIAABZR8t9jIAsN10OQD4cDHIAMC7n1MjCAIIPFjHcgzGuPKxAI7jKqbl+ZqqyO12G/nxIrv6BelYliN9ck2aYgxY+pS4mqb6+fECdF2HKkkwHNcnhFSPBVSr1fbzz81FuexQqt1u00uLrw0BwA+r35t+sKUAwMyzF8xXXr00BAAbGxssk5JTBx3TqVar7SMN9ycAgDLYqiKLrWbDHqQ/Gs1Gw1IVRYwoswbpAwGE4C7HE7SazSOH1h+tVjPiOQIC3D0xIArDW0EQwXGcgfqj4dg25wcBGItunRjg9cI103EdMApKaaw5YwwEjJmO53i9aO3EAEpp1XRcW06IkWUNHC0AwDAMyJJIDbtrU0qP3KBYwPb29rbd9WlalRO6rscCdF2HpkiS7Xp0fHx898QAAFEQhZ6myqlWszlwFwBAq9X0MqmkGkXUXVlZCU8DAAHqkiii0ag/BFT2I1T2/71YzXrdlUQBABpxPrELhzH2B2OY7+g6BwDnnjmvrlQiEwCmZ86rAHDYOeSyahaM4fdTA3oh/cXueu+HlIqu6yKbzfIjIyNpAKCUwnVdRBEVHM8LXb9389QASummYXc7UkKUy+UyBOHx0jAMISVE1rGcDiFk4/8AqobjBjPFXPr+zp2BT0Zp9EyisnPfDsPwzzif2F8FAMzOTO/KUiK2CQDw/F64WakW4vR/AONc5H5evv6eAAAAAElFTkSuQmCC"/>',
      2,
      [
        [action, stealCorpse, actionVisible, true]
      ]
    ],

    // 3
    [
      'Mana',
      '<img width=24 height=24 src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAAApgAAAKYB3X3/OAAAABl0RVh0U29mdHdhcmUAd3d3Lmlua3NjYXBlLm9yZ5vuPBoAAANYSURBVEiJpZRdTBtUFMd/Byql3xRa+gFtKVCwlcGkG5hGNGwPbDpFjJpNYzZ9kLgsOKd7MJjM6bKQ+GBiXLZEzTJf5GGSLWa6N2PmiB8jJrItKURgYQ6mnULt6JiU6wtbRmlLxZPcl//5n/O/95xzD0opch0gvBpniefOiOcKag+Xn+gM21Ihr7knD4GvM+EF5LB4/PZjvc/WFtxSbMvGEZGnRWQ3sEdE3hWR8L3+rAIi0hSway3+Whs+tykkIu4s1PPAGaAd6Aeiy7xZnlsf9BinB3sb1dyPu9TQwDOq0mm4AHhzlOiDTLgsOQEIeS2HijQ857dpq15rd963LuLHVOMEYHjkT/b1nZ+enEqMJpOpz6diN49me/2yStwRsJq1Tz3RaB3o2eSUUoOGsuZqdC7rioCr0wn2Hh6c+fKbiTal1MW8BUREwoGS4wsptXmDT+/c/YhDU7XRj9Fnv5t4//vfX//5cuyagtPjk7MH703UWm/tEuHjH6IzQaXUHzl7oNPR0uAzxS6886BKDr2sLp/Zrrwu4zAQytaDSLAk+nqnXxmKC3fm9Q90OiI7H3X9EzvdqbY87PkN8Of6ZB3ryxYmTnaqGo/5Yl7/YG5ODf40nvj96tgNohMzo0qp8RX1FQmsrzH3PVRXMvbmVk+hs66ct7qbfTVe87Beq9kuImXLpijdNgSsJwK2ohd/mZp/+9LEzOG05K4mn2lyV8Re2NVWgaM1QEGRBoC/4vMc6790+7NT0ZGcAiIipWZtx43ZW2cz+dsabB8lkws7WqqNpfufD1KxsZqxyTh73vtuavTK7K+pxVTfqkssn2Mz63Z0b65Q8XMvqHWB0itA1bImA1rA839EwrWW2LG9zYsOu/7QiikCWoEDq2xLASqzjmnI+mGD15gCHkiL4yDQBbQARwFbpgRBn+XTSltxAijJcYkVuwrAAdy/JOLLQCgst+pf3dRoS3x1pCPlLtefA2rzLd2dJAHgpUyEapdhX6TOsnht4Ek1P/yKOnVkiyqzFF8HCvIWWKX2Rd5y/YHHWxx/f3t8W8rjNAwBTRl4vWsSuNsDr7nf69DfBOxpiQ2ACegB7IBmTQKABqjPgHcDbwBu4BOgeU0CeVzgi0x4zlXxX0xE6pRSI+n4v2IvBgcpzsxIAAAAAElFTkSuQmCC"/>',
      25,
      [
        [action, reanimateSkeleton, actionVisible, true]
      ],
      false,
      5
    ],

    // 4
    [
      'Skeletons',
      '<img width=24 height=24 src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAAAsQAAALEBxi1JjQAAABl0RVh0U29mdHdhcmUAd3d3Lmlua3NjYXBlLm9yZ5vuPBoAAAIzSURBVEiJvdVLiM1xFAfwzxjvzFgYjPdsBht5bRSGUhZCspHCytgpxcbCAhsb5Tl5FhuvBYOyk2exsFASMsiQkpQpbzNYnDO5btx7a4Zf/br/3/md8/uex/ecyz9eVRXqrcIKfM7zQJzEid5wYi+2Y0CBbDB2Y1dPH1+AfSXuWzC/JwCHMarE/RgcKvVA3zIAQ/AWB0WKjou6rcEXrEdNTwBgBtpENIcTYC2aMb2ccTkWNaMOE1CLc/iB5ehAO97gSAWO/nWdyt8aXMxdU3T319WnAoAOQcc6fEcXhqXsXTnj6goAarFQ1OEqbmEsluI87pUyrqTIcAFLsCjPl1LWK2uu4HotZuUemrI55YwrieCGmD1HRe6J3jiEm+WMi2m6AU2Cli9xBzvwDaOxMfV24hX6YTNmiq5uxzUxp/A7iwZgtuD4VTEtn6EVqxN0fu4Joptb8TR1r6RtE/p3P1qYoi8Z0TiMxAiR/8eCNStFD1Rhi0hdG5bld33afsfXP0UAD1LpK/ZgnRgH1QlyBqczHdWYJsbGbnRiPB4WPlgM0IjhuJ3nFtzHpPR2ZHr6JGVPsT91b4tmbCwFUIWpopmkwTExNS+ncWN+r8cBkcpugCmKiFNYgxq8Ts8epawLizEZg3C3wIl5IqWdqfsIm8TwG4L3xRE0CNb086tI4wX3z4o+6J/7aMqGC0YR/9cD842GP6WoHi/EcJOeXsc2fMBEfMSnjPIDtgoGdaelA89Frf7P+gntLXWQ51yMmAAAAABJRU5ErkJggg=="/>',
      0,
      [
        [building, rituralCircle, built, 1]
      ]
    ],

    // 5
    [
      'Planks',
      '<img width=24 height=24 src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAUCAMAAAC6V+0/AAAA1VBMVEUAAABfRC9mSTN6WD53VjxvUThMNyZnSzVGMyN4VjxhRjFQOiddQy5NNyZNNyVQOShpTDVINSRZQCxGMyNkSTRbQS11VDpqTjZxUjiBXUFUPClUPClZQCxsTzZfRDBMNyVzUzloTDZxUjl5Vz6DX0FYPytwUThGMyNlSTRKNiV1VDpqTjZ7WT55Vz6LZUZxUjhmSjVdQy92VTuDYENhRzJfRDFbQS1pTTZnSzVXPipjSDNdQy9ZQCxlSTRSOihzUzlwUThrTzZOOCZVPCluUDdMNiVINSQdqybDAAAANHRSTlMABhgQ/vvz4NfWv6x9Y0o0KyIL+vn59vLo5ubl187GwLesqZ6WlpKQhXh0aGRZUE1COTYjpoa/KQAAAMhJREFUGNNdkFcWgjAQRVHsghR7770rPZEu+1+SCXgYdP5yz7vJmzCZydVqnJBjfmenqBoe1Hkpw24tBWmm7UcVYPmypSJs2u9mA+D8RWwz8KMtsKNOIQlW5JSJXcNSEA78kpAyeawbFg36e5A3HrERuXEKPa/Fb7AkQZteSIK0Dw/rzVyPBnFQB/nguEmfYT5ljw4NEhvDKmzVCfXYXkObpeN6sT1iU3YuEGiQt9t3CPYLiY04Boa9rKpFQ1En/1/+PC3KYub8AcxzI3LKXt/zAAAAAElFTkSuQmCC"/>',
      25,
      [
        [building, lumberMill, built, 1]
      ]
    ],

    // 6
    [
      'Research',
      '<img width=24 height=24 src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAAAhQAAAIUB4uz/wQAAABl0RVh0U29mdHdhcmUAd3d3Lmlua3NjYXBlLm9yZ5vuPBoAAAOLSURBVEiJrZZ/TNRlHMdfz9337r53fO/gTpCf8qOiBBoNWteyRnMjxsrZpD+o1LnKSY2ljbKWWIFJ+WM0K9dg9geQ2GoYm/ZrASq6hcxlpJ2TQZZGCNjxS+AO5Hj6y1uO+wEb7z+f5/N5v5738zx79gjAoNfrD+r1YsPMzKwFQDUZplmkBEirZj4z5B5/V0p51j9uMOhefty5cn/9vhc1V08/JTsbOFy9mUdy7l4UQEpJW8dlirfV/jsyNpkkpZwG0Dls2kt7tz+jne26gjM7lWefcvL512cWGwAhBPmrMliXn2MCim6PK1Pe6XtX3hXPtycv8HFdKxVb11L56TF/Y89fQ8Q4NKa8M5w+1xPQPMpqpjDvfvbU/jh5/GSXAjj8AItFbWtuOb/urS2FHKhrYUW8g9Fxj7+599oQAIPucdo7uwMDbGbyH82k9WfXrHt04jOgxp8MyIp2aE16nT55eHRCTU+NHRcC7eJ3lcpit6nmy3ZKKxrnpJQpUso+AEVK6QIyhBCZgPFSb39C2oroRiAK4IfTv/NJfWtIY0dkBAd2PsfWXUfmpJSVt80B/KuUUl4CEEKM/r/5sQfvwW6zhATYNJUYh0bn0XLd2pKDbwghXFLKo3cAgsmsGklNXBayRjUZAMjJTKZ0w2rrjupv0uclCKZjbV2UVzeHrImLsdFS/zqKXjdvLiygqCCXooLccGVBFRbg6unn+InfQtZE2SxsKc5DpxPz5uZnWmIFSuC54b5pPO+6Rm5WMlnpCWSlJywdQEo5KIQocRbtbvjjxIfiF9fVpT1kIYTZGqHu2/Xa076UxGVKYpydVWFeVtVkCGgeEADERjs087ZN+QqAotcRFxMZEhBKYW9R958DeLy3Fmw4cGMMQB8WMOubY/X6/fQNjnD1HzfO7DTMqmFBEItqfNtujYgdnZjaERRwqrOb+OWRtB95k/Vlh8jOSOL5NQ8HNU1OcOCdnkU1KUx6ZiJKKxo3f/X9uREhpbyjUAgRpZoM13vbPlCdRVXUvL8Rj3eGkne+ICUh+JtUu3sjHb9eoTAvi/vS4vj7+jAPrKnsnwcAMBqU4Z/qyuxJcXb6BkY41XkZq2am7IUnFrJDAFzo7qNg00cXA94t35zcs31v08TNSS8mo0JDcwfFTz60KPNX3js87h6bqgqYQAghgHKL2fCqx3NrOYBp4V8ZaYtQe9xjU1U+n6/pP9rhPuGIC8aRAAAAAElFTkSuQmCC"/>',
      ,  // no limit
      [
        [building, laboratory, built, 1]
      ]
    ],

    // 7
    [
      'Blocks',
      '<img width=20 height=20 src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAADUElEQVRIS7VVS04bQRCtHkOyi5FyAPsEMRJ74ARByj58EilA+BmjKF8smKxYAAJChAGDbRmUZcwBoph9pHAAJHwDexUFPFV53TNjZsiYzwJLlnp6pt6revW6WtE9/9Q949ONBGPphWRMSZ5IGpur9rO7JtSWIJ1e6HIsmmehGRImEakrkhOsiFhSgrUwV0H4M7e5dNyOOJJgem5xiFmWAdXlgSMekOL+/TUeNJ27J1Jl4qqwVPZyKyc+YYhg6o3dR46zIqKQoY40mUeCu/stcE3vE+nV0V5u1chpCCBH0onRPN4MmWQC4CbHK5lfkhqGS3CSGotkiKkOHVf2d9Z6WgQcoywzDd4e3GRig0L3gZi521FOJca0DJIBnURhd73DEExmFk6xWLtgOoopGoQ0Mywcj8zcy9gtDNkrWnP+ND9bD62ECP8KxhR2NzyC2YWmoC4E1cG+3hGjSrPJ3cAYUMJdeIM4TsE9cV9rRUo7Z5HZWUXcI1ZSQhnZYM+K+S8uwcRstukye01zG1aEI2piUV0x/zYdtaiR21g6GR5LJy2x4mjhCqrta9en0t6mR5Ceb7oWNN1tY8eASxS01wULMm5jAqVkvZj/mjEVvJ75BIJbghtAhebC9SJZX/MQEcBYxXrKexsnhmB8+mPT9/T/Bynkb1MlTrSt++Jr3i6mXNhyJdIE0af0Krh7SEBiKkBMqKmhM4GPysWcSzA29cEQROpPVMLMSYKq1zcCvtP+197PhsdGMCGiA59gdPK96yKvwUqopueKIv7OrOr53PLxy1ezQ5AFmnMC2DbAdUKmgmiJiA5L224FoxPvcA7CcgSbp0TOQDS3v7taGXk5PeQYzzp6ziQwFPtB1OsNvMDYoMZhaeexT3CKk5vwq4hyhusSVVWK7f2djerwcLrLUef6njBjITyTVOmBdZ4pFAoY8bqCqbcpbvIPgMQDHzcQZJ5d8NAhrGIfo9zcC61hiPWxxdZsuZyLHtcvRjMpjIB+uLgPZlwUcfYB9KTVXI8M/j8yKgk/9cZ2Dd/YB6XtotkP/K69MiFDUnU6g+hnPwB6W30KuYjsTvV3XctxFVw/33gnB4Oej4yjMuqDf2oW0dmFSO1bYessCtjfuxPBdUDt3v0DrBdhRogCkb0AAAAASUVORK5CYII="/>',
      25,
      [
        [building, masonsWorkshop, built, 1]
      ]
    ],

    // 8
    [
      'Charcoal',
      '<img width=20 height=20 src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAUCAMAAAC6V+0/AAAAY1BMVEUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABmaHTeAAAAIHRSTlMA+w4Hr4nw7MJ4ajs19tDHloJTSi4eF+Xh1bSfcGFXREQlbggAAAB+SURBVBjTtY9HDoMwEEXHuJdQA+nJv/8pI9sgjFgi3mI0eppKZ/Lje9fhIcVro4YnIqwqnMNMN4RxkT1Wbnn2JFDikgzYcE+l18JcgCZt84DRAET7sQxQbyIuGaCtrIHW5sMC0dfEhOVuHaNJQ/1Ik1RQjee9qF3xQjXnx/kDVJoPEo9nyBsAAAAASUVORK5CYII="/>',
      50,
      [
        [building, burnersCamp, built, 1]
      ]
    ],

    // 9
    [
      'Iron ore',
      '<img width=20 height=20 src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAUCAMAAAC6V+0/AAABO1BMVEUAAABVcGhJZl1rhX4zUEd0jodGYlo6V052kIljf3ZyjYVXc2tXcmpceG9yjIV9l5B1j4heenJ5k4xSbmZ8lY6Ko5xlgHiOp6BXc2tAXVRVcWh/mJE2U0p8lo92kIlYc2tshn82U0p3kYlLZ19/mZF0jodQbGMqSD9OamEmRDp7lY5mgXk5Vk1jfnZYdGuLo5xkfndzjYaKo5wrSD9HZFs+W1I2U0qOp6BRbWVge3NGYlqSqqRkf3eDnJVwioJVcGguTEJIZFuFnpd5kotfenJbdm5/mZE2U0pbdm6Npp9rhX5uiIBEYFdbd298lo99lo9ZdWxfenJDX1YiQDdOamGJoptjfXVqhX1SbmU/W1JOamJ7lI1wioJuiIFog3phfHRJZV1FYVhDX1c5V01mgXlkf3dMaF9/mZJceG/+v/fDAAAAV3RSTlMA/u9jKP779vDr3aeYgnl2YV9VPisTB/37+vj06efm4NTT0tHQ0NDOzc3JwsLBvr23srGrpaGcmJSSioaGhYBxcGxraGhoZFxaV1VQSklIOTk4LS0dGg9l5XaaAAAAzUlEQVQY02MgB5hbo4uI+IkaiYuiCapGS9vqe6KKMcewRqc7haIKaofHcGipIIuI2XMLpoTHCPC7IQkqRzAGcKaE28lF8yMETdIiuHnjOb34lITE4II+bGkWPBnxcQp8HLIicNEgx5AICV7duFguZ3+4oGmSlUYET6ANMzOXAFxQJzKJKSpC3tcgLpZVCCbIwh6ZlBDFqGeZGh5rCFfqnhyZCBT1iE8N94YLspiBRYVdXcIQLlV3UASKMqlJCSLEgjWNWWTYJdmYhPEENwD8bCNnidwV9QAAAABJRU5ErkJggg=="/>',
      50,
      [
        [building, mine, built, 1]
      ]
    ],

    // 10
    [
      'Iron',
      '<img width=20 height=20 src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAUCAMAAAC6V+0/AAABXFBMVEUAAABQbWR4k4tbdm5CX1YsSUBTb2cyUEdifXVuiIFYc2uFn5c4VUw5Vk0sSkE/XFMoRjx0joY8WVBwi4OOp6CTq6QtSkErSD5NaWGUraZshn8sSkGLpJ2Wr6gpRz5jfnZGYlmRqqM5Vk0nRTuDnJVqhH17lI1HY1uOp6BJZVx0jodRbWR9lo9BXlVTb2ZGYlllgHg5Vk2Sq6RzjoYqRz5CX1Y/XFNifXUvTUOVraZyjYVIZFsxTkUsSUCXr6g1UkmZsauKo5w+W1KEnpaMpZ5deHBNaWB+l5A/XFOXsKklQzmRqqNbdm50joc3VEtqhHxYc2the3RSbmUuS0IqRz6Bm5N8l49qhXxdeHCRqqONpp9vioJLZ1+HoJmFnpd2kYp0j4dyjIVmgXlkgHdge3NXc2pWcWlSbmZPamJHY1s7WE8xTkWVrqeKo5yIoZp6k4xth4BjfXVhfHREYFeC0x4tAAAAVXRSTlMANP7+5cvHw7mvmZKSinFoZDYrIBUMCAT38e/r5+Xi39/V1dLOzcrHxMC/u7qzsrGtp6SkoaCZl5aRj42LhXpnZWVhX1lQUEdHREI+PTk4Ly4pHA8Oo3Yj3wAAANhJREFUGNNjoB5wUbQUQRNyV4mNipS0E0USEtRiCguNy42KlHWACQUahEcnxgNF86IiczzBQkFcESnJ4QWJCflhobEy3kYgMWuJ9DTmiMKk8OgEoBHODBpAYz1YMmMy0lIjipLDOa3i1RgYuB0ZGAyFdBViMtJTmTnkhaWifQV1uEUYgtl5ePmLM2O0GblczZNUOY2FgSYKSNvYZ2WZ6jMw6gVEpHD4g632UjbJzuYVMmPQZGRj84G5UVxAjlXcj4efRd0N2YNifKwW7EpO6EERYssnRr2ABQASwSfinWYMXwAAAABJRU5ErkJggg=="/>',
      25,
      [
        [building, furnace, built, 1]
      ]
    ],

     // 11
    [
      'Tools',
      '<img width=24 height=24 src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAAApgAAAKYB3X3/OAAAABl0RVh0U29mdHdhcmUAd3d3Lmlua3NjYXBlLm9yZ5vuPBoAAAOASURBVEiJtZVdTFtlGMeftz3tqW3PeU8/KCswGd+TQdIwkYLYlJEtUXHTwGJG5rJ4Y+KF3rkrvdgSL7wwXnkxIyyKGokjTHGJRhTLWKsCF06IzjGataX0eNb2lLa0a/HxxmonLZRm/i/f93mfX/7/94sgIvyfUpRaSAhR6HS6l43mCg9HhXWtTi9RwXiVEPLoTuuYEptX6Tn6VW1jU3OP86hayTAQCUswPTV5zMhUiABwtujanSLiKD3/5xbaVCqm/cSpswcEkxlicgRCAR/84PpWTiVTZxKJ2OdlOeAFYcTW2TNU19yi//rKZVmr18OGHIVEfAMWrs+6w9IfzyDi3d3cF9wDjhfeaz9sH+zsdXJmi5UcOzFIJz++lFj9/VfI3suOhIKBnlKaAxSIiArCu4c6uobtjiM0f1wSgzg+ejGdTm3uQ0S5lOYFHaTT9wZZNbstOrPFSh6ubxQBoLrU5tsAhJB6tZrdCtzxZhfd1xL5c4uea7Dm81pYVtuwZwDHCxfVLBvnKP3R+eRApd3ZTwN3vNkF92wCAGDBPQtyJAwvvnJOYzAZRq1G/ktCyL6SALxgeL+t47HnT7/0qo5lNYxKzSoAADq6e+n83PfMxEcj8Z/mZrYOtttg3e8Fs1ZhOjfU/VSloJ8lhFh3AxCOF1xHnj5ur29uVUXDd+GL8bFoT99RYfrqpC8Ri72lVKpDLMt49Tx1mVjUXBjuhYdYBvxSDN4Yc90KReMORAwWBQCAhuPpd/0Dzx6ua3pEJQbX4MonlzKpzeQ7mUzmtVzh/grhm4GOpv4+Wy3otSoAgBxkJRSNP1EMokDE1EZM7puempy/ufxzVqFUQG1jM8NRQzS/0C/Jg1OLN33u5QDEkxkAAKgx83D+tKPh77iqCjrI3QNCiMZorlg0WSpbwpI4IYVCJ7cVE0JrzPyNIXvr/u7W6vucvD42syJGkw5EXCsIyEE0Gt2pzc34aNFM9wjZ8bErC/LhzG1RTjoQMQCwh/8gX4go+6VY+2eeZd/8b+v37cmFF5z1Fqp1EUKqywbkQdp4HfPB6ppcDFJVVkT/VV2lYfV4Z8uBxw/V/BPXSjACb47PfVq2g3x5xahtwrPsv7707xFusBpAo1J2lfRl7iZElAkhbZc9S7+ks1s1XS1WEGMJQMSlBxJRToQQrtFqfBsAnwOEG7fWI8MPFFBIfwGwT5KXvTSNwAAAAABJRU5ErkJggg=="/>',
      20,
      [
        [building, smithy, built, 1]
      ]
    ],

    // 12
    [
      'Bows',
      '<img width=24 height=24 src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAACXBIWXMAAACxAAAAsQHGLUmNAAAAGXRFWHRTb2Z0d2FyZQB3d3cuaW5rc2NhcGUub3Jnm+48GgAABIZJREFUSImllG1sU1Ucxp+73na3b/f25faN3tuVDsY2Bh0Z20AatuKEjRiWOAIRjRqMYQ7RADoVNX6gw/gNIxluCRijU2LU+IW3MQTmIM5AYAwyYIOB3dhQYV27rqMv9/jBltQ5zTaeb/ec5/97zv9/Tw6cRvaLLJ4d4himAo8nJYASK28t83q8m028+SbDKIcoJ68b+PTZMvvWr38a+O1+qADA6CzglJyWj+QtyEdJUSkr2AQqEongYMuB2/RELHauPxCuqV+91P5Ze3fvSHhiEAQRAsIo5DTL0DK5RAg19jA6Mh6NfR8Yj/5oNTDVww8mvgHQlwwgBGTtHf/tT2SyjPk6VseFgiEQSbpGAeDm6DWdb1WV5LgFIyUlCMITMaJVKkBlUBQoCgRALJqQfrhwA0ev34rv/+AJxWsfnevqHxwrTOtCK4piR1lZecHVritjDrtT03rmWD0NYPTuyFjJx0c69yrl8op5Vp2M1yrlTy+ZF7rQPxy/0D/MaBmFYulcm6k78EDW0VKt6Lw0RMLjiVA6XBCE9i1btuQ3Nzf3BEeDE/F43B2JRH6Zap4VAHoB2AFoAOgBLDAZ1Ddu/ryNfLuvhlQVO6VC0fQHAFcSftHn88VEUbwMgANQLKflwWT9lFoB4AgAbWrB6dDXL1pgvmc1qCOn39tEDr60JmHj1OengE9bywEcBcCmrdEWTtO878XViaM715MClyj5fL74bOApLQNwbFIxP8+iH/C4c0mDbzdZnJ0l2fWaywByZxMAAKUAjqeFaG1W67WGBp/kceeRwztqyJeb10ilLmvAxqs6chxcJ4DsVLFsGgGDAK4D2A/gjCAIx+vq6nIbGxtvTQQDEZdFr8pzmGUX7w4zb79SIK7zOuwnO4dC4Ujs1Ew78SoUimDaD2UB6C2seq9Zpxo/tO8ZcufYcyTLookCKJop/NFVzMzMDAJwpu1R7jzLYP/Z18nyRXaybVWhZFKr9swKnjx5OYATAAwpw1yRe9OkV/W9W7082rZzPWl5ufL92cJTV7YwGWJM8zqeXJh191T9RrIqV7z+OPCU3ADaAPDJb1Wxy+Y//c5Gkm83DqZMGWkFMgA5+Ptp0AqC0F5bW1vQ1NTU4/f7PQCCkwK6AOwAcAiACQDDyOkMQoBEXIqmTDQAcJxxFWswHigsXpl5q/cquTfQR9XW1pr+B57SZQDbkyG7eFZJS5KE8Vh87JGD47jVi4pWDJ+4Eiat3SHi8VaShoY9xGK1/T7FWP5LCwF0r3W7htp21hC7TnPp0YgIMppeqNtlktE0dr+xAVUVK3G49TTMWflMqsNp6CqATX+ORRIUlQEFLVOmb/LmOY7PRWdOvyt7fsLjrSTf/TpK1j6/PZw82bTl4Nnek/UbSOlc2wiArH8ZROf8myd6EqTlPCGu3CUDADJnEmBmVR/uWrfs4VebK6U8m+G+WaN69R9vkZrVF2lsOYtJItp7qeu4577fH5hJQPhh7GzvcKDSbubMW8vd2taeO57JHl6r4wfUnOGpmYAnSWbhVD7ByPaJRu3BvwCulrutgYXHhgAAAABJRU5ErkJggg=="/>',
      10,
      [
        [building, bowyersWorkshop, built, 1]
      ]
    ],

    // 13
    [
      'Weapons',
      '<img width=24 height=24 src="data:image/png;base64,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"/>',
      10,
      [
        [building, weaponsWorkshop, built, 1]
      ]
    ],

    // 14
    [
      'Armor',
      '<img width=24 height=24 src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAAAsQAAALEBxi1JjQAAABl0RVh0U29mdHdhcmUAd3d3Lmlua3NjYXBlLm9yZ5vuPBoAAAVHSURBVEiJlZVfbBPZFcZ/c22PPfY4xElwcOwo4Eh0odqNUlppC6kg3TVrNlFVBDXVSlW1Fe2KP6l4D5KlPqA8hwIqlYBISKVE9AERaQtVE2iKKLsVVFWTl2xp4jiOZ5PY67XHmfF43AdCGlG71X7SaM7MOfN98x3dcy/UhwTs3bgDhAGxJS823r2q/fqW2v8iAtje3t5+C/ikWCyuOhyOM6Zptqyvr7/pdDo7nE7nx5IkXS6Xy78GUBTlp7Va7bRlWXHLspY8Hs/fZVleq1arv1RVtQ34Vjab/SHwuQOgra3tT8lk8u1UKtXj8/neOXr0aNvy8nJO1/XtgUDgF4lEosUwjL1+v/9Hra2tH4ZCobePHDnSvLCw8D3LstoikUg0kUhE8vn8d9rb278xNDS0++nTp+/qun7VuWlFkjh37lzT8PAwQgjcbrezt7f3g2w2W3W5XBw6dKhlq3XTNFFVVY5Gox8UCgVDCEG5XFbOnz+vrK6u2kBts0Uul+tnXq/3yoULF8Tjx4/J5XKkUqm1EydOtEiSZF2+fLkkhLBN03QAyLJctW1bnD592gc4b926tdbZ2dnS3NzM/v37GR4etnVdP1WpVK5KAH6/f/b48eNvTE1NMTQ0xMWLF5FlOR8Oh5s1TaO/v59YLMb09DQAfX19PHjwgMnJSYLBIOl0Om+aZvPZs2e5dOkSBw8e5M6dO7OFQmGvBAQ6Oztnjx071l4ul7l//z41q8yytmpfuz4mAoEAk5OT3Lt3j8HBQYDNuL+/n1wux08+/LG9I9gqJKfC4cOHURSF8fHxbDqd/poAdgFKPp9HURRisRi2tY7qddkAbrebeDyOLMub/ZdlmXg8jtvtBkD1umzbWicWi6EoCvl8HiGEAnQ7gZmlpaWfj4+P/8DhcLwZDAadu3b3tM/NzRnA5iL4X3B7A0b37t1iampqLZvNGsCMruu/Af7hBNar1epYqVQaAygUCu/ouv67SCSCqqr/l1xVVcLhcHVmZqaYzWa/D/x5a17U+eaf3d3d+sjISJOqqmiaxtjYGEL8p1QIwY0bN9A0DVVVGRkZadq5c2cJ+NfrZHVbUKvVSKfTXLlyBYB4PM6ePXu4fft2GSCRSCimaTI6OgrAqVOnkCRJqvfD9QQqhmFIfr+fAwcO8Pz58y9u3rzp3rdvn3zy5EkF4NGjR7Vnz55Vurq6zJ6eHtXv92NZlsTGcG1FvQ1KCgaDE4ZhfHdgYMDV19cnotEoALlcDoCWlpdDPTc3x/T0tD0xMVHxeDx/1DRt4HWReg5qmqa9H41GM729vTvu3r1LJpNBVVVCoRAAmUyGYrFIR0cHsVhMPHnyZPXFixfv1+FqvAwrlcrf/H7/jjNnzhAMBllcXCSTyQAQCoWIRCJomsbCwgKGYTxtxNNQoFwu/2VlZeW9a9euAdDV1bXp4OHDh8zPzwMwODhIuVz+9CsLrKysfJLJZEqjo6O+VxP7OgzD4Pr161/mcrmGAvXm4BWWUqmU3ogcXm4jmUzGBJYb1TgaJfxe9yWvT31jcXGxXKlYa9VqNZ/P5wuvrtnZ2dLExD37s8/m3IXcSsSsVH9bj6fuOQoQ3OZc/WigtaVWg6sf5wrebR21rq6uIsD8/Lxayi/x0ZHANkmCX02srmlfWK31eBq2yCML861dysuHmt3k8wiRTCbDyWQy7PMIIWFvA3hrl4JHFmYjnoYOmrwi996+Jtuya9IfnumSv3l7yeVyVQAqlYrry/znvnd7vTWnkGq//2tBFHQ78JUEgG8Dvo34UyD/Wr4Z+OZGXASe1CP5NxYELIlHet1NAAAAAElFTkSuQmCC"/>',
      10,
      [
        [building, armorersWorkshop, built, 1]
      ]
    ],

    // 15
    [
      'Militia',
      '<img width=24 height=24 src="data:image/png;base64,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"/>',
      ,  // no limit
      [
        [action, reanimateMilitia, actionVisible, true]
      ]
    ],

    // 16
    [
      'Archers',
      '<img width=24 height=24 src="data:image/png;base64,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"/>',
      ,  // no limit
      [
        [action, reanimateArchers, actionVisible, true]
      ]
    ],

    // 17
    [
      'Infantry',
      '<img width=24 height=24 src="data:image/png;base64,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"/>',
      ,  // no limit
      [
        [action, reanimateInfantry, actionVisible, true]
      ]
    ],

    // 18
    [
      'Cavalry',
      '<img width=24 height=24 src="data:image/png;base64,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"/>',
      ,  // no limit
      [
        [action, reanimateCavalry, actionVisible, true]
      ]
    ]
  );
}