import React, { Component, Fragment } from 'react';

import { ThemeProvider } from 'styled-components';
import { lightTheme, darkTheme } from './components/Themes';
import { GlobalStyles } from './components/globalStyles';

import demoProjects from './demoProjects.json'
import Rack from './components/Rack'
import { TypicalButton } from './components/Buttons'


const DEFAULT_THEME = "dark"
const DEFAULT_PROJECT = "175"

class App extends Component {

  state = {
    project: {},
    projectStr: "",
    isJsonEditShown: false,
    selectedProject: DEFAULT_PROJECT,
    theme: DEFAULT_THEME
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

    const theme = window.localStorage["theme"] || DEFAULT_THEME
    const project = turntablesLocalStorage ? { turntables: turntablesLocalStorage } : demoProjects[this.state.selectedProject]

    // const originSrc = "https://www.dropbox.com/s/0zh9980kcvu0kva/Mi%20gran%20noche%20%28NUEVOEXITO.ORG%29.mp3?dl=0"
    this.setProject(project)
    this.setState({ theme })
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

  toggleTheme = () => {
    this.setState({ theme: this.state.theme === "dark" ? "light" : "dark" })
  }

  handleSelectedProjectChange = (e) => {
    const value = e.target.value
    this.setState({ selectedProject: value })
    this.setProject(demoProjects[value])
  }

  render() {
    const { project, projectStr,
      isJsonEditShown, selectedProject, theme
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
        <ThemeProvider theme={theme === "dark" ? darkTheme : lightTheme}>
          <GlobalStyles />

          <TypicalButton onClick={this.toggleJsonEdit} style={{ fontFamily: "monospace", fontWeight: "bolder" }}>{"</>"}</TypicalButton>
          {isJsonEditShown &&
            <Fragment>
              <textarea
                style={{ width: "800px", height: "400px" }}
                value={projectStr}
                onChange={this.handleturntablesChange} />
              <TypicalButton disabled={!isInputValid} onClick={this.onApplyClicked}>Apply</TypicalButton>
            </Fragment>}
          <select
            name="selectedProject"
            onChange={this.handleSelectedProjectChange}
            value={selectedProject}
          >{Object.keys(demoProjects).map(projectName =>
            <option key={projectName} value={projectName}>{projectName}</option>
          )}
          </select>
          <TypicalButton onClick={this.toggleTheme} style={{ float: "right" }}>{theme === "dark" ? "🌞" : "🌙"}</TypicalButton>
          {project.turntables && <Rack
            title={project.name}
            turntables={project.turntables}
            addDisk={this.addDisk}
            removeDisk={this.removeDisk}
            addTurntable={this.addTurntable}
            removeTurntable={this.removeTurntable}
          />}
        </ThemeProvider>
      </Fragment>
    )
  }
}

export default App;
