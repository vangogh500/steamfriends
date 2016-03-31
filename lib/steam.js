var http = require('http');
var key = require('../credentials.js').steam.key;

/*
 * Helper method which does the http requesting
 * Params: opts, callback(data, error msg)
 * error msg is null if data was reached without any issue, data is null if there was an issue fetching the data
 */
function makeRequest(opts, callback) {
  http.request(opts, function(res) {
    if (('' + res.statusCode).match(/^2\d\d$/)) {
      var data = '';
      res.on('data', function(chunk) {
        data += chunk;
      });
      res.on('error', function(e) {
        console.log(e);
      });
      res.on('end', function() {
        callback(JSON.parse(data), null);
      });
    } else if  (('' + res.statusCode).match(/^5\d\d$/)) {
      callback(null, "Information could not be located");
    }
  }).on('error', function(e) {
    callback(null, 'Error contacting Steam API');
  }).end();
}

/*
 * Function takes a steamID and retrieves information about the user associated with that id
 * Params: steamID, callback(data, error msg)
 */
exports.getPlayerInfo = function(steamID, cb) {
  var opts = {
    hostname: 'api.steampowered.com',
    method: 'GET',
    path: '/ISteamUser/GetPlayerSummaries/v0002/?key=' + key + "&steamids=" + steamID
  };
  makeRequest(opts, function(data, error) {
    if(error) {
      cb(null, error);
    }
    else {
      cb(data.response.players, error);
    }
  });
};

/*
 * Function takes a steamID and retrieves information about the user's game library
 * Params: steamID, callback(data, error msg)
 */
exports.getOwnedGames = function(steamID, cb) {
  var opts = {
    hostname: 'api.steampowered.com',
    method: 'GET',
    path: '/IPlayerService/GetOwnedGames/v0001/?key=' + key + "&steamid=" + steamID + "&include_appinfo=1"
  };
  makeRequest(opts, function(data, error) {
    if(error) {
      cb(null, error);
    }
    else {
      cb(data.response, error);
    }
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
