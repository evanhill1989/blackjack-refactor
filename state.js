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
  dealerHand: [],
  canSplit: false,
  canDouble: false,
  split: false,
  double: false,
  deadSplitHand: false,
  focusHand: "playerHandOne",
  previewHand: "playerHandTwo",
  focusHandScore: 0,
  previewHandScore: 0,
  isPlayerHandOneBust: false,
  isPlayerHandTwoBust: false,
  isDealerHandBust: false,
  playerHandOneOutcome: "", // win, lose, push,bust, resolved
  playerHandTwoOutcome: "", // win, lose, push,bust, resolved

  dealerScore: 0,
  playerHandOneScore: 0,
  playerHandTwoScore: null,
  view: "",
  actionState: "wager",
  testState: "",
  deck: deck,
  observers: [],
};

// Add an observer
export function addObserver(observer) {
  GameState.observers.push(observer);
}

// Notify observers of state changes
export function notifyObservers() {
  GameState.observers.forEach((observer) => observer(GameState));
}

let updateQueue = [];
let isUpdating = false;

export function updateGameState(property, value) {
  updateQueue.push({ property, value });
  if (!isUpdating) {
    isUpdating = true;

    while (updateQueue.length > 0) {
      const update = updateQueue.shift();
      if (GameState[update.property] !== update.value) {
        GameState[update.property] = update.value;
        notifyObservers();
      }
    }

    isUpdating = false;
  }
}

export function updateBankroll(state) {
  const handOneOutcome = state.playerHandOneOutcome;
  const handTwoOutcome = state.playerHandTwoOutcome;
  if (handOneOutcome === "lose" || handTwoOutcome === "lose") {
    GameState.bankroll -= GameState.currentBet;
  } else if (handOneOutcome === "win" || handTwoOutcome === "win") {
    GameState.bankroll += GameState.currentBet;
  } else if (handOneOutcome === "push" || handTwoOutcome === "push") {
  }
}

export function resetGameState(GameState) {
  GameState.playerHandOne = [];
  GameState.currentBet = 0;
  GameState.playerHandOne = [];
  GameState.playerHandTwo = [];
  GameState.canSplit = false;
  GameState.canDouble = false;
  GameState.split = false;
  GameState.double = false;
  GameState.focusHand = "playerHandOne";
  GameState.previewHand = "playerHandTwo";
  GameState.isPlayerHandOneBust = false;
  GameState.isPlayerHandTwoBust = false;
  GameState.isDealerHandBust = false;
  GameState.playerHandOneOutcome = ""; // win; lose; push;bust; resolved
  GameState.playerHandTwoOutcome = ""; // win; lose; push;bust; resolved
  GameState.dealerHand = [];
  GameState.dealerScore = 0;
  GameState.playerHandOneScore = 0;
  GameState.playerHandTwoScore = null;
  GameState.actionState = "wager";

  GameState.testState = "";
  GameState.deck = deck;
  // GameState.observers = [];
}

export function splitHandArr(GameState) {
  const handOne = GameState.playerHandOne;
  const handTwo = handOne.splice(1, 1);

  updateGameState("playerHandOne", handOne);
  updateGameState("playerHandTwo", handTwo);
}

export function updateDeck() {
  /*...*/
}
