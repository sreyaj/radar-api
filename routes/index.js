var express = require('express');
var router = express.Router();
var request = require('sync-request');
data = "";
issue_array=[];
var page=1;
var no_issues_mod100=0;
var days = 0;
var numberOfIssues = 0;
var totalNumber = 0;
var daysEnd = 0;


router.get('/', function(req, res, next) {
	issue_array = [];
	data = "";
	numberOfIssues = 0;
	totalNumber = 0;	
	no_issues_mod100=0;

	try {
		if (req.query.token != undefined) {
			
			if (req.query.state == "Open") {
					data = "";
				mainLoadingGET("open", req, res, next);

			} else {
					data = "";
				mainLoadingGET("closed", req, res, next);
			}
		} else {
			res.redirect('/');	
		}
	} catch (e) {
		res.redirect('/');	
	}
	
});


function mainLoadingGET(state, req, res, next) {
	
	page = 1;
	repo = req.query.username + "/" + req.query.repo;
	days = req.query.days;
	daysEnd = req.query.daysEnd;
	token = req.query.token;
	while(data.length%100==0 && no_issues_mod100==0){
		var options = { 
			headers: {
			'User-Agent': 'funapp'
			}
		};
		willPrint = 'https://api.github.com/repos/' + repo + '/issues?state=' + state + '&acess_token=' +  token + '&client_id=58161dcf40849abffecd&client_secret=10ee9d2f6a2402cdca283d8b2ba01529bb216475&page='+page+'&per_page=100';

		var data_json=request('GET','https://api.github.com/repos/' + repo + '/issues?state=' + state + '&access_token=' +  token + '&client_id=58161dcf40849abffecd&client_secret=10ee9d2f6a2402cdca283d8b2ba01529bb216475&page='+page+'&per_page=100',options);

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
  	load(res, state);
}


function open () {
	totalNumber = totalNumber + data.length;
	for(i=0;i<data.length;i++){
		var a = data[i].created_at;
		var daysPast = daysFromCurrent(a);
		if (days < daysPast && daysPast < daysEnd) {
			numberOfIssues++;
		}
	}
  	
  	if(data.length==0){
		no_issues_mod100=1;
	}
}


function close () {
	totalNumber = totalNumber + data.length;
	for(i=0;i<data.length;i++) {
		var a = data[i].created_at;
		var b = data[i].closed_at;
		var daysPast = dateDiff(a, b);
		if (days < daysPast && daysPast < daysEnd) {
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
		res.render('index', { daysEnd: daysEnd, number: numberOfIssues, day: days, state: "Open issues", total: totalNumber});
	} else {
		res.render('close', { daysEnd: daysEnd, number: numberOfIssues, day: days, state: "Closed issues", total: totalNumber });
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
