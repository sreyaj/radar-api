var express = require('express');
	var router = express.Router();
	var request = require('sync-request');
	data = "";
	issue_array=[];
	var page=1;
	var no_issues_mod100=0;
	/* GET home page. */
	
//// OPEN VAR
//// CLOSE VAR


	console.log("0");

	router.get('/', function(req, res, next) {
		res.redirect('/');
	});

	router.post('/', function(req, res, next) {
		issue_array = [];
		data = "";
		if (req.body.state == "Open") {
			mainLoading("open", req, res, next);	
		} else {
			mainLoading("closed", req, res, next);
		}
	});

	function mainLoading(state, req, res, next) {
		page = 1;
		repo = req.body.name + "/" + req.body.repo;
		console.log(repo);

		while(data.length%100==0 && no_issues_mod100==0){
			var options = { 
				headers: {
				'User-Agent': 'funapp'
				}
			};
			var data_json=request('GET','https://api.github.com/repos/' + repo + '/issues?state=' + state + '&client_id=58161dcf40849abffecd&client_secret=10ee9d2f6a2402cdca283d8b2ba01529bb216475&page='+page+'&per_page=100',options);

			data=JSON.parse(data_json.getBody());
			for(i=0;i<data.length;i++){
	  			issue_array.push(data[i].title);
	  		}
	  		if(data.length==0){
				console.log("3");
				no_issues_mod100=1;
			}
	  		page++;
	  	}
	  	
		console.log(issue_array.length);
		
	  	load(res, state);
	}


	module.exports = router;


	function load(res, state) {
		if (state == "open") {
			res.render('index', { title: issue_array, state: "Open issues" });
		} else {
			res.render('close', { title: issue_array, state: "Closed issues" });
		}
	}


	