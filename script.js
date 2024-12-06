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
// addObserver(checkCanSplit);
addObserver(updateScores);

const wagerForm = document.querySelector(".wager-form");

console.log(GameState.playerHandOne, "GameState.playerHandOne in script.js");

// BUTTONS
const hitBtn = document.getElementById("hit-btn");
const splitBtn = document.getElementById("split-btn");
const doubleBtn = document.getElementById("double-btn");
const standBtn = document.getElementById("stand-btn");

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

function dealInitialCards() {
  // playerHand first
  console.log(
    GameState.playerHandOne,
    "GameState.playerHandOne in dealInitialCards()"
  );

  let staticCardForTesting = { suit: "♥", rank: "5", value: 5 };
  dealSingleCard("playerHandOne");

  updateScoresDisplay();

  staticCardForTesting = { suit: "♠", rank: "5", value: 5 };
  dealSingleCard("playerHandOne");

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
  console.log(handName, "focushand name in playerHit()");
  dealSingleCard(handName);
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
  console.log(GameState.handOneState, GameState.handTwoState),
    "handStates in resolveGame";
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
