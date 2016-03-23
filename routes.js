var steam = require('./lib/steam.js');
var async = require('async');

//helper functions
function getOwnedGamesInfo(req,cb) {
  if(typeof req.query.id === 'string') {
    var arr = [];
    steam.getOwnedGames(req.query.id, function(data) {
      data.id = req.query.id;
      arr.push(data);
      cb(arr);
    });
  }
  else {
    var arr = [];
    async.each(req.query.id, function(id, cb) {
      steam.getOwnedGames(id, function(data) {
        data.id = id;
        arr.push(data);
        cb();
      });
    }, function(err) {
      if(err) console.log(err);
      else cb(arr);
    });
  }
}

function getGamesInfo(req,cb) {
  if(typeof req.query.id === 'string') {
    var arr = [];
    steam.getGameInfo(req.query.id, function(data) {
      arr.push(data);
      cb(arr);
    });
  }
  else {
    var arr = [];
    async.each(req.query.id, function(id, cb) {
      steam.getGameInfo(id, function(data) {
        arr.push(data);
        cb();
      });
    }, function(err) {
      if(err) console.log(err);
      else cb(arr);
    });
  }
}

//routing
module.exports = function(app) {
  app.get('/api/user', function(req,res) {
    steam.getPlayerInfo(req.query.id, function(data) {
      res.json(data);
    });
  });
  app.get('/api/games', function(req,res) {
    getOwnedGamesInfo(req, function(data) {
      res.json(data)
    });
  });
  app.get('/api/gameInfo', function(req,res) {
    steam.getGameInfo(req.query.id, function(data) {
      res.json(data);
    });
  });
};
