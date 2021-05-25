import React, { Component, Fragment } from 'react';

import demoProjects from './demoProjects.json'
import Rack from './components/Rack'


class App extends Component {

  state = {
    project: {},
    projectStr: "",
    isJsonEditShown: false,
    selectedProject: "175"
  }

  getSavedMusic = () => {
    try {
      return JSON.parse(window.localStorage["project"])
    } catch {
      return undefined
    }
  }

  componentDidMount() {
    const turntablesLocalStorage = null // this.getSavedMusic()
    const project = turntablesLocalStorage ? { turntables: turntablesLocalStorage } : demoProjects[this.state.selectedProject]

    // const originSrc = "https://www.dropbox.com/s/0zh9980kcvu0kva/Mi%20gran%20noche%20%28NUEVOEXITO.ORG%29.mp3?dl=0"
    this.setProject(project)
  }

  setTurntables = (turntables) => {
    let project = this.state.project
    project.turntables = turntables
    this.setProject(project)
  }

  setProject = (project) => {
    this.setState({
      project,
      projectStr: JSON.stringify(project, null, "\t")
    })
    window.localStorage["project"] = JSON.stringify(project)
  }

  handleturntablesChange = (e) => {
    const projectStr = e.target.value
    this.setState({ projectStr: projectStr })
  }

  onApplyClicked = () => {
    const project = JSON.parse(this.state.projectStr)
    this.setProject(project)
  }

  addDisk = (turntableIndex, newDiskName, newDiskSrc) => {
    let turntables = this.state.project.turntables
    turntables[turntableIndex].disks.push({ name: newDiskName, src: newDiskSrc.replace("www.dropbox.com", "dl.dropboxusercontent.com") })
    this.setTurntables(turntables)
  }

  removeDisk = (turntableIndex, diskIndex) => {
    let turntables = this.state.project.turntables
    turntables[turntableIndex].disks.splice(diskIndex, 1)
    this.setTurntables(turntables)
  }

  addTurntable = (newTurntableName) => {
    let turntables = this.state.project.turntables
    turntables.push({ name: newTurntableName, disks: [] })
    this.setTurntables(turntables)
  }

  removeTurntable = (turntableIndex) => {
    let turntables = this.state.project.turntables
    turntables.splice(turntableIndex, 1)
    this.setTurntables(turntables)
  }

  toggleJsonEdit = () => {
    this.setState({ isJsonEditShown: !this.state.isJsonEditShown })
  }

  handleSelectedProjectChange = (e) => {
    const value = e.target.value
    this.setState({ selectedProject: value })
    this.setProject(demoProjects[value])
  }

  render() {
    const { project, projectStr,
      isJsonEditShown, selectedProject
    } = this.state
    let isInputValid = true
    try {
      JSON.parse(projectStr)
    } catch {
      isInputValid = false
    }

    if (!project) return <div>Loading</div>

    return (
      <Fragment>
        <button onClick={this.toggleJsonEdit} style={{ fontFamily: "monospace", fontWeight: "bolder" }}>{"</>"}</button>
        {isJsonEditShown &&
          <Fragment>
            <textarea
              style={{ width: "800px", height: "400px" }}
              value={projectStr}
              onChange={this.handleturntablesChange} />
            <button disabled={!isInputValid} onClick={this.onApplyClicked}>Apply</button>
          </Fragment>}
        <select
          name="selectedProject"
          onChange={this.handleSelectedProjectChange}
          value={selectedProject}
        >{Object.keys(demoProjects).map(projectName =>
          <option key={projectName} value={projectName}>{projectName}</option>
        )}
        </select>
        {project.turntables && <Rack
          title={project.name}
          turntables={project.turntables}
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
