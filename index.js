const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 5040;

app.use(express.json());
app.use(cors());

const configureDB = require('./config/db');
configureDB();

const userCtlr = require('./app/controllers/user-controller.js');
const pgCltr = require('./app/controllers/pg-controller.js');

const authenticateUser = require('./app/middlewares/authenticateUser.js');
const authorization = require('./app/middlewares/authorizeUser.js');

app.post('/user/register', userCtlr.register);
app.post('/user/login', userCtlr.login);

app.get('/user/allusers', authenticateUser, authorization(['admin', 'owner']), userCtlr.allusers);
app.get('/user/account/:id', authenticateUser, userCtlr.account);
app.delete('/user/remove/:id',authenticateUser, authorization(['admin', 'owner']), userCtlr.deleteAccount);

app.post('/pg/createpg', authenticateUser, authorization(['owner']), pgCltr.createPg);


app.listen(port, () => {
    console.log('Serve running on the port', port);
})