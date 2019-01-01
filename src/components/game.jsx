import React from "react";
import Board from "./Board.jsx";
import Statistics from "./Statistics.jsx";


export default class Game extends React.Component {
    constructor(props) {
        super (props);
        this.state = {
           isGameOver: false
        }  

        this.setGameOver = this.setGameOver.bind(this);
    }

    render() {
        let content = null;

        if (!this.props.isGameOver) {
            content = (
                <div>
                <Board
                    currentUser={this.props.currentUser}
                    currentGame={this.props.currentGame}
                    exitGame={this.props.exitGame}
                    reloadGame={this.props.reloadGame}
                    setDragEvents={this.props.setDragEvents}
                    dropEvent={this.props.dropEvent}
                    takeCardFromDeck={this.props.takeCardFromDeck}
                    changeColorHandler={this.props.changeColorHandler}
                    closeTaki={this.props.closeTaki}
                    setGameOver={this.setGameOver}
                />
                <Statistics                             
                    currentGame={this.props.currentGame}
                    currentUser={this.props.currentUser}
                    reloadGame={this.props.reloadGame}
                    exitGame={this.props.exitGame}
                />
            </div>
            );
        } else {
            this.props.stopTimeOut();
            content = (
                <div>
                    <Statistics                             
                        currentGame={this.props.currentGame}
                        currentUser={this.props.currentUser}
                        reloadGame={this.props.reloadGame}
                        exitGame={this.props.exitGame}
                    />
                </div>
            );
        }


        return (
            <div> 
                {content}
            </div>
        );
        
    }

    setGameOver() {
        this.setState(() => ({isGameOver: true}))
    }
}