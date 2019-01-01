const express = require('express');
const router = express.Router();
const auth = require('./auth');
const chatManagement = require('./lobby');

const userManagement = express.Router();

userManagement.get('/', auth.userAuthentication, (req, res) => {
	const userName = auth.getUserInfo(req.session.id).name;
	res.json({name:userName});
});


userManagement.post('/addUser', auth.addUserToAuthList, (req, res) => {		
	res.sendStatus(200);	
});

userManagement.get('/logout', [
	(req, res, next) => {	
		const userinfo = auth.getUserInfo(req.session.id);	
		auth.deleteNameFromList(userinfo.name);
		next();
	}, 
	auth.removeUserFromAuthList, 
	(req, res) => {
		res.sendStatus(200);		
	}]
);

module.exports = userManagement;