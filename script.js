import {
  dealSingleCard,
  addCardToHandArr,
  calculateHandScore,
  validateWager,
  checkBust,
  dealerAction,
  determineOutcome,
  checkCanDouble,
  checkCanSplit,
  shouldSwitchFocusHand,
  toggleSplitHands,
  splitStand,
  handleBust,
} from "./gameLogic.js";

import {
  toggleView,
  toggleSplitBtn,
  updateBankrollDisplay,
  getWagerInput,
  dealCardInUI,
  generateCardHTML,
  updateScoresDisplay,
  outcomeAnnouncement,
  resetUI,
  splitUI,
  splitStandUI,
  setFocusHand,
  setPreviewHand,
  togglePreviewFocusDisplay,
} from "./ui.js";

import {
  GameState,
  updateGameState,
  updateScores,
  resetGameState,
  splitHandArr,
  getFocusHand,
  setHandState,
  addObserver,
  updateBankroll,
  notifyObservers,
} from "./state.js";

// UI observers

addObserver(updateBankrollDisplay);
addObserver(outcomeAnnouncement);
addObserver(toggleView);
addObserver(toggleSplitBtn);
// addObserver(updateScoresDisplay); keeping this out of observers. Feels like some race conditions with updateScores might happen, and I want fine tuning of timing of display updates anyway.

// gameState observers
addObserver(updateBankroll);

// gameLogic observers
addObserver(checkCanSplit);
addObserver(updateScores);

const wagerForm = document.querySelector(".wager-form");

// BUTTONS
const hitBtn = document.getElementById("hit-btn");
const splitBtn = document.getElementById("split-btn");
const doubleBtn = document.getElementById("double-btn");
const standBtn = document.getElementById("stand-btn");

console.log(GameState.bankroll, "bankroll in script.js");
updateBankrollDisplay(GameState);

wagerForm.addEventListener("submit", startNewHand);

hitBtn.addEventListener("click", playerHit);
splitBtn.addEventListener("click", playerSplit);
doubleBtn.addEventListener("click", playerDouble);
standBtn.addEventListener("click", playerStand);

function startNewHand(event) {
  event.preventDefault();

  const wager = getWagerInput();
  if (wager <= 0) {
    alert("Please enter a valid wager amount!");
    return;
  }

  dealInitialCards(GameState);

  updateGameState("currentBet", wager);
  updateGameState("bankroll", GameState.bankroll - wager);
  updateGameState("actionState", "running");
  updateGameState("view", "game-board");
}

function dealInitialCards(GameState) {
  // playerHand first

  let staticCardForTesting = { suit: "♥", rank: "5", value: 5 };
  dealSingleCard(GameState, "playerHandOne", staticCardForTesting);

  updateScoresDisplay();

  staticCardForTesting = { suit: "♠", rank: "5", value: 5 };
  dealSingleCard(GameState, "playerHandOne", staticCardForTesting);

  updateScoresDisplay();

  // dealerHand

  staticCardForTesting = { suit: "♣", rank: "4", value: 4 };
  dealSingleCard(GameState, "dealerHand", staticCardForTesting);

  updateScoresDisplay();

  staticCardForTesting = { suit: "♥", rank: "9", value: 9 };
  dealSingleCard(GameState, "dealerHand", staticCardForTesting);

  updateScoresDisplay();

  const canDouble = checkCanDouble(GameState);
  const canSplit = checkCanSplit(GameState);

  if (canDouble) {
    doubleBtn.disabled = false;
  }

  if (canSplit) {
    splitBtn.disabled = false;
  }
}

function playerHit() {
  let handName = GameState.focusHand;

  dealSingleCard(GameState, handName);
  // updateScoresDisplay(GameState);

  notifyObservers(); // heavy handed , cleaner if actual state change triggered notify...
  updateScoresDisplay(GameState);
  checkBust(GameState);
}

function playerSplit() {
  updateGameState("split", true);
  updateGameState("bankroll", GameState.bankroll - GameState.currentBet);

  splitHandArr(GameState);
  updateGameState("focusHand", "playerHandOne");
  updateGameState("previewHand", "playerHandTwo");

  updateScoresDisplay(GameState);
  splitUI(GameState);

  updateGameState("canSplit", false);
}

function playerDouble() {
  GameState.double = true;
  GameState.currentBet *= 2;

  updateScores(GameState);
  updateScoresDisplay(GameState);
}

function playerStand() {
  let handName = GameState.focusHand;

  console.log(handName, "hand in playerStand");
  setHandState(handName, "standing");
  shouldSwitchFocusHand(handName) ? toggleSplitHands() : determineOutcome();
}

// dealInitialCards()
// playerDouble()

// playerSplit()

// playerHit()

// playerStand()

// determineWinner()

// resetGame()

// More specific functions

/* HELPER FUNCTIONS THAT MAY MOVE Modules*/
