let cardList = [
  "fa-anchor",
  "fa-bicycle",
  "fa-bolt",
  "fa-bomb",
  "fa-cube",
  "fa-diamond",
  "fa-leaf",
  "fa-paper-plane-o"
];
cardList = [...cardList, ...cardList];

// Declare necessary global variavles
const deck = document.getElementById("deck");
const movesText = document.querySelector(".moves");
const starList = document.querySelectorAll(".stars li i");
const watchText = document.querySelector(".stopwatch");

let openedCards = [];

let moves = 0;
let time = 0;
let watchId;
let watchOff = true;

let matches = 0;
const allMatches = 8;

// Shuffle function from http://stackoverflow.com/a/2450976
function shuffle(array) {
  var currentIndex = array.length,
    temporaryValue,
    randomIndex;
  while (currentIndex !== 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }
  return array;
}

// Dynamically generate and randomly shuffle cards
function generateCards() {
  const shuffledCards = shuffle(cardList);
  for (shuffledCard of shuffledCards) {
    const li = document.createElement("li");
    const i = document.createElement("i");
    li.classList.add("card");
    i.classList.add("fa", shuffledCard);
    li.appendChild(i);
    deck.appendChild(li);
  }
}

// Flip a card up or down
function toggleCard(cardToToggle) {
  cardToToggle.classList.toggle("open");
  cardToToggle.classList.toggle("show");
}

// Cards listen to click events
function initCards() {
  deck.addEventListener("click", () => {
    const clickedCard = event.target;
    if (
      // Proceed if cards meet these conditions
      clickedCard.classList.contains("card") &&
      !clickedCard.classList.contains("match") && // Make matched cards unclickable
      openedCards.length < 2 && // Open two card at most in one turn
      !openedCards.includes(clickedCard) // Prevent clicking on the same card
    ) {
      if (watchOff) {
        // Initialize stopwatch
        stopwatch();
        watchOff = false;
      }
      toggleCard(clickedCard);
      openedCards.push(clickedCard);
      if (openedCards.length === 2) {
        // Check for these stats when two cards are flipped
        checkMatching();
        moveCounter();
        starCounter();
      }
    }
  });
}

// Matched cards stay flipped, unmatched cards flip back down
function checkMatching() {
  if (
    openedCards[0].firstElementChild.className ===
    openedCards[1].firstElementChild.className
  ) {
    openedCards[0].classList.add("match");
    openedCards[1].classList.add("match");
    openedCards = [];
    matches++;
    if (matches === allMatches) {
      gameWon();
    }
  } else {
    setTimeout(() => {
      toggleCard(openedCards[0]);
      toggleCard(openedCards[1]);
      openedCards = [];
    }, 600);
  }
}

function moveCounter() {
  moves++;
  movesText.innerText = moves;
}

// Remove one star from the counter after certain move counts
function starCounter() {
  if (moves === 10 || moves === 13 || moves === 16 || moves === 19) {
    for (star of starList) {
      if (!star.classList.contains("hide")) {
        star.classList.add("hide");
        break;
      }
    }
  }
}

function stopwatch() {
  watchId = setInterval(() => {
    time++;
    watchValue();
  }, 1000);
}

function watchValue() {
  // Convert raw time value into stopwatch format
  const minutes = Math.floor(time / 60);
  const seconds = time % 60;
  minutes < 10 && seconds < 10
    ? (watchText.innerText = `0${minutes}:0${seconds}`)
    : minutes < 10 && seconds >= 10
    ? (watchText.innerText = `0${minutes}:${seconds}`)
    : minutes > 10 && seconds < 10
    ? (watchText.innerText = `${minutes}:0${seconds}`)
    : (watchText.innerText = `${minutes}:${seconds}`);
}

// Reset all game stats
function resetGameState() {
  // Reset game board
  deck.innerHTML = "";
  openedCards = [];
  generateCards();
  // Reset move counter
  moves = 0;
  movesText.innerText = moves;
  // Reset star counter
  for (star of starList) {
    star.className = "fa fa-star";
  }
  // Reset stopwatch
  clearInterval(watchId);
  time = 0;
  watchOff = true;
  watchValue();
  // Reset match count
  matches = 0;
}

// Return game to initial state
function restartButton() {
  const restartBtn = document.querySelector(".restart");
  restartBtn.addEventListener("click", resetGameState);
}

// Fill game modal with values of moves, satrs, and stopwatch time
function fillModalContent() {
  const moveStat = document.querySelector(".modal-moves");
  const starStat = document.querySelector(".modal-stars");
  const timeStat = document.querySelector(".modal-time");
  const watchTime = watchText.innerText;
  let starCount = 0;
  for (star of starList) {
    if (!star.classList.contains("hide")) {
      starCount++;
    }
  }
  timeStat.innerText = `Time: ${watchTime}`;
  moveStat.innerText = `Moves: ${moves}`;
  starStat.innerText = `Stars: ${starCount}`;
  replayButton();
}

// Turn on or off game modal
function toggleModal() {
  const gameModal = document.querySelector(".modal-background");
  gameModal.classList.toggle("hide");
}

function restartGame() {
  resetGameState();
  toggleModal();
}

// Return game from showing game modal to initial state
function replayButton() {
  document
    .querySelector(".modal-button-replay")
    .addEventListener("click", restartGame);
}

// Stop time progression and show game modal
function gameWon() {
  clearInterval(watchId);
  fillModalContent();
  toggleModal();
}

// Start the game
{
  generateCards();
  initCards();
  restartButton();
}
