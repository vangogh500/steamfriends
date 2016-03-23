var http = require('http');
var key = require('../credentials.js').steam.key;

function makeRequest(opts, callback) {
  http.request(opts, function(res) {
    var data = '';
    res.on('data', function(chunk) {
      data += chunk;
    });
    res.on('error', function(e) {
      console.log(error);
    });
    res.on('end', function() {
      console.log(opts.path + " : " + res.statusCode);
      callback(JSON.parse(data));
    });
  }).end();
}

exports.getPlayerInfo = function(steamID, cb) {
  var opts = {
    hostname: 'api.steampowered.com',
    method: 'GET',
    path: '/ISteamUser/GetPlayerSummaries/v0002/?key=' + key + "&steamids=" + steamID
  };
  makeRequest(opts, function(data) {
    cb(data.response.players);
  });
};

exports.getOwnedGames = function(steamID, cb) {
  var opts = {
    hostname: 'api.steampowered.com',
    method: 'GET',
    path: '/IPlayerService/GetOwnedGames/v0001/?key=' + key + "&steamid=" + steamID + "&include_appinfo=1"
  };
  makeRequest(opts, function(data) {
    cb(data.response);
  });
};

exports.getGameInfo = function(appID, cb) {
  var opts = {
    hostname: 'store.steampowered.com',
    method: 'GET',
    path: '/api/appdetails?appids=' + appID
  };
  makeRequest(opts, function(data) {
    cb(data[appID].data);
  });
};
