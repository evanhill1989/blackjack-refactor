import { GameState, resetGameState, updateGameState } from "./state.js";
import {
  outcomeAnnouncement,
  togglePreviewFocusDisplay,
  dealCardInUI,
  updateScoresDisplay,
} from "./ui.js";

export function dealSingleCard(GameState, handName, staticCardForTesting) {
  const card = addCardToHandArr(GameState, handName, staticCardForTesting);
  dealCardInUI(handName, card);
  // notifyObservers();
}

export function addCardToHandArr(GameState, hand, staticCardForTesting) {
  const card = staticCardForTesting || getRandomCard(GameState.deck);

  if (hand === "playerHandOne") {
    const handOne = GameState.playerHandOne;
    handOne.push(card);
    updateGameState("playerHandOne", handOne);
  } else if (hand === "playerHandTwo") {
    const handTwo = GameState.playerHandTwo;
    handTwo.push(card);
    updateGameState("playerHandTwo", handTwo);
  } else if (hand === "dealerHand") {
    const dealerHand = GameState.dealerHand;
    dealerHand.push(card);
    updateGameState("dealerHand", dealerHand);
  } else {
    console.error("Invalid hand name passed from dealSIngleCard()");
  }

  removeCurrentCardFromDeck(card, GameState.deck);
  return card;
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

export function toggleSplitHands(GameState) {
  GameState.focusHand === "playerHandOne"
    ? updateGameState("focusHand", "playerHandTwo")
    : updateGameState("focusHand", "playerHandOne");
  GameState.previewHand === "playerHandOne"
    ? updateGameState("previewHand", "playerHandTwo")
    : updateGameState("previewHand", "playerHandOne");
  togglePreviewFocusDisplay(GameState);
}
// *observer
export function checkCanSplit(GameState) {
  if (
    GameState.split === false &&
    GameState.playerHandOne[0].value === GameState.playerHandOne[1].value
  ) {
    updateGameState("canSplit", true);
  }
}

export function splitStand(GameState) {
  return action;
}

export function shouldSwitchFocusHand(handName) {
  // Could jam these all in one statement with an or chain
  if (GameState.split === false) {
    return false;
  } else if (
    GameState.handTwoState === "bust" ||
    GameState.handOneState === "bust"
  ) {
    return false;
  } else {
    return true;
  }
}

// SCORE

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
      return console.error("Error : Too many aces");
  }
}

// HIT

export function checkBust(GameState) {
  if (GameState.focusScore > 21) {
    GameState.focusHand === "playerHandOne"
      ? updateGameState("playerHandOneOutcome", "bust")
      : updateGameState("playerHandTwoOutcome", "bust");

    handleBust(GameState);
  } else {
    return false;
  }
}

export function handleBust(GameState) {
  console.log("deadSplitHand at top of handleBust", GameState.deadSplitHand);
  if (!GameState.split) {
    updateGameState("view", "wager");
    resetGameState(GameState);
  } else if (GameState.split && !GameState.deadSplitHand) {
    console.log("split in handlEbUST");
    togglePreviewFocus(GameState);
    updateGameState("deadSplitHand", true);

    // add "bust" element to new preview hand or remove preview hand altogether?
  } else if (GameState.split && GameState.deadSplitHand) {
    updateGameState("view", "wager");
    resetGameState(GameState);
  }
  console.log("deadSplitHand at bottom of handleBust", GameState.deadSplitHand);
}

export function dealerAction(GameState) {
  updateGameState("dealerHoleCardExposed", true);
  let nextAction = "";
  if (GameState.dealerScore < 17) {
    dealSingleCard(GameState, "dealerHand", {
      suit: "♠",
      rank: "8",
      value: 8,
    });
    // This is imported into script so I don't have access to it here
    // cause I'm referencing dealSingleCard from inside this file like when i run dealerAction in splitStand()
    updateScore(GameState);
    updateScoreDisplay(GameState);
    return dealerAction(GameState);
  } else if (GameState.dealerScore >= 17 && GameState.dealerScore <= 21) {
    console.log("Dealer Stands in dealerAction!");
    // updateGameState("actionState", "showdown");
    nextAction = "showdown";
  } else if (GameState.dealerScore > 21) {
    console.log("Dealer BUSTs!");
    updateGameState("isDealerHandBust", true);
    nextAction = "showdown";
  } else {
    console.error("Error: Invalid outcome inside dealerAction function");
    nextAction = "error";
  }
  console.log("nextAction in dealerAction", nextAction);
  return nextAction;
}

export function showdown(GameState) {
  if (
    GameState.playerHandOneOutcome !== "resolved" ||
    GameState.playerHandOneOutcome !== "bust"
  ) {
    togglePreviewFocusDisplay(GameState, "playerHandOne", "playerHandTwo");
    determineOutcome(GameState, GameState.playerHandOneScore);
  }
  // first compare handOne
  // ------setFocusHand("playerHandOne");
  // ------ determinOutcome
  // ------  outcomeAnnouncement for handOne
  // togglePreviewFocusDisplay
  // then compare handTwo-
  // ------setFocusHand("playerHandOne");
  // ------ determinOutcome
  // ------  outcomeAnnouncement for handOne
}

export function determineOutcome(GameState, handScore) {
  // let determineOutcome handle any hand, just return outcome to where it was called.
  console.log("determineOutcome called just once?");
  const focusHand = GameState.focusHand;
  let handOutcome =
    focusHand === "playerHandOne"
      ? "playerHandOneOutcome"
      : "playerHandTwoOutcome";
  if (GameState.dealerScore === "bust") {
    console.log("Dealer BUSTs!");
    updateGameState(handOutcome, "win");
  } else if (handScore === "bust") {
    console.log("Player BUSTs! in determineOutcome");
  } else if (GameState.dealerScore > handScore) {
    updateGameState(handOutcome, "lose");
  } else if (GameState.dealerScore < handScore) {
    updateGameState(handOutcome, "win");
  } else if (GameState.dealerScore === handScore) {
    updateGameState(handOutcome, "push");
  } else {
    console.error("Error: Invalid outcome inside determine outcome function");
  }

  let outcome = handOutcome;
  return outcome; // returns to outcomeAnnouncement(GameState, outcome)
  // updateBankrollDisplay(GameState.bankroll);
}
