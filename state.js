// state.js

import { calculateHandScore } from "./gameLogic.js";

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
  dealerHoleCardExposed: false,
  canSplit: false,
  canDouble: false,
  split: false,
  double: false,
  deadSplitHand: false,
  focusHand: "playerHandOne",
  previewHand: null,
  focusScore: 0,
  previewScore: null,
  isPlayerHandOneBust: false,
  isPlayerHandTwoBust: false,
  isDealerHandBust: false,
  playerHandOneOutcome: "", // win, lose, push,bust, resolved
  playerHandTwoOutcome: "", // win, lose, push,bust, resolved

  handOneState: "", // actionOn, standing, bust, win, lose, push, resolved
  handTwoState: null, // actionOn, standing, bust, win, lose, push, resolved
  handDealerState: "", // actionOn, bust, win, lose, push

  dealerScore: 0,
  playerHandOneScore: 0,
  playerHandTwoScore: null,
  view: "",
  actionState: "wager",
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
  GameState.split = false;
  GameState.double = false;
  GameState.focusHand = "playerHandOne";
  GameState.previewHand = "playerHandTwo";
  GameState.isPlayerHandOneBust = false;
  GameState.isPlayerHandTwoBust = false;
  GameState.isDealerHandBust = false;
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
    console.log("Player LOSEs! Bankroll is correct; in updateBankroll");
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
