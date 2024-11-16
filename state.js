// state.js

const deck = [
  { suit: "♠", rank: "A", value: 11 },
  { suit: "♠", rank: "2", value: 2 },
  { suit: "♠", rank: "3", value: 3 },
  { suit: "♠", rank: "4", value: 4 },
  { suit: "♠", rank: "5", value: 5 },
  { suit: "♠", rank: "6", value: 6 },
  { suit: "♠", rank: "7", value: 7 },
  { suit: "♠", rank: "8", value: 8 },
  { suit: "♠", rank: "9", value: 9 },
  { suit: "♠", rank: "10", value: 10 },
  { suit: "♠", rank: "J", value: 10 },
  { suit: "♠", rank: "Q", value: 10 },
  { suit: "♠", rank: "K", value: 10 },
  { suit: "♥", rank: "A", value: 11 },
  { suit: "♥", rank: "2", value: 2 },
  { suit: "♥", rank: "3", value: 3 },
  { suit: "♥", rank: "4", value: 4 },
  { suit: "♥", rank: "5", value: 5 },
  { suit: "♥", rank: "6", value: 6 },
  { suit: "♥", rank: "7", value: 7 },
  { suit: "♥", rank: "8", value: 8 },
  { suit: "♥", rank: "9", value: 9 },
  { suit: "♥", rank: "10", value: 10 },
  { suit: "♥", rank: "J", value: 10 },
  { suit: "♥", rank: "Q", value: 10 },
  { suit: "♥", rank: "K", value: 10 },
  { suit: "♣", rank: "A", value: 11 },
  { suit: "♣", rank: "2", value: 2 },
  { suit: "♣", rank: "3", value: 3 },
  { suit: "♣", rank: "4", value: 4 },
  { suit: "♣", rank: "5", value: 5 },
  { suit: "♣", rank: "6", value: 6 },
  { suit: "♣", rank: "7", value: 7 },
  { suit: "♣", rank: "8", value: 8 },
  { suit: "♣", rank: "9", value: 9 },
  { suit: "♣", rank: "10", value: 10 },
  { suit: "♣", rank: "J", value: 10 },
  { suit: "♣", rank: "Q", value: 10 },
  { suit: "♣", rank: "K", value: 10 },
  { suit: "♦", rank: "A", value: 11 },
  { suit: "♦", rank: "2", value: 2 },
  { suit: "♦", rank: "3", value: 3 },
  { suit: "♦", rank: "4", value: 4 },
  { suit: "♦", rank: "5", value: 5 },
  { suit: "♦", rank: "6", value: 6 },
  { suit: "♦", rank: "7", value: 7 },
  { suit: "♦", rank: "8", value: 8 },
  { suit: "♦", rank: "9", value: 9 },
  { suit: "♦", rank: "10", value: 10 },
  { suit: "♦", rank: "J", value: 10 },
  { suit: "♦", rank: "Q", value: 10 },
  { suit: "♦", rank: "K", value: 10 },
];

export const GameState = {
  bankroll: 1000,
  currentBet: 0,
  playerHandOne: [],
  playerHandTwo: [],
  focusHand: "playerHandOne",
  splitPreviewHand: "playerHandTwo",
  dealerHand: [],
  dealerScore: 0,
  playerScore: 0,
  gameState: "start",
  deck,
};

export function resetGameState() {
  GameState.currentBet = 0;
  GameState.playerHandOne = [];
  GameState.playerHandTwo = [];
  GameState.dealerHand = [];
  GameState.dealerScore = 0;
  GameState.playerScore = 0;
}
export function setGameState(key, value) {
  GameState[key] = value;
}

export function updateDeck() {
  /*...*/
}
