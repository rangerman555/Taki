import React from "react";
import ReactDOM from 'react-dom';
import { SSL_OP_SSLEAY_080_CLIENT_DH_BUG } from 'constants';
import Card from "./Card.jsx";
import boardImage from "../assets/images/Desk.png";
import PlayerHand from "./PlayerHand.jsx";

let boardStyle = {
    backgroundImage: `url(${boardImage})`,
    width: 1024,
    height: 768,
    float: "left",
    display: 'block'
}

let logoStyle = {
  marginLeft: 220,
  marginTop: 300
}

let startGameButtonStyle = {
    display: "block",
     marginLeft: 430,
      marginTop: 20
}


export default class Board extends React.Component {
    constructor(props) {
        super (props);
   
        this.usersInGameOrder = [];
    }

    initOrderOfUsersInGame() {                
        for (let i = 0; i  < this.props.currentGame.playersInGame.length; i++) {
            if (this.props.currentGame.playersInGame[i].name == this.props.currentUser.name) {
                this.usersInGameOrder[i] = true;
            } else {
                this.usersInGameOrder[i] = false;
            }
        }
    }

    exitGameHandler() {
        this.props.exitGame();
        let details = {gameDetails: this.props.currentGame, userWhoPressed: this.props.currentUser}
        fetch('./lobby/exitgame', {method:'POST', body: JSON.stringify(details), credentials: 'include'})
    }

    render() {
        let content = null;
        let choiceButtons = null;
      
        if(this.props.currentGame.isTakiCardOn && this.props.currentGame.playerOfThisTurn.name == this.props.currentUser.name) {
            choiceButtons = (
                <div style={{marginLeft: 200, marginTop: -130}}>
                    <button className="closeTakiButton" onClick={() => this.props.closeTaki()}>Close Taki</button>
                </div>
            );
        }
         else if (this.props.currentGame.isChangeColorOn && this.props.currentGame.playerOfThisTurn.name == this.props.currentUser.name){
            choiceButtons = (
                <div style={{marginLeft: 200, marginTop: -130}}>
                    <button className="blueButton" onClick={() => this.props.changeColorHandler("blue")}>Blue</button>
                    <button className="greenButton" onClick={() => this.props.changeColorHandler("green")}>Green</button>
                    <button className="redButton" onClick={() => this.props.changeColorHandler("red")}>Red</button>
                    <button className="yellowButton" onClick={() => this.props.changeColorHandler("yellow")}>Yellow</button>
                </div>
            )
        }
   
         if (!this.props.currentGame.didGameStart && !this.props.currentGame.isGameOver){
            content = (
                <div>
                    <p style={{textAlign: 'center', color: 'white', fontSize: 40}}>Waiting for {this.props.currentGame.numOfPlayers - this.props.currentGame.numOfPlayersInGame} more players</p>
                    <img style={logoStyle} src={require("../assets/images/taki_logo.png")} />   
                    <button onClick={() => this.exitGameHandler()} style={startGameButtonStyle}>Exit Game</button>
                </div>
            );
        } 
        else if (this.props.currentGame.didGameStart) {
            this.initOrderOfUsersInGame();
            this.props.setDragEvents();
            let pileCardSource = null;
            if (this.props.currentGame.pileArray[this.props.currentGame.pileArray.length - 1].src != "") {
                pileCardSource = require(`../assets/images/${this.props.currentGame.pileArray[this.props.currentGame.pileArray.length - 1].src}`);
            }
           
            content = (        
                <div className='boardContainer'>
                    <div className='topPlayerContainer'>
                        <PlayerHand cards={this.props.currentGame.playersInGame[0].cards}
                                    showCards={this.usersInGameOrder[0]}
                                    locationOnBoard={'top'}/>
                    </div>
                    <div className='middleSectionContainer'>
                        <div className='leftPlayerContainer'> 
                        {   
                            this.props.currentGame.playersInGame.length >= 3 ? <PlayerHand cards={this.props.currentGame.playersInGame[2].cards} 
                                        showCards={this.usersInGameOrder[2]}
                                        locationOnBoard={'left'} /> : null
                        }
                        </div>
                        <div className='gameArea'> 
                            <Card //deck of cards
                                details={this.props.currentGame.deckOfCards[this.props.currentGame.deckOfCards.length - 1]}
                                showCards={false}
                                onClick={() => this.props.takeCardFromDeck()}
                            />

                            <img //pile of cards
                            src={pileCardSource}
                            width={100}
                            height={180}
                            style={{marginLeft: 250, marginTop: 100}} 
                            onDragEnter={(e) => e.preventDefault()}
                            onDragOver={(e) => e.preventDefault()}
                            onDrop={(e) => this.props.dropEvent(e)}
                            />

                            {choiceButtons}
                    
                        </div>
                        <div className='rightPlayerContainer'> 
                           {
                                this.props.currentGame.playersInGame.length == 4 ? <PlayerHand cards={this.props.currentGame.playersInGame[3].cards}
                                        showCards={this.usersInGameOrder[3]}
                                        locationOnBoard={'right'} /> : null
                           }   
                        </div>
                    </div>
                    <div className='bottomPlayerContainer'> 
                        <PlayerHand cards={this.props.currentGame.playersInGame[1].cards} 
                                    showCards={this.usersInGameOrder[1]} 
                                    locatoinOnBoard={'bottom'}/>
                    </div>
                   
                </div>
            );
        }

        return (
            <div style={boardStyle}>
                {content}
            </div>
        );
    }
}