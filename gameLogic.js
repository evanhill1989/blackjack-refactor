export function addCardToHandArr(GameState, hand) {
  const { playerHand, dealerHand, deck } = GameState;
  const card = getRandomCard(deck);
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

function checkBust(hand) {
  // Returns true if hand is bust
}
