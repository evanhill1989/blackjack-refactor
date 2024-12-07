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
  toggleSplitHands,
  splitShowdown,
  handleBust,
  shouldToggleSplitHands,
} from "./gameLogic.js";

import {
  toggleView,
  toggleSplitBtn,
  updateBankrollDisplay,
  getWagerInput,
  updateScoresDisplay,
  outcomeAnnouncement,
  splitUI,
} from "./ui.js";

import {
  NewGameState,
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
// addObserver(checkCanSplit);
addObserver(updateScores);

const wagerForm = document.querySelector(".wager-form");

// BUTTONS
const hitBtn = document.getElementById("hit-btn");
const splitBtn = document.getElementById("split-btn");
const doubleBtn = document.getElementById("double-btn");
const standBtn = document.getElementById("stand-btn");

updateBankrollDisplay();

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

  dealInitialCards();

  updateGameState("currentBet", wager);
  updateGameState("bankroll", GameState.bankroll - wager);

  updateGameState("view", "game-board");
}

function dealInitialCards() {
  // playerHand first
  console.log(
    GameState.playerHandOne,
    "GameState.playerHandOne in dealInitialCards()"
  );

  let staticCardForTesting = { suit: "♥", rank: "A", value: 11 };
  dealSingleCard("playerHandOne", staticCardForTesting);

  updateScoresDisplay();

  staticCardForTesting = { suit: "♠", rank: "A", value: 11 };
  dealSingleCard("playerHandOne", staticCardForTesting);

  updateScoresDisplay();

  // dealerHand

  staticCardForTesting = { suit: "♣", rank: "4", value: 4 };
  dealSingleCard("dealerHand", staticCardForTesting);

  updateScoresDisplay();

  staticCardForTesting = { suit: "♥", rank: "9", value: 9 };
  dealSingleCard("dealerHand", staticCardForTesting);

  updateScoresDisplay();

  const canDouble = checkCanDouble();
  const canSplit = checkCanSplit();

  if (canDouble) {
    doubleBtn.disabled = false;
  }

  if (canSplit) {
    splitBtn.disabled = false;
  }
}

function playerHit() {
  let handName = GameState.focusHand;

  dealSingleCard(handName);
  // updateScoresDisplay();

  notifyObservers(); // heavy handed , cleaner if actual state change triggered notify...
  updateScoresDisplay();
  const didBust = checkBust();
  if (didBust) resetGameState();
  console.log(NewGameState.score.focus);
}

function playerSplit() {
  updateGameState("split", true);
  updateGameState("bankroll", GameState.bankroll - GameState.currentBet);

  splitHandArr();
  updateGameState("focusHand", "playerHandOne");
  updateGameState("previewHand", "playerHandTwo");

  updateScoresDisplay();
  splitUI();

  updateGameState("canSplit", false);
}

function playerDouble() {
  GameState.isDouble = true;
  GameState.currentBet *= 2;

  updateScores();
  updateScoresDisplay();
}

async function playerStand() {
  let handName = GameState.focusHand;

  setHandState(handName, "standing");

  if (
    GameState.handOneState === "standing" &&
    GameState.handTwoState === "standing"
  ) {
    await splitShowdown();

    resolveGame();
    return;
  }
  shouldToggleSplitHands(handName) ? toggleSplitHands() : determineOutcome();

  resolveGame();
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
export function resolveGame() {
  const shouldResolveGame = shouldResolveGame();
  ("handStates in resolveGame");
  resetGameState();
  // if (GameState.split === true) {
  //   if (
  //     GameState.handOneState === "resolved" &&
  //     GameState.handTwoState === "resolved"
  //   ) {
  //     resetGameState();
  //   }
  // }
}

export function shouldResolveGame() {
  if (
    GameState.handOneState === "resolved" &&
    GameState.handTwoState === "resolved"
  ) {
    return true;
  } else {
    return false;
  }
}
