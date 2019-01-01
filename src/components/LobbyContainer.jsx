import React from 'react';
import ReactDOM from 'react-dom';
import UsersList from './usersList.jsx';
import CreateGame from './createGame.jsx';
import GameTable from './gameTable.jsx';

export default class LobbyContainer extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return(
            <div>
                <CreateGame currentUser={this.props.currentUser}/>
                <div className="lobbyTables">
                    <div className='userListContainer'>
                        <UsersList usersList={this.props.usersList}/>
                    </div>
                    <div className='gameTableContainer'>
                        <GameTable
                            testClick={this.myTestCallback}
                            currentUser={this.props.currentUser}
                            joinGame={this.props.joinGame}
                            updateCurrentGame={this.props.updateCurrentGame}
                            gamesList={this.props.gamesList}
                        />
                    </div>
                </div>  
            </div>
        )
    }     
    
}   
