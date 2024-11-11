import {
  generateCard,
  addCardToHand,
  validateWager,
  updateGameStateAfterCardDeal,
} from "./gameLogic.js";
import {
  DOMElements,
  getWagerInput,
  renderCardInUI,
  updateBankrollDisplay,
  toggleView,
} from "./ui.js";
import { GameState, setGameState, resetGameState } from "./state.js";

function startNewHand(event) {
  resetGameState();
  const wager = getWagerInput();
  setGameState("currentBet", wager);
  toggleView();

  if (wager <= 0) {
    alert("Please enter a valid wager amount!");
    return;
  }

  console.log(wager);
}

//   dealInitialCards() {
//     /*...*/
//   }

//   playerDouble() {
//     /*...*/
//   }

//   playerSplit() {
//     /*...*/
//   }

//   playerHit() {
//     /*...*/
//   }

//   playerStand() {
//     /*...*/
//   }

//   determineWinner() {
//     /*...*/
//   }

//   resetGame() {
//     /*...*/
//   }

// More specific functions

// function dealCard(hand) {
//   // Generate a card, add to `hand`, update UI accordingly
// }

// function calculateScore(hand) {
//   // Calculate and return the score of a given hand
// }

// function checkBust(hand) {
//   // Returns true if hand is bust
// }

// function updateBankrollDisplay() {
//   // Update the bankroll display in the UI
// }

// function resetRound() {
//   // Reset hands and UI for the next round
// }

// function dealNewHand(event) {
//   event.preventDefault();

//   toggleView();

//   //  get and set wager amount
//   getWager(event);
// }

// function getWager(event) {
//   const form = event.target; // Get the form element
//   const wagerInputValue = form.querySelector("#wager-input").value; // Get the input value
// }
