import React from 'react';
import { compareOwnedBy } from '../util.js';
import { OverlayTrigger, Tooltip } from 'react-bootstrap';
import async from 'async';

export default class Query extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loaded: false,
      error: false,
      alert: 'Loading User Information...',
      you: {},
      friends: [],
      games: []
    };
  }
  componentDidMount() {
    $.ajax({
      url: '/api/user/?id=' + this.props.location.query.ids.join('&id='),
      type: 'GET',
      success: (userInfo) => {
        this.setState({alert: 'Aquiring Game Libraries...', you: userInfo.splice(0,1)[0], friends: userInfo});
        $.ajax({
          url: '/api/games/?id=' + this.props.location.query.ids.join('&id='),
          type: 'GET',
          success: (gameInfo) => {
            console.log(gameInfo);
            this.setState({loaded: true, games: this.processGameData(gameInfo).sort(compareOwnedBy)});
            async.eachSeries(this.processGameData(gameInfo), (game, cb) => {
              $.ajax({
                url: '/api/gameInfo/?id=' + game.appid,
                type: 'GET',
                success: (gd) => {
                  if(gd) {
                    for(var i=0; i<this.state.games.length; i++) {
                      if(gd.steam_appid === this.state.games[i].appid) {
                        if(gd.is_free) {
                          this.state.games[i].price = 'Free';
                        }
                        else if(gd.price_overview) {
                          this.state.games[i].price = gd.price_overview.final / Math.pow(10,2);
                        }
                        if(gd.platforms) {
                          this.state.games[i].platforms = gd.platforms;
                        }
                        this.state.games[i].multiplayer = false;
                        if(gd.categories) {
                          for(var j=0; j<gd.categories.length; j++) {
                            if(["Multi-player","Massively Multiplayer", "Co-op", "MMO"].indexOf(gd.categories[j].description) != -1) {
                              this.state.games[i].multiplayer = true;
                              break;
                            }
                          }
                        }
                        this.state.games[i].fullyLoaded = true;
                        this.setState({games: this.state.games});
                        console.log(this.state.games[i]);
                        break;
                      }
                    }
                  }
                  cb();
                },
                error: (gd) => {
                  cb();
                }
              });
            });
          },
          error: (gameInfo) => {
            this.setState({alert: 'There was an error contacting the server!', error: true});
          }
        });
      },
      error: (userInfo) => {
        this.setState({alert: 'There was an error contacting the server!', error: true});
      }
    });
  }
  processGameData(gameData) {
    var gameList = [];

    var getUserName = (steamid) => {
      if(this.state.you.steamid === steamid) {
        return this.state.you.personaname;
      }
      for(var i=0; i<this.state.friends.length; i++) {
        if(this.state.friends[i].steamid == steamid) {
          return this.state.friends[i].personaname;
        }
      }
    }

    gameData.forEach((userGameList) => {
      userGameList.games.forEach((game) => {
        if(gameList.length == 0) {
          game.ownedBy = [userGameList.id];
          game.ownerNames = [getUserName(userGameList.id)]
          gameList.push(game);
        }
        else {
          for(var i=0; i<gameList.length; i++) {
            if(gameList[i].appid === game.appid) {
              gameList[i].ownedBy.push(userGameList.id);
              gameList[i].ownerNames.push(getUserName(userGameList.id));
              break;
            }
            else if(gameList[i].appid > game.appid) {
              game.ownedBy = [userGameList.id];
              game.ownerNames = [getUserName(userGameList.id)];
              gameList.splice(i,0,game);
              break;
            }
            else if(i === gameList.length-1) {
              game.ownedBy = [userGameList.id];
              game.ownerNames = [getUserName(userGameList.id)];
              gameList.push(game);
              break;
            }
          }
        }
      });
    });
    return gameList;
  }
  handleUserDisplay() {
    if(this.state.loaded) {
      return (
        <div className="userContainer">
          <div className="userContainerHeader">
            <h3>Users</h3>
          </div>
          <div className="userContainerContent">
            <div className="row">
              <div className="col-md-4">
                <h4 className="youTitle">You</h4>
                <div className="you">
                  <img src={this.state.you.avatarfull} className="avatar"/>
                  <h4>{this.state.you.personaname}</h4>
                </div>
              </div>
              <div className="col-md-8 friends">
                <h4 className="friendTitle">Your Friends</h4>
                {this.state.friends.map((user, i) => {
                  return(
                    <div className="friendContainer" key={user.steamid} onClick={(e) => this.handleSwitchUser(e, user, i)}>
                      <img src={user.avatarfull} className="avatar"/>
                      <h5>{user.personaname}</h5>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      );
    }
  }
  handleGameDisplay() {
    if(this.state.loaded) {
      return (
        <div className="gameContainer">
          <div className="gameContainerHeader">
            <h3>Games</h3>
          </div>
          <div className="gameContainerContent">
            <div className="row gameNav">
              <div className="col-md-2">
              </div>
              <div className="col-md-3">
                <a>Name</a>
              </div>
              <div className="col-md-1">
                <a>Owned</a>
              </div>
              <div className="col-md-2">
                <a>Owned By</a>
              </div>
              <div className="col-md-1">
                <p>Price</p>
              </div>
              <div className="col-md-1">
                <p>Multiplayer</p>
              </div>
              <div className="col-md-1">
                <p>Platforms</p>
              </div>
            </div>
            <hr />
            {this.state.games.map((game) => {
              var tooltip = (
                <Tooltip id={game.steamid + "tooltip"}>{game.ownerNames.join(', ')}</Tooltip>
              );
              return (
                <div key={game.appid} className="row game">
                  <div className="col-md-2 gameLogo">
                    <a target="_blank" href={'http://store.steampowered.com/app/' + game.appid}><img src={'http://media.steampowered.com/steamcommunity/public/images/apps/' + game.appid + '/' + game.img_logo_url +'.jpg'} /></a>
                  </div>
                  <div className="col-md-3 gameName">
                    <p>{game.name}</p>
                  </div>
                  <div className="col-md-1 owned">
                    {this.renderOwnedByYou(game)}
                  </div>
                  <div className="col-md-2">
                    <OverlayTrigger placement="left" overlay={tooltip}>
                      <p>{game.ownedBy.length}</p>
                    </OverlayTrigger>
                  </div>
                  <div className="col-md-1">
                    {this.renderPrice(game)}
                  </div>
                  <div className="col-md-1">
                    {this.renderMultiplayerAccess(game)}
                  </div>
                  <div className="col-md-2">
                    {this.renderPlatforms(game)}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      );
    }
  }

  handleSwitchUser(e, user, i) {
    var friends = this.state.friends.slice();
    var you = friends.splice(i,1);
    friends.push(this.state.you);
    this.setState({friends: friends, you: you[0]});
  }
  handleLoading() {
    if(this.state.loaded) {
      return;
    }
    else {
      if(this.state.error) {
        return (
          <div className="loaderContainer">
            <i className="fa fa-exclamation-triangle alert"></i>
            <h4 align="center">{this.state.alert}</h4>
          </div>
        )
      }
      else {
        return (
          <div className="loaderContainer">
            <div className="loader"></div>
            <h4 align="center">{this.state.alert}</h4>
          </div>
        )
      }
    }
  }
  renderPrice(game) {
    if(!game.fullyLoaded) {
      return (
        <p><i className="fa fa-spinner"></i></p>
      );
    }
    else {
      return (
        <p>{game.price}</p>
      );
    }
  }

  renderOwnedByYou(game) {
    if(game.ownedBy.indexOf(this.state.you.steamid) != -1) {
      return (
        <p><i className="fa fa-star"></i></p>
      );
    }
  }

  renderMultiplayerAccess(game) {
    if(game.multiplayer) {
      return (
        <p><i className="fa fa-users"></i></p>
      );
    }
  }

  renderPlatforms(game) {
    function renderWindows(game) {
      if(game.platforms.windows) {
        return (
          <i className="fa fa-windows platformLogo"></i>
        );
      }
    }
    function renderMac(game) {
      if(game.platforms.mac) {
        return (
          <i className="fa fa-apple platformLogo"></i>
        );
      }
    }
    function renderLinux(game) {
      if(game.platforms.linux) {
        return (
          <i className="fa fa-linux platformLogo"></i>
        );
      }
    }

    if(game.platforms) {
      return (
        <p>
          {renderWindows(game)}
          {renderMac(game)}
          {renderLinux(game)}
        </p>
      );
    }
  }

  render() {
    return (
      <div className={"container"}>
        {this.handleUserDisplay()}
        {this.handleGameDisplay()}
        {this.handleLoading()}
      </div>
    )
  }
}
