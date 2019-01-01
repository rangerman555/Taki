const statistics = require('./statistics');
let CardDetails = require('./cardDetails');

let deckOfCards;
let cardId;
let gamesList = [];


function startGame(game) {
    deckOfCards = [];
    cardId = 1;
    initDeckOfCards();
    shuffle(deckOfCards);
    game.deckOfCards = deckOfCards;
    dealCardsToPlayers(game);
    game.pileArray.push(game.deckOfCards.pop()); //putting the first card in the pile
    game.playerOfThisTurn = game.playersInGame[0];
    preventFromChangeColorBeTheFIrstCardInPile(game);
    statistics.startCountTurnTime(game);
}

function dealCardsToPlayers(game) {
    for (let i = 0; i  < game.playersInGame.length; i++) {
         for (let j = 0; j < 8; j++) {
             game.playersInGame[i].cards.push(game.deckOfCards.pop());
         }
    }
}

function initDeckOfCards() {
    initOneColorCardsArray("blue");
    initOneColorCardsArray("blue");
    initOneColorCardsArray("green");
    initOneColorCardsArray("green");
    initOneColorCardsArray("yellow");
    initOneColorCardsArray("yellow");
    initOneColorCardsArray("red");
    initOneColorCardsArray("red");
    
    for(let i = 0; i < 4; i++){   //adding 4 "change color" cards
        deckOfCards.push(new CardDetails("otherCards/changeColor.png", "allColors", "changeColor", cardId));
        cardId++;
    }

    for(let i = 0; i < 2; i++){   //adding 2 "super taki" cards
        deckOfCards.push(new CardDetails("otherCards/superTaki.png", "allColors", "superTaki", cardId));
        cardId++;
    }
}

function initOneColorCardsArray(color){  //this function adds all the cards from the specified color to the deck of cards
    for(let i = 1; i <= 9; i++){
        deckOfCards.push(new CardDetails(color+"/" +color+ i + ".png", color, i, cardId));
        cardId++;
    }

    deckOfCards.push(new CardDetails(color+"/"+color+"Plus.png", color, "plus", cardId));
    cardId++;
    deckOfCards.push(new CardDetails(color+"/"+color+"Stop.png", color, "stop", cardId));
    cardId++;
    deckOfCards.push(new CardDetails(color+"/"+color+"Taki.png", color, "taki", cardId));
    cardId++;
}

function shuffle(deck){
    let deckSize = deck.length;
    let index1;
    let index2;
    let temp;

    for(var i = 0; i < 200; i++){
        index1 = Math.floor(Math.random() * deckSize);
        index2 = Math.floor(Math.random() * deckSize);
        temp = deck[index1];
        deck[index1] = deck[index2];
        deck[index2] = temp;
    }
}

function preventFromChangeColorBeTheFIrstCardInPile(game) {
    while (game.pileArray[game.pileArray.length - 1].name == "changeColor" || game.pileArray[game.pileArray.length - 1].name == "superTaki") {  
        game.pileArray.push(game.deckOfCards.pop());
    }
}

function getCardById(game, cardId, playerName) {
    let playerRef = getPlayerRefByName(game, playerName);
    let cardToReturn = null;
    for(let i = 0; i < playerRef.cards.length; i++) {
        if(playerRef.cards[i].id == cardId) {
            cardToReturn = playerRef.cards[i];
        }
    }
    return cardToReturn;
}

function putCardInPile(game, cardId, playerName) {
    for(let i = 0; i < game.playerOfThisTurn.cards.length; i++) {
        if(game.playerOfThisTurn.cards[i].id == cardId) {
            game.pileArray.push(game.playerOfThisTurn.cards[i]);
            game.playerOfThisTurn.cards.splice(i, 1);
        }
    }
}

function getPlayerRefByName(game, name) {
    let playerRef = null;
    for (let i = 0; i < game.playersInGame.length; i++) {
        if (game.playersInGame[i].name == name) {
            playerRef = game.playersInGame[i];
        }
    }

    return playerRef;
}

function getCurrentPlayerGame(gameName) {
	for (let i = 0; i < gamesList.length; i++) {
		if (gamesList[i].gameName == gameName) {
			return gamesList[i];
		}
	}
	return null;
}

function checkIfSpecialCard(game, playerCard, userName) {
    
    if (playerCard.name == "superTaki") {
        let newColorForTaki = game.pileArray[game.pileArray.length -1].color;
        playerCard.src = `${newColorForTaki}/${newColorForTaki}Taki.png`;
        playerCard.color = newColorForTaki;
    } 

    putCardInPile(game, playerCard.id, userName);

    if (playerCard.name == "changeColor") {
        game.globalInstruction = `${game.playerOfThisTurn.name} put Choose color card`;
    } else if (playerCard.name == "taki" || playerCard.name == "superTaki") {
        game.globalInstruction = `${game.playerOfThisTurn.name} Put ${playerCard.color} Taki card`;
    } else if (playerCard.name == "plus") {
        game.globalInstruction = `${game.playerOfThisTurn.name} put a Plus card and has another turn`;
    } else if (playerCard.name == "stop") {
        let nextPlayer = getNextTurnPlayer(game);
        game.globalInstruction = `${game.playerOfThisTurn.name} put a Stop card and skips ${nextPlayer}'s turn`;
    } else {
        game.globalInstruction = `${game.playerOfThisTurn.name} put ${playerCard.name} ${playerCard.color}`;
    }

    if (game.isTurnOver) {
        changeTurn(game);
    }
    
}

function getNextTurnPlayer(game) {
    let nextPlayer = null;
    for (let i = 0; i < game.playersInGame.length; i++) {
        if (game.playersInGame[i].name == game.playerOfThisTurn.name) {
            nextPlayer = game.playersInGame[(i + 1) % game.playersInGame.length];
            break;
        } 
    }
    return nextPlayer.name;
}

function isLegalPlayMove(game, playerCard, justCheckingIfLegal=false) {
    let res = false;
    let pileCard = game.pileArray[game.pileArray.length - 1];

    if (pileCard.name == 2 && game.plus2Counter > 0) {
        if (playerCard.name == 2) {
            res = true;
            game.isTurnOver = true;
            game.plus2Counter++;
        }
    } else if (!game.isChangeColorOn && (playerCard.color == pileCard.color ||
            (playerCard.name == pileCard.name && !game.isTakiCardOn) ||
            (playerCard.name == "taki" && pileCard.name == "superTaki" && !game.isTakiCardOn) || 
            playerCard.name == "changeColor" || playerCard.name == "superTaki") ) {

                res = true;
                
                if (!justCheckingIfLegal) {
                    if (playerCard.name != "taki" && playerCard.name != "changeColor"
                    && playerCard.name != "plus" && playerCard.name != "superTaki" && !game.isTakiCardOn) {
                        game.isTurnOver = true;
                        if (playerCard.name == "stop") {
                            game.skipTurn = true;
                        }

                        if (playerCard.name == 2) {
                            game.plus2Counter++;
                        }
                    } else if(playerCard.name == "taki" || playerCard.name == "superTaki") {
                        game.blockChangeColorCard = true;
                        game.blockTakeCardsFromDeck = true;
                        
                        if (!game.isTakiCardOn) {
                            game.isTakiCardOn = true;
                        }
            
                    } else if (playerCard.name == "changeColor") {
                        if (game.blockChangeColorCard) {
                            res = false;
                        } else {
                            game.blockTakeCardsFromDeck = true;
                            game.blockPutCardInPile = true;
    
                            game.isChangeColorOn = true;
                    
                        }
                    } 
                }
        }

    if (res == false) {
        game.globalInstruction = "You can't put that card";
    }
    return res;
}

function moveTurnToNextPlayer(game) {
    let skipIndex = game.skipTurn ? 2 : 1;
    let index = 1;
  
    for (let i = 0; i < game.playersInGame.length; i++) {
        if (game.playersInGame[i].name == game.playerOfThisTurn.name) {
            for (let j = 0; j < skipIndex; j++) {
                while(game.playersInGame[(i + index) % game.numOfPlayers].finishedTheGame) {
                    index++;
                    
                }
                i = (i+index) % game.numOfPlayers;
                index = 1;
            }
            game.playerOfThisTurn = game.playersInGame[i];
            break;
        } 
    }
}

function gameOverHandler(game) {
    game.isGameOver = true;
    for (let i = 0; i < game.playersInGame.length; i++) {
        if (!game.playersInGame[i].finishedTheGame) {
            game.winnersArray.push(game.playersInGame[i]);
            game.playersInGame[i].finishedTheGame = true;
            game.playersInGame[i].winningPosition = game.winningPositions;
        }
    }
    game.numOfPlayersInGame--;
    statistics.endCountGametime(game);
}

function changeTurn(game) {  
    game.playerOfThisTurn.numOfTurns++; 
    statistics.endCountTurnTime(game);
    if (game.playerOfThisTurn.cards.length == 0 && !game.isTakiCardOn) {
            game.playerOfThisTurn.winningPosition = game.winningPositions;
            game.winningPositions++;
            game.winnersArray.push(game.playerOfThisTurn);
            for (let i = 0; i < game.playersInGame.length; i++) {
                if (game.playersInGame[i].name == game.playerOfThisTurn.name) {
                    game.playersInGame[i].finishedTheGame = true;
                    moveTurnToNextPlayer(game);
                    game.skipTurn = false;
                    game.isTurnOver = false;
                    
                    game.numOfPlayersInGame--;
                    game.globalInstruction = `${game.playersInGame[i].name} finished in the ${game.playersInGame[i].winningPosition} place`;
                    break;
                }
            }
       
        if (game.winnersArray.length == (game.numOfPlayers - 1)) {
            gameOverHandler(game);
        }
      
    } else if (game.playerOfThisTurn.cards.length !== 0) {
            checkIfLastCardInHand(game);
            moveTurnToNextPlayer(game);
            game.skipTurn = false;
            game.isTurnOver = false;
            statistics.startCountTurnTime(game);
        }
    
}

function initGameDetails(game) {
   let newGame = {
        gameName: game.gameName,
        creator: game.creator,
        numOfPlayers: game.numOfPlayers,
        numOfPlayersInGame: 0,
        didGameStart: false,
        playersInGame: [],
        numOfSecondsInGame: 0,
        clock: null,
        time: "00:00",
        deckOfCards: [],
        pileArray: [],
        playerOfThisTurn: {name: ''},
        pileTopCard: {src: ""},
        plus2Counter: 0,
        isTurnOver: false,
        isChangeColorOn: false,
        isTakiCardOn: false,
        blockChangeColorCard: false,
        blockTakeCardsFromDeck: false,
        blockPutCardInPile: false,
        winner: '',
        isGameOver: false,
        playerHasLegalCardToPutInPile: false,
        skipATurn: false,
        winningPositions: 1,
        winnersArray: [],
        globalInstruction: '',
        numOfPlayersInLobby: 0,
   }

   return newGame;
}

function checkIfLastCardInHand(game) {
    if (game.playerOfThisTurn.cards.length == 1){
        game.playerOfThisTurn.numOfTimesPlayerHasOneCard++;
    }
}

function checkIfPlayerHasLegalCardToPutInPile(game) {
    for (let i = 0; i < game.playerOfThisTurn.cards.length; i++) {
        if (isLegalPlayMove(game, game.playerOfThisTurn.cards[i], true)) {
            game.blockTakeCardsFromDeck = true;
            game.playerHasLegalCardToPutInPile = true;
            break;
        }
    }
}

function takeCardFromDeck(game) {
    checkIfPlayerHasLegalCardToPutInPile(game);
    if (!game.blockTakeCardsFromDeck && (game.deckOfCards.length > 0 || game.pileArray.length > 1)) {
        
        if (game.deckOfCards.length == 0) {
            for (let i = 0; i < game.pileArray.length; i++) {
                if (game.pileArray[game.pileArray.length - 1].name == "changeColor"){ //changing the color of the changeColor card back to "allColors";
                    game.pileArray[game.pileArray.length - 1].color = "allColors";
                } else if (game.pileArray[game.pileArray.length - 1].name == "superTaki"){
                    game.pileArray[game.pileArray.length - 1].color = "allColors";
                    game.pileArray[game.pileArray.length - 1].src = "otherCards/superTaki.png";
                }

                game.deckOfCards.push(game.pileArray.pop());
                game.globalInstruction = `${game.playerOfThisTurn.name} took a card from the pile`;
            }

            shuffle(game.deckOfCards);
            preventFromChangeColorBeTheFIrstCardInPile(game); // needs to add this function as well
        }

        let numOfCardsToTake = 1;
        if (game.pileArray[game.pileArray.length - 1].name == 2 && game.plus2Counter > 0) {
            numOfCardsToTake = 2 * game.plus2Counter;
        }

        for (let i = 0; i < numOfCardsToTake; i++) {
            game.playerOfThisTurn.cards.push(game.deckOfCards.pop()); 
            game.globalInstruction = `${game.playerOfThisTurn.name} took a card from the deck`;
        }

        game.plus2Counter = 0;
        changeTurn(game);

    } else if (game.blockTakeCardsFromDeck){
        if (game.isTakiCardOn){
            game.globalInstruction = 'Close the Taki first!';
        } else if (game.isChangeColorOn) {
            game.globalInstruction = 'Choose color first!';
        } else if (game.playerHasLegalCardToPutInPile) {
            game.globalInstruction = 'You have a card to play with';
            game.playerHasLegalCardToPutInPile = false;
            game.blockTakeCardsFromDeck = false;
        } 
        
    }
}

function changeColorHandler(game, color) {
    game.globalInstruction = "";
    game.isChangeColorOn = false;
    game.pileArray[game.pileArray.length - 1].color = color;
    game.blockPutCardInPile = false;
    game.blockTakeCardsFromDeck = false;
}

function closeTaki(game) {
    game.globalInstruction = "";
    if (game.pileArray[game.pileArray.length - 1].name == 2){
        game.plus2Counter++;
    }

    game.blockTakeCardsFromDeck = false;
    game.blockChangeColorCard = false;
    game.isTakiCardOn = false;
    game.isTurnOver = true;
    changeTurn(game);
}




module.exports = {
    startGame,
    getCardById,
    getCurrentPlayerGame,
    gamesList,
    isLegalPlayMove,
    putCardInPile,
    changeTurn,
    takeCardFromDeck,
    checkIfSpecialCard,
    changeColorHandler,
    closeTaki,
    initGameDetails,   
}

