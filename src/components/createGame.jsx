import React from 'react';
import ReactDOM from 'react-dom';


export default class CreateGame extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            errorMessage: ""
        }

        
    }

    componentDidMount() {
        this.handleCreateGame = this.handleCreateGame.bind(this); 
    }

    render() {
        return (
            <div className="createGameForm">
                <form onSubmit={this.handleCreateGame}> 
                    Game's name: <input type="text" name="gameName" ref={input => this.gameName = input} /><br/>
                    Number of players: <input type="text" name="maxNumOfPlayers" ref={input => this.numOfPlayers = input}/><br/>
                    <p className='errorMessageCreateGame'>{this.state.errorMessage}</p>
                    <input type="submit" value="Submit" />
                </form>
            </div>
        );
    }

    handleCreateGame(e) { 
        e.preventDefault();
        if (this.gameName.value !== undefined) {
            let gameInfo = {
                gameName: this.gameName.value,
                creator: this.props.currentUser,
                numOfPlayers: this.numOfPlayers.value,
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
    
            fetch('/lobby/creategame', {method:'POST', body: JSON.stringify(gameInfo), credentials: 'include'})
            .then(res => {
                this.gameName.value = "";
                this.numOfPlayers.value = "";
                return res.json();
            }).then(data => {
                this.setState(() => ({errorMessage: data.errorMessage}));
            })
        
        }
    }
}
