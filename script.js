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

  updateScoreDisplay(GameState);

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
  staticCardForTesting = { suit: "♠", rank: "5", value: 5 };
  dealSingleCard(
    GameState,
    GameState.playerHandOne,
    "playerHandOne",
    staticCardForTesting
  );
  staticCardForTesting = { suit: "♣", rank: "A", value: 11 };

  dealSingleCard(
    GameState,
    GameState.dealerHand,
    "dealerHand",
    staticCardForTesting
  );

  staticCardForTesting = { suit: "♥", rank: "10", value: 10 };
  dealSingleCard(
    GameState,
    GameState.dealerHand,
    "dealerHand",
    staticCardForTesting
  );
}

function dealSingleCard(GameState, handObj, handName, staticCardForTesting) {
  addCardToHandArr(GameState, handObj);

  if (handName === "playerHandOne") {
    const cardPosition = GameState.playerHandOne.length - 1; // REFACTOR THIS OUTSIDE LOOP FOR MORE UNIVERSALITY

    const card = staticCardForTesting || GameState.playerHandOne[cardPosition];

    setTimeout(() => {
      dealCardInUI(handName, card, cardPosition);
    }, 1000);
  } else if (handName === "playerHandTwo") {
    const cardPosition = GameState.playerHandTwo.length - 1;
    const card = staticCardForTesting || GameState.playerHandTwo[cardPosition];
    setTimeout(() => {
      dealCardInUI(handName, card, cardPosition);
    }, 2000);
  } else if (handName === "dealerHand") {
    const cardPosition = GameState.dealerHand.length - 1;
    const card = staticCardForTesting || GameState.dealerHand[cardPosition];
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
