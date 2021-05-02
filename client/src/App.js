import React, { Component } from 'react';

// import styled from 'styled-components'

import Rack from './components/Rack'


class App extends Component {

  state = {}




  componentDidMount() {

    const mainFolder = new URLSearchParams(window.location.search).get("folder");

    const loops175URL = '/api/loops/inFolders/' + (mainFolder || 175)
    // const loops0URL = '/api/loops/inFolders/0'

    fetch(loops175URL)
      .then(response => response.json())
      .then(data => {
        this.setState({
          folder: mainFolder,
          folders: data.folders,
        })
      })
  }


  render() {
    const { folder, folders } = this.state


    if (!folders) return <div>Loading</div>

    return (
      <Rack
        title={folder}
        turntables={folders}
      />
    )
  }
}



export default App;
