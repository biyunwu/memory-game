/*
 * Create a list that holds all of your cards
 */
const cards = ["fa-diamond", "fa-paper-plane-o", "fa-anchor", "fa-bolt", "fa-cube", "fa-bomb", "fa-leaf", "fa-bicycle"];
let openCards = [];
let moveCounter = 0;

/*
 * Display the cards on the page
 *   - shuffle the list of cards using the provided "shuffle" method below
 *   - loop through each card and create its HTML
 *   - add each card's HTML to the page
 */
const cardList = shuffle(cards.concat(cards));
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
deck.addEventListener("click", displayCard, false);

function displayCard(event){
    const currNode = event.target;
    if(currNode.nodeName === "LI"){
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
            if(openCards[0].querySelector("i").className === openCards[1].querySelector("i").className){
                matchCards();
            } else {
                addWrongAnimation();
                // Leave 1 second to show the second card, then hide the ummatched cards.
                setTimeout(hideCards, 1000);
            }
            incrementMoveCounter();
        }
    }
}

function matchCards(){
    openCards.forEach((card) => {
        // Dispaly the matched cards by adding classes.
        card.className = "card match"
        // card.removeEventListener("click", displayCard)
    });
    openCards = [];
}

function addWrongAnimation(){
    openCards.forEach((card) => {card.className += " wrong"});
}

function hideCards(){
    openCards.forEach((card) => {card.className = "card"});
    openCards = [];
}

// Update move counter.
const moves = document.querySelector(".moves");
const stars = document.querySelectorAll(".fa.fa-star");
function incrementMoveCounter(){
    const num = Number(moves.textContent) + 1;
    moves.textContent = num;
    if(12 < num && num <= 16){
        stars[stars.length - 1].className = "fa fa-star-o";
    } else if (16 < num && num <= 20){
        stars[stars.length - 2].className = "fa fa-star-o";
    } else if (num > 20){
        stars[stars.length - 3].className = "fa fa-star-o";
    }
}