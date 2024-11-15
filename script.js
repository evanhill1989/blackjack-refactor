import {
  addCardToHandArr,
  calculateHandScore,
  validateWager,
  updateGameStateAfterCardDeal,
} from "./gameLogic.js";
import {
  DOMElements,
  getWagerInput,
  updateBankrollDisplay,
  toggleView,
  dealCardInUI,
  updateScoreDisplay,
} from "./ui.js";
import { GameState, setGameState, resetGameState } from "./state.js";

const wagerForm = document.querySelector(".wager-form");

wagerForm.addEventListener("submit", startNewHand);

function startNewHand(event) {
  event.preventDefault();
  resetGameState();
  const wager = getWagerInput();
  setGameState("currentBet", wager);
  toggleView();

  dealInitialCards(GameState);
  GameState.dealerScore = calculateHandScore(GameState.dealerHand);
  GameState.playerScore = calculateHandScore(GameState.playerHandOne);
  console.log(GameState.dealerScore, GameState.playerScore, "Hand scores");
  updateScoreDisplay(GameState);

  if (wager <= 0) {
    alert("Please enter a valid wager amount!");
    return;
  }
}

function dealInitialCards(GameState) {
  // playerHand first

  dealSingleCard(GameState, GameState.playerHandOne, "playerHandOne");
  dealSingleCard(GameState, GameState.playerHandOne, "playerHandOne");

  dealSingleCard(GameState, GameState.dealerHand, "dealerHand");
  dealSingleCard(GameState, GameState.dealerHand, "dealerHand");
}

function dealSingleCard(GameState, handObj, handName) {
  console.log(handObj, "hand in dealSingleCard");
  addCardToHandArr(GameState, handObj);

  if (handName === "playerHandOne") {
    const cardPosition = GameState.playerHandOne.length - 1; // REFACTOR THIS OUTSIDE LOOP FOR MORE UNIVERSALITY
    console.log(cardPosition, "cardPosition in dealSingleCard");
    const card = GameState.playerHandOne[cardPosition];
    dealCardInUI(handName, card, cardPosition);
  } else if (handName === "playerHandTwo") {
    const cardPosition = GameState.playerHandTwo.length - 1;
    const card = GameState.playerHandTwo[cardPosition];
    dealCardInUI(handName, card, cardPosition);
  } else if (handName === "dealerHand") {
    const cardPosition = GameState.dealerHand.length - 1;
    const card = GameState.dealerHand[cardPosition];
    dealCardInUI(handName, card, cardPosition);
  } else {
    console.log("Invalid hand name");
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

function resetRound() {
  // Reset hands and UI for the next round
}
