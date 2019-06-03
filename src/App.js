import React from 'react';
import logo from './logo.svg';
import './App.css';

class App extends React.Component {

  state = {
    scale: 1,
    width: 1280,
    height: 720,
    left: 100,
    top: 100
  }

  componentDidMount() {
    const { width, height, left, top } = this.state
    this.setState({
      left: (window.innerWidth - width) / 2,
      top: (window.innerHeight - height) / 2
    })
  }

  render() {
    const { width, height, left, top } = this.state
    let _this = this

    function onMouseDown(e) {
      _this.origin = {
        width,
        height,
        left,
        top,
      }
      _this.downPt = {
        x: e.pageX,
        y: e.pageY,
      }
    }
    function onMouseMove() {

    }
    function onMouseUp() {

    }

    return <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <div className="imgBox">
          <img className="imgMain" src="/static/test.jpg" style={{ width, height, left, top }} />
        </div>
        <div className="all"
          onMouseDown={onMouseDown}
          onMouseDown={onMouseMove}
          onMouseDown={onMouseUp}
        ></div>
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  }
}

// function App() {


//   return (
//   );
// }

export default App
