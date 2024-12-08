import { resolveGame } from "./script.js";
import {
  GameState,
  notifyObservers,
  resetGameState,
  updateGameState,
} from "./state.js";
import {
  outcomeAnnouncement,
  togglePreviewFocusDisplay,
  dealCardInUI,
  updateScoresDisplay,
  setFocusHand,
} from "./ui.js";

export function dealSingleCard(handName, staticCardForTesting) {
  const card = addCardToHandArr(handName, staticCardForTesting);
  dealCardInUI(handName, card);
  // notifyObservers();
}

export function addCardToHandArr(hand, staticCardForTesting) {
  const card = staticCardForTesting || getRandomCard();

  const targetHand = GameState.hands[hand];

  console.log("targetHand", targetHand);

  if (targetHand) {
    targetHand.cards.push(card);
    updateGameState(`hands.${hand}.cards`, targetHand.cards);
  } else {
    console.error("Invalid hand name passed from dealSingleCard()");
  }

  // if (hand === "playerHandOne") {
  //   const handOne = GameState.playerHandOne;
  //   handOne.push(card);
  //   updateGameState("playerHandOne", handOne);
  // } else if (hand === "playerHandTwo") {
  //   const handTwo = GameState.playerHandTwo;
  //   handTwo.push(card);
  //   updateGameState("playerHandTwo", handTwo);
  // } else if (hand === "dealerHand") {
  //   const dealerHand = GameState.dealerHand;
  //   dealerHand.push(card);
  //   updateGameState("dealerHand", dealerHand);
  // } else {
  //   console.error("Invalid hand name passed from dealSingleCard()");
  // }

  removeCurrentCardFromDeck(card, GameState.deck);
  return card;
}

function getRandomCard() {
  const deck = GameState.deck;
  const randomIndex = Math.floor(Math.random() * GameState.deck.length);
  return deck[randomIndex];
}

function removeCurrentCardFromDeck(card, deck) {
  const cardIndex = deck.indexOf(card);
  if (cardIndex !== -1) {
    deck.splice(cardIndex, 1);
  }
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

export function checkCanDouble() {
  if (GameState.playerHandOneScore >= 9 && GameState.playerHandOneScore <= 11) {
    return true;
  }
}

// SPLIT

export function shouldToggleSplitHands(handName) {
  // Could jam these all in one statement with an or chain
  if (GameState.isSplit === false) {
    return false;
  } else if (
    GameState.hands.userSecond.outcome === "bust" ||
    GameState.hands.userFirst.outcome === "bust"
  ) {
    return false;
  } else if (GameState.hands.userFirst.outcome === "standing") {
    return true;
  }
}

export function toggleSplitHands() {
  GameState.focusHand === "playerHandOne"
    ? updateGameState("focusHand", "playerHandTwo")
    : updateGameState("focusHand", "playerHandOne");
  GameState.previewHand === "playerHandOne"
    ? updateGameState("previewHand", "playerHandTwo")
    : updateGameState("previewHand", "playerHandOne");
  togglePreviewFocusDisplay();
}
// *observer
export function checkCanSplit() {
  if (
    GameState.isSplit === false &&
    GameState.hands.userFirst.cards[0].value ===
      GameState.hands.userFirst.cards[1].value
  ) {
    updateGameState("canSplit", true);
  }
}

export async function splitShowdown() {
  updateGameState("focusHand", "playerHandOne");
  updateGameState("previewHand", "playerHandTwo");
  togglePreviewFocusDisplay();
  determineOutcome();

  setTimeout(() => {
    updateGameState("focusHand", "playerHandTwo");
    updateGameState("previewHand", "playerHandOne");
    togglePreviewFocusDisplay();
    setTimeout(() => {
      determineOutcome();
    }, 1000);
  }, 2000);
}

// SCORE

export function calculateHandScore(hand) {
  // Almost seems like this should be a method on GameState ?

  // console.log(hand[0].value, "hand[0].value in calculateHandScore()");
  let numAces = hand.filter((card) => card.value === 11).length;
  let nonAces = hand.filter((card) => card.value !== 11);

  let nonAcesTotal = nonAces.reduce((total, card) => total + card.value, 0);

  return totalWithAces(numAces, nonAcesTotal);
}

function totalWithAces(numAces, nonAcesTotal) {
  let total = nonAcesTotal;
  for (let i = 0; i < numAces; i++) {
    if (total + 11 <= 21) {
      total += 11; // Count Ace as 11 if it doesn't cause a bust
    } else {
      total += 1; // Count Ace as 1 otherwise
    }
  }
  return total;
}

// function totalWithAces(hand, numAces, nonAcesTotal) {
//   switch (numAces) {
//     case 0:
//       return nonAcesTotal;
//     case 1:
//       if (nonAcesTotal <= 10) {
//         return (hand.score = nonAcesTotal + 11);
//       } else {
//         return (hand.score = nonAcesTotal + 1);
//       }
//     case 2:
//       if (nonAcesTotal <= 9) {
//         return (hand.score = nonAcesTotal + 12);
//       } else {
//         return (hand.score = nonAcesTotal + 2);
//       }
//     case 3:
//       if (nonAcesTotal <= 8) {
//         return (hand.score = nonAcesTotal + 13);
//       } else {
//         return (hand.score = nonAcesTotal + 3);
//       }
//     case 4:
//       if (nonAcesTotal <= 7) {
//         return (hand.score = nonAcesTotal + 14);
//       } else {
//         return (hand.score = nonAcesTotal + 4);
//       }
//     default:
//       return console.error("Error : Too many aces");
//   }
// }

// HIT

export function checkBust() {
  const focusHand = GameState.hands.focus;
  console.log(focusHand, "focusHand in checkBust()");
  GameState.hands.focus.score > 21 ? handleBust() : false;
}

export function handleBust() {
  const focusHand = GameState.hands.focus;

  updateGameState(`hands.${focusHand}.outcome`, "bust");
  if (!GameState.isSplit) {
    updateGameState("view", "wager");

    resetGameState();
  } else if (GameState.isSplit && !GameState.deadSplitHand) {
    togglePreviewFocus();
    updateGameState("deadSplitHand", true);

    // add "bust" element to new preview hand or remove preview hand altogether?
  } else if (GameState.isSplit && GameState.deadSplitHand) {
    updateGameState("view", "wager");
    resetGameState();
  }
  updateGameState(focusOutcome, "resolved");
}

export function dealerAction() {
  updateGameState("dealerHoleCardExposed", true);

  if (GameState.dealerScore < 17) {
    dealSingleCard("dealerHand", {
      suit: "♠",
      rank: "8",
      value: 8,
    });

    notifyObservers(); // because I'm not closing this function before calling it again, so i have to notify observers manually before I call it again to get the updated dealerScore state
    updateScoresDisplay();
    dealerAction();
  } else if (GameState.dealerScore >= 17 && GameState.dealerScore <= 21) {
    return;
  } else if (GameState.dealerScore > 21) {
    updateGameState("isDealerHandBust", true);
  } else {
    console.error("Error: Invalid outcome inside dealerAction function");
  }
}

export function determineOutcome() {
  const handOutcome =
    GameState.focusHand === "playerHandOne" ? "handOneState" : "handTwoState";
  dealerAction();
  if (GameState.dealerScore === "bust") {
    updateGameState(handOutcome, "win");
  } else if (GameState.focusScore === "bust") {
    // shouldn't ever really run this code, as a player bust should be handled by handleBust() preempting the need to call determineOutcome()
  } else if (GameState.dealerScore > GameState.focusScore) {
    updateGameState(handOutcome, "lose");
  } else if (GameState.dealerScore < GameState.focusScore) {
    updateGameState(handOutcome, "win");
  } else if (GameState.dealerScore === GameState.focusScore) {
    updateGameState(handOutcome, "push");
  } else {
    console.error("Error: Invalid outcome inside determine outcome function");
  }

  updateGameState(handOutcome, "resolved");

  return handOutcome; // returns to outcomeAnnouncement(GameState, outcome)
  // updateBankrollDisplay(GameState.bankroll);
}
