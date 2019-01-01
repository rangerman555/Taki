const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const auth = require('./auth');
const statistics = require('./statistics');
const gameLogic = require('./gameLogic');
const lobby = require('./lobby');


router.post('/putcardonpile', (req, res) => {
    const userName = auth.getUserInfo(req.session.id).name;
    const reqBody = JSON.parse(req.body);
    const cardId = reqBody.cardId;
    const gameName = reqBody.gameName;
    let gameDetails = gameLogic.getCurrentPlayerGame(gameName);
    if (userName == gameDetails.playerOfThisTurn.name) { //checking if it's the player's turn
        let cardToPutInPile = gameLogic.getCardById(gameDetails, cardId, userName);
        if (cardToPutInPile) {
            if (gameLogic.isLegalPlayMove(gameDetails, cardToPutInPile)) {
                gameLogic.checkIfSpecialCard(gameDetails, cardToPutInPile, userName);
            }
        
        }
        
    } 
    
    res.json({gameDetails: gameDetails});
    res.end();
});


router.post('/takecard', (req, res) => {
    const userName = auth.getUserInfo(req.session.id).name;
    const gameName = JSON.parse(req.body).gameName;
    let gameDetails = gameLogic.getCurrentPlayerGame(gameName);
    if (userName == gameDetails.playerOfThisTurn.name) { //checking if it's the player's turn
        gameLogic.takeCardFromDeck(gameDetails);
    } 

    res.json({gameDetails: gameDetails});
    res.end();
});

router.post('/changecolor', (req, res) => {
    const userName = auth.getUserInfo(req.session.id).name;
    const reqBody = JSON.parse(req.body);
    const color = reqBody.color;
    const gameName = reqBody.gameName;
    let gameDetails = gameLogic.getCurrentPlayerGame(gameName);
    if (userName == gameDetails.playerOfThisTurn.name) { //checking if it's the player's turn
        gameLogic.changeColorHandler(gameDetails, color);
    } 
    res.end();
});

router.post('/closetaki', (req, res) => {
    const userName = auth.getUserInfo(req.session.id).name;
    const gameName = JSON.parse(req.body).gameName;
    let gameDetails = gameLogic.getCurrentPlayerGame(gameName);
    if (gameDetails !== null){
        if (userName == gameDetails.playerOfThisTurn.name) { //checking if it's the player's turn
            gameLogic.closeTaki(gameDetails);
        } 
    }
    res.end();
});




module.exports = router;