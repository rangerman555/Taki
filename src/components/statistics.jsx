import React from "react";
import ReactDOM from 'react-dom';

let StatisticsStyle = {
    float: "left",
    marginLeft: 20
}

export default class Statistics extends React.Component {
    constructor(props) {
        super(props);
    }

    checkIfPlayerWon() {
        let playerWon = false;
        for (let i = 0; i < this.props.currentGame.winnersArray.length; i++) {
            if (this.props.currentUser.name == this.props.currentGame.winnersArray[i].name) {
                playerWon = true;
            }
        }

        return playerWon;
    }

    getCurrentPlayer() {
        let currentPlayer = null;
        if (this.props.currentGame.playersInGame != undefined) {
            for (let i = 0; i < this.props.currentGame.playersInGame.length; i++) {
                if (this.props.currentGame.playersInGame[i].name == this.props.currentUser.name) {
                    currentPlayer = this.props.currentGame.playersInGame[i];
                }
            }
        }
        return currentPlayer;
    }

    render() {
        let content = null;
        let exitGameButton = null;
        let currentPlayer = this.getCurrentPlayer();
        let numOfTurns = currentPlayer ? currentPlayer.numOfTurns : null;
        let averageTurnTime = currentPlayer ? currentPlayer.averageTurnTime : null;
        let numOfTimesPlayerHasOneCard = currentPlayer ? currentPlayer.numOfTimesPlayerHasOneCard : null;
        let playerName = currentPlayer ? currentPlayer.name : null;
    

        if (this.checkIfPlayerWon()) {
            exitGameButton = (
                <div>
                    <button className="statisticsButtons" onClick={() => this.exitGameHandler()}>Exit Game</button>
                </div>
            );
        }

        if (!this.props.currentGame.isGameOver) {
            content = (
                <div style={StatisticsStyle}>
                    <h2 id="statisticsTitle">Statistics</h2>
                    <p style={{display: 'inline'}}>Player's Name: </p><h1 style={{display: 'inline'}}> {this.props.currentUser.name}</h1><br />
                    <p style={{display: 'inline'}}>Currnet player turn: </p><h3 style={{display: 'inline'}}>{this.props.currentGame.playerOfThisTurn.name}</h3>
                    <p>Game's Name: {this.props.currentGame.gameName}</p>
                    <p>Time: {this.props.currentGame.time}</p>
                    <p >Number of turns:{numOfTurns} </p>
                    <p>Average time for a turn: {averageTurnTime}  </p>
                    <p>Number of times player had one card left:{numOfTimesPlayerHasOneCard} </p>
                    <p style={{display: 'inline'}}>Players in game:</p> {this.props.currentGame.playersInGame.map((player) => (
                        <p key={player.name} style={{display: 'inline'}}>{player.name} </p>
                    ))}
                    <br />
                    <br/>
                    <h2>Instructions</h2>
                    <h4>{this.props.currentGame.globalInstruction}</h4>
                    <br /><br />
                    {exitGameButton}
                </div>
            )
        } else {
            content = (
                <div>
                    {this.props.currentGame.winnersArray.map((player, index) => (
                        <div key={player.name + index} className='afterGameStatistics'>
                            <h2 id="statisticsTitle">Winning place: #{player.winningPosition}</h2>
                            <p style={{display: 'inline'}}>Player's Name: </p><h1 style={{display: 'inline'}}> {player.name}</h1>
                            <p>Game's Name: {this.props.currentGame.gameName}</p>
                            <p>Time: {this.props.currentGame.time}</p>
                            <p >Number of turns:{player.numOfTurns}</p>
                            <p>Average time for a turn: {player.averageTurnTime}</p>
                            <p>Number of times player had one card left:{player.numOfTimesPlayerHasOneCard}</p>
                         
                        </div>
                    ))}
                    <button onClick={() => this.exitGameHandler()}>Back to lobby</button>
                </div>
            );
        }
           
      
        return (
            content
        );
    }
    
    exitGameHandler() {
        this.props.exitGame();
        let details = {gameDetails: this.props.currentGame, userWhoPressed: this.props.currentUser}
        fetch('./lobby/exitgame', {method:'POST', body: JSON.stringify(details), credentials: 'include'})
    }

}

