// import { deckStart } from "./data.js";

// In the middle of trying to get dealCard to show the cards in the UI. The data is all correct

const deckStart = [
  { rank: "2", value: 2, suitEmoji: "♡", suit: "hearts" },
  { rank: "3", value: 3, suitEmoji: "♡", suit: "hearts" },
  { rank: "4", value: 4, suitEmoji: "♡", suit: "hearts" },
  { rank: "5", value: 5, suitEmoji: "♡", suit: "hearts" },
  { rank: "6", value: 6, suitEmoji: "♡", suit: "hearts" },
  { rank: "7", value: 7, suitEmoji: "♡", suit: "hearts" },
  { rank: "8", value: 8, suitEmoji: "♡", suit: "hearts" },
  { rank: "9", value: 9, suitEmoji: "♡", suit: "hearts" },
  { rank: "10", value: 10, suitEmoji: "♡", suit: "hearts" },
  { rank: "J", value: 10, suitEmoji: "♡", suit: "hearts" },
  { rank: "Q", value: 10, suitEmoji: "♡", suit: "hearts" },
  { rank: "K", value: 10, suitEmoji: "♡", suit: "hearts" },
  { rank: "A", value: 0, suitEmoji: "♡", suit: "hearts" },

  { rank: "2", value: 2, suitEmoji: "♢", suit: "diamonds" },
  { rank: "3", value: 3, suitEmoji: "♢", suit: "diamonds" },
  { rank: "4", value: 4, suitEmoji: "♢", suit: "diamonds" },
  { rank: "5", value: 5, suitEmoji: "♢", suit: "diamonds" },
  { rank: "6", value: 6, suitEmoji: "♢", suit: "diamonds" },
  { rank: "7", value: 7, suitEmoji: "♢", suit: "diamonds" },
  { rank: "8", value: 8, suitEmoji: "♢", suit: "diamonds" },
  { rank: "9", value: 9, suitEmoji: "♢", suit: "diamonds" },
  { rank: "10", value: 10, suitEmoji: "♢", suit: "diamonds" },
  { rank: "J", value: 10, suitEmoji: "♢", suit: "diamonds" },
  { rank: "Q", value: 10, suitEmoji: "♢", suit: "diamonds" },
  { rank: "K", value: 10, suitEmoji: "♢", suit: "diamonds" },
  { rank: "A", value: 0, suitEmoji: "♢", suit: "diamonds" },

  { rank: "2", value: 2, suitEmoji: "♧", suit: "clubs" },
  { rank: "3", value: 3, suitEmoji: "♧", suit: "clubs" },
  { rank: "4", value: 4, suitEmoji: "♧", suit: "clubs" },
  { rank: "5", value: 5, suitEmoji: "♧", suit: "clubs" },
  { rank: "6", value: 6, suitEmoji: "♧", suit: "clubs" },
  { rank: "7", value: 7, suitEmoji: "♧", suit: "clubs" },
  { rank: "8", value: 8, suitEmoji: "♧", suit: "clubs" },
  { rank: "9", value: 9, suitEmoji: "♧", suit: "clubs" },
  { rank: "10", value: 10, suitEmoji: "♧", suit: "clubs" },
  { rank: "J", value: 10, suitEmoji: "♧", suit: "clubs" },
  { rank: "Q", value: 10, suitEmoji: "♧", suit: "clubs" },
  { rank: "K", value: 10, suitEmoji: "♧", suit: "clubs" },
  { rank: "A", value: 0, suitEmoji: "♧", suit: "clubs" },

  { rank: "2", value: 2, suitEmoji: "♤", suit: "spades" },
  { rank: "3", value: 3, suitEmoji: "♤", suit: "spades" },
  { rank: "4", value: 4, suitEmoji: "♤", suit: "spades" },
  { rank: "5", value: 5, suitEmoji: "♤", suit: "spades" },
  { rank: "6", value: 6, suitEmoji: "♤", suit: "spades" },
  { rank: "7", value: 7, suitEmoji: "♤", suit: "spades" },
  { rank: "8", value: 8, suitEmoji: "♤", suit: "spades" },
  { rank: "9", value: 9, suitEmoji: "♤", suit: "spades" },
  { rank: "10", value: 10, suitEmoji: "♤", suit: "spades" },
  { rank: "J", value: 10, suitEmoji: "♤", suit: "spades" },
  { rank: "Q", value: 10, suitEmoji: "♤", suit: "spades" },
  { rank: "K", value: 10, suitEmoji: "♤", suit: "spades" },
  { rank: "A", value: 0, suitEmoji: "♤", suit: "spades" },
];

const suits = ["♤", "♧", "♢", "♡"];
//NEXT STEP --  Score displays NaN when split and then stay on userHandOne.
/* UI functions List:
    -- user blackjack banner
    -- dealer blackjack banner
    -- hide UI 
    -- realistic dealing
        *- setTimeout() for dealing 1 card at a time
        *- animate card from deck to hand
  
    -- outcome UI
        *- banner for dealer bust
        *- banner for win or lose
        *- fade out completed hand in background
    -- wager UI 
  
    -- 
  
  */

const deck = [...deckStart];

let bankroll = 1000;
let wagerAmount = 100;

const outcomeElement = document.getElementById("outcome");
const outcomeMessageElement = document.getElementById("outcome-message");

const userBoardElement = document.getElementById("user-board");
const userHandMainElement = document.getElementById("user-hand");
// const userHandTwoElement = document.getElementById("user-hand-two");
const dealerHandElement = document.getElementById("dealer-hand");
const userScoreElement = document.getElementById("user_score");

const dealerScoreElement = document.getElementById("dealer_score");
const actionInterface = document.getElementById("action-container");
const wagerElement = document.getElementById("wager_amount");

const wagerDisplay = document.getElementById("wager-display");

const initialWager = document.getElementById("initial-wager");
const gameBoard = document.getElementById("game-board");

const splitHandElement = document.getElementById("split-hand");

const bankrollElement = document.getElementById("bankroll");
const bankrollTab = document.getElementById("bankroll_tab");

const wagerInput = document.getElementById("wager-input");

const splitBtn = document.getElementById("split-btn");

const hitBtnOne = document.getElementById("hit-btn-handOne");
const stayBtnOne = document.getElementById("stay-btn-handOne");
const doubleBtn = document.getElementById("double-btn");

const hitBtnTwo = document.getElementById("hit-btn-handTwo");
const stayBtnTwo = document.getElementById("stay-btn-handTwo");
const bankrollNewDeal = document.getElementById("bankroll-newdeal");

const hands = {
  dealerHand: {
    cards: [],
    isFocus: true,
    score: 0,
    isSettled: false,
    name: "dealerHand",
  },
  userHandOne: {
    cards: [],
    isFocus: true,
    score: 0,
    isSettled: false,
    name: "userHandOne",
  },
  userHandTwo: {
    cards: [],
    isFocus: false,
    score: 0,
    isSettled: false,
    name: "userHandTwo",
  },
};

const userHandOne = hands.userHandOne;
const userHandTwo = hands.userHandTwo; // Will only have a "userHandTwo" after split() -- function for splitting a pair
const dealerHand = hands.dealerHand;

bankrollElement.innerText = `${bankroll}`;
bankrollTab.innerHTML = `${bankroll}`;

function dealNewHand(event) {
  if (event) {
    event.preventDefault();
  }
  resetDoubleSplitUI();
  uiUpdateScore();
  const form = event.target; // Get the form element
  const wagerInputValue = form.querySelector("#wager-input").value; // Get the input value

  wagerAmount = parseInt(wagerInputValue) || 100;
  bankrollTab.innerHTML = `${bankroll - wagerAmount}`;
  wagerElement.innerHTML = wagerAmount.toString();

  uiToggleDisplay(initialWager);
  uiToggleDisplay(gameBoard);
  const firstCard = dealCard(userHandOne, {
    rank: "5",
    value: 5,
    suitEmoji: "♤",
    suit: "spades",
  });
  console.log(firstCard);

  const secondCard = setTimeout(() => {
    dealCard(userHandOne, {
      rank: "5",
      value: 5,
      suitEmoji: "♢",
      suit: "diamonds",
    });
    translateOnScreen(firstCard);
  }, 1000);

  setTimeout(() => {
    dealCard(dealerHand, {
      rank: "K",
      value: 10,
      suitEmoji: "♧",
      suit: "clubs",
    });
    translateOnScreen(secondCard);
  }, 2000);

  setTimeout(() => {
    dealCard(dealerHand, {
      rank: "4",
      value: 4,
      suitEmoji: "♧",
      suit: "clubs",
    });
    // dealCard(dealerHand, {
    //   rank: "5",
    //   value: 5,
    //   suitEmoji: "♧",
    //   suit: "clubs",
    // });
    // dealCard(dealerHand, {
    //   rank: "6",
    //   value: 6,
    //   suitEmoji: "♧",
    //   suit: "clubs",
    // });
    // dealCard(dealerHand, {
    //   rank: "7",
    //   value: 7,
    //   suitEmoji: "♧",
    //   suit: "clubs",
    // });
    // dealCard(dealerHand, {
    //   rank: "8",
    //   value: 8,
    //   suitEmoji: "♧",
    //   suit: "clubs",
    // });

    // uiDealHands();
    updateScore();
    uiUpdateScore();

    checkForBlackjack();
    checkIfCanSplit();
    checkIfCanDouble(userHandOne.score);
    // canInsure();
  }, 3000);
}

function dealCard(hand, staticCardForTesting) {
  const randomCard = deck[Math.ceil(Math.random() * deck.length) - 1];
  let newCard;
  if (hand === userHandOne) {
    userHandOne.cards.push(staticCardForTesting || randomCard);
  } else if (hand === userHandTwo) {
    userHandTwo.cards.push(staticCardForTesting || randomCard);
  } else if (hand === dealerHand) {
    dealerHand.cards.push(staticCardForTesting || randomCard);
  } else {
    console.error("error in dealCard, hand is undefined");
  }

  if (hand === dealerHand && dealerHand.cards.length === 1) {
    newCard = uiCreateCard(
      dealerHand,
      staticCardForTesting || randomCard,
      true
    );
  } else {
    newCard = uiCreateCard(userHandOne, staticCardForTesting || randomCard);
  }

  updateRemainingDeck(staticCardForTesting || randomCard);
  if (hand === userHandOne) {
    userHandMainElement.appendChild(newCard);
  } else if (hand === userHandTwo) {
    userHandMainElement.appendChild(newCard);
  } else if (hand === dealerHand) {
    dealerHandElement.appendChild(newCard);
  }

  return newCard;
}

function translateOnScreen(element) {
  element.style.transform = "translateY(0)";
}

function uiCreateCard(hand, card, isHoleCard) {
  const cardElement = document.createElement("div");

  const cardIndex = hand.cards.length - 1;

  cardElement.classList.add("card-on-deck");

  if (isHoleCard) {
    cardElement.classList.add("card-back");
    return cardElement;
  } else {
    const suitElement = document.createElement("div");
    const rightRankElement = document.createElement("div");
    const leftRankElement = document.createElement("div");

    rightRankElement.textContent = card.rank;
    rightRankElement.classList.add("rank", "rankRightSide");
    leftRankElement.textContent = card.rank;
    leftRankElement.classList.add("rank", "rankLeftSide");
    suitElement.textContent = card.suitEmoji;
    suitElement.classList.add("suit");

    cardElement.classList.add("card");
    cardElement.classList.add("card-face");
    cardElement.style.left = `${cardIndex * 1}em`;

    cardElement.appendChild(leftRankElement);
    cardElement.appendChild(suitElement);
    cardElement.appendChild(rightRankElement);

    return cardElement;
  }
}

function checkForBlackjack() {
  // Want to find a way to handle immediate settling better

  if (userHandOne.score === 21 && dealerHand.score !== 21) {
    settleBlackjack("win");
  }
  if (userHandOne.score === 21 && dealerHand.score === 21) {
    settleBlackjack("push");
  }
  if (userHandOne.score !== 21 && dealerHand.score === 21) {
    settleBlackjack("lose");
  }
}

async function settleBlackjack(outcome) {
  outcome === "win" ? (blackjackMultiplier = 1.5) : (blackjackMultiplier = 1);
  bankrollUpdate(outcome, blackjackMultiplier);

  bankrollElement.innerHTML = bankroll;
  bankrollTab.innerHTML = bankroll;

  await uiOutcome(outcome);
  // we need uiTransitionToWager() to run after uiOutcome finishes
  uiTransitionToWager();
  // UI function for transition between hands view Outcome summary
}

function uiAddCard(hand, card) {
  const newCard = uiCreateCard(hand, card);

  if (hand === "dealerHand") {
    dealerHandElement.appendChild(newCard);
  } else {
    userHandMainElement.appendChild(newCard);
  }
}

function checkIfCanSplit() {
  if (userHandOne.cards[0].rank === userHandOne.cards[1].rank) {
    toggleDisabled(splitBtn);
  }
}

function checkIfCanDouble(handScore) {
  if (handScore >= 9 && handScore <= 11) {
    toggleDisabled(doubleBtn);
  }
}

function double(hand = userHandOne) {
  wagerAmount = wagerAmount * 2;
  wagerElement.innerHTML = wagerAmount.toString();
  dealCard(hand);

  toggleDisabled(doubleBtn);
  toggleDisabled(splitBtn);
  updateScore();
  uiUpdateScore();
  stay(hand); // "doubling down" in live blackjack implies stay logic by default
}

function split() {
  userHandTwo.cards.push(userHandOne.cards.splice(1, 1)[0]);

  uiSplitCards(userHandTwo);
  updateScore();
  uiUpdateScore();

  toggleDisabled(splitBtn);
  toggleDisabled(doubleBtn);
  // console.log(userHandTwo, "userHandTwo after split");
  // console.log(userHandOne, "userHandOne after split");
}

function uiSplitCards(hand) {
  userHandMainElement.removeChild(userHandMainElement.lastChild);
  switchSplitPreviewTo(hand);
}

function uiCreateSplitCard(card) {
  const newCard = document.createElement("div");
  const rankElement = document.createElement("div");
  rankElement.textContent = card.rank;
  newCard.classList.add("split-card");
  newCard.appendChild(rankElement);
  return newCard;
}

function switchSplitPreviewTo(hand) {
  const newHandArray = [];
  hand.cards.forEach((card) => {
    const newCard = uiCreateSplitCard(card);
    newHandArray.push(newCard);
  });

  splitHandElement.replaceChildren(...newHandArray);
}

function switchFocusHandTo(hand) {
  // switches TO "hand"
  const newHandArray = []; /* */
  hand.cards.forEach((card) => {
    const newCard = uiCreateCard(hand, card);
    newHandArray.push(newCard);
  });

  userHandMainElement.replaceChildren(...newHandArray);
}

function toggleFocusHandToFrom(toHand, fromHand) {
  toggleIsFocus();

  const currentFocus = userHandOne.isFocus ? userHandOne : userHandTwo;
  const currentSplitPreview = userHandOne.isFocus ? userHandTwo : userHandOne;

  switchFocusHandTo(toHand);
  switchSplitPreviewTo(fromHand);

  //
}

function toggleIsFocus() {
  if (userHandOne.isFocus) {
    userHandOne.isFocus = false;
    userHandTwo.isFocus = true;
  } else if (userHandTwo.isFocus) {
    userHandOne.isFocus = true;
    userHandTwo.isFocus = false;
  } else {
    console.log("some kind of error where neither hand had .isFocus");
  }

  uiUpdateScore();
}

function uiRemoveCard() {
  // for when split() is called
  // kinda hacky state handling ... but it works
  userHandMainElement.removeChild(userHandMainElement.lastChild);
}

function updateRemainingDeck(card) {
  const cardPositionInDeck = deck.indexOf(card);

  deck.splice(cardPositionInDeck, 1);
}

function updateSingleHandScore(hand) {
  let numAces = hand.cards.reduce((aceCount, card) => {
    return card.rank === "A" ? aceCount + 1 : aceCount;
  }, 0);

  let nonAces = hand.cards.filter((card) => card.rank !== "A");
  let nonAcesTotal = nonAces.reduce((sum, card) => sum + card.value, 0);
  switch (numAces) {
    case 0:
      hand.score = nonAcesTotal;
      break;
    case 1:
      if (nonAcesTotal <= 10) {
        hand.score = nonAcesTotal + 11;
      } else {
        hand.score = nonAcesTotal + 1;
      }
      break;
    case 2: // 10 1 11
      if (nonAcesTotal <= 9) {
        hand.score = nonAcesTotal + 12;
      } else {
        hand.score = nonAcesTotal + 2;
      }
      break;
    case 3:
      if (nonAcesTotal <= 8) {
        hand.score = nonAcesTotal + 13;
      } else {
        hand.score = nonAcesTotal + 3;
      }
      break;
    case 4:
      if (nonAcesTotal <= 7) {
        hand.score = nonAcesTotal + 14;
      } else {
        hand.score = nonAcesTotal + 4;
      }
      break;
  }
}
function updateScore() {
  updateSingleHandScore(dealerHand);
  updateSingleHandScore(userHandOne);
  updateSingleHandScore(userHandTwo);

  if (userHandTwo.cards.length > 0) {
    updateSingleHandScore(userHandTwo);
  }
}

function uiUpdateScore() {
  const focusHandScore = userHandOne.isFocus
    ? userHandOne.score.toString()
    : userHandTwo.score.toString();
  // const newScoreElement = document.createElement("span");
  // newScoreElement.textContent = focusHandScore.toString();

  userScoreElement.replaceChildren(focusHandScore);
  dealerScoreElement.replaceChildren(dealerHand.score.toString());
}

async function hitUser() {
  // issue could be that we're passing in the whole hand instead of just a card object
  // but why does that happen?
  // dealCard(hand); works elsewwhere as exxpected
  const hand = userHandOne.isFocus ? userHandOne : userHandTwo;
  console.log(hand, "<-----------------hand at START of hitUser()");
  dealCard(hand, {
    rank: "8",
    value: 8,
    suitEmoji: "♧",
    suit: "clubs",
  }); // next add in static card for testing
  console.log(hand, "hand in hitUser()");
  updateScore();
  uiUpdateScore();
  console.log(userHandTwo, "userHandTwo at end");
  console.log(userHandOne, "userHandOne at end");
  if (hand.score > 21) {
    await settleHand(hand);
  }
}

function wasSplit() {
  let split = userHandTwo.cards.length > 0 ? true : false;
  return split;
}

async function stay() {
  const hand = userHandOne.isFocus ? userHandOne : userHandTwo;
  uiUpdateScore(); // only calling this to get dealerScore ui updated in time
  // uiToggleDisplay(splitBtn);
  // uiToggleDisplay(doubleBtn);

  if (!wasSplit()) {
    dealerAction();
    await settleHand(hand);
  } else if (wasSplit()) {
    splitStay();
  }

  console.log(userHandTwo, "userHandTwo at end");
  console.log(userHandOne, "userHandOne at end");
}

async function splitStay() {
  if (userHandOne.isFocus) {
    console.log("first if inside splitStay()");
    toggleFocusHandToFrom(userHandTwo, userHandOne);
    console.log("after toggleFocusHandToFrom(userHandTwo, userHandOne)");
  } else if (userHandTwo.isFocus && userHandOne.score > 21) {
    dealerAction();

    await settleHand(userHandTwo);
  } else if (userHandTwo.isFocus && !userHandOne.isSettled) {
    toggleFocusHandToFrom(userHandOne, userHandTwo);
    dealerAction();
    await settleHand(userHandOne);
    toggleFocusHandToFrom(userHandTwo, userHandOne);
    await settleHand(userHandTwo);
  } else {
    console.log("Something went wrong");
  }
}

function flipDealerCardUp() {
  // feels a little klunky. Should probably just be handled by flipping a state or CSS class
  const newElementsArray = [];
  dealerHand.cards.forEach((card) => {
    newElementsArray.push(uiCreateCard(dealerHand, card, false)); // uiCreateCard
  });
  dealerHandElement.replaceChildren(...newElementsArray);
}

function dealerAction() {
  updateScore();

  uiUpdateScore();

  flipDealerCardUp();

  while (dealerHand.score < 17) {
    dealCard(dealerHand);

    updateScore();
    uiUpdateScore();
  }
}

function compareScores(hand, blackjackMultiplier) {
  // hand gets passed through several functions to get here... maybe that's ok- it's not like it's really that trivial to any of the functions that pass it through.

  const userScore =
    hand === userHandOne ? userHandOne.score : userHandTwo.score;

  if (blackjackMultiplier === 1.5) {
    return "win";
  }
  if (blackjackMultiplier === 0) {
    return "push";
  }

  // where does userScore come from?
  // maybe userScore is behind?

  if (userScore > 21) {
    return "lose";
  } else if (dealerHand.score > 21) {
    return "win";
  } else if (userScore > dealerHand.score) {
    ("win");
    return "win";
  } else if (userScore < dealerHand.score) {
    return "lose";
  } else if (userScore === dealerHand.score) {
    return "push";
  } else {
    console.error("error in compareScores");
    return "error";
  }
}

async function settleHand(hand, blackjackMultiplier = 1) {
  // hand === the hand being settled triggered by stay or hitUser

  const outcome = compareScores(hand, blackjackMultiplier);

  bankrollUpdate(outcome, blackjackMultiplier);
  if (!wasSplit()) {
    await uiOutcome(outcome);

    uiTransitionToWager("if !wasSplit top of settleHand");
    userHandOne.isSettled = true;
  } else if (hand === userHandOne) {
    // 1. UH1 stayed, UH2 stayed, UH1 SETTLING UH2 settleQueue'd
    // 4. UH1 stayed, UH2 busted + settled, UH1 SETTLING
    // 5. UH1 busted is SETTLING, UH2 focus toggled action remains
    if (userHandOne.score <= 21 && !userHandTwo.isSettled) {
      // Scenario 1 from ReadMe
      console.log("Scenario 1 should produce this loge");
      await uiOutcome(outcome);
      userHandOne.isSettled = true;
      toggleFocusHandToFrom(userHandTwo, userHandOne);

      // settleHand(userHandTwo); // recursion means this first outer settle hand
      // // won't "finish" until settleHand(userHandTwo) finishes
    } else if (userHandTwo.score > 21) {
      // Scenario 4 from ReadMe
      console.log("Scenario 4 should produce this loge");
      await uiOutcome(outcome);
      userHandOne.isSettled = true;
      uiTransitionToWager("scenario4");
    } else if (userHandOne.score > 21) {
      // Scenario 5 from ReadMe
      // [todo] The UI needs to show this hand is dead instead of just switching the preview
      // await uiOutcome(outcome);
      console.log("Scenario 5 should produce this loge");
      await uiOutcome(outcome);
      toggleFocusHandToFrom(userHandTwo, userHandOne);
      userHandOne.isSettled = true;
    } else {
      console.log("Probably an error ");
    }
  } else if (hand === userHandTwo) {
    //     2. UH1 stayed, UH2 stayed, UH1 settled, UH2 SETTLING
    // 3. UH1 stayed, UH2 busted is SETTLING, UH1 settleQueue'd
    // 6. UH1 busted settled, UH2 is SETTLING
    if (userHandTwo.score <= 21 && userHandOne.isSettled) {
      // adding && userHandOne.isSettled to condition statement for clarity, but leaving it off should change nothing
      // we jump in here twice somehow...
      // because settleHand sends us here immediately
      // once the 2nd settleHand finishes correctly
      // the first settleHand that started with hand === userHandOne tries to finish
      // but now the state has been changed and it's able to jump in here

      await uiOutcome(outcome, hand);
      userHandTwo.isSettled = true;
      uiTransitionToWager("scenario2");
    } else if (userHandTwo.score > 21 && !userHandOne.isSettled) {
      // 3. UH1 stayed, UH2 busted is SETTLING, UH1 settleQueue'd
      await uiOutcome(outcome);
      userHandTwo.isSettled = true;
      toggleFocusHandToFrom(userHandOne, userHandTwo);
      settleHand(userHandOne); // recursion that's not buggy
    } else if (userHandOne.isSettled) {
      // 6. UH1 busted settled, UH2 is SETTLING
      await uiOutcome(outcome);
      userHandTwo.isSettled = true;
      uiTransitionToWager("scenario6");
    } else {
    }
  }
}

function bankrollUpdate(outcome, blackjackMultiplier) {
  if (outcome === "win") {
    bankroll += wagerAmount * blackjackMultiplier;
  } else if (outcome === "lose") {
    bankroll -= wagerAmount;
  } else if (outcome === "push") {
    bankroll = bankroll;
  } else {
    console.error("error in bankrollUpdate");
  }
  bankrollElement.innerHTML = bankroll;
  bankrollTab.innerHTML = bankroll;
}

function uiOutcome(outcome) {
  return new Promise((resolve) => {
    // Temporary timed transition UI between current hand and wagering next hand
    uiToggleDisplay(outcomeElement); // Displays outcome element
    outcomeMessageElement.innerHTML = outcome.toUpperCase();

    setTimeout(() => {
      uiToggleDisplay(outcomeElement); // Removes outcome element
      resolve(); // Resolve the Promise after the timeout
    }, 3000); // 3-second delay
  });
}
function uiTransitionToWager(runningFrom) {
  // moving from wager view to deal view
  // the UI inside will contain the deal button which will call the dealNewHand function

  uiToggleDisplay(gameBoard);
  uiToggleDisplay(initialWager);
  initialWager.classList.add("initial-wager");
  resetHand();
}

function resetHand(wagerAmount) {
  // This is gross and temporary
  // Really i need to dump const userHandOne

  splitBtn.disabled = true;
  doubleBtn.disabled = true;
  hands.dealerHand = { cards: [], isFocus: true, score: 0, isSettled: false };
  hands.userHandOne = { cards: [], isFocus: true, score: 0, isSettled: false };
  hands.userHandTwo = { cards: [], isFocus: false, score: 0, isSettled: false };

  hands.userHandTwo.score = 0;

  hands.dealerHand.cards.splice(0, dealerHand.length);
  hands.userHandOne.cards.splice(0, userHandOne.length);
  hands.userHandTwo.cards.splice(0, userHandTwo.length);
  hands.dealerHand.score = 0;
  hands.userHandOne.score = 0;
  hands.userHandTwo.score = 0;

  userHandOne.cards = [];
  userHandTwo.cards = [];
  dealerHand.cards = [];
  userHandOne.score = 0;
  userHandTwo.score = 0;
  dealerHand.score = 0;
  userHandOne.isFocus = true;
  userHandTwo.isFocus = false;
  dealerHand.isFocus = true;

  userHandOne.isSettled = false;
  userHandTwo.isSettled = false;
  dealerHand.isSettled = false;

  deck.splice(0, deck.length);
  deck.push(...deckStart);

  splitHandElement.innerHTML = "";

  userHandMainElement.innerHTML = "";
  dealerHandElement.innerHTML = "";
}

function resetDoubleSplitUI() {
  splitBtn.disabled = true;
  doubleBtn.disabled = true;
}

// Utility functions
function uiToggleDisplay(element) {
  if (element.classList.contains("hidden")) {
    element.classList.remove("hidden");
  } else {
    element.classList.add("hidden");
  }
}

function toggleDisabled(element) {
  if (element.disabled) {
    element.disabled = false;
  } else {
    element.disabled = true;
  }
}

// setWager();

// it would almost be nice just to have methods directly attached to my hands objects... but i don't know exactly how to do that
// This is why React -- if changing hands state, just directly changed UI this would all be so much easier

// function uiDealHands() {
//   // will work on realistic deal timing later
//   userHandOne.cards.forEach((card) => {
//     const newCard = uiCreateCard("userHandOne", card);
//     userHandMainElement.appendChild(newCard);
//   });

//   for (let i = 0; i < dealerHand.cards.length; i++) {
//     if (i === 0) {
//       const newCard = uiCreateCard("dealerHand", dealerHand.cards[i], true);
//       dealerHandElement.appendChild(newCard);
//     } else {
//       const newCard = uiCreateCard("dealerHand", dealerHand.cards[i], false);
//       dealerHandElement.appendChild(newCard);
//     }
//   }
// }
