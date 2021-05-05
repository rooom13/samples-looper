import React, { Component } from 'react';

import dataS from './musicFiles.json'

import Rack from './components/Rack'


class App extends Component {

  state = {}



  componentDidMount() {

    const mainFolder = new URLSearchParams(window.location.search).get("folder") || 175;

    const path = "client/public/music/" + mainFolder + "/"
    const files = dataS
      .filter(x => x.startsWith(path))
      .map(s => s.replace(path, ""))

    const beforeData = {}

    files.forEach(f => {
      const s = f.split("/")
      const subFolder = s[0]
      beforeData[subFolder] = beforeData[subFolder] || []
      beforeData[subFolder].push(f)
    })

    const data = {
      folders: Object.keys(beforeData).map(subFolder => {
        return {
          name: subFolder,
          loops: beforeData[subFolder].map(s => mainFolder + "/" + s)
        }
      })
    }

    this.setState({
      folder: mainFolder,
      folders: data.folders,
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
