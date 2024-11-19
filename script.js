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
} from "./ui.js";

import { GameState, setGameState, resetGameState } from "./state.js";

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
  resetGameState();
  const wager = getWagerInput();
  setGameState("currentBet", wager);
  updateBankrollDisplay(GameState.bankroll);
  toggleView();

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

  setTimeout(() => {
    staticCardForTesting = { suit: "♠", rank: "5", value: 5 };
    dealSingleCard(
      GameState,
      GameState.playerHandOne,
      "playerHandOne",
      staticCardForTesting
    );
    updateScore(GameState);
    updateScoreDisplay(GameState);
  }, 1000);

  // dealerHand

  setTimeout(() => {
    staticCardForTesting = { suit: "♣", rank: "A", value: 11 };
    dealSingleCard(
      GameState,
      GameState.dealerHand,
      "dealerHand",
      staticCardForTesting
    );
    updateScore(GameState);
    updateScoreDisplay(GameState);
  }, 2000);

  setTimeout(() => {
    staticCardForTesting = { suit: "♥", rank: "10", value: 10 };
    dealSingleCard(
      GameState,
      GameState.dealerHand,
      "dealerHand",
      staticCardForTesting
    );
    updateScore(GameState);
    updateScoreDisplay(GameState);
  }, 3000);
  setTimeout(() => {
    const canDouble = checkCanDouble(GameState);
    const canSplit = checkCanSplit(GameState);

    if (canDouble) {
      doubleBtn.disabled = false;
    }

    if (canSplit) {
      splitBtn.disabled = false;
    }
  }, 4000);
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
  const didBust = checkBust(GameState);
  let handScore =
    focusHand === "playerHandOne"
      ? GameState.playerHandOneScore
      : GameState.playerHandOneScore;

  console.log(GameState.playerHandOneScore);
  if (didBust) {
    let outcome = determineOutcome(GameState, handScore);
    console.log(outcome, "<--------- outcome inside playerHit function");
    outcomeAnnouncement(outcome);
    updateBankrollDisplay(GameState.bankroll);
    resetRound();
    return;
  }

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
  updateScore(GameState);
  updateScoreDisplay(GameState);
}

function playerDouble() {
  GameState.double = true;
  GameState.currentBet *= 2;

  updateScore(GameState);
  updateScoreDisplay(GameState);
}

function playerStand() {
  // will change if split is implemented, so we'd go to the other active player hand instead of dealerAction()

  dealerAction(GameState);
  let outcome = determineOutcome(GameState, GameState.playerHandOneScore); // will change to handle split logic
  outcomeAnnouncement(outcome);
  updateBankrollDisplay(GameState.bankroll);
}

// dealInitialCards()
// playerDouble()

// playerSplit()

// playerHit()

// playerStand()

// determineWinner()

// resetGame()

// More specific functions

function resetRound() {
  resetGameState();
  resetUI();
}

/* HELPER FUNCTIONS THAT MAY MOVE Modules*/
