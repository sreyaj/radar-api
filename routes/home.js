var express = require('express');
var router = express.Router();
var https = require('https');
var http = require('http');
var request= require('sync-request');

var accessToken='';
var code = "";
var res1;

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.json({accessToken : global.accessToken});
});

module.exports = router;