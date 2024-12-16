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
  renderFocusHand,
} from "./ui.js";

export function dealSingleCard(handName, staticCardForTesting) {
  const card = addCardToHandArr(handName, staticCardForTesting);
  dealCardInUI(handName, card);
  // notifyObservers();
}

export function addCardToHandArr(hand, staticCardForTesting) {
  const card = staticCardForTesting || getRandomCard();

  const targetHand = GameState.hands[hand];

  if (targetHand) {
    targetHand.cards.push(card);
    updateGameState(`hands.${hand}.cards`, targetHand.cards);
  } else {
    console.error("Invalid hand name passed from dealSingleCard()");
  }

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

export function splitHandArr() {
  const handOne = GameState.hands.userFirst.cards;
  const handTwo = handOne.splice(1, 1);

  updateGameState("playerHandOne", handOne);
  updateGameState("playerHandTwo", handTwo);
}

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
  GameState.hands.focus === "userFirst"
    ? updateGameState("hands.focus", "userSecond")
    : updateGameState("hands.focus", "userFirst");
  GameState.hands.preview === "userFirst"
    ? updateGameState("hands.preview", "userSecond")
    : updateGameState("hands.preview", "userFirst");
  togglePreviewFocusDisplay(); // First, is the GameState update above completed in time for this? this probably makes more sense as an observer function watching for changes to hands.focus/hands.preview
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
  let total = nonAcesTotal + numAces * 11; // Start by counting all aces as 11

  // Downgrade Aces from 11 to 1 if the total exceeds 21
  while (total > 21 && numAces > 0) {
    total -= 10; // Convert one Ace from 11 to 1
    numAces--;
  }

  return total;
}

// HIT

export function checkBust() {
  const focusHandScore = GameState.hands.focusHand.score;
  const userFirstScore = GameState.hands.userFirst.score;
  console.log(focusHandScore, "focusHandScore in checkBust()");
  console.log(userFirstScore, "userFirstScore in checkBust()");
  focusHandScore > 21 ? handleBust() : false;
}

export function handleBust() {
  const focusHandName = GameState.hands.focus;

  updateGameState(`hands.${focusHandName}.outcome`, "bust");
  updateGameState(`hands.${focusHandName}.resolved`, true);
  if (GameState.isSplit === false) {
    updateGameState("view", "wager");
    resetGameState();
  } else if (GameState.isSplit === true) {
    // base next logic on both resolved?
    GameState.hands.userFirst.resolved === false ||
    GameState.hands.userSecond.resolved === false
      ? toggleSplitHands()
      : resolveGame();
  } else {
    console.error(
      "Error: Invalid outcome inside handleBust function for GameState.isSplit -->",
      GameState.isSplit
    );
  }
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
