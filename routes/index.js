	var express = require('express');
	var router = express.Router();
	var request = require('request');
	data = "";
	/* GET home page. */
	var options = { 
		url: 'https://api.github.com/repos/shippable/support/issues?page=1&per_page=200',
		headers: {
			'User-Agent': 'funapp'
		}
	};
	console.log("0");

	router.get('/', function(req, res, next) {
		request(options, function (error, response, body) {
			console.log("1");

			if (!error && response.statusCode == 200) {
				console.log("2");

				data = (JSON.parse(body));

			} else {
	  	console.log(error); // Print the google web page.	
	  }

	  load(res);

	})

		console.log("3");
	});

	module.exports = router;


	function load(res) {

		res.render('index', { title: data });
		console.log("4");

	}