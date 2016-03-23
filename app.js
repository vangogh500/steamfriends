var express = require('express');
var app = express();
var path    = require("path");

app.set('port', process.env.PORT || 8080);

app.use(express.static(__dirname + '/build'));

app.get('/', function(req, res) {
  res.sendFile('index.html');
});

require('./routes.js')(app);

if (module === require.main) {
  // [START server]
  // Start the server
  var server = app.listen(process.env.PORT || 8080, function () {
    var host = server.address().address;
    var port = server.address().port;

    console.log('App listening at http://%s:%s', host, port);
  });
  // [END server]
}

module.exports = app;
