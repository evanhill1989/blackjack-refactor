// state.js
export const GameState = {
  bankroll: 1000,
  currentBet: 0,
  playerHand: [],
  dealerHand: [],
  gameState: "start",
};

export function resetGameState() {
  /* Reset the GameState properties for a new round */
}
export function setGameState(key, value) {
  GameState[key] = value;
}
