import React from 'react';
import ReactDOM from 'react-dom';


export default class UsersList extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div className='userList'>
                 <h4>Users List:</h4>
                 {this.props.usersList.map((line, index) => (<p className='usersList' key={line + index}>{line}</p>))}
            </div>
        );
    }
    
}

