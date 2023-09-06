// indices
export const lastAttackTimer = 0;
export const lastAttackPop = 1;

const gameData = [];
export default gameData;

export function initGameData() {
  gameData.push.call(gameData,
    // game data only ever has 1 index value
    []
  )
}