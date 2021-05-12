import React, { Component } from 'react';

import dataS from './musicFiles.json'

import Rack from './components/Rack'
import { Fragment } from 'react/cjs/react.production.min';


class App extends Component {

  state = {
    turntables: [],
    turntablesStr: ""
  }

  getDefaultMusic = () => {
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

    const music = {
      title: mainFolder,
      turntables: Object.keys(beforeData).map(subFolder => {
        return {
          name: subFolder,
          disks: beforeData[subFolder].map(s => {
            return { name: s.split("/")[1].split(".")[0], src: "music/" + mainFolder + "/" + s }
          })
        }
      })
    }
    return music
  }

  getSavedMusic = () => {
    try {
      return JSON.parse(window.localStorage["turntables"])
    } catch {
      return undefined
    }
  }

  componentDidMount() {

    const turntablesLocalStorage = this.getSavedMusic()

    const data = turntablesLocalStorage ? { turntables: turntablesLocalStorage } : this.getDefaultMusic()

    // const originSrc = "https://www.dropbox.com/s/0zh9980kcvu0kva/Mi%20gran%20noche%20%28NUEVOEXITO.ORG%29.mp3?dl=0"

    this.setTurntables(data.turntables)
    this.setState({
      folder: data.title,
    })
  }

  setTurntables = (turntables) => {
    this.setState({
      turntables: turntables,
      turntablesStr: JSON.stringify(turntables, null, "\t")
    })
    window.localStorage["turntables"] = JSON.stringify(turntables)
  }

  handleturntablesChange = (e) => {
    const turntablesStr = e.target.value
    this.setState({ turntablesStr: turntablesStr })
  }

  onApplyClicked = () => {
    const turntables = JSON.parse(this.state.turntablesStr)
    this.setTurntables(turntables)
  }

  addDisk = (turntableIndex, newDiskName, newDiskSrc) => {
    let turntables = this.state.turntables
    turntables[turntableIndex].disks.push({ name: newDiskName, src: newDiskSrc.replace("www.dropbox.com", "dl.dropboxusercontent.com") })
    this.setTurntables(turntables)
  }

  removeDisk = (turntableIndex, diskIndex) => {
    let turntables = this.state.turntables
    turntables[turntableIndex].disks.splice(diskIndex, 1)
    this.setTurntables(turntables)
  }

  addTurntable = (newTurntableName) => {
    let turntables = this.state.turntables
    turntables.push({ name: newTurntableName, disks: [] })
    this.setTurntables(turntables)
  }

  removeTurntable = (turntableIndex) => {
    let turntables = this.state.turntables
    turntables.splice(turntableIndex, 1)
    this.setTurntables(turntables)
  }

  render() {
    const { folder, turntables, turntablesStr } = this.state
    let isInputValid = true
    try {
      JSON.parse(turntablesStr)
    } catch {
      isInputValid = false
    }

    if (!turntables) return <div>Loading</div>

    return (
      <Fragment>
        {/* <textarea
          style={{ width: "800px", height: "100px" }}
          value={turntablesStr}
          onChange={this.handleturntablesChange} />
        <button disabled={!isInputValid} onClick={this.onApplyClicked}>Apply</button> */}
        {turntables && <Rack
          title={folder}
          turntables={turntables}
          addDisk={this.addDisk}
          removeDisk={this.removeDisk}
          addTurntable={this.addTurntable}
          removeTurntable={this.removeTurntable}
        />}
      </Fragment>
    )
  }
}

export default App;
