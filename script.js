import {
  addCardToHandArr,
  updateScore,
  calculateHandScore,
  validateWager,
  updateGameStateAfterCardDeal,
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
  handlePlayerBust,
} from "./ui.js";

import {
  GameState,
  updateGameState,
  resetGameState,
  splitHandArr,
  addObserver,
  updateBankroll,
} from "./state.js";

// UI observers
addObserver(handlePlayerBust);
addObserver(updateBankrollDisplay);
addObserver(outcomeAnnouncement);
addObserver(toggleView);

// gameState observers
addObserver(updateBankroll);
// addObserver(resetGameState);

// gameLogic observers
// addObserver(handleBust);

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
  console.log("startNewHand at top");
  event.preventDefault();

  const wager = getWagerInput();
  updateGameState("currentBet", wager);
  updateGameState("bankroll", GameState.bankroll - wager);
  updateGameState("actionState", "running");
  updateGameState("view", "game-board");

  dealInitialCards(GameState);

  if (wager <= 0) {
    alert("Please enter a valid wager amount!");
    return;
  }
}

function dealInitialCards(GameState) {
  // playerHand first

  let staticCardForTesting = { suit: "♥", rank: "5", value: 5 };
  dealSingleCard(
    GameState,
    GameState.playerHandOne,
    "playerHandOne",
    staticCardForTesting
  );
  updateScore(GameState); // !!!!! THESE WILL CHANGE WHEN I FINE TUNE UI TIMING.
  updateScoreDisplay(GameState);

  staticCardForTesting = { suit: "♠", rank: "5", value: 5 };
  dealSingleCard(
    GameState,
    GameState.playerHandOne,
    "playerHandOne",
    staticCardForTesting
  );
  updateScore(GameState);
  updateScoreDisplay(GameState);

  // dealerHand

  staticCardForTesting = { suit: "♣", rank: "4", value: 4 };
  dealSingleCard(
    GameState,
    GameState.dealerHand,
    "dealerHand",
    staticCardForTesting
  );
  updateScore(GameState);
  updateScoreDisplay(GameState);

  staticCardForTesting = { suit: "♥", rank: "9", value: 9 };
  dealSingleCard(
    GameState,
    GameState.dealerHand,
    "dealerHand",
    staticCardForTesting
  );
  updateScore(GameState);
  updateScoreDisplay(GameState);

  setTimeout(() => {
    const canDouble = checkCanDouble(GameState);
    const canSplit = checkCanSplit(GameState);

    if (canDouble) {
      doubleBtn.disabled = false;
    }

    if (canSplit) {
      splitBtn.disabled = false;
    }
  }, 300);
}

function dealSingleCard(GameState, handObj, handName, staticCardForTesting) {
  addCardToHandArr(GameState, handObj, staticCardForTesting);

  if (handName === "playerHandOne") {
    const cardPosition = GameState.playerHandOne.length - 1; // REFACTOR THIS OUTSIDE LOOP FOR MORE UNIVERSALITY

    const card = staticCardForTesting || GameState.playerHandOne[cardPosition];

    dealCardInUI(handName, card, cardPosition);
  } else if (handName === "playerHandTwo") {
    const cardPosition = GameState.playerHandTwo.length - 1;
    const card = staticCardForTesting || GameState.playerHandTwo[cardPosition];

    dealCardInUI(handName, card, cardPosition);
  } else if (handName === "dealerHand") {
    const cardPosition = GameState.dealerHand.length - 1;
    const card = staticCardForTesting || GameState.dealerHand[cardPosition];
    dealCardInUI(handName, card, cardPosition);
  } else {
    console.log("Invalid hand name");
  }
}

function playerHit() {
  let focusHand = GameState.focusHand;
  let handObj =
    focusHand === "playerHandOne"
      ? GameState.playerHandOne
      : GameState.playerHandTwo;

  dealSingleCard(GameState, handObj, focusHand);
  updateScore(GameState); // !!!!! THESE updateScore functions WILL CHANGE WHEN I FINE TUNE UI CARD DEAL TIMING
  updateScoreDisplay(GameState);

  // Check for bust and update state
  checkBust(GameState);

  // Triggers `handlePlayerBust`

  // if checkBust
  // if no - return
  // if yes
  // is playerHandTwo?
  // if no - return then proceed to settle playerHandOne as a loss
  // if yes - check if action is complete on both hands
  // if preview hand is still active anounce bust for current hand and switch focus hand
  // if preview hand NOT active announce bust and settle current hand as a loss
  // then if preview hand was bust reset game, trans to wager screen
  // if preview hand was NOT bust turn action to dealer and determine outcome
}

function playerSplit() {
  console.log("split");
  GameState.split = true;
  splitHandArr(GameState);
  updateScore(GameState);
  updateScoreDisplay(GameState);
  splitUI(GameState);
  GameState.actionState = "splitHandOneAction";
}

function playerDouble() {
  GameState.double = true;
  GameState.currentBet *= 2;

  updateScore(GameState);
  updateScoreDisplay(GameState);
}

function playerStand() {
  // will change if split is implemented, so we'd go to the other active player hand instead of dealerAction()
  console.log("playerStand is running");
  if (!GameState.split) {
    dealerAction(GameState);
    determineOutcome(GameState, GameState.playerHandOneScore); // will change to handle split logic

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
