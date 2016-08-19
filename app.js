/*eslint-env node*/

//------------------------------------------------------------------------------
// node.js starter application for Bluemix
//------------------------------------------------------------------------------

// This application uses express as its web server
// for more info, see: http://expressjs.com
var express = require('express');
var fs=require("fs");
var readline = require('readline');
var stream = require('stream');

// cfenv provides access to your Cloud Foundry environment
// for more info, see: https://www.npmjs.com/package/cfenv
var cfenv = require('cfenv');
// get the app environment from Cloud Foundry
var appEnv = cfenv.getAppEnv();

var net = require('net');

// create a new express server
var app = express();

// configure log file and level
var log4js = require('log4js');
log4js.configure({
  appenders: [
    { type: 'console' }, //控制台输出
    {
      type: 'file', //文件输出
      filename: 'logs/blockchainMontior.log',
      maxLogSize: 1024,
      backups:3,
      category: 'normal'
    }
  ]
});
var logger = log4js.getLogger('normal');
logger.setLevel('INFO');

// serve the files out of ./public as our main files
app.use(express.static(__dirname + '/public'));
app.use(log4js.connectLogger(logger, {level:log4js.levels.INFO}));

app.get('/log/:id', function(req, res) {
  var logsPath = '/usr/local/go/src/github.com/hyperledger/fabric/logs/';
  var logfileSize = fs.statSync(logsPath + req.params.id + '.log').size;

  var input = fs.createReadStream(logsPath + req.params.id + '.log', {encoding: 'utf8', start:logfileSize-10000, end:logfileSize});

  input.on('data', function (chunk) {
    res.write(chunk);
  });

  input.on('end', function () {
    res.end("");
    logger.info('log file ' + req.params.id + '.log is visited.');
  });

});

// start server on the specified port and binding host
app.listen(8080, '0.0.0.0', function() {
  // print a message when the server starts listening
  logger.info("server starting on http://localhost:8080");
});
