import React from 'react';
import ReactDOM from 'react-dom';
import LoginModal from './login-modal.jsx';
import LobbyContainer from './LobbyContainer.jsx';
import Game from './game.jsx';

export default class BaseContainer extends React.Component {
    constructor(args) {
        super(...args);
        this.state = {
            showLogin: true,
            showBoard: false,
            currentUser: {
                name: ''
            },
            currentGame: null,
            usersList: [],
            gamesList: []
        };

        this.gameOverTimeOut;
    

    }

    componentDidMount() {
        this.handleSuccessedLogin = this.handleSuccessedLogin.bind(this);
        this.handleLoginError = this.handleLoginError.bind(this);
        this.fetchUserInfo = this.fetchUserInfo.bind(this);
        this.logoutHandler= this.logoutHandler.bind(this);
        this.joinGame = this.joinGame.bind(this);
        this.updateCurrentGame = this.updateCurrentGame.bind(this);
        this.exitGame = this.exitGame.bind(this);
        this.setDragEvents = this.setDragEvents.bind(this);
        this.putCardOnPile = this.putCardOnPile.bind(this);
        this.dropEvent = this.dropEvent.bind(this);
        this.takeCardFromDeck = this.takeCardFromDeck.bind(this);
        this.changeColorHandler = this.changeColorHandler.bind(this);
        this.closeTaki = this.closeTaki.bind(this);
        this.stopTimeOut = this.stopTimeOut.bind(this);
        this.reloadGame = this.reloadGame.bind(this);
        this.reloadGame();
        this.getUserName();
    }

    componentWillUnmount() {
        if (this.timeoutId) {
            clearTimeout(this.timeoutId);
        }
    }
    
    render() {  
        if (this.state.showBoard) {
            return (<Game 
                currentUser={this.state.currentUser}
                currentGame={this.state.currentGame}
                exitGame={this.exitGame}
                setDragEvents={this.setDragEvents}
                dropEvent={this.dropEvent}
                takeCardFromDeck={this.takeCardFromDeck}
                changeColorHandler={this.changeColorHandler}
                closeTaki={this.closeTaki}
                isGameOver={this.state.currentGame.isGameOver} 
                stopTimeOut={this.stopTimeOut}
                />
            )
        } else if (this.state.showLogin) {
            return (<LoginModal loginSuccessHandler={this.handleSuccessedLogin} loginErrorHandler={this.handleLoginError}/>)
        } else {
            return this.renderLobby();
        }
    }

    stopTimeOut() {
        clearTimeout(this.gameOverTimeOut);
    }

    handleSuccessedLogin() {
        this.setState(()=>({showLogin:false}), this.getUserName);        
    }

    handleLoginError() {
        console.error('login failed');
        this.setState(()=>({showLogin:true}));
    }

    renderLobby() {
        return(
            <div>
                <div>
                    Hello {this.state.currentUser.name}
                    <button className="logout btn" onClick={() => this.logoutHandler()}>Logout</button>
                </div>
                <LobbyContainer 
                    currentUser={this.state.currentUser} 
                    updateCurrentGame={this.updateCurrentGame} 
                    joinGame={this.joinGame}
                    usersList={this.state.usersList}
                    gamesList={this.state.gamesList}  />               
            </div>
        )
    }

    joinGame() {
        this.setState(()=>({showBoard:true}));
    }

    exitGame() {
        this.setState(()=>({showBoard:false}));
    }

    updateCurrentGame(game) {
        this.setState({currentGame: game})
    }

    reloadGame() {
        return fetch('/lobby/reloadgame',{method: 'GET', credentials: 'include'})
        .then(res => {            
            if (!res.ok){
                throw res;
            }
            this.timeoutId = setTimeout(this.reloadGame, 400);
            return res.json();
        }).then(data => { 
            if (data.gameDetails !== undefined && data.gameDetails !== null) {
                this.setState({currentGame: data.gameDetails,
                    currentUser: {name: data.currentUser},
                    showBoard: true,
                    usersList: data.usersList,
                    gamesList: data.gamesList
                    });
            } else if (data.gamesList.length > 0) {
                this.setState({
                    gamesList: data.gamesList,
                    usersList: data.usersList
                });
            } else if (data.gamesList.length == 0) {
                this.setState({gamesList: []});
            } else if (data.usersList.length > 0) {
                this.setState({
                    usersList: data.usersList
                });
            }
            
        });
    }

    getUserName() {
        this.fetchUserInfo()
        .then(userInfo => {
            this.setState(()=>({currentUser:userInfo, showLogin: false}));
        })
        .catch(err=>{            
            if (err.status === 401) { // incase we're getting 'unautorithed' as response
                this.setState(()=>({showLogin: true}));
            } else {
                throw err; // in case we're getting an error
            }
        });
    }

    fetchUserInfo() {        
        return fetch('/users',{method: 'GET', credentials: 'include'})
        .then(response => {            
            if (!response.ok){
                throw response;
            }
            return response.json();
        });
    }

    logoutHandler() {
        fetch('/users/logout', {method: 'GET', credentials: 'include'})
        .then(response => {
            if (!response.ok) {
                console.log(`failed to logout user ${this.state.currentUser.name} `, response);                
            }

            this.setState(()=>({currentUser: {name:''}, showLogin: true}));
        })
    }

    setDragEvents() {
        document.addEventListener("dragstart", function(e){
            e.dataTransfer.setData('Text', e.target.id);
        }, false);
    }   

    putCardOnPile(cardId) {
        fetch('/gameplay/putcardonpile', {method:'POST', body: JSON.stringify({
            cardId: cardId, 
            gameName: this.state.currentGame.gameName
        }), credentials: 'include'})
        .then(res => {
            if (res.ok) {
                return res.json();
            }
        }).then(data => {
            if (data.gameDetails !== undefined && data.gameDetails !== null) {
                this.setState(() => ({currentGame: data.gameDetails}));
            }       
        })
    }

    takeCardFromDeck() {
        fetch('/gameplay/takecard',{method: 'POST',  body: JSON.stringify({
            gameName: this.state.currentGame.gameName}),
             credentials: 'include'})
        .then(res => {            
            if (res.ok) {
                return res.json();
            }
        }).then(data => {
            this.setState({currentGame: data.gameDetails});
        });
    }

    dropEvent(e) {
        let cardId = e.dataTransfer.getData('text');
        this.putCardOnPile(cardId);
    }

    changeColorHandler(color) {
        fetch('/gameplay/changecolor',{method: 'POST',  body: JSON.stringify({
            gameName: this.state.currentGame.gameName,
            color: color
        }), credentials: 'include'});
    }

    closeTaki() {
        fetch('/gameplay/closetaki',{method: 'POST',  body: JSON.stringify({
            gameName: this.state.currentGame.gameName}),
             credentials: 'include'});
    }

   

}