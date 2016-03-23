import React from 'react';
import ReactDOM from 'react-dom';
import { IndexRoute, Router, Route, browserHistory, Link } from 'react-router'
import TagInput from './components/taginput';
import Query from './components/query';
import About from './components/about';


class App extends React.Component {
  render() {
    return (
      <div>
        <nav>
          <div className="container">
            <div className="navbar-header">
              <a className="navbar-brand" href="#"><i className="fa fa-steam-square"></i> Friends</a>
            </div>
            <ul className="nav navbar-nav navbar-right">
              <li><Link to="/about">About</Link></li>
              <li><a href="https://github.com/vangogh500/steamfriends">Github</a></li>
            </ul>
          </div>
        </nav>
        {this.props.children}
      </div>
    )
  }
}

class SearchBody extends React.Component {
  render() {
    return (
      <div className="container banner-container">
        <div className="jumbotron indigo">
          <h1>Steam Friends</h1>
          <p>Find games to play together with your friends.</p>
          <TagInput />
        </div>
      </div>
    )
  }
}



ReactDOM.render(
  <Router history={browserHistory}>
    <Route path="/" component={App}>
      <IndexRoute component={SearchBody} />
      <Route path="query" component={Query} />
      <Route path="about" component={About} />
    </Route>
  </Router>,
  document.getElementById('app')
);
