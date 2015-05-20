var express = require('express');
var router = express.Router();
var request = require('request');
//0.9.2
var async = require('async');
data = "";
var titlesStore = [];
var done = false;
var resStore;
var iStore = 1;
/* GET home page. */
var options = { 
	url: 'https://api.github.com/repos/shippable/support/issues?page=1&per_page=100',
	headers: {
		'User-Agent': 'funapp'
	}
};

router.get('/', function(req, res, next) {
	titlesStore = [];
	iStore = 1;
	console.log(1);
	done = false;
	resStore = res;
	options.url = "https://api.github.com/repos/shippable/support/issues?page=1&per_page=100";
		/////////////////////////////////////////////////////////////////////////////////
	parseGit();
});

module.exports = router;

function parseGit() {
	console.log(2);
	/////////////////////////////////////////////////////////////////////////////////
	request(options, storeTitle);
}

function turnPage() {
	console.log(3);

	if (titlesStore.length % 100 == 0 && titlesStore.length != 0 && done == false) {
		iStore = iStore + 1;
		addPage();
	} else {
		load();
	}
}

function addPage(){
	var tempOptions = options;
	tempOptions.url = 'https://api.github.com/repos/shippable/support/issues?page=' 
	+ iStore + '&per_page=100';
	loadRequest(tempOptions);
}



function load() {
	console.log(4);
	resStore.render('index', { issues: titlesStore });
}


function loadRequest(opt) {
	console.log(5);
	/////////////////////////////////////////////////////////////////////////////////
	request(opt, storeTitle);
}

function storeTitle (error, response, body) {
	
	console.log(6); 
	/////////////////////////////////////////////////////////////////////////////////
	if (!error && response.statusCode == 200) {
		data = (JSON.parse(body));
		for (i = 0; i < data.length; i++) {
			titlesStore.push(data[i].number);
		}
	} 
	console.log(7);
	if (data.length == 0) {
		done = true;
	}

	turnPage();
}