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
  GameState.playerScore = calculateHandScore(GameState.playerHand);
  console.log(GameState.dealerScore, GameState.playerScore, "Hand scores");
  updateScoreDisplay(GameState);

  if (wager <= 0) {
    alert("Please enter a valid wager amount!");
    return;
  }
}

function dealInitialCards(GameState) {
  // playerHand first
  addCardToHandArr(GameState, GameState.playerHand);
  dealCardInUI("playerHand", GameState.playerHand[0]);

  addCardToHandArr(GameState, GameState.playerHand, GameState.playerHand[1]);
  dealCardInUI("playerHand", GameState.playerHand[1]);

  addCardToHandArr(GameState, GameState.dealerHand);
  dealCardInUI("dealerHand", GameState.dealerHand[0]);

  addCardToHandArr(GameState, GameState.dealerHand);
  dealCardInUI("dealerHand", GameState.dealerHand[1]);
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
