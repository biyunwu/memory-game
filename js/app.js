// GLOBAL VARIABLES
// Create a list that holds all cards
const cards = ["fa-diamond", "fa-paper-plane-o", "fa-anchor", "fa-bolt", "fa-cube", "fa-bomb", "fa-leaf", "fa-bicycle"];
// Store original HTML for rendering the original state.
const originalBodyHTML = document.body.innerHTML;
// Declare variables to store DOM elements. These DOM elements get updated when the game restarts.
let moves, stars, minutesLabel, secondsLabel, deck;
// Declare variables to store data of array(Store opened cards in the array for comparing. The length cannot be more than 2), num, num, boolean, object, num
// A timer function will be stroed in "timer" for future clearing
let openCards, moveCounter, matchedIcons, gameStart, timer, totalSeconds;
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

// Initiate the game
start();
// Restart the game when requested
document.body.addEventListener("click", reset, false);

function start(){
    // Store DOM elements in declared variables
    getElements();
    // Initiate data
    initiateData();
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
    deck.appendChild(fragmentList);
    // Add event listener to the cards' container
    deck.addEventListener("click", displayCard, false);
}

function getElements(){
    moves = document.querySelector(".moves");
    stars = document.querySelectorAll(".fa.fa-star");
    minutesLabel = document.getElementById("minutes");
    secondsLabel = document.getElementById("seconds");
    deck = document.querySelector(".deck");
}

function initiateData(){
    openCards = [];
    moveCounter = 0;
    matchedIcons = 0;
    gameStart = false;
    // A timer function will be stroed for future clearing
    timer = null;
    // Second counter
    totalSeconds = 0;
}
    
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
        node.className += " open show flip";
        // Store in the opened list
        openCards.push(node);
        // If there is not only 1 card opened, then compare the cards in the list.
        if(openCards.length > 1){
            const firstCard = openCards[0];
            // Prevent the situation that the same card is cliked for two times.
            if(firstCard !== node && (firstCard.querySelector("i").className === node.querySelector("i").className)){
                setTimeout(matchCards, 500);
                incrementMoveCounter();
            } else {
                // Shaking animation with red background indicates the wrong guess after 1 second.
                setTimeout(addWrongAnimation, 500);
                // Leave 1 second to show the second card, then hide the ummatched cards.
                setTimeout(hideCards, 1500);
                if(firstCard !== node){
                    incrementMoveCounter();
                }
            }
        }
    }
}

function matchCards(){
    openCards.forEach((card) => {card.className = "card match"});
    openCards = [];
    // Record game progress
    matchedIcons += 1;
    // Check if the game is finished
    if(matchedIcons === cards.length){
        // Stop timer
        clearInterval(timer);
        // Leave 1 second to display all matched cards. Then, display the statistics page.
        setTimeout(statistics, 1000);
    }
}

function addWrongAnimation(){
    openCards.forEach((card) => {card.className += " wrong"});
}

function hideCards(){
    openCards.forEach((card) => {card.className = "card"});
    openCards = [];
}

// Update move counter.
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
function setTime() {
    ++totalSeconds;
    secondsLabel.innerHTML = pad(totalSeconds % 60);
    minutesLabel.innerHTML = pad(parseInt(totalSeconds / 60));
}

// Helper method for setTime()
function pad(val) {
    const valString = val + "";
    if (valString.length < 2) {
        return "0" + valString;
    } else {
        return valString;
    }
}

// Show statistics of the user's performance after the game is finished
function statistics(){
    document.body.style.background = "white";
    document.body.innerHTML = `
    <div class="container center">
        ${successAnimation}
        <h1>Congratulations! You Won!</h1> 
        <p>With ${moveCounter} Moves and ${document.querySelectorAll(".fa.fa-star").length} stars.</p>
        <p>Finished in ${minutesLabel.textContent} : ${secondsLabel.textContent}</p>
        <p>Wooooooooo!</p>
        <button class="btn reset" type="submit">Play again</button>
    </div>`;
}

// Restart game
function reset(event){
    let currClasses = event.target.className;
    if (currClasses.includes("reset")){
        // Reset data and clear timer, then call start()
        document.body.innerHTML = originalBodyHTML;
        clearInterval(timer);
        initiateData();
        start();
    }
}