var express = require('express');
var router = express.Router();
var https = require('https');
var http = require('http');
var accessToken='';
/* GET users listing. */
router.get('/', function(req, res, next) {
	console.log(req.query.code);
if(typeof req.query.code != 'undefined'){
	var post_data = {
	  client_id: '58161dcf40849abffecd',
	  client_secret: '10ee9d2f6a2402cdca283d8b2ba01529bb216475',
	  code: req.query.code,
	  accept: 'json'
	};

	var post_dataString = JSON.stringify(post_data);

	var headers = {
	  'Content-Type': 'application/json',
	  'Content-Length': post_dataString.length,
	  'Accept': 'application/json'
	};

	var options = {
	  host: 'github.com',
	  port: 443,
	  path: '/login/oauth/access_token',
	  method: 'POST',
	  headers: headers
	};

	// Setup the request.  The options parameter is
	// the object we defined above.
	var req_ = https.request(options, function(res) {
	  res.setEncoding('utf-8');
	  var responseString = '';
	  console.log("1");
	  res.on('data', function(data) {
	    responseString += data;
	    console.log("2");
	  });

	  res.on('end', function() {
	    var resultObject = JSON.parse(responseString);
	    console.log("3");
	    console.log(resultObject.access_token);
	    accessToken=resultObject.access_token;
	   console.log(responseString);
	  });
	});

	req_.on('error', function(e) {
	  // TODO: handle error.
	});

	req_.write(post_dataString);
	req_.end();
}	
/*
if(typeof req.query.code != 'undefined'){
	var options={};
var token=request('POST','https://github.com/login/oauth/access_token?client_id=58161dcf40849abffecd&client_secret=10ee9d2f6a2402cdca283d8b2ba01529bb216475&code='+ req.query.code, options);
	console.log(res);
}*/
  res.render('home', { user: 'User!',accessToken : accessToken});
});

router.post('/', function(req, res, next){
	//console.log(req.query.code);
	console.log("dbksfbksfb");
	var post_data = {
	  username: req.body.username,
	  repo: req.body.repo,
	  token: accessToken,
	  days: req.body.days,
	  daysEnd: req.body.daysEnd,
	  accept: 'json'
	};
	console.log(post_data);
	var post_dataString = JSON.stringify(post_data);

	var headers = {
	  'Content-Type': 'application/json',
	  'Content-Length': post_dataString.length,
	  'Accept': 'application/json'
	};

	var options = {
	  host: 'localhost',
	  port: 3000,
	  path: '/issues',
	  method: 'POST',
	  headers: headers
	};

	// Setup the request.  The options parameter is
	// the object we defined above.
	var req_ = http.request(options, function(res) {
	  res.setEncoding('utf-8');
	  var responseString = '';
	  console.log("inside post request");
	  res.on('data', function(data) {
	    responseString += data;
	    console.log("data got");
	  });

	  res.on('end', function() {
	    //var resultObject = JSON.parse(responseString);
	    console.log("Now response will be printed");
	   // console.log(resultObject.access_token);
	   // accessToken=resultObject.access_token;
	   console.log(responseString);
	  });
	});

	req_.on('error', function(e) {
	  // TODO: handle error.
	});

	req_.write(post_dataString);
	req_.end();
	res.render('home', { user: 'User!'});
})

module.exports = router;
