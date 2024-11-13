// state.js

const deck = [
  { suit: "♠", value: "A" },
  { suit: "♠", value: "2" },
  { suit: "♠", value: "3" },
  { suit: "♠", value: "4" },
  { suit: "♠", value: "5" },
  { suit: "♠", value: "6" },
  { suit: "♠", value: "7" },
  { suit: "♠", value: "8" },
  { suit: "♠", value: "9" },
  { suit: "♠", value: "10" },
  { suit: "♠", value: "J" },
  { suit: "♠", value: "Q" },
  { suit: "♠", value: "K" },
  { suit: "♥", value: "A" },
  { suit: "♥", value: "2" },
  { suit: "♥", value: "3" },
  { suit: "♥", value: "4" },
  { suit: "♥", value: "5" },
  { suit: "♥", value: "6" },
  { suit: "♥", value: "7" },
  { suit: "♥", value: "8" },
  { suit: "♥", value: "9" },
  { suit: "♥", value: "10" },
  { suit: "♥", value: "J" },
  { suit: "♥", value: "Q" },
  { suit: "♥", value: "K" },
  { suit: "♣", value: "A" },
  { suit: "♣", value: "2" },
  { suit: "♣", value: "3" },
  { suit: "♣", value: "4" },
  { suit: "♣", value: "5" },
  { suit: "♣", value: "6" },
  { suit: "♣", value: "7" },
  { suit: "♣", value: "8" },
  { suit: "♣", value: "9" },
  { suit: "♣", value: "10" },
  { suit: "♣", value: "J" },
  { suit: "♣", value: "Q" },
  { suit: "♣", value: "K" },
  { suit: "♦", value: "A" },
  { suit: "♦", value: "2" },
  { suit: "♦", value: "3" },
  { suit: "♦", value: "4" },
  { suit: "♦", value: "5" },
  { suit: "♦", value: "6" },
  { suit: "♦", value: "7" },
  { suit: "♦", value: "8" },
  { suit: "♦", value: "9" },
  { suit: "♦", value: "10" },
  { suit: "♦", value: "J" },
  { suit: "♦", value: "Q" },
  { suit: "♦", value: "K" },
];

export const GameState = {
  bankroll: 1000,
  currentBet: 0,
  playerHand: [],
  dealerHand: [],
  dealerScore: 0,
  playerScore: 0,
  gameState: "start",
  deck,
};

export function resetGameState() {
  /* Reset the GameState properties for a new round */
}
export function setGameState(key, value) {
  GameState[key] = value;
}

export function updateDeck() {
  /*...*/
}
