import React, { Component } from 'react';
// import styled from 'styled-components'
import Turntable from './components/Turntable/Turntable'

class App extends Component {

  state = {
    loops: ['amen_break.wav', '808.wav', 'banjo.wav','tm88.wav'],
  }

  render() {
    return (
      <Turntable disks={this.state.loops} />
    );
  }
}



export default App;
