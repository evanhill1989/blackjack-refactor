// state.js

import { calculateHandScore } from "./gameLogic.js";

import { updateScoresDisplay, resetUI } from "./ui.js";

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
  view: "wager", // game-board
  bankroll: 1000,
  currentBet: 0,
  deck: deck,

  hands: {
    userFirst: {
      cards: [],
      score: 0,
      outcome: null,
      resolved: false,
    },
    userSecond: {
      cards: [],
      score: null,
      outcome: null,
      resolved: false,
    },
    dealer: {
      cards: [],
      score: 0,
      outcome: null,
    },
    // Add a direct `focus` property to avoid recursion
    focus: "userFirst",
    preview: "userSecond", // Add preview property here as well
    get focusHand() {
      return this.focus === "userFirst" ? this.userFirst : this.userSecond;
    },
    get previewHand() {
      return this.preview === "userFirst" ? this.userFirst : this.userSecond;
    },
  },

  canSplit: false,
  canDouble: false,
  isSplit: false,
  isDouble: false,

  dealerHoleCardExposed: false,
  observers: [],

  // Update focus and preview via methods
  setFocusHand(handName) {
    if (handName === "userFirst" || handName === "userSecond") {
      this.hands.focus = handName;
    } else {
      console.error("Invalid hand name!");
    }
  },

  setPreviewHand(handName) {
    if (handName === "userFirst" || handName === "userSecond") {
      this.hands.preview = handName;
    } else {
      console.error("Invalid hand name!");
    }
  },
};

// export const GameState = {
//   bankroll: 1000,
//   currentBet: 0,
//   playerHandOne: [],
//   playerHandTwo: [],
//   dealerHand: [],
//   dealerHoleCardExposed: false,
//   canSplit: false,
//   canDouble: false,
//   isSplit: false,
//   isDouble: false,
//   deadSplitHand: false,
//   focusHand: "playerHandOne",
//   previewHand: null,

//   focusScore: 0,
//   previewScore: null,

//   playerHandOneOutcome: "", // win, lose, push,bust, resolved
//   playerHandTwoOutcome: "", // win, lose, push,bust, resolved

//   handOneState: "", // actionOn, standing, bust, win, lose, push, resolved
//   handTwoState: null, // actionOn, standing, bust, win, lose, push, resolved
//   handDealerState: "", // actionOn, bust, win, lose, push

//   dealerScore: 0,
//   playerHandOneScore: 0,
//   playerHandTwoScore: null,

//   testState: "",
//   deck: deck,
//   observers: [],
// };

export function resetGameState() {
  GameState.currentBet = 0;
  GameState.view = "wager";

  // Reset the hands object while preserving focus, preview, and getters
  GameState.hands.userFirst = {
    cards: [],
    score: 0,
    outcome: null,
    resolved: false,
  };
  GameState.hands.userSecond = {
    cards: [],
    score: null,
    outcome: null,
    resolved: false,
  };
  GameState.hands.dealer = {
    cards: [],
    score: 0,
    outcome: null,
  };

  GameState.canSplit = false;
  GameState.canDouble = false;
  GameState.isSplit = false;
  GameState.isDouble = false;

  // Optional: Reset focus and preview to their default states
  GameState.setFocusHand("userFirst");
  GameState.setPreviewHand("userSecond");

  GameState.testState = "";
  GameState.deck = deck;

  resetUI();

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

export function updateGameState(property, value, callback) {
  updateQueue.push({ property, value });

  if (!isUpdating) {
    isUpdating = true;

    while (updateQueue.length > 0) {
      const update = updateQueue.shift();

      // Resolve nested properties
      const keys = update.property.split(".");
      let target = GameState;

      // Traverse the object path
      for (let i = 0; i < keys.length - 1; i++) {
        if (target[keys[i]] === undefined) {
          console.error(`Invalid property path: ${update.property}`);
          return;
        }
        target = target[keys[i]];
      }

      // Update the final key
      const finalKey = keys[keys.length - 1];
      if (target[finalKey] !== update.value) {
        target[finalKey] = update.value;
        notifyObservers();
      }
    }

    isUpdating = false;

    // Execute the callback after all updates and notifications
    if (typeof callback === "function") {
      callback();
    }
  }
}

export function updateDeck() {
  /*...*/
}
// SCORE
export function updateScores() {
  GameState.hands.userFirst.score = calculateHandScore(
    GameState.hands.userFirst.cards
  );
  GameState.hands.dealer.score = calculateHandScore(
    GameState.hands.dealer.cards
  );
  GameState.hands.userSecond.score = calculateHandScore(
    GameState.hands.userSecond.cards
  );

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
