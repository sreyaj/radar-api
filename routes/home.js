var express = require('express');
var router = express.Router();
var https = require('https');
var http = require('http');
var accessToken='';
/* GET users listing. */
router.get('/', function(req, res, next) {
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
	  res.on('data', function(data) {
	    responseString += data;
	  });

	  res.on('end', function() {
	    var resultObject = JSON.parse(responseString);
	    accessToken=resultObject.access_token;
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
	 if (accessToken == "") {
	 	res.send("Please sign up to use.");
	 } else {


	 var username = req.body.username;
	 var repo = req.body.repo;
	 var token = accessToken;
	 var days = req.body.days;
	 var daysEnd = req.body.daysEnd;
	 var state = req.body.state;
     res.redirect('/issues?username=' + username + "&repo=" + repo + "&token=" + token + "&days=" + days + "&daysEnd=" + daysEnd + "&state=" + state);
	}

})

module.exports = router;
