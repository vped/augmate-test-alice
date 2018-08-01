
const request = require('request');
const parser = require('xml2json');
const SSE = require('sse-nodejs');
const AliceModal = require('./aliceModal')

//Communication
const zmq = require('zeromq');
let requester = zmq.socket('req');
requester.bindSync('tcp://127.0.0.1:7000');


//Get crypto price 
let getCryptoPrice = function (req,res) {
      let params = req.param('symbol');
      if(params){
      	try {
      		let url = 'https://chasing-coins.com/api/v1/convert/' + params + '/USD'
      		 request.get(url,{json:true}, (error, response, body)=>{
      		 	if(response && response.statusCode === 200  && body.result ){
                    res.status(200).json(body);
	      		} else {
	        		console.log('error: '+ response.statusCode)
	                res.status(400).send(error);
	      		}
	      	})
      	}catch(e){
  			throw e;
      	}
      }else {
      	res.status(200).send({});
      }
}

//Get Crypto description and Parse xml response  to json 
let getDescription = function (req,res) {
	let params = req.param('symbol');
      if(params){
      	try {
      		let url = 'https://dev.augmate.io/test/cryptos.xml';
      		 request.get(url,{json:true}, (error, response, body)=>{
      		 	if(response.statusCode === 200 ){
      		 		let parsedBody = parseDescription(body,params);
      		 		if(parsedBody){
                      res.status(200).json(parsedBody);
      		 		}else {
      		 	        res.status(400).json("No Description Found");
      		 		}
	      		} else {
	        		console.log('error: ' + response.statusCode);
	                res.status(response.statusCode).send(error);
	      		}
	      	})
      	}catch(e){
  			throw e;
      	}
      }else {
      	res.status(200).send({});
      }
}

//Notifier using SSE 
let getSaveNotification = function (req,res) {
   	let app = SSE(res);

   	//Zeromq listener to message respone 
   	requester.on('message', (msg)=> {
      console.log('Reply request:', msg.toString());
        app.send(JSON.parse(msg.toString()));
   });
}

//Read saved Description and Save to Json
let getSavedDescription = function (req,res) {
	let uid = req.param('uid');
    
    //Find description using uid and exclude the _id;
	AliceModal.find({uid:uid},{_id:0},(err,response)=>{
			console.log(response,"Read ");
			if(err){
				res.status(400).send(err);
			}else {
				res.status(200).json(response[0]);
			}
	})
}


//init the zeromq socket and end the request
let saveDescription = function(req,res) {
	let body = req.body;
    requester.send(JSON.stringify(body));
    res.end();
}

//xml parsed here and the Crypto symbol is mapped . 
let parseDescription = function (body,symbol) {
	try{
		body = parser.toJson(body);
	    body = JSON.parse(body);
	    let index = body.Cryptos && body.Cryptos.Symbol.length ? body.Cryptos.Symbol.indexOf(symbol.toUpperCase()):'-1';
	    if(index >= 0 ) {
	    	return body.Cryptos.Description[index];
	    }else {
	    	return false;
	    } 
	}catch(e) {
		  throw e;
	}
} 

module.exports = {
	getCryptoPrice : getCryptoPrice,
	getDescription : getDescription,
	saveDescription : saveDescription,
	getSaveNotification : getSaveNotification,
	getSavedDescription : getSavedDescription
}