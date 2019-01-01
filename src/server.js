const path = require('path');
const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const userManagement = require('./server/userManagement');
const auth = require('./server/auth');
const lobby = require('./server/lobby');
const gamePlay = require('./server/gamePlay');
const app = express();

app.use(session({ secret: 'keyboard cat', cookie: {maxAge:269999999999}}));
app.use(bodyParser.text());

app.use(express.static(path.resolve(__dirname, "..", "public")));


app.use('/users', userManagement);
app.use('/lobby', lobby);
app.use('/gameplay', gamePlay);

app.listen(3000, console.log('Taki app listening on port 3000!'));