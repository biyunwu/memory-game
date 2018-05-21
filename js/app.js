/*
 * Create a list that holds all of your cards
 */
const cards = ["fa-diamond", "fa-paper-plane-o", "fa-anchor", "fa-bolt", "fa-cube", "fa-bomb", "fa-leaf", "fa-bicycle"];
let openCards = [];
let moveCounter = 0;
let matchedIcons = 0;
let gameStart = false;
let timer = null;

/*
 * Display the cards on the page
 *   - shuffle the list of cards using the provided "shuffle" method below
 *   - loop through each card and create its HTML
 *   - add each card's HTML to the page
 */
// Double the cards in the array, then shuffle them randomly
const cardList = shuffle(cards.concat(cards));
// Create each card's HTML and add them to DOM
const fragmentList = document.createDocumentFragment();
for (const card of cardList){
    const li = document.createElement("li");
    li.className = "card";
    const i = document.createElement("i");
    i.className = "fa " + card;
    li.appendChild(i);
    fragmentList.appendChild(li);
}
const deck = document.querySelector(".deck");
deck.appendChild(fragmentList);

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
// Add event listener to the cards' container
deck.addEventListener("click", displayCard, false);

function displayCard(event){
    const currNode = event.target;
    // Check clicked element
    if(currNode.nodeName === "LI"){
        if(!gameStart){
            gameStart = true;
            timer = setInterval(setTime, 1000);
        }
        if(!currNode.className.includes("match")){
            checkCard(currNode);
        }
    }
}

function checkCard(node){
    if(openCards.length < 2){
        // Add CSS to show the card's icon.
        node.className += " open show";
        // Store in the opened list
        openCards.push(node);
        // If there is not only 1 card opened, then compare the cards in the list.
        if(openCards.length > 1){
            const firstCard = openCards[0];
            // Prevent the situation that the same card is cliked for two times.
            if(firstCard !== node && (firstCard.querySelector("i").className === node.querySelector("i").className)){
                matchCards();
            } else {
                addWrongAnimation();
                // Leave 1 second to show the second card, then hide the ummatched cards.
                setTimeout(hideCards, 1000);
            }
            incrementMoveCounter();
            // Check if the game is finished
            if(matchedIcons === cards.length){success();}
        }
    }
}

function matchCards(){
    openCards.forEach((card) => {card.className = "card match"});
    openCards = [];
    // Record game progress
    matchedIcons += 1;
}

function addWrongAnimation(){
    openCards.forEach((card) => {card.className += " wrong"});
}

function hideCards(){
    openCards.forEach((card) => {card.className = "card";});
    openCards = [];
}

// Update move counter.
const moves = document.querySelector(".moves");
const stars = document.querySelectorAll(".fa.fa-star");
function incrementMoveCounter(){
    moveCounter += 1;
    moves.textContent = moveCounter;
    // The lowest score is 1 star
    if(12 < moveCounter && moveCounter <= 16){
        stars[stars.length - 1].className = "fa fa-star-o";
    } else if (moveCounter > 16){
        stars[stars.length - 2].className = "fa fa-star-o";
    }
}

// Timer function modified based on https://stackoverflow.com/questions/5517597/plain-count-up-timer-in-javascript
const minutesLabel = document.getElementById("minutes");
const secondsLabel = document.getElementById("seconds");
let totalSeconds = 0;

function setTime() {
    ++totalSeconds;
    secondsLabel.innerHTML = pad(totalSeconds % 60);
    minutesLabel.innerHTML = pad(parseInt(totalSeconds / 60));
}
function pad(val) {
    const valString = val + "";
    if (valString.length < 2) {
        return "0" + valString;
    } else {
        return valString;
    }
}

// Show statistics of the user's performance after the game is finished
function success(){
    // Stop timer
    clearInterval(timer);
    document.body.style.background = "white";
    document.body.innerHTML = `
    <div class="container center">
        ${successAnimation}
        <h1>Congratulations! You Won!</h1> 
        <p>With ${moveCounter} Moves and ${document.querySelectorAll(".fa.fa-star").length} stars.</p>
        <p>Finished in ${minutesLabel.textContent} : ${secondsLabel.textContent}</p>
        <p>Wooooooooo!</p>
        <button class="btn" type="submit"  onClick="window.location.reload();">Play again</button>
    </div>`;
}

// Success animation HTML template. It functions with its CSS.
const successAnimation = `
<div class="check_mark">
    <div class="sa-icon sa-success animate">
        <span class="sa-line sa-tip animateSuccessTip"></span>
        <span class="sa-line sa-long animateSuccessLong"></span>
        <div class="sa-placeholder"></div>
        <div class="sa-fix"></div>
    </div>
</div>
`;