import React, { Component } from 'react';
// import styled from 'styled-components'

import Rack from './components/Rack'


class App extends Component {

  componentDidMount() {

    fetch('/api/loops/inFolders/175')
      .then(response => response.json())
      .then(data => {
        this.setState(
          {
            categories: data.folders,
            categorisCount: data.folders.lenght,
            loops175: data.folders,
            hasData: true,

          })

      })
  }

  state = {
    loops174: ['174/amen_break.wav', '174/808.wav', '174/banjo.wav', '174/tm88.wav'],
  }

  render() {

    const { hasData, categories } = this.state


    if (!hasData) return <div>Loading</div>

    return (
      <Rack turntables={categories} />
    )
  }
}



export default App;
