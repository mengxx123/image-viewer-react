import React from 'react';
import logo from './logo.svg';
import './App.css';

class App extends React.Component {

  state = {
    scale: 1,
    imgWidth: 1280,
    imgHeight: 720,
    left: 100,
    top: 100,
    touchs: [
      // {
      //   x: 0,
      //   y: 0
      // },
      // {
      //   x: 100,
      //   y: 100
      // }
    ],
    debug: {}
  }

  componentWillMount() {
    var lastTouchEnd = 0;
    document.addEventListener('touchstart', function(event) {
      if (event.touches.length > 1) { 
        event.preventDefault(); 
      } 
    });

    document.addEventListener('touchend', function(event) { 
      var now = (new Date()).getTime(); if (now - lastTouchEnd <= 300) {
      event.preventDefault(); 
      } lastTouchEnd = now;
    }, false); 

    // 阻止双指放大 
    document.addEventListener('gesturestart', function(event) { 
      event.preventDefault();
    });

    document.body.addEventListener('touchmove', function (e) {
      e.preventDefault(); //阻止默认的处理方式(阻止下拉滑动的效果)
    }, {passive: false});
  }

  componentDidMount() {
    const { imgWidth, imgHeight, left, top } = this.state
    let scale = 0.5
    let originWidth = 1280
    let originHeight = 720

    // let initScale = 
    let fullScale = (window.innerWidth - 32 * 2) / originWidth
    let initScale = fullScale
    if (initScale > 1) {
      initScale = 1
    }

    let width = originWidth * initScale
    let height = originHeight * initScale

    this.setState({
      scale: initScale,
      imgWidth: width,
      imgHeight: height,
      left: (window.innerWidth - width) / 2,
      top: (window.innerHeight - height) / 2
    })
  }

  render() {
    const { imgWidth, imgHeight, left, top, touchs, scale, debug } = this.state
    let _this = this
    let originWidth = 1280
    let originHeight = 720

    function __down(pt) {
      _this.isDown = true
      _this.origin = {
        imgWidth,
        imgHeight,
        left,
        top,
      }
      _this.downPt = {
        x: pt.x,
        y: pt.y,
      }
      _this.downImgX = (pt.x - left) / imgWidth
      _this.downImgY = (pt.y - top) / imgHeight
      _this.downScale = scale
    }
    function _down(e) {
      let pt = {
        x: e.pageX,
        y: e.pageY,
      }
      __down(pt)
      _this.setState({
        touchs: [
          pt,
        ]
      })
    }
    function _down2(e, e2) {
      // _this.origin = {
      //   imgWidth,
      //   imgHeight,
      //   left,
      //   top,
      // }
      let center = {
        x: (e.pageX + e2.pageX) / 2,
        y: (e.pageY + e2.pageY) / 2,
      }
      _this.downDistance = Math.sqrt(Math.pow(e.pageX - e2.pageX, 2) + Math.pow(e.pageY - e2.pageY, 2))
      // _this.downPt = {
      //   x: e.pageX,
      //   y: e.pageY,
      // }
      // _this.downPt2 = {
      //   x: e2.pageX,
      //   y: e2.pageY,
      // }
      __down(center)
      _this.setState({
        debug: {
          downDistance: _this.downDistance
        },
        touchs: [
          {
            x: e.pageX,
            y: e.pageY,
          },
          {
            x: e2.pageX,
            y: e2.pageY,
          },
        ]
      })
      // _this.isDown = true
    }

    function __move(pt, newScale = scale) {
      console.log('__move', pt)
      let offsetX = pt.x - _this.downPt.x
      let offsetY = pt.y - _this.downPt.y

      let imgX = (pt.x - left) / imgWidth
      let imgY = (pt.y - top) / imgHeight
      let width = originWidth * newScale
      let height = originHeight * newScale

      console.log('width', width)
      _this.setState({
        imgWidth: width,
        imgHeight: height,
        left: pt.x - width * _this.downImgX,
        top: pt.y - height * _this.downImgY,
        // left: _this.origin.left + offsetX,
        // top: _this.origin.top + offsetY,
      })




      
      // console.log(imgX, imgY)
      // let newScale = scale + 0.2 * unit
      // let width = originWidth * newScale
      // let height = originHeight * newScale
      // _this.setState({
      //   scale: newScale,
      //   imgWidth: width,
      //   imgHeight: height,
      //   left: e.pageX - width * imgX,
      //   top: e.pageY - height * imgY,
      // })

      
    }
    function _move(e) {
      console.log('move')
      if (!_this.isDown) {
        return
      }
      __move({
        x: e.pageX,
        y: e.pageY
      })
      _this.setState({
        touchs: [
          {
            x: e.pageX,
            y: e.pageY,
          }
        ]
      })
    }
    function _move2(e, e2) {
      console.log('move')
      if (!_this.isDown) {
        return
      }
      console.log('123')
      let offsetX = e.pageX - _this.downPt.x
      let offsetY = e.pageY - _this.downPt.y

      let center = {
        x: (e.pageX + e2.pageX) / 2,
        y: (e.pageY + e2.pageY) / 2,
      }
      _this.distance = Math.sqrt(Math.pow(e.pageX - e2.pageX, 2) + Math.pow(e.pageY - e2.pageY, 2))
      let newScale = _this.downScale * _this.distance / _this.downDistance

      _this.setState({
        scale: newScale,
        debug: {
          newScale: _this.downScale * _this.distance / _this.downDistance
        },
        // left: _this.origin.left + offsetX,
        // top: _this.origin.top + offsetY,
        touchs: [
          {
            x: e.pageX,
            y: e.pageY,
          },
          {
            x: center.x,
            y: center.y,
          },
          {
            x: e2.pageX,
            y: e2.pageY,
          }
        ]
      })
      __move(center, newScale)
    }
    function _up(e) {
      _this.isDown = false
      _this.setState({
        touchs: []
      })
    }

    function onMouseDown(e) {
      _down(e)
    }
    function onMouseMove(e) {
      _move(e)
    }
    function onMouseUp(e) {
      _up(e)
    }
    function onWheel(e) {
      console.log('滚轮', e.nativeEvent.deltaY)
      let unit
      if (e.nativeEvent.deltaY <= 0) {
        console.log('up')
        unit = 1
      } else {
        console.log('down')
        unit = -1
      }
      let imgX = (e.pageX - left) / imgWidth
      let imgY = (e.pageY - top) / imgHeight
      console.log(imgX, imgY)
      let newScale = scale + 0.2 * unit
      let width = originWidth * newScale
      let height = originHeight * newScale
      _this.setState({
        scale: newScale,
        imgWidth: width,
        imgHeight: height,
        left: e.pageX - width * imgX,
        top: e.pageY - height * imgY,
      })
    }

    function onTouchStart(e) {
      if (e.targetTouches.length === 1) {
        _down(e.targetTouches[0])
      } else {
        _down2(e.targetTouches[0], e.targetTouches[1])
      }
    }
    function onTouchMove(e) {
      if (e.targetTouches.length === 1) {
        _move(e.targetTouches[0])
      } else {
        _move2(e.targetTouches[0], e.targetTouches[1])
      }
    }
    function onTouchEnd(e) {
      if (e.targetTouches.length === 1) {
        _up(e.targetTouches[0])
      } else {
        _up(e.targetTouches[0], e.targetTouches[1])
      }
    }

    const TouchItem = (item, index) => {
      let size = 40
      return <div className="touch" key={index} style={{width: size, height: size, left: item.x - size / 2, top: item.y - size / 2, backgroundColor: '#f00'}}>
      </div>
    }

    let debugText = JSON.stringify(debug)

    return <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <div className="imgBox">
          <img className="imgMain" src="/static/test.jpg" style={{ width: imgWidth, height: imgHeight, left, top }} />
          <div>
            {touchs.map(TouchItem)}
          </div>
        </div>
        <div className="all"
          onMouseDown={onMouseDown}
          onMouseMove={onMouseMove}
          onMouseUp={onMouseUp}
          onTouchStart={onTouchStart}
          onTouchMove={onTouchMove}
          onTouchEnd={onTouchEnd}
          onWheel={onWheel}
        ></div>
        <div className="debug">{debugText}</div>
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
