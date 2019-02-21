import React, { Component, Fragment } from 'react';
// import styled from 'styled-components'
import Disk from './components/Disk/Disk'
import KeyHandler, { KEYPRESS } from 'react-key-handler'

class App extends Component {

  state = {
    loops: ['loop1', 'loop2', 'loop3'],
    loopsState: [],
    selectedDisk: 0
  }
  _isComponentMounted = false
  componentDidMount() {
    console.log(this.state.loops)
    const initialLoopsState = this.state.loops.map((loop) => { return { isPaused: false, isMuted: false, isLoop: false } })
    this.setState({
      loopsState: initialLoopsState
    })
    this._isComponentMounted = true

  }

  selectDisk = (ev, disk) => {
    ev.preventDefault()
    this.setState({ selectedDisk: disk })
  }



  togglePaused = () => {
    const loopsState = this.state.loopsState
    const selectedDisk = this.state.selectedDisk
    this.setState({
      loopsState: {
        ...loopsState,
        [selectedDisk]:{
          ...loopsState[selectedDisk],
          isPaused: !loopsState[selectedDisk].isPaused
        }
      }
    })
  }
  toggleLoop = () => {
    const loopsState = this.state.loopsState
    const selectedDisk = this.state.selectedDisk
    this.setState({
      loopsState: {
        ...loopsState,
        [selectedDisk]:{
          ...loopsState[selectedDisk],
          isLoop: !loopsState[selectedDisk].isLoop
        }
      }
    })
  }
  toggleMuted = () => {
    const loopsState = this.state.loopsState
    const selectedDisk = this.state.selectedDisk
    this.setState({
      loopsState: {
        ...loopsState,
        [selectedDisk]:{
          ...loopsState[selectedDisk],
          isMuted: !loopsState[selectedDisk].isMuted
        }
      }
    })
  }


  render() {

    let diskCount = 0
    const { loopsState,selectedDisk } = this.state
    return (

      this._isComponentMounted && <Fragment>
        <KeyHandler
          keyEventName={KEYPRESS}
          keyValue={'p'}
          onKeyHandle={this.togglePaused}
        />
         <KeyHandler
          keyEventName={KEYPRESS}
          keyValue={'m'}
          onKeyHandle={this.toggleMuted}
        />
         <KeyHandler
          keyEventName={KEYPRESS}
          keyValue={'l'}
          onKeyHandle={this.toggleLoop}
        />
        {this.state.loops.map(loop => {
          const diskIndex = diskCount
          diskCount++
          return (<Fragment key={loop}>
            <KeyHandler
              keyEventName={KEYPRESS}
              keyValue={(diskIndex + 1).toString()}
              onKeyHandle={(ev) => this.selectDisk(ev, diskIndex)}
            />

            <Disk
              isPaused={loopsState[diskIndex].isPaused}
              isMuted={loopsState[diskIndex].isMuted}
              isLoop={loopsState[diskIndex].isLoop}
              index={diskIndex}
              isSelected={selectedDisk === diskIndex} >{loop}</Disk>
          </Fragment>)
        }


        )}


      </Fragment>
    );
  }
}



export default App;
