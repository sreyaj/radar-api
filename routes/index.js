var express = require('express');
var router = express.Router();
var request = require('sync-request');


indexData={};
obsWindow=[1,2,4,7];




router.get('/', function(req, res, next) {

	try {
		if (req.query.token != undefined) {
			
			if (req.query.state == "Open") {
					//data = "";
				mainLoadingGET("open", req, res, next);

			} else {
					//data = "";
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
	data='';
	issue_array=[];
	no_issues_mod100=0;

	repo = req.query.username + "/" + req.query.repo;
	days = req.query.days;
	daysEnd = req.query.daysEnd;
	token = req.query.token;

	page=1;

	while(data.length%100==0 && no_issues_mod100==0){
		var options = { 
			headers: {
			'User-Agent': 'funapp'
			}
		};

		var data_json=request('GET','https://api.github.com/repos/' + repo + '/issues?state=' + state + '&access_token=' +  token + '&client_id=58161dcf40849abffecd&client_secret=10ee9d2f6a2402cdca283d8b2ba01529bb216475&page='+page+'&per_page=100',options);
		data=JSON.parse(data_json.getBody());
		issue_array=issue_array.concat(data);
		if(data.length==0){
			no_issues_mod100=1;
		}
  		page++;
  	}

  	indexData.totalNumber=issue_array.length;
  	indexData.days=days;
  	indexData.daysEnd=daysEnd;
  	indexData.numberOfIssues=0;
  	indexData.obsWindow=obsWindow;
	if (state == "open") {
		open(issue_array);
	} else {
		close(issue_array);
	}
  	
	console.log("I AM LOADING THE GET PAGE");
  	load(res, state);
}


function open (issue_array) {
	var noIssues=Array.apply(null, new Array(obsWindow.length+1)).map(Number.prototype.valueOf,0);
	var within=0;
	for(i=0;i<issue_array.length;i++){		
		var daysPast = daysFromCurrent(issue_array[i].created_at);
		if (indexData.days < daysPast && daysPast < indexData.daysEnd) {
			indexData.numberOfIssues++;
		}
		for(j=0;j<noIssues.length-1;j++){
			if(daysPast<obsWindow[j]){
				noIssues[j]++;
				within=1;
				break;
			}
		}
		if(within==0)
			noIssues[obsWindow.length]++;		
	}
	indexData.noIssues=noIssues;
}


function close (issue_array) {
	var noIssues=Array.apply(null, new Array(obsWindow.length+1)).map(Number.prototype.valueOf,0);
	var within=0;
	for(i=0;i<issue_array.length;i++){		
		var daysPast = dateDiff(issue_array[i].created_at,issue_array[i].closed_at);
		if (indexData.days < daysPast && daysPast < indexData.daysEnd) {
			indexData.numberOfIssues++;
		}
		for(j=0;j<noIssues.length-1;j++){
			if(daysPast<obsWindow[j]){
				noIssues[j]++;
				within=1;
				break;
			}
		}
		if(within==0)
			noIssues[obsWindow.length]++;		
	}
	indexData.noIssues=noIssues;
}	



module.exports = router;


function load(res, state) {
	if (state == "open") {
		//res.render('index', { daysEnd: daysEnd, number: numberOfIssues, day: days, state: "Open issues", total: totalNumber});
		res.render('open',{indexData:indexData,state: "Open Issues"});
	} else {
		//res.render('close', { daysEnd: daysEnd, number: numberOfIssues, day: days, state: "Closed issues", total: totalNumber });
		res.render('closed',{indexData:indexData,state: "Closed Issues"});
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
