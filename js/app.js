let cardList = [
	'fa-anchor',
	'fa-anchor',
	'fa-bicycle',
	'fa-bicycle',
	'fa-bolt',
	'fa-bolt',
	'fa-bomb',
	'fa-bomb',
	'fa-cube',
	'fa-cube',
	'fa-diamond',
	'fa-diamond',
	'fa-leaf',
	'fa-leaf',
	'fa-paper-plane-o',
	'fa-paper-plane-o',
];

// declare necessary global variavles
let deck = document.getElementById('deck');
let movesText = document.querySelector('.moves');
let starList = document.querySelectorAll('.stars li i');
let watchText = document.querySelector('.stopwatch');

let openedCards = [];

let moves = 0;
let time = 0;
let watchId;
let watchOff = true;

let matches = 0;
let allMatches = 8;

// Shuffle function from http://stackoverflow.com/a/2450976
function shuffle(array) {
	var currentIndex = array.length, temporaryValue, randomIndex;
	while (currentIndex !== 0) {
		randomIndex = Math.floor(Math.random() * currentIndex);
		currentIndex -= 1;
		temporaryValue = array[currentIndex];
		array[currentIndex] = array[randomIndex];
		array[randomIndex] = temporaryValue;
	}
	return array;
}

// dynamically generate and randomly shuffle cards
function generateCards() {
	let shuffledCards = shuffle(cardList);
	for (shuffledCard of shuffledCards) {
		let li = document.createElement('li');
		let i = document.createElement('i');
		li.classList.add('card');
		i.classList.add('fa', shuffledCard);
		li.appendChild(i);
		deck.appendChild(li);
	}
}

// flip a card up or down
function toggleCard(cardToToggle) {
	cardToToggle.classList.toggle('open');
	cardToToggle.classList.toggle('show');
}

// cards listen to click events
function initCards() {
	deck.addEventListener('click', () => {
		let clickedCard = event.target;
		if ( // proceed if cards meet these conditions
			clickedCard.classList.contains('card') &&
			!clickedCard.classList.contains('match') && // make matched cards unclickable
			openedCards.length < 2 && // open two card at most in one turn
			!openedCards.includes(clickedCard) // prevent clicking on the same card
		) {
			if (watchOff) { // initialize stopwatch
				stopwatch();
				watchOff = false;
			}
			toggleCard(clickedCard);
			openedCards.push(clickedCard);
			if (openedCards.length === 2) { // check for these stats when two cards are flipped
				checkMatching();
				moveCounter();
				starCounter()
			}
		}
	});
}

// matched cards stay flipped, unmatched cards flip back down
function checkMatching() {
	if (
		openedCards[0].firstElementChild.className ===
		openedCards[1].firstElementChild.className
	) {
		openedCards[0].classList.add('match');
		openedCards[1].classList.add('match');
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

// remove one star from the counter after certain move counts
function starCounter() {
	if (
		moves === 9 ||
		moves === 11 ||
		moves === 13 ||
		moves === 15 ||
		moves === 17 ||
		moves === 19
	) {
		for (star of starList) {
			if (!star.classList.contains('hide')) {
				star.classList.add('hide');
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

function watchValue() { // convert raw time value into stopwatch format
	let minutes = Math.floor(time / 60);
	let seconds = time % 60;
	(minutes < 10 && seconds < 10) ? (watchText.innerText = `0${minutes}:0${seconds}`)
	: (minutes < 10 && seconds >= 10) ? (watchText.innerText = `0${minutes}:${seconds}`)
	: (minutes > 10 && seconds < 10) ? (watchText.innerText = `${minutes}:0${seconds}`)
	: (watchText.innerText = `${minutes}:${seconds}`);
}

// reset all game stats
function resetGameState() {
	// reset game board
	deck.innerHTML = '';
	openedCards = [];
	generateCards();
	// reset move counter
	moves = 0;
	movesText.innerText = moves;
	// reset star counter
	for (star of starList) {
		star.className = 'fa fa-star';
	}
	// reset stopwatch
	clearInterval(watchId);
	time = 0;
	watchOff = true;
	watchValue();
	// reset match counts
	matches = 0;
}

// return game to initial state
function restartButton() {
	let restartBtn = document.querySelector('.restart');
	restartBtn.addEventListener('click', resetGameState);
}

// fill game modal with values of moves, satrs, and stopwatch time
function fillModalContent() {
	let moveStat = document.querySelector('.modal-moves');
	let starStat = document.querySelector('.modal-stars');
	let timeStat = document.querySelector('.modal-time');
	let watchTime = watchText.innerText;
	let starCount = 0;
	for (star of starList) {
		if (!star.classList.contains('hide')) {
			starCount++;
		}
	}
	timeStat.innerText = `Time: ${watchTime}`;
	moveStat.innerText = `Moves: ${moves}`;
	starStat.innerText = `Stars: ${starCount}`;
	replayButton();
}

// turn on or off game modal
function toggleModal() {
	let gameModal = document.querySelector('.modal-background');
	gameModal.classList.toggle('hide');
}

function restartGame() {
	resetGameState();
	toggleModal();
}

// return game from showing game modal to initial state 
function replayButton() {
	document.querySelector('.modal-button-replay').addEventListener('click', restartGame);
}

// stop time progression and show game modal
function gameWon() {
	clearInterval(watchId);
	fillModalContent();
	toggleModal();
}

function startGame() {
	generateCards();
	initCards();
	restartButton();
}

startGame();
