let gamesClocks = {};
let turnClocks = {};

function countGameTime(game) {
    gamesClocks[game.gameName] = setInterval(() => gameTimer(game), 1000);
}

function endCountGametime(game) {
    clearInterval(gamesClocks[game.gameName]);
}

function gameTimer(game) {
    game.numOfSecondsInGame++;
    var minutes = parseInt(game.numOfSecondsInGame / 60, 10);
    var seconds = parseInt(game.numOfSecondsInGame % 60, 10);

    minutes = minutes < 10 ? '0' + minutes : minutes;
    seconds = seconds < 10 ? '0' + seconds : seconds;

    game.time = `${minutes}: ${seconds}`;
}

function startCountTurnTime(game){
    game.playerOfThisTurn.turnSecondsCounter = 0;
    turnClocks[game.gameName] = setInterval(() => {
        game.playerOfThisTurn.turnSecondsCounter++;
     }, 1000);
 }

function endCountTurnTime(game) {
    let averageTurnTime;
    clearInterval(turnClocks[game.gameName]);
    game.playerOfThisTurn.sumOfSecondsInTotalTurns += game.playerOfThisTurn.turnSecondsCounter;
    averageTurnTime = game.playerOfThisTurn.sumOfSecondsInTotalTurns / game.playerOfThisTurn.numOfTurns;
    averageTurnTime = Math.round(averageTurnTime * 10 ) / 10;
    game.playerOfThisTurn.averageTurnTime = averageTurnTime;

 }

module.exports = {
    gameTimer,
    countGameTime, 
    startCountTurnTime, 
    endCountTurnTime,
    endCountGametime
}
