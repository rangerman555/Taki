import React from 'react';
import ReactDOM from 'react-dom';


export default class GameTable extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            deleteGameErrorMessage: "",
            gameToDeleteName: ""
        }

    }

    componentWillUnmount() {
        if (this.timeoutId) {
            clearTimeout(this.timeoutId);
        }
    }
    
    render() {
        return (
                <div>
                    <table className='gamesTable'>
                    <tbody>
                    <tr>
                        <th>Name</th>
                        <th>Creator</th>
                        <th>#Players</th>
                        <th>Game status</th>
                        <th>Join Game</th>
                    </tr>
                    {
                    this.props.gamesList.map((line, index) => (
                        <tr key={line.gameName + index}>
                            <td>{line.gameName}</td>
                            <td>{line.creator.name}</td> 
                            <td>{`${line.numOfPlayersInGame} / ${line.numOfPlayers}`}</td>
                            <td>{line.didGameStart ? "Active" : "Inactive"}</td>
                            <td>{line.didGameStart ? <p>Game is full</p> : <div><button onClick={() => this.goToGame({
                                userWhoPressed: this.props.currentUser.name,
                                gameDetails: {
                                    gameName: line.gameName,
                                    creator: line.creator,
                                    numOfPlayers: line.numOfPlayers,
                                    numOfPlayersInGame: line.numOfPlayersInGame,
                                    didGameStart: line.didGameStart,
                                    playersInGame: line.playersInGame,
                                    numOfSecondsInGame: line.numOfSecondsInGame,//0,
                                    clock: line.clock,//null,
                                    time: line.time,//"00:00",
                                    deckOfCards: line.deckOfCards,//[],
                                    pileArray: line.pileArray,//[],
                                    playerOfThisTurn: line.playerOfThisTurn,//{name: ''},
                                    pileTopCard: line.pileTopCard,//{src: ""},
                                    plus2Counter: line.plus2Counter,//0,
                                    isTurnOver: line.isTurnOver,//false,
                                    isChangeColorOn: line.isChangeColorOn,//false,
                                    isTakiCardOn: line.isTakiCardOn,//false,
                                    blockChangeColorCard: line.blockChangeColorCard,//false,
                                    blockTakeCardsFromDeck: line.blockTakeCardsFromDeck,//false,
                                    blockPutCardInPile: line.blockPutCardInPile,//false,
                                    winner: line.winner,//'',
                                    isGameOver: line.isGameOver,//false,
                                    playerHasLegalCardToPutInPile: line.playerHasLegalCardToPutInPile,//false,
                                    skipATurn: line.skipATurn,//false,
                                    winningPositions: line.winningPositions,//1,
                                    winnersArray: line.winnersArray,//[],
                                    globalInstruction: line.globalInstruction,//'',
                                    numOfPlayersInLobby: line.numOfPlayersInLobby,//0,

                                }
                            })}>Join Game</button> 
                            {line.creator.name === this.props.currentUser.name ? <button className='deleteGameButton' onClick={() => this.deleteGame(line.gameName)}>Delete Game</button> : null}
                            {this.state.gameToDeleteName === line.gameName ? <p className='deleteGameErrorMessage'>{this.state.deleteGameErrorMessage}</p> : null}
                             </div>}</td>
                        </tr>                    
                    ))
                    }
                    </tbody>
                    </table>
                </div>
        )  
    } 

    goToGame(details) {
        this.props.updateCurrentGame(details.gameDetails);
        this.props.joinGame();
        fetch('/lobby/updategame', {method:'POST', body: JSON.stringify(details), credentials: 'include'});
    }

    deleteGame(gameName) {
        console.log('in delete game');
        fetch('/lobby/deletegame', {method:'POST', body: gameName, credentials: 'include'})
        .then(res => {
            if(res.status === 403) {
                this.setState({deleteGameErrorMessage: "Can't delete game with players inside!", gameToDeleteName: gameName});
            }
        })
    }

    
}


