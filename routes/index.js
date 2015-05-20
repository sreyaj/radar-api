var express = require('express');
var router = express.Router();
var request = require('sync-request');
data = "";
issue_array=[];
var page=1;
var no_issues_mod100=0;
var days = 0;
var numberOfIssues = 0;
/* GET home page. */

//// OPEN VAR
/*
0, 0 - question, resolved
0, 1 - question, triaged
0, 2 - question, progress
0, 3 - question, other
1, 0 - bug, resolved
1, 1 - bug, triaged
1, 2 - bug, progress
1, 3 - bug, other
2, 0 - feature, resolved
2, 1 - feature, triaged
2, 2 - feature, progress
2, 3 - feature, other
3, 0 - other, resolved
3, 1 - other, triaged
3, 2 - other, progress
3, 3 - other, other
*/

var question = 0;
var bug = 1;
var feature = 2;
var other = 3;
var resolved = 0;
var triaged = 1;
var progress = 2;
var other = 3;

//// CLOSE VAR


console.log("0");

router.get('/', function(req, res, next) {
	res.redirect('/');
});

router.post('/', function(req, res, next) {
	issue_array = [];
	data = "";
	numberOfIssues = 0;
	
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
	days = req.body.days;

	while(data.length%100==0 && no_issues_mod100==0){
		var options = { 
			headers: {
			'User-Agent': 'funapp'
			}
		};
		var data_json=request('GET','https://api.github.com/repos/' + repo + '/issues?state=' + state + '&client_id=58161dcf40849abffecd&client_secret=10ee9d2f6a2402cdca283d8b2ba01529bb216475&page='+page+'&per_page=100',options);

		data=JSON.parse(data_json.getBody());
		//
		if (state == "open") {
			open();
		} else {
			close();
		}
		//
  		page++;
  	}
  	
	console.log(issue_array.length);
	
  	load(res, state);
}

function open () {
	for(i=0;i<data.length;i++){
		var a = data[i].created_at;
		var daysPast = daysFromCurrent(a);
		if (daysPast < days) {
			numberOfIssues++;
		}
	}
  	
  	if(data.length==0){
		no_issues_mod100=1;
	}
}


function close () {
	for(i=0;i<data.length;i++) {
		var a = data[i].created_at;
		var b = data[i].closed_at;
		var daysPast = dateDiff(a, b);
		if (daysPast < days) {
			numberOfIssues++;
		}
	}

  	if(data.length==0){
		no_issues_mod100=1;
	}
}



module.exports = router;


function load(res, state) {
	if (state == "open") {
		res.render('index', { number: numberOfIssues, day: days, state: "Open issues" });
	} else {
		res.render('close', { number: numberOfIssues, day: days, state: "Closed issues" });
	}
}

function daysFromCurrent(dateString){
    var curr= new Date();
    var inpDate= new Date(dateString);
    return (curr.getTime()-inpDate.getTime())/(1000*3600*24);
}

function dateDiff(dateString_open,dateString_close){
    var open=new Date(dateString_open);
    var close=new Date(dateString_close);
    return (close.getTime()-open.getTime())/(1000*3600*24);
}

