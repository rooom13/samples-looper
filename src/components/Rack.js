import React, { Component } from 'react';
import styled from 'styled-components'
import KeyHandler, { KEYDOWN } from 'react-key-handler'
import Turntable from './Turntable/Turntable'
import { Button } from './Turntable/Disk/DiskInterface.js'

class Rack extends Component {

    constructor(props) {
        super(props)

        this.state = {
            selectedTurntable: 0,

            isMasterPaused: true,
            isMasterMuted: false,
            leftSwitchDisk: {
                turntable: 0,
                disk: 0,
                volume: 1,
                name: this.props.turntables[0].disks[0].name
            },
            rightSwitchDisk: {
                turntable: 1,
                disk: 0,
                volume: 1,
                name: this.props.turntables[1].disks[0].name
            },
            newTurntableName: ""
        }

        this.turntables = []
    }

    componentWillUnmount() {
        delete this.turntables
    }

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

    /**
     * @param {str: [left | right]} whichDisk 
     */
    setDiskSwitch = (whichDisk, turntable, disk) => {
        const { turntables } = this.props

        this.setState({
            [whichDisk + "SwitchDisk"]: {
                turntable: turntable,
                disk: disk,
                volume: 1,
                name: turntables[turntable].disks[disk].name
            }
        })
    }

    handleSwitchVolumeChange = (e) => {

        const { rightSwitchDisk, leftSwitchDisk } = this.state

        const volume = e.target.value

        const leftSwitchDiskVolume = 1 - volume
        const rightSwitchDiskVolume = volume

        this.turntables[leftSwitchDisk.turntable].disks[leftSwitchDisk.disk].handleVolumeChange({ target: { value: leftSwitchDiskVolume } })
        this.turntables[rightSwitchDisk.turntable].disks[rightSwitchDisk.disk].handleVolumeChange(e)

        this.setState({
            leftSwitchDisk: { ...leftSwitchDisk, volume: leftSwitchDiskVolume },
            rightSwitchDisk: { ...rightSwitchDisk, volume: rightSwitchDiskVolume }
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

    removeTurntable = (turntableIndex) => {
        this.turntables.splice(turntableIndex, 1)
        this.props.removeTurntable(turntableIndex)
    }

    render() {

        const { selectedTurntable, isMasterPaused, isMasterMuted,
            leftSwitchDisk, rightSwitchDisk,
            newTurntableName,
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
                    {turntables && turntables.map((turntable, i) =>
                        <Turntable
                            onRef={ref => {
                                if (ref)
                                    this.turntables[i] = ref
                                else delete this.turntables[i]
                            }}
                            key={i}
                            turntableIndex={i}
                            isSelected={i === selectedTurntable}
                            setDiskSwitch={this.setDiskSwitch}
                            name={turntable.name}
                            disks={turntable.disks}
                            addDisk={(newDiskName, newDiskSrc) => this.props.addDisk(i, newDiskName, newDiskSrc)}
                            removeTurntable={() => this.removeTurntable(i)}
                            removeDisk={(diskIndex) => this.props.removeDisk(i, diskIndex)}
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
                                    <li>Disk name: {leftSwitchDisk.name}</li>
                                    <li>turntable: {rightSwitchDisk.turntable}</li>
                                    <li>disk: {leftSwitchDisk.disk}</li>
                                </ul>
                            </Column>
                            <Column>
                                {(this.state.leftSwitchDisk.volume * 100).toFixed()} %
                            </Column>
                            <Column>
                                <input type="range" min="0" max="1" step="0.01" value={rightSwitchDisk.volume} onChange={this.handleSwitchVolumeChange} />
                            </Column>
                            <Column>
                                {(rightSwitchDisk.volume * 100).toFixed()} %
                            </Column>
                            <Column>
                                <ul>
                                    <li>Disk name: {rightSwitchDisk.name}</li>
                                    <li>turntable: {rightSwitchDisk.turntable}</li>
                                    <li>disk: {rightSwitchDisk.disk}</li>
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