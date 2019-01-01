const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const auth = require('./auth');
const statistics = require('./statistics');
const gameLogic = require('./gameLogic');

let playersAndTheirGame = {}

router.post('/creategame',createGame, (req, res) => {});

router.get('/reloadgame', (req, res) => {
	const userName = auth.getUserInfo(req.session.id).name;
	let gameDetails = gameLogic.getCurrentPlayerGame(playersAndTheirGame[userName]);
	let usersList = auth.getUserList();
	let details = {
		currentUser: userName,
		gameDetails: gameDetails,
		usersList: usersList,
		gamesList: gameLogic.gamesList
	};

	res.json(details);
});


router.post('/exitgame', (req, res) => {
	let details = JSON.parse(req.body);
	for(let i = 0; i < gameLogic.gamesList.length; i++) {
		if (gameLogic.gamesList[i].gameName === details.gameDetails.gameName) { 		
			playersAndTheirGame[details.userWhoPressed.name] = null;
			for (let j = 0; j < gameLogic.gamesList[i].playersInGame.length; j++) {
				if (gameLogic.gamesList[i].playersInGame[j].name === details.userWhoPressed.name && !gameLogic.gamesList[i].didGameStart) {
					gameLogic.gamesList[i].playersInGame.splice(j, 1);
					gameLogic.gamesList[i].numOfPlayersInGame--;
				}
			}

			if (gameLogic.gamesList[i].didGameStart) {
				gameLogic.gamesList[i].numOfPlayersInLobby++;
				if (gameLogic.gamesList[i].numOfPlayersInLobby == gameLogic.gamesList[i].numOfPlayers) {
					let newGame = gameLogic.initGameDetails(gameLogic.gamesList[i]);
					gameLogic.gamesList[i] = newGame;
				}
			}
		}
	}

	res.end();

});


router.post('/deletegame', (req, res) => {
	for (let i = 0; i < gameLogic.gamesList.length; i++) {
		if (gameLogic.gamesList[i].gameName === req.body) {
			if (gameLogic.gamesList[i].playersInGame.length == 0) {
				gameLogic.gamesList.splice(i, 1);
			} else {
				res.sendStatus(403);
			}
		}
	}
	res.end();
});

router.post('/updategame', (req, res) => {
	let details = JSON.parse(req.body);
	const userName = auth.getUserInfo(req.session.id).name;
	let currentGameDetails = gameLogic.getCurrentPlayerGame(playersAndTheirGame[userName]);

	if (!currentGameDetails || !currentGameDetails.didGameStart) {
		let playerAlreadyInGame = false;

	//checking if the user is already in the game
    for (let i = 0; i < details.gameDetails.playersInGame.length; i++) {
        if (details.gameDetails.playersInGame[i].name === details.userWhoPressed) {
            playerAlreadyInGame = true;
        }
    }
     
    if (playerAlreadyInGame === false) {
		details.gameDetails.numOfPlayersInGame++;
		let newPlayer = {
			name: details.userWhoPressed,
			isMyTurn: false,
			cards: [],
			winningPosition: null,
			numOfTurns: 0,
			numOfTimesPlayerHasOneCard: 0,
			averageTurnTime: 0,
			turnSecondsCounter: 0,
			turnCounterInterval: 0,
			sumOfSecondsInTotalTurns: 0,
			CounterInterval: null,
			finishedTheGame: false

		}
        details.gameDetails.playersInGame.push(newPlayer);
	} 
		
	for(let i = 0; i < gameLogic.gamesList.length; i++) {
		if (gameLogic.gamesList[i].gameName === details.gameDetails.gameName) {
			gameLogic.gamesList[i] = details.gameDetails;
			if (gameLogic.gamesList[i].numOfPlayersInGame == gameLogic.gamesList[i].numOfPlayers) {
				gameLogic.gamesList[i].didGameStart = true;
				startGameStatistics(gameLogic.gamesList[i]);
				gameLogic.startGame(gameLogic.gamesList[i]);
				
			}           
		}
	}

	playersAndTheirGame[details.userWhoPressed] = details.gameDetails.gameName;
	}


	res.end();

});


function startGameStatistics(game) {
	statistics.countGameTime(game);
}

function createGame(req, res, next) {
	let newGame = JSON.parse(req.body);
	let isGameExist = false;
	let isNumOfPlayersValid = true;
	let message = "";
	
	for(let i = 0; i < gameLogic.gamesList.length; i++) {
		if (gameLogic.gamesList[i].gameName === newGame.gameName) { 
			isGameExist = true;
			message = "This game already exists";
		}
	}

	if (newGame.numOfPlayers != 2 && newGame.numOfPlayers != 3 && newGame.numOfPlayers != 4) {
		isNumOfPlayersValid = false;
		message = "Invalid number of players";
	} 

	if (!isGameExist && isNumOfPlayersValid) {
		gameLogic.gamesList.push(newGame);
	} 

	res.json({errorMessage: message})

	next();
}



module.exports = router;
	
