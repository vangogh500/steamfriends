import React from 'react'

export default class TagInput extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      contents: [],
      current: ""
    };
  }
  handleKeyUp(e) {
    //space or comma
    if(e.keyCode === 188 || e.keyCode === 32) {
      var tag = this.state.current.trim();
      tag = tag.replace(/\,$/, "");
      if(tag !== "") {
        this.setState({
          contents: this.state.contents.concat([tag]),
          current: ""
        });
      }
    }
    else if(e.keyCode === 13) {
      location.href = '#/query/?ids=' + this.state.contents.join('&ids=');
    }
  }
  handleKeyDown(e) {
    //delete
    if(e.keyCode === 8) {
      if(e.target.selectionStart === 0 && e.target.selectionEnd === 0) {
        var newArr = this.state.contents.slice();
        newArr.pop();
        this.setState({
          contents: newArr
        });
      }
    }
  }
  handleChange(e) {
    e.preventDefault();
    this.setState({current: e.target.value});
  }
  render() {
    return (
      <div className="form-control id-input">
        {
          this.state.contents.map((content, i) => {
            return (
              <span key={i} className="tag">{content}</span>
            );
          })
        }
        <input value={this.state.current} onChange={(e) => this.handleChange(e)} onKeyDown={(e) => this.handleKeyDown(e)} onKeyUp={(e) => this.handleKeyUp(e)} />
      </div>
    )
  }
}
