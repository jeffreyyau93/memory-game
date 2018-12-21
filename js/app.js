/*
 * Create a list that holds all of your cards
 */
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

/*
* Display the cards on the page
*   - shuffle the list of cards using the provided "shuffle" method below
*   - loop through each card and create its HTML
*   - add each card's HTML to the page
*/
let deck = document.getElementById('deck');

let openedCards = [];

let moves = 0;

let movesText = document.querySelector('.moves');

let starList = document.querySelectorAll('.stars li i');

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

// Dynamically generates and randomly shuffles cards
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

// Flip a card that got passed into it
function toggleVisibility(cardToToggle) {
	cardToToggle.classList.toggle('open');
	cardToToggle.classList.toggle('show');
}

// Cards listen to click events
function initClick() {
	deck.addEventListener('click', () => {
		let clickedCard = event.target;
		if (
			clickedCard.classList.contains('card') &&
			!clickedCard.classList.contains('match') &&
			openedCards.length < 2 &&
			!openedCards.includes(clickedCard)
		) {
			toggleVisibility(clickedCard);
			addOpenedCards(clickedCard);
			if (openedCards.length === 2) {
				checkMatching();
				moveCounter();
				starCounter()
			}
		}
	});
}

function addOpenedCards(clickedCard) {
	openedCards.push(clickedCard);
	console.log(openedCards);
}

// Matched cards stays flipped, unmatched cards flip back down
function checkMatching() {
	if (
		openedCards[0].firstElementChild.className ===
		openedCards[1].firstElementChild.className
	) {
		openedCards[0].classList.add('match');
		openedCards[1].classList.add('match');
		openedCards = [];
		console.log('matched!');
	} else {
		setTimeout(() => {
			toggleVisibility(openedCards[0]);
			toggleVisibility(openedCards[1]);
			openedCards = [];
			console.log('not matched!');
		}, 600);
	}
}

function moveCounter() {
	moves++;
	movesText.innerHTML = moves;
}

// Removes 1 star from the counter after certain move counts
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

// function restartGame() {
// 	moves = 0
// 	generateCards();
// }

function startGame() {
	generateCards();
	initClick();
}

/*
 * set up the event listener for a card. If a card is clicked:
 *  - display the card's symbol (put this functionality in another function that you call from this one)
 *  - add the card to a *list* of "open" cards (put this functionality in another function that you call from this one)
 *  - if the list already has another card, check to see if the two cards match
 *    + if the cards do match, lock the cards in the open position (put this functionality in another function that you call from this one)
 *    + if the cards do not match, remove the cards from the list and hide the card's symbol (put this functionality in another function that you call from this one)
 *    + increment the move counter and display it on the page (put this functionality in another function that you call from this one)
 *    + if all cards have matched, display a message with the final score (put this functionality in another function that you call from this one)
 */

startGame();
