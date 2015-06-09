var express = require('express');
var router = express.Router();
var https = require('https');
var http = require('http');
var request= require('sync-request');

var accessToken='';
var code = "";
var res1;
var username = '';

/* GET users listing. */
router.get('/', function(req, res, next) {
	res1 = res;
	if(typeof req.query.code != 'undefined'){
		var post_data = {
		  client_id: '966ce4cafe87b84a29c5',
		  client_secret: '4ff2bb2883f32c9702dd12a6c2464009f07c1550',
		  code: req.query.code,
		  accept: 'json'
		};
		code = req.query.code;
		
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
			var options = { 
				headers: {
				'User-Agent': 'gitissues'
				}
			};
			var data_json=request('GET','https://api.github.com/user?access_token=' +  accessToken,options);
			data=JSON.parse(data_json.getBody());
			username=data.login;	
			code = '';
			res1.json({ user: username ,accessToken : accessToken});
		  });
		});

		req_.on('error', function(e) {
		  console.log('error');
		});

		req_.write(post_dataString);
		req_.end();
	}	
	if (code == '') {
		if (username != '') {
			res.json({ user: username,accessToken : accessToken});
		} else {
			res.json({ user: 'User',accessToken : accessToken});
		}
	}
});

module.exports = router;
