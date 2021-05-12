import React, { Component } from 'react';
import styled from 'styled-components'
import KeyHandler, { KEYDOWN } from 'react-key-handler'
import Turntable from './Turntable/Turntable'
import { Button } from './Turntable/Disk/DiskInterface.js'

class Rack extends Component {

    state = {
        selectedTurntable: 0,

        isMasterPaused: true,
        isMasterMuted: false,
        leftSwitchDisk: {
            turntable: 0,
            disk: 0,
            volume: 1
        },
        rightSwitchDisk: {
            turntable: 1,
            disk: 0,
            volume: 1
        },
        newTurntableName: ""
    }

    turntables = []

    selectTurntable = (ev, turntable) => {
        ev.preventDefault()
        const turntableCount = this.props.turntables.length - 1

        if (turntable > turntableCount)
            turntable = 0
        else if (turntable < 0)
            turntable = turntableCount

        this.setState({ selectedTurntable: turntable })
    }

    toggleMasterPaused = () => {
        const fn = this.state.isMasterPaused ? "playAll" : "stopAll"
        Object.keys(this.turntables).map(i => this.turntables[i][fn]())
        this.setState({ isMasterPaused: !this.state.isMasterPaused })
    }

    toggleMasterMuted = () => {
        Object.keys(this.turntables).map(i => this.turntables[i].setMuteAll(!this.state.isMasterMuted))
        this.setState({ isMasterMuted: !this.state.isMasterMuted })
    }

    toggleMasterRestart = () => {
        Object.keys(this.turntables).map(i => this.turntables[i].restart())
    }

    setDiskSwitch = (which, turntable, disk) => {
        if (which === "left") {
            this.setState({
                leftSwitchDisk: {
                    turntable: turntable,
                    disk: disk,
                    volume: 1
                }
            })
        } else if (which === "right") {
            this.setState({
                rightSwitchDisk: {
                    turntable: turntable,
                    disk: disk,
                    volume: 1
                }
            })
        }
    }

    handleSwitchVolumeChange = (e) => {
        const volume = e.target.value

        const leftSwitchDiskVolume = 1 - volume
        const rightSwitchDiskVolume = volume

        this.turntables[this.state.leftSwitchDisk.turntable].disks[this.state.leftSwitchDisk.disk].handleVolumeChange({ target: { value: leftSwitchDiskVolume } })
        this.turntables[this.state.rightSwitchDisk.turntable].disks[this.state.rightSwitchDisk.disk].handleVolumeChange(e)

        this.setState({
            leftSwitchDisk: { ...this.state.leftSwitchDisk, volume: leftSwitchDiskVolume },
            rightSwitchDisk: { ...this.state.rightSwitchDisk, volume: rightSwitchDiskVolume }
        })
    }

    handleNewTurnTableNameChange = (e) => {
        const newTurntableName = e.target.value
        this.setState({ newTurntableName })
    }

    onAddTurntableClicked = () => {
        this.props.addTurntable(this.state.newTurntableName)
        this.setState({ newTurntableName: "" })
    }

    render() {

        const { selectedTurntable, isMasterPaused, isMasterMuted,
            newTurntableName
        } = this.state
        const { turntables, title } = this.props

        return (
            <div>
                <h1>{title}</h1>
                <Button onClick={this.toggleMasterPaused} isActive={isMasterPaused} children={'P'} />
                <Button onClick={this.toggleMasterMuted} isActive={isMasterMuted} children={'M'} />
                <Button onClick={this.toggleMasterRestart} children={'R'} />
                <TurntablesWrapper>
                    <KeyHandler
                        keyEventName={KEYDOWN}
                        code={('ArrowRight').toString()}
                        onKeyHandle={(ev) => this.selectTurntable(ev, selectedTurntable + 1)}
                    />
                    <KeyHandler
                        keyEventName={KEYDOWN}
                        code={('ArrowLeft').toString()}
                        onKeyHandle={(ev) => this.selectTurntable(ev, selectedTurntable - 1)}
                    />
                    {turntables && turntables.map((turntable, i) => <Turntable
                        onRef={ref => this.turntables[i] = ref}
                        key={i}
                        turntableIndex={i}
                        isSelected={i === selectedTurntable}
                        setDiskSwitch={this.setDiskSwitch}
                        name={turntable.name}
                        disks={turntable.disks}
                        addDisk={(newDiskName, newDiskSrc) => this.props.addDiskToTurntable(i, newDiskName, newDiskSrc)}
                    />)}
                    <div>
                        <input placeholder="new turntable name" value={newTurntableName} onChange={this.handleNewTurnTableNameChange} />
                        <button disabled={!newTurntableName} onClick={this.onAddTurntableClicked}>+</button>
                    </div>
                </TurntablesWrapper>
                <SwitchWrapper>
                    <SwithBox>
                        <h3>Switch</h3>
                        <Row>
                            <Column>
                                <ul>
                                    <li>turntable: {this.state.leftSwitchDisk.turntable}</li>
                                    <li>disk: {this.state.leftSwitchDisk.disk}</li>
                                </ul>
                            </Column>
                            <Column>
                                {(this.state.leftSwitchDisk.volume * 100).toFixed()} %
                            </Column>
                            <Column>
                                <input type="range" min="0" max="1" step="0.01" value={this.state.rightSwitchDisk.volume} onChange={this.handleSwitchVolumeChange} />
                            </Column>
                            <Column>
                                {(this.state.rightSwitchDisk.volume * 100).toFixed()} %
                            </Column>
                            <Column>
                                <ul>
                                    <li>turntable: {this.state.rightSwitchDisk.turntable}</li>
                                    <li>disk: {this.state.rightSwitchDisk.disk}</li>
                                </ul>
                            </Column>
                        </Row>
                    </SwithBox>
                </SwitchWrapper>
            </div>
        )
    }
}

const Column = styled.div`
    display: flex;
    flex-direction: column;
    margin: 0.5rem;
`
const Row = styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;
`

const SwithBox = styled.div`
    padding: 1rem;
    background-color: #afafaf;
    text-align: center;
`
const SwitchWrapper = styled.div`
    background-color: grey;
    justify-content: center;
    display: flex;
    padding: 1rem;
`

const TurntablesWrapper = styled.div`
    display: flex;
    flex-direction: row;
`

export default Rack;