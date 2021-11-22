const gameContainer = document.getElementById('game');

const COLORS = [ 'red', 'blue', 'green', 'orange', 'purple', 'red', 'blue', 'green', 'orange', 'purple' ];

const flippedCards = [];
const lockedCards = [];
let lastClickedID = 0;
let score = 0;
let bestScore;
let bestScoreElement = document.getElementById('best-score');
if (localStorage.getItem('bestScore') === null) {
	bestScore = 0;
	bestScoreElement.innerHTML = `Best Score: N/A`;
}
else {
	bestScore = parseInt(localStorage.getItem('bestScore'));
	bestScoreElement.innerHTML = `Best Score: ${bestScore}`;
}

// here is a helper function to shuffle an array
// it returns the same array with values shuffled
// it is based on an algorithm called Fisher Yates if you want to research more
function shuffle(array) {
	let counter = array.length;

	// While there are elements in the array
	while (counter > 0) {
		// Pick a random index
		let index = Math.floor(Math.random() * counter);

		// Decrease counter by 1
		counter--;

		// And swap the last element with it
		let temp = array[counter];
		array[counter] = array[index];
		array[index] = temp;
	}

	return array;
}

let shuffledColors = shuffle(COLORS);

// this function loops over the array of colors
// it creates a new div and gives it a class with the value of the color
// it also adds an event listener for a click for each card
function createDivsForColors(colorArray) {
	let idNum = 1;
	for (let color of colorArray) {
		// create a new div
		const newDiv = document.createElement('div');

		// give it a class attribute for the value we are looping over
		newDiv.classList.add(color);
		newDiv.id = idNum.toString();
		idNum++;

		// call a function handleCardClick when a div is clicked on
		newDiv.addEventListener('click', handleCardClick);

		// append the div to the element with an id of game
		gameContainer.append(newDiv);
	}
}

// this function takes a color and resets all the cards of that color, as long as that color is not in lockedCards
function resetCardColor(color) {
	const cards = document.querySelectorAll('#game div');
	for (let card of cards) {
		// if the card is NOT in lockedCards, then check
		if (!lockedCards.includes(card.className)) {
			if (card.className === color) {
				card.style.backgroundColor = null;
			}
		}
	}
}

// this function checks if the currently flipped cards in flippedCards are
// a match, and then handles the rest.
// If it is a match, the card color is added to lockedCards
function checkMatch() {
	let match = false;
	// if there is not more than 1 flipped card, then return false
	if (!flippedCards.length > 1) {
		match = false;
	}
	else {
		// else if there is more than 1 flipped card, then check if there is a match
		// if the first card matches the second card, then match = true
		if (flippedCards[0] === flippedCards[1]) {
			match = true;
			if (!lockedCards.includes(flippedCards[0])) {
				lockedCards.push(flippedCards[0]);
			}
		}
		else {
			match = false;
		}
	}
	return match;
}

// this function checks if the game is complete and returns a true/false value
function gameComplete() {
	const cards = document.querySelectorAll('#game div');
	for (let card of cards) {
		if (!lockedCards.includes(card.className)) {
			return false;
		}
	}
	return true;
}

function handleCardClick(event) {
	// you can use event.target to see which element was clicked
	let clicked = event.target;
	let clickedColor = event.target.classList;
	let clickedID = event.target.id;

	// console.log('you just clicked', clicked);
	// console.log('clickedColor: ', clickedColor);

	// if the clicked card is NOT the same as the last clicked card
	if (clickedID !== lastClickedID) {
		// if the clicked card is NOT a locked card
		if (!lockedCards.includes(clickedColor)) {
			// increment the score by 1
			score++;
			let scoreElement = document.getElementById('score');
			scoreElement.innerHTML = `Score: ${score}`;
			// add the clicked card's color to flippedCards, then check match
			flippedCards.push(clickedColor.value);
			clicked.style.backgroundColor = clickedColor;
			console.log(flippedCards);

			// if there is more than 1 flipped card in flippedCards
			if (flippedCards.length > 1) {
				// run checkMatch and output corresponding message.
				if (!!checkMatch()) {
					console.log(
						`We found a match! ${flippedCards[0]} = ${flippedCards[1]}. \n ${flippedCards[0]} has been added to the list of locked cards. \n Locked Cards: ${lockedCards}`
					);
				}
				else {
					console.log(`${flippedCards[0]} and ${flippedCards[1]} are NOT a match.`);
				}

				for (let flippedCard of flippedCards) {
					setTimeout(function() {
						resetCardColor(flippedCard);
					}, 1000);
				}
				flippedCards.length = 0;
			}
		}
	}

	// when a card is clicked, check if that card's class is in lockedCards
	// if not, then add the card's class to flippedCards and change color
	// if just 1 card in flippedCards: continue
	// else if 2 cards in flippedCards:
	// 		if both of the cards in flippedCards are the same class,
	//			then add both cards to lockedCards and clear flippedCards.
	// 			do not change cards
	//		if the cards in flippedCards do NOT match
	// 			clear flippedCards, then wait 1 second, then reset both cards color and
	lastClickedID = clickedID;
	if (gameComplete()) {
		document.getElementById('reset-button').style.visibility = 'visible';
		// if the score is lower than the current best score, replace it in local storage
		if (score < bestScore || bestScore === 0) {
			localStorage.setItem('bestScore', score);
			setTimeout(function() {
				alert(`New best score of ${score}! Previous: ${bestScore}`);
				bestScore = score;
			}, 500);
		}
	}
}

// when the DOM loads

// game only starts when the start button is pressed
let startButton = document.getElementById('start-button');

startButton.onclick = function() {
	startButton.style.visibility = 'hidden';
	createDivsForColors(shuffledColors);

	document.getElementById('game').style.visibility = 'visible';
	console.log('Game started!');
};

let resetButton = document.getElementById('reset-button');

resetButton.onclick = function() {
	resetButton.style.visibility = 'hidden';
	window.location.reload();
};
