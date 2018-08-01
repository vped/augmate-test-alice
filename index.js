'use strict';

const express = require('express');
let  app = express();
const mongoose = require('mongoose');
let router = express.Router();
const http = require('http');
const cluster = require('cluster');
const path = require('path');
const bodyParser = require('body-parser');

console.log('Alice Producer bound to port 3000');

//Routes
const appRoutes = require('./routes/routes');


//Connects to local mongodb Alice collection
mongoose.connect('mongodb://localhost/coin', (err,database)=> {
    if(err) {
      console.error('MongoDB Connection Error:',err);
      process.exit(1);
    }else {
       console.log('Database connection Ready')
    }
});


let port = '3000';
app.set('port',port);
let server = http.createServer(app);
server.listen(port);
server.on('error',onError);
server.on('listening',onListening);

//localhost:3000, loads this html file to browser
app.get('/', (req, res)=> {
    res.sendFile(path.join(__dirname + '/index.html'));
});
app.use(bodyParser.json());


app.use('/appRoutes',router);
app.use('/',appRoutes);


//http error handler.
function onError(error) {
	switch(error.code) {
			case 'EADDRINUSE':
			console.error('port:', port, 'is already in  use');
			process.exit(1);
			break;
			default:
				throw error;
			}
		}

//server connection message
function onListening() {
	console.log('Alice listening on :',port);
}

module.exports = app;
