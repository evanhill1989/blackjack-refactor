import { GameState, resetGameState, updateGameState } from "./state.js";
import { outcomeAnnouncement } from "./ui.js";

export function addCardToHandArr(GameState, hand, staticCardForTesting) {
  const { playerHand, dealerHand, deck } = GameState;
  const card = staticCardForTesting || getRandomCard(deck);
  hand.push(card);
  removeCurrentCardFromDeck(card, deck);
}

function getRandomCard(deck) {
  const randomIndex = Math.floor(Math.random() * deck.length);
  return deck[randomIndex];
}

function removeCurrentCardFromDeck(card, deck) {
  const cardIndex = deck.indexOf(card);
  if (cardIndex !== -1) {
    deck.splice(cardIndex, 1);
  }
}

export function calculateHandScore(hand) {
  // Almost seems like this should be a method on GameState ?
  let numAces = hand.filter((card) => card.value === 11).length;
  let nonAces = hand.filter((card) => card.value !== 11);

  let nonAcesTotal = nonAces.reduce((total, card) => total + card.value, 0);

  return totalWithAces(hand, numAces, nonAcesTotal);
}

function totalWithAces(hand, numAces, nonAcesTotal) {
  switch (numAces) {
    case 0:
      return nonAcesTotal;
    case 1:
      if (nonAcesTotal <= 10) {
        return (hand.score = nonAcesTotal + 11);
      } else {
        return (hand.score = nonAcesTotal + 1);
      }
    case 2:
      if (nonAcesTotal <= 9) {
        return (hand.score = nonAcesTotal + 12);
      } else {
        return (hand.score = nonAcesTotal + 2);
      }
    case 3:
      if (nonAcesTotal <= 8) {
        return (hand.score = nonAcesTotal + 13);
      } else {
        return (hand.score = nonAcesTotal + 3);
      }
    case 4:
      if (nonAcesTotal <= 7) {
        return (hand.score = nonAcesTotal + 14);
      } else {
        return (hand.score = nonAcesTotal + 4);
      }
    default:
      return console.log("Error : Too many aces");
  }
}

export function updateGameStateAfterCardDeal(hand) {
  /*...*/
}

export function validateWager(wager, bankroll) {
  if (wager <= 0) {
    return "Wager must be greater than zero.";
  }
  if (wager > bankroll) {
    return "Wager cannot exceed your bankroll.";
  }
  return null; // No errors
}

export function checkCanDouble(GameState) {
  if (GameState.playerHandOneScore >= 9 && GameState.playerHandOneScore <= 11) {
    return true;
  }
}

// SPLIT

export function checkCanSplit(GameState) {
  if (GameState.playerHandOne[0].value === GameState.playerHandOne[1].value) {
    return true;
  }
}

export function splitStand(GameState) {
  const action = GameState.actionState;

  if (action === "splitHandOneAction") {
    GameState.actionState = "splitHandTwoAction";
    GameState.focusHand = "playerHandTwo";
    GameState.previewHand = "playerHandOne";
    return; // potential trouble if the following else if runs and interprets the actionState
  } else if (action === "splitHandTwoAction") {
    console.log(GameState, "GameState from splitStand");
    dealerAction(GameState); // this just deals cards and sets dealers handArr, and score state
    determineOutcome(GameState, GameState.playerHandTwoScore);
    if (GameState.playerHandOneScore != "bust") {
      GameState.actionState = "splitHandOneAction"; // Will i have issues assigning new value to GameState this deep?
    }
  }

  return action;
}

// SCORE
export function updateScore(GameState) {
  GameState.dealerScore = calculateHandScore(GameState.dealerHand);
  GameState.playerHandOneScore = calculateHandScore(GameState.playerHandOne);
}

// HIT

export function checkBust(GameState) {
  if (GameState.playerHandOneScore > 21) {
    console.log("Check Bust running now!");
    handleBust(GameState);
    updateGameState("playerHandOneOutcome", "bust");
  } else {
    return false;
  }
}

export function handleBust(GameState) {
  console.log("handleBust running now!");
  console.log(GameState.split);
  resetGameState(GameState);
  updateGameState("view", "wager");

  // Handle bust just keeps running too many times
  // if (
  //   GameState.playerHandOneOutcome === "bust" &&
  //   GameState.handOneBustHandled === false
  // ) {
  //   console.log("Did we get inside handleBust?");
  //   updateGameState("actionState", "end");
  //   updateGameState("handOneBustHandled", true);
  //   updateGameState("view", "wager");
  // }
}

export function dealerAction(GameState) {
  if (GameState.dealerScore < 17) {
    dealSingleCard(GameState, GameState.dealerHand, "dealerHand");
    // This is imported into script so I don't have access to it here
    // cause I'm referencing dealSingleCard from inside this file like when i run dealerAction in splitStand()
    updateScore(GameState);
    updateScoreDisplay(GameState);
    dealerAction(GameState);
  } else if (GameState.dealerScore >= 17 && GameState.dealerScore <= 21) {
    console.log("Dealer Stands in dealerAction!");
    updateGameState("actionState", "showdown");
  } else if (GameState.dealerScore > 21) {
    console.log("Dealer BUSTs!");
    GameState.dealerScore = "bust";
  } else {
    console.log("Error: Invalid outcome inside dealerAction function");
  }
}

export function determineOutcome(GameState, handScore) {
  if (GameState.dealerScore === "bust") {
    console.log("Dealer BUSTs!");
    updateGameState(GameState.playerHandOneOutcome, "win");
  } else if (handScore === "bust") {
    console.log("Player BUSTs! in determineOutcome");
  } else if (GameState.dealerScore > handScore) {
    updateGameState(GameState.playerHandOneOutcome, "lose");
  } else if (GameState.dealerScore < handScore) {
    updateGameState(GameState.playerHandOneOutcome, "win");
  } else if (GameState.dealerScore === handScore) {
    updateGameState(GameState.playerHandOneOutcome, "push");
  } else {
    console.log("Error: Invalid outcome inside determine outcome function");
  }

  let outcome = GameState.playerHandOneOutcome;
  return outcome; // returns to outcomeAnnouncement(GameState, outcome)
  // updateBankrollDisplay(GameState.bankroll);
}

// BANKROLL
