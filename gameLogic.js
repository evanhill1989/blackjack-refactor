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

// HIT

export function checkBust(GameState) {
  console.log("handScore = ", GameState.playerHandOneScore);
  if (GameState.playerHandOneScore > 21) {
    console.log("BUST");
    GameState.playerHandOneScore = "bust";
    return true;
  } else {
    return false;
  }
}

// SCORE
export function updateScore(GameState) {
  GameState.dealerScore = calculateHandScore(GameState.dealerHand);
  GameState.playerHandOneScore = calculateHandScore(GameState.playerHandOne);
}

export function dealerAction(GameState) {
  if (GameState.dealerScore < 17) {
    dealSingleCard(GameState, GameState.dealerHand, "dealerHand");
    updateScore(GameState);
    updateScoreDisplay(GameState);
    dealerAction(GameState);
  }
  if (GameState.dealerScore > 21) {
    console.log("Dealer BUSTs!");
    GameState.dealerScore = "bust";
  }
}

export function determineOutcome(GameState, handScore) {
  let outcome;
  console.log("inside determineOutcome , hand.score = ", handScore);
  if (handScore === "bust") {
    console.log("You BUSTED!");
    outcome = "lose";
  } else if (GameState.dealerScore > handScore) {
    outcome = "lose";
  } else if (GameState.dealerScore < handScore) {
    outcome = "win";
  } else if (GameState.dealerScore === handScore) {
    outcome = "push";
  } else {
    console.log("Error: Invalid outcome inside determine outcome function");
  }
  console.log(outcome, "outcome inside determineOutcome function");
  updateBankroll(GameState, outcome);
  return outcome; // returns to outcomeAnnouncement(GameState, outcome)
  // updateBankrollDisplay(GameState.bankroll);
}

// BANKROLL
export function updateBankroll(GameState, outcome) {
  if (outcome === "lose") {
    GameState.bankroll -= GameState.currentBet;
  } else if (outcome === "win") {
    GameState.bankroll += GameState.currentBet;
  } else if (outcome === "push") {
    console.log("PUSH");
  }
}
