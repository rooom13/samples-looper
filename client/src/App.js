import React, { Component } from 'react';
// import styled from 'styled-components'

import Turntable from './components/Turntable/Turntable'


class App extends Component {

  componentDidMount() {

    fetch('/api/getMusic/175')
      .then(response => response.json())
      .then(data => {
        this.setState(
          {
            loops175: data.files,
            hasData: true
          })

      })
  }

  state = {
    loops174: ['174/amen_break.wav', '174/808.wav', '174/banjo.wav', '174/tm88.wav'],
  }

  render() {

    console.log(this.state)

    const loops = this.state.loops175
    return (
      this.state.hasData ? <Turntable disks={loops} /> : <div>Load</div>
    );
  }
}



export default App;
