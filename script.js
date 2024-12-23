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
  doubleHit,
} from "./gameLogic.js";

import {
  toggleView,
  toggleSplitBtn,
  updateBankrollDisplay,
  getWagerInput,
  updateScoresDisplay,
  outcomeAnnouncement,
  splitUI,
  renderSplitHands,
  toggleDoubleBtn,
} from "./ui.js";

import {
  GameState,
  updateGameState,
  updateScores,
  resetGameState,
  getFocusHand,
  setHandState,
  addObserver,
  notifyObservers,
} from "./state.js";

// UI observers

addObserver(updateBankrollDisplay);
addObserver(outcomeAnnouncement);
addObserver(toggleView);
addObserver(toggleSplitBtn);
addObserver(toggleDoubleBtn);
addObserver(renderSplitHands);

// addObserver(updateScoresDisplay); keeping this out of observers. Feels like some race conditions with updateScores might happen, and I want fine tuning of timing of display updates anyway.

// gameState observers

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

  let staticCardForTesting = { suit: "♥", rank: "5", value: 5 };
  dealSingleCard("userFirst", staticCardForTesting);

  staticCardForTesting = { suit: "♠", rank: "5", value: 5 };
  dealSingleCard("userFirst", staticCardForTesting);

  // dealerHand

  staticCardForTesting = { suit: "♣", rank: "4", value: 4 };
  dealSingleCard("dealer", staticCardForTesting);

  staticCardForTesting = { suit: "♥", rank: "9", value: 9 };
  dealSingleCard("dealer", staticCardForTesting);

  checkCanDouble();
  checkCanSplit();
}

function playerHit() {
  if (!GameState.isDouble) {
    dealSingleCard(GameState.hands.focus, { suit: "♣", rank: "K", value: 10 });

    notifyObservers(); // heavy handed , cleaner if actual state change triggered notify...
    updateScoresDisplay();
    checkBust();
  } else {
    doubleHit();
  }
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
}

function playerDouble() {
  updateGameState("isDouble", true);
  updateGameState("bankroll", GameState.bankroll - GameState.currentBet);

  splitHandArr();
  splitUI();
  updateScoresDisplay();

  updateGameState("canDouble", false);

  doubleHit();
}

async function playerStand() {
  let handName = GameState.hands.focus;

  updateGameState(`hands.${handName}.outcome`, "standing");
  if (!GameState.isSplit) {
    determineOutcome();
    resetGameState();
  } else if (GameState.isSplit) {
    if (GameState.hands.focus === "userFirst") {
      switchToSecondHand();
    } else if (
      GameState.hands.focus === "userSecond" &&
      GameState.hands.userFirst.outcome === "standing"
    ) {
      await splitShowdown();
      setTimeout(() => {
        if (GameState.hands.userSecond.resolved === false) {
          switchToSecondHand();

          determineOutcome();
          resetGameState();
        }
      }, 1500);
    } else if (
      GameState.hands.focus === "userSecond" &&
      GameState.hands.userFirst.resolved === true
    ) {
      determineOutcome();
      resetGameState();
    }
  }

  // if (
  //   GameState.hands.userFirst.outcome === "standing" &&
  //   GameState.hands.userSecond.outcome === "standing"
  // ) {
  //   await splitShowdown();
  //   resolveGame();
  //   return;
  // }
}

// More specific functions

/* HELPER FUNCTIONS THAT MAY MOVE Modules*/

export function switchToSecondHand() {
  updateGameState(`hands.focus`, "userSecond");
  updateGameState(`hands.preview`, "userFirst");
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

export function resolveGame() {
  let resolver = shouldResolveGame();
  resolver ? resetGameState() : false;

  // if (GameState.split === true) {
  //   if (
  //     GameState.handOneState === "resolved" &&
  //     GameState.handTwoState === "resolved"
  //   ) {
  //     resetGameState();
  //   }
  // }
}
