import {
  dealSingleCard,
  addCardToHandArr,
  updateScore,
  calculateHandScore,
  validateWager,
  checkBust,
  dealerAction,
  determineOutcome,
  checkCanDouble,
  checkCanSplit,
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
  updateScoreDisplay,
  outcomeAnnouncement,
  resetUI,
  splitUI,
  splitStandUI,
  setFocusHand,
  setPreviewHand,
  togglePreviewFocus,
} from "./ui.js";

import {
  GameState,
  updateGameState,
  resetGameState,
  splitHandArr,
  addObserver,
  updateBankroll,
  notifyObservers,
} from "./state.js";

// UI observers

addObserver(updateBankrollDisplay);
addObserver(outcomeAnnouncement);
addObserver(toggleView);
addObserver(toggleSplitBtn);
// addObserver(updateScoreDisplay); keeping this out of observers. Feels like some race conditions with updateScore might happen, and I want fine tuning of timing of display updates anyway.

// gameState observers
addObserver(updateBankroll);

// gameLogic observers
addObserver(checkCanSplit);
addObserver(updateScore);

const wagerForm = document.querySelector(".wager-form");

// BUTTONS
const hitBtn = document.getElementById("hit-btn");
const splitBtn = document.getElementById("split-btn");
const doubleBtn = document.getElementById("double-btn");
const standBtn = document.getElementById("stand-btn");

updateBankrollDisplay(GameState.bankroll);

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

  updateGameState("focusHandScore", GameState.playerHandOneScore);

  console.log(GameState.focusHandScore, "focusHandScore in startNewHand");
}

function dealInitialCards(GameState) {
  // playerHand first

  let staticCardForTesting = { suit: "♥", rank: "5", value: 5 };
  dealSingleCard(GameState, "playerHandOne", staticCardForTesting);
  updateScore(GameState); // !!!!! THESE WILL CHANGE WHEN I FINE TUNE UI TIMING.
  updateScoreDisplay(GameState);

  staticCardForTesting = { suit: "♠", rank: "5", value: 5 };
  dealSingleCard(GameState, "playerHandOne", staticCardForTesting);
  updateScore(GameState);
  updateScoreDisplay(GameState);

  // dealerHand

  staticCardForTesting = { suit: "♣", rank: "4", value: 4 };
  dealSingleCard(GameState, "dealerHand", staticCardForTesting);
  updateScore(GameState);
  updateScoreDisplay(GameState);

  staticCardForTesting = { suit: "♥", rank: "9", value: 9 };
  dealSingleCard(GameState, "dealerHand", staticCardForTesting);
  updateScore(GameState);
  updateScoreDisplay(GameState);

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
  // updateScoreDisplay(GameState);

  notifyObservers(); // heavy handed , cleaner if actual state change triggered notify...
  updateScoreDisplay(GameState);
  checkBust(GameState);
}

function playerSplit() {
  updateGameState("split", true);
  updateGameState("bankroll", GameState.bankroll - GameState.currentBet);
  splitHandArr(GameState);

  updateScoreDisplay(GameState);
  splitUI(GameState);

  updateGameState("canSplit", false);
}

function playerDouble() {
  GameState.double = true;
  GameState.currentBet *= 2;

  updateScore(GameState);
  updateScoreDisplay(GameState);
}

function playerStand() {
  // will change if split is implemented, so we'd go to the other active player hand instead of dealerAction()

  if (!GameState.split) {
    dealerAction(GameState);
    // determineOutcome(GameState, GameState.playerHandOneScore); // will change to handle split logic

    updateBankrollDisplay(GameState.bankroll);
  } else if (GameState.split) {
    splitStand(GameState);
    setFocusHand(GameState);
    setPreviewHand(GameState);

    // splitStandUI(GameState); Might not be needed .

    // splitStandUI(GameState);
  }
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
