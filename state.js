// state.js

import { calculateHandScore } from "./gameLogic.js";

import { updateScoresDisplay } from "./ui.js";

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

export const NewGameState = {
  view: "wager", // game-board
  bankroll: 1000,
  currentBet: 0,

  score: {
    dealer: 0,
    handOne: 0,
    handTwo: null,
    get focus() {
      return NewGameState.hands.focusHand === "playerHandOne"
        ? this.handOne
        : this.handTwo;
    },
    get preview() {
      return NewGameState.hands.previewHand === "playerHandOne"
        ? this.handOne
        : this.handTwo;
    },
  },

  hands: {
    playerHandOne: [],
    playerHandTwo: [],
    dealerHand: [],
    focusHand: "playerHandOne",
    previewHand: null,
  },

  canSplit: false,
  canDouble: false,
  isSplit: false,
  isDouble: false,

  dealerHoleCardExposed: false,
  observers: [],

  // Add setter methods
  setFocusHand(handName) {
    if (handName === "playerHandOne" || handName === "playerHandTwo") {
      this.hands.focusHand = handName;
    } else {
      console.error("Invalid hand name!");
    }
  },

  setPreviewHand(handName) {
    if (handName === "playerHandOne" || handName === "playerHandTwo") {
      this.hands.previewHand = handName;
    } else {
      console.error("Invalid hand name!");
    }
  },
};

export const GameState = {
  bankroll: 1000,
  currentBet: 0,
  playerHandOne: [],
  playerHandTwo: [],
  dealerHand: [],
  dealerHoleCardExposed: false,
  canSplit: false,
  canDouble: false,
  isSplit: false,
  isDouble: false,
  deadSplitHand: false,
  focusHand: "playerHandOne",
  previewHand: null,

  focusScore: 0,
  previewScore: null,

  playerHandOneOutcome: "", // win, lose, push,bust, resolved
  playerHandTwoOutcome: "", // win, lose, push,bust, resolved

  handOneState: "", // actionOn, standing, bust, win, lose, push, resolved
  handTwoState: null, // actionOn, standing, bust, win, lose, push, resolved
  handDealerState: "", // actionOn, bust, win, lose, push

  dealerScore: 0,
  playerHandOneScore: 0,
  playerHandTwoScore: null,

  testState: "",
  deck: deck,
  observers: [],
};

export function resetGameState() {
  GameState.currentBet = 0;
  GameState.playerHandOne = [];
  GameState.playerHandTwo = [];
  GameState.canSplit = false;
  GameState.canDouble = false;
  GameState.isSplit = false;
  GameState.isDouble = false;
  GameState.focusHand = "playerHandOne";
  GameState.previewHand = "playerHandTwo";

  GameState.playerHandOneOutcome = ""; // win; lose; push;bust; resolved
  GameState.playerHandTwoOutcome = ""; // win; lose; push;bust; resolved

  GameState.handOneState = ""; // actionOn, standing, bust, win, lose, push, resolved
  GameState.handTwoState = null; // actionOn, standing, bust, win, lose, push, resolved
  GameState.handDealerState = ""; // actionOn, bust, win, lose, push

  GameState.dealerHand = [];
  GameState.dealerScore = 0;
  GameState.playerHandOneScore = 0;
  GameState.playerHandTwoScore = null;
  GameState.actionState = "wager";
  GameState.view = "wager";
  GameState.testState = "";
  GameState.deck = deck;

  notifyObservers();
}

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

export function updateBankroll() {
  const handOneOutcome = GameState.playerHandOneOutcome;
  const handTwoOutcome = GameState.playerHandTwoOutcome;
  if (handOneOutcome === "lose" || handTwoOutcome === "lose") {
  } else if (handOneOutcome === "win" || handTwoOutcome === "win") {
    GameState.bankroll += GameState.currentBet * 2;
  } else if (handOneOutcome === "push" || handTwoOutcome === "push") {
    GameState.bankroll += GameState.currentBet * 1;
  }
}

export function splitHandArr() {
  const handOne = GameState.playerHandOne;
  const handTwo = handOne.splice(1, 1);

  updateGameState("playerHandOne", handOne);
  updateGameState("playerHandTwo", handTwo);
}

export function updateDeck() {
  /*...*/
}
// SCORE
export function updateScores() {
  updateGameState("dealerScore", calculateHandScore(GameState.dealerHand));
  updateGameState(
    "playerHandOneScore",
    calculateHandScore(GameState.playerHandOne)
  );
  console.log("GameState.playerHandOneScore", GameState.playerHandOneScore);
  updateGameState(
    "playerHandTwoScore",
    calculateHandScore(GameState.playerHandTwo)
  );

  let focusHandName = GameState.focusHand;
  let previewHandName = GameState.previewHand;

  focusHandName === "playerHandOne"
    ? updateGameState("focusScore", GameState.playerHandOneScore)
    : updateGameState("focusScore", GameState.playerHandTwoScore);

  if (previewHandName) {
    previewHandName === "playerHandOne"
      ? updateGameState("previewScore", GameState.playerHandOneScore)
      : updateGameState("previewScore", GameState.playerHandTwoScore);
  }

  updateScoresDisplay();
}

export function setFocusScore() {}

// HANDS

export function setHandState(handName, state) {
  if (handName === "playerHandOne") {
    updateGameState("handOneState", state);
  } else if (handName === "playerHandTwo") {
    updateGameState("handTwoState", state);
  } else if (handName === "dealerHand") {
    updateGameState("handDealerState", state);
  } else {
    console.error("Invalid hand name passed from setHandState()");
  }
}

// Split State
export function getFocusHand() {
  let hand = GameState.focusHand;

  if (hand === "playerHandOne") {
    return GameState.playerHandOne;
  } else if (hand === "playerHandTwo") {
    return GameState.playerHandTwo;
  }
}
