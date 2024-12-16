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
  splitHandArr,
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
  GameState,
  updateGameState,
  updateScores,
  resetGameState,
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

// test buttons
const testBtnWager = document.getElementById("test-btn-wager");
const testBtnGameBoard = document.getElementById("test-btn-game-board");

updateBankrollDisplay();

testBtnWager.addEventListener("click", () => {
  console.log(GameState);
});

testBtnGameBoard.addEventListener("click", () => {
  notifyObservers();
  console.log(GameState);
});

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
    GameState.hands.userFirst.cards,
    "GameState.playerHandOne in dealInitialCards()"
  );

  let staticCardForTesting = { suit: "♥", rank: "A", value: 11 };
  dealSingleCard("userFirst", staticCardForTesting);

  updateScoresDisplay();

  staticCardForTesting = { suit: "♠", rank: "A", value: 11 };
  dealSingleCard("userFirst", staticCardForTesting);

  updateScoresDisplay();

  // dealerHand

  staticCardForTesting = { suit: "♣", rank: "4", value: 4 };
  dealSingleCard("dealer", staticCardForTesting);

  updateScoresDisplay();

  staticCardForTesting = { suit: "♥", rank: "9", value: 9 };
  dealSingleCard("dealer", staticCardForTesting);

  updateScoresDisplay();

  const canDouble = checkCanDouble();
  const canSplit = checkCanSplit();

  if (canDouble) {
    doubleBtn.disabled = false;
  }

  if (canSplit) {
    splitBtn.disabled = false;
  }
  console.log("userFirst handscore", GameState.hands.userFirst.score);
}

function playerHit() {
  dealSingleCard(GameState.hands.focus, { suit: "♣", rank: "K", value: 10 });
  // updateScoresDisplay();
  console.log(
    GameState.hands.focusHand.score,
    "focusHand.score in playerHit()"
  );

  notifyObservers(); // heavy handed , cleaner if actual state change triggered notify...
  updateScoresDisplay();
  checkBust();
  // const didBust = checkBust();
  // if (didBust) {
  //   setTimeout(() => resetGameState(), 0); // Defer reset to end of event loop
  // }
}

function playerSplit() {
  updateGameState("isSplit", true);
  updateGameState("bankroll", GameState.bankroll - GameState.currentBet);

  splitHandArr();
  updateGameState("hands.focus", "userFirst");
  updateGameState("hands.preview", "userSecond");

  updateScoresDisplay();
  splitUI();

  updateGameState("canSplit", false);
  console.log(
    GameState.hands.focusHand,
    "GameState.focusHand in playerSplit()"
  );
  console.log(
    GameState.hands.previewHand,
    "GameState.previewHand in playerSplit()"
  );
}

function playerDouble() {
  GameState.isDouble = true;
  GameState.currentBet *= 2;

  updateScores();
  updateScoresDisplay();
}

async function playerStand() {
  let handName = GameState.hands.focus;

  updateGameState(`hands.${handName}.outcome`, "standing");

  if (
    GameState.hands.userFirst.outcome === "standing" &&
    GameState.hands.userSecond.outcome === "standing"
  ) {
    await splitShowdown();

    resolveGame();
    return;
  }
  shouldToggleSplitHands(handName) ? toggleSplitHands() : determineOutcome();

  resolveGame();
}

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
    GameState.hands.userFirst.resolved === true &&
    GameState.hands.userSecond.resolved === true
  ) {
    return true;
  } else {
    return false;
  }
}
