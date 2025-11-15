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
const { upload } = require('./app/middlewares/cloudinary.js');

app.post('/user/register', userCtlr.register);
app.post('/user/login', userCtlr.login);

app.get('/user/allusers', authenticateUser, authorization(['admin', 'owner']), userCtlr.allusers);
app.get('/user/account/:id', authenticateUser, userCtlr.account);
app.delete('/user/remove/:id',authenticateUser, authorization(['admin', 'owner']), userCtlr.deleteAccount);

app.post(
    '/pg/createpg', 
    authenticateUser, 
    authorization(['owner']), 
    upload.fields([
        { name: 'pgPhotos', maxCount : 5 }, 
        { name: 'pgCertificate', maxCount : 1 }
    ]), 
    pgCltr.createPg);
app.get('/get/allpgs', authenticateUser, authorization(['admin', 'owner']), pgCltr.getAllPgs);
app.get('/get/pgById/:id', authenticateUser, authorization(['admin', 'owner']), pgCltr.getPgById);
app.put('/update/pg/:id', authenticateUser, authorization(['admin', 'owner']), pgCltr.updatePg);
app.delete('/delete/pg/:id', authenticateUser, authorization(['admin', 'owner']), pgCltr.deletePg);


app.listen(port, () => {
    console.log('Serve running on the port', port);
})