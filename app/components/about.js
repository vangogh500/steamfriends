import React from 'react';

export default class About extends React.Component {
  render() {
    return (
      <div className="container">
        <div className="jumbotron indigo">
          <h1>How It Works</h1>
          <p>Steam Friends is a web app that will help you and your friends find common steam games.</p>
          <p>1. First you will need the unique ids that steam has provided you and your friends. They can be obtained by the following steps:</p>
          <img src="./img/example1.png" className="exampleImg" />
          <img src="./img/example2.png" className="exampleImg" />
          <p className="instruction">2. Finally input these ids in the main search bar and click enter.</p>
          <img src="./img/example3.png" className="exampleImg" />
        </div>
      </div>
    )
  }
}
